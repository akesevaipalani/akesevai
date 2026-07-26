import React, { useState, useEffect } from 'react';
import { Cpu, FileText, CheckCircle2, Printer, MessageCircle, ArrowRight, UploadCloud, RefreshCw, Sparkles, ShieldCheck, Download, PlusCircle, Volume2 } from 'lucide-react';
import { saveApplicationRecord, getStoredApplications, updateApplicationStage } from '../utils/statusStore';
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
        <form onSubmit={handleCreateApplicationReceipt} style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '20px', display: 'grid', gap: '14px' }}>
          <h4 style={{ font: '800 16px Manrope', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={18} color="#16a34a" /> 1. விண்ணப்ப ஒப்புதல் சீட்டு உருவாக்க:
          </h4>

          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
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
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
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

            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
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
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              சேவை (Service)
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none', background: 'white' }}
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

            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              கட்டணம் (Fee ₹)
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
              />
            </label>
          </div>

          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            நிலை (Status)
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none', background: 'white' }}
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
            <div id="admin-receipt-print-area" style={{ background: '#ffffff', border: '2px solid #16a34a', borderRadius: '14px', padding: '20px', boxShadow: '0 8px 20px rgba(22,163,74,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
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
              <div data-no-print="true" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => announceReceiptOverSpeaker(receipt.applicantName, receipt.ackNo)}
                  style={{ background: '#fbbf24', color: '#022c7a', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Volume2 size={15} /> 📢 குரலில் அழை (Speaker Call)
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
            <div style={{ background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <FileText size={36} color="#94a3b8" />
              <h5 style={{ font: '800 14px Manrope', color: '#475569', margin: '8px 0 2px' }}>ஒப்புதல் சீட்டு உருவாக்கப்படவில்லை</h5>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>இடதுபுற படிவத்தில் விவரங்களை நிரப்பி "ஒப்புதல் சீட்டு உருவாக்கு" பொத்தானைக் அழுத்தவும்.</p>
            </div>
          )}

          {/* SMART PHOTO CROPPER & COMPRESSOR FOR TNEGA/TNPSC */}
          <div style={{ background: '#ffffff', border: '1.5px solid #0052cc', borderRadius: '14px', padding: '16px' }}>
            <h5 style={{ font: '800 13px Manrope', color: '#022c7a', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📸 ஸ்மார்ட் போட்டோ & ஆவண அமுக்கி (Target Size Compressor):
            </h5>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', alignSelf: 'center' }}>அளவு:</span>
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
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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

      {/* AUTO-FILL CUSTOMER PROFILE DRAWER FOR TNEGA */}
      <AdminAutoFillProfileDrawer />
    </div>
  );
}
