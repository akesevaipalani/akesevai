import React, { useState } from 'react';
import { LockKeyhole, X, Check, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminPasswordModal({ isOpen, onClose, changeAdminPassword, notify }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!newPassword || newPassword.length < 4) {
      if (typeof notify === 'function') notify('⚠️ புதிய கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும் (Min 4 characters)');
      return;
    }

    if (newPassword !== confirmPassword) {
      if (typeof notify === 'function') notify('⚠️ புதிய கடவுச்சொற்கள் இரண்டும் பொருந்தவில்லை (Passwords do not match)');
      return;
    }

    const success = changeAdminPassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '440px',
        borderRadius: '20px',
        padding: '28px 24px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        animation: 'esevaiSealBounce 0.35s ease forwards'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', display: 'grid', placeItems: 'center' }}>
              <KeyRound size={22} />
            </div>
            <div>
              <h3 style={{ font: '800 18px Manrope, sans-serif', color: '#0f172a', margin: 0 }}>
                அட்மின் கடவுச்சொல் மாற்று
              </h3>
              <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Change Admin Password</small>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          {/* Current Password */}
          <div>
            <label htmlFor="admin-modal-current-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              தற்போதைய கடவுச்சொல் (Current Password)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <LockKeyhole size={16} style={{ color: '#0284c7', marginRight: '8px' }} />
              <input
                id="admin-modal-current-password"
                name="admin_current_password"
                autoComplete="current-password"
                required
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a' }}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
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
              <LockKeyhole size={16} style={{ color: '#16a34a', marginRight: '8px' }} />
              <input
                id="admin-modal-new-password"
                name="admin_new_password"
                autoComplete="new-password"
                required
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 4 chars)"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a' }}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
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
              <ShieldCheck size={16} style={{ color: '#16a34a', marginRight: '8px' }} />
              <input
                id="admin-modal-confirm-password"
                name="admin_confirm_password"
                autoComplete="new-password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #16a34a 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Check size={18} /> கடவுச்சொல் மாற்றுக (Save New Password)
          </button>
        </form>
      </div>
    </div>
  );
}
