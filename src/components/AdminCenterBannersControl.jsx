import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, Clock, Users, Zap, CheckCircle2, Save } from 'lucide-react';
import {
  saveLiveQueueCloud,
  subscribeLiveQueue,
  saveServiceOfDayCloud,
  subscribeServiceOfDay
} from '../utils/dataService';

const PRESET_SOD_LIST = [
  { tamil: 'சாதிச் சான்றிதழ்', english: 'Community Certificate', emoji: '🏛️', color: '#16a34a', bg: '#f0fdf4', desc: 'கல்லூரி சேர்க்கை மற்றும் அரசு வேலைவாய்ப்புகளுக்குத் தேவை.', fee: '₹60', days: '3-5 நாட்கள்' },
  { tamil: 'வருமானச் சான்றிதழ்', english: 'Income Certificate', emoji: '📋', color: '#3b82f6', bg: '#eff6ff', desc: 'கல்வி உதவித்தொகை மற்றும் அரசு திட்டங்களுக்கு அவசியமானது.', fee: '₹60', days: '3-7 நாட்கள்' },
  { tamil: 'ஆதார் மொபைல் மாற்றம்', english: 'Aadhaar Mobile Update', emoji: '📱', color: '#7c3aed', bg: '#faf5ff', desc: 'ஆதார் அட்டையில் மொபைல் எண்ணை விரைவாக இணைக்கலாம்.', fee: '₹50', days: '2-5 நாட்கள்' },
  { tamil: 'புதிய வாக்காளர் அட்டை', english: 'New Voter Card', emoji: '🗳️', color: '#dc2626', bg: '#fef2f2', desc: 'புதிய வாக்காளர் பதிவு மற்றும் திருத்தங்களுக்கு உதவுகிறோம்.', fee: '₹0 (Free)', days: '7-14 நாட்கள்' },
  { tamil: 'TNPSC விண்ணப்பம்', english: 'TNPSC Application', emoji: '📝', color: '#d97706', bg: '#fffbeb', desc: 'TNPSC தேர்வு விண்ணப்பம் தவறின்றி பூர்த்தி செய்ய உதவுகிறோம்.', fee: '₹100+', days: '1-2 நாட்கள்' },
  { tamil: 'e-SHRAM CARD', english: 'e-Shram Card', emoji: '🪪', color: '#0052cc', bg: '#eff6ff', desc: 'அசங்கடித் தொழிலாளர்களுக்கான அரசு அடையாள அட்டை.', fee: '₹50', days: '1 நாள்' },
  { tamil: 'புதிய குடும்ப அட்டை', english: 'New Smart Card', emoji: '👨‍👩‍👧‍👦', color: '#15803d', bg: '#f0fdf4', desc: 'புதிய ரேஷன் அட்டை மற்றும் திருத்தங்களுக்கு விண்ணப்பிக்கலாம்.', fee: '₹100', days: '5-10 நாட்கள்' },
];

export default function AdminCenterBannersControl({ notify }) {
  // Live Queue State
  const [centerStatus, setCenterStatus] = useState('open');
  const [waitingCount, setWaitingCount] = useState('3');
  const [waitTime, setWaitTime] = useState('5-10');
  const [openTime, setOpenTime] = useState('திங்கள் - சனி காலை 10:00 - இரவு 8:00');
  const [upiId, setUpiId] = useState('alakesh.kumar7-1@okicici');

  // Service of the Day State
  const [sodTamil, setSodTamil] = useState('சாதிச் சான்றிதழ்');
  const [sodEnglish, setSodEnglish] = useState('Community Certificate');
  const [sodEmoji, setSodEmoji] = useState('🏛️');
  const [sodFee, setSodFee] = useState('₹60');
  const [sodDays, setSodDays] = useState('3-5 நாட்கள்');
  const [sodDesc, setSodDesc] = useState('கல்லூரி சேர்க்கை மற்றும் அரசு வேலைவாய்ப்புகளுக்குத் தேவை.');
  const [sodColor, setSodColor] = useState('#16a34a');
  const [sodBg, setSodBg] = useState('#f0fdf4');

  useEffect(() => {
    const unsubQueue = subscribeLiveQueue((data) => {
      if (data) {
        if (data.status) setCenterStatus(data.status);
        if (data.queueCount !== undefined) setWaitingCount(String(data.queueCount));
        if (data.waitTime) setWaitTime(data.waitTime);
        if (data.openTime) setOpenTime(data.openTime);
        if (data.upiId) setUpiId(data.upiId);
      }
    });

    const unsubSod = subscribeServiceOfDay((sod) => {
      if (sod) {
        if (sod.tamil) setSodTamil(sod.tamil);
        if (sod.english) setSodEnglish(sod.english);
        if (sod.emoji) setSodEmoji(sod.emoji);
        if (sod.fee) setSodFee(sod.fee);
        if (sod.days) setSodDays(sod.days);
        if (sod.desc) setSodDesc(sod.desc);
        if (sod.color) setSodColor(sod.color);
        if (sod.bg) setSodBg(sod.bg);
      }
    });

    return () => {
      if (typeof unsubQueue === 'function') unsubQueue();
      if (typeof unsubSod === 'function') unsubSod();
    };
  }, []);

  const handleSaveLiveQueue = async (e) => {
    e.preventDefault();

    const cleanUpi = String(upiId || '').trim();
    if (!cleanUpi) {
      if (notify) notify('⚠️ UPI ID காலியாக இருக்கக்கூடாது (UPI ID is required)!');
      return;
    }

    // Basic valid UPI VPA format check: e.g. username@bank
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/;
    if (!upiRegex.test(cleanUpi)) {
      if (notify) notify('⚠️ சரியான UPI ID வடிவத்தை உள்ளிடவும் (e.g. username@okaxis, name@okhdfcbank, mobile@upi)!');
      return;
    }

    const payload = {
      status: centerStatus,
      queueCount: waitingCount,
      waitTime: waitTime,
      openTime: openTime,
      upiId: cleanUpi
    };
    await saveLiveQueueCloud(payload);
    if (notify) notify('🟢 மைய நேரலை நிலை, காத்திருப்பு நேரம் மற்றும் UPI ID வெற்றிகரமாக புதுப்பிக்கப்பட்டது!');
  };

  const handlePresetSelect = (preset) => {
    setSodTamil(preset.tamil);
    setSodEnglish(preset.english);
    setSodEmoji(preset.emoji);
    setSodFee(preset.fee);
    setSodDays(preset.days);
    setSodDesc(preset.desc);
    setSodColor(preset.color);
    setSodBg(preset.bg);
  };

  const handleSaveServiceOfDay = async (e) => {
    e.preventDefault();
    const payload = {
      tamil: sodTamil,
      english: sodEnglish,
      emoji: sodEmoji,
      fee: sodFee,
      days: sodDays,
      desc: sodDesc,
      color: sodColor,
      bg: sodBg
    };
    await saveServiceOfDayCloud(payload);
    if (notify) notify(`⭐ இன்றைய சிறப்பு சேவை "${sodTamil}" வெற்றிகரமாக அமைக்கப்பட்டது!`);
  };

  return (
    <div className="admin-center-banners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', margin: '20px 0' }}>
      
      {/* 1. CENTER OPERATIONAL STATUS & WAIT TIME BANNER CONTROL */}
      <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', color: 'white', display: 'grid', placeItems: 'center' }}>
            <Clock size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 900 }}>
              🟢 மைய சேவை நிலை (Live Wait Time Banner)
            </h3>
            <small style={{ color: '#64748b', fontSize: '12px' }}>முகப்புப் பக்கத்தில் தோன்றும் நேரலை நிலை & காத்திருப்பு நேரம்</small>
          </div>
        </div>

        <form onSubmit={handleSaveLiveQueue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label htmlFor="admin-center-status-select" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
              மையத்தின் தற்போதைய நிலை (Status):
            </label>
            <select
              id="admin-center-status-select"
              name="center_status"
              value={centerStatus}
              onChange={(e) => setCenterStatus(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 800, background: centerStatus === 'open' ? '#f0fdf4' : '#fef2f2', color: centerStatus === 'open' ? '#16a34a' : '#dc2626' }}
            >
              <option value="open">🟢 மையம் திறந்துள்ளது (Center Open & Operational)</option>
              <option value="closed">🔴 மையம் மூடப்பட்டுள்ளது (Center Currently Closed)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label htmlFor="admin-waiting-count-input" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                👥 காத்திருக்கும் நபர்கள்:
              </label>
              <input
                id="admin-waiting-count-input"
                name="waiting_count"
                type="number"
                value={waitingCount}
                onChange={(e) => setWaitingCount(e.target.value)}
                placeholder="3"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 800 }}
              />
            </div>
            <div>
              <label htmlFor="admin-wait-time-input" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                ⏱️ எதிர்பாக்கும் நேரம்:
              </label>
              <input
                id="admin-wait-time-input"
                name="wait_time"
                type="text"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                placeholder="5-10"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 800 }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-open-time-input" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
              🕒 மையம் செயல்படும் நேரம் (Opening Hours Text):
            </label>
            <input
              id="admin-open-time-input"
              name="open_time_text"
              type="text"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
          </div>

          <div>
            <label htmlFor="admin-upi-id-input" style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', display: 'block', marginBottom: '4px' }}>
              💳 கட்டணம் செலுத்தும் UPI ID (GPay / PhonePe / Paytm / QR):
            </label>
            <input
              id="admin-upi-id-input"
              name="upi_id_text"
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. alakesh.kumar7-1@okicici"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #7dd3fc', fontSize: '13px', fontWeight: 800, color: '#022c7a', background: '#f0f9ff' }}
            />
            <small style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '3px' }}>
              வாடிக்கையாளர் முன்னுரிமை டோக்கன் QR மற்றும் நேரலை கட்டணங்களுக்கு இந்த UPI ID பயன்படுத்தப்படும்.
            </small>
          </div>

          <button
            type="submit"
            style={{
              background: '#0284c7',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '6px'
            }}
          >
            <Save size={16} /> 💾 சேமி & நேரலையில் புதுப்பி (Save Live Banner)
          </button>
        </form>
      </div>

      {/* 2. SERVICE OF THE DAY BANNER CONTROL */}
      <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#16a34a', color: 'white', display: 'grid', placeItems: 'center' }}>
            <Star size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 900 }}>
              ⭐ இன்றைய சிறப்பு சேவை (Service of the Day)
            </h3>
            <small style={{ color: '#64748b', fontSize: '12px' }}>முகப்புப் பக்கத்தில் தோன்றும் சிறப்பு சேவை பேனர்</small>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
            விரைவு சேவை தேர்வு (Quick Presets):
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PRESET_SOD_LIST.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: sodTamil === preset.tamil ? `2px solid ${preset.color}` : '1px solid #cbd5e1',
                  background: sodTamil === preset.tamil ? preset.bg : '#f8fafc',
                  color: sodTamil === preset.tamil ? preset.color : '#334155',
                  cursor: 'pointer'
                }}
              >
                {preset.emoji} {preset.tamil}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSaveServiceOfDay} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <label htmlFor="admin-sod-tamil-title" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                தமிழ் பெயர் (Tamil Title):
              </label>
              <input
                id="admin-sod-tamil-title"
                name="sod_tamil_title"
                type="text"
                required
                value={sodTamil}
                onChange={(e) => setSodTamil(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 800 }}
              />
            </div>
            <div>
              <label htmlFor="admin-sod-emoji-input" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Emoji:
              </label>
              <input
                id="admin-sod-emoji-input"
                name="sod_emoji"
                type="text"
                required
                value={sodEmoji}
                onChange={(e) => setSodEmoji(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', textAlign: 'center' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label htmlFor="admin-sod-english-title" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                ஆங்கில பெயர் (English):
              </label>
              <input
                id="admin-sod-english-title"
                name="sod_english_title"
                type="text"
                value={sodEnglish}
                onChange={(e) => setSodEnglish(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>
            <div>
              <label htmlFor="admin-sod-fee-input" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
                கட்டணம் (Fee):
              </label>
              <input
                id="admin-sod-fee-input"
                name="sod_fee"
                type="text"
                value={sodFee}
                onChange={(e) => setSodFee(e.target.value)}
                placeholder="₹60"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 800 }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-sod-desc-input" style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '4px' }}>
              விளக்கம் (Description):
            </label>
            <input
              id="admin-sod-desc-input"
              name="sod_description"
              type="text"
              value={sodDesc}
              onChange={(e) => setSodDesc(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px'
            }}
          >
            <Star size={16} /> ⭐ சேமி & சிறப்பு சேவையை அமை (Save Service Banner)
          </button>
        </form>
      </div>

    </div>
  );
}
