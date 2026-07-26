import { useState, useEffect } from 'react';
import { ShieldCheck, FileCheck2, Check, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Eye, Award } from 'lucide-react';

const sampleDocs = [
  {
    id: 'aadhaar',
    title: 'Aadhaar Card Sample',
    tamilTitle: 'ஆதார் கார்டு மாதிரி',
    category: 'Identity Document',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    docNo: 'XXXX-XXXX-4891',
    issuedBy: 'UIDAI - Govt. of India',
    status: 'Verified Sample',
    details: [
      { label: 'Holder Name', val: 'S. KUMARAN / குமரான்' },
      { label: 'DOB / பிறந்த தேதி', val: '15/08/1992' },
      { label: 'Gender', val: 'MALE / ஆண்' },
      { label: 'Address', val: 'Palani, Dindigul - 624601' },
    ],
    badgeText: 'Govt. Verified ID',
  },
  {
    id: 'income',
    title: 'Income Certificate Sample',
    tamilTitle: 'வருமானச் சான்று மாதிரி',
    category: 'Revenue Certificate',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    docNo: 'TN-72026-98124',
    issuedBy: 'TNeGA / Revenue Dept TN',
    status: 'Official Format',
    details: [
      { label: 'Applicant Name', val: 'M. SELVI / செல்வி' },
      { label: 'Annual Income', val: '₹ 85,000 / annum' },
      { label: 'Purpose', val: 'Education & Scholarship' },
      { label: 'Taluk Office', val: 'Palani Taluk, Tamil Nadu' },
    ],
    badgeText: 'Official e-District',
  },
  {
    id: 'pan',
    title: 'PAN Card Sample',
    tamilTitle: 'பான் கார்டு மாதிரி',
    category: 'Income Tax Identity',
    color: '#0052cc',
    gradient: 'linear-gradient(135deg, #0052cc 0%, #022c7a 100%)',
    docNo: 'ABCDE 1234 F',
    issuedBy: 'Income Tax Dept, Govt of India',
    status: 'Valid Tax ID',
    details: [
      { label: 'Name', val: 'R. VENKATESH' },
      { label: 'Father Name', val: 'RAMASAMY' },
      { label: 'DOB', val: '24/11/1988' },
      { label: 'Category', val: 'INDIVIDUAL' },
    ],
    badgeText: 'Income Tax Card',
  },
  {
    id: 'passport',
    title: 'Passport Sample',
    tamilTitle: 'பாஸ்போர்ட் மாதிரி',
    category: 'Travel & Global ID',
    color: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
    docNo: 'Z 9841029',
    issuedBy: 'Passport Seva - Govt of India',
    status: 'Republic of India',
    details: [
      { label: 'Given Name', val: 'KARTHIK' },
      { label: 'Surname', val: 'RAMAN' },
      { label: 'Place of Birth', val: 'Palani, Tamil Nadu' },
      { label: 'Type', val: 'P (Personal)' },
    ],
    badgeText: 'Republic of India',
  },
  {
    id: 'smartcard',
    title: 'Smart Ration Card Sample',
    tamilTitle: 'குடும்ப அட்டை மாதிரி',
    category: 'TNPDS Family ID',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    docNo: '33/T/0912458',
    issuedBy: 'TNPDS - Govt of Tamil Nadu',
    status: 'Active Family Card',
    details: [
      { label: 'Head of Family', val: 'P. MURUGAN' },
      { label: 'Total Members', val: '4 Members' },
      { label: 'Shop No', val: 'FP-048 Palani Urban' },
      { label: 'Card Type', val: 'PHH - Rice Card' },
    ],
    badgeText: 'TNPDS Smart Card',
  },
  {
    id: 'community',
    title: 'Community Certificate Sample',
    tamilTitle: 'சாதிச் சான்றிதழ் மாதிரி',
    category: 'Revenue Department',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    docNo: 'TN-72026-10492',
    issuedBy: 'Revenue Department, TN',
    status: 'Verified Certificate',
    details: [
      { label: 'Applicant Name', val: 'A. PRIYA' },
      { label: 'Father Name', val: 'ANANDAN' },
      { label: 'Community', val: 'BC / MBC / SC / ST' },
      { label: 'District', val: 'Dindigul District' },
    ],
    badgeText: 'Digital Signature',
  },
];

export default function HeroDocumentShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto switch slides every 3.8s if not paused
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % sampleDocs.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [paused]);

  const doc = sampleDocs[activeIdx];

  return (
    <div
      className="hero-doc-showcase-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto',
      }}
    >
      {/* Selector Pills Slider */}
      <div
        className="sample-pills-row"
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '10px',
          scrollbarWidth: 'none',
        }}
      >
        {sampleDocs.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIdx(index)}
            style={{
              padding: '5px 11px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: activeIdx === index ? '1.5px solid ' + item.color : '1px solid #e2e8f0',
              background: activeIdx === index ? item.color : 'white',
              color: activeIdx === index ? 'white' : 'var(--ink)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: activeIdx === index ? '0 4px 12px ' + item.color + '40' : 'none',
            }}
          >
            {item.title.split(' ')[0]} {item.title.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Main Sample Visual Card */}
      <div
        className="sample-visual-card"
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 45px rgba(0, 82, 204, 0.14)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          animation: 'fadeInCard 0.4s ease both',
        }}
      >
        {/* Card Header Banner */}
        <div
          style={{
            background: doc.gradient,
            padding: '16px 20px',
            color: 'white',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                opacity: 0.9,
                display: 'block',
              }}
            >
              {doc.category}
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: '17px', fontWeight: 800, color: 'white' }}>
              {doc.title}
            </h3>
            <small style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: 600 }}>{doc.tamilTitle}</small>
          </div>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(6px)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={11} /> {doc.badgeText}
          </span>
        </div>

        {/* Card Details Body */}
        <div style={{ padding: '18px 20px' }}>
          <div
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              paddingBottom: '12px',
              borderBottom: '1px dashed #e2e8f0',
              marginBottom: '12px',
            }}
          >
            <div>
              <small style={{ fontSize: '9px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Sample Document ID
              </small>
              <strong style={{ fontSize: '13px', color: 'var(--ink)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {doc.docNo}
              </strong>
            </div>
            <span
              style={{
                fontSize: '10px',
                background: '#dcfce7',
                color: '#15803d',
                padding: '3px 8px',
                borderRadius: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Check size={12} /> {doc.status}
            </span>
          </div>

          {/* Grid Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', marginBottom: '14px' }}>
            {doc.details.map((item) => (
              <div key={item.label}>
                <small style={{ fontSize: '9px', color: 'var(--muted)', display: 'block' }}>{item.label}</small>
                <strong style={{ fontSize: '11px', color: 'var(--ink)', fontWeight: 700 }}>{item.val}</strong>
              </div>
            ))}
          </div>

          <div
            style={{
              background: '#f8fafc',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              color: 'var(--muted)',
            }}
          >
            <span>Authority: <strong>{doc.issuedBy}</strong></span>
            <span style={{ color: doc.color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Eye size={12} /> Sample Preview
            </span>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {sampleDocs.map((_, i) => (
            <span
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: activeIdx === i ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: activeIdx === i ? doc.color : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveIdx((prev) => (prev - 1 + sampleDocs.length) % sampleDocs.length)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'white',
              border: '1px solid #cbd5e1',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
            aria-label="Previous sample"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setActiveIdx((prev) => (prev + 1) % sampleDocs.length)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'white',
              border: '1px solid #cbd5e1',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: 'var(--ink)',
            }}
            aria-label="Next sample"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
