import React, { useState, useRef, useCallback } from 'react';
import Certificate from './components/Certificate';
import CertificateForm from './components/CertificateForm';
import PasswordModal from './components/PasswordModal';
import LoginPage from './components/LoginPage';
import { sampleParticipants } from './data/certificateData';
import { downloadCertificateAsPDF, printCertificate } from './utils/downloadCertificate';
import { initializeDB, recordDownloadToTurso, exportDBToExcel } from './utils/dbTracker';

function App() {
  const [salutation, setSalutation] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [assignedSerialNumber, setAssignedSerialNumber] = useState('CIWA/2026/NOGRA/166');
  const [registeredName, setRegisteredName] = useState('');
  const [participantContact, setParticipantContact] = useState({});
  const certificateRef = useRef(null);

  // Initialize DB table on mount
  React.useEffect(() => {
    initializeDB();
  }, []);

  const fullNameWithSalutation = participantName
    ? `${salutation ? salutation + ' ' : ''}${participantName}`
    : '';

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Record download into Turso DB immediately
      await recordDownloadToTurso({
        registeredName,
        certificateName: fullNameWithSalutation || participantName,
        email: participantContact.email,
        mobile: participantContact.mobile,
        wp: participantContact.wp,
        kvkName: instituteName,
        atariZone: selectedZone,
        serialNumber: assignedSerialNumber
      });

      await downloadCertificateAsPDF(certificateRef, fullNameWithSalutation || 'Participant');
    } finally {
      setIsGenerating(false);
    }
  }, [fullNameWithSalutation, registeredName, participantContact, participantName, assignedSerialNumber, instituteName, selectedZone]);

  const handlePrint = useCallback(() => {
    printCertificate(certificateRef);
  }, []);

  const handleOpenPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);

  const handleExcelExportSuccess = useCallback(() => {
    exportDBToExcel();
  }, []);

  const handleLogin = (participant) => {
    setParticipantName(participant.name);
    setRegisteredName(participant.name);
    setAssignedSerialNumber(participant.serialNumber || 'CIWA/2026/NOGRA/166');
    setParticipantContact({
      email: participant.email,
      mobile: participant.mobile,
      wp: participant.wp
    });
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} onAdminExport={handleOpenPasswordModal} />
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={handleExcelExportSuccess}
        />
      </>
    );
  }

  return (
    <div className="app-layout">
      <CertificateForm
        salutation={salutation}
        setSalutation={setSalutation}
        participantName={participantName}
        setParticipantName={setParticipantName}
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
            <span className={`badge ${participantName && instituteName && selectedZone ? 'badge-ready' : 'badge-draft'}`}>
              {participantName && instituteName && selectedZone ? '✓ Ready' : '◯ Draft'}
            </span>
          </div>
        </div>
        <div className="preview-content">
          <Certificate
            ref={certificateRef}
            salutation={salutation}
            name={participantName}
            instituteName={instituteName}
            atariZone={selectedZone}
            serialNumber={assignedSerialNumber}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
