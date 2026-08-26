import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, ExternalLink, Copy, Check, ShieldCheck, Globe, Landmark,
  Building2, GraduationCap, BriefcaseBusiness, IndianRupee, CreditCard,
  Ticket, Bot, Sparkles, School, Layers, CheckCircle2, Award,
  ArrowUpRight, Share2, Filter, RefreshCw, AlertCircle
} from 'lucide-react';
import { allWebLinks, weblinkCategories } from '../data/weblinksData';

export const pageMeta = { id: 'weblink', title: 'Useful Weblinks | 359+ Official Portals' };

const CATEGORY_ICONS = {
  all: Globe,
  state: Landmark,
  central: Building2,
  regular: Layers,
  csc: Award,
  tnega: Landmark,
  recruitment: BriefcaseBusiness,
  entrance: GraduationCap,
  university: School,
  college: GraduationCap,
  loan: IndianRupee,
  bill: CreditCard,
  ticket: Ticket,
  tools: Bot,
  others: Sparkles,
};

const CATEGORY_COLORS = {
  all: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  state: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  central: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  regular: { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' },
  csc: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
  tnega: { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' },
  recruitment: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
  entrance: { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' },
  university: { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' },
  college: { bg: '#fae8ff', text: '#a21caf', border: '#f5d0fe' },
  loan: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
  bill: { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' },
  ticket: { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' },
  tools: { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
  others: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
};

function getDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return 'Official Portal';
  }
}

function getPrimaryCategory(categories) {
  if (!categories || categories.length === 0) return 'others';
  const priority = ['tnega', 'csc', 'recruitment', 'entrance', 'loan', 'bill', 'ticket', 'tools', 'university', 'college', 'state', 'central', 'regular', 'others'];
  for (const p of priority) {
    if (categories.includes(p)) return p;
  }
  return categories[0] || 'others';
}

export default function WeblinkPage({ notify, lang = 'ta' }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const isTa = lang === 'ta';

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('weblink-search-input');
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
        notify(isTa ? `"${item.title}" இணைப்பு நகலெடுக்கப்பட்டது!` : `"${item.title}" link copied to clipboard!`);
      }
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const filteredLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allWebLinks.filter((link) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (!link.categories.includes(selectedCategory)) {
          return false;
        }
      }

      // Query filter
      if (!q) return true;

      const titleMatch = link.title.toLowerCase().includes(q);
      const tamilMatch = link.tamil ? link.tamil.toLowerCase().includes(q) : false;
      const urlMatch = link.url.toLowerCase().includes(q);
      const catMatch = link.categories.some((c) => c.toLowerCase().includes(q));

      return titleMatch || tamilMatch || urlMatch || catMatch;
    });
  }, [query, selectedCategory]);

  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="page-width inner-page weblink-page-wrapper">
      {/* HEADER HERO */}
      <div className="inner-hero weblink-hero">
        <div className="weblink-hero-badge">
          <Globe size={15} />
          <span>{isTa ? '359+ அதிகாரப்பூர்வ இணையதள இணைப்புகள்' : '359+ Verified Official Web Portals'}</span>
        </div>
        <h1 className="weblink-page-title">
          {isTa ? 'பயனுள்ள அரசு மற்றும் பொது இணைய இணைப்புகள்' : 'Official Government & Public Service Weblinks'}
        </h1>
        <p className="weblink-page-subtitle">
          {isTa
            ? 'தமிழ்நாடு அரசு, மத்திய அரசு, டிஜிட்டல் சேவா, இ-சேவை, வேலைவாய்ப்பு, கல்வி, கடனுதவி, மின் கட்டணம் மற்றும் AI கருவிகளுக்கான நேரடி அதிகாரப்பூர்வ இணைப்புகள் ஒரே இடத்தில்.'
            : 'Access Tamil Nadu State Government, Central Government, CSC Digital Seva, TNeGA, Jobs, Admissions, Welfare Schemes & AI Tools directly in one organized directory.'}
        </p>

        {/* STATS QUICK BAR */}
        <div className="weblink-stats-bar">
          <div className="weblink-stat-pill">
            <strong>359+</strong>
            <span>{isTa ? 'மொத்த தளங்கள்' : 'Total Portals'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong>125+</strong>
            <span>{isTa ? 'தமிழ்நாடு அரசு' : 'TN State Govt'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong>68+</strong>
            <span>{isTa ? 'மத்திய அரசு' : 'Central Govt'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong>46+</strong>
            <span>{isTa ? 'CSC சேவைகள்' : 'CSC Portals'}</span>
          </div>
          <div className="weblink-stat-pill">
            <strong>36+</strong>
            <span>{isTa ? 'AI கருவிகள்' : 'AI Tools'}</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND CONTROLS */}
      <div className="weblink-controls-card">
        <div className="weblink-search-bar">
          <Search size={20} className="weblink-search-icon" />
          <input
            id="weblink-search-input"
            name="weblink_search"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isTa ? "🔍 இணையதள பெயர், துறை அல்லது சேவையை தேடவும்... (Press '/' to search)" : "🔍 Search by portal name, department, or keyword... (Press '/' to search)"}
            className="weblink-search-input-field"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="weblink-search-clear-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
          <span className="weblink-count-tag">
            {filteredLinks.length} {isTa ? 'இணைப்புகள்' : 'links'}
          </span>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="weblink-categories-scroll">
          {weblinkCategories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`weblink-cat-btn ${isSelected ? 'active' : ''}`}
              >
                <IconComponent size={15} />
                <span>{isTa ? cat.labelTa : cat.labelEn}</span>
                <span className="weblink-cat-count">{cat.count}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE FILTER STATUS / QUICK RESET */}
        {(query || selectedCategory !== 'all') && (
          <div className="weblink-filter-summary">
            <span>
              {isTa ? 'வடிகட்டப்பட்டது:' : 'Filtered:'}{' '}
              <strong>
                {selectedCategory !== 'all'
                  ? (isTa ? weblinkCategories.find((c) => c.id === selectedCategory)?.labelTa : weblinkCategories.find((c) => c.id === selectedCategory)?.labelEn)
                  : ''}
                {query ? ` "${query}"` : ''}
              </strong>{' '}
              ({filteredLinks.length} {isTa ? 'முடிவுகள்' : 'results'})
            </span>
            <button
              className="weblink-reset-filters-btn"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
            >
              <RefreshCw size={13} /> {isTa ? 'அனைத்தையும் காட்டுக' : 'Reset All Filters'}
            </button>
          </div>
        )}
      </div>

      {/* POPULAR SHORTCUT CHIPS */}
      {!query && selectedCategory === 'all' && (
        <div className="weblink-quick-chips">
          <span className="weblink-chips-label">{isTa ? 'முக்கிய தளங்கள்:' : 'Popular Shortcuts:'}</span>
          {[
            { label: 'TNeGA', q: 'TNeGA' },
            { label: 'CSC Seva', q: 'CSC Services' },
            { label: 'Aadhaar', q: 'Aadhaar' },
            { label: 'TNPDS Ration', q: 'TNPDS' },
            { label: 'Patta Chitta', q: 'Patta Chitta' },
            { label: 'TNPSC', q: 'TNPSC' },
            { label: 'TNEB', q: 'TNEB' },
            { label: 'Voter Portal', q: 'Voter' },
            { label: 'Passport', q: 'Passport' },
            { label: 'AI Tools', q: 'tools' },
          ].map((chip) => (
            <button
              key={chip.label}
              className="weblink-chip-item"
              onClick={() => {
                if (chip.q === 'tools') {
                  setSelectedCategory('tools');
                } else {
                  setQuery(chip.q);
                }
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* RESULTS GRID */}
      {filteredLinks.length > 0 ? (
        <div className="weblink-grid">
          {filteredLinks.map((link) => {
            const primaryCat = getPrimaryCategory(link.categories);
            const FallbackIcon = CATEGORY_ICONS[primaryCat] || ExternalLink;
            const colorScheme = CATEGORY_COLORS[primaryCat] || CATEGORY_COLORS.others;
            const domain = getDomain(link.url);
            const isImgBroken = imageErrorMap[link.id];

            return (
              <div key={link.id} className="weblink-card">
                <div className="weblink-card-header">
                  <div className="weblink-icon-wrap" style={{ borderColor: colorScheme.border }}>
                    {link.icon && !isImgBroken ? (
                      <img
                        src={link.icon}
                        alt={link.title}
                        className="weblink-img-icon"
                        onError={() => handleImageError(link.id)}
                        loading="lazy"
                      />
                    ) : (
                      <span className="weblink-fallback-icon" style={{ color: colorScheme.text, background: colorScheme.bg }}>
                        <FallbackIcon size={20} />
                      </span>
                    )}
                  </div>
                  <div className="weblink-tags-wrap">
                    <span
                      className="weblink-cat-badge"
                      style={{
                        backgroundColor: colorScheme.bg,
                        color: colorScheme.text,
                        borderColor: colorScheme.border,
                      }}
                    >
                      {primaryCat.toUpperCase()}
                    </span>
                    <span className="weblink-domain-badge">{domain}</span>
                  </div>
                </div>

                <div className="weblink-card-body">
                  <h3 className="weblink-card-title" title={link.title}>
                    {link.title}
                  </h3>
                  {link.tamil ? (
                    <p className="weblink-card-tamil">{link.tamil}</p>
                  ) : (
                    <p className="weblink-card-tamil empty-ta">{isTa ? 'அதிகாரப்பூர்வ அரசு இணையதளம்' : 'Official Portal Service'}</p>
                  )}
                </div>

                <div className="weblink-card-actions">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="weblink-open-btn"
                    title={isTa ? `${link.title} தளத்தைத் திறக்கவும்` : `Open ${link.title}`}
                  >
                    <span>{isTa ? 'தளத்தைத் திறக்க' : 'Open Portal'}</span>
                    <ArrowUpRight size={16} />
                  </a>

                  <button
                    onClick={() => handleCopyLink(link)}
                    className={`weblink-copy-btn ${copiedId === link.id ? 'copied' : ''}`}
                    title={isTa ? 'இணைப்பை நகலெடுக்க' : 'Copy link address'}
                    aria-label="Copy Link"
                  >
                    {copiedId === link.id ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="weblink-empty-state">
          <AlertCircle size={44} className="weblink-empty-icon" />
          <h3>{isTa ? 'எந்த இணையதளமும் கிடைக்கவில்லை' : 'No Weblinks Found'}</h3>
          <p>
            {isTa
              ? `"${query}" என்ற பெயரில் இணையதளங்கள் எதுவும் பொருந்தவில்லை. எழுத்துப் பிழையைச் சரிபார்க்கவும் அல்லது கீழே உள்ள பொத்தானைக் கிளிக் செய்து அனைத்தையும் காணவும்.`
              : `No links matched your search "${query}". Try searching with a different keyword or reset filters.`}
          </p>
          <button
            className="button button-primary"
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
          >
            <RefreshCw size={16} /> {isTa ? 'அனைத்து இணைப்புகளையும் காட்டுக' : 'View All 359 Links'}
          </button>
        </div>
      )}

      {/* ADVISORY FOOTNOTE */}
      <div className="weblink-security-advisory">
        <ShieldCheck size={24} className="weblink-advisory-icon" />
        <div className="weblink-advisory-text">
          <strong>
            {isTa
              ? 'அரசு இணையதள பாதுகாப்பு வழிகாட்டுதல் / Official Portal Advisory'
              : 'Official Portal Security Verification'}
          </strong>
          <p>
            {isTa
              ? 'அரசு சார்ந்த சேவைகளுக்குச் செல்லும் போது முகவரி பட்டியில் https:// மற்றும் .gov.in அல்லது .nic.in அல்லது அங்கீகரிக்கப்பட்ட அதிகாரப்பூர்வ முகவரி உள்ளதா என்பதை எப்போதும் உறுதிப்படுத்திக் கொள்ளுங்கள்.'
              : 'Always verify that you are on the legitimate official government domain (.gov.in / .nic.in or verified CSC portal) before entering any sensitive personal credentials.'}
          </p>
        </div>
      </div>
    </section>
  );
}
