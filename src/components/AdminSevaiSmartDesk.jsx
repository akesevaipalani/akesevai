import React, { useState, useEffect } from 'react';
import { Cpu, FileText, CheckCircle2, Printer, MessageCircle, ArrowRight, UploadCloud, RefreshCw, Sparkles, ShieldCheck, Download, PlusCircle, Volume2, Eye, Search, FileCheck2, Trash2 } from 'lucide-react';
import { saveApplicationRecord, getStoredApplications, updateApplicationStage } from '../utils/statusStore';
import { subscribeExpiryDocuments, deleteExpiryDocumentCloud } from '../utils/firebaseService';
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

  // Customer Uploaded Documents state
  const [customerDocs, setCustomerDocs] = useState([]);
  const [docSearch, setDocSearch] = useState('');

  useEffect(() => {
    const loadMergedDocs = (cloudDocs = []) => {
      const combined = Array.isArray(cloudDocs) ? cloudDocs : [];
      
      const uniqueDocs = combined.reduce((acc, current) => {
        const url = current.url || current.data;
        const name = current.name;
        if (!url && !name) return acc;
        const exists = acc.find(item => (url && (item.url === url || item.data === url)) || (item.name === name && item.customerPhone === current.customerPhone));
        if (!exists) {
          acc.push({
            ...current,
            url: url || current.data,
            data: url || current.data
          });
        }
        return acc;
      }, []);

      setCustomerDocs(uniqueDocs);
    };

    const unsubscribe = subscribeExpiryDocuments((docs) => {
      loadMergedDocs(docs);
    });

    loadMergedDocs([]);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
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
      if (typeof notify === 'function') notify('❌ பிழை: விண்ணப்பதாரரின் பெயரை உள்ளிடவும்! (Applicant Name Required)');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      if (typeof notify === 'function') notify('❌ பிழை: 10 இலக்கச் சரியான மொபைல் எண்ணை உள்ளிடவும்! (Invalid 10-digit Phone)');
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
    
    // Automatically announce Customer Name, Token & Counter Over Speaker in Tamil
    announceReceiptOverSpeaker(applicantName, ackNo);

    if (typeof notify === 'function') notify('✅ இ-சேவை விண்ணப்பம் சேமிக்கப்பட்டது & குரல் வழி அறிவிக்கப்பட்டது!');
  };

  const handlePrintReceipt = () => {
    printElement('admin-receipt-print-area');
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

  return (
    <div style={{ background: '#f8fafc', border: '2px solid #0052cc', borderRadius: '18px', padding: '28px', textAlign: 'left', margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <span style={{ background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} /> SMART OPERATOR DESK • 2026 இ-சேவை ஸ்மார்ட் ஆபரேட்டர் கருவி
          </span>
          <h3 style={{ font: '800 22px Manrope', color: '#022c7a', margin: '6px 0 0' }}>
            நேரடி இ-சேவை <span>விண்ணப்ப உருவாக்கி & ஆவண அமுக்கி</span>
          </h3>
        </div>
      </div>

      {/* COUNTER SPEAKER VOICE CALL WIDGET */}
      <AdminCounterVoiceAnnouncer />

      {/* HOMEPAGE SPONSORED ADS CONTROL DESK */}
      <AdminSponsoredAdsManager notify={notify} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '20px' }}>
        {/* LEFT FORM: CREATE APPLICATION RECEIPT */}
        <form onSubmit={handleCreateApplicationReceipt} className="smartdesk-card smartdesk-receipt-form" style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '20px', display: 'grid', gap: '14px' }}>
          <h4 className="smartdesk-form-title" style={{ font: '800 16px Manrope', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
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

        {/* RIGHT TOOL: PHOTO CROPPER & RECEIPT PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* GENERATED RECEIPT DISPLAY */}
          {receipt ? (
            <div id="admin-receipt-print-area" className="smartdesk-card smartdesk-receipt-display" style={{ border: '2px solid #16a34a', borderRadius: '14px', padding: '20px', boxShadow: '0 8px 20px rgba(22,163,74,0.1)' }}>
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

              {/* Action buttons - hidden when printing */}
              <div data-no-print="true" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={() => announceReceiptOverSpeaker(receipt.applicantName, receipt.ackNo)}
                  style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Volume2 size={15} /> ஸ்பீக்கர் அழைப்பு (Speaker)
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
                  <Printer size={15} /> அச்சிடு
                </button>
              </div>
            </div>
          ) : (
            <div className="smartdesk-card smartdesk-empty-preview" style={{ border: '1px dashed #cbd5e1', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <FileText size={36} color="#94a3b8" />
              <h5 className="smartdesk-empty-title" style={{ font: '800 14px Manrope', margin: '8px 0 2px' }}>ஒப்புதல் சீட்டு உருவாக்கப்படவில்லை</h5>
              <p className="smartdesk-empty-sub" style={{ fontSize: '11px', margin: 0 }}>இடதுபுற படிவத்தில் விவரங்களை நிரப்பி "ஒப்புதல் சீட்டு உருவாக்கு" பொத்தானைக் அழுத்தவும்.</p>
            </div>
          )}

          {/* SMART PHOTO CROPPER & COMPRESSOR FOR TNEGA/TNPSC */}
          <div className="smartdesk-card smartdesk-compressor-card" style={{ border: '1.5px solid #0052cc', borderRadius: '14px', padding: '16px' }}>
            <h5 className="smartdesk-compressor-title" style={{ font: '800 13px Manrope', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '14px', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <img src={compressedPhoto} alt="Compressed" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>
                    ✅ அமுக்கப்பட்டது! (Compressed: {compressedSize} KB)
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

      {/* CUSTOMER UPLOADED DOCUMENTS VAULT (FIREBASE STORAGE & FIRESTORE) */}
      <div style={{ background: 'white', border: '2px solid #16a34a', borderRadius: '16px', padding: '22px', marginTop: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck2 size={14} /> FIREBASE CLOUD STORAGE VAULT
            </span>
            <h4 style={{ font: '800 18px Manrope', color: '#0f172a', margin: '4px 0 0' }}>
              📁 வாடிக்கையாளர் பதிவேற்றிய ஆவணங்கள் (Customer Uploaded PDF & JPG Files)
            </h4>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a', background: '#e6f4ea', padding: '6px 14px', borderRadius: '20px' }}>
            {customerDocs.length} ஆவணங்கள் (Files)
          </span>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="service-search" style={{ flex: 1, margin: 0 }}>
            <Search size={17} />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="🔍 தேடவும்: மொபைல் எண் அல்லது ஆவணத்தின் பெயர் (Search Phone or File Name)..."
            />
          </div>
          {docSearch && (
            <button onClick={() => setDocSearch('')} style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </div>

        {/* Documents Grid / Table */}
        {customerDocs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '13px' }}>
            <UploadCloud size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
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
              .map((doc) => (
                <div
                  key={doc.id || doc.url}
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
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#0052cc', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                        {doc.requirement || doc.title || doc.name || 'Uploaded Document'}
                      </strong>
                      <small style={{ fontSize: '11px', color: '#64748b' }}>
                        📄 {doc.name || 'document.pdf'} • 📱 Customer: <strong>+91 {doc.customerPhone || 'N/A'}</strong> • {doc.uploadedAt || 'Recently'}
                      </small>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#0052cc',
                        color: 'white',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(0,82,204,0.2)'
                      }}
                      title="View PDF or JPG Document"
                    >
                      <Eye size={14} /> காண்க (View Document)
                    </a>

                    <a
                      href={doc.url}
                      download={doc.name || 'customer_document.pdf'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#16a34a',
                        color: 'white',
                        padding: '7px 14px',
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
                        const reqName = doc.requirement || doc.name || 'Document';
                        if (window.confirm(`Are you sure you want to PERMANENTLY delete "${reqName}"?`)) {
                          const targetId = doc.id || doc.url;
                          setCustomerDocs((prev) => prev.filter((d) => d.id !== targetId && d.url !== targetId));
                          await deleteExpiryDocumentCloud(targetId, doc.customerPhone);
                          if (typeof notify === 'function') notify(`🗑️ Document "${reqName}" deleted from Firebase Cloud!`);
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                      title="Delete document from cloud"
                    >
                      <Trash2 size={14} /> நீக்கு (Delete)
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* AUTO-FILL CUSTOMER PROFILE DRAWER FOR TNEGA */}
      <AdminAutoFillProfileDrawer />
    </div>
  );
}
