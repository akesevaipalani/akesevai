import { useState, useEffect, useRef } from 'react';
import { ArrowRight, LockKeyhole, Phone, ShieldCheck, UserCheck, Eye, EyeOff, KeyRound, Fingerprint, ArrowLeft, UserPlus, MessageSquareCode, CheckCircle2, X, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import { sendOtpCloud, verifyOtpCloud, resendOtpCloud } from '../utils/dataService';

export default function OtpGate({ onVerified, notify, customerRecords, onClose }) {
  const [step, setStep] = useState(1); // 1: Mobile Number, 2: Password / Setup
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const isSendingOtpRef = useRef(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  // New Customer Registration Fields
  const [regName, setRegName] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');
  const [loading, setLoading] = useState(false);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCountdown]);

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ page: 'home' }, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch (e) {
        window.location.href = '/';
      }
    }
  };

  // Trigger Real SMS OTP via Server (Guarded against duplicate rapid clicks)
  const triggerSendOtp = async (cleanPhone, purpose) => {
    if (isSendingOtpRef.current) return;
    isSendingOtpRef.current = true;
    setSendingOtp(true);
    setErrorMessage('');
    try {
      const res = await sendOtpCloud(cleanPhone, purpose);
      if (res && res.success) {
        setOtpSent(true);
        setResendCountdown(res.resendCooldown || 30);
        setAttemptsRemaining(3);
        if (res.deliveryStatus && res.deliveryStatus.dispatched === false) {
          const warnMsg = res.deliveryStatus.error ? `SMS அனுப்ப முடியவில்லை: ${res.deliveryStatus.error}` : 'SMS Gateway not dispatched.';
          if (typeof notify === 'function') notify(`⚠️ ${warnMsg}`);
        } else {
          if (typeof notify === 'function') {
            notify(`📱 SMS OTP +91 ${cleanPhone.slice(0, 5)}***** எண்ணிற்கு அனுப்பப்பட்டது! (OTP sent via SMS)`);
          }
        }
      } else {
        const msg = res?.message || 'OTP அனுப்புவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.';
        if (typeof notify === 'function') notify(`⚠️ ${msg}`);
        setErrorMessage(msg);
      }
    } catch (err) {
      console.warn('OTP Dispatch Error:', err);
      if (typeof notify === 'function') notify('⚠️ OTP அனுப்புவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setSendingOtp(false);
      isSendingOtpRef.current = false;
    }
  };

  // Step 1: Validate Mobile and check if user exists
  const handleCheckPhoneStep = async (event) => {
    if (event) event.preventDefault();
    if (sendingOtp || isSendingOtpRef.current || loading) return;

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
    setOtpInput('');

    if (exists) {
      if (typeof notify === 'function') notify(`👋 நல்வரவு! +91 ${cleanedPhone} கணக்கின் கடவுச்சொல்லை உள்ளிடவும்.`);
    } else {
      if (typeof notify === 'function') notify(`✨ புதிய வாடிக்கையாளர்! விவரங்களை பூர்த்தி செய்து SMS OTP மூலம் கணக்கைத் தொடங்கவும்.`);
      // Trigger real SMS OTP generation for new user registration (single execution)
      await triggerSendOtp(cleanedPhone, 'register');
    }
  };

  // Handle Switch to Forgot Password / Reset Mode
  const handleStartPasswordReset = async () => {
    if (sendingOtp || isSendingOtpRef.current) return;
    setIsResetMode(true);
    setPassword('');
    setOtpInput('');
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone && cleanedPhone.length === 10) {
      await triggerSendOtp(cleanedPhone, 'reset_password');
    }
  };

  // Handle Resend OTP Click
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || sendingOtp || isSendingOtpRef.current) return;
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 10) return;
    await triggerSendOtp(cleanedPhone, isResetMode ? 'reset_password' : 'register');
  };

  // Step 2: Perform Login, OTP Password Reset, or New User Registration
  const handleFinalSubmit = async (event) => {
    if (event) event.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 10) return;

    // If New User Registration or Password Reset -> Validate & Verify SMS OTP with Server
    if (!isExistingUser || isResetMode) {
      const cleanOtp = otpInput.replace(/\D/g, '');
      if (!cleanOtp || (cleanOtp.length !== 4 && cleanOtp.length !== 6)) {
        if (typeof notify === 'function') notify('⚠️ தயவுசெய்து உங்கள் மொபைலுக்கு வந்த SMS OTP எண்ணை உள்ளிடவும் (Enter SMS OTP)');
        setIsError(true);
        setTimeout(() => setIsError(false), 1200);
        return;
      }

      setLoading(true);
      try {
        const verifyRes = await verifyOtpCloud(cleanedPhone, cleanOtp, isResetMode ? 'reset_password' : 'register');
        if (!verifyRes || !verifyRes.success) {
          const errMsg = verifyRes?.message || 'தவறான அல்லது காலாவதியான OTP எண். தயவுசெய்து மீண்டும் முயற்சிக்கவும்.';
          if (typeof notify === 'function') notify(`❌ ${errMsg}`);
          if (verifyRes?.attemptsRemaining !== undefined) {
            setAttemptsRemaining(verifyRes.attemptsRemaining);
          }
          setErrorMessage(errMsg);
          setIsError(true);
          setLoading(false);
          setTimeout(() => setIsError(false), 1200);
          return;
        }
      } catch (otpErr) {
        console.warn('OTP Verification Network Error:', otpErr);
        if (typeof notify === 'function') notify('⚠️ OTP சரிபார்ப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
        setIsError(true);
        setLoading(false);
        setTimeout(() => setIsError(false), 1200);
        return;
      }
    }

    if (!password || password.length < 3) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து கடவுச்சொல்லை உள்ளிடவும் (Enter password - Min 3 characters)');
      setIsError(true);
      setLoading(false);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    if (!isExistingUser) {
      if (!regName.trim()) {
        if (typeof notify === 'function') notify('⚠️ தயவுசெய்து உங்கள் பெயரை உள்ளிடவும் (Enter your Full Name)');
        setIsError(true);
        setLoading(false);
        setTimeout(() => setIsError(false), 1200);
        return;
      }
      if (!regDob) {
        if (typeof notify === 'function') notify('⚠️ தயவுசெய்து பிறந்த தேதியை உள்ளிடவும் (Enter DOB)');
        setIsError(true);
        setLoading(false);
        setTimeout(() => setIsError(false), 1200);
        return;
      }
      if (!regAadhaar || regAadhaar.replace(/\D/g, '').length !== 12) {
        if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 12-இலக்க சரியான ஆதார் எண்ணை உள்ளிடவும் (Enter 12-digit Aadhaar Number)');
        setIsError(true);
        setLoading(false);
        setTimeout(() => setIsError(false), 1200);
        return;
      }
      if (typeof notify === 'function') notify('✅ SMS OTP சரிபார்க்கப்பட்டது! புதிய கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.');
    }

    if (!loading) setLoading(true);
    try {
      if (typeof onVerified === 'function') {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), 8000)
        );
        await Promise.race([
          onVerified(cleanedPhone, password, !isExistingUser ? {
            name: regName.trim(),
            dob: regDob,
            aadhaarNo: regAadhaar.trim()
          } : null),
          timeoutPromise
        ]);
      }
    } catch (err) {
      console.warn('Registration/Login error:', err);
      if (err?.message === 'REQUEST_TIMEOUT') {
        if (typeof notify === 'function') notify('⚠️ நேர வரம்பு கடந்துவிட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும். (Request timed out, please retry)');
      } else {
        if (typeof notify === 'function') notify('⚠️ கணக்கு தொடங்குவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
      }
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

        {/* Top Header Bar with Badge & Clean Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isResetMode ? '#fef3c7' : step === 2 && !isExistingUser ? '#dcfce7' : '#e0f2fe',
            color: isResetMode ? '#b45309' : step === 2 && !isExistingUser ? '#15803d' : '#0369a1',
            padding: '5px 11px',
            borderRadius: '12px',
            fontSize: '10.5px',
            fontWeight: 800,
            letterSpacing: '0.2px',
            maxWidth: 'calc(100% - 90px)'
          }}>
            {isResetMode ? <MessageSquareCode size={14} /> : step === 2 && !isExistingUser ? <UserPlus size={14} /> : <UserCheck size={14} />}
            <span id="customer-access-badge-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isResetMode ? 'SMS OTP PASSWORD RESET' : step === 1 ? 'E-SEVAI CUSTOMER ACCESS' : isExistingUser ? 'CUSTOMER LOGIN' : 'NEW CUSTOMER REGISTRATION'}
            </span>
          </div>

          {/* Close / Exit Button */}
          <button
            type="button"
            id="customer-portal-close-btn"
            className="customer-portal-close-btn"
            onClick={handleClose}
            aria-label="முகப்புக்குத் திரும்பு / Back to Home"
            title="முகப்புக்குத் திரும்பு / Back to Home"
          >
            <X size={16} strokeWidth={2.4} />
            <span className="close-btn-label">மூடு / Close</span>
          </button>
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
              ? `+91 ${phone} எண்ணிற்கு அனுப்பப்பட்ட SMS OTP மற்றும் புதிய கடவுச்சொல்லை உள்ளிடவும்.`
              : step === 1
              ? 'உங்கள் 10-இலக்க மொபைல் எண்ணை உள்ளிட்டு அடுத்து செல்லவும்.'
              : isExistingUser
              ? `+91 ${phone} கணக்கின் கடவுச்சொல்லை உள்ளிட்டு உள்நுழையவும்.`
              : `+91 ${phone} எண்ணிற்கு SMS OTP அனுப்பப்பட்டுள்ளது. விவரங்களை பூர்த்தி செய்யவும்.`}
          </p>
        </div>

        {/* STEP 1: ENTER MOBILE NUMBER */}
        {step === 1 && (
          <form onSubmit={handleCheckPhoneStep}>
            <label htmlFor="otp-phone-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '12px', textTransform: 'uppercase' }}>
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
                  id="otp-phone-input"
                  name="customer_phone"
                  autoComplete="tel"
                  type="tel"
                  maxLength="10"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '12px 14px',
                    fontSize: '16px',
                    fontWeight: 700,
                    outline: 'none',
                    letterSpacing: '1px'
                  }}
                />
              </div>
            </label>

            <button
              id="otp-check-phone-btn"
              type="submit"
              disabled={sendingOtp || loading}
              className="button button-primary button-wide esevai-btn-glow"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: (sendingOtp || loading) ? 'wait' : 'pointer',
                opacity: (sendingOtp || loading) ? 0.75 : 1,
                boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
              }}
            >
              {sendingOtp ? 'OTP அனுப்பப்படுகிறது... (Sending OTP...)' : <>அடுத்து செல்லவும் / Next Step <ArrowRight size={17} /></>}
            </button>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#16a34a" /> 256-bit SSL & OTP பாதுகாக்கப்பட்ட வாடிக்கையாளர் நுழைவு
            </div>
          </form>
        )}

        {/* STEP 2: PASSWORD / OTP VERIFICATION & PROFILE SETUP */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>📱 +91 {phone}</span>
              <button
                type="button"
                id="otp-change-phone-btn"
                onClick={() => { setStep(1); setIsResetMode(false); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#0052cc', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                <ArrowLeft size={13} /> மாற்று (Change)
              </button>
            </div>

            {/* If New User Registration, collect Name, DOB, Aadhaar */}
            {!isExistingUser && (
              <>
                <label htmlFor="otp-reg-name" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
                  1. FULL NAME / முழு பெயர் *
                  <input
                    required
                    id="otp-reg-name"
                    name="customer_name"
                    autoComplete="name"
                    type="text"
                    placeholder="உங்கள் பெயரை உள்ளிடவும்"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>

                <label htmlFor="otp-reg-dob" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
                  2. DATE OF BIRTH / பிறந்த தேதி *
                  <input
                    required
                    id="otp-reg-dob"
                    name="customer_dob"
                    autoComplete="bday"
                    type="date"
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginTop: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>

                <label htmlFor="otp-reg-aadhaar" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '12px', textTransform: 'uppercase' }}>
                  3. 12-DIGIT AADHAAR / ஆதார் எண் *
                  <input
                    required
                    id="otp-reg-aadhaar"
                    name="customer_aadhaar"
                    autoComplete="off"
                    type="text"
                    maxLength="14"
                    placeholder="5678 9012 3456"
                    value={regAadhaar}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 12);
                      const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
                      setRegAadhaar(formatted);
                    }}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      marginTop: '4px',
                      boxSizing: 'border-box',
                      letterSpacing: '1px'
                    }}
                  />
                </label>
              </>
            )}

            {/* Real SMS OTP Field for New User or Password Reset */}
            {(!isExistingUser || isResetMode) && (
              <div style={{ marginBottom: '14px', background: '#f0fdf4', padding: '12px', borderRadius: '10px', border: '1.5px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="otp-reg-otp" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                    📱 SMS OTP / ஒருமுறை கடவுச்சொல் *
                  </label>
                  <span style={{ fontSize: '10.5px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> 5 நிமிடம் (5m valid)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    required
                    id="otp-reg-otp"
                    name="customer_otp"
                    type="tel"
                    maxLength="6"
                    autoComplete="one-time-code"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value.replace(/\D/g, ''));
                      setErrorMessage('');
                    }}
                    placeholder="• • • • • •"
                    style={{
                      width: '130px',
                      border: errorMessage ? '1.5px solid #ef4444' : '1.5px solid #86efac',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '17px',
                      fontWeight: 800,
                      textAlign: 'center',
                      letterSpacing: '4px',
                      background: '#ffffff'
                    }}
                  />

                  {/* Resend Timer / Button */}
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {resendCountdown > 0 ? (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                        மீண்டும் அனுப்ப: <strong style={{ color: '#0f172a' }}>00:{String(resendCountdown).padStart(2, '0')}</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        id="otp-resend-btn"
                        onClick={handleResendOtp}
                        disabled={sendingOtp}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #16a34a',
                          color: '#15803d',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: sendingOtp ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RefreshCw size={12} className={sendingOtp ? 'spin' : ''} />
                        {sendingOtp ? 'அனுப்பப்படுகிறது...' : 'மீண்டும் OTP அனுப்ப'}
                      </button>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div id="otp-error-msg" style={{ marginTop: '6px', fontSize: '11px', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={13} /> {errorMessage}
                  </div>
                )}
              </div>
            )}

            {/* Password Input */}
            <label htmlFor="otp-password-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '14px', textTransform: 'uppercase' }}>
              {isExistingUser && !isResetMode ? 'PASSWORD / கடவுச்சொல் *' : 'CREATE PASSWORD / புதிய கடவுச்சொல் *'}
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <input
                  required
                  id="otp-password-input"
                  name="customer_password"
                  autoComplete={isExistingUser && !isResetMode ? "current-password" : "new-password"}
                  autoFocus={isExistingUser && !isResetMode}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isExistingUser && !isResetMode ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'புதிய கடவுச்சொல்லை உருவாக்கவும்'}
                  style={{
                    width: '100%',
                    border: isError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '11px 40px 11px 12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {/* Forgot Password Link for Existing Users */}
            {isExistingUser && !isResetMode && (
              <div style={{ textAlign: 'right', marginBottom: '14px', marginTop: '-6px' }}>
                <button
                  type="button"
                  id="otp-forgot-pass-btn"
                  onClick={handleStartPasswordReset}
                  style={{ background: 'none', border: 'none', color: '#d97706', fontSize: '11px', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  கடவுச்சொல் மறந்துவிட்டதா? (Reset Password via SMS OTP)
                </button>
              </div>
            )}

            <button
              id="otp-final-submit-btn"
              type="submit"
              disabled={loading}
              className="button button-primary button-wide esevai-btn-glow"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: isExistingUser && !isResetMode ? 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)' : 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
              }}
            >
              {loading ? (
                <span>சரிபார்க்கப்படுகிறது... (Verifying...)</span>
              ) : isResetMode ? (
                <>கடவுச்சொல் மாற்றி உள்நுழைக <KeyRound size={17} /></>
              ) : isExistingUser ? (
                <>உள்நுழைக / Customer Login <ArrowRight size={17} /></>
              ) : (
                <>கணக்கைத் தொடங்குக / Complete Registration <UserPlus size={17} /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
