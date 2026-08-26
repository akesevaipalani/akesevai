import React, { useState } from 'react';
import {
  Camera, SlidersHorizontal, Crop, Minimize2, Maximize2, Sparkles,
  Palette, FileImage, Layers, ArrowRightLeft, ArrowLeftRight, FileText,
  FileType, Combine, FileSpreadsheet, Shrink, Search, ShieldCheck,
  CheckCircle2, ArrowRight, Sparkle, ExternalLink
} from 'lucide-react';
import { PHOTO_TOOLS_CATALOG, PHOTO_TOOLS_CATEGORIES } from '../data/photoToolsData';

// Map icon strings to Lucide icon components
const ICON_MAP = {
  Camera, SlidersHorizontal, Crop, Minimize2, Maximize2, Sparkles,
  Palette, FileImage, Layers, ArrowRightLeft, ArrowLeftRight, FileText,
  FileType, Combine, FileSpreadsheet, Shrink, FileDigit: FileText, FileCheck: CheckCircle2
};

export default function PhotoToolsHubPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = PHOTO_TOOLS_CATALOG.filter((tool) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCat) return false;
    if (!q) return true;

    return (
      tool.id.toLowerCase().includes(q) ||
      tool.title.toLowerCase().includes(q) ||
      tool.titleTa.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.descriptionTa.toLowerCase().includes(q) ||
      tool.keywords.toLowerCase().includes(q)
    );
  });

  return (
    <div className="photo-tools-hub" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 60%, #1e40af 100%)',
          borderRadius: '20px',
          padding: '36px 28px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '32px',
          boxShadow: '0 12px 32px rgba(2,44,122,0.2)'
        }}
      >
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11px', fontWeight: 900, padding: '5px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          ⚡ 100% FREE & PRIVATE CLIENT-SIDE TOOLS
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.25 }}>
          {isTa ? 'இலவச ஆன்லைன் புகைப்படம் & ஆவணக் கருவிகள்' : 'Free Online Photo & Document Tools'}
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.92, margin: '0 auto 24px', maxWidth: '750px', lineHeight: 1.55 }}>
          {isTa
            ? 'பாஸ்போர்ட் போட்டோ தயாரிப்பு, 20KB/50KB/100KB போட்டோ சுருக்கம், ரீசைஸ், கிராப் மற்றும் JPG ➔ PDF ஆவண மாற்றிகள். அரசுத் தேர்வுகள் மற்றும் இ-சேவை பதிவேற்றங்களுக்கு முற்றிலும் இலவசம்.'
            : 'Fast, secure browser-based tools for passport photos, exam photo compression (20KB, 50KB, 100KB), image resizing, and PDF document generation.'}
        </p>

        {/* Search Input Bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <Search size={20} color="#0052cc" style={{ position: 'absolute', left: '16px', top: '14px' }} />
          <input
            id="photo-tools-hub-search-input"
            name="photo_tools_search"
            type="text"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTa ? 'கருவிகளைத் தேடுக (எ.கா: 20kb, passport, pdf, crop, resize)...' : 'Search tools (e.g. 20kb, passport, compress, pdf, tnpsc)...'}
            style={{
              width: '100%',
              padding: '13px 16px 13px 46px',
              borderRadius: '30px',
              border: 'none',
              fontSize: '14.5px',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12.5px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: selectedCategory === 'all' ? '#0052cc' : '#e2e8f0',
            color: selectedCategory === 'all' ? 'white' : '#334155',
            whiteSpace: 'nowrap'
          }}
        >
          {isTa ? 'அனைத்தும் (All 19 Tools)' : 'All 19 Tools'}
        </button>
        {PHOTO_TOOLS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              background: selectedCategory === cat.id ? '#0052cc' : '#e2e8f0',
              color: selectedCategory === cat.id ? 'white' : '#334155',
              whiteSpace: 'nowrap'
            }}
          >
            {isTa ? cat.titleTa : cat.title}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {filteredTools.map((tool) => {
          const IconComp = ICON_MAP[tool.icon] || Camera;
          return (
            <div
              key={tool.id}
              onClick={() => {
                if (navigate) navigate(`tools/${tool.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0052cc';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,82,204,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '12px', color: '#0052cc' }}>
                    <IconComp size={22} />
                  </div>
                  <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    {isTa ? tool.badgeTa : tool.badge}
                  </span>
                </div>

                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  {isTa ? tool.titleTa.split('|')[0] : tool.title.split('|')[0]}
                </h2>

                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.45 }}>
                  {isTa ? tool.descriptionTa : tool.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                  ✓ 100% Free · No Limit
                </span>
                <span style={{ fontSize: '12.5px', color: '#0052cc', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {isTa ? 'பயன்படுத்துக' : 'Open Tool'} <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Results fallback */}
      {filteredTools.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '16px', marginBottom: '32px' }}>
          <Search size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 6px' }}>
            {isTa ? 'கருவிகள் ஏதும் கிடைக்கவில்லை' : 'No tools matched your search'}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>
            {isTa ? 'வேறு ஏதேனும் வார்த்தை கொண்டு தேடவும்.' : 'Try searching for passport, compress, resize, or pdf.'}
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            style={{ background: '#0052cc', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            {isTa ? 'அனைத்து கருவிகளையும் காட்டு' : 'Reset Search'}
          </button>
        </div>
      )}

      {/* Privacy Guarantee Box */}
      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <ShieldCheck size={36} color="#16a34a" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#166534', margin: '0 0 4px' }}>
            🔒 {isTa ? 'உங்கள் படங்கள் உங்கள் சாதனத்திலேயே பாதுகாக்கப்படுகின்றன (Client-Side Privacy)' : '100% Client-Side Privacy Guarantee'}
          </h3>
          <p style={{ fontSize: '13px', color: '#15803d', margin: 0, lineHeight: 1.5 }}>
            {isTa
              ? 'AK e-Sevai-யின் அனைத்து புகைப்பட மற்றும் ஆவணக் கருவிகளும் நவீன HTML5 மற்றும் JavaScript கொண்டு உங்கள் பிரவுசரிலேயே இயங்குகின்றன. உங்கள் தனிப்பட்ட படங்கள் எக்காரணத்தைக் கொண்டும் வெளி சர்வர்க்கு பதிவேற்றப்படாது.'
              : 'All photo and document tools run 100% locally inside your web browser. Your sensitive identity photos and documents never touch external servers.'}
          </p>
        </div>
      </div>

    </div>
  );
}
