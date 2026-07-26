import React, { useState } from 'react';
import { Copy, Check, User, CreditCard, FileText, MapPin, Phone, Calendar, X, Sparkles, PlusCircle } from 'lucide-react';

export default function AdminAutoFillProfileDrawer({ notify }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const [profile, setProfile] = useState({
    name: 'கந்தசாமி K (Kanthasamy K)',
    phone: '9342318844',
    aadhaar: '8492 1039 4821',
    rationCard: '33/048/019284',
    dob: '15-08-1988',
    income: '72,000 (ரூபாய் எழுபத்திரண்டாயிரம்)',
    community: 'BC (பிற்படுத்தப்பட்டோர்)',
    address: 'கதவு எண் 42, மில் ரோடு, பழனி, திண்டுக்கல் மாவட்டம் - 624601'
  });

  const handleCopy = (fieldKey, label, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldKey);
    if (typeof notify === 'function') {
      notify(`📋 நகலெடுக்கப்பட்டது: ${label} ("${value}")`);
    }
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = 
      `பெயர்: ${profile.name}\n` +
      `மொபைல்: ${profile.phone}\n` +
      `ஆதார் எண்: ${profile.aadhaar}\n` +
      `ரேஷன் கார்டு: ${profile.rationCard}\n` +
      `பிறந்த தேதி: ${profile.dob}\n` +
      `வருமானம்: ${profile.income}\n` +
      `பிரிவு: ${profile.community}\n` +
      `முகவரி: ${profile.address}`;

    navigator.clipboard.writeText(fullText);
    if (typeof notify === 'function') {
      notify('📋 அனைத்து வாடிக்கையாளர் விவரங்களும் நகலெடுக்கப்பட்டன!');
    }
  };

  const fields = [
    { key: 'name', label: 'விண்ணப்பதாரர் பெயர் (Name)', icon: User, val: profile.name },
    { key: 'phone', label: 'மொபைல் எண் (Phone)', icon: Phone, val: profile.phone },
    { key: 'aadhaar', label: 'ஆதார் எண் (Aadhaar No)', icon: CreditCard, val: profile.aadhaar },
    { key: 'rationCard', label: 'ஸ்மார்ட் ரேஷன் கார்டு (Ration Card)', icon: FileText, val: profile.rationCard },
    { key: 'dob', label: 'பிறந்த தேதி (DOB)', icon: Calendar, val: profile.dob },
    { key: 'income', label: 'ஆண்டு வருமானம் (Annual Income)', icon: Sparkles, val: profile.income },
    { key: 'community', label: 'சாதிப் பிரிவு (Community)', icon: FileText, val: profile.community },
    { key: 'address', label: 'முழு முகவரி (Address)', icon: MapPin, val: profile.address }
  ];

  return (
    <>
      {/* FLOATING TRIGGER BUTTON FOR ADMIN */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          background: '#022c7a',
          color: '#fbbf24',
          border: '2px solid #fbbf24',
          borderRadius: '50px',
          padding: '10px 18px',
          fontWeight: 800,
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(2, 44, 122, 0.3)',
          zIndex: 9999
        }}
      >
        <Copy size={16} /> 1-CLICK COPY AUTO-FILL
      </button>

      {/* DRAWER MODAL */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '380px',
          maxWidth: '90vw',
          height: '100vh',
          background: 'white',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '4px solid #0052cc'
        }}>
          {/* HEADER */}
          <div style={{
            background: '#022c7a',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> TNEGA AUTO-FILL HELPER
              </div>
              <h4 style={{ font: '800 16px Manrope', margin: 0, color: 'white' }}>
                வாடிக்கையாளர் விவரங்கள் <span>(1-Click Copy)</span>
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: '12px 20px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', justify: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 700 }}>
              இ-சேவை போர்ட்டலில் ஒட்ட பொத்தானை அழுத்தவும்.
            </span>
            <button
              onClick={handleCopyAll}
              style={{
                background: '#0052cc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Copy size={12} /> Copy All
            </button>
          </div>

          {/* FIELDS LIST */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fields.map((f) => {
              const IconComponent = f.icon;
              const isCopied = copiedField === f.key;
              return (
                <div
                  key={f.key}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconComponent size={13} color="#0052cc" /> {f.label}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={f.val}
                      onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                      style={{
                        flex: 1,
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        background: 'white'
                      }}
                    />
                    <button
                      onClick={() => handleCopy(f.key, f.label, f.val)}
                      style={{
                        background: isCopied ? '#16a34a' : '#0052cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
