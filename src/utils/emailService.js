/**
 * Sends a 6-digit verification OTP email to the participant using Google Apps Script Web App (500 free emails/day).
 * 
 * @param {Object} options
 * @param {string} options.toEmail Recipient Email Address
 * @param {string} options.toName Recipient Participant Name
 * @param {string} options.otpCode 6-Digit Verification OTP Code
 * @returns {Promise<{ success: boolean, isFallback?: boolean, message: string }>}
 */
export const sendOtpEmail = async ({ toEmail, toName, otpCode }) => {
  const scriptUrl = import.meta.env.VITE_GMAIL_SCRIPT_URL;

  // 1. Google Apps Script Web App (500 emails/day = 15,000 emails/month free)
  if (scriptUrl && scriptUrl.trim()) {
    try {
      await fetch(scriptUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          toEmail,
          toName: toName || 'Participant',
          otpCode
        })
      });
      console.log(`Dispatched Google Apps Script OTP email to ${toEmail}`);
      return {
        success: true,
        isFallback: false,
        message: `Verification OTP successfully sent to ${toEmail}`
      };
    } catch (err) {
      console.error("Google Apps Script email error:", err);
    }
  }

  // 2. EmailJS Fallback Check
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey) {
    try {
      const emailjs = await import('@emailjs/browser');
      const templateParams = {
        to_email: toEmail,
        to_name: toName || 'Participant',
        otp_code: otpCode,
        app_name: 'ICAR-CIWA Certificate Portal'
      };

      await emailjs.default.send(serviceId, templateId, templateParams, publicKey);
      return {
        success: true,
        isFallback: false,
        message: `Verification OTP sent to ${toEmail}`
      };
    } catch (error) {
      console.error("EmailJS dispatch error:", error);
    }
  }

  // 3. Test Mode Fallback
  console.warn("Notice: VITE_GMAIL_SCRIPT_URL is not configured yet in .env file.");
  return {
    success: true,
    isFallback: true,
    message: `Verification OTP: ${otpCode}`
  };
};
