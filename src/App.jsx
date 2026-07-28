import React, { useState, useRef, useCallback } from 'react';
import Certificate from './components/Certificate';
import CertificateForm from './components/CertificateForm';
import { generateSerialNumber } from './data/certificateData';
import { downloadCertificateAsPDF, printCertificate } from './utils/downloadCertificate';

function App() {
  const [selectedName, setSelectedName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [serialNumber] = useState(generateSerialNumber());
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      await downloadCertificateAsPDF(certificateRef, selectedName);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedName]);

  const handlePrint = useCallback(() => {
    printCertificate(certificateRef);
  }, []);

  return (
    <div className="app-layout">
      <CertificateForm
        selectedName={selectedName}
        setSelectedName={setSelectedName}
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
