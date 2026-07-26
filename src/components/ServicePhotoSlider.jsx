import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Fingerprint, Award, CreditCard, UserCheck, FileBadge, QrCode } from 'lucide-react';

const servicePhotos = [
  {
    id: 1,
    title: 'ஆதார் அட்டைக் சேவைகள்',
    tamilSub: 'Aadhaar Enrolment & Correction',
    badge: '🔥 மிகவும் பிரபலம்',
    category: 'ஆதார் மையம்',
    type: 'aadhaar',
    desc: 'மொபைல் எண் & Mail ID இணைப்பு, முகவரி மாற்றம், பயோமெட்ரிக் புதுப்பித்தல் மற்றும் பெயர் திருத்தம் எளிதாகச் செய்து தரப்படும்.',
    highlights: ['10 நிமிடங்களில் விண்ணப்பம்', 'உடனடி ஒப்புதல் சீட்டு', 'அருகில் உள்ள ஆதார் மையம்']
  },
  {
    id: 2,
    title: 'அரசு வருவாய்ச் சான்றிதழ்கள்',
    tamilSub: 'Government Revenue Certificates',
    badge: '✅ விரைவுச் சேவை',
    category: 'இ-சேவை சான்றிதழ்',
    type: 'certificate',
    desc: 'வருமானச் சான்று, சாதிச் சான்று, இருப்பிடச் சான்று, முதல் பட்டதாரி மற்றும் வாரிசுச் சான்றுகள் துல்லியமாகப் பெறலாம்.',
    highlights: ['VAO & RI சரிபார்ப்பு உதவி', 'வீட்டில் இருந்தபடியே பெறலாம்', 'SMS அறிவிப்பு']
  },
  {
    id: 3,
    title: 'ஸ்மார்ட் குடும்ப அட்டை சேவைகள்',
    tamilSub: 'Smart Ration Card Applications',
    badge: '⭐ முக்கிய சேவை',
    category: 'குடும்ப அட்டை',
    type: 'smartcard',
    desc: 'புதிய ஸ்மார்ட் குடும்ப அட்டை விண்ணப்பம், பெயர் சேர்த்தல், நீக்குதல், முகவரி மாற்றம் மற்றும் அட்டை அச்சிடுதல்.',
    highlights: ['புதிய அட்டை விண்ணப்பம்', 'உறுப்பினர் பெயர் திருத்தம்', 'கடை மாற்றம்']
  },
  {
    id: 4,
    title: 'நலவாரியம் & ஓய்வூதியத் திட்டங்கள்',
    tamilSub: 'Welfare Board & Pension Schemes',
    badge: '🤝 அரசு நலத்திட்டம்',
    category: 'நலவாரியம்',
    type: 'welfare',
    desc: 'கட்டுமான நலவாரியம், ஓட்டுநர் நலவாரியம், முதியோர் ஓய்வூதியம் (OAP) மற்றும் அனைத்து நலத்திட்டப் பதிவுகள்.',
    highlights: ['நலவாரியப் புதுப்பித்தல்', 'ஓய்வூதிய விண்ணப்பம்', 'நிதியுதவி உதவி']
  },
  {
    id: 5,
    title: 'பாஸ்போர்ட் & PAN கார்டு',
    tamilSub: 'Passport & Instant PAN Card',
    badge: '⚡ 24 மணி நேர சேவை',
    category: 'அடையாளச் சான்று',
    type: 'passport',
    desc: 'புதிய பாஸ்போர்ட் அப்பாயிண்ட்மெண்ட், தட்கல் பாஸ்போர்ட், உடனடி e-PAN கார்டு மற்றும் PAN கார்டு திருத்தம்.',
    highlights: ['பாஸ்போர்ட் Slot Booking', 'உடனடி 10 நிமிட e-PAN', 'பிளாஸ்டிக் கார்டு பிரிண்ட்']
  },
  {
    id: 6,
    title: 'TNPSC & தேர்வு விண்ணப்பங்கள்',
    tamilSub: 'Competitive Exam Applications',
    badge: '🎓 மாணவர் சேவை',
    category: 'தேர்வு விண்ணப்பம்',
    type: 'exam',
    desc: 'TNPSC Group 1, 2, 4, TRB, காவலர் தேர்வு, SSC, RRB மற்றும் அனைத்து கல்லூரி சேர்க்கை விண்ணப்பங்கள்.',
    highlights: ['OTR ஒற்றைப்பதிவு உதவி', 'புகைப்படம்/கையெழுத்துப் அளவு', 'விண்ணப்ப நகல் அச்சு']
  }
];

function DocumentGraphicCard({ type }) {
  if (type === 'aadhaar') {
    return (
      <div className="doc-card-render aadhaar-style">
        <div className="aadhaar-top-tricolor" />
        <div className="aadhaar-head-row">
          <div className="emblem-placeholder">🏛️</div>
          <div>
            <strong>இந்திய தனித்துவ அடையாள ஆணையம்</strong>
            <small>Unique Identification Authority of India</small>
          </div>
        </div>
        <div className="aadhaar-body-row">
          <div className="user-photo-box">
            <Fingerprint size={36} color="#0052cc" />
          </div>
          <div className="aadhaar-info-text">
            <small>பெயர் / Name:</small>
            <strong>வாடிக்கையாளர் / Citizen</strong>
            <small>பிறந்த தேதி / DOB: 01/01/1995</small>
            <small>பாலினம் / Gender: ஆண் / MALE</small>
          </div>
        </div>
        <div className="aadhaar-number-bar">
          <strong>XXXX XXXX 9842</strong>
        </div>
        <div className="aadhaar-tagline">
          எனது ஆதார், எனது அடையாளம் / My Aadhaar, My Identity
        </div>
      </div>
    );
  }

  if (type === 'certificate') {
    return (
      <div className="doc-card-render cert-style">
        <div className="cert-watermark">TN GOVT</div>
        <div className="cert-head">
          <div className="crest-logo">🏛️</div>
          <strong>தமிழ்நாடு அரசு / Govt of Tamil Nadu</strong>
          <small>வருவாய்த் துறை / Revenue Department</small>
        </div>
        <div className="cert-title-box">
          <h2>வருமானச் சான்றிதழ்</h2>
          <small>INCOME CERTIFICATE</small>
        </div>
        <div className="cert-body-lines">
          <div>சான்றிதழ் எண்: <strong>TN-720260725101</strong></div>
          <div>விண்ணப்பதாரர்: <strong>செல்வன் / செல்வி</strong></div>
          <div>ஆண்டு வருமானம்: <strong>₹60,000/-</strong></div>
        </div>
        <div className="cert-footer-stamp">
          <Award size={28} color="#16a34a" />
          <span>VAO & RI டிஜிட்டல் கையொப்பமிட்டது</span>
        </div>
      </div>
    );
  }

  if (type === 'smartcard') {
    return (
      <div className="doc-card-render smartcard-style">
        <div className="smart-head">
          <strong>தமிழ்நாடு அரசு - பொது விநியோகத் திட்டம்</strong>
          <small>TAMIL NADU SMART RATION CARD</small>
        </div>
        <div className="smart-body">
          <div className="chip-box">
            <div className="gold-chip" />
            <small>SMART CHIP</small>
          </div>
          <div className="smart-details">
            <small>குடும்பத் தலைவர்:</small>
            <strong>குடும்பத் தலைவர் பெயர்</strong>
            <small>அட்டை எண் / Card No:</small>
            <strong>3309 4821 0042</strong>
          </div>
        </div>
        <div className="smart-bottom-bar">
          <span>உணவுப் பொருள் வழங்கல் துறை</span>
          <QrCode size={20} />
        </div>
      </div>
    );
  }

  if (type === 'welfare') {
    return (
      <div className="doc-card-render welfare-style">
        <div className="welfare-head">
          <UserCheck size={24} color="#facc15" />
          <div>
            <strong>தமிழ்நாடு கட்டுமான தொழிலாளர்கள் நலவாரியம்</strong>
            <small>TN Welfare Board Identification Card</small>
          </div>
        </div>
        <div className="welfare-body">
          <div className="welfare-photo-frame">
            <ShieldCheck size={32} color="#16a34a" />
          </div>
          <div className="welfare-text">
            <small>உறுப்பினர் எண் / Registration No:</small>
            <strong>TN-WLB-2026-9842</strong>
            <small>நலவாரியப் பதிவு: <strong>புதுப்பிக்கப்பட்டது ✅</strong></small>
            <small>ஓய்வூதியத் தகுதி: <strong>உள்ளது</strong></small>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'passport') {
    return (
      <div className="doc-card-render passport-style">
        <div className="passport-cover">
          <div className="gold-crest">🦁</div>
          <h3>PASSPORT</h3>
          <strong>REPUBLIC OF INDIA</strong>
          <small>பாரத கணராஜ்யா / இந்திய பாஸ்போர்ட்</small>
        </div>
        <div className="pan-overlay-card">
          <div className="pan-top">INCOME TAX DEPARTMENT</div>
          <div className="pan-body">
            <strong>PERMANENT ACCOUNT NUMBER</strong>
            <h4 className="pan-num">ABCDE1234F</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doc-card-render exam-style">
      <div className="exam-head">
        <FileBadge size={26} color="#0052cc" />
        <div>
          <strong>TNPSC - தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம்</strong>
          <small>One Time Registration & Online Application</small>
        </div>
      </div>
      <div className="exam-body">
        <div className="exam-badge">OTR VERIFIED ✅</div>
        <div className="exam-details">
          <small>விண்ணப்ப எண் / App No:</small>
          <strong>TNPSC-Group4-2026</strong>
          <small>தேர்வு மையம்: <strong>பழனி / திண்டுக்கல்</strong></small>
        </div>
      </div>
    </div>
  );
}

export default function ServicePhotoSlider({ navigate }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % servicePhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = servicePhotos[activeIndex];

  return (
    <div className="service-photo-showcase-section">
      <div className="showcase-header-pill">
        <Sparkles size={16} /> நாங்கள் வழங்கும் முதன்மை சேவைகள் / OUR FEATURED SERVICES
      </div>
      <h2 className="showcase-section-title">
        எங்கள் இ-சேவை மையத்தில் <span>வழங்கப்படும் சேவைகள்</span>
      </h2>
      <p className="showcase-section-desc">
        அரசு மற்றும் பொதுமக்கள் பயன்பாட்டிற்கான அனைத்து இணையதள சேவைகளும் உங்கள் AkEsevai மையத்தில் துரிதமாகச் செய்து தரப்படும்.
      </p>

      {/* MAIN FEATURED DISPLAY CARD */}
      <div className="featured-service-display-card">
        {/* LEFT CUSTOM INDIAN DOCUMENT GRAPHIC DISPLAY */}
        <div className="service-photo-frame">
          <DocumentGraphicCard type={current.type} />
          <div className="photo-badge-chip">{current.badge}</div>
          <div className="photo-category-pill">{current.category}</div>
        </div>

        {/* RIGHT CONTENT DETAILS */}
        <div className="service-details-content">
          <span className="service-sub-label">{current.tamilSub}</span>
          <h3 className="service-title-text">{current.title}</h3>
          <p className="service-desc-text">{current.desc}</p>

          <div className="service-highlights-list">
            {current.highlights.map((item, idx) => (
              <div key={idx} className="highlight-tag">
                <CheckCircle2 size={15} /> <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="service-action-buttons">
            <button
              className="button button-primary"
              onClick={() => {
                if (typeof navigate === 'function') {
                  navigate('token-generator');
                }
              }}
              style={{ background: 'linear-gradient(135deg, #15803d 0%, #022c7a 100%)' }}
            >
              நேரடி டோக்கன் பெற / Book Token <ArrowRight size={17} />
            </button>
            <button
              className="button button-light"
              onClick={() => navigate('services')}
            >
              அனைத்து சேவைகள் / View Catalog
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM THUMBNAIL NAVIGATOR BAR */}
      <div className="service-thumbnails-row">
        {servicePhotos.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`thumb-card ${index === activeIndex ? 'active-thumb' : ''}`}
          >
            <div className="thumb-icon-circle">
              {item.type === 'aadhaar' && '🪪'}
              {item.type === 'certificate' && '📜'}
              {item.type === 'smartcard' && '💳'}
              {item.type === 'welfare' && '🤝'}
              {item.type === 'passport' && '🛂'}
              {item.type === 'exam' && '🎓'}
            </div>
            <div className="thumb-info">
              <strong>{item.title}</strong>
              <small>{item.category}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
