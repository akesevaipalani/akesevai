import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LockKeyhole, X, Check, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminPasswordModal({ isOpen, onClose, changeAdminPassword, notify }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    if (typeof onClose === 'function') onClose();
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      const msg = '⚠️ தற்போதைய கடவுச்சொல்லை உள்ளிடவும் (Please enter current password)';
      setErrorMsg(msg);
      if (typeof notify === 'function') notify(msg);
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      const msg = '⚠️ புதிய கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும் (Min 4 characters)';
      setErrorMsg(msg);
      if (typeof notify === 'function') notify(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = '⚠️ புதிய கடவுச்சொற்கள் இரண்டும் பொருந்தவில்லை (Passwords do not match)';
      setErrorMsg(msg);
      if (typeof notify === 'function') notify(msg);
      return;
    }

    if (typeof changeAdminPassword !== 'function') {
      const msg = '❌ கடவுச்சொல் மாற்றும் சேவை கிடைக்கவில்லை (Password change handler not configured)';
      setErrorMsg(msg);
      if (typeof notify === 'function') notify(msg);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      const isOk = res === true || res?.success === true;
      if (isOk) {
        setSuccessMsg(res?.message || '✅ கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது! (Password updated)');
        setTimeout(() => {
          setIsSubmitting(false);
          handleClose();
        }, 800);
      } else {
        setIsSubmitting(false);
        setErrorMsg(res?.message || '❌ தவறான தற்போதைய கடவுச்சொல்! (Incorrect current password)');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('❌ கடவுச்சொல் மாற்ற முடியவில்லை: ' + (err?.message || 'Server error'));
    }
  };

  const modalElement = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '440px',
        maxHeight: 'min(90vh, 580px)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '20px',
        padding: '24px 20px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        boxSizing: 'border-box',
        animation: 'esevaiSealBounce 0.35s ease forwards'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <KeyRound size={22} />
            </div>
            <div>
              <h3 style={{ font: '800 17px Manrope, sans-serif', color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                அட்மின் கடவுச்சொல் மாற்று
              </h3>
              <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Change Admin Password</small>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#64748b', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Inline Feedback Banners */}
        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', color: '#991b1b', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', color: '#166534', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form id="admin-password-modal-form" onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          {/* Current Password */}
          <div>
            <label htmlFor="admin-modal-current-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              தற்போதைய கடவுச்சொல் (Current Password)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <LockKeyhole size={16} style={{ color: '#0284c7', marginRight: '8px', flexShrink: 0 }} />
              <input
                id="admin-modal-current-password"
                name="admin_current_password"
                autoComplete="current-password"
                required
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Enter current password"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a' }}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} aria-label="Toggle current password visibility" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="admin-modal-new-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              புதிய கடவுச்சொல் (New Password)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <LockKeyhole size={16} style={{ color: '#16a34a', marginRight: '8px', flexShrink: 0 }} />
              <input
                id="admin-modal-new-password"
                name="admin_new_password"
                autoComplete="new-password"
                required
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Enter new password (min 4 chars)"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a' }}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} aria-label="Toggle new password visibility" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="admin-modal-confirm-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              புதிய கடவுச்சொல் உறுதி செய்க (Confirm New Password)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', marginRight: '8px', flexShrink: 0 }} />
              <input
                id="admin-modal-confirm-password"
                name="admin_confirm_password"
                autoComplete="new-password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Confirm new password"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a' }}
              />
            </div>
          </div>

          <button
            id="admin-modal-submit-btn"
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #16a34a 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              opacity: isSubmitting ? 0.75 : 1
            }}
          >
            <Check size={18} /> {isSubmitting ? 'சேமிக்கப்படுகிறது...' : 'கடவுச்சொல் மாற்றுக (Save New Password)'}
          </button>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}
