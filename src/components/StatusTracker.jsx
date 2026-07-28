import { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, FileCheck2, Send, AlertCircle, Printer, ArrowRight, ShieldCheck, MapPin, Phone, MessageCircle, QrCode, Award, Sparkles, Gift } from 'lucide-react';
import { getStoredApplications } from '../utils/statusStore';
import { printElement } from '../utils/printHelper';
import { subscribeCustomerProfiles, subscribeTokens, fetchAllCloudRecords } from '../utils/firebaseService';

export default function StatusTracker({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchedApp, setSearchedApp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [cloudData, setCloudData] = useState({ customers: {}, tokens: [], applications: {} });

  useEffect(() => {
    // Initial fetch from Firebase Cloud
    fetchAllCloudRecords().then((res) => {
      if (res) setCloudData(res);
    });

    const unsubCust = subscribeCustomerProfiles((custs) => {
      setCloudData((prev) => ({ ...prev, customers: custs || {} }));
    });
    const unsubTok = subscribeTokens((toks) => {
      setCloudData((prev) => ({ ...prev, tokens: toks || [] }));
    });

    return () => {
      if (typeof unsubCust === 'function') unsubCust();
      if (typeof unsubTok === 'function') unsubTok();
    };
  }, []);

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [cloudData]);

  const handleSearch = (searchKey) => {
    const key = (searchKey || query).trim().toUpperCase();
    if (!key) {
      setErrorMsg('தயவுசெய்து அப்ளிகேஷன் எண் அல்லது 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.');
      setSearchedApp(null);
      return;
    }

    const cleanKey = key.replace(/\D/g, '');

    // 1. Read stored receipts from admin statusStore
    const storedApps = Object.values(getStoredApplications());

    // 2. Read customer records from sessionStorage & cloud
    let localCustRecords = {};
    try {
      localCustRecords = JSON.parse(sessionStorage.getItem('akesevai-customer-records') || '{}');
    } catch (e) {}
    const allCustomers = { ...localCustRecords, ...(cloudData.customers || {}) };

    // 3. Read token bookings from sessionStorage & cloud
    let localTokens = [];
    try {
      localTokens = JSON.parse(sessionStorage.getItem('akesevai-token-bookings') || '[]');
    } catch (e) {}
    const allTokens = [...localTokens, ...(cloudData.tokens || [])];

    let found = null;

    // Search 1: Match Application ID in stored receipts
    found = storedApps.find(app => app.id && app.id.toUpperCase() === key);

    // Search 2: Match Customer Mobile Number (cleanKey) or App ID in all Customer Profiles
    if (!found) {
      for (const phoneKey of Object.keys(allCustomers)) {
        const cust = allCustomers[phoneKey];
        if (!cust) continue;
        const custPhone = String(cust.phone || phoneKey).replace(/\D/g, '');
        const custApps = Array.isArray(cust.applications) ? cust.applications : [];
        const custDocs = Array.isArray(cust.documents) ? cust.documents : [];
        const custName = cust.profile?.name || cust.name || 'வாடிக்கையாளர்';

        // Match by phone number or application ID
        const matchedApp = custApps.find(a => a.id && (a.id.toUpperCase() === key || key.includes(a.id.toUpperCase())));

        if ((cleanKey && custPhone && (custPhone === cleanKey || custPhone.includes(cleanKey) || cleanKey.includes(custPhone))) || matchedApp) {
          const appObj = matchedApp || custApps[0] || {
            id: `AK-${cleanKey.slice(-6) || '2026-101'}`,
            name: 'இ-சேவை விண்ணப்பம் (e-Sevai Application)',
            status: 'Processing',
            date: new Date().toLocaleDateString('en-IN')
          };

          const isCompleted = appObj.status === 'Completed' || appObj.progress === 100;
          found = {
            id: appObj.id,
            tokenId: `TOK-${cleanKey.slice(-3) || '101'}`,
            applicantName: custName,
            phone: custPhone || cleanKey,
            service: appObj.name || 'General e-Sevai Service',
            submittedDate: appObj.date || 'Recently',
            estimatedDate: '3 முதல் 5 வேலை நாட்கள்',
            currentStage: isCompleted ? 6 : 3,
            statusLabel: isCompleted ? 'Approved & Completed (சான்றிதழ் தயாராக உள்ளது)' : 'In Progress (விண்ணப்பம் பரிசீலனையில் உள்ளது)',
            statusColor: isCompleted ? '#16a34a' : '#0052cc',
            remarks: `வாடிக்கையாளர் கணக்கில் ${custDocs.length} ஆவணங்கள் சரிபார்க்கப்பட்டு விண்ணப்பம் தொடரப்படுகிறது.`,

            timeline: [
              { step: 1, title: 'Registered', tamil: 'விண்ணப்பம் பதிவு செய்யப்பட்டது', date: appObj.date || 'Today', done: true },
              { step: 2, title: 'Document Verified', tamil: `${custDocs.length} ஆவணங்கள் சரிபார்க்கப்பட்டது`, date: 'Today', done: true },
              { step: 3, title: 'Fee Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: 'Today', done: true, active: !isCompleted },
              { step: 4, title: 'Submitted to Portal', tamil: 'அரசு தளத்தில் தாக்கல் செய்யப்பட்டது', date: 'In Progress', done: isCompleted },
              { step: 5, title: 'Officer Inspection', tamil: 'அதிகாரி பரிசீலனை', date: 'In Progress', done: isCompleted },
              { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் தயார் / நிறைவடைந்தது', date: isCompleted ? 'Completed' : 'Pending', done: isCompleted, active: isCompleted }
            ]
          };
          break;
        }
      }
    }

    // Search 3: Match in Token Bookings
    if (!found && cleanKey) {
      const foundToken = allTokens.find(t => (t.phone || '').replace(/\D/g, '') === cleanKey || (t.tokenNo && t.tokenNo.toUpperCase() === key));
      if (foundToken) {
        const isDone = (foundToken.status || '').includes('COMPLETED') || (foundToken.status || '').includes('SERVED');
        found = {
          id: foundToken.id || `TN-AK-2026-${cleanKey.slice(-5)}`,
          tokenId: foundToken.tokenNo || 'TOK-001',
          applicantName: foundToken.customerName || foundToken.name || 'வாடிக்கையாளர்',
          phone: foundToken.phone || cleanKey,
          service: foundToken.service || 'AkEsevai Token Service',
          submittedDate: foundToken.date || 'Recently',
          estimatedDate: '3 முதல் 5 வேலை நாட்கள்',
          currentStage: isDone ? 6 : 2,
          statusLabel: isDone ? 'COMPLETED / SERVED (நிறைவடைந்தது)' : 'Token Active (டோக்கன் பதிவு செய்யப்பட்டது)',
          statusColor: isDone ? '#16a34a' : '#d97706',
          remarks: `AkEsevai மையத்தில் டோக்கன் பதிவு செய்யப்பட்டுள்ளது (${foundToken.date || 'Today'} - ${foundToken.slot || 'Live Queue'}).`,
          timeline: [
            { step: 1, title: 'Token Booked', tamil: 'டோக்கன் பதிவு செய்யப்பட்டது', date: 'Today', done: true },
            { step: 2, title: 'Counter Verification', tamil: 'கவுண்டர் சரிபார்ப்பு', date: 'Today', done: true, active: !isDone },
            { step: 3, title: 'Fee Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: 'Today', done: isDone },
            { step: 4, title: 'Submitted to Portal', tamil: 'அரசு தளத்தில் தாக்கல் செய்யப்பட்டது', date: 'Today', done: isDone },
            { step: 5, title: 'Officer Inspection', tamil: 'அதிகாரி பரிசீலனை', date: 'Today', done: isDone },
            { step: 6, title: 'Completed / Served', tamil: 'நிறைவடைந்தது', date: isDone ? 'Completed' : 'Pending', done: isDone, active: isDone }
          ]
        };
      }
    }

    if (found) {
      setSearchedApp({
        ...found,
        name: found.applicantName || found.name || 'வாடிக்கையாளர்'
      });
      setErrorMsg('');
    } else {
      setSearchedApp(null);
      setErrorMsg(`❌ பிழை: "${key}" என்ற மொபைல் எண் / விண்ணப்ப எண் நமது AkEsevai சிஸ்டத்தில் பதிவு செய்யப்படவில்லை! (Unregistered Customer)`);
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
              onChange={(e) => setQuery(e.target.value)}
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

      {/* Searched Application Status Display Card */}
      {searchedApp && (
        <div className="tracker-result-card" style={{ background: 'white', border: '1.5px solid #0052cc', borderRadius: '16px', padding: '24px', margin: '20px 0', boxShadow: '0 10px 25px rgba(0,82,204,0.1)' }}>
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
            {searchedApp.timeline.map((step) => (
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
      )}
    </div>
  );
}
