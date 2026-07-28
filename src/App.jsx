import React, { useState, useRef, useCallback } from 'react';
import Certificate from './components/Certificate';
import CertificateForm from './components/CertificateForm';
import { sampleParticipants } from './data/certificateData';
import { downloadCertificateAsPDF, printCertificate } from './utils/downloadCertificate';

function App() {
  const [salutation, setSalutation] = useState('Dr.');
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);

  // Find the selected participant object from hardcoded list
  const selectedParticipant = sampleParticipants.find((p) => p.id === selectedParticipantId);
  const selectedName = selectedParticipant ? selectedParticipant.name : '';
  const serialNumber = selectedParticipant ? selectedParticipant.serialNumber : 'CIWA/2026/NOGRA/166';

  const fullNameWithSalutation = selectedName ? `${salutation} ${selectedName}` : '';

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      await downloadCertificateAsPDF(certificateRef, fullNameWithSalutation || 'Participant');
    } finally {
      setIsGenerating(false);
    }
  }, [fullNameWithSalutation]);

  const handlePrint = useCallback(() => {
    printCertificate(certificateRef);
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
    </div>
  );
}

export default App;
