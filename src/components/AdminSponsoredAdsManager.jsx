import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Trash2, Edit3, CheckCircle2, Phone, MessageCircle, 
  Sparkles, RefreshCw, ImagePlus, SlidersHorizontal, X, UploadCloud, 
  Clock, Timer, Zap, Download, Wand2, Layers, Maximize2, Eye, ShieldCheck, Settings, Bot, Lightbulb 
} from 'lucide-react';
import { subscribeSponsoredAds, saveSponsoredAdCloud, deleteSponsoredAdCloud } from '../utils/dataService';
import { validatePhotoUpload } from '../utils/documentHelper';
import AiBannerGeneratorModal from './AiBannerGeneratorModal';

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
    address: 'பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601',
    phone: '9842198421',
    whatsapp: '919842198421',
    image: '',
    logoImage: '',
    bannerSize: '1200x628',
    customWidth: 1200,
    customHeight: 628,
    formTheme: 'govt_navy',
    runDurationHours: 720,
    startTime: new Date().toISOString()
  });

  // AI Image Generator Modal State
  const [showAiModal, setShowAiModal] = useState(false);

  // Live timer tick for calculating remaining run time
  const [nowTime, setNowTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeSponsoredAds((cloudAds) => {
      if (Array.isArray(cloudAds)) {
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
    localStorage.setItem('akesevai-sponsored-ads', JSON.stringify(updatedList));
    localStorage.setItem('akesevai-has-custom-sponsored-ads', 'true');
    updatedList.forEach((ad) => saveSponsoredAdCloud(ad));
    window.dispatchEvent(new Event('akesevai-ads-changed'));
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
      address: 'பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601',
      phone: '9842198421',
      whatsapp: '919842198421',
      image: '',
      logoImage: '',
      bannerSize: '1200x628',
      customWidth: 1200,
      customHeight: 628,
      formTheme: 'govt_navy',
      runDurationHours: 720,
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
      image: ad.image || ad.imageUrl || '',
      logoImage: ad.logoImage || '',
      bannerSize: ad.bannerSize || '1200x628',
      customWidth: ad.customWidth || 1200,
      customHeight: ad.customHeight || 628,
      formTheme: ad.formTheme || 'govt_navy',
      runDurationHours: ad.runDurationHours ?? 720,
      startTime: ad.startTime || new Date().toISOString()
    });
    setShowForm(true);
  };

  // Handle Logo Upload & Convert to Base64
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePhotoUpload(file, 1);
    if (!validation.valid) {
      if (notify) notify(validation.error);
      else alert(validation.error);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormAdData((prev) => ({ ...prev, logoImage: reader.result }));
      if (notify) notify('🖼️ கடை லோகோ சேர்க்கப்பட்டது!');
    };
    reader.readAsDataURL(file);
  };

  // Handle Image Upload & Convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePhotoUpload(file, 1);
    if (!validation.valid) {
      if (notify) notify(validation.error);
      else alert(validation.error);
      e.target.value = '';
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
    if (e && e.preventDefault) e.preventDefault();
    if (!formAdData.title.trim() && !formAdData.image) {
      if (notify) notify('⚠️ தயவுசெய்து விளம்பரத் தலைப்பு அல்லது பேனர் படத்தை உள்ளிடவும்!');
      return;
    }

    const badgeBg = formAdData.badge.includes('GOLD') ? '#fef3c7' : formAdData.badge.includes('PREMIUM') ? '#dcfce7' : '#eff6ff';
    const badgeColor = formAdData.badge.includes('GOLD') ? '#b45309' : formAdData.badge.includes('PREMIUM') ? '#15803d' : '#1d4ed8';

    const startTime = formAdData.startTime || new Date().toISOString();
    const runDurationHours = Number(formAdData.runDurationHours) || 720;
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
            imageUrl: formAdData.image,
            logoImage: formAdData.logoImage,
            bannerSize: formAdData.bannerSize,
            customWidth: formAdData.customWidth,
            customHeight: formAdData.customHeight,
            formTheme: formAdData.formTheme,
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
        title: formAdData.title.trim() || 'AkEsevai Sponsored Ad',
        tagline: formAdData.tagline.trim() || '',
        offer: formAdData.offer.trim() || '',
        address: formAdData.address.trim() || 'பழனி',
        phone: formAdData.phone.trim() || '9842198421',
        whatsapp: formAdData.whatsapp.trim().startsWith('91') ? formAdData.whatsapp.trim() : `91${formAdData.whatsapp.trim()}`,
        image: formAdData.image,
        imageUrl: formAdData.image,
        logoImage: formAdData.logoImage,
        bannerSize: formAdData.bannerSize,
        customWidth: formAdData.customWidth,
        customHeight: formAdData.customHeight,
        formTheme: formAdData.formTheme,
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

  // Handler when AI Banner Studio clicks "Apply to Ads"
  const handleApplyAiStudioBanner = (aiBannerData) => {
    if (!aiBannerData || !aiBannerData.image) return;

    const newAd = {
      id: Date.now(),
      badge: '⭐ GOLD SPONSOR',
      badgeBg: '#fef3c7',
      badgeColor: '#b45309',
      title: aiBannerData.title || 'AkEsevai AI Banner',
      tagline: aiBannerData.tagline || 'அனைத்து டிஜிட்டல் அரசு இ-சேவை வசதிகள்',
      offer: aiBannerData.offer || '🎁 AkEsevai சிறப்பு சலுகை!',
      address: aiBannerData.address || 'பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601',
      phone: aiBannerData.phone || '9842198421',
      whatsapp: aiBannerData.whatsapp?.startsWith('91') ? aiBannerData.whatsapp : `91${aiBannerData.whatsapp || '9842198421'}`,
      image: aiBannerData.image,
      imageUrl: aiBannerData.image,
      bannerSize: aiBannerData.bannerSize || '1200x628',
      customWidth: aiBannerData.customWidth || 1200,
      customHeight: aiBannerData.customHeight || 628,
      runDurationHours: 720,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      gradient: 'linear-gradient(135deg, #022c7a 0%, #1e1b4b 100%)'
    };

    const updated = [newAd, ...ads];
    saveAdsToStorage(updated);
    if (notify) notify('🎉 AI மூலம் உருவாக்கப்பட்ட புதிய விளம்பரம் முகப்புப் பக்கத்தில் நேரலையாக சேர்க்கப்பட்டது!');
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('⚠️ இந்த விளம்பரத்தை நீக்க நிச்சயமாக விரும்புகிறீர்களா?')) return;
    const strId = String(id).trim();
    const updated = ads.filter((a) => String(a.id).trim() !== strId);
    setAds(updated);
    localStorage.setItem('akesevai-sponsored-ads', JSON.stringify(updated));
    localStorage.setItem('akesevai-has-custom-sponsored-ads', 'true');
    await deleteSponsoredAdCloud(strId);
    window.dispatchEvent(new Event('akesevai-ads-changed'));
    window.dispatchEvent(new Event('storage'));
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

  return (
    <div className="admin-ad-manager-card" style={{ borderRadius: '20px', padding: '24px', border: '2px solid #022c7a', boxShadow: '0 10px 30px rgba(2,44,122,0.1)', margin: '24px 0', background: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '2px solid #e2e8f0' }}>
        <div>
          <span style={{ background: '#022c7a', color: '#fbbf24', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={14} /> AD & BANNER STUDIO • 2026 விளம்பர கட்டுப்பாட்டு மையம்
          </span>
          <h3 className="ad-manager-title" style={{ fontSize: '20px', fontWeight: 900, margin: '6px 0 0', color: '#022c7a' }}>
            Home Page <span>விளம்பர நேரக் மேலாண்மை & AI Professional Banner Studio</span>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
          >
            <Wand2 size={16} /> ✨ AI Banner உருவாக்கு (AI Studio)
          </button>

          <button
            type="button"
            onClick={showForm ? () => setShowForm(false) : handleOpenAddForm}
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'மூடுக / Close' : '➕ நேரடி விளம்பரம் சேர் (Manual Ad)'}
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

      {/* CREATE & EDIT MANUAL FORM */}
      {showForm && (
        <form onSubmit={handleSaveAd} className="admin-ad-create-form" style={{ background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, color: '#022c7a', fontSize: '17px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#16a34a" /> {editingAdId ? '✏️ விளம்பரத்தை மாற்று (Edit Advertisement):' : '➕ புதிய விளம்பரம் உருவாக்கு (Create Ad):'}
            </h4>
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              style={{ background: '#f3e8ff', color: '#7c3aed', border: '1.5px solid #d8b4fe', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Wand2 size={13} /> AI மூலம் படத்தை உருவாக்கலாம்
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Sponsor Badge */}
            <div>
              <label htmlFor="admin-ad-badge" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>1. Sponsor Badge (பேட்ஜ்)</label>
              <select
                id="admin-ad-badge"
                name="ad_badge"
                value={formAdData.badge}
                onChange={(e) => setFormAdData({ ...formAdData, badge: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white' }}
              >
                <option>⭐ GOLD SPONSOR</option>
                <option>🔥 PREMIUM AD</option>
                <option>💎 PLATINUM SPONSOR</option>
                <option>🌟 VERIFIED BUSINESS</option>
              </select>
            </div>

            {/* Banner Size */}
            <div>
              <label htmlFor="admin-ad-size" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>2. பேனர் அளவு (Size)</label>
              <select
                id="admin-ad-size"
                name="ad_size"
                value={formAdData.bannerSize}
                onChange={(e) => setFormAdData({ ...formAdData, bannerSize: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white' }}
              >
                <option value="1200x628">📐 1200 x 628 (Facebook / Standard Promo)</option>
                <option value="800x500">📐 800 x 500 (Medium Web Box)</option>
                <option value="1024x512">📐 1024 x 512 (Wide Header Banner)</option>
                <option value="1080x1080">📐 1080 x 1080 (Square Instagram)</option>
                <option value="1080x1920">📐 1080 x 1920 (Mobile Status Story)</option>
                <option value="1920x1080">📐 1920 x 1080 (Full HD Landscape)</option>
              </select>
            </div>

            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="admin-ad-title" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>3. விளம்பரத் தலைப்பு / கடை பெயர் (Business Title) *</label>
              <input
                id="admin-ad-title"
                name="ad_title"
                type="text"
                required
                value={formAdData.title}
                onChange={(e) => setFormAdData({ ...formAdData, title: e.target.value })}
                placeholder="எ.கா: ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ்"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 700 }}
              />
            </div>

            {/* Tagline */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="admin-ad-tagline" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>4. விளம்பர விபரம் / டேக்லைன் (Tagline / Description) *</label>
              <input
                id="admin-ad-tagline"
                name="ad_tagline"
                type="text"
                required
                value={formAdData.tagline}
                onChange={(e) => setFormAdData({ ...formAdData, tagline: e.target.value })}
                placeholder="எ.கா: அனைத்து டிஜிட்டல் பிரிண்டிங் & ஜெராக்ஸ் வசதி!"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
              />
            </div>

            {/* Offer */}
            <div>
              <label htmlFor="admin-ad-offer" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>5. சிறப்பு சலுகை (Offer Text)</label>
              <input
                id="admin-ad-offer"
                name="ad_offer"
                type="text"
                value={formAdData.offer}
                onChange={(e) => setFormAdData({ ...formAdData, offer: e.target.value })}
                placeholder="🎁 10% தள்ளுபடி!"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 800, color: '#b45309', background: '#fffbeb' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="admin-ad-phone" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>6. தொலைபேசி (Phone)</label>
              <input
                id="admin-ad-phone"
                name="ad_phone"
                type="text"
                value={formAdData.phone}
                onChange={(e) => setFormAdData({ ...formAdData, phone: e.target.value })}
                placeholder="9842198421"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: 700 }}
              />
            </div>

            {/* Address */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="admin-ad-address" style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>7. முழு முகவரி (Full Address)</label>
              <input
                id="admin-ad-address"
                name="ad_address"
                type="text"
                value={formAdData.address}
                onChange={(e) => setFormAdData({ ...formAdData, address: e.target.value })}
                placeholder="பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
              />
            </div>

            {/* Direct Image Upload or Current Image Preview */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'block' }}>
                8. விளம்பரப் படம் (Upload Banner Image or Use AI Studio):
              </label>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ background: '#eff6ff', border: '1.5px dashed #0052cc', padding: '10px 16px', borderRadius: '10px', color: '#0052cc', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={16} /> கணினியிலிருந்து படத்தை பதிவேற்றுக
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>

                {formAdData.image && (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={formAdData.image} alt="Banner Preview" style={{ height: '60px', borderRadius: '8px', border: '1.5px solid #0052cc', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setFormAdData({ ...formAdData, image: '' })}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: '11px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button
              type="submit"
              style={{ background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
            >
              <CheckCircle2 size={16} /> {editingAdId ? '💾 மாற்றங்களை சேமி (Save Changes)' : '🎉 விளம்பரத்தை வெளியிடு (Publish Ad)'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
            >
              ரத்து செய் (Cancel)
            </button>
          </div>
        </form>
      )}

      {/* ACTIVE SPONSORED ADS LIST */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
            📢 நேரலையில் இயங்கும் விளம்பரங்கள் (Active Ads: {ads.length})
          </h4>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            முகப்புப் பக்கத்தில் தானாக சுழலும் (Auto Carousel)
          </span>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          {ads.map((ad) => {
            const timeInfo = getAdRuntimeStatus(ad);
            return (
              <div
                key={ad.id}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                {/* Left: Thumbnail & Details */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                  {ad.image || ad.imageUrl ? (
                    <img
                      src={ad.image || ad.imageUrl}
                      alt={ad.title}
                      style={{ width: '100px', height: '64px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '100px', height: '64px', borderRadius: '10px', background: ad.gradient || '#022c7a', display: 'grid', placeItems: 'center', color: '#fbbf24', fontWeight: 900, fontSize: '11px', flexShrink: 0, padding: '4px', textAlign: 'center' }}>
                      ✨ {ad.badge || 'PROMO'}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ background: ad.badgeBg || '#fef3c7', color: ad.badgeColor || '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 900 }}>
                        {ad.badge || '⭐ GOLD SPONSOR'}
                      </span>

                      <span style={{ background: timeInfo.bg, color: timeInfo.color, padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {timeInfo.label}
                      </span>
                    </div>

                    <strong style={{ fontSize: '15px', color: '#022c7a', display: 'block' }}>{ad.title}</strong>
                    <small style={{ color: '#64748b', fontSize: '12px' }}>{ad.tagline}</small>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                      {ad.offer} • 📍 {ad.address} • 📞 {ad.phone}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleExtendAdTime(ad.id, 24)}
                    style={{ background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    title="Extend duration +24 hours"
                  >
                    <Zap size={12} /> +24h
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(ad)}
                    style={{ background: '#022c7a', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit3 size={12} /> எடிட்
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAd(ad.id)}
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={12} /> நீக்கு
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- ADVANCED AI BANNER STUDIO MODAL --- */}
      <AiBannerGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApplyToAd={handleApplyAiStudioBanner}
        notify={notify}
      />
    </div>
  );
}
