import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadCertificateAsPDF = async (certificateRef, participantName) => {
  if (!certificateRef.current) return;

  const originalEl = certificateRef.current;

  // Create an off-screen clone container at 100% unscaled dimensions (1020px x 720px)
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1020px';
  container.style.height = '720px';
  container.style.zIndex = '-9999';

  // Deep clone the certificate node
  const clone = originalEl.cloneNode(true);
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Ensure all web fonts and images in the clone render completely
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Capture at scale: 2.3 -> Generates 2346px x 1656px canvas (Exact 200 DPI for A4 Landscape)
    const canvas = await html2canvas(clone, {
      scale: 2.3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      dpi: 200,
      windowWidth: 1020,
      windowHeight: 720,
    });

    // Remove the clone from DOM
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png', 0.95);

    // Create A4 Landscape PDF (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 297;
    const pdfHeight = 210;

    // Add 200 DPI crisp image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const sanitizedName = participantName
      ? participantName.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_')
      : 'Participant';

    const fileName = `Certificate_${sanitizedName}.pdf`;

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating 200 DPI PDF:', error);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    return false;
  }
};

export const printCertificate = (certificateRef) => {
  if (!certificateRef.current) return;

  const printContent = certificateRef.current.outerHTML;
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ICAR-CIWA Certificate</title>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700;1,800&family=EB+Garamond:ital,wght@0,500;0,600;0,700;0,800;1,600;1,700;1,800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: white;
        }
        .certificate-container {
          transform: none !important;
          box-shadow: none !important;
        }
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
      <link rel="stylesheet" href="${window.location.origin}/src/components/Certificate.css">
    </head>
    <body>
      ${printContent}
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            window.close();
          }, 600);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};
