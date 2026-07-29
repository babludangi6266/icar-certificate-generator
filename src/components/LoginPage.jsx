import React, { useState } from 'react';
import './LoginPage.css';
import { sampleParticipants } from '../data/certificateData';
import icarLogo from '../assets/icarlogoright.gif';

const LoginPage = ({ onLogin, onAdminExport }) => {
    const [selectedId, setSelectedId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [wp, setWp] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredParticipants = sampleParticipants.filter(p =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleSelectParticipant = (p) => {
        setSearchName(p.name);
        setSelectedId(p.id);
        setIsDropdownOpen(false);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setSearchName(value);
        setIsDropdownOpen(true);
        const participant = sampleParticipants.find(p => p.name.toLowerCase() === value.toLowerCase());
        if (participant) {
            setSelectedId(participant.id);
        } else {
            setSelectedId('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedId || !email || !mobile || !wp) {
            alert("Please fill all fields");
            return;
        }
        const participant = sampleParticipants.find(p => p.id === selectedId);

        // Proceed to app passing all data
        onLogin({
            ...participant,
            email,
            mobile,
            wp
        });
    };

    return (
        <div className="login-container">
            <div className="login-card glass-effect">
                <div className="login-header">
                    <img src={icarLogo} alt="ICAR Logo" className="login-logo" />
                    <h2>Participant Login</h2>
                    <p>Please enter your details to access your certificate</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-form-group">
                        <label>Select Your Registered Name</label>
                        <div className="custom-dropdown-container">
                            <input
                                type="text"
                                placeholder="Type to search or select name..."
                                value={searchName}
                                onChange={handleNameChange}
                                onFocus={() => setIsDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                required
                                className="custom-dropdown-input"
                            />
                            <div className="custom-dropdown-arrow">&#9662;</div>

                            {isDropdownOpen && (
                                <ul className="custom-dropdown-list">
                                    {filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((p) => (
                                            <li key={p.id} onMouseDown={() => handleSelectParticipant(p)}>
                                                {p.name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="custom-dropdown-empty">No matching names</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="login-form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. participant@example.com"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="10-digit mobile number"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label>WhatsApp Number</label>
                        <input
                            type="tel"
                            value={wp}
                            onChange={(e) => setWp(e.target.value)}
                            placeholder="WhatsApp number"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Continue
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={onAdminExport}
                        style={{ background: 'none', border: 'none', color: '#c8a415', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
                    >
                        Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
