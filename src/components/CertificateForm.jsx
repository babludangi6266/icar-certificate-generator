import React from 'react';
import './CertificateForm.css';
import { atariZones, sampleParticipants, salutations } from '../data/certificateData';

const CertificateForm = ({
  salutation,
  setSalutation,
  selectedParticipantId,
  setSelectedParticipantId,
  instituteName,
  setInstituteName,
  selectedZone,
  setSelectedZone,
  onDownloadPDF,
  onPrint,
  isGenerating,
}) => {
  return (
    <div className="form-panel">
      <div className="form-header">
        <div className="form-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M12 18v-6"></path>
            <path d="M9 15l3 3 3-3"></path>
          </svg>
        </div>
        <h2>Certificate Generator</h2>
        <p className="form-subtitle">ICAR-CIWA Training Programme</p>
      </div>

      <div className="form-body">
        {/* Salutation + Name Row */}
        <div className="form-group">
          <label htmlFor="name-select">
            <span className="label-icon">👤</span>
            Participant Name & Salutation
          </label>
          <div className="name-input-row">
            {/* Salutation Dropdown */}
            <div className="select-wrapper salutation-select-wrapper">
              <select
                id="salutation-select"
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                title="Select Salutation"
              >
                {salutations.map((sal, index) => (
                  <option key={index} value={sal}>
                    {sal}
                  </option>
                ))}
              </select>
              <span className="select-arrow">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L1 3h10z"/>
                </svg>
              </span>
            </div>

            {/* Hardcoded Participant Name Dropdown */}
            <div className="select-wrapper name-select-wrapper">
              <select
                id="name-select"
                value={selectedParticipantId}
                onChange={(e) => setSelectedParticipantId(e.target.value)}
              >
                <option value="">— Select Name —</option>
                {sampleParticipants.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
              <span className="select-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L1 3h10z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Institute Name Field */}
        <div className="form-group">
          <label htmlFor="institute-input">
            <span className="label-icon">🏛️</span>
            Institute Name
          </label>
          <input
            type="text"
            id="institute-input"
            value={instituteName}
            onChange={(e) => setInstituteName(e.target.value)}
            placeholder="e.g., KVK, Nanded-II"
          />
        </div>

        {/* ATARI Zone Field */}
        <div className="form-group">
          <label htmlFor="zone-select">
            <span className="label-icon">📍</span>
            ATARI Zone
          </label>
          <div className="select-wrapper">
            <select
              id="zone-select"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="">— Select ATARI Zone —</option>
              {atariZones.map((zone) => (
                <option key={zone.id} value={zone.name}>
                  {zone.shortName}
                </option>
              ))}
            </select>
            <span className="select-arrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10z"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="form-status">
          <div className={`status-dot ${selectedParticipantId && instituteName && selectedZone ? 'active' : ''}`}></div>
          <span>
            {selectedParticipantId && instituteName && selectedZone
              ? 'Certificate ready to download'
              : 'Fill all fields to generate certificate'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={onDownloadPDF}
          disabled={!selectedParticipantId || !instituteName || !selectedZone || isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </>
          )}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onPrint}
          disabled={!selectedParticipantId || !instituteName || !selectedZone}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print
        </button>
      </div>

      <div className="form-footer">
        <p>ICAR-Central Institute for Women in Agriculture</p>
        <p>Bhubaneswar</p>
      </div>
    </div>
  );
};

export default CertificateForm;
