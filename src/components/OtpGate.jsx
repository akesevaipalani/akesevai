import { useState } from 'react';
import { ArrowRight, LockKeyhole, Phone, ShieldCheck, UserCheck, Eye, EyeOff, KeyRound, Fingerprint, ArrowLeft, UserPlus, MessageSquareCode, CheckCircle2 } from 'lucide-react';

export default function OtpGate({ onVerified, notify, customerRecords }) {
  const [step, setStep] = useState(1); // 1: Mobile Number, 2: Password / Setup
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isError, setIsError] = useState(false);

  // Step 1: Validate Mobile and check if user exists
  const handleCheckPhoneStep = (event) => {
    if (event) event.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 10-இலக்க மொபைல் எண்ணை உள்ளிடவும் (Enter valid 10-digit mobile number)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    let records = customerRecords;
    if (!records || typeof records !== 'object' || Object.keys(records).length === 0) {
      try {
        const r1 = JSON.parse(localStorage.getItem('akesevai-customer-records') || '{}');
        const r2 = JSON.parse(localStorage.getItem('akesevai-customers') || '{}');
        records = { ...r2, ...r1 };
      } catch (err) {
        records = {};
      }
    }

    const cleanDigits = cleanedPhone.replace(/\D/g, '');
    const exists = Boolean(records && (records[cleanedPhone] || records[cleanDigits] || records[`+91 ${cleanDigits}`] || records[`+91${cleanDigits}`]));
    setIsExistingUser(exists);
    setStep(2);

    if (exists) {
      if (typeof notify === 'function') notify(`👋 நல்வரவு! +91 ${cleanedPhone} கணக்கின் கடவுச்சொல்லை உள்ளிடவும்.`);
    } else {
      if (typeof notify === 'function') notify(`✨ புதிய வாடிக்கையாளர்! +91 ${cleanedPhone} கணக்கிற்கு புதிய கடவுச்சொல்லை அமைக்கவும்.`);
    }
  };

  const [loading, setLoading] = useState(false);

  // Step 2: Perform Login, OTP Password Reset, or New User Registration
  const handleFinalSubmit = async (event) => {
    if (event) event.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 10) return;

    if (isResetMode) {
      if (!otpInput || otpInput.trim().length !== 4) {
        if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 4-இலக்க OTP எண்ணை உள்ளிடவும் (Enter 4-digit OTP: 1234)');
        setIsError(true);
        setTimeout(() => setIsError(false), 1200);
        return;
      }
      if (!password || password.length < 3) {
        if (typeof notify === 'function') notify('⚠️ தயவுசெய்து புதிய கடவுச்சொல்லை உள்ளிடவும் (Enter new password)');
        setIsError(true);
        setTimeout(() => setIsError(false), 1200);
        return;
      }

      if (typeof notify === 'function') notify('✅ OTP சரிபார்க்கப்பட்டது! புதிய கடவுச்சொல் அமைத்து வெற்றிகரமாக உள்நுழைந்தீர்கள்.');
    }

    setLoading(true);
    try {
      if (typeof onVerified === 'function') {
        await onVerified(cleanedPhone, password);
      }
    } catch (err) {
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-gate" role="dialog" aria-modal="true">
      <div className={`otp-gate-card esevai-scan-container ${isError ? 'esevai-shake' : ''}`}>
        <div className="esevai-scan-laser" />

        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isResetMode ? '#fef3c7' : step === 2 && !isExistingUser ? '#dcfce7' : '#e0f2fe',
            color: isResetMode ? '#b45309' : step === 2 && !isExistingUser ? '#15803d' : '#0369a1',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 800
          }}>
            {isResetMode ? <MessageSquareCode size={14} /> : step === 2 && !isExistingUser ? <UserPlus size={14} /> : <UserCheck size={14} />}
            {isResetMode ? 'OTP PASSWORD RESET' : step === 1 ? 'E-SEVAI CUSTOMER ACCESS' : isExistingUser ? 'CUSTOMER LOGIN' : 'NEW CUSTOMER REGISTRATION'}
          </div>
          <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} /> Live Portal
          </span>
        </div>

        {/* Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: isResetMode ? 'linear-gradient(135deg, #d97706 0%, #ca8a04 100%)' : step === 2 && !isExistingUser ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)' : 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 10px',
            boxShadow: '0 8px 20px rgba(0, 82, 204, 0.25)'
          }} className="esevai-rfid-pulse">
            <Fingerprint size={28} />
          </div>
          <h2 style={{ font: '800 22px/1.2 Manrope, sans-serif', color: '#0f172a', margin: '0 0 4px' }}>
            வாடிக்கையாளர் தளம் <span style={{ color: '#0052cc' }}>(Customer Portal)</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            {isResetMode
              ? `+91 ${phone} எண்ணிற்கு அனுப்பப்பட்ட OTP மற்றும் புதிய கடவுச்சொல்லை உள்ளிடவும்.`
              : step === 1
              ? 'உங்கள் 10-இலக்க மொபைல் எண்ணை உள்ளிட்டு அடுத்து செல்லவும்.'
              : isExistingUser
              ? `+91 ${phone} கணக்கின் கடவுச்சொல்லை உள்ளிட்டு உள்நுழையவும்.`
              : `+91 ${phone} புதிய கணக்கிற்கு கடவுச்சொல்லை உருவாக்கவும்.`}
          </p>
        </div>

        {/* STEP 1: ENTER MOBILE NUMBER */}
        {step === 1 && (
          <form onSubmit={handleCheckPhoneStep}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '12px', textTransform: 'uppercase' }}>
              MOBILE NUMBER / மொபைல் எண் *
              <div className="otp-phone-input" style={{
                display: 'flex',
                border: isError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '6px',
                background: '#ffffff'
              }}>
                <span style={{ background: '#f1f5f9', color: '#0f172a', padding: '12px 14px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center' }}>+91</span>
                <input
                  autoFocus
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-இலக்க மொபைல் எண்"
                  style={{
                    border: 'none',
                    outline: 'none',
                    padding: '12px',
                    width: '100%',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                />
              </div>
            </label>

            <button className="button button-primary button-wide" type="submit" style={{ borderRadius: '10px', padding: '13px', fontSize: '13px', fontWeight: 800, marginTop: '8px' }}>
              அடுத்து செல்லவும் / Next Step <ArrowRight size={17} />
            </button>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              <small className="otp-note" style={{ margin: 0, color: '#16a34a', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={15} />
                <span>பாதுகாக்கப்பட்ட நேரடி நுழைவு (No OTP required)</span>
              </small>
            </div>
          </form>
        )}

        {/* STEP 2: ENTER OR CREATE PASSWORD / OTP RESET */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit}>
            {/* Display Selected Phone & Change Option */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '8px 12px',
              marginBottom: '14px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                📱 Mobile: +91 {phone}
              </span>
              <button
                type="button"
                onClick={() => { setStep(1); setPassword(''); setIsResetMode(false); }}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ArrowLeft size={13} /> மாற்று (Change)
              </button>
            </div>

            {/* IF RESET MODE: SHOW OTP FIELD FIRST */}
            {isResetMode && (
              <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase' }}>
                    📲 4-DIGIT OTP CODE / 4-இலக்க OTP எண் *
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpInput('1234')}
                    style={{ background: '#fef08a', color: '#854d0e', border: 'none', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    ⚡ Auto-Fill OTP (1234)
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #eab308',
                  borderRadius: '10px',
                  background: '#ffffff',
                  padding: '2px 10px'
                }}>
                  <MessageSquareCode size={16} style={{ color: '#d97706', marginRight: '8px' }} />
                  <input
                    autoFocus
                    required
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Enter 4-digit OTP (e.g. 1234)"
                    style={{
                      border: 'none',
                      outline: 'none',
                      padding: '10px 0',
                      width: '100%',
                      fontSize: '15px',
                      fontWeight: 800,
                      color: '#0f172a',
                      letterSpacing: '3px'
                    }}
                  />
                </div>
                <small style={{ fontSize: '10px', color: '#a16207', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                  💬 SMS/WhatsApp மூலம் +91 {phone} எண்ணிற்கு அனுப்பப்பட்ட OTP எண்ணை உள்ளிடவும்.
                </small>
              </div>
            )}

            {/* Customer Password / PIN Field */}
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase' }}>
              {isResetMode
                ? '🔑 NEW PASSWORD / புதிய கடவுச்சொல் உள்ளிடவும் *'
                : isExistingUser
                ? '🔒 PASSWORD / கணக்கின் கடவுச்சொல் *'
                : '✨ CREATE NEW PASSWORD / புதிய கடவுச்சொல் உருவாக்கவும் *'}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: isError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '6px',
                padding: '2px 10px',
                background: '#ffffff'
              }}>
                <LockKeyhole size={16} style={{ color: isResetMode ? '#d97706' : isExistingUser ? '#0052cc' : '#16a34a', marginRight: '8px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isResetMode
                      ? 'புதிய கடவுச்சொல் உள்ளிடவும்'
                      : isExistingUser
                      ? 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்'
                      : 'புதிய கடவுச்சொல்லை உருவாக்கவும்'
                  }
                  style={{
                    border: 'none',
                    outline: 'none',
                    padding: '10px 0',
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {!isExistingUser && !isResetMode && (
                <div style={{ fontSize: '10px', color: '#16a34a', marginTop: '4px', fontWeight: 700 }}>
                  💡 அடுத்த முறை உள்நுழைய இந்த கடவுச்சொல் பயன்படும்.
                </div>
              )}
            </label>

            {isExistingUser && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isResetMode;
                    setIsResetMode(nextMode);
                    if (nextMode) {
                      if (typeof notify === 'function') notify(`📲 +91 ${phone} எண்ணிற்கு OTP 1234 அனுப்பப்பட்டது.`);
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  {isResetMode ? '← கடவுச்சொல் உள்நுழைவு (Password Login)' : '🔑 கடவுச்சொல் மறந்துவிட்டதா? OTP மூலம் மீட்டமை (Reset via OTP)'}
                </button>
              </div>
            )}

            <button
              className="button button-primary button-wide"
              type="submit"
              disabled={loading}
              style={{
                borderRadius: '10px',
                padding: '13px',
                fontSize: '13px',
                fontWeight: 800,
                background: isResetMode ? 'linear-gradient(135deg, #d97706 0%, #ca8a04 100%)' : !isExistingUser ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)' : undefined,
                marginTop: !isExistingUser ? '12px' : undefined,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading
                ? '⏳ சரிபார்க்கிறது... (Logging in...)'
                : isResetMode
                ? 'OTP சரிபார்த்து புதிய கடவுச்சொல் சேமி (Verify OTP & Login)'
                : isExistingUser
                ? 'வாடிக்கையாளர் தளம் நுழைக / Direct Login'
                : 'கணக்கு தொடங்கி உள்நுழை (Create & Login)'} <ArrowRight size={17} />
            </button>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              <small className="otp-note" style={{ margin: 0, color: '#16a34a', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={15} />
                <span>பாதுகாக்கப்பட்ட வாடிக்கையாளர் நுழைவு (SSL Encrypted)</span>
              </small>
            </div>
          </form>
        )}

        <div className="otp-support" style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
          <Phone size={13} style={{ color: '#eab308' }} /> உதவிக்கு தொடர்பு கொள்ளவும்: <strong>93423 18844</strong>
        </div>
      </div>
    </div>
  );
}
