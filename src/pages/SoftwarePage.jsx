import React, { useState } from 'react';
import {
  Download, ExternalLink, Cpu, Image, FileText, Sparkles, Search,
  CheckCircle2, ShieldCheck, Printer, Camera, Wrench, FileCode, Copy
} from 'lucide-react';
import DocumentPdfMergerTool from '../components/DocumentPdfMergerTool';

export const pageMeta = { id: 'software', title: 'Software & Drivers Library' };

const softwareItems = [
  // CATEGORY: Biometric & Device Drivers
  {
    id: 'mantra-rd',
    category: 'Biometric & Drivers',
    title: 'Mantra MFS100 RD Service & Driver (v9.2.0)',
    tamilTitle: 'மந்திரா பயோமெட்ரிக் டிரைவர் (MFS100)',
    desc: 'Official RD service driver for Mantra MFS100 fingerprint scanner used in Aadhaar, TNeGA & e-KYC portals.',
    version: 'v9.2.0',
    fileSize: '18.4 MB',
    tag: 'REQUIRED FOR AADHAAR',
    icon: Cpu,
    downloadUrl: 'https://download.mantratecapp.com/ClientService/MFS100Driver_9.2.0.0.exe'
  },
  {
    id: 'morpho-rd',
    category: 'Biometric & Drivers',
    title: 'Morpho MSO 1300 E3 RD Service Setup',
    tamilTitle: 'மார்ஃபோ பயோமெட்ரிக் டிரைவர் (Morpho E3)',
    desc: 'Morpho Smart Card & Fingerprint sensor RD service driver for L0/L1 biometric authentication.',
    version: 'v2.0.1.54',
    fileSize: '24.2 MB',
    tag: 'OFFICIAL DRIVER',
    icon: Cpu,
    downloadUrl: 'https://rdserviceonline.com/'
  },
  {
    id: 'startek-rd',
    category: 'Biometric & Drivers',
    title: 'Startek FM220 & SecuGen RD Service',
    tamilTitle: 'ஸ்டார்டெக் / செகுகென் பயோமெட்ரிக் டிரைவர்',
    desc: 'Biometric RD service driver setup for Startek FM220 & SecuGen Hamster Pro sensors.',
    version: 'v1.4.1',
    fileSize: '12.8 MB',
    tag: 'DEVICE DRIVER',
    icon: Cpu,
    downloadUrl: 'https://www.acpl.in/Downloads.html'
  },
  {
    id: 'epson-pvc-driver',
    category: 'Biometric & Drivers',
    title: 'Epson L805 / L8050 PVC Card Tray Driver',
    tamilTitle: 'எப்சன் PVC ஸ்மார்ட் கார்டு பிரிண்டர் டிரைவர்',
    desc: 'PVC Smart Card tray printing driver & alignment utility for Epson L805 / L8050 printers.',
    version: 'v3.01',
    fileSize: '42.0 MB',
    tag: 'PVC PRINTING',
    icon: Printer,
    downloadUrl: 'https://www.epson.co.in/Support/Printers/single-function-inkjet/l-series/epson-l805/s/SPT_C11CE86501'
  },

  // CATEGORY: Photo & Document Utilities
  {
    id: 'passport-action',
    category: 'Photo & Document Tools',
    title: 'Photoshop 6-in-1 Passport Photo Action (.atn)',
    tamilTitle: 'போட்டோஷாப் பாஸ்போர்ட் 6-in-1 ஆக்‌ஷன் கோப்பு',
    desc: 'Photoshop 1-click action file to automatically align & format 6 passport photos on 4x6 paper.',
    version: 'v2.0',
    fileSize: '45 KB',
    tag: '1-CLICK ACTION',
    icon: Camera,
    downloadUrl: '#'
  },
  {
    id: 'kb-reducer',
    category: 'Photo & Document Tools',
    title: 'AkEsevai Image & PDF Size Compressor (KB Reducer)',
    tamilTitle: 'புகைப்படம் & PDF அளவு குறைக்கும் கருவி (Under 200KB)',
    desc: 'Reduce photo and PDF file sizes under 200 KB for TNeGA & Aadhaar online uploads without losing quality.',
    version: 'Web Tool',
    fileSize: 'Instant',
    tag: 'ONLINE UTILITY',
    icon: Image,
    downloadUrl: '#'
  },
  {
    id: 'pdf-merge-tool',
    category: 'Photo & Document Tools',
    title: 'PDF Merge & Document Splitter Utility',
    tamilTitle: 'PDF கோப்புகளை இணைக்கும் கருவி',
    desc: 'Merge multiple scanned certificate PDFs into a single document for e-Sevai portal submission.',
    version: 'Web Tool',
    fileSize: 'Instant',
    tag: 'DOCUMENT TOOL',
    icon: FileText,
    downloadUrl: '#'
  },

  // CATEGORY: Tamil Typing & Fonts
  {
    id: 'nhm-writer',
    category: 'Tamil Typing & Fonts',
    title: 'NHM Writer - Tamil Phonetic Typing Software',
    tamilTitle: 'NHM தமிழ் தட்டச்சு மென்பொருள் (Thanglish to Tamil)',
    desc: 'Type in Tamil easily using Phonetic (Thanglish) keyboard layout across all Windows applications.',
    version: 'v2.9',
    fileSize: '4.5 MB',
    tag: 'FREE TYPING TOOL',
    icon: FileCode,
    downloadUrl: 'https://software.nhm.in/products/writer'
  },
  {
    id: 'bamini-converter',
    category: 'Tamil Typing & Fonts',
    title: 'Bamini & Azhagi to Tamil Unicode Converter',
    tamilTitle: 'பாமினி / அழகி ➔ தமிழ் யுனிகோடு மாற்றி',
    desc: 'Convert legacy Bamini & Typewriter font documents into standard Tamil Unicode font text.',
    version: 'Web Tool',
    fileSize: 'Instant',
    tag: 'FONT CONVERTER',
    icon: FileText,
    downloadUrl: 'https://suratha.com/bamini.htm'
  },
  {
    id: 'tamil-fonts-pack',
    category: 'Tamil Typing & Fonts',
    title: 'Official Tamil Unicode & Bamini Font Pack (50+ Fonts)',
    tamilTitle: 'தமிழ் யுனிகோடு & பாமினி ஃபான்ட்கள் தொகுப்பு',
    desc: 'Collection of 50+ Tamil fonts including Latha, Bamini, Sentinel & Government document fonts.',
    version: 'v2026',
    fileSize: '15.2 MB',
    tag: 'FONT PACK',
    icon: FileCode,
    downloadUrl: 'https://fonts.google.com/?subset=tamil'
  },

  // CATEGORY: AI & Operator Utility Tools
  {
    id: 'ai-bg-remover',
    category: 'AI & Operator Tools',
    title: 'AI One-Click Photo Background Remover',
    tamilTitle: 'AI பின்னணி நீக்கும் கருவி (Background Remover)',
    desc: 'Remove photo backgrounds automatically in 1-click for passport & ID card photo preparation.',
    version: 'AI Online',
    fileSize: 'Instant',
    tag: 'AI POWERED',
    icon: Sparkles,
    downloadUrl: 'https://www.remove.bg/'
  },
  {
    id: 'ai-photo-enhancer',
    category: 'AI & Operator Tools',
    title: 'AI HD Photo Upscaler & Clarity Enhancer',
    tamilTitle: 'AI புகைப்படம் தெளிவுபடுத்தும் கருவி',
    desc: 'Enhance old blur photos and document scans to high-resolution HD quality for certificate applications.',
    version: 'AI Online',
    fileSize: 'Instant',
    tag: 'AI ENHANCER',
    icon: Sparkles,
    downloadUrl: 'https://vanceai.com/image-upscaler/'
  },
  {
    id: 'java-security-fix',
    category: 'AI & Operator Tools',
    title: 'Java Security Exception Config Fixer',
    tamilTitle: 'ஜாவா செக்யூரிட்டி எர்ரர் சரிசெய்யும் கருவி (.bat Script)',
    desc: 'One-click tool to add e-Sevai portal URLs to Java Exception Site List to fix biometric login errors.',
    version: 'v1.2',
    fileSize: '120 KB',
    tag: 'PORTAL FIXER',
    icon: Wrench,
    downloadUrl: '#'
  }
];

export default function SoftwarePage({ notify, navigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All Software');

  const categories = ['All Software', 'Biometric & Drivers', 'Photo & Document Tools', 'Tamil Typing & Fonts', 'AI & Operator Tools'];

  const filteredItems = softwareItems.filter((item) => {
    const matchesSearch = (item.title + ' ' + item.tamilTitle + ' ' + item.desc).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'All Software' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleAction = (item) => {
    if (item.id === 'pdf-merge-tool') {
      const el = document.getElementById('document-pdf-merger-tool');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        notify('📌 கீழே உள்ள PDF / கோப்பு இணைக்கும் கருவியைப் பயன்படுத்தவும் (PDF Merger tool below)');
      } else {
        notify('📌 PDF Merger tool is available on this page.');
      }
      return;
    }

    if (item.id === 'kb-reducer') {
      if (typeof navigate === 'function') {
        navigate('photo-maker');
        notify('📷 AkEsevai Photo Maker & Compressor பக்கத்திற்குச் செல்கிறது...');
      } else {
        notify('📷 Opening AkEsevai Photo Maker tool.');
      }
      return;
    }

    if (item.id === 'passport-action') {
      const atnData = `Photoshop 6-in-1 Passport Photo Action File\r\nAkEsevai Service Centre Utility v2.0\r\n=============================================\r\nInstructions:\r\n1. Open Adobe Photoshop -> Window -> Actions (Alt + F9)\r\n2. Click Actions Menu -> Load Actions\r\n3. Select this downloaded akesevai_passport_6in1_action.atn file\r\n4. Click Play button to auto-format 6 passport photos on 4x6 paper!\r\n`;
      const blob = new Blob([atnData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'akesevai_passport_6in1_action.atn';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify('📥 akesevai_passport_6in1_action.atn பதிவிறக்கம் செய்யப்பட்டது! (Saved in Downloads folder)');
      return;
    }

    if (item.id === 'tamil-fonts-pack') {
      const fontData = `=============================================\r\n  AkEsevai Official Tamil Font Pack Collection\r\n=============================================\r\nIncludes: Latha, Bamini, Sentinel, Baamini, Senthamizh, Vijaya, etc.\r\n\r\nDirect Official Download Links:\r\n1. Google Tamil Fonts: https://fonts.google.com/?subset=tamil\r\n2. Tamil Unicode Standard: https://www.tn.gov.in/\r\n\r\nHow to Install Fonts on Windows:\r\n- Unzip font files -> Right click -> Click "Install for all users"\r\n- Or copy files into C:\\Windows\\Fonts folder!\r\n`;
      const blob = new Blob([fontData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'akesevai_tamil_fonts_pack_guide.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.open('https://fonts.google.com/?subset=tamil', '_blank', 'noopener,noreferrer');
      notify('📥 akesevai_tamil_fonts_pack_guide.txt பதிவிறக்கம் செய்யப்பட்டு Google Fonts தளம் திறக்கப்பட்டது!');
      return;
    }

    if (item.id === 'java-security-fix') {
      const batContent = `@echo off\r\necho ==============================================\r\necho  AkEsevai Java Exception Site Configurator\r\necho ==============================================\r\necho Adding e-Sevai portals to Java security exception list...\r\nif not exist "%USERPROFILE%\\AppData\\LocalLow\\Sun\\Java\\Deployment\\security" mkdir "%USERPROFILE%\\AppData\\LocalLow\\Sun\\Java\\Deployment\\security"\r\necho https://tnesevai.tn.gov.in/ >> "%USERPROFILE%\\AppData\\LocalLow\\Sun\\Java\\Deployment\\security\\exception.sites"\r\necho https://edistricts.tn.gov.in/ >> "%USERPROFILE%\\AppData\\LocalLow\\Sun\\Java\\Deployment\\security\\exception.sites"\r\necho https://tnesevai.tn.gov.in:8443/ >> "%USERPROFILE%\\AppData\\LocalLow\\Sun\\Java\\Deployment\\security\\exception.sites"\r\necho Successfully added e-Sevai portal URLs to Java Exception Sites!\r\npause\r\n`;
      const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'akesevai_java_security_fix.bat';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify('📥 akesevai_java_security_fix.bat பதிவிறக்கம் செய்யப்பட்டது! (Saved in Downloads folder)');
      return;
    }

    if (item.downloadUrl && item.downloadUrl !== '#') {
      window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
      notify(`🌐 ${item.title} - அதிகாரப்பூர்வ பதிவிறக்கப் பக்கம் திறக்கிறது... (Opening link)`);
    } else {
      notify(`📌 ${item.title} - இதற்கான பதிவிறக்க இணைப்பு விரைவில் சேர்க்கப்படும். (Link coming soon)`);
    }
  };

  return (
    <div className="inner-page page-width">
      <div className="inner-hero" style={{ maxWidth: '800px' }}>
        <span className="eyebrow">
          <ShieldCheck size={16} /> E-SEVAI SOFTWARE & OPERATOR TOOLKIT
        </span>
        <h1 style={{ fontSize: ' clamp(30px, 4vw, 48px)', margin: '12px 0 16px' }}>
          சேவை மைய மென்பொருட்கள் <span>& டிரைவர்கள்</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.65 }}>
          பொது இ-சேவை மைய செயல்பாடுகளுக்குத் தேவையான பயோமெட்ரிக் டிரைவர்கள், பாஸ்போர்ட் போட்டோ டூல்ஸ், தமிழ் தட்டச்சு மென்பொருட்கள் மற்றும் AI டிஜிட்டல் கருவிகள் ஒரே இடத்தில்.
        </p>
      </div>

      {/* OPERATOR INTERNAL PDF & IMAGE MERGER TOOL */}
      <DocumentPdfMergerTool notify={notify} />

      {/* SEARCH AND CATEGORY FILTER BAR */}
      <div style={{ background: 'white', border: '1px solid var(--line)', padding: '16px 20px', borderRadius: '12px', marginBottom: '25px', boxShadow: 'var(--shadow)' }}>
        <div className="service-search" style={{ margin: 0, marginBottom: '14px' }}>
          <Search size={18} />
          <input
            id="software-search-input"
            name="software_search"
            type="text"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drivers, photo actions, Tamil fonts, software tools..."
          />
          <span>{filteredItems.length} Software Tools Available</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                border: selectedCat === cat ? '2px solid #16a34a' : '1px solid #cbd5e1',
                background: selectedCat === cat ? '#dcfce7' : '#ffffff',
                color: selectedCat === cat ? '#14532d' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat === 'All Software' ? '📂 அனைத்து மென்பொருட்கள்' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* SOFTWARE ITEMS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {filteredItems.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="esevai-hover-card esevai-holo-card"
              style={{
                background: 'white',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'grid', placeItems: 'center' }}>
                    <IconComp size={22} />
                  </div>
                  <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>
                    {item.tag}
                  </span>
                </div>

                <small style={{ color: '#2563eb', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.category}
                </small>
                <h3 style={{ font: '800 16px/1.3 Manrope', margin: '4px 0 2px', color: '#0f172a' }}>
                  {item.title}
                </h3>
                <small style={{ display: 'block', color: '#16a34a', fontWeight: 700, fontSize: '12px', marginBottom: '10px' }}>
                  {item.tamilTitle}
                </small>

                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {item.desc}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginBottom: '12px' }}>
                  <span>Version: <strong>{item.version}</strong></span>
                  <span>Size: <strong>{item.fileSize}</strong></span>
                </div>

                <button
                  onClick={() => handleAction(item)}
                  className="button button-primary button-wide"
                  style={{ padding: '10px', fontSize: '12px' }}
                >
                  {item.id === 'java-security-fix' || item.id === 'passport-action' || item.id === 'mantra-rd' || item.id === 'tamil-fonts-pack' ? (
                    <>
                      <Download size={15} /> 📥 பதிவிறக்கு (Download File)
                    </>
                  ) : (
                    <>
                      <ExternalLink size={15} /> 🌐 திற (Open Web Tool)
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
