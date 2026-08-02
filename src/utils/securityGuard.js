/**
 * Security Guard Manager - Defeats Windows Snipping Tool (Win+Shift+S), PrintScreen & Copying
 */

export const initSecurityGuard = (onSecurityViolation, onBlurStateChange) => {
    // 1. Instant Blur on Window Blur / Focus Loss
    // Windows Snipping Tool (Win+Shift+S) and PrtScn cause window blur instantly BEFORE taking screenshot!
    const handleWindowBlur = () => {
        if (onBlurStateChange) onBlurStateChange(true);
        clearClipboard();
        if (onSecurityViolation) {
            onSecurityViolation("🔒 Screen Protection: Canvas hidden on window focus loss / screen snippet attempt.", true);
        }
    };

    const handleWindowFocus = () => {
        if (onBlurStateChange) {
            // Short delay before restoring focus to prevent snippet freeze-frame
            setTimeout(() => onBlurStateChange(false), 300);
        }
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            if (onBlurStateChange) onBlurStateChange(true);
            clearClipboard();
        } else {
            if (onBlurStateChange) {
                setTimeout(() => onBlurStateChange(false), 300);
            }
        }
    };

    // 2. Right Click Prevention
    const handleContextMenu = (e) => {
        e.preventDefault();
        if (onSecurityViolation) {
            onSecurityViolation("🔒 Right-click is disabled on official ICAR certificates.");
        }
        return false;
    };

    // 3. Intercept Windows Key, PrintScreen, Win+Shift+S, Alt+PrtScn
    const handleKeyDown = (e) => {
        const key = e.key;
        const ctrlOrCmd = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;
        const meta = e.metaKey;

        // PrintScreen / Win+Shift+S / Snipping Tool
        if (key === 'PrintScreen' || key === 'PrtScn' || e.keyCode === 44 || (meta && shift) || (meta && (key === 'S' || key === 's'))) {
            if (onBlurStateChange) onBlurStateChange(true);
            clearClipboard();
            if (onSecurityViolation) {
                onSecurityViolation("⚠️ Windows Screenshot / Snipping Tool blocked & canvas blurred!", true);
            }
            setTimeout(() => {
                if (onBlurStateChange) onBlurStateChange(false);
            }, 3500);
            return false;
        }

        // F12 or Ctrl + Shift + I / J / C (DevTools)
        if (key === 'F12' || (ctrlOrCmd && shift && ['I', 'i', 'J', 'j', 'C', 'c'].includes(key))) {
            e.preventDefault();
            if (onSecurityViolation) {
                onSecurityViolation("🔒 Developer Tools inspection is restricted on this workspace.");
            }
            return false;
        }

        // Ctrl + S (Save Page) or Ctrl + U (View Source) or Ctrl + P (Print Override)
        if (ctrlOrCmd && ['s', 'S', 'u', 'U', 'p', 'P'].includes(key)) {
            e.preventDefault();
            if (onSecurityViolation) {
                onSecurityViolation(`🔒 Direct ${key.toUpperCase()} shortcut is disabled for security.`);
            }
            return false;
        }
    };

    // Helper to clear system clipboard
    const clearClipboard = () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('');
            }
        } catch (err) {
            // Ignore clipboard errors
        }
    };

    // Attach Listeners
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
        window.removeEventListener('blur', handleWindowBlur);
        window.removeEventListener('focus', handleWindowFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
    };
};
