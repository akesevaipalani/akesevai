import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, ExternalLink, Copy, Check, ShieldCheck, Globe, Landmark,
  Building2, GraduationCap, BriefcaseBusiness, IndianRupee,
  School, Award, ArrowUpRight, Share2, Filter, RefreshCw, AlertCircle,
  Train, Stethoscope, Sparkles, CheckCircle2, ChevronRight, BookOpen, Layers, MapPin
} from 'lucide-react';
import { allWebLinks, weblinkCategories } from '../data/weblinksData';

export const pageMeta = {
  id: 'weblink',
  title: 'முக்கியமான இணைப்புகள் | 457+ Important Official Govt Links | AkEsevai Palani'
};

const CATEGORY_ICONS = {
  all: Globe,
  districts: Landmark,
  education: GraduationCap,
  exams: Award,
  jobs: BriefcaseBusiness,
  scholarships: School,
  documents: ShieldCheck,
  state: Landmark,
  central: Building2,
  gov_services: Landmark,
  csc: Award,
  tnega: Landmark,
  recruitment: BriefcaseBusiness,
  entrance: Award,
  university: School,
  college: GraduationCap,
  finance: IndianRupee,
  loan: IndianRupee,
  bill: IndianRupee,
  transport: Train,
  ticket: Train,
  health: Stethoscope,
  agriculture: Sparkles,
  tools: Sparkles,
  others: Layers
};

const CATEGORY_THEMES = {
  all: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', lightBg: '#f0f9ff' },
  districts: { bg: '#fef3c7', text: '#b45309', border: '#fde68a', lightBg: '#fffbeb' },
  education: { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe', lightBg: '#eef2ff' },
  exams: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa', lightBg: '#fff7ed' },
  jobs: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca', lightBg: '#fef2f2' },
  scholarships: { bg: '#fae8ff', text: '#86198f', border: '#f5d0fe', lightBg: '#fdf4ff' },
  documents: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', lightBg: '#f0fdf4' },
  state: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', lightBg: '#f0fdf4' },
  central: { bg: '#fef3c7', text: '#b45309', border: '#fde68a', lightBg: '#fffbeb' },
  gov_services: { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4', lightBg: '#f0fdfa' },
  csc: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe', lightBg: '#f5f3ff' },
  finance: { bg: '#fef3c7', text: '#b45309', border: '#fde68a', lightBg: '#fffbeb' },
  transport: { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd', lightBg: '#f0f9ff' },
  health: { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3', lightBg: '#fff1f2' },
  agriculture: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0', lightBg: '#ecfdf5' },
  tools: { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff', lightBg: '#faf5ff' },
  others: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', lightBg: '#f8fafc' }
};

const QUICK_CATEGORY_BUTTONS = [
  { id: 'districts', labelEn: '🏛️ 38 TN Districts', labelTa: '🏛️ 38 மாவட்டங்கள்' },
  { id: 'education', labelEn: '🎓 College Admission', labelTa: '🎓 கல்லூரி சேர்க்கை' },
  { id: 'exams', labelEn: '📝 Entrance Exams', labelTa: '📝 போட்டித் தேர்வுகள்' },
  { id: 'jobs', labelEn: '💼 Govt Jobs (NCS)', labelTa: '💼 அரசு வேலைவாய்ப்பு' },
  { id: 'scholarships', labelEn: '🎓 Scholarships', labelTa: '🎓 உதவித்தொகை (NSP)' },
  { id: 'documents', labelEn: '🪪 Documents', labelTa: '🪪 அரசு ஆவணங்கள்' },
  { id: 'state', labelEn: '🏛️ TN State Govt', labelTa: '🏛️ தமிழ்நாடு அரசு' },
];

export default function WeblinkPage({ notify, lang = 'ta' }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const isTa = lang === 'ta';

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('important-links-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyLink = (item) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      if (notify) {
        notify(isTa ? `"${item.title}" இணைப்பு நகலெடுக்கப்பட்டது!` : `"${item.title}" link copied!`);
      }
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleShareLink = async (item) => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: item.title,
          text: isTa ? `${item.tamil || item.title} - அதிகாரப்பூர்வ இணையதளம்` : `${item.title} - Official Portal`,
          url: item.url
        });
      } catch (err) {}
    } else {
      handleCopyLink(item);
    }
  };

  const filteredLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allWebLinks.filter((link) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cats = Array.isArray(link.categories) ? link.categories : [link.categories || 'others'];
        let matchCategory = cats.includes(selectedCategory);

        if (!matchCategory) {
          if (selectedCategory === 'education' && (cats.includes('college') || cats.includes('university'))) {
            matchCategory = true;
          } else if (selectedCategory === 'exams' && cats.includes('entrance')) {
            matchCategory = true;
          } else if (selectedCategory === 'jobs' && cats.includes('recruitment')) {
            matchCategory = true;
          } else if (selectedCategory === 'scholarships' && cats.includes('loan')) {
            matchCategory = true;
          } else if (selectedCategory === 'finance' && cats.includes('bill')) {
            matchCategory = true;
          } else if (selectedCategory === 'transport' && cats.includes('ticket')) {
            matchCategory = true;
          } else if (selectedCategory === 'state' && cats.includes('tnega')) {
            matchCategory = true;
          }
        }

        if (!matchCategory) return false;
      }

      // Query filter
      if (!q) return true;

      const titleMatch = (link.title || '').toLowerCase().includes(q);
      const tamilMatch = (link.tamil || '').toLowerCase().includes(q);
      const descTaMatch = (link.descTa || '').toLowerCase().includes(q);
      const descEnMatch = (link.descEn || '').toLowerCase().includes(q);
      const domainMatch = (link.domain || '').toLowerCase().includes(q);
      const tagMatch = Array.isArray(link.tags) && link.tags.some((t) => t.toLowerCase().includes(q));

      return titleMatch || tamilMatch || descTaMatch || descEnMatch || domainMatch || tagMatch;
    });
  }, [query, selectedCategory]);

  return (
    <section className="page-width inner-page weblink-page-wrapper" id="important-links-page">
      {/* 1. HERO HEADER */}
      <div className="inner-hero weblink-hero" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className="weblink-hero-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #0284c7, #1e40af)',
          color: '#ffffff',
          padding: '6px 18px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 800,
          marginBottom: '14px',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
        }}>
          <ShieldCheck size={16} />
          <span>{isTa ? '457+ சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ அரசு, மாவட்டம் & கல்வி தளங்கள்' : '457+ Verified Official Government, District & Educational Portals'}</span>
        </div>

        <h1 className="weblink-page-title" style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em'
        }}>
          {isTa ? 'முக்கியமான அரசு & மாவட்ட இணைப்புகள்' : 'Important Official Government & District Links'}
        </h1>

        <p className="weblink-page-subtitle" style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          color: '#475569',
          maxWidth: '860px',
          margin: '0 auto 20px',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          {isTa
            ? 'தமிழ்நாட்டின் 38 மாவட்டங்களின் அதிகாரப்பூர்வ இணையதளங்கள், கல்வி, வேலைவாய்ப்பு, மத்திய/மாநில அரசு சேவைகள் அனைத்தும் ஒரே இடத்தில்.'
            : 'All 38 Tamil Nadu District official portals, educational, employment, central and state government service websites in one directory.'}
        </p>

        {/* STATS QUICK BAR */}
        <div className="weblink-stats-bar" style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '12px'
        }}>
          <div className="weblink-stat-pill">
            <strong style={{ color: '#0284c7' }}>{allWebLinks.length}+</strong>
            <span>{isTa ? 'மொத்த தளங்கள்' : 'Total Portals'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong style={{ color: '#b45309' }}>38/38</strong>
            <span>{isTa ? 'தமிழக மாவட்டங்கள்' : 'TN Districts'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong style={{ color: '#16a34a' }}>144+</strong>
            <span>{isTa ? 'தமிழ்நாடு அரசு' : 'TN State Govt'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong style={{ color: '#7c3aed' }}>100%</strong>
            <span>{isTa ? 'சரிபார்க்கப்பட்டவை' : 'Verified Links'}</span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS BOX */}
      <div className="weblink-controls-card" style={{
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: '18px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
      }}>
        {/* Search Input */}
        <div className="weblink-search-bar" style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f8fafc',
          border: '1.5px solid #94a3b8',
          borderRadius: '14px',
          padding: '10px 14px',
          gap: '10px',
          position: 'relative'
        }}>
          <Search size={22} color="#0284c7" style={{ flexShrink: 0 }} />
          <input
            id="important-links-search-input"
            name="important_links_search"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isTa ? "மாவட்டம் / சேவை தேட (பழனி, திண்டுக்கல், Madurai, College, Job, Aadhaar, Passport...)" : "Search district or service (Palani, Dindigul, Madurai, Chennai, Exam, Job, Passport...)"}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              minHeight: '28px'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="weblink-search-clear-btn"
              title="Clear search"
              style={{
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                color: '#475569',
                flexShrink: 0
              }}
            >
              ✕
            </button>
          )}
          <span className="weblink-count-tag" style={{
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11.5px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            {filteredLinks.length} {isTa ? 'இணைப்புகள்' : 'links'}
          </span>
        </div>

        {/* 3. QUICK SHORTCUT BUTTONS */}
        <div style={{ marginTop: '14px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            ⚡ {isTa ? 'முக்கிய விரைவுப் பிரிவுகள் (Quick Shortcuts):' : 'Quick Category Shortcuts:'}
          </span>
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {QUICK_CATEGORY_BUTTONS.map((qBtn) => {
              const isSelected = selectedCategory === qBtn.id;
              return (
                <button
                  key={qBtn.id}
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'all' : qBtn.id);
                  }}
                  style={{
                    background: isSelected ? '#0284c7' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1px solid #0284c7' : '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isTa ? qBtn.labelTa : qBtn.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. ALL CATEGORIES HORIZONTAL TOUCH SCROLL */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <div className="weblink-categories-scroll" style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '6px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {weblinkCategories.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.id] || Globe;
              const isSelected = selectedCategory === cat.id;
              const theme = CATEGORY_THEMES[cat.id] || CATEGORY_THEMES.all;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: isSelected ? theme.text : theme.lightBg,
                    color: isSelected ? '#ffffff' : theme.text,
                    border: `1.5px solid ${isSelected ? theme.text : theme.border}`,
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    minHeight: '44px'
                  }}
                >
                  <IconComp size={15} />
                  <span>{isTa ? cat.labelTa : cat.labelEn}</span>
                  <span style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : theme.bg,
                    color: isSelected ? '#ffffff' : theme.text,
                    padding: '2px 7px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE FILTER STATUS & RESET */}
        {(query || selectedCategory !== 'all') && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px dashed #cbd5e1',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
              {isTa ? 'வடிகட்டப்பட்டது:' : 'Active Filter:'}{' '}
              <strong style={{ color: '#0284c7' }}>
                {selectedCategory !== 'all'
                  ? (isTa ? weblinkCategories.find((c) => c.id === selectedCategory)?.labelTa : weblinkCategories.find((c) => c.id === selectedCategory)?.labelEn)
                  : ''}
                {query ? ` "${query}"` : ''}
              </strong>{' '}
              ({filteredLinks.length} {isTa ? 'முடிவுகள்' : 'results'})
            </span>

            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
              style={{
                background: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                minHeight: '36px'
              }}
            >
              <RefreshCw size={13} /> {isTa ? 'அனைத்தையும் காட்டுக' : 'Reset All Filters'}
            </button>
          </div>
        )}
      </div>

      {/* 5. CARDS GRID */}
      {filteredLinks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {filteredLinks.map((link) => {
            const isDistrict = Array.isArray(link.categories) && link.categories.includes('districts');
            const primaryCat = isDistrict ? 'districts' : (Array.isArray(link.categories) ? link.categories[0] : (link.category || 'regular'));
            const theme = CATEGORY_THEMES[primaryCat] || CATEGORY_THEMES.others;
            const categoryObj = weblinkCategories.find((c) => c.id === primaryCat);
            const IconComp = CATEGORY_ICONS[primaryCat] || Globe;

            return (
              <div
                key={link.id}
                className="weblink-card"
                style={{
                  background: '#ffffff',
                  border: isDistrict ? '1.5px solid #fcd34d' : '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isDistrict ? '0 4px 14px rgba(245, 158, 11, 0.08)' : '0 3px 12px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Bar: Category badge & Domain */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: theme.bg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      <IconComp size={13} />
                      {isDistrict ? (isTa ? '🏛️ மாவட்ட இணையதளம்' : '🏛️ District Portal') : (isTa ? (categoryObj?.labelTa || primaryCat).replace(/^[^\s]+\s*/, '') : (categoryObj?.labelEn || primaryCat))}
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#f0fdf4',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      maxWidth: '180px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <CheckCircle2 size={12} color="#16a34a" style={{ flexShrink: 0 }} /> {link.domain || 'gov.in'}
                    </span>
                  </div>

                  {/* Tamil Title */}
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: '0 0 4px 0',
                    lineHeight: 1.4
                  }}>
                    {link.tamil || link.title}
                  </h3>

                  {/* English Title */}
                  <div style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '10px'
                  }}>
                    {link.title}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0 0 14px 0',
                    lineHeight: 1.55,
                    fontWeight: 500
                  }}>
                    {isTa ? (link.descTa || `${link.tamil || link.title} - அதிகாரப்பூர்வ இணையதள சேவை.`) : (link.descEn || `${link.title} official online portal.`)}
                  </p>
                </div>

                {/* Card Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: 'auto'
                }}>
                  {/* Primary Visit Button */}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: isDistrict ? 'linear-gradient(135deg, #d97706, #b45309)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      boxShadow: isDistrict ? '0 3px 10px rgba(217, 119, 6, 0.25)' : '0 3px 10px rgba(2, 132, 199, 0.2)',
                      minHeight: '44px',
                      transition: 'all 0.2s ease'
                    }}
                    title={isTa ? `${link.tamil || link.title} அதிகாரப்பூர்வ இணையதளம் திறக்க` : `Open ${link.title}`}
                  >
                    <span>{isTa ? 'அதிகாரப்பூர்வ Website →' : 'Visit Official Portal →'}</span>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(link)}
                    style={{
                      background: copiedId === link.id ? '#dcfce7' : '#f8fafc',
                      color: copiedId === link.id ? '#166534' : '#475569',
                      border: copiedId === link.id ? '1px solid #86efac' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      width: '44px',
                      height: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    title={isTa ? 'இணைப்பை நகலெடுக்க' : 'Copy link address'}
                    aria-label="Copy Link"
                  >
                    {copiedId === link.id ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
                  </button>

                  {/* Share Link Button */}
                  <button
                    type="button"
                    onClick={() => handleShareLink(link)}
                    style={{
                      background: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      width: '44px',
                      height: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    title={isTa ? 'பகிரவும்' : 'Share link'}
                    aria-label="Share Link"
                  >
                    <Share2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          background: '#ffffff',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '18px',
          padding: '40px 20px',
          marginBottom: '32px'
        }}>
          <AlertCircle size={44} color="#0284c7" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
            {isTa ? 'எந்த இணையதளமும் பொருந்தவில்லை' : 'No Official Weblinks Found'}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '0 auto 16px' }}>
            {isTa
              ? `"${query}" என்ற பெயரில் அதிகாரப்பூர்வ இணைப்புகள் எதுவும் கிடைக்கவில்லை. எழுத்துப் பிழையைச் சரிபார்க்கவும்.`
              : `No verified official links matched "${query}". Please check your search term or reset filters.`}
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              minHeight: '44px'
            }}
          >
            <RefreshCw size={16} /> {isTa ? `அனைத்து ${allWebLinks.length} இணைப்புகளையும் காட்டுக` : `Show All ${allWebLinks.length} Links`}
          </button>
        </div>
      )}

      {/* 6. OFFICIAL DISCLAIMER & SECURITY NOTICE */}
      <div style={{
        background: '#fffbeb',
        border: '1.5px solid #fde68a',
        borderLeft: '5px solid #f59e0b',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <ShieldCheck size={26} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12.5px', color: '#78350f', lineHeight: 1.6 }}>
          <strong style={{ display: 'block', fontSize: '13.5px', color: '#92400e', marginBottom: '4px', fontWeight: 800 }}>
            ⚠️ {isTa ? 'அதிகாரப்பூர்வ அரசு இணையதள வழிகாட்டுதல் & எச்சரிக்கை (Official Disclaimer):' : 'Official Portal Security & Advisory Notice:'}
          </strong>
          {isTa ? (
            <span>
              இந்த இணைப்புகள் தமிழ்நாடு அரசு மற்றும் மத்திய அரசின் அனைத்து 38 மாவட்டங்கள் மற்றும் கல்வி/சேவை துறைகளின் நேரடி அதிகாரப்பூர்வ இணையதளங்கள் (Official Portals). <strong>விண்ணப்பக் கடைசித் தேதி, தகுதி வரம்புகள், கட்டணங்கள் மற்றும் அறிவிப்புகளை</strong> அந்தந்த அதிகாரப்பூர்வ இணையதளத்தில் நேரடியாகச் சரிபார்த்துக்கொள்ளவும்.
            </span>
          ) : (
            <span>
              These links direct solely to legitimate Central/State Government, all 38 District Administrations and statutory institution portals. Please verify <strong>application deadlines, guidelines, fees and notices</strong> directly on the respective official portals.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
