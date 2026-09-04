import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  UserCheck,
  KeyRound,
  Fingerprint,
  ArrowLeft,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  RefreshCw,
  Clock,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import {
  sendOtpCloud,
  verifyOtpCloud,
  loginCustomerPasswordCloud,
  registerCustomerCloud,
  setCustomerPasswordCloud
} from '../utils/dataService';

export default function OtpGate({ onVerified, notify, onClose }) {
  // Mode: 'login' | 'register' | 'forgot_password' | 'migrate_password'
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1); // For register/forgot_password/migrate: 1: Phone, 2: OTP, 3: Details/Password

  // Inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [verifiedToken, setVerifiedToken] = useState(null);

  // New Customer Registration Fields (Step 3)
  const [regName, setRegName] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');

  // UI state
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const isSendingOtpRef = useRef(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

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

  const getCleanPhone = () => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
  };

  // --- 1. EXISTING CUSTOMER PASSWORD LOGIN (NO OTP REQUESTED) ---
  const handlePasswordLogin = async (event) => {
    if (event) event.preventDefault();
    if (loading) return;

    const cleanPhone = getCleanPhone();
    if (cleanPhone.length !== 10) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 10-இலக்க மொபைல் எண்ணை உள்ளிடவும் (Enter valid 10-digit mobile number)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    if (!password) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து உங்கள் கடவுச்சொல்லை உள்ளிடவும் (Enter password)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    let res = null;
    try {
      res = await loginCustomerPasswordCloud(cleanPhone, password);
    } catch (err) {
      console.warn('Customer Login Error:', err);
      if (typeof notify === 'function') notify('⚠️ உள்நுழைவில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      setLoading(false);
      return;
    }

    try {
      if (res && res.success && res.customer) {
        const custName = res.customer.profile?.name || res.customer.name || 'வாடிக்கையாளர்';
        if (typeof notify === 'function') {
          notify(`👋 நல்வரவு ${custName}! உங்கள் கணக்கு வெற்றிகரமாக திறக்கப்படுகிறது...`);
        }
        if (typeof onVerified === 'function') {
          try {
            await onVerified(cleanPhone, res.customer, null);
          } catch (postLoginErr) {
            console.warn('Post-login transition non-fatal warning:', postLoginErr);
          }
        }
        return;
      }

      // Check if existing customer has no password set (legacy OTP migration)
      if (res && res.error === 'PASSWORD_NOT_SET') {
        if (typeof notify === 'function') {
          notify('🔑 உங்கள் கணக்கிற்கு கடவுச்சொல் அமைக்கப்படவில்லை. SMS OTP மூலம் புதிய கடவுச்சொல் அமைக்கவும்.');
        }
        setMode('migrate_password');
        setStep(2);
        await triggerSendOtp(cleanPhone, 'reset_password');
        return;
      }

      const errMsg = res?.message || 'தவறான மொபைல் எண் அல்லது கடவுச்சொல். தயவுசெய்து சரிபார்க்கவும்.';
      if (typeof notify === 'function') notify(`❌ ${errMsg}`);
      setErrorMessage(errMsg);
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. TRIGGER REAL SMS OTP VIA SERVER ---
  const triggerSendOtp = async (cleanDigits, purpose = 'auth') => {
    if (isSendingOtpRef.current) return;
    isSendingOtpRef.current = true;
    setSendingOtp(true);
    setErrorMessage('');
    try {
      const res = await sendOtpCloud(cleanDigits, purpose);
      if (res && res.success) {
        setResendCountdown(res.resendCooldown || 30);
        setAttemptsRemaining(3);
        if (res.deliveryStatus && res.deliveryStatus.dispatched === false) {
          const warnMsg = res.deliveryStatus.error ? `SMS அனுப்ப முடியவில்லை: ${res.deliveryStatus.error}` : 'SMS Gateway not dispatched.';
          if (typeof notify === 'function') notify(`⚠️ ${warnMsg}`);
        } else {
          if (typeof notify === 'function') {
            notify(`📱 SMS OTP +91 ${cleanDigits.slice(0, 5)}***** எண்ணிற்கு அனுப்பப்பட்டது!`);
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

  // --- 3. START OTP FLOW (FOR REGISTRATION / FORGOT PASSWORD) ---
  const handleStartOtpFlow = async (event) => {
    if (event) event.preventDefault();
    if (sendingOtp || isSendingOtpRef.current || loading) return;

    const cleanDigits = getCleanPhone();
    if (cleanDigits.length !== 10) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 10-இலக்க மொபைல் எண்ணை உள்ளிடவும் (Enter valid 10-digit mobile number)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    setOtpInput('');
    setErrorMessage('');
    setStep(2);

    const purpose = mode === 'register' ? 'register' : 'reset_password';
    await triggerSendOtp(cleanDigits, purpose);
  };

  // --- 4. VERIFY OTP STEP ---
  const handleVerifyOtp = async (event) => {
    if (event) event.preventDefault();
    const cleanDigits = getCleanPhone();
    if (cleanDigits.length !== 10) return;

    const cleanOtp = otpInput.replace(/\D/g, '');
    if (!cleanOtp || (cleanOtp.length !== 4 && cleanOtp.length !== 6)) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 6-இலக்க SMS OTP எண்ணை உள்ளிடவும் (Enter 6-digit SMS OTP)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const purpose = mode === 'register' ? 'register' : 'reset_password';
      const verifyRes = await verifyOtpCloud(cleanDigits, cleanOtp, purpose);

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

      setVerifiedToken(verifyRes.verifiedToken || verifyRes.customerToken || 'verified');

      if (verifyRes.customerToken) {
        try {
          sessionStorage.setItem('akesevai-customer-token', verifyRes.customerToken);
          localStorage.setItem('akesevai-customer-token', verifyRes.customerToken);
        } catch (e) {}
      }

      if (typeof notify === 'function') {
        notify('✅ OTP வெற்றிகரமாக சரிபார்க்கப்பட்டது!');
      }

      // Advance to Password / Profile creation step
      setPassword('');
      setConfirmPassword('');
      setStep(3);
    } catch (otpErr) {
      console.warn('OTP Verification Network Error:', otpErr);
      if (typeof notify === 'function') notify('⚠️ OTP சரிபார்ப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  // --- 5. NEW CUSTOMER REGISTRATION SUBMISSION (WITH PASSWORD) ---
  const handleCompleteRegistration = async (event) => {
    if (event) event.preventDefault();
    const cleanDigits = getCleanPhone();
    if (cleanDigits.length !== 10) return;

    if (!regName.trim()) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து உங்கள் பெயரை உள்ளிடவும் (Enter your Full Name)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }
    if (!regDob) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து பிறந்த தேதியை உள்ளிடவும் (Enter Date of Birth)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }
    const cleanAadhaar = regAadhaar.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து 12-இலக்க சரியான ஆதார் எண்ணை உள்ளிடவும் (Enter valid 12-digit Aadhaar Number)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }
    if (!password || password.length < 4) {
      if (typeof notify === 'function') notify('⚠️ கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும் (Password min 4 chars)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }
    if (password !== confirmPassword) {
      if (typeof notify === 'function') notify('⚠️ கடவுச்சொற்கள் பொருந்தவில்லை (Passwords do not match)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    setLoading(true);
    try {
      const regRes = await registerCustomerCloud(cleanDigits, verifiedToken, {
        name: regName.trim(),
        dob: regDob,
        aadhaarNo: cleanAadhaar,
        password: password.trim()
      });

      if (!regRes || !regRes.success) {
        const errMsg = regRes?.message || 'கணக்கு தொடங்குவதில் பிழை ஏற்பட்டது.';
        if (typeof notify === 'function') notify(`❌ ${errMsg}`);
        setIsError(true);
        setTimeout(() => setIsError(false), 1200);
        return;
      }

      if (typeof notify === 'function') {
        notify('✅ புதிய கணக்கு மற்றும் கடவுச்சொல் வெற்றிகரமாக உருவாக்கப்பட்டது! உங்கள் தளம் திறக்கிறது...');
      }

      if (typeof onVerified === 'function') {
        await onVerified(cleanDigits, regRes.customer, {
          name: regName.trim(),
          dob: regDob,
          aadhaarNo: cleanAadhaar
        });
      }
    } catch (err) {
      console.warn('Registration error:', err);
      if (typeof notify === 'function') notify('⚠️ கணக்கு தொடங்குவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  // --- 6. SET / RESET PASSWORD SUBMISSION (POST-OTP VERIFIED) ---
  const handleSetPasswordSubmit = async (event) => {
    if (event) event.preventDefault();
    const cleanDigits = getCleanPhone();
    if (cleanDigits.length !== 10) return;

    if (!password || password.length < 4) {
      if (typeof notify === 'function') notify('⚠️ புதிய கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும் (Password min 4 chars)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }
    if (password !== confirmPassword) {
      if (typeof notify === 'function') notify('⚠️ கடவுச்சொற்கள் பொருந்தவில்லை (Passwords do not match)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    setLoading(true);
    try {
      const resetRes = await setCustomerPasswordCloud(cleanDigits, verifiedToken, password.trim());

      if (!resetRes || !resetRes.success) {
        const errMsg = resetRes?.message || 'கடவுச்சொல் அமைப்பதில் பிழை ஏற்பட்டது.';
        if (typeof notify === 'function') notify(`❌ ${errMsg}`);
        setIsError(true);
        setTimeout(() => setIsError(false), 1200);
        return;
      }

      if (typeof notify === 'function') {
        notify('✅ புதிய கடவுச்சொல் வெற்றிகரமாக அமைக்கப்பட்டது! உங்கள் தளம் திறக்கிறது...');
      }

      if (typeof onVerified === 'function') {
        await onVerified(cleanDigits, resetRes.customer, null);
      }
    } catch (err) {
      console.warn('Password Set Error:', err);
      if (typeof notify === 'function') notify('⚠️ கடவுச்சொல் அமைப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-gate" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className={`otp-gate-card ${isError ? 'esevai-shake' : ''}`}>
        {/* Top Header Bar with Badge & Clean Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: mode === 'register' ? '#dcfce7' : '#e0f2fe',
            color: mode === 'register' ? '#15803d' : '#0369a1',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.2px',
            maxWidth: 'calc(100% - 54px)'
          }}>
            {mode === 'register' ? <UserPlus size={14} /> : <UserCheck size={14} />}
            <span id="customer-access-badge-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mode === 'login'
                ? 'CUSTOMER PASSWORD LOGIN'
                : mode === 'register'
                ? (step === 3 ? 'CREATE PASSWORD & REGISTER' : 'NEW CUSTOMER REGISTRATION')
                : (step === 3 ? 'SET NEW PASSWORD' : 'FORGOT PASSWORD RECOVERY')}
            </span>
          </div>

          {/* Close / Exit Button */}
          <button
            type="button"
            id="customer-portal-close-btn"
            className="customer-portal-close-btn"
            onClick={handleClose}
            aria-label="மூடு / Close"
            title="மூடு / Close"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: mode === 'register' ? 'linear-gradient(135deg, #16a34a 0%, #059669 100%)' : 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
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
            {mode === 'login'
              ? 'உங்கள் 10-இலக்க மொபைல் எண் மற்றும் கடவுச்சொல் மூலம் நுழையவும்.'
              : mode === 'register'
              ? (step === 1 ? 'புதிய கணக்கு தொடங்க உங்கள் மொபைல் எண்ணை உள்ளிடவும்.' : step === 2 ? `+91 ${phone} எண்ணிற்கு அனுப்பப்பட்ட SMS OTP-ஐ உள்ளிடவும்.` : 'உங்கள் விவரங்கள் மற்றும் புதிய கடவுச்சொல்லை அமைக்கவும்.')
              : (step === 1 ? 'கடவுச்சொல்லை மாற்ற உங்கள் மொபைல் எண்ணை உள்ளிடவும்.' : step === 2 ? `+91 ${phone} எண்ணிற்கு அனுப்பப்பட்ட SMS OTP-ஐ உள்ளிடவும்.` : 'புதிய கடவுச்சொல்லை உள்ளிட்டு மாற்றவும்.')}
          </p>
        </div>

        {/* ======================================================== */}
        {/* MODE 1: EXISTING CUSTOMER LOGIN (MOBILE + PASSWORD ONLY) */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <form onSubmit={handlePasswordLogin}>
            {/* Mobile Number Field */}
            <label htmlFor="customer-login-phone" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
              MOBILE NUMBER / மொபைல் எண் *
              <div style={{
                display: 'flex',
                border: isError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '4px',
                background: '#ffffff'
              }}>
                <span style={{ background: '#f1f5f9', color: '#0f172a', padding: '11px 14px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center' }}>+91</span>
                <input
                  autoFocus
                  required
                  id="customer-login-phone"
                  name="customer_phone"
                  autoComplete="tel"
                  type="tel"
                  maxLength="10"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '11px 14px',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none',
                    letterSpacing: '1px'
                  }}
                />
              </div>
            </label>

            {/* Password Field */}
            <label htmlFor="customer-login-password" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
              PASSWORD / கடவுச்சொல் *
              <div style={{
                display: 'flex',
                border: isError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '4px',
                background: '#ffffff',
                alignItems: 'center'
              }}>
                <input
                  required
                  id="customer-login-password"
                  name="customer_password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="உங்கள் கடவுச்சொல்"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '11px 14px',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', padding: '0 12px', color: '#64748b', cursor: 'pointer' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: '14px' }}>
              <button
                type="button"
                id="customer-forgot-password-btn"
                onClick={() => { setMode('forgot_password'); setStep(1); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#0052cc', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                கடவுச்சொல் மறந்துவிட்டதா? (Forgot Password?)
              </button>
            </div>

            {errorMessage && (
              <div id="customer-login-error-msg" style={{ marginBottom: '12px', fontSize: '11.5px', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} /> {errorMessage}
              </div>
            )}

            {/* Login Submit Button */}
            <button
              id="customer-password-login-btn"
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
                background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
              }}
            >
              {loading ? 'உள்நுழைகிறது... (Logging in...)' : <>உள்நுழைக / Customer Login <ArrowRight size={17} /></>}
            </button>

            {/* New Customer Account Creation Link */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <button
                type="button"
                id="customer-goto-register-btn"
                onClick={() => { setMode('register'); setStep(1); setErrorMessage(''); }}
                style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  color: '#15803d',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  width: '100%',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <UserPlus size={16} /> புதிய வாடிக்கையாளரா? கணக்கைத் தொடங்குக
              </button>
            </div>

            <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#16a34a" /> 256-bit SSL & PBKDF2 பாதுகாக்கப்பட்ட வாடிக்கையாளர் தளம்
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 2 / 3 / 4: OTP BASED (REGISTRATION, FORGOT PASSWORD, OR MIGRATION)  */}
        {/* ========================================================================= */}
        {mode !== 'login' && (
          <div>
            {/* STEP 1: ENTER MOBILE NUMBER FOR OTP */}
            {step === 1 && (
              <form onSubmit={handleStartOtpFlow}>
                <label htmlFor="otp-step1-phone" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '12px', textTransform: 'uppercase' }}>
                  MOBILE NUMBER / மொபைல் எண் *
                  <div style={{
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
                      id="otp-step1-phone"
                      name="customer_phone"
                      autoComplete="tel"
                      type="tel"
                      maxLength="10"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrorMessage(''); }}
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

                {errorMessage && (
                  <div style={{ marginBottom: '12px', fontSize: '11.5px', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} /> {errorMessage}
                  </div>
                )}

                <button
                  id="otp-send-submit-btn"
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
                    background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: (sendingOtp || loading) ? 'wait' : 'pointer',
                    boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
                  }}
                >
                  {sendingOtp ? 'OTP அனுப்பப்படுகிறது... (Sending OTP...)' : <>SMS OTP பெறுக / Get SMS OTP <ArrowRight size={17} /></>}
                </button>

                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setStep(1); setErrorMessage(''); }}
                    style={{ background: 'none', border: 'none', color: '#0052cc', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ArrowLeft size={14} /> ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக (Back to Login)
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER SMS OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>📱 +91 {phone}</span>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setErrorMessage(''); }}
                    style={{ background: 'none', border: 'none', color: '#0052cc', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    <ArrowLeft size={13} /> மாற்று (Change)
                  </button>
                </div>

                <div style={{ marginBottom: '14px', background: '#f0fdf4', padding: '12px', borderRadius: '10px', border: '1.5px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label htmlFor="otp-verification-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      📱 6-DIGIT SMS OTP *
                    </label>
                    <span style={{ fontSize: '10.5px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> 5 நிமிடம் (5m valid)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      autoFocus
                      required
                      id="otp-verification-input"
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
                          onClick={() => triggerSendOtp(getCleanPhone(), mode === 'register' ? 'register' : 'reset_password')}
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

                <button
                  id="otp-verify-submit-btn"
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
                    background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
                  }}
                >
                  {loading ? 'சரிபார்க்கப்படுகிறது... (Verifying...)' : <>சரிபார்த்து தொடர்க / Verify OTP <CheckCircle2 size={17} /></>}
                </button>
              </form>
            )}

            {/* STEP 3A: NEW CUSTOMER REGISTRATION FORM (NAME + DOB + AADHAAR + CREATE PASSWORD) */}
            {step === 3 && mode === 'register' && (
              <form onSubmit={handleCompleteRegistration}>
                <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>📱 +91 {phone} (OTP சரிபார்க்கப்பட்டது ✅)</span>
                </div>

                <label htmlFor="reg-name-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
                  1. FULL NAME / முழு பெயர் *
                  <input
                    autoFocus
                    required
                    id="reg-name-input"
                    name="customer_name"
                    type="text"
                    placeholder="உங்கள் பெயர்"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{ width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13.5px', fontWeight: 700, marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <label htmlFor="reg-dob-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                    2. BIRTH DATE *
                    <input
                      required
                      id="reg-dob-input"
                      name="customer_dob"
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '8px 10px', fontSize: '12.5px', fontWeight: 700, marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </label>

                  <label htmlFor="reg-aadhaar-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                    3. 12-DIGIT AADHAAR *
                    <input
                      required
                      id="reg-aadhaar-input"
                      name="customer_aadhaar"
                      type="text"
                      maxLength="14"
                      placeholder="5678 9012 3456"
                      value={regAadhaar}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 12);
                        const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
                        setRegAadhaar(formatted);
                      }}
                      style={{ width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '8px 10px', fontSize: '12.5px', fontWeight: 700, marginTop: '4px', boxSizing: 'border-box', letterSpacing: '1px' }}
                    />
                  </label>
                </div>

                {/* Create Password */}
                <label htmlFor="reg-password-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
                  4. CREATE PASSWORD / கடவுச்சொல் *
                  <div style={{ display: 'flex', border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginTop: '4px', alignItems: 'center' }}>
                    <input
                      required
                      id="reg-password-input"
                      name="create_password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="குறைந்தது 4 எழுத்துக்கள்"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ flex: 1, border: 'none', padding: '9px 12px', fontSize: '13.5px', fontWeight: 700, outline: 'none' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', padding: '0 10px', color: '#64748b', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                {/* Confirm Password */}
                <label htmlFor="reg-confirm-password-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '14px', textTransform: 'uppercase' }}>
                  5. CONFIRM PASSWORD / உறுதி செய்க *
                  <input
                    required
                    id="reg-confirm-password-input"
                    name="confirm_password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="மீண்டும் கடவுச்சொல்லை உள்ளிடவும்"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', fontSize: '13.5px', fontWeight: 700, marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </label>

                <button
                  id="reg-final-submit-btn"
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
                    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
                  }}
                >
                  {loading ? 'கணக்கு தொடங்கப்படுகிறது...' : <>கணக்கைத் தொடங்குக / Complete Registration <UserPlus size={17} /></>}
                </button>
              </form>
            )}

            {/* STEP 3B: SET / RESET PASSWORD FORM (FOR FORGOT PASSWORD & MIGRATION) */}
            {step === 3 && mode !== 'register' && (
              <form onSubmit={handleSetPasswordSubmit}>
                <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>📱 +91 {phone} (OTP சரிபார்க்கப்பட்டது ✅)</span>
                </div>

                <label htmlFor="reset-new-password-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
                  NEW PASSWORD / புதிய கடவுச்சொல் *
                  <div style={{ display: 'flex', border: '1.5px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginTop: '4px', alignItems: 'center' }}>
                    <input
                      autoFocus
                      required
                      id="reset-new-password-input"
                      name="new_password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="புதிய கடவுச்சொல் (குறைந்தது 4 எழுத்துக்கள்)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ flex: 1, border: 'none', padding: '10px 12px', fontSize: '14px', fontWeight: 700, outline: 'none' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', padding: '0 10px', color: '#64748b', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label htmlFor="reset-confirm-password-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '14px', textTransform: 'uppercase' }}>
                  CONFIRM PASSWORD / கடவுச்சொல்லை உறுதி செய்க *
                  <input
                    required
                    id="reset-confirm-password-input"
                    name="confirm_new_password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="மீண்டும் புதிய கடவுச்சொல்"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontWeight: 700, marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </label>

                <button
                  id="reset-password-submit-btn"
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
                    background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 6px 18px rgba(0, 82, 204, 0.28)'
                  }}
                >
                  {loading ? 'கடவுச்சொல் மாற்றப்படுகிறது...' : <>கடவுச்சொல்லை அமைத்து உள்நுழைக <KeyRound size={17} /></>}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
