import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Wand2, Download, CheckCircle2, RefreshCw, X, UploadCloud, 
  Building2, Phone, MessageCircle, Mail, MapPin, Layers, Palette, 
  Maximize2, Eye, Sliders, Image as ImageIcon, Star, ShieldCheck, 
  Check, ArrowRight, Tag, FileText, Smartphone, Monitor, Layout, 
  Tv, ZoomIn, ZoomOut, AlertCircle, Share2, Camera
} from 'lucide-react';
import { validatePhotoUpload } from '../utils/documentHelper';

// Banner Sizes Preset Configuration
export const BANNER_SIZES = [
  { id: '800x500', name: '800 × 500', label: 'Standard Web (நிலையான வலை)', w: 800, h: 500, icon: Monitor, ratio: '16:10' },
  { id: '1024x512', name: '1024 × 512', label: 'Wide Promo (அகலமான விளம்பரம்)', w: 1024, h: 512, icon: Layout, ratio: '2:1' },
  { id: '1200x628', name: '1200 × 628', label: 'Facebook Post / Ad', w: 1200, h: 628, icon: Share2, ratio: '1.91:1' },
  { id: '1080x1080', name: '1080 × 1080', label: 'Instagram / Square (சதுரம்)', w: 1080, h: 1080, icon: Camera, ratio: '1:1' },
  { id: '1080x1920', name: '1080 × 1920', label: 'Story / Status (வாட்ஸ்அப் ஸ்டேட்டஸ்)', w: 1080, h: 1920, icon: Smartphone, ratio: '9:16' },
  { id: '1920x1080', name: '1920 × 1080', label: 'Full HD Landscape (முழு HD)', w: 1920, h: 1080, icon: Tv, ratio: '16:9' },
  { id: 'custom', name: 'Custom Size', label: 'விருப்ப அளவு (Custom Width × Height)', w: 800, h: 500, icon: Maximize2, ratio: 'Custom' }
];

// Curated Ready-Made Color Palettes
export const COLOR_PALETTES = [
  {
    id: 'govt_navy',
    name: '🏛️ Govt Trust Gold & Navy',
    desc: 'பாரம்பரிய அரசு இ-சேவை நம்பகத்தன்மை',
    primary: '#022c7a',
    secondary: '#1e1b4b',
    accent: '#fbbf24',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    textColor: '#ffffff'
  },
  {
    id: 'tamil_green',
    name: '🌿 Tamil Nadu Green & Saffron',
    desc: 'பசுமை மற்றும் வளர்ச்சி வண்ணங்கள்',
    primary: '#064e3b',
    secondary: '#022c22',
    accent: '#f97316',
    badgeBg: '#dcfce7',
    badgeText: '#15803d',
    textColor: '#ffffff'
  },
  {
    id: 'modern_cyan',
    name: '💎 Modern Cyan & Deep Blue',
    desc: 'நவீன டிஜிட்டல் தொழில்நுட்ப தோற்றம்',
    primary: '#0f172a',
    secondary: '#0369a1',
    accent: '#38bdf8',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    textColor: '#ffffff'
  },
  {
    id: 'festive_red',
    name: '🔥 High Impact Festive Red & Gold',
    desc: 'அதிரடி தள்ளுபடி மற்றும் விழா சலுகை',
    primary: '#7f1d1d',
    secondary: '#450a0a',
    accent: '#facc15',
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
    textColor: '#ffffff'
  },
  {
    id: 'royal_purple',
    name: '👑 Royal Purple & Pink Luxury',
    desc: 'பிரீமியம் வாடிக்கையாளர் ஈர்ப்பு',
    primary: '#3b0764',
    secondary: '#581c87',
    accent: '#f472b6',
    badgeBg: '#f3e8ff',
    badgeText: '#6b21a8',
    textColor: '#ffffff'
  },
  {
    id: 'cyber_stealth',
    name: '🖤 Cyber Dark & Neon Emerald',
    desc: 'டார்க் மோட் நியான் பளபளப்பு',
    primary: '#09090b',
    secondary: '#18181b',
    accent: '#22c55e',
    badgeBg: '#dcfce7',
    badgeText: '#166534',
    textColor: '#ffffff'
  },
  {
    id: 'sunset_orange',
    name: '🌅 Sunset Orange & Amber',
    desc: 'உற்சாகமான மற்றும் ஈர்க்கக்கூடிய தோற்றம்',
    primary: '#7c2d12',
    secondary: '#431407',
    accent: '#fbbf24',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    textColor: '#ffffff'
  }
];

// Banner Layout Templates
export const BANNER_TEMPLATES = [
  {
    id: 'classic_trust',
    name: '🏛️ Classic E-Sevai Trust',
    desc: 'அரசு முத்திரை, சர்வீஸ் கட்டங்கள் & அதிகாரப்பூர்வ பேட்ஜ்',
    badge: '⭐ OFFICIAL SERVICE HUB',
    icon: ShieldCheck
  },
  {
    id: 'modern_minimal',
    name: '✨ Modern Digital Showcase',
    desc: 'நவீன எழுத்துக்கள், க்ளீன் கார்டு மற்றும் வாட்ஸ்அப் பட்டன்',
    badge: '🚀 SMART DIGITAL SERVICES',
    icon: Wand2
  },
  {
    id: 'offer_blast',
    name: '🔥 Festive / Offer Blast',
    desc: 'அதிரடி தள்ளுபடி ரிப்பன், கோல்டன் ஸ்டார்கள் & ஹைலைட்',
    badge: '🎁 SPECIAL OFFER 2026',
    icon: Star
  },
  {
    id: 'tech_hub',
    name: '💻 Cyber Tech Hub',
    desc: 'கிளாஸ்மார்பிசம், நியான் பார்டர் & க்யூஆர் கோட் பிளேஸ்மென்ட்',
    badge: '⚡ FAST 10-MIN SERVICE',
    icon: Sparkles
  },
  {
    id: 'story_card',
    name: '📱 Social Story & Status Card',
    desc: 'வாட்ஸ்அப்/இன்ஸ்டாகிராம் ஸ்டோரிக்கு ஏற்ற வெர்டிகல் லேஅவுட்',
    badge: '📲 24/7 ONLINE ASSISTANCE',
    icon: Smartphone
  },
  {
    id: 'ai_auto',
    name: '🤖 AI Auto Smart Template',
    desc: 'அளவிற்கு ஏற்ப AI தானாக சிறந்த லேஅவுட்டை தேர்வு செய்யும்',
    badge: '✨ AI CURATED LAYOUT',
    icon: Sparkles
  }
];

// Pre-defined Popular E-Sevai Services for Quick Multi-Selection
export const QUICK_SERVICES_LIST = [
  { id: 'esevai', label: 'இ-சேவை சான்றிதழ்கள் (E-Sevai Certificates)', emoji: '🏛️' },
  { id: 'aadhaar', label: 'ஆதார் திருத்தம் (Aadhaar Update)', emoji: '📱' },
  { id: 'pan', label: 'பான் கார்டு (Instant PAN Card)', emoji: '💳' },
  { id: 'smartcard', label: 'குடும்ப அட்டை (Smart Ration Card)', emoji: '👨‍👩‍👧‍👦' },
  { id: 'patta', label: 'பட்டா / சிட்டா (Patta & Chitta)', emoji: '📜' },
  { id: 'passport', label: 'பாஸ்போர்ட் சேவை (Passport Apply)', emoji: '✈️' },
  { id: 'tneb', label: 'மின் கட்டணம் & பில் (TNEB Bill Pay)', emoji: '⚡' },
  { id: 'voter', label: 'வாக்காளர் அட்டை (Voter ID)', emoji: '🗳️' },
  { id: 'income', label: 'வருமானம் & சாதி சான்றிதழ்', emoji: '📋' },
  { id: 'tnpsc', label: 'TNPSC & அரசு தேர்வு விண்ணப்பம்', emoji: '📝' },
  { id: 'photo', label: 'பாஸ்போர்ட் சைஸ் போட்டோ & ஜெராக்ஸ்', emoji: '📸' }
];

// Preset Prompts for Instant Ingestion
const SAMPLE_AI_PROMPTS = [
  'AK E-Sevai Maiyam-க்கு புதிய வாடிக்கையாளர்களை கவரும் professional Tamil banner உருவாக்க வேண்டும். E-Sevai, PAN, Aadhaar, Certificate services போன்றவற்றை highlight செய்ய வேண்டும்.',
  'பழனியில் புதிதாக திறக்கப்பட்டுள்ள கம்ப்யூட்டர் சர்வீஸ் & டிஜிட்டல் பிரிண்டிங் மையத்திற்கு 20% சிறப்பு தள்ளுபடி விளம்பர பானர்',
  'அனைத்து அரசு சான்றிதழ்கள், பட்டா சிட்டா, ரேஷன் அட்டை திருத்தம் 10 நிமிடங்களில் செய்து தரப்படும் — நம்பகமான சேவை பேனர்',
  'ஸ்ரீ முருகன் மொபைல்ஸ் & லேப்டாப் சர்வீஸ் — வாடிக்கையாளர்களுக்கு சிறப்பு பரிசுகள் மற்றும் உடனடி சர்வீஸ் பேனர்',
  '24x7 சொகுசு கார் வாடகை மற்றும் பழனி முருகன் கோவில், கொடைக்கானல் சுற்றுலா டூர் பேக்கேஜ் விளம்பரம்'
];

/**
 * Robust Core Engine: Synthesizes high-resolution, vector-crisp HD Canvas images
 */
export async function renderHighDefBannerCanvas({
  companyName = 'AK E-SEVAI MAIYAM',
  address = 'பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601',
  phone = '9842198421',
  whatsapp = '9842198421',
  email = '',
  logoImage = '',
  mainHeading = 'அனைத்து அரசு இ-சேவை & டிஜிட்டல் சேவைகள்',
  description = 'சான்றிதழ்கள், ஆதார், பான் கார்டு, ஸ்மார்ட் கார்டு உடனடி சேவை!',
  specialOffer = '🎁 10 நிமிடங்களில் உடனடி சேவை! குறைந்த கட்டணம்!',
  services = [],
  width = 1200,
  height = 628,
  colorPalette = COLOR_PALETTES[0],
  template = 'classic_trust'
}) {
  const w = Math.max(300, Math.min(3840, Number(width) || 1200));
  const h = Math.max(200, Math.min(3840, Number(height) || 628));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const isVertical = h > w;
  const isSquare = Math.abs(w - h) < 50;

  // Determine effective template if AI Auto selected
  let effTemplate = template;
  if (effTemplate === 'ai_auto') {
    if (isVertical) effTemplate = 'story_card';
    else if (isSquare) effTemplate = 'modern_minimal';
    else effTemplate = 'classic_trust';
  }

  // 1. BACKGROUND GRADIENT & PATTERN
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, colorPalette.primary);
  bgGrad.addColorStop(0.5, colorPalette.secondary);
  bgGrad.addColorStop(1, '#050b14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Geometric Ambient Lighting Orbs
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.arc(w * 0.85, h * 0.15, Math.min(w, h) * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colorPalette.accent + '15'; // 8% opacity accent orb
  ctx.beginPath();
  ctx.arc(w * 0.1, h * 0.85, Math.min(w, h) * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Decorative Modern Grid Overlay
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = Math.max(40, Math.round(Math.min(w, h) * 0.08));
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. ORNATE INNER & OUTER BORDER FRAMES
  const framePadding = Math.max(14, Math.round(Math.min(w, h) * 0.025));

  // Outer Glowing Accent Frame
  ctx.save();
  ctx.strokeStyle = colorPalette.accent;
  ctx.lineWidth = Math.max(3, Math.round(Math.min(w, h) * 0.008));
  ctx.shadowColor = colorPalette.accent;
  ctx.shadowBlur = 10;
  ctx.strokeRect(framePadding, framePadding, w - framePadding * 2, h - framePadding * 2);
  ctx.restore();

  // Inner Subtle Border
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  const innerPad = framePadding + 6;
  ctx.strokeRect(innerPad, innerPad, w - innerPad * 2, h - innerPad * 2);
  ctx.restore();

  // 3. HEADER BADGE STRIP
  const badgeY = innerPad + Math.max(22, Math.round(h * 0.06));
  const badgeText = `✨ ${effTemplate === 'offer_blast' ? '🔥 அதிரடி சிறப்பு சலுகை • 2026' : '⭐ தமிழ்நாடு அரசு அங்கீகரிக்கப்பட்ட இ-சேவை மையம்'} ✨`;
  const badgeFontSize = Math.max(12, Math.round(Math.min(w, h) * 0.03));
  ctx.font = `bold ${badgeFontSize}px "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = colorPalette.accent;
  ctx.fillText(badgeText, w / 2, badgeY);

  // 4. LOGO EMBLEM (If provided or default seal)
  const logoSize = Math.max(60, Math.round(Math.min(w, h) * 0.16));
  const logoX = innerPad + 20;
  const logoY = badgeY - 10;

  if (logoImage && typeof logoImage === 'string') {
    try {
      const img = await new Promise((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => res(null);
        i.src = logoImage;
      });
      if (img) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = colorPalette.accent;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = colorPalette.accent;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      }
    } catch (e) {}
  } else {
    // Default Gold Emblem Icon
    ctx.save();
    ctx.fillStyle = colorPalette.accent + '22';
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colorPalette.accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = `${Math.round(logoSize * 0.55)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏛️', logoX + logoSize / 2, logoY + logoSize / 2);
    ctx.restore();
  }

  // 5. COMPANY / BUSINESS NAME (Huge & Bold with crisp shadow)
  let currentY = badgeY + Math.max(34, Math.round(h * 0.09));
  const compFontSize = Math.max(22, Math.round(Math.min(w, h) * 0.065));
  ctx.save();
  ctx.font = `900 ${compFontSize}px "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText(companyName || 'AK E-SEVAI MAIYAM', w / 2, currentY);
  ctx.restore();

  // 6. MAIN HEADING / ADVERTISEMENT TITLE
  if (mainHeading) {
    currentY += compFontSize * 1.05;
    const headFontSize = Math.max(16, Math.round(Math.min(w, h) * 0.045));
    ctx.save();
    ctx.font = `bold ${headFontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = colorPalette.accent;
    ctx.fillText(mainHeading, w / 2, currentY);
    ctx.restore();
  }

  // 7. SHORT DESCRIPTION / SLOGAN
  if (description) {
    currentY += Math.max(20, Math.round(h * 0.048));
    const descFontSize = Math.max(13, Math.round(Math.min(w, h) * 0.032));
    ctx.save();
    ctx.font = `600 ${descFontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(description, w / 2, currentY);
    ctx.restore();
  }

  // 8. SERVICES BADGES GRID (Highlights E-Sevai, Aadhaar, PAN, etc.)
  const activeServices = services && services.length > 0 ? services : QUICK_SERVICES_LIST.slice(0, 6).map(s => s.label);
  if (activeServices.length > 0 && h > 350) {
    currentY += Math.max(24, Math.round(h * 0.05));
    ctx.save();

    const maxBadges = isVertical ? 6 : (w > 900 ? 6 : 4);
    const displayServices = activeServices.slice(0, maxBadges);
    const cols = isVertical ? 1 : (displayServices.length > 3 ? 3 : 2);
    const cardW = (w * 0.86) / cols - 12;
    const cardH = Math.max(28, Math.round(h * 0.065));
    const startX = (w - (cardW * cols + (cols - 1) * 12)) / 2;

    displayServices.forEach((srv, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const bx = startX + col * (cardW + 12);
      const by = currentY + row * (cardH + 8);

      // Badge Card Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = colorPalette.accent + '66';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(bx, by, cardW, cardH, 8);
      ctx.fill();
      ctx.stroke();

      // Badge Text
      const badgeTextFont = Math.max(10, Math.round(cardH * 0.44));
      ctx.font = `bold ${badgeTextFont}px "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Trim text if too wide
      let cleanText = srv.replace(/\(.*\)/, '').trim();
      if (cleanText.length > 26) cleanText = cleanText.substring(0, 24) + '...';
      ctx.fillText(`✅ ${cleanText}`, bx + cardW / 2, by + cardH / 2);
    });

    const rowsCount = Math.ceil(displayServices.length / cols);
    currentY += rowsCount * (cardH + 8);
    ctx.restore();
  }

  // 9. SPECIAL OFFER RIBBON PILL
  if (specialOffer) {
    currentY += Math.max(22, Math.round(h * 0.055));
    ctx.save();
    const offerFontSize = Math.max(14, Math.round(Math.min(w, h) * 0.04));
    ctx.font = `900 ${offerFontSize}px "Segoe UI", Arial, sans-serif`;
    const offerText = specialOffer.toUpperCase();
    const offerMetrics = ctx.measureText(offerText);
    const pillWidth = Math.min(w * 0.88, offerMetrics.width + 44);
    const pillHeight = Math.max(34, Math.round(h * 0.08));
    const pillX = (w - pillWidth) / 2;
    const pillY = currentY - pillHeight / 2;

    // Glowing Offer Background Pill
    const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillWidth, pillY);
    pillGrad.addColorStop(0, colorPalette.accent);
    pillGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = pillGrad;
    ctx.shadowColor = colorPalette.accent;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
    ctx.fill();

    // Offer Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(offerText, w / 2, currentY);
    ctx.restore();
  }

  // 10. CONTACT FOOTER & ADDRESS BAR
  const footerH = Math.max(48, Math.round(h * 0.12));
  const footerY = h - framePadding - footerH;

  ctx.save();
  // Semi-transparent footer background
  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.strokeStyle = colorPalette.accent + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(innerPad, footerY, w - innerPad * 2, footerH, 10);
  ctx.fill();
  ctx.stroke();

  // Contact Strings
  const phoneStr = phone ? `📞 +91 ${phone}` : '';
  const waStr = whatsapp ? `💬 WhatsApp: +91 ${whatsapp}` : '';
  const addrStr = address ? `📍 ${address}` : '';
  const contactSummary = [phoneStr, waStr, addrStr].filter(Boolean).join('   |   ');

  const contactFontSize = Math.max(10, Math.round(footerH * 0.32));
  ctx.font = `bold ${contactFontSize}px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isVertical) {
    // 2-line footer on story/vertical
    ctx.fillText([phoneStr, waStr].filter(Boolean).join('   |   '), w / 2, footerY + footerH * 0.32);
    ctx.fillStyle = colorPalette.accent;
    ctx.fillText(addrStr, w / 2, footerY + footerH * 0.72);
  } else {
    ctx.fillText(contactSummary, w / 2, footerY + footerH / 2);
  }
  ctx.restore();

  // 11. SUBTLE OFFICIAL SEAL & WATERMARK
  ctx.save();
  ctx.font = `bold ${Math.max(9, Math.round(h * 0.022))}px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.textAlign = 'right';
  ctx.fillText('⚡ POWERED BY AKESEVAI AI STUDIO 2026', w - innerPad - 12, h - framePadding + 10);
  ctx.restore();

  return canvas.toDataURL('image/png', 0.95);
}

export default function AiBannerGeneratorModal({ isOpen, onClose, onApplyToAd, notify }) {
  // 1. Company Details State
  const [companyName, setCompanyName] = useState('AK E-SEVAI MAIYAM');
  const [address, setAddress] = useState('பழனி பஸ் ஸ்டாண்ட் எதிரில், மெயின் ரோடு, பழனி - 624601');
  const [phone, setPhone] = useState('9842198421');
  const [whatsapp, setWhatsapp] = useState('9842198421');
  const [email, setEmail] = useState('akesevai.palani@gmail.com');
  const [logoImage, setLogoImage] = useState('');

  // 2. Banner Content & AI Prompt State
  const [mainHeading, setMainHeading] = useState('அனைத்து அரசு இ-சேவை & டிஜிட்டல் சேவைகள்');
  const [description, setDescription] = useState('சான்றிதழ்கள், ஆதார் திருத்தம், பான் கார்டு, ஸ்மார்ட் கார்டு உடனடி சேவை!');
  const [specialOffer, setSpecialOffer] = useState('🎁 10 நிமிடங்களில் உடனடி சேவை! குறைந்த கட்டணம்!');
  const [aiPrompt, setAiPrompt] = useState('AK ESevai Maiyam-க்கு புதிய வாடிக்கையாளர்களை கவரும் professional Tamil banner உருவாக்க வேண்டும். E-Sevai, PAN, Aadhaar, Certificate services போன்றவற்றை highlight செய்ய வேண்டும்.');
  const [selectedServices, setSelectedServices] = useState([
    'இ-சேவை சான்றிதழ்கள் (E-Sevai Certificates)',
    'ஆதார் திருத்தம் (Aadhaar Update)',
    'பான் கார்டு (Instant PAN Card)',
    'குடும்ப அட்டை (Smart Ration Card)'
  ]);

  // 3. Banner Size State
  const [selectedSizeId, setSelectedSizeId] = useState('1200x628');
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(500);

  // 4. Color / Design State (AI Auto vs Customer Choose)
  const [designMode, setDesignMode] = useState('auto'); // 'auto' | 'custom'
  const [selectedPaletteId, setSelectedPaletteId] = useState(COLOR_PALETTES[0].id);
  const [customPrimary, setCustomPrimary] = useState('#022c7a');
  const [customSecondary, setCustomSecondary] = useState('#1e1b4b');
  const [customAccent, setCustomAccent] = useState('#fbbf24');

  // 5. Template State
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic_trust');

  // 6. Preview & Generation State
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState(1); // 1: Company, 2: Content/Prompt, 3: Size, 4: Color, 5: Template
  const [zoomLevel, setZoomLevel] = useState(1);

  // Auto-render live preview whenever options change
  const triggerLiveRender = async () => {
    setIsGenerating(true);

    const sizeObj = BANNER_SIZES.find(s => s.id === selectedSizeId) || BANNER_SIZES[2];
    const width = selectedSizeId === 'custom' ? (Number(customW) || 800) : sizeObj.w;
    const height = selectedSizeId === 'custom' ? (Number(customH) || 500) : sizeObj.h;

    let effectivePalette = COLOR_PALETTES.find(p => p.id === selectedPaletteId) || COLOR_PALETTES[0];
    if (designMode === 'custom') {
      effectivePalette = {
        ...effectivePalette,
        primary: customPrimary,
        secondary: customSecondary,
        accent: customAccent
      };
    } else if (designMode === 'auto') {
      // AI automatically matches palette based on prompt keywords
      const pLower = aiPrompt.toLowerCase();
      if (pLower.includes('green') || pLower.includes('விவசாயம்') || pLower.includes('பசுமை')) {
        effectivePalette = COLOR_PALETTES[1]; // Green
      } else if (pLower.includes('red') || pLower.includes('ஆஃபர்') || pLower.includes('தள்ளுபடி') || pLower.includes('discount')) {
        effectivePalette = COLOR_PALETTES[3]; // Festive Red
      } else if (pLower.includes('dark') || pLower.includes('tech') || pLower.includes('மொபைல்') || pLower.includes('கம்ப்யூட்டர்')) {
        effectivePalette = COLOR_PALETTES[5]; // Cyber Dark
      } else {
        effectivePalette = COLOR_PALETTES[0]; // Govt Navy Gold
      }
    }

    const dataUrl = await renderHighDefBannerCanvas({
      companyName,
      address,
      phone,
      whatsapp,
      email,
      logoImage,
      mainHeading,
      description,
      specialOffer,
      services: selectedServices,
      width,
      height,
      colorPalette: effectivePalette,
      template: selectedTemplateId
    });

    setPreviewDataUrl(dataUrl);
    setIsGenerating(false);
  };

  // Initial render when modal opens
  useEffect(() => {
    if (isOpen) {
      triggerLiveRender();
    }
  }, [isOpen]);

  // AI Prompt Processor: Synthesizes intelligent headings, slogans, and offer pills from user prompt
  const handleProcessAiPrompt = () => {
    if (!aiPrompt.trim()) {
      if (notify) notify('⚠️ தயவுசெய்து AI Prompt கட்டத்தில் உங்கள் தேவையை உள்ளிடவும்!');
      return;
    }

    setIsGenerating(true);
    const p = aiPrompt.trim();
    const lower = p.toLowerCase();

    // 1. Heading Extraction / Synthesis
    let newHeading = 'அனைத்து அரசு இ-சேவை & டிஜிட்டல் சேவைகள்';
    if (lower.includes('xerox') || lower.includes('ஜெராக்ஸ்') || lower.includes('print') || lower.includes('பிரிண்டிங்')) {
      newHeading = 'டிஜிட்டல் கலர் பிரிண்டிங், ஜெராக்ஸ் & லேமினேஷன் மையம்';
    } else if (lower.includes('travel') || lower.includes('கார்') || lower.includes('டூர்')) {
      newHeading = '24x7 சொகுசு கார் வாடகை & டூர்ஸ் டிராவல்ஸ்';
    } else if (lower.includes('computer') || lower.includes('laptop') || lower.includes('லேப்டாப்')) {
      newHeading = 'கம்ப்யூட்டர் & லேப்டாப் சேல்ஸ், சர்வீஸ் மையம்';
    } else if (lower.includes('mobile') || lower.includes('மொபைல்')) {
      newHeading = 'மொபைல் சேல்ஸ், சர்வீஸ் & அனைத்து ரீசார்ஜ் வசதி';
    } else {
      const firstChunk = p.split(/[.\n,]/)[0].replace(/create|generate|banner|for|a|in|palani|உருவாக்கவும்|பானர்/gi, '').trim();
      if (firstChunk.length >= 5) {
        newHeading = `✨ ${firstChunk.slice(0, 55)}`;
      }
    }

    // 2. Slogan Synthesis
    let newDesc = 'சான்றிதழ்கள், ஆதார் திருத்தம், பான் கார்டு, ஸ்மார்ட் கார்டு உடனடி சேவை!';
    if (p.length > 20) {
      newDesc = p.length > 70 ? p.slice(0, 68) + '...' : p;
    }

    // 3. Special Offer Synthesis
    let newOffer = '🎁 10 நிமிடங்களில் உடனடி சேவை! குறைந்த கட்டணம்!';
    const pctMatch = p.match(/(\d+%\s*(off|ஆஃபர்|தள்ளுபடி|discount)?)/i);
    if (pctMatch) {
      newOffer = `🎁 சிறப்பு சலுகை ${pctMatch[1].toUpperCase()} தள்ளுபடி!`;
    } else if (lower.includes('free') || lower.includes('இலவசம்')) {
      newOffer = '🎁 இலவச ஆலோசனைகள் & அதிரடி பரிசுகள்!';
    }

    // 4. Update Services Checklist based on prompt keywords
    const detectedServices = [];
    QUICK_SERVICES_LIST.forEach(s => {
      if (lower.includes(s.id) || lower.includes(s.label.toLowerCase())) {
        detectedServices.push(s.label);
      }
    });
    if (detectedServices.length > 0) {
      setSelectedServices(detectedServices);
    }

    setMainHeading(newHeading);
    setDescription(newDesc);
    setSpecialOffer(newOffer);

    // Auto trigger banner re-render
    setTimeout(() => {
      triggerLiveRender();
      if (notify) notify('✨ AI Prompt மூலம் தலைப்பு, விவரங்கள் & வண்ணங்கள் புத்திசாலித்தனமாக உருவாக்கப்பட்டன!');
    }, 100);
  };

  // Logo Upload Handler
  const handleLogoFileChange = (e) => {
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
      setLogoImage(reader.result);
      if (notify) notify('🖼️ கடை லோகோ வெற்றிகரமாக பதிவேற்றப்பட்டது!');
      setTimeout(() => triggerLiveRender(), 100);
    };
    reader.readAsDataURL(file);
  };

  // Service Toggle Handler
  const toggleService = (srvLabel) => {
    setSelectedServices(prev => {
      const exists = prev.includes(srvLabel);
      if (exists) return prev.filter(s => s !== srvLabel);
      return [...prev, srvLabel];
    });
  };

  // Apply to Homepage Advertisement
  const handleApply = () => {
    if (!previewDataUrl) return;
    if (onApplyToAd) {
      onApplyToAd({
        title: `${companyName} - ${mainHeading}`,
        tagline: description,
        offer: specialOffer,
        address,
        phone,
        whatsapp,
        image: previewDataUrl,
        bannerSize: selectedSizeId,
        customWidth: customW,
        customHeight: customH
      });
    }
    if (notify) notify('🎉 AI Banner வெற்றிகரமாக முகப்புப் பக்க விளம்பரத்தில் சேர்க்கப்பட்டது!');
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="ai-banner-generator-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        className="ai-banner-generator-modal-container"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '1280px',
          width: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '2px solid #0052cc',
          overflow: 'hidden',
          animation: 'esevaiFadeIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #022c7a 0%, #1e1b4b 100%)',
          color: 'white',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #fbbf24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#0f172a',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
            }}>
              <Wand2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.3px' }}>
                  AI Professional Banner Studio 2026
                </h3>
                <span style={{ background: '#fbbf24', color: '#022c7a', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 900 }}>
                  HD PRO
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#cbd5e1' }}>
                நிறுவன விவரங்கள், AI ப்ராம்ப்ட், வண்ணங்கள் & டெம்ப்ளேட் கொண்டு நொடியில் விளம்பர பேனர் உருவாக்குங்கள்
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'white',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              transition: 'all 0.2s'
            }}
            title="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* WORKFLOW STEP TABS STRIP */}
        <div style={{
          display: 'flex',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '8px 16px',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {[
            { id: 1, label: '1. நிறுவன விவரம் (Company)', icon: Building2 },
            { id: 2, label: '2. விளம்பரம் & AI Prompt', icon: FileText },
            { id: 3, label: '3. பேனர் அளவு (Size)', icon: Maximize2 },
            { id: 4, label: '4. நிறங்கள் (Colors)', icon: Palette },
            { id: 5, label: '5. டெம்ப்ளேட் (Template)', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeStepTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStepTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: isActive ? '1.5px solid #0052cc' : '1px solid transparent',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#0052cc' : '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* MAIN STUDIO WORKSPACE (2 Columns: Left Controls + Right Live HD Preview) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 480px) 1fr',
          flex: 1,
          overflow: 'hidden'
        }}>
          
          {/* LEFT PANE: STEP CONTROLS (Scrollable) */}
          <div style={{
            padding: '20px',
            overflowY: 'auto',
            borderRight: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>

            {/* STEP 1: COMPANY DETAILS */}
            {activeStepTab === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '8px' }}>
                  <Building2 size={18} color="#0052cc" />
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>1. நிறுவன விவரங்கள் (Company Details)</strong>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    🏢 நிறுவன / கடை பெயர் (Business Name):
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. AK E-SEVAI MAIYAM"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    📍 முழு முகவரி (Full Address):
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      📞 தொலைபேசி (Phone):
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9842198421"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      💬 வாட்ஸ்அப் (WhatsApp):
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="9842198421"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    ✉️ மின்னஞ்சல் / Email (Optional):
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="akesevai.palani@gmail.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                {/* Logo Upload Section */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    🖼️ லோகோ பதிவேற்றம் / Logo Upload (Optional):
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{
                      flex: 1,
                      background: '#f8fafc',
                      border: '1.5px dashed #0052cc',
                      padding: '10px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0052cc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <UploadCloud size={16} /> Logo தேர்ந்தெடுக்கவும்
                      <input type="file" accept="image/*" onChange={handleLogoFileChange} style={{ display: 'none' }} />
                    </label>
                    {logoImage && (
                      <div style={{ position: 'relative' }}>
                        <img src={logoImage} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #0052cc' }} />
                        <button
                          type="button"
                          onClick={() => { setLogoImage(''); triggerLiveRender(); }}
                          style={{ position: 'absolute', top: -5, right: -5, background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: '10px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStepTab(2)}
                  style={{
                    marginTop: '8px',
                    background: '#0052cc',
                    color: 'white',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  அடுத்த படி: விளம்பரம் & AI Prompt <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: BANNER CONTENT & AI PROMPT */}
            {activeStepTab === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '8px' }}>
                  <Sparkles size={18} color="#7c3aed" />
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>2. விளம்பர உள்ளடக்கம் & AI Prompt</strong>
                </div>

                {/* AI Prompt Box with One-Click Smart Synthesis */}
                <div style={{ background: '#faf5ff', border: '1.5px solid #d8b4fe', borderRadius: '12px', padding: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 900, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Wand2 size={15} /> உங்கள் AI Prompt / தேவை (Prompt Requirement):
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="உதாரணம்: AK ESevai Maiyam-க்கு புதிய வாடிக்கையாளர்களை கவரும் professional Tamil banner உருவாக்க வேண்டும்..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #c084fc', fontSize: '12px', lineHeight: '1.4', resize: 'none' }}
                  />

                  {/* Preset Quick Prompts */}
                  <div style={{ marginTop: '8px' }}>
                    <small style={{ fontSize: '10px', fontWeight: 800, color: '#7e22ce', display: 'block', marginBottom: '4px' }}>
                      ⚡ மாதிரி ப்ராம்ப்ட்கள் (Click to apply):
                    </small>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {SAMPLE_AI_PROMPTS.slice(0, 3).map((promptSample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAiPrompt(promptSample)}
                          style={{ background: '#ffffff', border: '1px solid #d8b4fe', borderRadius: '6px', padding: '3px 8px', fontSize: '10px', color: '#6b21a8', cursor: 'pointer', textAlign: 'left' }}
                        >
                          📌 {promptSample.substring(0, 32)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessAiPrompt}
                    disabled={isGenerating}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #581c87 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                    }}
                  >
                    <Sparkles size={16} /> {isGenerating ? 'AI பகுப்பாய்வு செய்கிறது...' : '✨ AI மூலம் விவரங்களை உருவாக்கு (Process AI Prompt)'}
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    📢 முதன்மை தலைப்பு (Main Heading / என்ன விளம்பரம்):
                  </label>
                  <input
                    type="text"
                    value={mainHeading}
                    onChange={(e) => setMainHeading(e.target.value)}
                    placeholder="e.g. அனைத்து அரசு இ-சேவை & டிஜிட்டல் சேவைகள்"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    📝 சிறப்பம்சங்கள் / விளக்கம் (Short Description):
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. சான்றிதழ்கள், ஆதார், பான் கார்டு உடனடி சேவை!"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    🎁 சிறப்பு சலுகை / செய்தி (Special Offer Ribbon):
                  </label>
                  <input
                    type="text"
                    value={specialOffer}
                    onChange={(e) => setSpecialOffer(e.target.value)}
                    placeholder="e.g. 🎁 10 நிமிடங்களில் உடனடி சேவை! 10% தள்ளுபடி!"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 800, color: '#b45309', background: '#fffbeb' }}
                  />
                </div>

                {/* Multi-Select Services Badges */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    🛠️ ஹைலைட் செய்ய வேண்டிய சேவைகள் (Select Services to Highlight):
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxHeight: '160px', overflowY: 'auto', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                    {QUICK_SERVICES_LIST.map(srv => {
                      const isSelected = selectedServices.includes(srv.label);
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => toggleService(srv.label)}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            textAlign: 'left',
                            border: isSelected ? '1.5px solid #0052cc' : '1px solid #cbd5e1',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            color: isSelected ? '#0052cc' : '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>{srv.emoji}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{srv.label.split('(')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(1)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#475569', cursor: 'pointer' }}
                  >
                    முந்தையது
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(3)}
                    style={{ flex: 2, padding: '10px', borderRadius: '8px', background: '#0052cc', border: 'none', fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    அடுத்த படி: பேனர் அளவு <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: BANNER SIZE */}
            {activeStepTab === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '8px' }}>
                  <Maximize2 size={18} color="#0284c7" />
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>3. பேனர் அளவு தேர்வு (Banner Size)</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {BANNER_SIZES.map(size => {
                    const isSelected = selectedSizeId === size.id;
                    const Icon = size.icon;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSizeId(size.id)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #0052cc' : '1.5px solid #cbd5e1',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: isSelected ? '#0052cc' : '#f1f5f9',
                            color: isSelected ? 'white' : '#64748b',
                            display: 'grid',
                            placeItems: 'center'
                          }}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <strong style={{ fontSize: '13px', color: isSelected ? '#0052cc' : '#0f172a', display: 'block' }}>
                              {size.name}
                            </strong>
                            <small style={{ fontSize: '11px', color: '#64748b' }}>{size.label}</small>
                          </div>
                        </div>

                        <span style={{
                          background: isSelected ? '#0052cc' : '#f1f5f9',
                          color: isSelected ? 'white' : '#64748b',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 800
                        }}>
                          {size.ratio}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Dimensions Input (If Custom Size is selected) */}
                {selectedSizeId === 'custom' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1.5px solid #0052cc' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#0052cc', display: 'block', marginBottom: '4px' }}>
                        அகலம் / Width (px):
                      </label>
                      <input
                        type="number"
                        value={customW}
                        onChange={(e) => setCustomW(e.target.value)}
                        placeholder="800"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#0052cc', display: 'block', marginBottom: '4px' }}>
                        உயரம் / Height (px):
                      </label>
                      <input
                        type="number"
                        value={customH}
                        onChange={(e) => setCustomH(e.target.value)}
                        placeholder="500"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(2)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#475569', cursor: 'pointer' }}
                  >
                    முந்தையது
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(4)}
                    style={{ flex: 2, padding: '10px', borderRadius: '8px', background: '#0052cc', border: 'none', fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    அடுத்த படி: வண்ணங்கள் <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: COLOR / DESIGN */}
            {activeStepTab === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '8px' }}>
                  <Palette size={18} color="#d97706" />
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>4. வண்ணங்கள் & வடிவமைப்பு (Color & Design)</strong>
                </div>

                {/* Mode Selector: AI Auto vs Customer Choose */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setDesignMode('auto')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: designMode === 'auto' ? '#0052cc' : 'transparent',
                      color: designMode === 'auto' ? 'white' : '#475569'
                    }}
                  >
                    🤖 AI Auto Design
                  </button>
                  <button
                    type="button"
                    onClick={() => setDesignMode('custom')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: designMode === 'custom' ? '#0052cc' : 'transparent',
                      color: designMode === 'custom' ? 'white' : '#475569'
                    }}
                  >
                    🎨 Customer Choose
                  </button>
                </div>

                {designMode === 'auto' ? (
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#166534' }}>
                    <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <CheckCircle2 size={16} /> AI தானியங்கி வண்ண தேர்வு இயக்கத்தில் உள்ளது
                    </div>
                    உங்கள் நிறுவனத்தின் வகை, சேவை மற்றும் AI ப்ராம்ப்ட் அடிப்படையில் பொருத்தமான Gradient, Font Color மற்றும் Badge Glow தானாகவே தேர்வு செய்யப்படும்.
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>
                      வடிவமைக்கப்பட்ட வண்ண தட்டுகள் (Curated Palettes):
                    </label>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {COLOR_PALETTES.map(pal => {
                        const isSelected = selectedPaletteId === pal.id;
                        return (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => {
                              setSelectedPaletteId(pal.id);
                              setCustomPrimary(pal.primary);
                              setCustomSecondary(pal.secondary);
                              setCustomAccent(pal.accent);
                            }}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid #0052cc' : '1px solid #cbd5e1',
                              background: isSelected ? '#eff6ff' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>{pal.name}</strong>
                              <small style={{ fontSize: '10px', color: '#64748b' }}>{pal.desc}</small>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: pal.primary, border: '1px solid #ffffff' }} />
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: pal.secondary, border: '1px solid #ffffff' }} />
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: pal.accent, border: '1px solid #ffffff' }} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(3)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#475569', cursor: 'pointer' }}
                  >
                    முந்தையது
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(5)}
                    style={{ flex: 2, padding: '10px', borderRadius: '8px', background: '#0052cc', border: 'none', fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    அடுத்த படி: டெம்ப்ளேட் <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: TEMPLATE SELECTION */}
            {activeStepTab === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '8px' }}>
                  <Layers size={18} color="#16a34a" />
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>5. டெம்ப்ளேட் தேர்வு (Template Layout)</strong>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  {BANNER_TEMPLATES.map(tpl => {
                    const isSelected = selectedTemplateId === tpl.id;
                    const Icon = tpl.icon;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #16a34a' : '1px solid #cbd5e1',
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: isSelected ? '#16a34a' : '#f1f5f9',
                          color: isSelected ? 'white' : '#475569',
                          display: 'grid',
                          placeItems: 'center'
                        }}>
                          <Icon size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '12.5px', color: isSelected ? '#16a34a' : '#0f172a' }}>{tpl.name}</strong>
                            <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b' }}>{tpl.badge}</span>
                          </div>
                          <small style={{ fontSize: '10.5px', color: '#64748b' }}>{tpl.desc}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveStepTab(4)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f1f5f9', border: 'none', fontWeight: 800, color: '#475569', cursor: 'pointer' }}
                  >
                    முந்தையது
                  </button>
                  <button
                    type="button"
                    onClick={triggerLiveRender}
                    style={{ flex: 2, padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)', border: 'none', fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={16} /> பேனரை புதுப்பி (Refresh Preview)
                  </button>
                </div>
              </div>
            )}

            {/* MASTER GENERATE BUTTON */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1.5px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={triggerLiveRender}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0052cc 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(0, 82, 204, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Sparkles size={20} /> {isGenerating ? '🎨 HD பேனர் உருவாக்கப்படுகிறது...' : '✨ AI Banner உருவாக்கு (Generate AI Banner)'}
              </button>
            </div>

          </div>

          {/* RIGHT PANE: LIVE HD PREVIEW & ACTIONS */}
          <div style={{
            padding: '24px',
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            overflowY: 'auto'
          }}>
            
            {/* Preview Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#1e293b', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={13} /> நேரலை முன்னோட்டம் (Live HD Preview)
                </span>
                <span style={{ background: '#334155', color: '#f8fafc', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700 }}>
                  {BANNER_SIZES.find(s => s.id === selectedSizeId)?.name || 'Custom'}
                </span>
              </div>

              {/* Zoom Controls */}
              <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                  style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', display: 'grid', placeItems: 'center' }}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '10px', color: '#94a3b8', padding: '4px', fontWeight: 800 }}>{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                  style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px 6px', display: 'grid', placeItems: 'center' }}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW CANVAS DISPLAY */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '320px',
              maxHeight: '520px',
              padding: '12px',
              background: '#020617',
              borderRadius: '16px',
              border: '1px solid #1e293b',
              overflow: 'hidden'
            }}>
              {previewDataUrl ? (
                <div style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={previewDataUrl}
                    alt="AI Generated Banner Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '460px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Wand2 size={32} color="#3b82f6" />
                  <span>விவரங்களை உள்ளிட்டு "✨ AI Banner உருவாக்கு" அழுத்தவும்</span>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS (Apply, Download, Regenerate) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={handleApply}
                disabled={!previewDataUrl}
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: previewDataUrl ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                }}
              >
                <CheckCircle2 size={17} /> விளம்பரத்தில் பயன்படுத்து (Apply to Ads)
              </button>

              <a
                href={previewDataUrl || '#'}
                download={`akesevai_banner_${selectedSizeId}_${Date.now()}.png`}
                style={{
                  background: '#0052cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  pointerEvents: previewDataUrl ? 'auto' : 'none',
                  opacity: previewDataUrl ? 1 : 0.5
                }}
              >
                <Download size={16} /> HD பதிவிறக்கு
              </a>

              <button
                type="button"
                onClick={triggerLiveRender}
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={15} /> Regenerate
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
