import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit3, CheckCircle2, Phone, MessageCircle, Sparkles, RefreshCw, ImagePlus, SlidersHorizontal, X, UploadCloud } from 'lucide-react';
import { deleteSponsoredAdCloud } from '../utils/firebaseService';

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
    gradient: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)'
  }
];

export default function AdminSponsoredAdsManager({ notify }) {
  const [ads, setAds] = useState(() => {
    try {
      const stored = localStorage.getItem('akesevai-sponsored-ads');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_ADS;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formAdData, setFormAdData] = useState({
    badge: '⭐ GOLD SPONSOR',
    title: '',
    tagline: '',
    offer: '🎁 AkEsevai வாடிக்கையாளர்களுக்கு சிறப்பு ஆஃபர்!',
    address: 'பழனி, திண்டுக்கல் மாவட்டம்',
    phone: '9342318844',
    whatsapp: '919342318844',
    image: '',
    bannerSize: 'medium' // 'large' (400px), 'medium' (300px), 'compact' (220px)
  });

  // Save to local storage & central server
  const saveAdsToStorage = (updatedList) => {
    setAds(updatedList);
    localStorage.setItem('akesevai-sponsored-ads', JSON.stringify(updatedList));

    try {
      fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sponsoredAds', data: updatedList })
      }).catch(() => {});
    } catch (e) {}

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
      bannerSize: 'medium'
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
      bannerSize: ad.bannerSize || 'medium'
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

  // Save Ad (Create or Edit Update)
  const handleSaveAd = (e) => {
    e.preventDefault();
    if (!formAdData.title.trim() || !formAdData.tagline.trim()) {
      if (notify) notify('⚠️ தயவுசெய்து விளம்பரத் தலைப்பு மற்றும் விவரங்களை உள்ளிடவும்!');
      return;
    }

    const badgeBg = formAdData.badge.includes('GOLD') ? '#fef3c7' : formAdData.badge.includes('PREMIUM') ? '#dcfce7' : '#eff6ff';
    const badgeColor = formAdData.badge.includes('GOLD') ? '#b45309' : formAdData.badge.includes('PREMIUM') ? '#15803d' : '#1d4ed8';

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
            bannerSize: formAdData.bannerSize
          };
        }
        return item;
      });
      saveAdsToStorage(updated);
      if (notify) notify('✏️ விளம்பரம் வெற்றிகரமாக மாற்றப்பட்டது (Updated)!');
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
    if (notify) notify('🗑️ விளம்பரம் Firebase பின்தளத்திலிருந்து நீக்கப்பட்டது.');
  };

  const handleResetDefaults = () => {
    saveAdsToStorage(DEFAULT_ADS);
    if (notify) notify('🔄 இயல்புநிலை விளம்பரங்கள் புதுப்பிக்கப்பட்டன.');
  };

  return (
    <div className="admin-ad-manager-card" style={{ borderRadius: '20px', padding: '24px', border: '2px solid #022c7a', boxShadow: '0 10px 30px rgba(2,44,122,0.1)', margin: '24px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '2px solid var(--line)' }}>
        <div>
          <span style={{ background: '#022c7a', color: '#fbbf24', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={14} /> AD MANAGER • விளம்பர கட்டுப்பாட்டு மையம்
          </span>
          <h3 className="ad-manager-title" style={{ fontSize: '20px', fontWeight: 900, margin: '6px 0 0' }}>
            Home Page <span>சிறப்பு விளம்பர எடிட்டர் (Sponsor Ads Edit & Image Manager)</span>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
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

            {/* Banner Size Alter */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>2. விளம்பர அளவு / சைஸ் (Banner Size Alter)</div>
              <select
                value={formAdData.bannerSize}
                onChange={(e) => setFormAdData({ ...formAdData, bannerSize: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white' }}
              >
                <option value="large">🖼️ பெரிய விளம்பரம் (Full Height Banner)</option>
                <option value="medium">📐 நடுத்தர விளம்பரம் (Medium Standard)</option>
                <option value="compact">📱 சிறிய விளம்பரம் (Compact Card)</option>
              </select>
            </div>

            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>3. விளம்பரத் தலைப்பு & கடை பெயர் (Business Title) *</div>
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>4. விளம்பர விளக்கம் / சலுகைகள் (Tagline) *</div>
              <input
                type="text"
                required
                value={formAdData.tagline}
                onChange={(e) => setFormAdData({ ...formAdData, tagline: e.target.value })}
                placeholder="எ.கா: அனைத்து டிஜிட்டல் பிரிண்டிங், பிளக்ஸ் & விசிட்டிங் கார்டு 10% தள்ளுபடி!"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* IMAGE UPLOADER (MUST HAVE REQUIREMENT) */}
            <div style={{ gridColumn: '1 / -1', background: 'white', border: '2px dashed #022c7a', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#022c7a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ImagePlus size={18} color="#16a34a" /> 5. விளம்பரப் படம் சேர்க்க (Add Custom Ad Photo / Banner)
              </div>

              {formAdData.image ? (
                <div style={{ position: 'relative', display: 'inline-block', margin: '8px 0' }}>
                  <img
                    src={formAdData.image}
                    alt="Ad Preview"
                    style={{ maxHeight: '140px', borderRadius: '10px', border: '2px solid #16a34a', display: 'block' }}
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
                  உங்கள் கடை, போஸ்டர் அல்லது விளம்பரப் புகைப்படத்தை கணினியிலிருந்து பதிவேற்றலாம்:
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>6. சிறப்பு ஆஃபர் (Special Offer Badge)</div>
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>7. முகவரி (Location)</div>
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>8. போன் எண் (Phone Number)</div>
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>9. வாட்ஸ்அப் எண் (WhatsApp No)</div>
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

      {/* ACTIVE ADS LIST WITH EDIT BUTTONS */}
      <div>
        <h4 style={{ color: '#475569', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
          தற்போது Home Page-ல் நேரலையில் உள்ள விளம்பரங்கள் ({ads.length}):
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {ads.map((ad) => (
            <div key={ad.id} style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {/* Photo Thumbnail if uploaded */}
              {ad.image && (
                <img
                  src={ad.image}
                  alt={ad.title}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
              )}

              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ background: ad.badgeBg || '#fef3c7', color: ad.badgeColor || '#b45309', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 }}>
                    {ad.badge}
                  </span>
                  <span style={{ background: '#e2e8f0', color: '#475569', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>
                    Size: {ad.bannerSize || 'medium'}
                  </span>
                  <strong style={{ fontSize: '16px', color: '#022c7a', fontWeight: 900 }}>{ad.title}</strong>
                </div>

                <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600, marginBottom: '4px' }}>{ad.tagline}</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800 }}>
                  {ad.offer} • 📍 {ad.address} • 📞 {ad.phone}
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div style={{ display: 'flex', gap: '8px' }}>
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
                  <Trash2 size={14} /> நீக்கு (Delete)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
