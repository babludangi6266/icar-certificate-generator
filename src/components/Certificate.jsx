import React from 'react';
import './Certificate.css';
import leftSideLogo from '../assets/leftsidelogo.png';
import icarRightLogo from '../assets/icarlogoright.gif';
import certificateHead from '../assets/certificate head.png';
import directorSign from '../assets/director sign.png';

const Certificate = React.forwardRef(({ salutation = '', name, instituteName, atariZone, serialNumber }, ref) => {
  // Combine Salutation, Name and Institute Name dynamically
  const activeSalutation = salutation ? `${salutation} ` : '';
  const displayName = name ? `${activeSalutation}${name}` : `${activeSalutation}Madhuri Revanwar`.trim();
  const displayInstitute = instituteName ? `, ${instituteName}` : '';
  const displayZone = atariZone || 'ICAR-Agricultural Technology Application Research Institute, Zone VIII, Pune';

  return (
    <div className="certificate-wrapper">
      <div className="certificate-container" ref={ref}>
        {/* 4-Border Dual-Color Frame (html2canvas PDF compatible) */}
        <div className="border-yellow-1">
          <div className="border-brown-1">
            <div className="border-yellow-2">
              <div className="border-brown-2">

                {/* Top Logos */}
                <div className="certificate-header">
                  <div className="logo-left-box">
                    <img src={leftSideLogo} alt="International Year of the Woman Farmer 2026" className="left-logo-img" />
                  </div>
                  <div className="logo-right-box">
                    <img src={icarRightLogo} alt="ICAR Logo" className="right-logo-img" />
                  </div>
                </div>

                {/* Title Section */}
                <div className="certificate-title-box">
                  <img 
                    src={certificateHead} 
                    alt="Certificate of Completion" 
                    className="certificate-head-img" 
                  />
                </div>

                {/* Main Content Body */}
                <div className="certificate-body-box">
                  <p className="certify-lead">This is to certify that</p>

                  <p className="participant-fullname">
                    <span className={!name ? 'placeholder-text' : ''}>
                      {displayName}{displayInstitute}
                    </span>
                  </p>

                  <p className="zone-statement">
                    under <span className={!atariZone ? 'placeholder-text' : ''}>{displayZone}</span>
                  </p>

                  <div className="training-details">
                    <p className="training-line-1">
                      has successfully completed the Training Programme on <strong className="highlight-program">“Strengthening Agriculture Research</strong>
                    </p>
                    <p className="training-line-2">
                      <strong className="highlight-program">with Gender Perspective for Sustainable Agri-Food System”</strong> organized by
                    </p>
                    <p className="training-organizer">
                      ICAR-Central Institute for Women in Agriculture, Bhubaneswar
                    </p>
                    <p className="training-dates">
                      during July 27-29, 2026.
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="certificate-footer-box">
                  <div className="serial-no-box">
                    Serial Number: {serialNumber}
                  </div>
                  <div className="signature-box">
                    <img src={directorSign} alt="Director Signature" className="director-signature-img" />
                    <p className="sig-name">Dr. Mridula Devi</p>
                    <p className="sig-title">(Director, ICAR-CIWA)</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;
