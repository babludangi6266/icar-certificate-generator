import React, { useState, useRef, useEffect } from 'react';
import './CertificateForm.css';
import { atariZones, sampleParticipants, salutations } from '../data/certificateData';
import icarLogo from '../assets/icarlogoright.gif';

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
  onExportExcel,
  isGenerating,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedParticipant = sampleParticipants.find((p) => p.id === selectedParticipantId);

  // Filter participants by search query
  const filteredParticipants = sampleParticipants.filter((participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="form-panel">
      <div className="form-header">
        <div className="form-logo-box">
          <img src={icarLogo} alt="ICAR Logo" className="sidebar-icar-logo" />
        </div>
        <h2>Certificate Generator</h2>
        <p className="form-subtitle">ICAR-CIWA Training Programme</p>
      </div>

      <div className="form-body">
        {/* Salutation + Integrated Searchable Participant Name */}
        <div className="form-group">
          <label htmlFor="name-combobox-input">
            <span className="label-icon">👤</span>
            Select Participant Name
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
                <option value="">— Select Salutation —</option>
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

            {/* Integrated Searchable Combobox */}
            <div className="searchable-combobox-wrapper" ref={dropdownRef}>
              <div className="combobox-input-box">
                <input
                  id="name-combobox-input"
                  type="text"
                  className="combobox-input"
                  placeholder="Type to search or select name..."
                  value={isOpen ? searchTerm : (selectedParticipant ? selectedParticipant.name : searchTerm)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isOpen) setIsOpen(true);
                  }}
                  onFocus={() => {
                    setIsOpen(true);
                  }}
                />
                <span className="combobox-arrow" onClick={() => setIsOpen(!isOpen)}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 8L1 3h10z"/>
                  </svg>
                </span>
              </div>

              {/* Searchable Options Menu */}
              {isOpen && (
                <ul className="combobox-menu">
                  {filteredParticipants.length === 0 ? (
                    <li className="combobox-item no-results">No participant matching "{searchTerm}"</li>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <li
                        key={participant.id}
                        className={`combobox-item ${selectedParticipantId === participant.id ? 'active' : ''}`}
                        onMouseDown={() => {
                          setSelectedParticipantId(participant.id);
                          setSearchTerm('');
                          setIsOpen(false);
                        }}
                      >
                        {participant.name}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Institute Name Field */}
        <div className="form-group">
          <label htmlFor="institute-input">
            <span className="label-icon">🏛️</span>
            KVK Name
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
        <button
          className="btn btn-excel"
          onClick={onExportExcel}
          title="Download Admin Excel report of all certificate downloads"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M8 13h8"></path>
            <path d="M8 17h8"></path>
            <path d="M10 9h4"></path>
          </svg>
          Export Admin Excel
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
