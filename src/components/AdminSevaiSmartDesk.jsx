import React, { useState, useEffect } from 'react';
import { 
  Cpu, FileText, CheckCircle2, Printer, MessageCircle, ArrowRight, UploadCloud, 
  RefreshCw, Sparkles, ShieldCheck, Download, PlusCircle, Volume2, Eye, Search, 
  FileCheck2, Trash2, Ticket, User, Globe, QrCode, Calendar, Clock, X, Layers 
} from 'lucide-react';
import { saveApplicationRecord, getStoredApplications, updateApplicationStage } from '../utils/statusStore';
import { 
  subscribeExpiryDocuments, deleteExpiryDocumentCloud, 
  subscribeTokens, deleteTokenBookingCloud, 
  subscribeCustomerProfiles, deleteCustomerProfileCloud, subscribeApplications 
} from '../utils/firebaseService';
import { printElement } from '../utils/printHelper';
import AdminCounterVoiceAnnouncer from './AdminCounterVoiceAnnouncer';
import AdminAutoFillProfileDrawer from './AdminAutoFillProfileDrawer';
import AdminSponsoredAdsManager from './AdminSponsoredAdsManager';

export default function AdminSevaiSmartDesk({ notify }) {
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [service, setService] = useState('வருமானச் சான்றிதழ் (Income Certificate)');
  const [fee, setFee] = useState('60');
  const [status, setStatus] = useState('விண்ணப்பிக்கப்பட்டது (Applied & Processing)');
  const [receipt, setReceipt] = useState(null);

  // Active Vault Tab: 'tokens' | 'documents' | 'customers'
  const [activeVaultTab, setActiveVaultTab] = useState('tokens');

  // Customer Uploaded Documents state
  const [customerDocs, setCustomerDocs] = useState([]);
  const [docSearch, setDocSearch] = useState('');

  // Worldwide Generated Customer Tokens state
  const [customerTokens, setCustomerTokens] = useState([]);
  const [tokenSearch, setTokenSearch] = useState('');
  const [selectedTokenForView, setSelectedTokenForView] = useState(null);

  // Worldwide Customer Profiles state
  const [customerProfiles, setCustomerProfiles] = useState({});
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerForView, setSelectedCustomerForView] = useState(null);

  // Real-time Cloud Subscriptions & Comprehensive Document/Token Merger
  useEffect(() => {
    let latestCloudDocs = [];
    let latestCloudTokens = [];
    let latestCustomerProfiles = {};
    let latestCloudApps = {};

    const syncAllCloudData = () => {
      const deletedTokens = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));
      const deletedDocs = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-docs') || '[]'));
      const deletedCustomers = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-customers') || '[]'));

      // Filter profiles by blacklist
      const filteredProfiles = {};
      if (latestCustomerProfiles && typeof latestCustomerProfiles === 'object') {
        Object.keys(latestCustomerProfiles).forEach((pKey) => {
          const cleanP = pKey.replace(/\D/g, '');
          if (!deletedCustomers.has(pKey) && !deletedCustomers.has(cleanP)) {
            filteredProfiles[pKey] = latestCustomerProfiles[pKey];
          }
        });
      }
      setCustomerProfiles(filteredProfiles);

      // 1. MERGE ALL DOCUMENTS (Excluding deleted docs)
      const allDocsMap = new Map();

      if (Array.isArray(latestCloudDocs)) {
        latestCloudDocs.forEach((d) => {
          if (d && (d.url || d.data || d.name)) {
            const key = d.id || `${d.customerPhone}_${d.requirement || d.name}_${d.uploadedAt}`;
            if (!deletedDocs.has(key) && !deletedDocs.has(String(d.id))) {
              allDocsMap.set(key, {
                ...d,
                url: d.url || d.data || '',
                data: d.url || d.data || ''
              });
            }
          }
        });
      }

      if (filteredProfiles && typeof filteredProfiles === 'object') {
        Object.values(filteredProfiles).forEach((cust) => {
          if (cust && Array.isArray(cust.documents)) {
            cust.documents.forEach((docItem, idx) => {
              if (docItem && (docItem.url || docItem.data || docItem.name)) {
                const key = docItem.id || `${cust.phone}_${docItem.requirement || docItem.name}_${idx}`;
                if (!deletedDocs.has(key) && !deletedDocs.has(String(docItem.id)) && !allDocsMap.has(key)) {
                  allDocsMap.set(key, {
                    ...docItem,
                    customerPhone: docItem.customerPhone || cust.phone || '',
                    url: docItem.url || docItem.data || '',
                    data: docItem.url || docItem.data || ''
                  });
                }
              }
            });
          }
        });
      }

      const mergedDocs = Array.from(allDocsMap.values());
      mergedDocs.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
      setCustomerDocs(mergedDocs);

      // 2. MERGE ALL TOKENS (Excluding deleted tokens)
      const allTokensMap = new Map();

      const isTokenDeleted = (tok) => {
        if (!tok) return true;
        const keys = [
          String(tok.tokenNo || ''),
          String(tok.tokenId || ''),
          String(tok.id || '')
        ];
        return keys.some((k) => k && deletedTokens.has(k));
      };

      if (Array.isArray(latestCloudTokens)) {
        latestCloudTokens.forEach((t) => {
          const key = String(t.tokenNo || t.tokenId || t.id || '');
          if (key && !isTokenDeleted(t)) allTokensMap.set(key, t);
        });
      }

      if (filteredProfiles && typeof filteredProfiles === 'object') {
        Object.values(filteredProfiles).forEach((cust) => {
          if (cust && cust.lastToken && !isTokenDeleted(cust.lastToken)) {
            const t = cust.lastToken;
            const key = String(t.tokenNo || t.tokenId || t.id || '');
            if (key && !allTokensMap.has(key)) {
              allTokensMap.set(key, t);
            }
          }
        });
      }

      if (latestCloudApps && typeof latestCloudApps === 'object') {
        Object.values(latestCloudApps).forEach((app) => {
          if (app && (app.tokenId || app.id)) {
            const key = String(app.tokenId || app.id);
            if (key && !isTokenDeleted({ tokenNo: key, tokenId: key, id: key }) && !allTokensMap.has(key)) {
              allTokensMap.set(key, {
                tokenNo: app.tokenId || app.id,
                tokenId: app.tokenId || app.id,
                id: app.id,
                customerName: app.applicantName || 'Customer',
                applicantName: app.applicantName || 'Customer',
                phone: app.phone || '',
                customerPhone: app.phone || '',
                service: app.service || 'e-Sevai Application',
                date: app.date || app.submittedDate || 'Today',
                slot: 'Counter Desk',
                paymentStatus: app.statusLabel || '✅ பதிவு செய்யப்பட்டது (Submitted)',
                issuedAt: app.submittedDate || 'Recently',
                updatedAt: app.updatedAt || new Date().toISOString()
              });
            }
          }
        });
      }

      try {
        const localToks = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
        if (Array.isArray(localToks)) {
          localToks.forEach((t) => {
            const key = String(t.tokenNo || t.tokenId || t.id || '');
            if (key && !isTokenDeleted(t) && !allTokensMap.has(key)) {
              allTokensMap.set(key, t);
            }
          });
        }
      } catch (e) {}

      const mergedTokens = Array.from(allTokensMap.values());
      mergedTokens.sort((a, b) => new Date(b.updatedAt || b.issuedDate || 0) - new Date(a.updatedAt || a.issuedDate || 0));
      setCustomerTokens(mergedTokens);
    };

    const handleSyncEvent = () => syncAllCloudData();
    window.addEventListener('akesevai-data-changed', handleSyncEvent);

    const unsubDocs = subscribeExpiryDocuments((docs) => {
      latestCloudDocs = Array.isArray(docs) ? docs : [];
      syncAllCloudData();
    });

    const unsubTokens = subscribeTokens((tokens) => {
      latestCloudTokens = Array.isArray(tokens) ? tokens : [];
      syncAllCloudData();
    });

    const unsubProfiles = subscribeCustomerProfiles((profiles) => {
      latestCustomerProfiles = profiles && typeof profiles === 'object' ? profiles : {};
      syncAllCloudData();
    });

    const unsubApps = subscribeApplications((apps) => {
      latestCloudApps = apps && typeof apps === 'object' ? apps : {};
      syncAllCloudData();
    });

    return () => {
      window.removeEventListener('akesevai-data-changed', handleSyncEvent);
      if (typeof unsubDocs === 'function') unsubDocs();
      if (typeof unsubTokens === 'function') unsubTokens();
      if (typeof unsubProfiles === 'function') unsubProfiles();
      if (typeof unsubApps === 'function') unsubApps();
    };
  }, []);

  // Photo Cropper & Compressor tool state
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [compressedPhoto, setCompressedPhoto] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [targetKb, setTargetKb] = useState(100);
  const [originalSize, setOriginalSize] = useState(0);

  const announceReceiptOverSpeaker = (name, ackNo) => {
    const cleanToken = (ackNo || '').replace(/^TN-AK-2026-/, '');
    const speechText = `வணக்கம்! ${name}, டோக்கன் எண் ${cleanToken}, கவுண்டர் 1-க்கு வரவும்.`;

    if (window.responsiveVoice && typeof window.responsiveVoice.speak === 'function') {
      window.responsiveVoice.speak(speechText, "Tamil Female", { rate: 0.85 });
      return;
    }

    try {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(speechText)}&tl=ta&client=tw-ob`;
      const audio = new Audio();
      audio.referrerPolicy = 'no-referrer';
      audio.crossOrigin = 'anonymous';
      audio.src = ttsUrl;
      audio.playbackRate = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  const processCompression = (dataUrl, targetSizeKb) => {
    const img = new Image();
    img.onload = () => {
      let quality = 0.92;
      let width = img.width;
      let height = img.height;

      if (targetSizeKb <= 50) {
        width = Math.min(width, 400);
        height = Math.round((img.height / img.width) * width);
      } else if (targetSizeKb <= 100) {
        width = Math.min(width, 600);
        height = Math.round((img.height / img.width) * width);
      } else if (targetSizeKb <= 150) {
        width = Math.min(width, 800);
        height = Math.round((img.height / img.width) * width);
      } else {
        width = Math.min(width, 1000);
        height = Math.round((img.height / img.width) * width);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      let resultUrl = canvas.toDataURL('image/jpeg', quality);
      let kb = Math.round((resultUrl.length * 3) / 4 / 1024);

      while (kb > targetSizeKb && quality > 0.08) {
        quality -= 0.06;
        resultUrl = canvas.toDataURL('image/jpeg', quality);
        kb = Math.round((resultUrl.length * 3) / 4 / 1024);
      }

      setCompressedPhoto(resultUrl);
      setCompressedSize(kb);
    };
    img.src = dataUrl;
  };

  const handlePhotoUploadAndCompress = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginalSize(Math.round(file.size / 1024));

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedPhoto(ev.target.result);
      processCompression(ev.target.result, targetKb);
    };
    reader.readAsDataURL(file);
  };

  const handleTargetKbChange = (newTarget) => {
    setTargetKb(newTarget);
    if (uploadedPhoto) {
      processCompression(uploadedPhoto, newTarget);
    }
  };

  const handleCreateApplicationReceipt = (e) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      if (typeof notify === 'function') notify('❌ பிழை: விண்ணப்பதாரரின் பெயரை உள்ளிடவும்!');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      if (typeof notify === 'function') notify('❌ பிழை: 10 இலக்கச் சரியான மொபைல் எண்ணை உள்ளிடவும்!');
      return;
    }

    const ackNo = `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReceipt = {
      ackNo,
      applicantName,
      phone,
      aadhaarNo: aadhaarNo || 'XXXX XXXX 9842',
      service,
      fee: `₹${fee}`,
      status,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    saveApplicationRecord({
      id: ackNo,
      applicantName,
      phone,
      aadhaarNo,
      service,
      fee: `₹${fee}`,
      currentStage: 3,
      statusLabel: status,
      remarks: `AkEsevai மையத்தில் ${service} விண்ணப்பம் பதிவு செய்யப்பட்டுள்ளது.`
    });

    setReceipt(newReceipt);
    announceReceiptOverSpeaker(applicantName, ackNo);

    if (typeof notify === 'function') notify('✅ இ-சேவை விண்ணப்பம் சேமிக்கப்பட்டது & குரல் வழி அறிவிக்கப்பட்டது!');
  };

  const handlePrintReceipt = () => {
    printElement('admin-receipt-print-area');
  };

  const handlePrintTokenSlipModal = () => {
    printElement('admin-token-modal-print-area');
  };

  const handleSendWhatsAppAck = () => {
    if (!receipt) return;
    const text = encodeURIComponent(
      `🏛️ *AkEsevai மையம், பழனி*\n` +
      `*இ-சேவை விண்ணப்ப ஒப்புதல் சீட்டு*\n\n` +
      `ஒப்புதல் எண்: *${receipt.ackNo}*\n` +
      `விண்ணப்பதாரர்: *${receipt.applicantName}*\n` +
      `சேவை: *${receipt.service}*\n` +
      `கட்டணம்: *${receipt.fee} (Paid)*\n` +
      `நிலை: *${receipt.status}*\n\n` +
      `நன்றி! உங்கள் சான்றிதழ் தயாரானதும் SMS/WhatsApp மூலம் அறிவிக்கப்படும்.\n` +
      `AkEsevai Centre, Mill Road, Palani • 9342318844`
    );
    window.open(`https://wa.me/91${receipt.phone.replace(/\D/g, '')}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp token slip sender for cloud tokens
  const handleSendTokenWhatsApp = (tok) => {
    if (!tok) return;
    const text = encodeURIComponent(
      `🧾 *AkEsevai - OFFICIAL DIGITAL TOKEN SLIP*\n\n` +
      `🎫 *TOKEN NO:* *${tok.tokenNo || tok.tokenId || tok.id}*\n` +
      `👤 *APPLICANT:* ${tok.customerName || tok.applicantName || 'Valued Customer'}\n` +
      `📱 *MOBILE:* +91 ${tok.phone || tok.customerPhone || 'N/A'}\n` +
      `🛠️ *SERVICE:* ${tok.service || 'e-Sevai Service'}\n` +
      `📅 *VISIT DATE:* ${tok.date || 'Today'}\n` +
      `⏰ *SLOT:* ${tok.slot || 'Counter Desk'}\n\n` +
      `✅ *STATUS:* ${tok.paymentStatus || 'Confirmed'}\n` +
      `AkEsevai Digital Portal • Palani`
    );
    const targetPhone = String(tok.phone || tok.customerPhone || '').replace(/\D/g, '');
    window.open(`https://wa.me/91${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const customerListArray = Object.values(customerProfiles || {});

  return (
    <div style={{ background: '#f8fafc', border: '2px solid #0052cc', borderRadius: '18px', padding: '28px', textAlign: 'left', margin: '20px 0' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <span style={{ background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} /> SMART OPERATOR DESK • 2026 இ-சேவை நிர்வாகக் மையம்
          </span>
          <h3 style={{ font: '800 22px Manrope', color: '#022c7a', margin: '6px 0 0' }}>
            நேரடி இ-சேவை <span>விண்ணப்ப உருவாக்கி, டோக்கன் மேலாண்மை & ஆவணக் காப்பகம்</span>
          </h3>
        </div>
      </div>

      {/* COUNTER SPEAKER VOICE CALL WIDGET */}
      <AdminCounterVoiceAnnouncer />

      {/* HOMEPAGE SPONSORED ADS & AI BANNER STUDIO CONTROL DESK */}
      <AdminSponsoredAdsManager notify={notify} />

      {/* OPERATOR WORKSTATION: RECEIPT CREATOR & CROPPER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '20px' }}>
        {/* LEFT FORM: CREATE APPLICATION RECEIPT */}
        <form onSubmit={handleCreateApplicationReceipt} className="smartdesk-card smartdesk-receipt-form" style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '20px', display: 'grid', gap: '14px', background: 'white' }}>
          <h4 className="smartdesk-form-title" style={{ font: '800 16px Manrope', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#022c7a' }}>
            <PlusCircle size={18} color="#16a34a" /> 1. விண்ணப்ப ஒப்புதல் சீட்டு உருவாக்க:
          </h4>

          <label style={{ fontSize: '12px', fontWeight: 700 }}>
            விண்ணப்பதாரர் பெயர் (Applicant Name) *
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="எ.கா: கந்தசாமி K."
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700 }}>
              மொபைல் எண் *
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit Mobile"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
              />
            </label>

            <label style={{ fontSize: '12px', fontWeight: 700 }}>
              ஆதார் எண்
              <input
                type="text"
                value={aadhaarNo}
                onChange={(e) => setAadhaarNo(e.target.value)}
                placeholder="12-digit Aadhaar"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700 }}>
              சேவை (Service)
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
              >
                <option>வருமானச் சான்றிதழ் (Income Certificate)</option>
                <option>ஜாதிச் சான்றிதழ் (Community Certificate)</option>
                <option>இருப்பிடச் சான்றிதழ் (Nativity Certificate)</option>
                <option>முதல் பட்டதாரி சான்றிதழ் (First Graduate)</option>
                <option>ஓபிசி சான்றிதழ் (OBC Certificate)</option>
                <option>குடும்பக் அட்டை திருத்தம் (Ration Card)</option>
                <option>ஆதார் திருத்தம் (Aadhaar Update)</option>
              </select>
            </label>

            <label style={{ fontSize: '12px', fontWeight: 700 }}>
              கட்டணம் (Fee ₹)
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
              />
            </label>
          </div>

          <label style={{ fontSize: '12px', fontWeight: 700 }}>
            நிலை (Status)
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
            >
              <option>விண்ணப்பிக்கப்பட்டது (Applied & Processing)</option>
              <option>VAO & RI சரிபார்ப்பில் உள்ளது</option>
              <option>சான்றிதழ் தயார் (Ready for Download)</option>
              <option>ஒப்புதல் வழங்கப்பட்டது (Approved ✅)</option>
            </select>
          </label>

          <button
            type="submit"
            className="button button-primary"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', padding: '11px', justifySelf: 'start' }}
          >
            <Sparkles size={16} /> ஒப்புதல் சீட்டு உருவாக்கு / Create Receipt
          </button>
        </form>

        {/* RIGHT TOOL: RECEIPT PREVIEW & PHOTO COMPRESSOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* GENERATED RECEIPT DISPLAY */}
          {receipt ? (
            <div id="admin-receipt-print-area" className="smartdesk-card smartdesk-receipt-display" style={{ border: '2px solid #16a34a', borderRadius: '14px', padding: '20px', background: 'white', boxShadow: '0 8px 20px rgba(22,163,74,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#022c7a', display: 'block' }}>AkEsevai Centre, Palani</strong>
                  <small style={{ fontSize: '9px', color: '#16a34a', fontWeight: 800 }}>ACKNOWLEDGEMENT RECEIPT</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>
                    {receipt.ackNo}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '14px' }}>
                <div><small style={{ color: '#64748b' }}>விண்ணப்பதாரர்:</small> <strong>{receipt.applicantName}</strong></div>
                <div><small style={{ color: '#64748b' }}>மொபைல்:</small> <strong>+91 {receipt.phone}</strong></div>
                <div><small style={{ color: '#64748b' }}>சேவை:</small> <strong>{receipt.service}</strong></div>
                <div><small style={{ color: '#64748b' }}>கட்டணம்:</small> <strong style={{ color: '#16a34a' }}>{receipt.fee} (Paid)</strong></div>
                <div><small style={{ color: '#64748b' }}>தேதி:</small> <strong>{receipt.date} ({receipt.time})</strong></div>
                <div><small style={{ color: '#64748b' }}>நிலை:</small> <strong>{receipt.status}</strong></div>
              </div>

              {/* Action buttons */}
              <div data-no-print="true" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={() => announceReceiptOverSpeaker(receipt.applicantName, receipt.ackNo)}
                  style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Volume2 size={15} /> ஸ்பீக்கர் அழைப்பு
                </button>
                <button
                  onClick={handleSendWhatsAppAck}
                  style={{ background: '#25D366', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <MessageCircle size={15} /> WhatsApp
                </button>
                <button
                  onClick={handlePrintReceipt}
                  style={{ background: '#0052cc', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={15} /> அச்சிடு / PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="smartdesk-card smartdesk-empty-preview" style={{ border: '1 dashed #cbd5e1', borderRadius: '14px', padding: '20px', textAlign: 'center', background: 'white' }}>
              <FileText size={36} color="#94a3b8" />
              <h5 className="smartdesk-empty-title" style={{ font: '800 14px Manrope', margin: '8px 0 2px' }}>ஒப்புதல் சீட்டு உருவாக்கப்படவில்லை</h5>
              <p className="smartdesk-empty-sub" style={{ fontSize: '11px', margin: 0 }}>இடதுபுற படிவத்தில் விவரங்களை நிரப்பி "ஒப்புதல் சீட்டு உருவாக்கு" அழுத்தவும்.</p>
            </div>
          )}

          {/* SMART PHOTO CROPPER & COMPRESSOR */}
          <div className="smartdesk-card smartdesk-compressor-card" style={{ border: '1.5px solid #0052cc', borderRadius: '14px', padding: '16px', background: 'white' }}>
            <h5 className="smartdesk-compressor-title" style={{ font: '800 13px Manrope', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#022c7a' }}>
              📸 ஸ்மார்ட் போட்டோ & ஆவண அமுக்கி (Target Size Compressor):
            </h5>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, alignSelf: 'center' }}>அளவு:</span>
              <button
                type="button"
                onClick={() => handleTargetKbChange(50)}
                style={{ background: targetKb === 50 ? '#022c7a' : '#f1f5f9', color: targetKb === 50 ? 'white' : '#475569', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
              >
                &lt; 50 KB (Sign/Thumb)
              </button>
              <button
                type="button"
                onClick={() => handleTargetKbChange(100)}
                style={{ background: targetKb === 100 ? '#022c7a' : '#f1f5f9', color: targetKb === 100 ? 'white' : '#475569', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
              >
                &lt; 100 KB (TNEGA Photo)
              </button>
              <button
                type="button"
                onClick={() => handleTargetKbChange(200)}
                style={{ background: targetKb === 200 ? '#022c7a' : '#f1f5f9', color: targetKb === 200 ? 'white' : '#475569', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
              >
                &lt; 200 KB (Certificate Doc)
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUploadAndCompress}
              style={{ fontSize: '12px' }}
            />

            {compressedPhoto && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '14px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <img src={compressedPhoto} alt="Compressed" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>
                    ✅ அமுக்கப்பட்டது! ({compressedSize} KB)
                  </div>
                  <small style={{ fontSize: '10px', color: '#64748b' }}>அசல் அளவு: {originalSize} KB</small>
                  <br />
                  <a
                    href={compressedPhoto}
                    download="akesevai_compressed_document.jpg"
                    style={{ background: '#16a34a', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                  >
                    <Download size={12} /> பதிவிறக்கு (Download)
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌍 WORLDWIDE CUSTOMERS CENTRAL VAULT & MANAGEMENT HUB (REQUIREMENT PART 1) */}
      {/* ========================================================================= */}
      <div style={{ background: 'white', border: '2px solid #0052cc', borderRadius: '20px', padding: '24px', marginTop: '30px', boxShadow: '0 12px 35px rgba(0,82,204,0.08)' }}>
        
        {/* VAULT HEADER & TAB SELECTOR */}
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <span style={{ background: '#0052cc', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} /> WORLDWIDE CUSTOMER DATA CLOUD • உலகளாவிய வாடிக்கையாளர் மையம்
              </span>
              <h3 style={{ font: '900 22px Manrope', color: '#022c7a', margin: '6px 0 0' }}>
                உலகெங்குமிருந்தும் வாடிக்கையாளர்கள் சமர்ப்பித்த <span>டோக்கன் சீட்டுகள், ஆவணங்கள் & சுயவிவரங்கள்</span>
              </h3>
            </div>

            {/* Quick Stat Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={14} /> {customerTokens.length} டோக்கன்கள்
              </span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> {customerDocs.length} ஆவணங்கள்
              </span>
              <span style={{ background: '#f3e8ff', color: '#7c3aed', border: '1px solid #e9d5ff', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> {customerListArray.length} வாடிக்கையாளர்கள்
              </span>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveVaultTab('tokens')}
              style={{
                background: activeVaultTab === 'tokens' ? '#0052cc' : '#f1f5f9',
                color: activeVaultTab === 'tokens' ? 'white' : '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Ticket size={16} /> 🎫 வாடிக்கையாளர் டோக்கன் சீட்டுகள் ({customerTokens.length})
            </button>

            <button
              onClick={() => setActiveVaultTab('documents')}
              style={{
                background: activeVaultTab === 'documents' ? '#16a34a' : '#f1f5f9',
                color: activeVaultTab === 'documents' ? 'white' : '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FileText size={16} /> 📁 பதிவேற்றிய ஆவணங்கள் ({customerDocs.length})
            </button>

            <button
              onClick={() => setActiveVaultTab('customers')}
              style={{
                background: activeVaultTab === 'customers' ? '#7c3aed' : '#f1f5f9',
                color: activeVaultTab === 'customers' ? 'white' : '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <User size={16} /> 👥 வாடிக்கையாளர் சுயவிவரங்கள் ({customerListArray.length})
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: GENERATED CUSTOMER TOKEN SLIPS VAULT */}
        {/* ========================================================================= */}
        {activeVaultTab === 'tokens' && (
          <div>
            {/* Search */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px' }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  placeholder="🔍 தேடவும்: டோக்கன் எண், வாடிக்கையாளர் பெயர் அல்லது மொபைல் எண் (Search Token No, Name, Mobile)..."
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
              {tokenSearch && (
                <button onClick={() => setTokenSearch('')} style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              )}
            </div>

            {customerTokens.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '14px', color: '#64748b' }}>
                <Ticket size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>வாடிக்கையாளர்கள் இன்னும் டோக்கன்கள் உருவாக்கவில்லை.</p>
                <small>No customer generated token slips recorded yet. When a customer generates a token slip anywhere in the world, it will appear here instantly.</small>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {customerTokens
                  .filter((t) => {
                    if (!tokenSearch.trim()) return true;
                    const q = tokenSearch.toLowerCase();
                    return (
                      String(t.tokenNo || t.tokenId || '').toLowerCase().includes(q) ||
                      String(t.customerName || t.applicantName || '').toLowerCase().includes(q) ||
                      String(t.phone || t.customerPhone || '').toLowerCase().includes(q) ||
                      String(t.service || '').toLowerCase().includes(q)
                    );
                  })
                  .map((tok) => {
                    const tokenNum = tok.tokenNo || tok.tokenId || tok.id || 'TOK-001';
                    const custName = tok.customerName || tok.applicantName || 'Customer';
                    const custPhone = tok.phone || tok.customerPhone || 'N/A';

                    return (
                      <div
                        key={tokenNum}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '14px',
                          background: '#f8fafc',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '240px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0052cc', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '15px', flexShrink: 0 }}>
                            {tokenNum}
                          </div>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#022c7a', display: 'block' }}>
                              👤 {custName}
                            </strong>
                            <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                              🛠️ {tok.service} • 📱 <strong>+91 {custPhone}</strong>
                            </div>
                            <small style={{ fontSize: '11px', color: '#64748b' }}>
                              📅 Visit Date: {tok.date} ({tok.slot || 'Standard Slot'}) • Issued: {tok.issuedAt || 'Recently'}
                            </small>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* View Token Slip Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedTokenForView(tok)}
                            style={{
                              background: '#0052cc',
                              color: 'white',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 6px rgba(0,82,204,0.2)'
                            }}
                          >
                            <Eye size={14} /> சீட்டு காண்க (View Slip)
                          </button>

                          {/* Print / Download Token PDF */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTokenForView(tok);
                              setTimeout(() => handlePrintTokenSlipModal(), 200);
                            }}
                            style={{
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 6px rgba(22,163,74,0.2)'
                            }}
                          >
                            <Printer size={14} /> அச்சிடு / PDF
                          </button>

                          {/* WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleSendTokenWhatsApp(tok)}
                            style={{
                              background: '#25D366',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete Token ${tokenNum}? This will delete the token across all pages & database.`)) {
                                setCustomerTokens((prev) => prev.filter((t) => (t.tokenNo || t.id || t.tokenId) !== tokenNum));
                                await deleteTokenBookingCloud(tokenNum, custPhone);
                                if (notify) notify(`🗑️ Token ${tokenNum} deleted from all pages & database!`);
                              }
                            }}
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                            title="Delete Token Slip Everywhere"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CUSTOMER UPLOADED DOCUMENTS VAULT */}
        {/* ========================================================================= */}
        {activeVaultTab === 'documents' && (
          <div>
            {/* Search */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px' }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="🔍 தேடவும்: மொபைல் எண் அல்லது ஆவணத்தின் பெயர் (Search Phone or Document Name)..."
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
              {docSearch && (
                <button onClick={() => setDocSearch('')} style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              )}
            </div>

            {customerDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '14px', color: '#64748b' }}>
                <UploadCloud size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>வாடிக்கையாளர்கள் இன்னும் ஆவணங்கள் பதிவேற்றவில்லை.</p>
                <small>No customer document uploads recorded yet. When a customer uploads a PDF/JPG, it will appear here instantly.</small>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {customerDocs
                  .filter((d) => {
                    if (!docSearch.trim()) return true;
                    const query = docSearch.toLowerCase();
                    return (
                      d.name?.toLowerCase().includes(query) ||
                      d.requirement?.toLowerCase().includes(query) ||
                      d.title?.toLowerCase().includes(query) ||
                      d.customerPhone?.toLowerCase().includes(query) ||
                      d.id?.toLowerCase().includes(query)
                    );
                  })
                  .map((docItem) => (
                    <div
                      key={docItem.id || docItem.url}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '14px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <FileText size={22} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                            {docItem.requirement || docItem.title || docItem.name || 'Uploaded Document'}
                          </strong>
                          <small style={{ fontSize: '11px', color: '#64748b' }}>
                            📄 {docItem.name || 'document.pdf'} • 📱 Customer: <strong>+91 {docItem.customerPhone || 'N/A'}</strong> • {docItem.uploadedAt || 'Recently'}
                          </small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <a
                          href={docItem.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#0052cc',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(0,82,204,0.2)'
                          }}
                          title="View PDF or JPG Document"
                        >
                          <Eye size={14} /> ஆவணம் காண்க (View)
                        </a>

                        <a
                          href={docItem.url}
                          download={docItem.name || 'customer_document.pdf'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#16a34a',
                            color: 'white',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(22,163,74,0.2)'
                          }}
                          title="Download PDF or JPG File"
                        >
                          <Download size={14} /> பதிவிறக்கு (Download)
                        </a>

                        <button
                          onClick={async () => {
                            const reqName = docItem.requirement || docItem.name || 'Document';
                            const targetId = docItem.id || docItem.url || docItem.data;
                            if (window.confirm(`Are you sure you want to delete "${reqName}"? This will delete the document across all pages & database.`)) {
                              setCustomerDocs((prev) => prev.filter((d) => String(d.id || d.url || d.data) !== String(targetId)));
                              await deleteExpiryDocumentCloud(targetId, docItem.customerPhone);
                              if (notify) notify(`🗑️ Document "${reqName}" deleted from all pages & database!`);
                            }
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                          title="Delete Document Everywhere"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WORLDWIDE CUSTOMER PROFILES VAULT */}
        {/* ========================================================================= */}
        {activeVaultTab === 'customers' && (
          <div>
            {/* Search */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px' }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="🔍 தேடவும்: வாடிக்கையாளர் பெயர் அல்லது மொபைல் (Search Customer Name or Phone)..."
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
              {customerSearch && (
                <button onClick={() => setCustomerSearch('')} style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
              )}
            </div>

            {customerListArray.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '14px', color: '#64748b' }}>
                <User size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>வாடிக்கையாளர் சுயவிவரங்கள் இல்லை.</p>
                <small>No registered customer profiles found. As customers interact worldwide, profiles will register here.</small>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {customerListArray
                  .filter((c) => {
                    if (!customerSearch.trim()) return true;
                    const q = customerSearch.toLowerCase();
                    return (
                      String(c.name || '').toLowerCase().includes(q) ||
                      String(c.phone || '').toLowerCase().includes(q)
                    );
                  })
                  .map((cust, idx) => (
                    <div
                      key={cust.phone || idx}
                      style={{
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#f3e8ff', color: '#7c3aed', display: 'grid', placeItems: 'center', fontWeight: 900, flexShrink: 0 }}>
                          <User size={20} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                            {cust.name || 'Registered Customer'}
                          </strong>
                          <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '2px' }}>
                            📱 +91 {cust.phone}
                          </div>
                          <small style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                            Last Active: {cust.updatedAt ? new Date(cust.updatedAt).toLocaleDateString('en-IN') : 'Recently'}
                          </small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <a
                          href={`https://wa.me/91${String(cust.phone).replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(cust.name || '')},%20Greetings%20from%20AkEsevai%20Centre.`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            flex: 1,
                            background: '#25D366',
                            color: 'white',
                            textAlign: 'center',
                            padding: '8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>

                        <a
                          href={`tel:${cust.phone}`}
                          style={{
                            background: '#0052cc',
                            color: 'white',
                            textAlign: 'center',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Call
                        </a>

                        <button
                          type="button"
                          onClick={async () => {
                            const custName = cust.name || 'Customer';
                            const custPhone = cust.phone || '';
                            if (!custPhone) return;

                            if (
                              window.confirm(
                                `Are you sure you want to delete customer profile for "${custName}" (+91 ${custPhone})?\n\n` +
                                `This will delete customer records, uploaded documents, token slips, and applications everywhere across all pages and database!`
                              )
                            ) {
                              setCustomerProfiles((prev) => {
                                const copy = { ...prev };
                                delete copy[custPhone];
                                delete copy[`+91${custPhone}`];
                                delete copy[`91${custPhone}`];
                                return copy;
                              });
                              setCustomerDocs((prev) => prev.filter((d) => String(d.customerPhone || '').replace(/\D/g, '') !== String(custPhone).replace(/\D/g, '')));
                              setCustomerTokens((prev) => prev.filter((t) => String(t.phone || t.customerPhone || '').replace(/\D/g, '') !== String(custPhone).replace(/\D/g, '')));

                              await deleteCustomerProfileCloud(custPhone);

                              if (notify) notify(`🗑️ Customer profile for ${custName} (+91 ${custPhone}) and all tokens/docs deleted everywhere!`);
                            }
                          }}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Delete Customer Profile & All Data"
                        >
                          <Trash2 size={14} /> நீக்கு
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* AUTO-FILL CUSTOMER PROFILE DRAWER FOR TNEGA */}
      <AdminAutoFillProfileDrawer />

      {/* ========================================================================= */}
      {/* FULL TOKEN SLIP VIEW & PRINT MODAL */}
      {/* ========================================================================= */}
      {selectedTokenForView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', zIndex: 99999, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '26px', maxWidth: '520px', width: '100%', border: '2px solid #0052cc', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <strong style={{ fontSize: '16px', color: '#022c7a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={18} color="#0052cc" /> 🎫 வாடிக்கையாளர் டோக்கன் சீட்டு விவரம்
              </strong>
              <button onClick={() => setSelectedTokenForView(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontWeight: 900 }}>✕</button>
            </div>

            {/* PRINTABLE TOKEN CARD AREA */}
            <div id="admin-token-modal-print-area" style={{ background: '#f8fafc', border: '2px solid #0052cc', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #0052cc', paddingBottom: '10px', marginBottom: '14px' }}>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '15px', color: '#022c7a', display: 'block' }}>AkEsevai Digital Portal</strong>
                  <small style={{ fontSize: '10px', color: '#16a34a', fontWeight: 900 }}>OFFICIAL TOKEN ACKNOWLEDGEMENT</small>
                </div>
                <div style={{ background: '#0052cc', color: 'white', padding: '6px 14px', borderRadius: '12px', fontSize: '16px', fontWeight: 900 }}>
                  {selectedTokenForView.tokenNo || selectedTokenForView.tokenId || 'TOK-001'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px', textAlign: 'left', marginBottom: '16px' }}>
                <div><small style={{ color: '#64748b' }}>விண்ணப்பதாரர்:</small><br /><strong>{selectedTokenForView.customerName || selectedTokenForView.applicantName || 'Valued Customer'}</strong></div>
                <div><small style={{ color: '#64748b' }}>மொபைல் எண்:</small><br /><strong>+91 {selectedTokenForView.phone || selectedTokenForView.customerPhone || 'N/A'}</strong></div>
                <div style={{ gridColumn: '1 / -1' }}><small style={{ color: '#64748b' }}>சேவை:</small><br /><strong style={{ color: '#0052cc' }}>{selectedTokenForView.service}</strong></div>
                <div><small style={{ color: '#64748b' }}>தேதி & நேரம்:</small><br /><strong>{selectedTokenForView.date} ({selectedTokenForView.slot || 'Morning'})</strong></div>
                <div><small style={{ color: '#64748b' }}>நிலை:</small><br /><strong style={{ color: '#16a34a' }}>{selectedTokenForView.paymentStatus || 'Confirmed'}</strong></div>
              </div>

              {/* Barcode & Stamp Simulation */}
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'left' }}>
                  <strong>AkEsevai Palani Centre</strong><br />
                  Mill Road • Counter 1<br />
                  Issued: {selectedTokenForView.issuedAt || 'Recently'}
                </div>
                <div style={{ border: '2px solid #16a34a', borderRadius: '8px', padding: '4px 8px', color: '#16a34a', fontSize: '10px', fontWeight: 900 }}>
                  ✅ SEAL VERIFIED
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrintTokenSlipModal}
                style={{ background: '#0052cc', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,82,204,0.3)' }}
              >
                <Printer size={16} /> 🖨️ சீட்டை அச்சிடு / Download PDF
              </button>

              <button
                onClick={() => handleSendTokenWhatsApp(selectedTokenForView)}
                style={{ background: '#25D366', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}
              >
                <MessageCircle size={16} /> WhatsApp
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
