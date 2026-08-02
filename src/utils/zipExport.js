import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Certificate from '../components/Certificate';
import { getCertificateSettings, getEffectiveTrainingDates } from './certificateSettings';

/**
 * Bulk exports participant certificates into a high-res PDF ZIP archive.
 * 
 * @param {Object} options
 * @param {Array} options.participants List of participant objects { name, salutation, instituteName, atariZone, serialNumber, trainingDates }
 * @param {string} options.zipFilename Filename for the downloaded ZIP archive
 * @param {Function} options.onProgress Progress callback function ({ current, total, participantName })
 */
export const exportCertificatesToZip = async ({
  participants = [],
  zipFilename = 'ICAR_Certificates_Backup.zip',
  onProgress
}) => {
  if (!participants || participants.length === 0) {
    alert("No participants provided for PDF ZIP export.");
    return false;
  }

  const zip = new JSZip();
  const certSettings = getCertificateSettings();

  // Create an unscaled off-screen DOM element (1020px x 720px)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1020px';
  container.style.height = '720px';
  container.style.zIndex = '-9999';
  document.body.appendChild(container);

  const root = createRoot(container);
  const total = participants.length;

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  try {
    for (let i = 0; i < total; i++) {
      const p = participants[i];
      const pName = p.name || p.certificateName || 'Participant';
      const pSalutation = p.salutation || '';
      const pInstitute = p.instituteName || p.kvkName || 'ICAR Institute';
      const pZone = p.atariZone || '';
      const pSerial = p.serialNumber || `CIWA/2026/NOGRA/${160 + i}`;
      const pDates = getEffectiveTrainingDates(pSerial, pZone, p.trainingDates);

      if (onProgress) {
        onProgress({ current: i + 1, total, participantName: pName });
      }

      // Render Certificate component unscaled into container
      await new Promise((resolve) => {
        root.render(
          React.createElement(Certificate, {
            salutation: pSalutation,
            name: pName,
            instituteName: pInstitute,
            atariZone: pZone,
            serialNumber: pSerial,
            trainingDates: pDates,
            customSettings: certSettings
          })
        );
        // Short delay to allow QR code and images to mount
        setTimeout(resolve, 220);
      });

      const certNode = container.querySelector('.certificate-container');
      if (!certNode) continue;

      // Capture canvas at 3.5x scale (High 300+ DPI output)
      const canvas = await html2canvas(certNode, {
        scale: 3.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        width: 1020,
        height: 720,
        windowWidth: 1020,
        windowHeight: 720,
        onclone: (clonedDoc) => {
          const certs = clonedDoc.querySelectorAll('.certificate-container');
          certs.forEach((cert) => {
            cert.style.transform = 'none';
            cert.style.transformOrigin = 'initial';
            cert.style.margin = '0';
          });
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.88);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');

      const arrayBuffer = pdf.output('arraybuffer');

      const sanitizedName = pName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
      const sanitizedSerial = pSerial.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
      const fileName = `Certificate_${sanitizedName}_${sanitizedSerial}.pdf`;

      zip.file(fileName, arrayBuffer);
    }

    // Clean up DOM root
    root.unmount();
    document.body.removeChild(container);

    // Update progress state before ZIP compression
    if (onProgress) {
      onProgress({ current: total, total, participantName: 'Packaging ZIP file archive...' });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Trigger browser file download
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipFilename.endsWith('.zip') ? zipFilename : `${zipFilename}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    return true;
  } catch (err) {
    console.error("Error generating bulk PDF ZIP archive:", err);
    try {
      root.unmount();
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    } catch (_) {}
    return false;
  }
};
