import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, Plus, Trash2, Edit3, CheckCircle2, Phone, MessageCircle, 
  Sparkles, RefreshCw, ImagePlus, SlidersHorizontal, X, UploadCloud, 
  Clock, Timer, Zap, Download, Wand2, Layers, Maximize2, Eye, ShieldCheck, Settings, Bot, Lightbulb 
} from 'lucide-react';
import { subscribeSponsoredAds, saveSponsoredAdCloud, deleteSponsoredAdCloud } from '../utils/dataService';
import { validatePhotoUpload } from '../utils/documentHelper';

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

// Helper NLP parser to convert ChatGPT-style text prompts into banner metadata
export const parsePromptToAdContent = (promptText) => {
  if (!promptText || !promptText.trim()) return null;
  const p = promptText.trim();
  const lower = p.toLowerCase();

  // 1. Theme Detection
  let theme = 'modern';
  if (lower.includes('temple') || lower.includes('gold') || lower.includes('crimson') || lower.includes('பாரம்பரியம்') || lower.includes('கோவில்')) {
    theme = 'traditional';
  } else if (lower.includes('cyber') || lower.includes('neon') || lower.includes('mobile') || lower.includes('tech') || lower.includes('டிஜிட்டல்')) {
    theme = 'neon';
  } else if (lower.includes('luxury') || lower.includes('car') || lower.includes('travels') || lower.includes('emerald') || lower.includes('கார்')) {
    theme = 'luxury';
  } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('hotel') || lower.includes('உணவகம்') || lower.includes('ஸ்வீட்ஸ்')) {
    theme = 'sunset';
  } else if (lower.includes('festive') || lower.includes('diwali') || lower.includes('pongal') || lower.includes('சலுகை')) {
    theme = 'festive';
  } else if (lower.includes('black') || lower.includes('stealth')) {
    theme = 'stealth';
  }

  // 2. Offer Extraction (e.g. 20%, 10%, free, ஆஃபர்)
  let offer = '🎁 AkEsevai வாடிக்கையாளர்களுக்கு 15% தள்ளுபடி!';
  const pctMatch = p.match(/(\d+%\s*(off|ஆஃபர்|தள்ளுபடி|discount)?)/i);
  if (pctMatch) {
    offer = `🎁 ${pctMatch[1].toUpperCase()} (Special Offer)`;
  } else if (lower.includes('free') || lower.includes('இலவசம்')) {
    offer = '🎁 இலவச பரிசுகள் & சிறப்பு சலுகைகள்!';
  }

  // 3. Title Extraction
  let title = '🏛️ AkEsevai ஸ்பெஷல் பார்ட்னர் (Special Partner Banner)';
  if (lower.includes('computer') || lower.includes('கம்ப்யூட்டர்') || lower.includes('laptop') || lower.includes('லேப்டாப்')) {
    title = '💻 ஸ்ரீ பாலாஜி கம்ப்யூட்டர்ஸ் & லேப்டாப் சர்வீஸ் (Balaji Computers)';
  } else if (lower.includes('print') || lower.includes('xerox') || lower.includes('பிரிண்டிங்') || lower.includes('ஜெராக்ஸ்')) {
    title = '🏛️ ஸ்ரீ பாலமுருகன் பிரிண்டிங் & கலர் ஜெராக்ஸ் (Balamurugan Prints)';
  } else if (lower.includes('travel') || lower.includes('cab') || lower.includes('ட்ராவல்ஸ்') || lower.includes('கார்')) {
    title = '🚗 ஸ்ரீ விநாயகர் 24x7 ட்ராவல்ஸ் & கார் வாடகை (Vinayagar Travels)';
  } else if (lower.includes('food') || lower.includes('hotel') || lower.includes('உணவகம்') || lower.includes('ஹோட்டல்')) {
    title = '🍽️ அன்னபூர்ணா ஸ்ரீ ஹரி பவன் உயர்தர உணவகம் (Hari Bhavan)';
  } else if (lower.includes('mobile') || lower.includes('மொபைல்')) {
    title = '📱 ஸ்ரீ முருகன் மொபைல்ஸ் & கேஜெட்ஸ் (Murugan Mobiles)';
  } else {
    const firstLine = p.split('\n')[0].replace(/create|generate|banner|for|a|in|palani|உருவாக்கவும்|பானர்/gi, '').trim();
    if (firstLine.length >= 4) {
      title = `✨ ${firstLine.slice(0, 50)}`;
    }
  }

  // 4. Tagline Synthesis
  let tagline = p;
  if (p.length > 90) {
    tagline = p.slice(0, 85) + '...';
  } else if (p.length < 15) {
    tagline = `${p} — பழனியில் AkEsevai வாடிக்கையாளர்களுக்கு பிரத்யேக சலுகை!`;
  }

  return { title, tagline, offer, theme };
};

// Helper to synthesize custom-sized high quality advertisement banner images via Canvas
export const generateBannerImageFromData = async ({
  title = '',
  tagline = '',
  offer = '',
  address = '',
  phone = '',
  badge = '⭐ GOLD SPONSOR',
  bannerSize = 'medium',
  customW = 800,
  customH = 500,
  theme = 'modern',
  logoImage = ''
}) => {
  let w = 800;
  let h = 500;

  if (bannerSize === 'custom') {
    w = Math.max(200, Math.min(3000, Number(customW) || 800));
    h = Math.max(100, Math.min(3000, Number(customH) || 500));
  } else if (bannerSize === 'hero') { w = 1200; h = 400; }
  else if (bannerSize === 'wide') { w = 1200; h = 200; }
  else if (bannerSize === 'square') { w = 1080; h = 1080; }
  else if (bannerSize === 'story') { w = 1080; h = 1920; }
  else { w = 800; h = 500; } // medium

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  let grad;
  if (theme === 'traditional') {
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#780c0c');
    grad.addColorStop(0.5, '#b91c1c');
    grad.addColorStop(1, '#450a0a');
  } else if (theme === 'neon') {
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#581c87');
    grad.addColorStop(1, '#0e7490');
  } else if (theme === 'luxury') {
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#022c22');
    grad.addColorStop(1, '#14532d');
  } else if (theme === 'sunset') {
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#7c2d12');
    grad.addColorStop(0.5, '#c2410c');
    grad.addColorStop(1, '#431407');
  } else if (theme === 'festive') {
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#581c87');
    grad.addColorStop(0.5, '#831843');
    grad.addColorStop(1, '#312e81');
  } else if (theme === 'stealth') {
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#09090b');
    grad.addColorStop(0.5, '#18181b');
    grad.addColorStop(1, '#27272a');
  } else {
    // modern (default)
    grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#022c7a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#0f172a');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative Ambient Light Orbs
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.arc(w * 0.85, h * 0.2, Math.min(w, h) * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.arc(w * 0.15, h * 0.8, Math.min(w, h) * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Outer Border Frame
  const isGoldTheme = theme === 'luxury' || theme === 'traditional' || theme === 'sunset';
  const borderCol = isGoldTheme ? '#fbbf24' : theme === 'stealth' ? '#facc15' : '#38bdf8';
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = Math.max(4, Math.round(Math.min(w, h) * 0.015));
  ctx.strokeRect(12, 12, w - 24, h - 24);

  // Inner Accent Frame
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = Math.max(1.5, Math.round(Math.min(w, h) * 0.005));
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Draw Logo Image if provided
  if (logoImage && typeof logoImage === 'string') {
    try {
      const loadedImg = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = logoImage;
      });

      if (loadedImg) {
        const logoSize = Math.max(55, Math.round(Math.min(w, h) * 0.18));
        const logoX = 35;
        const logoY = 30;

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = borderCol;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(loadedImg, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      }
    } catch (e) {}
  }

  // 1. Top Badge / Header Kicker
  ctx.fillStyle = borderCol;
  const badgeStr = `✨ ${badge || 'OFFICIAL SPONSORED BANNER'} • AkEsevai 2026`;
  const fontSizeBadge = Math.max(12, Math.round(h * 0.04));
  ctx.font = `bold ${fontSizeBadge}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(badgeStr, w / 2, h * 0.16);

  // 2. Business Title (Wrapped)
  ctx.fillStyle = '#ffffff';
  const fontSizeTitle = Math.max(20, Math.round(h * 0.08));
  ctx.font = `900 ${fontSizeTitle}px Arial, sans-serif`;

  const words = (title || 'Business Banner Title').split(' ');
  let line = '';
  let y = h * 0.33;
  const maxWidth = w * 0.86;

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

  // 3. Tagline / Description
  if (tagline) {
    ctx.fillStyle = '#e2e8f0';
    const fontSizeTag = Math.max(13, Math.round(h * 0.045));
    ctx.font = `bold ${fontSizeTag}px Arial, sans-serif`;
    y += fontSizeTag * 1.8;
    ctx.fillText(tagline, w / 2, y);
  }

  // 4. Special Offer Pill
  if (offer) {
    y += h * 0.12;
    const offerText = offer.toUpperCase();
    const fontSizeOffer = Math.max(14, Math.round(h * 0.05));
    ctx.font = `bold ${fontSizeOffer}px Arial, sans-serif`;
    const textWidth = ctx.measureText(offerText).width;

    const pillW = textWidth + 36;
    const pillH = Math.max(32, Math.round(h * 0.085));
    const pillX = (w - pillW) / 2;
    const pillY = y - pillH * 0.65;

    ctx.fillStyle = borderCol;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();

    ctx.fillStyle = theme === 'stealth' ? '#000000' : '#022c7a';
    ctx.fillText(offerText, w / 2, pillY + pillH * 0.7);
  }

  // 5. Contact & Location Footer Pill
  const contactText = [phone ? `📞 +91 ${phone}` : '', address ? `📍 ${address}` : ''].filter(Boolean).join(' | ');
  if (contactText && h > 250) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `bold ${Math.max(11, Math.round(h * 0.035))}px Arial, sans-serif`;
    ctx.fillText(contactText, w / 2, h - 42);
  }

  // Watermark Footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `${Math.max(9, Math.round(h * 0.026))}px Arial, sans-serif`;
  ctx.fillText('POWERED BY AKESEVAI AI BANNER STUDIO', w / 2, h - 20);

  return canvas.toDataURL('image/jpeg', 0.92);
};

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
    logoImage: '',
    bannerSize: 'medium',
    customWidth: 800,
    customHeight: 500,
    formTheme: 'modern',
    runDurationHours: 24,
    startTime: new Date().toISOString()
  });

  // ChatGPT AI Prompt Generator State
  const [aiPromptText, setAiPromptText] = useState('');

  // AI Image Generator Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [aiTagline, setAiTagline] = useState('');
  const [aiOffer, setAiOffer] = useState('🎁 10% தள்ளுபடி (10% OFF)');
  const [aiTheme, setAiTheme] = useState('modern');
  const [aiBannerSize, setAiBannerSize] = useState('medium');
  const [aiCustomWidth, setAiCustomWidth] = useState(800);
  const [aiCustomHeight, setAiCustomHeight] = useState(500);
  const [generatedAiImage, setGeneratedAiImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
      address: 'பழனி, திண்டுக்கல் மாவட்டம்',
      phone: '9342318844',
      whatsapp: '919342318844',
      image: '',
      logoImage: '',
      bannerSize: 'medium',
      customWidth: 800,
      customHeight: 500,
      formTheme: 'modern',
      runDurationHours: 24,
      startTime: new Date().toISOString()
    });
    setAiPromptText('');
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
      logoImage: ad.logoImage || '',
      bannerSize: ad.bannerSize || 'medium',
      customWidth: ad.customWidth || 800,
      customHeight: ad.customHeight || 500,
      formTheme: ad.formTheme || 'modern',
      runDurationHours: ad.runDurationHours ?? 24,
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
    reader.onloadend = async () => {
      const logoData = reader.result;
      setFormAdData((prev) => ({ ...prev, logoImage: logoData }));
      if (notify) notify('🖼️ கடை லோகோ சேர்க்கப்பட்டது!');

      // Re-generate banner with newly uploaded logo
      if (formAdData.title) {
        const newImg = await generateBannerImageFromData({
          title: formAdData.title,
          tagline: formAdData.tagline,
          offer: formAdData.offer,
          address: formAdData.address,
          phone: formAdData.phone,
          badge: formAdData.badge,
          bannerSize: formAdData.bannerSize,
          customW: formAdData.customWidth,
          customH: formAdData.customHeight,
          theme: formAdData.formTheme,
          logoImage: logoData
        });
        setFormAdData((prev) => ({ ...prev, image: newImg }));
      }
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

  // ChatGPT-style Prompt Generator Action
  const handleGenerateViaAiPrompt = async (promptString = '') => {
    const targetPrompt = promptString || aiPromptText;
    if (!targetPrompt.trim()) {
      if (notify) notify('⚠️ தயவுசெய்து AI Prompt கட்டத்தில் விளம்பரக் குறிப்பை உள்ளிடவும்!');
      return;
    }

    setIsGenerating(true);
    const parsed = parsePromptToAdContent(targetPrompt);

    if (parsed) {
      const dataUrl = await generateBannerImageFromData({
        title: parsed.title,
        tagline: parsed.tagline,
        offer: parsed.offer,
        address: formAdData.address,
        phone: formAdData.phone,
        badge: formAdData.badge,
        bannerSize: formAdData.bannerSize,
        customW: formAdData.customWidth,
        customH: formAdData.customHeight,
        theme: parsed.theme,
        logoImage: formAdData.logoImage
      });

      setFormAdData((prev) => ({
        ...prev,
        title: parsed.title,
        tagline: parsed.tagline,
        offer: parsed.offer,
        formTheme: parsed.theme,
        image: dataUrl
      }));

      if (notify) notify('✨ ChatGPT AI Prompt மூலம் அழகிய விளம்பர படம் & விவரங்கள் நொடியில் உருவாக்கப்பட்டன!');
    }
    setIsGenerating(false);
  };

  // Instant AI Image Generation directly from Form Inputs
  const handleGenerateImageFromForm = async () => {
    if (!formAdData.title.trim()) {
      if (notify) notify('⚠️ தயவுசெய்து முதலில் கடை பெயர்/தலைப்பை உள்ளிடவும்!');
      return;
    }

    setIsGenerating(true);
    const dataUrl = await generateBannerImageFromData({
      title: formAdData.title,
      tagline: formAdData.tagline,
      offer: formAdData.offer,
      address: formAdData.address,
      phone: formAdData.phone,
      badge: formAdData.badge,
      bannerSize: formAdData.bannerSize,
      customW: formAdData.customWidth,
      customH: formAdData.customHeight,
      theme: formAdData.formTheme,
      logoImage: formAdData.logoImage
    });

    setFormAdData((prev) => ({ ...prev, image: dataUrl }));
    setIsGenerating(false);
    if (notify) notify('✨ படிவ விவரங்களிலிருந்து HD விளம்பரப் படம் நொடியில் உருவாக்கப்பட்டது!');
  };

  // Calculate End Time based on Duration
  const computeEndTime = (startIso, hours) => {
    if (!hours || Number(hours) === 0) return null; // Unlimited
    const startMs = new Date(startIso).getTime();
    const endMs = startMs + Number(hours) * 3600 * 1000;
    return new Date(endMs).toISOString();
  };

  // Save Ad (Create or Edit Update)
  const handleSaveAd = async (e) => {
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

    // Auto generate banner image if admin didn't upload or create one yet
    let finalImage = formAdData.image;
    if (!finalImage) {
      finalImage = await generateBannerImageFromData({
        title: formAdData.title,
        tagline: formAdData.tagline,
        offer: formAdData.offer,
        address: formAdData.address,
        phone: formAdData.phone,
        badge: formAdData.badge,
        bannerSize: formAdData.bannerSize,
        customW: formAdData.customWidth,
        customH: formAdData.customHeight,
        theme: formAdData.formTheme,
        logoImage: formAdData.logoImage
      });
    }

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
            image: finalImage,
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
        title: formAdData.title.trim(),
        tagline: formAdData.tagline.trim(),
        offer: formAdData.offer.trim(),
        address: formAdData.address.trim(),
        phone: formAdData.phone.trim(),
        whatsapp: formAdData.whatsapp.trim().startsWith('91') ? formAdData.whatsapp.trim() : `91${formAdData.whatsapp.trim()}`,
        image: finalImage,
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

  // Open AI Studio Modal
  const handleOpenAiModal = () => {
    setAiTitle(formAdData.title || 'ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ்');
    setAiTagline(formAdData.tagline || 'அனைத்து டிஜிட்டல் பிரிண்டிங் & லேமினேஷன்!');
    setAiOffer(formAdData.offer || '🎁 AkEsevai வாடிக்கையாளர்களுக்கு 10% தள்ளுபடி!');
    setAiBannerSize(formAdData.bannerSize || 'medium');
    setAiCustomWidth(formAdData.customWidth || 800);
    setAiCustomHeight(formAdData.customHeight || 500);
    setShowAiModal(true);
  };

  const generateAiBannerImageInModal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const imgData = generateBannerImageFromData({
        title: aiTitle,
        tagline: aiTagline,
        offer: aiOffer,
        address: formAdData.address,
        phone: formAdData.phone,
        badge: formAdData.badge,
        bannerSize: aiBannerSize,
        customW: aiCustomWidth,
        customH: aiCustomHeight,
        theme: aiTheme
      });
      setGeneratedAiImage(imgData);
      setIsGenerating(false);
    }, 300);
  };

  const handleApplyAiImageToAd = () => {
    if (!generatedAiImage) return;
    setFormAdData((prev) => ({
      ...prev,
      image: generatedAiImage,
      title: aiTitle || prev.title,
      tagline: aiTagline || prev.tagline,
      offer: aiOffer || prev.offer,
      bannerSize: aiBannerSize || prev.bannerSize,
      customWidth: aiCustomWidth || prev.customWidth,
      customHeight: aiCustomHeight || prev.customHeight,
      formTheme: aiTheme || prev.formTheme
    }));
    setShowAiModal(false);
    if (notify) notify('✨ AI மூலம் உருவாக்கப்பட்ட விளம்பர படம் படிவத்தில் சேர்க்கப்பட்டது!');
  };

  const samplePrompts = [
    'பழனியில் புதிதாக திறக்கப்பட்டுள்ள கம்ப்யூட்டர் சர்வீஸ் மையத்திற்கு 20% ஆஃபர் பானர்',
    'Grand Opening Mobile & Laptop Accessories Store in Palani with Special Gifts',
    'Palani Travels 24x7 Cab Service for Kodaikanal & Madurai with Lowest Fares',
    'Digital Printing, Color Xerox & Lamination Centre 10% Off Coupon Banner',
    'South Indian Hotel Special Family Dinner Combo Offer Banner'
  ];

  return (
    <div className="admin-ad-manager-card" style={{ borderRadius: '20px', padding: '24px', border: '2px solid #022c7a', boxShadow: '0 10px 30px rgba(2,44,122,0.1)', margin: '24px 0', background: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '2px solid #e2e8f0' }}>
        <div>
          <span style={{ background: '#022c7a', color: '#fbbf24', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={14} /> AD & BANNER STUDIO • 2026 விளம்பர கட்டுப்பாட்டு மையம்
          </span>
          <h3 className="ad-manager-title" style={{ fontSize: '20px', fontWeight: 900, margin: '6px 0 0', color: '#022c7a' }}>
            Home Page <span>விளம்பர நேரக் மேலாண்மை & ChatGPT AI இமேஜ் ஜெனரேட்டர்</span>
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleOpenAiModal}
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
          >
            <Wand2 size={16} /> ✨ AI Studio Modal
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

          {/* CHATGPT PROMPT GENERATOR BOX */}
          <div style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)', border: '2px solid #7c3aed', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#4338ca', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={18} color="#7c3aed" /> 🤖 ChatGPT-Style AI Prompt Banner Generator (இயற்கை மொழியில் விளம்பரம் கேட்கவும்)
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
              உங்களுக்குத் தேவையான விளம்பரத்தைப் பற்றி கீழே டைப் செய்து "AI Prompt மூலம் உருவாக்கு" பொத்தானைக் கிளிக் செய்யவும். AI தானே தலைப்பு, ஆஃபர் & பானர் படத்தை உருவாக்கும்:
            </p>

            <textarea
              rows={2}
              value={aiPromptText}
              onChange={(e) => setAiPromptText(e.target.value)}
              placeholder="எ.கா: பழனியில் புதிதாக திறக்கப்பட்டுள்ள கம்ப்யூட்டர் சர்வீஸ் மையத்திற்கு 20% சிறப்பு தள்ளுபடி விளம்பர பானர் உருவாக்கவும்..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #7c3aed', fontSize: '13px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
            />

            {/* Quick Sample Prompt Chips */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b21a8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Lightbulb size={12} /> மாதிரி Prompts:
              </span>
              {samplePrompts.map((pText, pIdx) => (
                <button
                  type="button"
                  key={pIdx}
                  onClick={() => {
                    setAiPromptText(pText);
                    handleGenerateViaAiPrompt(pText);
                  }}
                  style={{ background: 'white', color: '#581c87', border: '1px solid #c084fc', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  💡 {pText.slice(0, 32)}...
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleGenerateViaAiPrompt()}
              disabled={isGenerating}
              style={{ marginTop: '12px', background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
            >
              <Wand2 size={16} /> {isGenerating ? '🎨 AI பானர் உருவாக்கப்படுகிறது...' : '🚀 ChatGPT AI Prompt மூலம் படம் உருவாக்கவும்'}
            </button>
          </div>

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

            {/* Banner Size Selector */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                2. பானர் அளவு தேர்வு (Select Banner Size / Dimensions) *
              </div>
              <select
                value={formAdData.bannerSize}
                onChange={(e) => setFormAdData({ ...formAdData, bannerSize: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white' }}
              >
                <option value="hero">📐 1200 x 400 (Hero Wide Showcase Banner)</option>
                <option value="wide">📐 1200 x 200 (Leaderboard Bar Banner)</option>
                <option value="medium">📐 800 x 500 (Standard Box Banner)</option>
                <option value="square">📐 1080 x 1080 (Square Post Banner)</option>
                <option value="story">📐 1080 x 1920 (Mobile Story Portrait Banner)</option>
                <option value="custom">⚙️ Custom Pixels (சுயவிருப்ப அகலம் x உயரம்)</option>
              </select>
            </div>

            {/* Custom Pixel Dimensions Inputs */}
            {formAdData.bannerSize === 'custom' && (
              <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0052cc', marginBottom: '4px' }}>அகலம் / Width (px):</div>
                  <input
                    type="number"
                    value={formAdData.customWidth}
                    onChange={(e) => setFormAdData({ ...formAdData, customWidth: e.target.value })}
                    placeholder="e.g. 800"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0052cc', fontWeight: 700, background: 'white' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0052cc', marginBottom: '4px' }}>உயரம் / Height (px):</div>
                  <input
                    type="number"
                    value={formAdData.customHeight}
                    onChange={(e) => setFormAdData({ ...formAdData, customHeight: e.target.value })}
                    placeholder="e.g. 500"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0052cc', fontWeight: 700, background: 'white' }}
                  />
                </div>
              </div>
            )}

            {/* Running Time Setting */}
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

            {/* AI Design Theme Option Selection in Form */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>6. AI டிசைன் ஸ்டைல் (Image Design Theme)</div>
              <select
                value={formAdData.formTheme}
                onChange={(e) => setFormAdData({ ...formAdData, formTheme: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #7c3aed', fontWeight: 800, background: '#f3e8ff', color: '#581c87' }}
              >
                <option value="modern">🎨 Modern Tech (Navy Blue & Cyan Glow)</option>
                <option value="traditional">🏛️ Royal South Indian (Crimson & Gold Foil)</option>
                <option value="neon">⚡ Cyber Glow (Purple & Neon Cyan)</option>
                <option value="luxury">👑 Luxury Emerald (Emerald Green & Gold)</option>
                <option value="sunset">🌅 Sunset Gold (Amber & Warm Orange)</option>
                <option value="festive">🏮 Festival Special (Deep Maroon & Purple)</option>
                <option value="stealth">🖤 Matte Stealth (Dark Slate & Yellow)</option>
              </select>
            </div>

            {/* Offer */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>7. சிறப்பு ஆஃபர் (Special Offer Badge)</div>
              <input
                type="text"
                value={formAdData.offer}
                onChange={(e) => setFormAdData({ ...formAdData, offer: e.target.value })}
                placeholder="எ.கா: 🎁 10% தள்ளுபடி!"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontWeight: 700, background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {/* LOGO UPLOADER CONTROL */}
            <div style={{ gridColumn: '1 / -1', background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '14px', padding: '14px', marginBottom: '4px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#1e40af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImagePlus size={18} color="#1d4ed8" /> 🖼️ கடை லோகோ சேர்க்கவும் (Add Business Logo Image - Optional)
              </div>
              <p style={{ fontSize: '11.5px', color: '#1e3a8a', margin: '0 0 10px', fontWeight: 600 }}>
                உங்கள் கடையின் லோகோவை பதிவேற்றினால், AI உருவாக்கும் பானரில் இந்த லோகோ அழகாக சேர்க்கப்படும்.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <label style={{ background: '#022c7a', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 10px rgba(2,44,122,0.2)' }}>
                  <UploadCloud size={15} /> 🖼️ லோகோ படம் தேர்ந்தெடு (Upload Logo)
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>

                {formAdData.logoImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 10px', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                    <img src={formAdData.logoImage} alt="Logo Preview" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid #022c7a', objectFit: 'cover' }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d' }}>✓ Logo Added</span>
                    <button
                      type="button"
                      onClick={async () => {
                        setFormAdData((prev) => ({ ...prev, logoImage: '' }));
                        if (formAdData.title) {
                          const newImg = await generateBannerImageFromData({
                            title: formAdData.title,
                            tagline: formAdData.tagline,
                            offer: formAdData.offer,
                            address: formAdData.address,
                            phone: formAdData.phone,
                            badge: formAdData.badge,
                            bannerSize: formAdData.bannerSize,
                            customW: formAdData.customWidth,
                            customH: formAdData.customHeight,
                            theme: formAdData.formTheme,
                            logoImage: ''
                          });
                          setFormAdData((prev) => ({ ...prev, image: newImg }));
                        }
                      }}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px', padding: '4px 8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ✕ நீக்கு
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* IMAGE GENERATOR TOOL & PHOTO UPLOADER */}
            <div style={{ gridColumn: '1 / -1', background: 'white', border: '2px dashed #7c3aed', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#581c87', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Wand2 size={20} color="#7c3aed" /> 8. AI இமேஜ் ஜெனரேட்டர் டூல் (Image Design Tool):
              </div>

              {/* Instant Form Content Image Generator Button */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleGenerateImageFromForm}
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                >
                  <Wand2 size={16} /> ✨ மேலே உள்ள உள்ளீடுகளிலிருந்து AI விளம்பர படம் உருவாக்கு
                </button>

                <button
                  type="button"
                  onClick={handleOpenAiModal}
                  style={{ background: '#022c7a', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Settings size={15} /> ⚙️ AI Studio Modal Tool
                </button>
              </div>

              {formAdData.image ? (
                <div style={{ position: 'relative', display: 'inline-block', margin: '8px 0' }}>
                  <img
                    src={formAdData.image}
                    alt="Ad Preview"
                    style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '12px', border: '2px solid #16a34a', display: 'block', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormAdData({ ...formAdData, image: '' })}
                    style={{ position: 'absolute', top: -10, right: -10, background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontWeight: 900 }}
                    title="Remove Photo"
                  >
                    ✕
                  </button>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>
                    ✅ விளம்பரப் படம் தயார் நிலையில் உள்ளது (Image Ready)
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                  உங்கள் சொந்த புகைப்படத்தைப் பதிவேற்றலாம் அல்லது <strong>AI Image Tool</strong> மூலம் நொடியில் உருவாக்கலாம்:
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,.jpg,.jpeg"
                onChange={handleImageUpload}
                style={{ display: 'block', margin: '8px auto 0', fontSize: '12px', fontWeight: 700 }}
              />
            </div>

            {/* Address */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>9. முகவரி (Location)</div>
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>10. போன் எண் (Phone Number)</div>
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
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>11. வாட்ஸ்அப் எண் (WhatsApp No)</div>
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
                    style={{ width: 95, height: 65, objectFit: 'contain', background: '#0f172a', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                  />
                )}

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ background: ad.badgeBg || '#fef3c7', color: ad.badgeColor || '#b45309', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 }}>
                      {ad.badge}
                    </span>

                    {/* Banner Size Tag */}
                    <span style={{ background: '#e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>
                      📐 Size: {ad.bannerSize || 'medium'} {ad.bannerSize === 'custom' ? `(${ad.customWidth}x${ad.customHeight})` : ''}
                    </span>

                    {/* Runtime Status Tag */}
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

      {/* --- AI BANNER / IMAGE GENERATOR MODAL --- */}
      {showAiModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '26px', maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '2px solid #7c3aed', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '10px', background: '#f3e8ff', color: '#7c3aed', display: 'grid', placeItems: 'center' }}>
                  <Wand2 size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, font: '900 18px Manrope', color: '#1e1b4b' }}>✨ AI விளம்பர பானர் இமேஜ் ஜெனரேட்டர் (HD Image Tool)</h3>
                  <small style={{ color: '#64748b' }}>விருப்பமான எந்த அளவிலும் (Dimensions & Custom Pixels) உயர்தர விளம்பரப் படம் உருவாக்கலாம்.</small>
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
                  <option value="modern">🎨 Modern Tech (Navy Blue & Cyan Glow)</option>
                  <option value="traditional">🏛️ Royal South Indian (Crimson & Gold Foil)</option>
                  <option value="neon">⚡ Cyber Glow (Purple & Neon Cyan)</option>
                  <option value="luxury">👑 Luxury Emerald (Emerald Green & Gold)</option>
                  <option value="sunset">🌅 Sunset Gold (Amber & Warm Sunset)</option>
                  <option value="festive">🏮 Festival Special (Deep Maroon & Purple)</option>
                  <option value="stealth">🖤 Matte Stealth (Dark Slate & Yellow)</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  5. பானர் அளவு தேர்வு (Select Dimensions & Sizes)
                </label>
                <select
                  value={aiBannerSize}
                  onChange={(e) => setAiBannerSize(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #7c3aed', fontWeight: 800, background: '#f3e8ff', color: '#581c87' }}
                >
                  <option value="hero">📐 1200 x 400 (Hero Wide Showcase Banner)</option>
                  <option value="wide">📐 1200 x 200 (Leaderboard Slim Banner)</option>
                  <option value="medium">📐 800 x 500 (Standard Medium Box Banner)</option>
                  <option value="square">📐 1080 x 1080 (Square Social Post Banner)</option>
                  <option value="story">📐 1080 x 1920 (Full Mobile Story Banner)</option>
                  <option value="custom">⚙️ Custom Pixels (சுயவிருப்ப அகலம் x உயரம்)</option>
                </select>
              </div>

              {aiBannerSize === 'custom' && (
                <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', display: 'block', marginBottom: '2px' }}>
                      அகலம் / Width (px):
                    </label>
                    <input
                      type="number"
                      value={aiCustomWidth}
                      onChange={(e) => setAiCustomWidth(e.target.value)}
                      placeholder="e.g. 800"
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #7c3aed', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', display: 'block', marginBottom: '2px' }}>
                      உயரம் / Height (px):
                    </label>
                    <input
                      type="number"
                      value={aiCustomHeight}
                      onChange={(e) => setAiCustomHeight(e.target.value)}
                      placeholder="e.g. 500"
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #7c3aed', fontWeight: 700 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={generateAiBannerImageInModal}
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
