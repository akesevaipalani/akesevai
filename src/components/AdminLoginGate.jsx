import React, { useState } from 'react';
import { LockKeyhole, ArrowRight, ShieldCheck, Eye, EyeOff, KeyRound, Cpu, Sparkles, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';

export default function AdminLoginGate({ login, notify, navigate, resetAdminPassword }) {
  const [password, setPassword] = useState('');
  const [operatorId, setOperatorId] = useState('TN-ESEVAI-OP847');
  const [masterPhone, setMasterPhone] = useState('9342318844');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (isResetMode) {
      if (typeof resetAdminPassword === 'function') {
        const resetOk = await resetAdminPassword(masterPhone, password);
        if (resetOk) {
          setIsResetMode(false);
          await login(password);
        } else {
          setIsError(true);
          setTimeout(() => setIsError(false), 1200);
        }
      }
      return;
    }

    if (!password) {
      notify('⚠️ தயவுசெய்து அட்மின் கடவுச்சொல்லை உள்ளிடவும் (Please enter admin password)');
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
      return;
    }

    setIsAuthenticating(true);
    setIsError(false);

    try {
      const success = await login(password);
      setIsAuthenticating(false);
      if (success) {
        setIsSuccess(true);
      } else {
        setIsError(true);
        setTimeout(() => setIsError(false), 1200);
      }
    } catch (err) {
      setIsAuthenticating(false);
      setIsError(true);
      setTimeout(() => setIsError(false), 1200);
    }
  };

  const handleQuickDemoLogin = () => {
    setPassword('admin123');
    setIsAuthenticating(true);
    setTimeout(() => {
      login('admin123');
      setIsAuthenticating(false);
      setIsSuccess(true);
      notify('⚡ 1-Click Demo Admin Login Verified!');
    }, 400);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 82px)',
      background: 'radial-gradient(circle at 50% 20%, #0f2b48 0%, #06192a 50%, #030b14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      position: 'relative',
      overflow: 'hidden',
      color: '#f8fafc'
    }}>
      {/* Background Cyber Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* Ambient Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* Main Admin Kiosk Login Card */}
      <div className={`esevai-scan-container ${isError ? 'esevai-shake' : ''} ${isSuccess ? 'esevai-seal-animate' : ''}`} style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isError ? '2px solid #ef4444' : isSuccess ? '2px solid #10b981' : '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '24px',
        padding: '36px 30px',
        boxShadow: isError
          ? '0 0 40px rgba(239, 68, 68, 0.4)'
          : isSuccess
            ? '0 0 50px rgba(16, 185, 129, 0.45)'
            : '0 25px 70px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
      }}>

        {/* Biometric Laser Scanner Line */}
        {isAuthenticating && <div className="esevai-scan-laser" />}
        {isError && <div className="esevai-scan-laser-error" />}

        {/* Top Header Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.05em'
          }}>
            <ShieldCheck size={15} /> TNeGA E-SEVAI KIOSK ADMIN
          </div>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            color: '#38bdf8',
            fontSize: '11px',
            fontWeight: 700
          }}>
            <Cpu size={14} className="esevai-spin-slow" /> Terminal v2.5
          </span>
        </div>

        {/* Fingerprint / Biometric Icon Graphic */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            margin: '0 auto 16px',
            borderRadius: '20px',
            background: isError
              ? 'radial-gradient(circle, #7f1d1d 0%, #450a0a 100%)'
              : isSuccess
                ? 'radial-gradient(circle, #064e3b 0%, #022c22 100%)'
                : 'radial-gradient(circle, #0c4a6e 0%, #032b45 100%)',
            border: isError ? '2px solid #f87171' : isSuccess ? '2px solid #34d399' : '2px solid #38bdf8',
            display: 'grid',
            placeItems: 'center',
            color: isError ? '#f87171' : isSuccess ? '#34d399' : '#38bdf8',
            boxShadow: isError
              ? '0 0 25px rgba(239, 68, 68, 0.5)'
              : '0 0 30px rgba(56, 189, 248, 0.35)',
            position: 'relative'
          }} className={isSuccess ? 'esevai-seal-animate' : 'esevai-rfid-pulse'}>
            {isSuccess ? <CheckCircle2 size={36} /> : isError ? <AlertTriangle size={36} /> : <Fingerprint size={36} />}
          </div>

          <h1 style={{ font: '800 24px/1.2 Manrope, sans-serif', color: '#ffffff', margin: '0 0 6px' }}>
            நிர்வாகி உள்நுழைவு <span style={{ color: '#38bdf8' }}>(Admin Login)</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            AkEsevai சேவை மைய மேலாண்மை தளத்திற்கான அங்கீகரிக்கப்பட்ட முகவர் நுழைவு.
          </p>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit}>
          {/* Operator Station ID (Readonly Display) */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="admin-operator-id-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              🆔 OPERATOR STATION ID / முகவர் எண்
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#e2e8f0',
              fontSize: '13px',
              fontWeight: 700
            }}>
              <KeyRound size={16} style={{ color: '#38bdf8', marginRight: '10px' }} />
              <input
                id="admin-operator-id-input"
                name="admin_operator_id"
                autoComplete="username"
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontWeight: 700,
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Reset Mode: Master Phone Verification */}
          {isResetMode && (
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="admin-master-phone-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#fbbf24', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                📱 ADMIN MASTER PHONE / பிரதான மொபைல் எண் (9342318844) *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1.5px solid #fbbf24',
                borderRadius: '12px',
                padding: '4px 6px 4px 14px'
              }}>
                <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '13px', marginRight: '8px' }}>+91</span>
                <input
                  id="admin-master-phone-input"
                  name="admin_master_phone"
                  autoComplete="tel"
                  required
                  type="tel"
                  value={masterPhone}
                  onChange={(e) => setMasterPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit Master Mobile"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    width: '100%',
                    padding: '10px 0'
                  }}
                />
              </div>
            </div>
          )}

          {/* Admin Password Input with Eye Toggle */}
          <div style={{ marginBottom: '14px' }}>
            <label htmlFor="admin-login-password-input" style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isResetMode ? '🔑 NEW ADMIN PASSWORD / புதிய கடவுச்சொல்' : '🔒 ADMIN PASSWORD / கடவுச்சொல்'}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.9)',
              border: isError ? '1.5px solid #ef4444' : isResetMode ? '1.5px solid #38bdf8' : '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '12px',
              padding: '4px 6px 4px 14px',
              transition: 'all 0.2s ease'
            }}>
              <LockKeyhole size={18} style={{ color: isError ? '#ef4444' : '#38bdf8', marginRight: '10px' }} />
              <input
                id="admin-login-password-input"
                name="admin_login_password"
                autoComplete={isResetMode ? "new-password" : "current-password"}
                autoFocus
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isResetMode ? 'புதிய அட்மின் கடவுச்சொல் உள்ளிடவும்' : 'கடவுச்சொல் உள்ளிடவும் (Enter password)'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '15px',
                  width: '100%',
                  padding: '10px 0'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '8px',
                  cursor: 'pointer'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Toggle Password Reset Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => setIsResetMode(!isResetMode)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
            >
              {isResetMode ? '← அட்மின் உள்நுழைவு (Login mode)' : '🔑 கடவுச்சொல் மறந்துவிட்டதா? (Reset Password)'}
            </button>
            {isResetMode && (
              <button
                type="button"
                onClick={() => {
                  if (typeof resetAdminPassword === 'function') {
                    resetAdminPassword('9342318844', 'admin123');
                    setIsResetMode(false);
                    login('admin123');
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                ⚡ 1-Click Restore Default (admin123)
              </button>
            )}
          </div>

          {/* Primary Login / Reset Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: isResetMode ? 'linear-gradient(135deg, #0284c7 0%, #16a34a 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              cursor: isAuthenticating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            {isAuthenticating ? (
              <span>⏳ சரிபார்க்கிறது... (Authenticating...)</span>
            ) : isResetMode ? (
              <>
                கடவுச்சொல் சேமித்து நுழைக (Save & Open Admin) <ArrowRight size={18} />
              </>
            ) : (
              <>
                அட்மின் தளம் நுழைக (Open Admin Dashboard) <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Live Status Bar */}
        <div style={{
          marginTop: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748b',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          paddingTop: '14px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4ade80' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} /> TNeGA Cloud Active
          </span>
          <span>SSL 256-bit Encrypted</span>
        </div>
      </div>
    </div>
  );
}
