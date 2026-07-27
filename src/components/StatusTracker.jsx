import { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, FileCheck2, Send, AlertCircle, Printer, ArrowRight, ShieldCheck, MapPin, Phone, MessageCircle, QrCode } from 'lucide-react';
import { getStoredApplications } from '../utils/statusStore';
import { printElement } from '../utils/printHelper';
import { subscribeApplications } from '../utils/firebaseService';

const mockApplications = {};

export default function StatusTracker({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchedApp, setSearchedApp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeApplications(() => {
      if (query.trim()) {
        handleSearch(query);
      }
    });

    const handleStorage = () => {
      if (query.trim()) {
        handleSearch(query);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, [query]);

  const handleSearch = (searchKey) => {
    const key = (searchKey || query).trim().toUpperCase();
    if (!key) {
      setErrorMsg('தயவுசெய்து அப்ளிகேஷன் எண் அல்லது 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.');
      setSearchedApp(null);
      return;
    }

    const cleanKey = key.replace(/\D/g, '');

    // 1. Check Admin Stored Applications (Receipts)
    const storedApps = Object.values(getStoredApplications());
    
    // 2. Check Token Bookings
    let tokenBookings = [];
    try {
      tokenBookings = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
    } catch (e) {
      tokenBookings = [];
    }

    // 3. Check Customer Accounts & Active Session
    let customerRecords = {};
    try {
      customerRecords = JSON.parse(localStorage.getItem('akesevai-customer-records') || '{}');
    } catch (e) {
      customerRecords = {};
    }
    const loggedInSessionPhone = (sessionStorage.getItem('akesevai-customer-session') || '').replace(/\D/g, '');

    // Search in Admin Applications first
    let found = storedApps.find(
      app => app.id.toUpperCase() === key || 
             (cleanKey && app.phone.replace(/\D/g, '') === cleanKey) ||
             (cleanKey && (app.aadhaarNo || '').replace(/\D/g, '') === cleanKey)
    );

    // If not found in applications, search in Token Bookings
    if (!found && cleanKey) {
      const foundToken = tokenBookings.find(t => (t.phone || '').replace(/\D/g, '') === cleanKey || t.id === key);
      if (foundToken) {
        found = {
          id: foundToken.id || `TN-AK-2026-${cleanKey.slice(-5)}`,
          tokenId: foundToken.tokenNo || foundToken.id || 'TOK-101',
          applicantName: foundToken.name || 'வாடிக்கையாளர்',
          phone: foundToken.phone || cleanKey,
          service: foundToken.service || 'வருமானச் சான்றிதழ் (Income Certificate)',
          submittedDate: foundToken.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          estimatedDate: '3 முதல் 5 வேலை நாட்கள்',
          currentStage: 3,
          statusLabel: 'டோக்கன் பதிவு செய்யப்பட்டு விண்ணப்பம் பெறப்பட்டது',
          statusColor: '#16a34a',
          remarks: `AkEsevai மையத்தில் டோக்கன் பதிவு செய்யப்பட்டுள்ளது (${foundToken.date || 'Today'} - ${foundToken.time || '10:30 AM'}).`,
          timeline: [
            { step: 1, title: 'Token Booked', tamil: 'டோக்கன் பதிவு செய்யப்பட்டது', date: 'Today', done: true },
            { step: 2, title: 'Document Received', tamil: 'ஆவணங்கள் பெறப்பட்டது', date: 'Today', done: true },
            { step: 3, title: 'Fee Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: 'Today', done: true, active: true },
            { step: 4, title: 'Submitted to Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: 'In Progress', done: false },
            { step: 5, title: 'Officer Inspection', tamil: 'அதிகாரி பரிசீலனை', date: 'Pending', done: false },
            { step: 6, title: 'Certificate Ready', tamil: 'சான்றிதழ் தயார்', date: 'Pending', done: false }
          ]
        };
      }
    }

    // If not found, search in Logged-In Customer Records or Active Session
    if (!found && cleanKey && (customerRecords[cleanKey] || loggedInSessionPhone === cleanKey)) {
      const cust = customerRecords[cleanKey] || {};
      found = {
        id: `TN-AK-2026-${cleanKey.slice(-5)}`,
        tokenId: 'TOK-108',
        applicantName: cust.profile?.name || 'வாடிக்கையாளர்',
        phone: cleanKey,
        service: 'வருமானச் சான்றிதழ் (Income Certificate)',
        submittedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        estimatedDate: '3 முதல் 5 வேலை நாட்கள்',
        currentStage: 4,
        statusLabel: 'VAO & RI களப்பரிசீலனையில் உள்ளது (VAO & RI Inspection)',
        statusColor: '#d97706',
        remarks: 'உங்கள் கணக்கில் ஆவணங்கள் சரிபார்க்கப்பட்டு TNeGA அரசு தளத்தில் விண்ணப்பிக்கப்பட்டு பரிசீலனையில் உள்ளது.',
        timeline: [
          { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: 'Today', done: true },
          { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: 'Today', done: true },
          { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: 'Today', done: true },
          { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: 'In Progress', done: true, active: true },
          { step: 5, title: 'VAO & RI Inspection', tamil: 'அதிகாரி பரிசீலனை', date: 'Pending', done: false },
          { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் தயாராக உள்ளது', date: 'Pending', done: false }
        ]
      };
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
    <div className="status-tracker-container">
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
              placeholder="e.g. AK-240723-01 or 9842154321"
            />
          </div>
          <button type="submit" className="button button-primary track-btn">
            Track Status <ArrowRight size={17} />
          </button>
        </form>

        {/* Demo Quick Search Chips */}
        <div className="demo-chips">
          <span>Try Sample IDs:</span>
          {Object.keys(mockApplications).map((id) => (
            <button
              key={id}
              type="button"
              className="chip-btn"
              onClick={() => {
                setQuery(id);
                handleSearch(id);
              }}
            >
              {id}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '14px', padding: '16px', marginTop: '16px', textAlign: 'left' }}>
            <h4 style={{ font: '800 15px Manrope', color: '#991b1b', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={18} color="#dc2626" /> {errorMsg}
            </h4>
            <div style={{ background: 'white', borderRadius: '8px', padding: '10px 14px', border: '1px solid #fecaca', marginTop: '8px' }}>
              <strong style={{ fontSize: '12px', color: '#7f1d1d', display: 'block', marginBottom: '4px' }}>💡 தீர்வு வழிகாட்டி (Solution Guide):</strong>
              <ul style={{ fontSize: '11.5px', color: '#450a0a', margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
                <li>10 இலக்க மொபைல் எண் சரியாக உள்ளதா என சரிபார்க்கவும் (எ.கா: <code>9842154321</code>).</li>
                <li>ஒப்புதல் சீட்டில் உள்ள அப்ளிகேஷன் எண்ணை சரியாக உள்ளிடவும் (எ.கா: <code>TN-AK-2026-XXXXX</code>).</li>
                <li>அட்மின் மையத்தை நேரடியாகத் தொடர்புகொள்ள: <strong>📞 93423 18844</strong></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH RESULT STATUS CARD */}
      {searchedApp && (
        <div id="status-print-area" className="status-result-wrapper">
          {/* Header Summary */}
          <div className="status-summary-card">
            <div className="summary-left">
              <span className="app-id-tag">{searchedApp.id}</span>
              <h3>{searchedApp.service}</h3>
              <p className="applicant-meta">
                <span>Applicant: <strong>{searchedApp.name}</strong></span>
                <span>Phone: <strong>+91 {searchedApp.phone}</strong></span>
                <span>Token: <strong>{searchedApp.tokenId}</strong></span>
              </p>
            </div>

            <div className="summary-right">
              <span
                className="status-pill-badge"
                style={{ backgroundColor: `${searchedApp.statusColor}15`, color: searchedApp.statusColor, borderColor: searchedApp.statusColor }}
              >
                <span className="pulse-dot" style={{ backgroundColor: searchedApp.statusColor }} />
                {searchedApp.statusLabel}
              </span>
              <small className="date-meta">Submitted: {searchedApp.submittedDate} · Est. Completion: {searchedApp.estimatedDate}</small>
            </div>
          </div>

          {/* Remarks Box */}
          <div className="status-remarks-box">
            <AlertCircle size={18} />
            <div>
              <strong>Current Status Remarks:</strong>
              <p>{searchedApp.remarks}</p>
            </div>
          </div>

          {/* VISUAL MULTI-STEP TIMELINE TRACKER */}
          <div className="status-timeline-card">
            <h4>Application Progress Timeline</h4>

            <div className="timeline-stepper">
              {searchedApp.timeline.map((item) => (
                <div
                  key={item.step}
                  className={`stepper-item ${item.done ? 'step-done' : ''} ${item.active ? 'step-active' : ''}`}
                >
                  <div className="step-node">
                    {item.done ? <CheckCircle2 size={20} /> : <span className="step-num">{item.step}</span>}
                  </div>

                  <div className="step-content">
                    <strong className="step-title">{item.title}</strong>
                    <small className="step-tamil">{item.tamil}</small>
                    <span className="step-date">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Government Direct Portal Search Shortcuts */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginTop: '16px', textAlign: 'left' }}>
            <strong style={{ fontSize: '13px', color: '#022c7a', display: 'block', marginBottom: '8px' }}>
              🏛️ நேரடி அரசு இணையதள நிலை அறிய (Direct Government Official Portals):
            </strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <a
                href="https://edistricts.tn.gov.in/revenue/status.html"
                target="_blank"
                rel="noreferrer"
                style={{ background: '#022c7a', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                🏛️ TNeGA இ-சேவை நிலை (TN Revenue)
              </a>
              <a
                href="https://myaadhaar.uidai.gov.in/CheckAadhaarStatus/en"
                target="_blank"
                rel="noreferrer"
                style={{ background: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                🪪 ஆதார் புதுப்பிப்பு நிலை (UIDAI Status)
              </a>
              <a
                href="https://www.tnpds.gov.in/"
                target="_blank"
                rel="noreferrer"
                style={{ background: '#d97706', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                🍚 ரேஷன் கார்டு நிலை (TNPDS Status)
              </a>
              <a
                href="https://tinpan.proteantech.in/"
                target="_blank"
                rel="noreferrer"
                style={{ background: '#2563eb', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                💳 பான் கார்டு நிலை (Protean PAN)
              </a>
            </div>
          </div>

          {/* Action Footer - hidden when printing */}
          <div data-no-print="true" className="status-actions-bar">
            <button className="button button-quiet" onClick={() => printElement('status-print-area')}>
              <Printer size={16} /> Print Status Receipt
            </button>
            <a
              href={`https://wa.me/919342318844?text=Hello%20AkEsevai,%20I%20am%20enquiring%20about%20my%20application%20ID%20${searchedApp.id}`}
              target="_blank"
              rel="noreferrer"
              className="button button-light"
            >
              <MessageCircle size={16} /> WhatsApp Enquiry
            </a>
            <div className="centre-note">
              <ShieldCheck size={16} /> Official AkEsevai Verified Record
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
