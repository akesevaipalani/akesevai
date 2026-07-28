import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, Plus, Trash2, Edit3, CheckCircle2, Phone, MessageCircle, 
  Sparkles, RefreshCw, ImagePlus, SlidersHorizontal, X, UploadCloud, 
  Clock, Timer, Zap, Download, Wand2, Layers, Maximize2, Eye, ShieldCheck 
} from 'lucide-react';
import { subscribeSponsoredAds, saveSponsoredAdCloud, deleteSponsoredAdCloud } from '../utils/firebaseService';

const DEFAULT_ADS = [
  {
    id: 1,
    badge: '⭐ GOLD SPONSOR',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    title: '🏛️ ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ் (Balamurugan Prints)',
    tagline: 'அனைத்து டிஜிட்டல் பிரிண்டிங், கலர் ஜெராக்ஸ், லேமினேஷன் மற்றும் விசிட்டிங் கார்டு வசதி!',
    offer: '🎁 AkEsevai வாடிக்கையாளர்களுக்கு 10% தள்ளுபடி!',
    address: 'பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601',
    phone: '9842198421',
    whatsapp: '919842198421',
    image: '',
    bannerSize: 'medium',
    runDurationHours: 720,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    gradient: 'linear-gradient(135deg, #022c7a 0%, #1e1b4b 100%)'
  },
  {
    id: 2,
    badge: '🔥 PREMIUM AD',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    title: '🚗 ஸ்ரீ விநாயகர் ட்ராவல்ஸ் & கார் வாடகை (Vinayagar Travels)',
    tagline: 'பழனி முருகன் கோவில், கொடைக்கானல், மதுரை & கோவை 24x7 சொகுசு கார் சேவை!',
    offer: '🚕 நியாயமான கட்டணம் & 100% பாதுகாப்பான பயணம்!',
    address: 'மில் ரோடு, சண்முகபுரம், பழனி',
    phone: '9443294432',
    whatsapp: '919443294432',
    image: '',
    bannerSize: 'medium',
    runDurationHours: 168,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    gradient: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)'
  }
];

export default function AdminSponsoredAdsManager({ notify }) {
  const [ads, setAds] = useState(DEFAULT_ADS);
  const [showForm, setShowForm] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);

  // Form State
  const [formAdData, setFormAdData] = useState({
    badge: '⭐ GOLD SPONSOR',
    title: '',
    tagline: '',
    offer: '🎁 AkEsevai வாடிக்கையாளர்களுக்கு சிறப்பு ஆஃபர்!',
    address: 'பழனி, திண்டுக்கல் மாவட்டம்',
    phone: '9342318844',
    whatsapp: '919342318844',
    image: '',
    bannerSize: 'medium', // 'hero' (1200x400), 'wide' (728x90), 'square' (1080x1080), 'story' (1080x1920), 'medium' (400x250)
    runDurationHours: 24, // Preset in hours (0 = Unlimited)
    startTime: new Date().toISOString()
  });

  // AI Image Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [aiTagline, setAiTagline] = useState('');
  const [aiOffer, setAiOffer] = useState('🎁 10% தள்ளுபடி (10% OFF)');
  const [aiTheme, setAiTheme] = useState('modern'); // 'modern', 'traditional', 'neon', 'luxury', 'emerald'
  const [aiBannerSize, setAiBannerSize] = useState('medium');
  const [generatedAiImage, setGeneratedAiImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  // Live timer tick for calculating remaining run time
  const [nowTime, setNowTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeSponsoredAds((cloudAds) => {
      if (Array.isArray(cloudAds) && cloudAds.length > 0) {
        setAds(cloudAds);
      } else {
        setAds(DEFAULT_ADS);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Save to central server
  const saveAdsToStorage = (updatedList) => {
    setAds(updatedList);
    updatedList.forEach((ad) => saveSponsoredAdCloud(ad));
    window.dispatchEvent(new Event('storage'));
  };

  // Open Form for Adding New Ad
  const handleOpenAddForm = () => {
    setEditingAdId(null);
    setFormAdData({
      badge: '⭐ GOLD SPONSOR',
      title: '',
      tagline: '',
      offer: '🎁 AkEsevai வாடிக்கையாளர்களுக்கு சிறப்பு ஆஃபர்!',
      address: 'பழனி, திண்டுக்கல் மாவட்டம்',
      phone: '9342318844',
      whatsapp: '919342318844',
      image: '',
      bannerSize: 'medium',
      runDurationHours: 24,
      startTime: new Date().toISOString()
    });
    setShowForm(true);
  };

  // Open Form for Editing Existing Ad
  const handleOpenEditForm = (ad) => {
    setEditingAdId(ad.id);
    setFormAdData({
      badge: ad.badge || '⭐ GOLD SPONSOR',
      title: ad.title || '',
      tagline: ad.tagline || '',
      offer: ad.offer || '',
      address: ad.address || '',
      phone: ad.phone || '',
      whatsapp: ad.whatsapp || '',
      image: ad.image || '',
      bannerSize: ad.bannerSize || 'medium',
      runDurationHours: ad.runDurationHours ?? 24,
      startTime: ad.startTime || new Date().toISOString()
    });
    setShowForm(true);
  };

  // Handle Image Upload & Convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (notify) notify('⚠️ படத்தின் அளவு 5MB-க்குள் இருக்க வேண்டும்!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormAdData((prev) => ({ ...prev, image: reader.result }));
      if (notify) notify('🖼️ படம் பதிவேற்றப்பட்டது!');
    };
    reader.readAsDataURL(file);
  };

  // Calculate End Time based on Duration
  const computeEndTime = (startIso, hours) => {
    if (!hours || Number(hours) === 0) return null; // Unlimited
    const startMs = new Date(startIso).getTime();
    const endMs = startMs + Number(hours) * 3600 * 1000;
    return new Date(endMs).toISOString();
  };

  // Save Ad (Create or Edit Update)
  const handleSaveAd = (e) => {
    e.preventDefault();
    if (!formAdData.title.trim() || !formAdData.tagline.trim()) {
      if (notify) notify('⚠️ தயவுசெய்து விளம்பரத் தலைப்பு மற்றும் விவரங்களை உள்ளிடவும்!');
      return;
    }

    const badgeBg = formAdData.badge.includes('GOLD') ? '#fef3c7' : formAdData.badge.includes('PREMIUM') ? '#dcfce7' : '#eff6ff';
    const badgeColor = formAdData.badge.includes('GOLD') ? '#b45309' : formAdData.badge.includes('PREMIUM') ? '#15803d' : '#1d4ed8';

    const startTime = formAdData.startTime || new Date().toISOString();
    const runDurationHours = Number(formAdData.runDurationHours);
    const endTime = computeEndTime(startTime, runDurationHours);

    if (editingAdId) {
      // Edit existing ad
      const updated = ads.map((item) => {
        if (item.id === editingAdId) {
          return {
            ...item,
            badge: formAdData.badge,
            badgeBg,
            badgeColor,
            title: formAdData.title.trim(),
            tagline: formAdData.tagline.trim(),
            offer: formAdData.offer.trim(),
            address: formAdData.address.trim(),
            phone: formAdData.phone.trim(),
            whatsapp: formAdData.whatsapp.trim().startsWith('91') ? formAdData.whatsapp.trim() : `91${formAdData.whatsapp.trim()}`,
            image: formAdData.image,
            bannerSize: formAdData.bannerSize,
            runDurationHours,
            startTime,
            endTime
          };
        }
        return item;
      });
      saveAdsToStorage(updated);
      if (notify) notify('✏️ விளம்பரம் வெற்றிகரமாக மாற்றப்பட்டது!');
    } else {
      // Create new ad
      const createdAd = {
        id: Date.now(),
        badge: formAdData.badge,
        badgeBg,
        badgeColor,
        title: formAdData.title.trim(),
        tagline: formAdData.tagline.trim(),
        offer: formAdData.offer.trim(),
        address: formAdData.address.trim(),
        phone: formAdData.phone.trim(),
        whatsapp: formAdData.whatsapp.trim().startsWith('91') ? formAdData.whatsapp.trim() : `91${formAdData.whatsapp.trim()}`,
        image: formAdData.image,
        bannerSize: formAdData.bannerSize,
        runDurationHours,
        startTime,
        endTime,
        gradient: ads.length % 2 === 0 ? 'linear-gradient(135deg, #022c7a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)'
      };
      const updated = [createdAd, ...ads];
      saveAdsToStorage(updated);
      if (notify) notify('🎉 புதிய விளம்பரம் Home Page-ல் சேர்க்கப்பட்டது!');
    }

    setShowForm(false);
    setEditingAdId(null);
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('⚠️ இந்த விளம்பரத்தை நீக்க நிச்சயமாக விரும்புகிறீர்களா?')) return;
    const updated = ads.filter((a) => a.id !== id);
    saveAdsToStorage(updated);
    await deleteSponsoredAdCloud(id);
    if (notify) notify('🗑️ விளம்பரம் நீக்கப்பட்டது.');
  };

  const handleResetDefaults = () => {
    saveAdsToStorage(DEFAULT_ADS);
    if (notify) notify('🔄 இயல்புநிலை விளம்பரங்கள் புதுப்பிக்கப்பட்டன.');
  };

  // Quick Extend Ad Runtime (+24 Hours)
  const handleExtendAdTime = (adId, extraHours = 24) => {
    const updated = ads.map((ad) => {
      if (ad.id === adId) {
        const currentEndMs = ad.endTime ? new Date(ad.endTime).getTime() : Date.now();
        const baseMs = Math.max(Date.now(), currentEndMs);
        const newEndIso = new Date(baseMs + extraHours * 3600 * 1000).toISOString();
        return {
          ...ad,
          startTime: ad.startTime || new Date().toISOString(),
          endTime: newEndIso,
          runDurationHours: (ad.runDurationHours || 0) + extraHours
        };
      }
      return ad;
    });
    saveAdsToStorage(updated);
    if (notify) notify(`⚡ விளம்பர இயக்க நேரம் +${extraHours} மணிநேரம் நீட்டிக்கப்பட்டது!`);
  };

  // Remaining Runtime calculation helper
  const getAdRuntimeStatus = (ad) => {
    if (!ad.endTime || ad.runDurationHours === 0) {
      return { status: 'unlimited', label: '♾️ எப்போதும் இயங்கும் (Always Active)', color: '#16a34a', bg: '#f0fdf4' };
    }
    const endMs = new Date(ad.endTime).getTime();
    const diffMs = endMs - nowTime;

    if (diffMs <= 0) {
      return { status: 'expired', label: '🔴 காலாவதியானது (Expired)', color: '#dc2626', bg: '#fef2f2' };
    }

    const hours = Math.floor(diffMs / (1000 * 3600));
    const mins = Math.floor((diffMs % (1000 * 3600)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { status: 'active', label: `🟢 ${days} நாட்கள் ${hours % 24}h பாக்கி`, color: '#022c7a', bg: '#eff6ff' };
    }
    return { status: 'active', label: `🟢 ${hours}h ${mins}m பாக்கி (Active)`, color: '#0052cc', bg: '#eff6ff' };
  };

  // --- AI IMAGE GENERATOR ENGINE (CANVAS SYNTHESIS) ---
  const handleOpenAiModal = () => {
    setAiTitle(formAdData.title || 'ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ்');
    setAiTagline(formAdData.tagline || 'அனைத்து டிஜிட்டல் பிரிண்டிங் & லேமினேஷன்!');
    setAiOffer(formAdData.offer || '🎁 AkEsevai வாடிக்கையாளர்களுக்கு 10% தள்ளுபடி!');
    setAiBannerSize(formAdData.bannerSize || 'medium');
    setShowAiModal(true);
  };

  const generateAiBannerImage = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Dimensions based on selected banner size
      let w = 800;
      let h = 500;
      if (aiBannerSize === 'hero') { w = 1200; h = 400; }
      else if (aiBannerSize === 'wide') { w = 1200; h = 200; }
      else if (aiBannerSize === 'square') { w = 1000; h = 1000; }
      else if (aiBannerSize === 'story') { w = 1080; h = 1920; }
      else { w = 800; h = 500; } // medium

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // 1. Theme Gradient & Background Pattern
      let grad;
      if (aiTheme === 'traditional') {
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#780c0c');
        grad.addColorStop(0.5, '#b91c1c');
        grad.addColorStop(1, '#450a0a');
      } else if (aiTheme === 'neon') {
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#581c87');
        grad.addColorStop(1, '#0e7490');
      } else if (aiTheme === 'luxury') {
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.5, '#022c22');
        grad.addColorStop(1, '#14532d');
      } else if (aiTheme === 'emerald') {
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#047857');
        grad.addColorStop(1, '#065f46');
      } else {
        // Modern
        grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#022c7a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Decorative Light Overlay Circles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(w * 0.85, h * 0.2, h * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.arc(w * 0.15, h * 0.8, h * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Border Frame
      ctx.strokeStyle = aiTheme === 'luxury' || aiTheme === 'traditional' ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = Math.round(w * 0.01);
      ctx.strokeRect(15, 15, w - 30, h - 30);

      // Inner Corner Accents
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.round(w * 0.005);
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // 2. Top Kicker Badge
      ctx.fillStyle = aiTheme === 'traditional' ? '#fbbf24' : '#38bdf8';
      const badgeText = '✨ OFFICIAL SPONSORED BANNER • AkEsevai 2026';
      const fontSizeBadge = Math.max(14, Math.round(h * 0.04));
      ctx.font = `bold ${fontSizeBadge}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, w / 2, h * 0.18);

      // 3. Main Business Title
      ctx.fillStyle = '#ffffff';
      const fontSizeTitle = Math.max(22, Math.round(h * 0.085));
      ctx.font = `900 ${fontSizeTitle}px Arial, sans-serif`;

      // Word Wrap Title
      const words = (aiTitle || 'Business Banner Title').split(' ');
      let line = '';
      let y = h * 0.35;
      const maxWidth = w * 0.85;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, w / 2, y);
          line = words[n] + ' ';
          y += fontSizeTitle * 1.25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, w / 2, y);

      // 4. Tagline / Subtitle
      ctx.fillStyle = '#e2e8f0';
      const fontSizeTag = Math.max(14, Math.round(h * 0.048));
      ctx.font = `bold ${fontSizeTag}px Arial, sans-serif`;
      y += fontSizeTag * 2;

      ctx.fillText(aiTagline || 'Quality Products and Services', w / 2, y);

      // 5. Special Offer Pill Badge
      if (aiOffer) {
        y += h * 0.14;
        const offerText = aiOffer.toUpperCase();
        ctx.font = `bold ${Math.max(16, Math.round(h * 0.055))}px Arial, sans-serif`;
        const textWidth = ctx.measureText(offerText).width;

        const pillW = textWidth + 40;
        const pillH = Math.max(36, Math.round(h * 0.09));
        const pillX = (w - pillW) / 2;
        const pillY = y - pillH * 0.7;

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
        ctx.fill();

        ctx.fillStyle = '#022c7a';
        ctx.fillText(offerText, w / 2, pillY + pillH * 0.7);
      }

      // Watermark footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = `${Math.max(10, Math.round(h * 0.03))}px Arial, sans-serif`;
      ctx.fillText('POWERED BY AKESEVAI AI BANNER STUDIO', w / 2, h - 30);

      const resultDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setGeneratedAiImage(resultDataUrl);
      setIsGenerating(false);
    }, 400);
  };

  const handleApplyAiImageToAd = () => {
    if (!generatedAiImage) return;
    setFormAdData((prev) => ({
      ...prev,
      image: generatedAiImage,
      title: aiTitle || prev.title,
      tagline: aiTagline || prev.tagline,
      offer: aiOffer || prev.offer,
      bannerSize: aiBannerSize || prev.bannerSize
    }));
    setShowAiModal(false);
    if (notify) notify('✨ AI மூலம் உருவாக்கப்பட்ட விளம்பர படம் படிவத்தில் சேர்க்கப்பட்டது!');
  };

  return (
    <div className="admin-ad-manager-card" style={{ borderRadius: '20px', padding: '24px', border: '2px solid #022c7a', boxShadow: '0 10px 30px rgba(2,44,122,0.1)', margin: '24px 0', background: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '2px solid #e2e8f0' }}>
        <div>
          <span style={{ background: '#022c7a', color: '#fbbf24', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={14} /> AD & BANNER STUDIO • 2026 விளம்பர கட்டுப்பாட்டு மையம்
          </span>
          <h3 className="ad-manager-title" style={{ fontSize: '20px', fontWeight: 900, margin: '6px 0 0', color: '#022c7a' }}>
            Home Page <span>விளம்பர நேரக் மேலாண்மை & AI இமேஜ் ஜெனரேட்டர்</span>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleOpenAiModal}
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
          >
            <Wand2 size={16} /> ✨ AI படம் உருவாக்கு (AI Image Generator)
          </button>

          <button
            type="button"
            onClick={showForm ? () => setShowForm(false) : handleOpenAddForm}
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'மூடுக / Close' : '➕ புதிய விளம்பரம் சேர் (Add Ad)'}
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Reset Defaults"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* CREATE & EDIT FORM */}
      {showForm && (
        <form onSubmit={handleSaveAd} style={{ background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 16px', color: '#022c7a', fontSize: '17px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#16a34a" /> {editingAdId ? '✏️ விளம்பரத்தை மாற்று (Edit Advertisement):' : '➕ புதிய விளம்பரம் உருவாக்கு (Create Ad):'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Sponsor Badge */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>1. Sponsor Badge (பேட்ஜ்)</div>
              <select
                value={formAdData.badge}
                onChange={(e) => setFormAdData({ ...formAdData, badge: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white' }}
              >
                <option>⭐ GOLD SPONSOR</option>
                <option>🔥 PREMIUM AD</option>
                <option>💎 PLATINUM SPONSOR</option>
                <option>🌟 VERIFIED BUSINESS</option>
              </select>
            </div>

            {/* Banner Size Selector (REQUIREMENT PART 4) */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                2. பானர் அளவு தேர்வு (Select Banner Size) *
              </div>
              <select
                value={formAdData.bannerSize}
                onChange={(e) => setFormAdData({ ...formAdData, bannerSize: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white' }}
              >
                <option value="hero">📐 1200 x 400 (Hero Wide Showcase Banner)</option>
                <option value="wide">📐 728 x 90 (Leaderboard Bar Banner)</option>
                <option value="medium">📐 400 x 250 (Standard Box Banner)</option>
                <option value="square">📐 1080 x 1080 (Square Post Banner)</option>
                <option value="story">📐 1080 x 1920 (Mobile Story Portrait Banner)</option>
              </select>
            </div>

            {/* Running Time Setting (REQUIREMENT PART 2) */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Timer size={14} color="#0052cc" /> 3. விளம்பர இயக்க நேரம் (Set Ad Running Duration) *
              </div>
              <select
                value={formAdData.runDurationHours}
                onChange={(e) => setFormAdData({ ...formAdData, runDurationHours: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #0052cc', fontWeight: 800, background: '#eff6ff', color: '#022c7a' }}
              >
                <option value={1}>⏱️ 1 மணிநேரம் (1 Hour Active)</option>
                <option value={2}>⏱️ 2 மணிநேரம் (2 Hours Active)</option>
                <option value={6}>⏱️ 6 மணிநேரம் (6 Hours Active)</option>
                <option value={12}>⏱️ 12 மணிநேரம் (12 Hours Active)</option>
                <option value={24}>⏱️ 24 மணிநேரம் (1 Day Active)</option>
                <option value={72}>⏱️ 3 நாட்கள் (3 Days Active)</option>
                <option value={168}>⏱️ 7 நாட்கள் (1 Week Active)</option>
                <option value={720}>⏱️ 30 நாட்கள் (1 Month Active)</option>
                <option value={0}>♾️ எப்போதும் இயங்கும் (Always Active / Unlimited)</option>
              </select>
            </div>

            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>4. விளம்பரத் தலைப்பு & கடை பெயர் (Business Title) *</div>
              <input
                type="text"
                required
                value={formAdData.title}
                onChange={(e) => setFormAdData({ ...formAdData, title: e.target.value })}
                placeholder="எ.கா: 🏛️ ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ்"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* Tagline */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>5. விளம்பர விளக்கம் / சலுகைகள் (Tagline) *</div>
              <input
                type="text"
                required
                value={formAdData.tagline}
                onChange={(e) => setFormAdData({ ...formAdData, tagline: e.target.value })}
                placeholder="எ.கா: அனைத்து டிஜிட்டல் பிரிண்டிங், பிளக்ஸ் & விசிட்டிங் கார்டு 10% தள்ளுபடி!"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* IMAGE UPLOADER & AI GENERATOR LAUNCHER */}
            <div style={{ gridColumn: '1 / -1', background: 'white', border: '2px dashed #022c7a', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#022c7a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <ImagePlus size={18} color="#16a34a" /> 6. விளம்பரப் படம் சேர்க்க அல்லது AI மூலம் உருவாக்க:
                <button
                  type="button"
                  onClick={handleOpenAiModal}
                  style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Wand2 size={12} /> AI Banner Studio
                </button>
              </div>

              {formAdData.image ? (
                <div style={{ position: 'relative', display: 'inline-block', margin: '8px 0' }}>
                  <img
                    src={formAdData.image}
                    alt="Ad Preview"
                    style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '10px', border: '2px solid #16a34a', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormAdData({ ...formAdData, image: '' })}
                    style={{ position: 'absolute', top: -10, right: -10, background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontWeight: 900 }}
                    title="Remove Photo"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                  உங்கள் புகைப்படத்தைப் பதிவேற்றலாம் அல்லது மேலே உள்ள <strong>AI Banner Studio</strong> மூலம் நொடியில் உருவாக்கலாம்:
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'block', margin: '0 auto', fontSize: '12px', fontWeight: 700 }}
              />
            </div>

            {/* Offer */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>7. சிறப்பு ஆஃபர் (Special Offer Badge)</div>
              <input
                type="text"
                value={formAdData.offer}
                onChange={(e) => setFormAdData({ ...formAdData, offer: e.target.value })}
                placeholder="எ.கா: 🎁 10% தள்ளுபடி!"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* Address */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>8. முகவரி (Location)</div>
              <input
                type="text"
                value={formAdData.address}
                onChange={(e) => setFormAdData({ ...formAdData, address: e.target.value })}
                placeholder="எ.கா: பழனி பஸ் ஸ்டாண்ட் எதிரில்"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* Phone */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>9. போன் எண் (Phone Number)</div>
              <input
                type="tel"
                value={formAdData.phone}
                onChange={(e) => setFormAdData({ ...formAdData, phone: e.target.value })}
                placeholder="9842198421"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>10. வாட்ஸ்அப் எண் (WhatsApp No)</div>
              <input
                type="tel"
                value={formAdData.whatsapp}
                onChange={(e) => setFormAdData({ ...formAdData, whatsapp: e.target.value })}
                placeholder="919842198421"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)' }}
          >
            <CheckCircle2 size={18} /> {editingAdId ? '💾 மாற்றங்களைச் சேமிக்கவும் (Save Changes)' : '🚀 விளம்பரத்தை வெளியிடவும் (Publish Ad)'}
          </button>
        </form>
      )}

      {/* ACTIVE & MANAGED ADS LIST WITH RUNTIME TIMER & EXTEND ACTIONS */}
      <div>
        <h4 style={{ color: '#475569', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
          தற்போது மேலாண்மை செய்யப்படும் விளம்பரங்கள் ({ads.length}):
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ads.map((ad) => {
            const timeInfo = getAdRuntimeStatus(ad);

            return (
              <div key={ad.id} style={{ background: '#f8fafc', border: `1.5px solid ${timeInfo.status === 'expired' ? '#fca5a5' : '#cbd5e1'}`, borderRadius: '16px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                {/* Photo Thumbnail if uploaded */}
                {ad.image && (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    style={{ width: 85, height: 65, objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                  />
                )}

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ background: ad.badgeBg || '#fef3c7', color: ad.badgeColor || '#b45309', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 }}>
                      {ad.badge}
                    </span>

                    {/* Banner Size Tag */}
                    <span style={{ background: '#e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>
                      📐 Size: {ad.bannerSize || 'medium'}
                    </span>

                    {/* Runtime Status Tag (REQUIREMENT PART 2) */}
                    <span style={{ background: timeInfo.bg, color: timeInfo.color, border: `1px solid ${timeInfo.color}40`, padding: '3px 9px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {timeInfo.label}
                    </span>

                    <strong style={{ fontSize: '16px', color: '#022c7a', fontWeight: 900 }}>{ad.title}</strong>
                  </div>

                  <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>{ad.tagline}</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800 }}>
                    {ad.offer} • 📍 {ad.address} • 📞 {ad.phone}
                  </div>
                </div>

                {/* Action Buttons: Time Extend, Edit, Delete */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleExtendAdTime(ad.id, 24)}
                    style={{ background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Extend runtime by +24 hours"
                  >
                    <Zap size={13} color="#0052cc" /> +24h நீட்டி
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(ad)}
                    style={{ background: '#022c7a', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Edit3 size={14} /> ✏️ எடிட் (Edit)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAd(ad.id)}
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trash2 size={14} /> நீக்கு
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- AI BANNER / IMAGE GENERATOR MODAL (REQUIREMENT PART 3) --- */}
      {showAiModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '26px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '2px solid #7c3aed', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#f3e8ff', color: '#7c3aed', display: 'grid', placeItems: 'center' }}>
                  <Wand2 size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, font: '900 18px Manrope', color: '#1e1b4b' }}>✨ AI விளம்பர பானர் இமேஜ் ஜெனரேட்டர்</h3>
                  <small style={{ color: '#64748b' }}>நிர்வாகி வழங்கும் விவரங்களைக் கொண்டு உடனடி HD விளம்பரப் படம் உருவாக்கலாம்.</small>
                </div>
              </div>

              <button onClick={() => setShowAiModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 900 }}>✕</button>
            </div>

            {/* AI Generator Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  1. கடை பெயர் / தலைப்பு (Business Name)
                </label>
                <input
                  type="text"
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  placeholder="எ.கா: ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ்"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  2. விளம்பர விளக்கம் / டேக்லைன் (Tagline)
                </label>
                <input
                  type="text"
                  value={aiTagline}
                  onChange={(e) => setAiTagline(e.target.value)}
                  placeholder="எ.கா: அனைத்து டிஜிட்டல் பிரிண்டிங் & லேமினேஷன்!"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  3. சிறப்பு ஆஃபர் (Special Offer Text)
                </label>
                <input
                  type="text"
                  value={aiOffer}
                  onChange={(e) => setAiOffer(e.target.value)}
                  placeholder="🎁 10% தள்ளுபடி"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  4. டிசைன் தீம் / ஸ்டைல் (AI Design Style)
                </label>
                <select
                  value={aiTheme}
                  onChange={(e) => setAiTheme(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                >
                  <option value="modern">🎨 Modern Tech (Blue & Ultra-Violet Glow)</option>
                  <option value="traditional">🏛️ Royal South Indian (Gold & Crimson)</option>
                  <option value="neon">⚡ Neon Cyber Offer (Purple & Cyan)</option>
                  <option value="luxury">👑 Luxury Emerald Gold (Emerald Green)</option>
                  <option value="emerald">🌿 Fresh Mint Eco (Fresh Emerald)</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  5. பானர் அளவு தேர்வு (Banner Size Preset)
                </label>
                <select
                  value={aiBannerSize}
                  onChange={(e) => setAiBannerSize(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #7c3aed', fontWeight: 800, background: '#f3e8ff', color: '#581c87' }}
                >
                  <option value="hero">📐 1200 x 400 (Hero Wide Showcase Banner)</option>
                  <option value="wide">📐 1200 x 200 (Leaderboard Slim Banner)</option>
                  <option value="medium">📐 800 x 500 (Standard Medium Banner)</option>
                  <option value="square">📐 1000 x 1000 (Square Social Post Banner)</option>
                  <option value="story">📐 1080 x 1920 (Full Mobile Story Banner)</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={generateAiBannerImage}
              disabled={isGenerating}
              style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed 0%, #1e1b4b 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
            >
              <Wand2 size={18} /> {isGenerating ? '🎨 AI பானர் உருவாக்கப்படுகிறது...' : '✨ AI பானர் படம் உருவாக்கு (Generate AI Image)'}
            </button>

            {/* AI GENERATED IMAGE PREVIEW DISPLAY */}
            {generatedAiImage && (
              <div style={{ marginTop: '20px', background: '#f8fafc', border: '2px solid #16a34a', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#16a34a', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> AI மூலம் உருவாக்கப்பட்ட பானர் தயார் (Generated AI Banner):
                </div>

                <img
                  src={generatedAiImage}
                  alt="AI Banner Preview"
                  style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleApplyAiImageToAd}
                    style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
                  >
                    <CheckCircle2 size={16} /> ✅ விளம்பரத்தில் பயன்படுத்து (Apply to Ad)
                  </button>

                  <a
                    href={generatedAiImage}
                    download="akesevai_ai_generated_banner.jpg"
                    style={{ background: '#0052cc', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={16} /> 📥 படத்தை பதிவிறக்கு (Download HD Image)
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
