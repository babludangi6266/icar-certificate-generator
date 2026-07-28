import React, { useState, useEffect, useRef } from 'react';
import './PasswordModal.css';

const PasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setShake(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim() === 'ciwa#2026') {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect Admin Password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="glass-modal-overlay" onClick={onClose}>
      <div className={`glass-modal-card ${shake ? 'shake-anim' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="glass-modal-close" onClick={onClose} aria-label="Close modal">
          X
        </button>

        <div className="glass-modal-header">
          <div className="glass-lock-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h3>Admin Authorization</h3>
          <p>Enter admin password to export download records</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-modal-body">
          <div className="glass-input-group">
            <input
              ref={inputRef}
              type="password"
              className={`glass-password-input ${error ? 'input-error' : ''}`}
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          {error && <p className="glass-error-msg">Incorrect Admin Password</p>}

          <div className="glass-modal-actions">
            <button type="button" className="btn-glass-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-glass-submit">
              Unlock & Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
