import React, { useState, useRef, useCallback } from 'react';
import Certificate from './components/Certificate';
import CertificateForm from './components/CertificateForm';
import PasswordModal from './components/PasswordModal';
import { sampleParticipants } from './data/certificateData';
import { downloadCertificateAsPDF, printCertificate } from './utils/downloadCertificate';
import { recordDownloadAndGenerateExcel, exportExcelReport } from './utils/excelTracker';

function App() {
  const [salutation, setSalutation] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const certificateRef = useRef(null);

  // Find the selected participant object from hardcoded list
  const selectedParticipant = sampleParticipants.find((p) => p.id === selectedParticipantId);
  const selectedName = selectedParticipant ? selectedParticipant.name : '';
  const serialNumber = selectedParticipant ? selectedParticipant.serialNumber : 'CIWA/2026/NOGRA/166';

  const fullNameWithSalutation = selectedName
    ? `${salutation ? salutation + ' ' : ''}${selectedName}`
    : '';

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Record download details, timestamp, increment count, and generate/export Excel sheet
      recordDownloadAndGenerateExcel(
        fullNameWithSalutation || selectedName,
        instituteName,
        selectedZone
      );

      await downloadCertificateAsPDF(certificateRef, fullNameWithSalutation || 'Participant');
    } finally {
      setIsGenerating(false);
    }
  }, [fullNameWithSalutation, selectedName, instituteName, selectedZone]);

  const handlePrint = useCallback(() => {
    printCertificate(certificateRef);
  }, []);

  const handleOpenPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);

  const handleExcelExportSuccess = useCallback(() => {
    exportExcelReport();
  }, []);

  return (
    <div className="app-layout">
      <CertificateForm
        salutation={salutation}
        setSalutation={setSalutation}
        selectedParticipantId={selectedParticipantId}
        setSelectedParticipantId={setSelectedParticipantId}
        instituteName={instituteName}
        setInstituteName={setInstituteName}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        onDownloadPDF={handleDownloadPDF}
        onPrint={handlePrint}
        onExportExcel={handleOpenPasswordModal}
        isGenerating={isGenerating}
      />
      <main className="preview-area">
        <div className="preview-header">
          <h3>Certificate Preview</h3>
          <div className="preview-badge">
            <span className={`badge ${selectedName && instituteName && selectedZone ? 'badge-ready' : 'badge-draft'}`}>
              {selectedName && instituteName && selectedZone ? '✓ Ready' : '◯ Draft'}
            </span>
          </div>
        </div>
        <div className="preview-content">
          <Certificate
            ref={certificateRef}
            salutation={salutation}
            name={selectedName}
            instituteName={instituteName}
            atariZone={selectedZone}
            serialNumber={serialNumber}
          />
        </div>
      </main>

      {/* Glassmorphism Admin Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleExcelExportSuccess}
      />
    </div>
  );
}

export default App;
