import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, Check, KeyRound, Eye, EyeOff, User, Calendar, CreditCard, Trash2, AlertTriangle } from 'lucide-react';
import { deleteCustomerProfileCloud } from '../utils/dataService';

export default function CustomerPasswordChangeTab({ customer, updateCustomer, notify }) {
  // Profile State
  const [profileName, setProfileName] = useState(customer?.profile?.name || customer?.name || '');
  const [profileDob, setProfileDob] = useState(customer?.profile?.dob || '');
  const [profileAadhaar, setProfileAadhaar] = useState(customer?.profile?.aadhaarNo || customer?.aadhaarNo || '');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Handle Profile Save
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    const cleanName = profileName.trim();
    if (!cleanName) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து உங்கள் பெயரை உள்ளிடவும். (Please enter your name)');
      return;
    }

    const cleanAadhaar = profileAadhaar.replace(/\D/g, '');
    if (profileAadhaar && cleanAadhaar.length !== 12) {
      if (typeof notify === 'function') notify('⚠️ ஆதார் எண் 12 இலக்கங்கள் இருக்க வேண்டும். (Aadhaar number must be 12 digits)');
      return;
    }

    updateCustomer((curr) => ({
      ...curr,
      name: cleanName,
      aadhaarNo: cleanAadhaar,
      profile: {
        ...(curr.profile || {}),
        name: cleanName,
        dob: profileDob,
        aadhaarNo: cleanAadhaar,
        complete: true
      }
    }));

    if (typeof notify === 'function') notify('✅ உங்கள் சுயவிவர விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன! (Profile updated successfully)');
  };

  // Handle Password Save
  const handleSavePassword = (e) => {
    if (e) e.preventDefault();

    if (customer?.profile?.password && currentPassword !== customer.profile.password) {
      if (typeof notify === 'function') notify('❌ தற்போதைய கடவுச்சொல் தவறானது! (Incorrect current password)');
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      if (typeof notify === 'function') notify('⚠️ புதிய கடவுச்சொல் குறைந்தது 3 எழுத்துக்கள் இருக்க வேண்டும் (Min 3 characters)');
      return;
    }

    if (newPassword !== confirmPassword) {
      if (typeof notify === 'function') notify('⚠️ புதிய கடவுச்சொற்கள் இரண்டும் பொருந்தவில்லை (Passwords do not match)');
      return;
    }

    updateCustomer((curr) => ({
      ...curr,
      profile: {
        ...(curr.profile || {}),
        password: newPassword
      }
    }));

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    if (typeof notify === 'function') notify('✅ கடவுச்சொல் வெற்றிகரமாக சேமிக்கப்பட்டது! (Customer password saved successfully)');
  };

  // Handle Self Account Deletion
  const handleDeleteAccount = async () => {
    const custPhone = customer?.phone || '';
    const cleanPhone = String(custPhone).replace(/\D/g, '');
    const confirmDelete = window.confirm(
      `⚠️ உங்கள் கணக்கை நிரந்தரமாக நீக்க விரும்புகிறீர்களா? (Delete Account Permanently?)\n\n` +
      `உங்கள் பெயர், பிறந்த தேதி, ஆதார் எண், பதிவேற்றப்பட்ட அனைத்து ஆவணங்கள் மற்றும் விண்ணப்பங்கள் முழுமையாக நீக்கப்படும்.`
    );
    if (!confirmDelete) return;

    try {
      if (typeof deleteCustomerProfileCloud === 'function') {
        await deleteCustomerProfileCloud(cleanPhone || custPhone);
      }
    } catch (err) {
      console.warn('Account deletion notice:', err);
    }

    // Clear session & local storage
    try {
      sessionStorage.removeItem('akesevai-customer-session');
      localStorage.removeItem('akesevai-customer-session');
      sessionStorage.removeItem('akesevai_customer_session');
      localStorage.removeItem('akesevai_customer_session');
      sessionStorage.removeItem('akesevai-customer-tab');
    } catch (e) {}

    if (typeof updateCustomer === 'function') {
      updateCustomer(null);
    }

    if (typeof notify === 'function') notify('🗑️ உங்கள் கணக்கு வெற்றிகரமாக நீக்கப்பட்டது. (Account deleted successfully)');
    window.location.reload();
  };

  return (
    <div style={{ display: 'grid', gap: '24px', maxWidth: '640px', marginTop: '20px' }}>
      
      {/* 1. CUSTOMER PROFILE DETAILS (NAME, DOB, AADHAAR) */}
      <div className="tab-content" style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #0052cc', padding: '28px', boxShadow: '0 4px 16px rgba(0,82,204,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', color: '#0052cc', display: 'grid', placeItems: 'center' }}>
            <User size={24} />
          </div>
          <div>
            <h3 style={{ font: '800 18px Manrope, sans-serif', margin: 0, color: '#0f172a' }}>👤 வாடிக்கையாளர் சுயவிவரம் (Profile Settings)</h3>
            <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Update your name, Date of Birth & Aadhaar details for +91 {customer?.phone}</small>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label htmlFor="cust-profile-name" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              முழு பெயர் (Full Name) *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <User size={16} style={{ color: '#0052cc', marginRight: '8px' }} />
              <input
                id="cust-profile-name"
                name="profile_name"
                autoComplete="name"
                required
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your full name"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="cust-profile-dob" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              பிறந்த தேதி (Date of Birth / DOB)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <Calendar size={16} style={{ color: '#16a34a', marginRight: '8px' }} />
              <input
                id="cust-profile-dob"
                name="profile_dob"
                autoComplete="bday"
                type="date"
                value={profileDob}
                onChange={(e) => setProfileDob(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label htmlFor="cust-profile-aadhaar" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              ஆதார் எண் (Aadhaar Card Number - 12 Digits)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <CreditCard size={16} style={{ color: '#d97706', marginRight: '8px' }} />
              <input
                id="cust-profile-aadhaar"
                name="profile_aadhaar"
                autoComplete="off"
                type="text"
                maxLength={12}
                value={profileAadhaar}
                onChange={(e) => setProfileAadhaar(e.target.value.replace(/\D/g, ''))}
                placeholder="12-digit Aadhaar Number (e.g. 567890123456)"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Save Profile Button */}
          <button className="button button-primary button-wide" type="submit" style={{ borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 800, marginTop: '6px' }}>
            <Check size={18} /> சுயவிவரம் சேமிக்க (Save Profile)
          </button>
        </form>
      </div>

      {/* 2. PASSWORD SECURITY SETTINGS */}
      <div className="tab-content" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', display: 'grid', placeItems: 'center' }}>
            <KeyRound size={24} />
          </div>
          <div>
            <h3 style={{ font: '800 18px Manrope, sans-serif', margin: 0, color: '#0f172a' }}>🔑 கடவுச்சொல் அமைப்புகள் (Password)</h3>
            <small style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>Change account password for security</small>
          </div>
        </div>

        <form onSubmit={handleSavePassword} style={{ display: 'grid', gap: '16px' }}>
          {customer?.profile?.password ? (
            <div>
              <label htmlFor="cust-current-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                தற்போதைய கடவுச்சொல் (Current Password) *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
                <LockKeyhole size={16} style={{ color: '#0284c7', marginRight: '8px' }} />
                <input
                  id="cust-current-password"
                  name="current_password"
                  autoComplete="current-password"
                  required
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
              ℹ️ உங்கள் கணக்கிற்கு இதுவரை கடவுச்சொல் அமைக்கப்படவில்லை. புதிய கடவுச்சொல்லை உள்ளிட்டு சேமிக்கவும்.
            </div>
          )}

          <div>
            <label htmlFor="cust-new-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              புதிய கடவுச்சொல் (New Password) *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <LockKeyhole size={16} style={{ color: '#16a34a', marginRight: '8px' }} />
              <input
                id="cust-new-password"
                name="new_password"
                autoComplete="new-password"
                required
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="cust-confirm-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
              புதிய கடவுச்சொல் உறுதி செய்க (Confirm New Password) *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '2px 10px', background: '#f8fafc' }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', marginRight: '8px' }} />
              <input
                id="cust-confirm-password"
                name="confirm_password"
                autoComplete="new-password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}
              />
            </div>
          </div>

          <button className="button button-primary button-wide" type="submit" style={{ borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 800, marginTop: '6px' }}>
            <Check size={18} /> கடவுச்சொல் சேமிக்க (Save Password)
          </button>
        </form>
      </div>

      {/* 3. DANGER ZONE - SELF ACCOUNT DELETION */}
      <div style={{ background: '#fef2f2', borderRadius: '16px', border: '1.5px solid #fca5a5', padding: '24px', boxShadow: '0 4px 16px rgba(220,38,38,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ font: '800 16px Manrope, sans-serif', margin: 0, color: '#991b1b' }}>🚨 கணக்கை நிரந்தரமாக நீக்குதல் (Delete Account)</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#7f1d1d' }}>
              உங்கள் கணக்கு, சுயவிவர விவரங்கள், ஆதார் தகவல், விண்ணப்பங்கள் மற்றும் ஆவணங்கள் அனைத்தும் நிரந்தரமாக அழிக்கப்படும்.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
            marginTop: '8px'
          }}
        >
          <Trash2 size={16} /> 🗑️ எனது கணக்கை நீக்குக (Delete My Account)
        </button>
      </div>

    </div>
  );
}
