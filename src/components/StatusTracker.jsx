import { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, FileCheck2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { getStoredApplications } from '../utils/statusStore';
import {
  fetchAllCloudRecords,
  fetchPublicAppStatusCloud,
  fetchTrackByMobileCloud,
  sendOtpCloud,
  verifyOtpCloud
} from '../utils/dataService';

export default function StatusTracker({ initialQuery = '', lang = 'ta' }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchedApps, setSearchedApps] = useState([]);
  const [searchedTokens, setSearchedTokens] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [cloudData, setCloudData] = useState({ customers: {}, tokens: [], applications: {} });
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification for Mobile Tracking
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [trackingToken, setTrackingToken] = useState('');

  // Resend OTP Countdown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    // Initial fetch from cloud
    fetchAllCloudRecords().then((res) => {
      if (res) setCloudData(res);
    });

    // Re-search when admin updates application data locally
    const handleDataChanged = () => {
      const freshLocal = getStoredApplications() || {};
      setCloudData((prev) => {
        const merged = { ...(prev.applications || {}) };
        Object.keys(freshLocal).forEach((k) => {
          if (!freshLocal[k]) return;
          const targetStage = Number(freshLocal[k]?.currentStage || freshLocal[k]?.stage || 1);
          merged[k] = {
            ...(merged[k] || {}),
            ...freshLocal[k],
            currentStage: targetStage,
            stage: targetStage
          };
        });
        return { ...prev, applications: merged };
      });
    };
    window.addEventListener('akesevai-data-changed', handleDataChanged);

    return () => {
      window.removeEventListener('akesevai-data-changed', handleDataChanged);
    };
  }, []);

  // Helper for stage info fallback
  const getTrackingStageInfo = (stageNum) => {
    const num = Number(stageNum || 1);
    const stageInfoMap = {
      1: { statusLabel: 'Application Submitted (விண்ணப்பம் பெறப்பட்டது)', statusColor: '#3b82f6', remarks: 'AkEsevai மையத்தில் விண்ணப்பம் பதிவு செய்யப்பட்டு பெறப்பட்டுள்ளது.' },
      2: { statusLabel: 'Document Verification (ஆவணங்கள் சரிபார்க்கப்படுகிறது)', statusColor: '#0284c7', remarks: 'வாடிக்கையாளர் பதிவேற்றிய ஆவணங்கள் சரிபார்க்கப்பட்டு வருகின்றன.' },
      3: { statusLabel: 'Document Pending (கூடுதல் ஆவணம் தேவை)', statusColor: '#d97706', remarks: 'விண்ணப்பத்தை தொடர வாடிக்கையாளரிடமிருந்து கூடுதல் ஆவணம் தேவைப்படுகிறது.' },
      4: { statusLabel: 'Under Process / Fee Paid (செயலாக்கத்தில் உள்ளது)', statusColor: '#0052cc', remarks: 'அரசு கட்டணம் செலுத்தப்பட்டு இணையதளத்தில் தாக்கல் செய்யப்பட்டுள்ளது.' },
      5: { statusLabel: 'Officer Review (அதிகாரி பரிசீலனையில் உள்ளது)', statusColor: '#8b5cf6', remarks: 'அரசு அதிகாரி / VAO / RI கள ஆய்வு மற்றும் பரிசீலனையில் உள்ளது.' },
      6: { statusLabel: 'Approved & Completed (சான்றிதழ் தயார் / நிறைவடைந்தது)', statusColor: '#16a34a', remarks: 'விண்ணப்பம் வெற்றிகரமாக ஒப்புதல் பெறப்பட்டு சான்றிதழ் தயாராக உள்ளது.' },
      7: { statusLabel: 'Rejected (விண்ணப்பம் நிராகரிக்கப்பட்டது)', statusColor: '#ef4444', remarks: 'அரசு விதிமுறைகளுக்கு உட்படாததால் விண்ணப்பம் நிராகரிக்கப்பட்டது.' }
    };
    return stageInfoMap[num] || stageInfoMap[1];
  };

  const sendTrackingOtp = async (targetPhone) => {
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await sendOtpCloud(targetPhone, 'track');
      if (res && res.success) {
        setOtpSent(true);
        setResendCooldown(res.resendCooldown || 60);
      } else {
        setOtpError(res?.message || (lang === 'ta' ? 'OTP அனுப்புவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Failed to send OTP. Please try again.'));
      }
    } catch (err) {
      setOtpError(lang === 'ta' ? 'OTP சேவை இணைப்பில் பிழை. தயவுசெய்து சிறிது நேரம் கழித்து முயற்சிக்கவும்.' : 'OTP service connection error. Please try again.');
    }
    setOtpLoading(false);
  };

  const handleVerifyTrackingOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpInput || otpInput.trim().length < 4) {
      setOtpError(lang === 'ta' ? 'தயவுசெய்து சரியான OTP எண்ணை உள்ளிடவும்.' : 'Please enter a valid OTP.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    try {
      const verifyRes = await verifyOtpCloud(otpPhone, otpInput.trim(), 'track');
      if (verifyRes && verifyRes.success) {
        const token = verifyRes.trackingToken || verifyRes.customerToken;
        setTrackingToken(token);
        setShowOtpPrompt(false);

        // Immediately fetch tracking results with verified token
        const trackRes = await fetchTrackByMobileCloud(otpPhone, token);
        if (trackRes && trackRes.success) {
          const apps = trackRes.applications || [];
          const tokens = trackRes.tokens || [];
          setSearchedApps(apps);
          setSearchedTokens(tokens);

          if (apps.length === 0 && tokens.length === 0) {
            setErrorMsg(lang === 'ta' ? 'இந்த மொபைல் எண்ணில் எந்தவொரு சேவை விண்ணப்பமும் பதிவு செய்யப்படவில்லை.' : 'No applications found for this mobile number.');
          } else {
            setErrorMsg('');
          }
        }
      } else {
        setOtpError(verifyRes?.message || (lang === 'ta' ? 'தவறான OTP எண். தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Invalid OTP. Please try again.'));
      }
    } catch (err) {
      setOtpError(lang === 'ta' ? 'சரிபார்ப்பில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Verification error. Please try again.');
    }
    setOtpLoading(false);
  };

  const handleSearch = async (searchKey) => {
    const key = (searchKey !== undefined ? searchKey : query).trim().toUpperCase();
    if (!key) {
      setErrorMsg(lang === 'ta' ? 'தயவுசெய்து அப்ளிகேஷன் எண் அல்லது 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter Application ID or 10-digit Mobile Number.');
      setSearchedApps([]);
      setSearchedTokens([]);
      setShowOtpPrompt(false);
      return;
    }

    const cleanDigits = key.replace(/\D/g, '');
    const cleanPhone = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;
    const isAppId = key.startsWith('AK-') || (cleanDigits.length !== 10 && key.length >= 6);

    // CASE A: Application ID tracking (Instant Public Lookup - No OTP required)
    if (isAppId) {
      setShowOtpPrompt(false);
      setIsLoading(true);
      setErrorMsg('');

      try {
        const publicRes = await fetchPublicAppStatusCloud(key);
        if (publicRes && publicRes.success) {
          setSearchedApps([publicRes]);
          setSearchedTokens([]);
          setErrorMsg('');
          setIsLoading(false);
          return;
        }
      } catch (err) {}

      // Fallback check in local memory / admin changes
      const localStoredApps = getStoredApplications() || {};
      const cloudApps = cloudData.applications || {};
      const allStored = { ...cloudApps, ...localStoredApps };
      const fallbackApp = allStored[key] || Object.values(allStored).find(a => a && (String(a.id || a.ackNo).toUpperCase() === key));

      if (fallbackApp) {
        const stageNum = Number(fallbackApp.currentStage || fallbackApp.stage || 1);
        const stageInfo = getTrackingStageInfo(stageNum);
        const dateStr = fallbackApp.submittedDate || fallbackApp.date || 'Recently';
        const formatted = {
          id: key,
          service: fallbackApp.service || fallbackApp.name || 'e-Sevai Service',
          currentStage: stageNum,
          stage: stageNum,
          statusLabel: fallbackApp.statusLabel || stageInfo.statusLabel,
          statusColor: fallbackApp.statusColor || stageInfo.statusColor,
          remarks: fallbackApp.remarks || stageInfo.remarks,
          submittedDate: dateStr,
          applicantName: fallbackApp.applicantName || 'Applicant',
          phone: fallbackApp.phone ? `******${String(fallbackApp.phone).slice(-4)}` : '******',
          timeline: [
            { step: 1, title: 'Registered', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: dateStr, done: stageNum >= 1, active: stageNum === 1 },
            { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: stageNum >= 2 ? 'Completed' : 'Pending', done: stageNum >= 2, active: stageNum === 2 },
            { step: 3, title: 'Fee Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: stageNum >= 3 ? 'Completed' : 'Pending', done: stageNum >= 3, active: stageNum === 3 },
            { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: stageNum >= 4 ? (stageNum === 6 ? 'Completed' : 'Just Now') : 'Pending', done: stageNum >= 4, active: stageNum === 4 },
            { step: 5, title: 'Officer Verification', tamil: 'அதிகாரி பரிசீலனை', date: stageNum >= 5 ? (stageNum === 6 ? 'Completed' : 'In Progress') : 'Pending', done: stageNum >= 5, active: stageNum === 5 },
            { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: stageNum >= 6 ? 'Completed' : 'Pending', done: stageNum >= 6, active: stageNum === 6 }
          ]
        };
        setSearchedApps([formatted]);
        setSearchedTokens([]);
        setErrorMsg('');
        setIsLoading(false);
        return;
      }

      setErrorMsg(lang === 'ta' ? 'இந்த விண்ணப்ப எண் கண்டறியப்படவில்லை. தயவுசெய்து உங்கள் அப்ளிகேஷன் எண்ணைச் சரிபார்க்கவும்.' : 'Application ID not found. Please verify your Application ID.');
      setSearchedApps([]);
      setSearchedTokens([]);
      setIsLoading(false);
      return;
    }

    // CASE B: 10-Digit Mobile Number Tracking (Requires OTP or Existing Authenticated Session)
    if (cleanPhone.length === 10) {
      // 1. Check if user already has an active customer session matching this phone
      let activeCustomerPhone = '';
      try {
        const sessionStr = sessionStorage.getItem('akesevai-customer-session') || localStorage.getItem('akesevai-customer-session');
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          activeCustomerPhone = String(parsed?.phone || parsed || '').replace(/\D/g, '').slice(-10);
        }
      } catch (e) {}

      if (activeCustomerPhone === cleanPhone) {
        setIsLoading(true);
        setErrorMsg('');
        setShowOtpPrompt(false);
        try {
          const res = await fetchTrackByMobileCloud(cleanPhone);
          if (res && res.success) {
            setSearchedApps(res.applications || []);
            setSearchedTokens(res.tokens || []);
            if ((res.applications || []).length === 0 && (res.tokens || []).length === 0) {
              setErrorMsg(lang === 'ta' ? 'இந்த மொபைல் எண்ணில் எந்தவொரு சேவை விண்ணப்பமும் பதிவு செய்யப்படவில்லை.' : 'No applications found for this mobile number.');
            }
            setIsLoading(false);
            return;
          }
        } catch (e) {}
        setIsLoading(false);
      }

      // 2. Check if we already have a valid ephemeral tracking token for this phone
      if (trackingToken) {
        setIsLoading(true);
        setErrorMsg('');
        try {
          const res = await fetchTrackByMobileCloud(cleanPhone, trackingToken);
          if (res && res.success) {
            setSearchedApps(res.applications || []);
            setSearchedTokens(res.tokens || []);
            if ((res.applications || []).length === 0 && (res.tokens || []).length === 0) {
              setErrorMsg(lang === 'ta' ? 'இந்த மொபைல் எண்ணில் எந்தவொரு சேவை விண்ணப்பமும் பதிவு செய்யப்படவில்லை.' : 'No applications found for this mobile number.');
            }
            setIsLoading(false);
            return;
          }
        } catch (e) {}
        setIsLoading(false);
      }

      // 3. Trigger Inline OTP flow
      setOtpPhone(cleanPhone);
      setOtpInput('');
      setOtpError('');
      setShowOtpPrompt(true);
      setSearchedApps([]);
      setSearchedTokens([]);
      setErrorMsg('');

      // Auto-send OTP for tracking
      sendTrackingOtp(cleanPhone);
    }
  };

  return (
    <div className="status-tracker-container page-width">
      {/* Tracker Search Header Box */}
      <div className="tracker-search-card">
        <div className="tracker-badge">
          <FileCheck2 size={16} /> ONLINE APPLICATION TRACKER
        </div>
        <h2>விண்ணப்ப நிலை அறிய / Track Application Status</h2>
        <p>Enter your <strong>Application ID</strong> (e.g. AK-71956367) or Registered Mobile Number to check real-time progress.</p>

        <form
          className="tracker-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="tracker-input-box">
            <Search size={20} />
            <input
              id="status-tracker-query-input"
              name="status_query"
              type="text"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (!val.trim()) {
                  setSearchedApps([]);
                  setSearchedTokens([]);
                  setErrorMsg('');
                  setShowOtpPrompt(false);
                }
              }}
              placeholder={lang === 'ta' ? "🔍 அப்ளிகேஷன் எண் (AK-...) அல்லது 10 இலக்க மொபைல் எண்..." : "🔍 Enter Application ID (AK-...) or 10-digit Mobile Number..."}
            />
          </div>
          <button type="submit" className="button button-primary" disabled={isLoading || otpLoading}>
            {isLoading ? <RefreshCw size={18} className="spin" /> : (lang === 'ta' ? 'நிலை அறிய' : 'Track Status')} <ArrowRight size={18} />
          </button>
        </form>
      </div>

      {/* Inline OTP Security Verification Card */}
      {showOtpPrompt && (
        <div
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '24px',
            margin: '20px 0',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#2563eb', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a', margin: 0 }}>
                {lang === 'ta' ? '📱 மொபைல் எண் பாதுகாப்பு சரிபார்ப்பு (Security Verification)' : '📱 Mobile Security Verification'}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#1e40af', margin: '3px 0 0' }}>
                {lang === 'ta'
                  ? `+91 ${otpPhone} எண்ணிற்கு 6-இலக்க OTP அனுப்பப்பட்டுள்ளது. விண்ணப்ப நிலை அறிய OTP-ஐ உள்ளிடவும்.`
                  : `6-digit OTP sent to +91 ${otpPhone}. Enter OTP to view application status.`}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyTrackingOtp} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
              <input
                id="tracking-otp-input"
                type="text"
                maxLength={6}
                autoComplete="one-time-code"
                value={otpInput}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setOtpInput(v);
                  if (v.length === 6) {
                    setOtpError('');
                  }
                }}
                placeholder="Enter 6-digit OTP"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '18px',
                  fontWeight: 800,
                  letterSpacing: '4px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  border: '2px solid #93c5fd',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                disabled={otpLoading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="button button-primary"
              style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 800, minWidth: '160px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={otpLoading || otpInput.length < 4}
            >
              {otpLoading ? <RefreshCw size={16} className="spin" /> : <CheckCircle2 size={16} />}
              {lang === 'ta' ? 'சரிபார்த்து காண்க' : 'Verify & View'}
            </button>

            <button
              type="button"
              onClick={() => sendTrackingOtp(otpPhone)}
              disabled={resendCooldown > 0 || otpLoading}
              style={{
                background: 'none',
                border: '1px solid #93c5fd',
                color: resendCooldown > 0 ? '#94a3b8' : '#2563eb',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {resendCooldown > 0
                ? `${lang === 'ta' ? 'மீண்டும் பெற' : 'Resend in'} (${resendCooldown}s)`
                : (lang === 'ta' ? '🔄 மீண்டும் OTP பெற' : '🔄 Resend OTP')}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpPrompt(false);
                setOtpInput('');
                setOtpError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              {lang === 'ta' ? 'ரத்து செய்' : 'Cancel'}
            </button>
          </form>

          {otpError && (
            <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 700, marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={15} /> {otpError}
            </div>
          )}
        </div>
      )}

      {/* Error / Not Found Card */}
      {errorMsg && (
        <div className="tracker-error-card" style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '12px', padding: '18px', margin: '20px 0', color: '#991b1b' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertCircle size={22} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '15px', display: 'block', color: '#991b1b' }}>{errorMsg}</strong>
              <div style={{ background: 'white', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginTop: '10px', fontSize: '13px', color: '#450a0a' }}>
                <strong>💡 தீர்வு வழிகாட்டி (Solution Guide):</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>10 இலக்க மொபைல் எண் சரியாக உள்ளதா என சரிபார்க்கவும் (எ.கா: 9600871898).</li>
                  <li>ஒப்புதல் சீட்டில் உள்ள அப்ளிகேஷன் எண்ணை சரியாக உள்ளிடவும் (எ.கா: AK-71956367).</li>
                  <li>அட்மின் மையத்தை நேரடியாக தொடர்புகொள்ள: 📞 93423 18844</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Token Slips Display Cards */}
      {searchedTokens.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          {searchedTokens.map((tok) => {
            const tokNum = tok.tokenNo || tok.tokenId || tok.id || 'TOK-101';
            const tokStatus = tok.status || 'CHECKED-IN / VERIFIED';
            const isDone = tokStatus.includes('COMPLETED') || tokStatus.includes('SERVED');
            const isCancel = tokStatus.includes('NO-SHOW') || tokStatus.includes('CANCELLED');
            const isAwait = tokStatus.includes('AWAITING') || tokStatus.includes('PENDING');

            const statusBg = isDone ? '#f0fdf4' : isCancel ? '#fef2f2' : isAwait ? '#fffbeb' : '#eff6ff';
            const statusColor = isDone ? '#16a34a' : isCancel ? '#dc2626' : isAwait ? '#d97706' : '#2563eb';
            const statusBorder = isDone ? '#86efac' : isCancel ? '#fca5a5' : isAwait ? '#fde68a' : '#bfdbfe';

            return (
              <div
                key={tokNum}
                style={{
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
                  border: '2px solid #fdba74',
                  borderRadius: '16px',
                  padding: '22px 24px',
                  boxShadow: '0 10px 25px rgba(251,146,60,0.15)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#c2410c', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '16px', boxShadow: '0 4px 10px rgba(194,65,12,0.3)' }}>
                      {tokNum}
                    </div>
                    <div>
                      <span style={{ background: '#ffedd5', color: '#9a3412', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                        🎫 ACTIVE OFFICE VISIT TOKEN SLIP
                      </span>
                      <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#9a3412', margin: '4px 0 2px' }}>
                        {tok.customerName || tok.applicantName || 'Customer'}
                      </h3>
                      <small style={{ fontSize: '12px', color: '#c2410c', fontWeight: 700 }}>
                        📅 Visit Date: <strong>{tok.date}</strong> ({tok.slot || 'Standard Counter'}) · Service: <strong>{tok.service}</strong>
                      </small>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: statusBg, color: statusColor, border: `1.5px solid ${statusBorder}`, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} /> Status: {tokStatus}
                    </div>
                    <small style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      ⚡ Real-time status synced from AkEsevai Admin
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Searched Applications Display Cards */}
      {searchedApps.length > 0 && (
        <div style={{ margin: '20px 0' }}>
          {searchedApps.length > 1 && (
            <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', color: '#1e40af', fontSize: '13px', fontWeight: 800 }}>
              📱 {searchedApps.length} சேவை விண்ணப்பங்கள் கண்டறியப்பட்டது (Found {searchedApps.length} applications):
            </div>
          )}

          {searchedApps.map((searchedApp) => (
            <div key={searchedApp.id} className="tracker-result-card" style={{ background: 'white', border: '1.5px solid #0052cc', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,82,204,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                    APPLICATION ID: {searchedApp.id}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '8px 0 2px' }}>{searchedApp.applicantName}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Mobile: {searchedApp.phone?.startsWith('*') ? searchedApp.phone : `+91 ${searchedApp.phone}`}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: searchedApp.statusColor || '#16a34a', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={15} /> {searchedApp.statusLabel}
                  </span>
                  <small style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Date: {searchedApp.submittedDate}</small>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>📋 Service Request: {searchedApp.service}</strong>
                <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 0' }}>{searchedApp.remarks}</p>
              </div>

              {/* Timeline Steps */}
              <div className="tracker-timeline" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '16px' }}>
                {(searchedApp.timeline || []).map((step) => (
                  <div key={step.step} style={{ background: step.done ? '#f0fdf4' : step.active ? '#eff6ff' : '#f8fafc', border: step.done ? '1.5px solid #86efac' : step.active ? '1.5px solid #60a5fa' : '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: step.done ? '#16a34a' : step.active ? '#2563eb' : '#cbd5e1', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, marginBottom: '6px' }}>
                      {step.done ? '✓' : step.step}
                    </span>
                    <strong style={{ display: 'block', fontSize: '12px', color: step.done ? '#166534' : step.active ? '#1e40af' : '#64748b' }}>{step.tamil}</strong>
                    <small style={{ fontSize: '10px', color: '#64748b' }}>{step.date}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
