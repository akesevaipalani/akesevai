import { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, FileCheck2, Send, AlertCircle, Printer, ArrowRight, ShieldCheck, MapPin, Phone, MessageCircle, QrCode, Award, Sparkles, Gift } from 'lucide-react';
import { getStoredApplications } from '../utils/statusStore';
import { printElement } from '../utils/printHelper';
import { subscribeCustomerProfiles, subscribeTokens, subscribeApplications, fetchAllCloudRecords } from '../utils/dataService';

export default function StatusTracker({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchedApps, setSearchedApps] = useState([]);
  const [searchedTokens, setSearchedTokens] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [cloudData, setCloudData] = useState({ customers: {}, tokens: [], applications: {} });

  useEffect(() => {
    // Initial fetch from Firebase Cloud
    fetchAllCloudRecords().then((res) => {
      if (res) setCloudData(res);
    });

    // Re-search when admin updates application data
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

    const unsubCust = subscribeCustomerProfiles((custs) => {
      setCloudData((prev) => ({ ...prev, customers: custs || {} }));
    });
    const unsubTok = subscribeTokens((toks) => {
      setCloudData((prev) => ({ ...prev, tokens: toks || [] }));
    });
    const unsubApps = subscribeApplications((apps) => {
      const localApps = getStoredApplications() || {};
      const merged = { ...(apps || {}) };
      Object.keys(localApps).forEach((k) => {
        if (!localApps[k]) return;
        const targetStage = Number(localApps[k]?.currentStage || localApps[k]?.stage || 1);
        merged[k] = {
          ...(apps?.[k] || {}),
          ...localApps[k],
          currentStage: targetStage,
          stage: targetStage
        };
      });
      setCloudData((prev) => ({ ...prev, applications: merged }));
    });

    return () => {
      window.removeEventListener('akesevai-data-changed', handleDataChanged);
      if (typeof unsubCust === 'function') unsubCust();
      if (typeof unsubTok === 'function') unsubTok();
      if (typeof unsubApps === 'function') unsubApps();
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    const cleanDigits = trimmed.replace(/\D/g, '');
    const isFullPhone = cleanDigits.length === 10;
    const isFullAppId = trimmed.length >= 8;

    if (isFullPhone || isFullAppId) {
      handleSearch(trimmed);
    } else if (!trimmed) {
      setSearchedApps([]);
      setSearchedTokens([]);
      setErrorMsg('');
    }
  }, [query, cloudData]);

  const handleSearch = (searchKey) => {
    const key = (searchKey !== undefined ? searchKey : query).trim().toUpperCase();
    if (!key) {
      setErrorMsg('தயவுசெய்து அப்ளிகேஷன் எண் அல்லது 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.');
      setSearchedApps([]);
      setSearchedTokens([]);
      return;
    }

    const cleanKey = key.replace(/\D/g, '');

    // 1. Read stored & cloud applications — respect admin's explicit stage choice
    const localStoredApps = getStoredApplications() || {};
    const cloudApps = cloudData.applications || {};
    const allStoredAppsMap = { ...cloudApps, ...localStoredApps };

    Object.keys(cloudApps).forEach((k) => {
      if (!cloudApps[k]) return;
      const targetStage = Number(localStoredApps[k]?.currentStage || localStoredApps[k]?.stage || cloudApps[k]?.currentStage || cloudApps[k]?.stage || 1);
      allStoredAppsMap[k] = {
        ...(cloudApps[k] || {}),
        ...(localStoredApps[k] || {}),
        currentStage: targetStage,
        stage: targetStage
      };
    });
    const storedAppsList = Object.values(allStoredAppsMap);

    // 2. Read customer records from localStorage & cloud
    let localCust1 = {};
    let localCust2 = {};
    try {
      localCust1 = JSON.parse(localStorage.getItem('akesevai-customer-records') || '{}');
      localCust2 = JSON.parse(localStorage.getItem('akesevai-customers') || '{}');
    } catch (e) {}
    const allCustomers = { ...localCust2, ...localCust1, ...(cloudData.customers || {}) };

    const matchedAppsMap = {};

    // Helper to format application object with correct timeline & status
    const formatApp = (appObj, defaultName = 'வாடிக்கையாளர்', defaultPhone = '') => {
      const appId = appObj.id || appObj.ackNo || `AK-${cleanKey.slice(-6) || '2026-101'}`;
      const stored = allStoredAppsMap[appId] || Object.values(allStoredAppsMap).find(a => a && (a.id === appId || a.ackNo === appId || (a.phone && appObj.phone && String(a.phone).replace(/\D/g, '') === String(appObj.phone).replace(/\D/g, '') && a.service === appObj.service)));
      
      const stageNum = Number(
        stored?.currentStage || stored?.stage || appObj.currentStage || appObj.stage || (appObj.status === 'Completed' ? 6 : 1)
      );

      const stageInfoMap = {
        1: { statusLabel: 'Step 1: Application Received (விண்ணப்பம் பெறப்பட்டது)', statusColor: '#3b82f6', remarks: 'AkEsevai மையத்தில் விண்ணப்பம் பெறப்பட்டுள்ளது.' },
        2: { statusLabel: 'Step 2: Documents Verified (ஆவணங்கள் சரிபார்க்கப்பட்டது)', statusColor: '#0284c7', remarks: 'வாடிக்கையாளரின் ஆவணங்கள் சரிபார்க்கப்பட்டு விண்ணப்பம் தொடரப்படுகிறது.' },
        3: { statusLabel: 'Step 3: Fee Confirmed (கட்டணம் பெறப்பட்டு செயலாக்கத்தில் உள்ளது)', statusColor: '#0052cc', remarks: 'கட்டணம் பெறப்பட்டு அரசு இணையதளத் தாக்கல் நிலுவையில் உள்ளது.' },
        4: { statusLabel: 'Step 4: Submitted to Govt (அரசு தளத்தில் தாக்கல் செய்யப்பட்டது)', statusColor: '#d97706', remarks: 'அரசு இ-சேவை இணையதளத்தில் விண்ணப்பம் தாக்கல் செய்யப்பட்டுள்ளது.' },
        5: { statusLabel: 'Step 5: Officer Review (அதிகாரி பரிசீலனையில் உள்ளது)', statusColor: '#8b5cf6', remarks: 'அரசு அதிகாரி / VAO / RI பரிசீலனையில் உள்ளது.' },
        6: { statusLabel: 'Approved & Completed (சான்றிதழ் தயாராக உள்ளது)', statusColor: '#16a34a', remarks: 'விண்ணப்பம் வெற்றிகரமாக ஒப்புதல் பெறப்பட்டு சான்றிதழ் தயாராக உள்ளது.' }
      };

      const curStage = stageInfoMap[stageNum] || stageInfoMap[1];

      return {
        ...appObj,
        ...stored,
        id: appId,
        applicantName: appObj.applicantName || appObj.name || stored?.applicantName || defaultName,
        phone: (appObj.phone || stored?.phone || defaultPhone || cleanKey).replace(/\D/g, ''),
        service: appObj.service || appObj.name || stored?.service || 'General e-Sevai Service',
        submittedDate: appObj.submittedDate || appObj.date || stored?.submittedDate || 'Recently',
        currentStage: stageNum,
        statusLabel: curStage.statusLabel,
        statusColor: curStage.statusColor,
        remarks: curStage.remarks,
        timeline: [
          { step: 1, title: 'Registered', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: appObj.submittedDate || appObj.date || stored?.submittedDate || 'Today', done: stageNum >= 1, active: stageNum === 1 },
          { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: stageNum >= 2 ? 'Completed' : 'Pending', done: stageNum >= 2, active: stageNum === 2 },
          { step: 3, title: 'Fee Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: stageNum >= 3 ? 'Completed' : 'Pending', done: stageNum >= 3, active: stageNum === 3 },
          { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: stageNum >= 4 ? (stageNum === 6 ? 'Completed' : 'Just Now') : 'Pending', done: stageNum >= 4, active: stageNum === 4 },
          { step: 5, title: 'Officer Verification', tamil: 'அதிகாரி பரிசீலனை', date: stageNum >= 5 ? (stageNum === 6 ? 'Completed' : 'In Progress') : 'Pending', done: stageNum >= 5, active: stageNum === 5 },
          { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: stageNum === 6 ? 'Completed' : 'Pending', done: stageNum === 6, active: stageNum === 6 }
        ]
      };
    };

    // Match by Application ID in stored apps
    storedAppsList.forEach((app) => {
      if (!app) return;
      const appId = String(app.id || app.ackNo || '').toUpperCase();
      const appPhone = String(app.phone || '').replace(/\D/g, '');

      const matchesId = appId && (appId === key || key.includes(appId));
      const matchesPhone = cleanKey && cleanKey.length === 10 && appPhone && appPhone === cleanKey;

      if (matchesId || matchesPhone) {
        const formatted = formatApp(app, app.applicantName, appPhone);
        matchedAppsMap[formatted.id] = formatted;
      }
    });

    // Match in customer records
    Object.keys(allCustomers).forEach((phoneKey) => {
      const cust = allCustomers[phoneKey];
      if (!cust) return;
      const custPhone = String(cust.phone || phoneKey).replace(/\D/g, '');
      const custApps = Array.isArray(cust.applications) ? cust.applications : [];
      const custName = cust.profile?.name || cust.name || 'வாடிக்கையாளர்';

      custApps.forEach((appObj) => {
        if (!appObj) return;
        const appId = String(appObj.id || appObj.ackNo || '').toUpperCase();

        const matchesId = appId && (appId === key || key.includes(appId));
        const matchesPhone = cleanKey && cleanKey.length === 10 && custPhone && custPhone === cleanKey;

        if (matchesId || matchesPhone) {
          const formatted = formatApp(appObj, custName, custPhone);
          matchedAppsMap[formatted.id] = formatted;
        }
      });
    });

    // Match tokens by tokenNo or phone
    const matchedTokens = (cloudData.tokens || []).filter((t) => {
      if (!t) return false;
      const tokNo = String(t.tokenNo || t.tokenId || t.id || '').toUpperCase();
      const tokPhone = String(t.phone || t.customerPhone || '').replace(/\D/g, '');
      const matchesTokId = tokNo && (tokNo === key || key.includes(tokNo));
      const matchesTokPhone = cleanKey && cleanKey.length === 10 && tokPhone && tokPhone === cleanKey;
      return matchesTokId || matchesTokPhone;
    });

    setSearchedTokens(matchedTokens);

    const finalResults = Object.values(matchedAppsMap);

    if (finalResults.length > 0 || matchedTokens.length > 0) {
      setSearchedApps(finalResults);
      setErrorMsg('');
    } else {
      setErrorMsg('இந்த எண் / விண்ணப்ப எண்ணில் எந்தவொரு சேவை விண்ணப்பமும் பதிவு செய்யப்படவில்லை. தயவுசெய்து உங்கள் 10 இலக்க மொபைல் எண் அல்லது விண்ணப்ப எண்ணைச் சரிபார்க்கவும்.');
      setSearchedApps([]);
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
        <p>Enter your <strong>Application ID</strong> (e.g. AK-240723-01) or Registered Mobile Number to check real-time progress.</p>

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
              type="text"
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (!val.trim()) {
                  setSearchedApps([]);
                  setSearchedTokens([]);
                  setErrorMsg('');
                }
              }}
              placeholder="🔍 Enter Application ID or Mobile Number..."
            />
          </div>
          <button type="submit" className="button button-primary">
            Track Status <ArrowRight size={18} />
          </button>
        </form>
      </div>

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
                  <li>ஒப்புதல் சீட்டில் உள்ள அப்ளிகேஷன் எண்ணை சரியாக உள்ளிடவும் (எ.கா: AK-17345531).</li>
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

            const statusBg = isDone ? '#f0fdf4' : isCancel ? '#fef2f2' : isAwait ? '#fffbebf' : '#eff6ff';
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
              📱 {searchedApps.length} சேவை விண்ணப்பங்கள் இந்த மொபைல் எண்ணில் கண்டறியப்பட்டது (Found {searchedApps.length} applications for this mobile number):
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
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Mobile: +91 {searchedApp.phone}</p>
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
