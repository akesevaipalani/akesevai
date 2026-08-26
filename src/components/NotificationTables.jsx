import { useState, useEffect, useMemo } from 'react';
import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  ExternalLink,
  FileText,
  Search,
  Download,
  Trash2,
  Plus,
  X,
  Check,
  ShieldAlert,
  Landmark,
  RefreshCw,
  Clock,
  Building2,
  Award,
  Sparkles,
  Train,
  Shield,
  Stethoscope,
  BookOpen,
  Cpu,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  fetchNotificationsCloud,
  saveNotificationCloud,
  deleteNotificationCloud,
  syncBankingNotificationsCloud,
  subscribeNotificationsCloud
} from '../utils/dataService';
import { INITIAL_NOTIFICATIONS } from '../data/initialNotifications';

export function normalizeCategory(cat) {
  if (!cat) return 'all';
  const c = String(cat).toLowerCase().replace(/[^a-z]/g, '');
  if (c.includes('bank')) return 'banking';
  if (c.includes('upsc') || c.includes('central') || c.includes('ias')) return 'upsc';
  if (c.includes('ssc') || c.includes('cgl') || c.includes('chsl')) return 'ssc';
  if (c.includes('rail') || c.includes('rrb') || c.includes('rrc')) return 'railway';
  if (c.includes('tnpsc') || c.includes('state') || c.includes('vao')) return 'tnpsc';
  if (c.includes('police') || c.includes('defence') || c.includes('army') || c.includes('tnusrb')) return 'police_defence';
  if (c.includes('teach') || c.includes('trb') || c.includes('tet') || c.includes('school')) return 'teaching';
  if (c.includes('med') || c.includes('nurse') || c.includes('mrb') || c.includes('doctor') || c.includes('health') || c.includes('hospital')) return 'medical';
  if (c.includes('enter') || c.includes('entrance') || c.includes('jee') || c.includes('neet') || c.includes('cuet') || c.includes('gate') || c.includes('tancet')) return 'entrance';
  if (c.includes('psu') || c.includes('iocl') || c.includes('ongc') || c.includes('bhel') || c.includes('tneb') || c.includes('tech')) return 'psu';
  return cat;
}

export function parseDateString(dateStr) {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  // Handle DD/MM/YYYY
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  // Handle YYYY-MM-DD
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  return null;
}

export function getDateStatus(openingDateStr, closingDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closingDate = parseDateString(closingDateStr);
  const openingDate = parseDateString(openingDateStr);

  if (closingDate) {
    closingDate.setHours(23, 59, 59, 999);
    if (today > closingDate) {
      return { code: 'closed', label: 'முடிந்தது (Closed)', tagClass: 'status-badge-closed', isClosed: true };
    }
  }

  if (openingDate) {
    openingDate.setHours(0, 0, 0, 0);
    if (today < openingDate) {
      return { code: 'upcoming', label: 'விரைவில் (Upcoming)', tagClass: 'status-badge-upcoming', isClosed: false };
    }
  }

  return { code: 'open', label: 'விண்ணப்பிக்கலாம் (Open)', tagClass: 'status-badge-open', isClosed: false };
}

// Category Configuration with Icons & Colors
const CATEGORY_CONFIG = {
  all: { label: 'அனைத்து தேர்வுகள் (All)', icon: Sparkles, color: '#3b82f6', bg: '#eff6ff' },
  banking: { label: 'வங்கி & நிதி (Banking)', icon: Landmark, color: '#0284c7', bg: '#f0f9ff' },
  upsc: { label: 'மத்திய அரசு (UPSC / Central)', icon: Building2, color: '#7c3aed', bg: '#f5f3ff' },
  ssc: { label: 'பணியாளர் தேர்வாணையம் (SSC)', icon: BriefcaseBusiness, color: '#d97706', bg: '#fffbeb' },
  railway: { label: 'ரயில்வே (Railway / RRB)', icon: Train, color: '#dc2626', bg: '#fef2f2' },
  tnpsc: { label: 'தமிழ்நாடு அரசு (TNPSC / State)', icon: Award, color: '#16a34a', bg: '#f0fdf4' },
  police_defence: { label: 'காவல்துறை / ராணுவம் (Police & Defence)', icon: Shield, color: '#0f766e', bg: '#f0fdfa' },
  teaching: { label: 'ஆசிரியர் பணி (Teaching & TET)', icon: BookOpen, color: '#9333ea', bg: '#faf5ff' },
  medical: { label: 'மருத்துவம் & நர்சிங் (Medical & Health)', icon: Stethoscope, color: '#e11d48', bg: '#fff1f2' },
  entrance: { label: 'நுழைவுத் தேர்வுகள் (Entrance Exams)', icon: GraduationCap, color: '#4f46e5', bg: '#eef2ff' },
  psu: { label: 'பொதுத்துறை & தொழில்முறை (PSU & Technical)', icon: Cpu, color: '#0284c7', bg: '#f0f9ff' }
};

export default function NotificationTables({ forceAdmin, lang = 'ta' }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoHideExpired, setAutoHideExpired] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Admin Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'banking',
    organization: '',
    service: '',
    postName: '',
    qualification: '',
    ageLimit: '18 - 30 Years',
    posts: '',
    openingDate: '',
    closingDate: '',
    examDate: '',
    applicationFee: '₹100',
    detailsLink: '',
    applyLink: '',
    importantDetails: ''
  });

  const isAdmin = forceAdmin === true;

  // Real-time MongoDB notifications subscription & Auto-Sync on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchNotificationsCloud();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        } else if (isMounted && (!data || data.length === 0)) {
          // Trigger automatic background master sync if DB was empty
          syncBankingNotificationsCloud().then(async () => {
            const fresh = await fetchNotificationsCloud();
            if (isMounted && Array.isArray(fresh) && fresh.length > 0) {
              setNotifications(fresh);
            }
          });
        }
      } catch (e) {}
    };

    loadData();

    const unsub = subscribeNotificationsCloud((liveNotifs) => {
      if (isMounted && Array.isArray(liveNotifs) && liveNotifs.length > 0) {
        setNotifications(liveNotifs);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    try {
      const res = await syncBankingNotificationsCloud(); // Calls POST /api/notifications/sync-all
      if (res?.success) {
        setSyncMessage(`✅ ${res.count || 'அனைத்து'} அரசு & போட்டித் தேர்வு அறிவிப்புகள் MongoDB Atlas-ல் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!`);
        const fresh = await fetchNotificationsCloud();
        if (Array.isArray(fresh) && fresh.length > 0) {
          setNotifications(fresh);
        }
      }
    } catch (err) {
      setSyncMessage('⚠️ புதுப்பித்தலில் பிழை ஏற்பட்டது.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 4500);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('இந்த அறிவிப்பை நீக்க வேண்டுமா? (Delete this notification?)')) {
      await deleteNotificationCloud(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service.trim()) return;

    const notifPayload = {
      id: `notif-${Date.now()}`,
      category: formData.category,
      organization: formData.organization || 'Official Govt Agency',
      service: formData.service,
      postName: formData.postName || formData.service,
      qualification: formData.qualification || 'Any Graduation / Relevant Qualification',
      ageLimit: formData.ageLimit || 'As per official rules',
      posts: formData.posts || 'Multiple Vacancies',
      openingDate: formData.openingDate || new Date().toLocaleDateString('en-IN'),
      closingDate: formData.closingDate || '31/12/2026',
      examDate: formData.examDate || 'Announced Soon',
      applicationFee: formData.applicationFee || 'Official Fee',
      notificationDate: formData.openingDate || new Date().toLocaleDateString('en-IN'),
      importantDetails: formData.importantDetails || 'Official Verified Government Exam Notification',
      detailsLink: formData.detailsLink || 'https://www.india.gov.in/',
      applyLink: formData.applyLink || 'https://www.india.gov.in/',
      isVerified: true,
      source: 'Verified Admin Entry',
      isNew: true,
      status: 'active'
    };

    await saveNotificationCloud(notifPayload);
    setNotifications(prev => [notifPayload, ...prev]);
    setShowAddModal(false);
    setFormData({
      category: 'banking',
      organization: '',
      service: '',
      postName: '',
      qualification: '',
      ageLimit: '18 - 30 Years',
      posts: '',
      openingDate: '',
      closingDate: '',
      examDate: '',
      applicationFee: '₹100',
      detailsLink: '',
      applyLink: '',
      importantDetails: ''
    });
  };

  // Category counts with normalization
  const counts = useMemo(() => {
    const res = { all: notifications.length };
    Object.keys(CATEGORY_CONFIG).forEach(k => {
      if (k !== 'all') {
        res[k] = notifications.filter(n => normalizeCategory(n.category) === k).length;
      }
    });
    return res;
  }, [notifications]);

  // Filtered & Smart Sorted Notifications (Active/Upcoming First)
  const filteredNotifications = useMemo(() => {
    let list = (notifications && notifications.length > 0 ? notifications : INITIAL_NOTIFICATIONS).filter(item => {
      // 1. Normalized Category Filter
      if (activeCategory !== 'all') {
        const itemNorm = normalizeCategory(item.category);
        if (itemNorm !== activeCategory) return false;
      }

      // 2. Status Calculation
      const statusObj = getDateStatus(item.openingDate, item.closingDate);
      if (autoHideExpired && statusObj.isClosed) return false;
      if (statusFilter !== 'all') {
        if (statusFilter === 'open' && statusObj.code !== 'open') return false;
        if (statusFilter === 'upcoming' && statusObj.code !== 'upcoming') return false;
        if (statusFilter === 'closed' && !statusObj.isClosed) return false;
      }

      // 3. Search Query Filter
      if (query.trim()) {
        const matchText = `${item.service} ${item.organization || ''} ${item.postName || ''} ${item.qualification || ''} ${item.importantDetails || ''} ${item.category || ''}`.toLowerCase();
        if (!matchText.includes(query.toLowerCase())) return false;
      }

      return true;
    });

    // Intelligent Fallback: If autoHideExpired caused 0 results in an active category, relax it to show all available
    if (list.length === 0 && !query.trim() && autoHideExpired) {
      list = (notifications && notifications.length > 0 ? notifications : INITIAL_NOTIFICATIONS).filter(item => {
        if (activeCategory !== 'all') {
          return normalizeCategory(item.category) === activeCategory;
        }
        return true;
      });
    }

    // Sort: Active & Upcoming First, Expired Last
    return list.sort((a, b) => {
      const statusA = getDateStatus(a.openingDate, a.closingDate);
      const statusB = getDateStatus(b.openingDate, b.closingDate);
      if (statusA.isClosed !== statusB.isClosed) {
        return statusA.isClosed ? 1 : -1;
      }
      return 0;
    });
  }, [notifications, activeCategory, statusFilter, autoHideExpired, query]);

  return (
    <div className="notification-tables-wrapper" style={{ marginTop: '16px', maxWidth: '1440px', marginInline: 'auto' }}>
      
      {/* 1. TOP HEADER & SEARCH CONTROLS */}
      <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 18px rgba(0,0,0,0.03)', display: 'grid', gap: '16px' }}>
        
        {/* Title & Live Status Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ font: '800 20px/1.3 Manrope, sans-serif', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📢 அனைத்து அரசு & போட்டித் தேர்வு நேரலை அறிவிப்புகள்</span>
              <span style={{ fontSize: '11px', fontWeight: 800, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 10px', borderRadius: '20px' }}>
                🟢 நேரடி அதிகாரப்பூர்வ Feed
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              UPSC, SSC, வங்கி, ரயில்வே, TNPSC, காவல்துறை, ஆசிரியர் பணி, மருத்துவம் மற்றும் நுழைவுத் தேர்வுகள் உடனுக்குடன் தானாகப் புதுப்பிக்கப்படுகிறது.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'புதுப்பிக்கிறது...' : '🔄 அறிவிப்புகளைப் புதுப்பி (Sync All Exams)'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                }}
              >
                <Plus size={16} /> <span>➕ புதிய அறிவிப்பு சேர்க்க (Add)</span>
              </button>
            )}
          </div>
        </div>

        {syncMessage && (
          <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Search Bar & Auto-Hide Filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="service-search search-in-tables" style={{ flex: 1, margin: 0, minWidth: '280px' }}>
            <Search size={18} />
            <input
              id="notifications-search-input"
              name="notifications_search"
              type="text"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 தேர்வுப் பெயர், அமைப்பு (UPSC, TNPSC, SSC, RRB, SBI...), கல்வித் தகுதி தேடவும்..."
            />
            {query && <span className="search-count-pill">{filteredNotifications.length} Results</span>}
          </div>

          <label htmlFor="notifications-autohide-expired" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fffbeb', border: '1px solid #fde68a', padding: '9px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, color: '#b45309', cursor: 'pointer' }}>
            <input
              id="notifications-autohide-expired"
              name="autohide_expired"
              type="checkbox"
              checked={autoHideExpired}
              onChange={(e) => setAutoHideExpired(e.target.checked)}
              style={{ accentColor: '#d97706', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>🚫 கடைசி தேதி முடிந்தவற்றை மறை (Hide Expired)</span>
          </label>
        </div>

        {/* 2. CATEGORY SELECTOR CHIPS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'thin' }}>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isSelected = activeCategory === key;
            const count = counts[key] || 0;

            return (
              <button
                key={key}
                data-category={key}
                className={`category-chip tab-btn ${isSelected ? 'category-active' : ''}`}
                onClick={() => setActiveCategory(key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${cfg.color}` : '1px solid #e2e8f0',
                  background: isSelected ? cfg.color : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontWeight: 800,
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? `0 4px 12px ${cfg.color}33` : 'none'
                }}
              >
                <Icon size={14} />
                <span>{cfg.label}</span>
                <span
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#475569',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. STATUS FILTER PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>தேர்வு நிலை (Status):</span>
          <button className={`status-pill-btn ${statusFilter === 'all' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('all')}>
            📋 அனைத்து நிலைகள் (All)
          </button>
          <button className={`status-pill-btn ${statusFilter === 'open' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('open')}>
            🟢 தற்போது விண்ணப்பிக்கலாம் (Active Open)
          </button>
          <button className={`status-pill-btn ${statusFilter === 'upcoming' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('upcoming')}>
            ⏳ விரைவில் தொடங்கும் (Upcoming)
          </button>
          <button className={`status-pill-btn ${statusFilter === 'closed' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('closed')}>
            🔴 முடிவடைந்தது (Closed / Expired)
          </button>
        </div>
      </div>

      {/* 4. NOTIFICATION CARDS DISPLAY */}
      <div style={{ marginTop: '20px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: '18px', padding: '50px 20px', color: '#64748b' }}>
            <Building2 size={48} color="#94a3b8" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#334155', margin: '0 0 8px' }}>
              அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No Notifications Found
            </h3>
            <p style={{ fontSize: '13px', margin: '0 0 20px', maxWidth: '500px', marginInline: 'auto' }}>
              தேர்ந்தெடுக்கப்பட்ட பிரிவில் அறிவிப்புகள் இல்லை அல்லது கடைசி தேதி முடிந்துவிட்டது. புதிய அறிவிப்புகளைப் பெற கீழே உள்ள பொத்தானை அழுத்தவும்.
            </p>
            <button
              onClick={handleManualSync}
              style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '11px 22px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
            >
              🔄 அனைத்துத் தேர்வுகளையும் உடனே புதுப்பிக்க (Sync Master Feed)
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '18px' }}>
            {filteredNotifications.map((notif) => {
              const statusObj = getDateStatus(notif.openingDate, notif.closingDate);
              const catCfg = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.all;
              const Icon = catCfg.icon || Building2;
              const isNew = notif.isNew === true;

              return (
                <div
                  key={notif.id}
                  className="notification-card govt-job-card notification-row-card"
                  data-category={notif.category}
                  data-id={notif.id}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${statusObj.isClosed ? '#f1f5f9' : (isNew ? '#93c5fd' : '#e2e8f0')}`,
                    borderRadius: '18px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isNew ? '0 8px 24px rgba(59, 130, 246, 0.08)' : '0 4px 14px rgba(0, 0, 0, 0.03)',
                    position: 'relative',
                    opacity: statusObj.isClosed ? 0.75 : 1,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Badges: Category & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: catCfg.bg,
                            color: catCfg.color,
                            border: `1px solid ${catCfg.color}33`,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 800
                          }}
                        >
                          <Icon size={12} />
                          <span>{notif.organization || 'Official Agency'}</span>
                        </span>

                        {isNew && !statusObj.isClosed && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              background: '#ef4444',
                              color: '#ffffff',
                              padding: '3px 8px',
                              borderRadius: '20px',
                              fontSize: '10px',
                              fontWeight: 900,
                              letterSpacing: '0.5px'
                            }}
                          >
                            <Flame size={11} /> NEW
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: statusObj.isClosed ? '#fee2e2' : (statusObj.code === 'upcoming' ? '#fef3c7' : '#dcfce7'),
                          color: statusObj.isClosed ? '#dc2626' : (statusObj.code === 'upcoming' ? '#d97706' : '#15803d'),
                          border: `1px solid ${statusObj.isClosed ? '#fca5a5' : (statusObj.code === 'upcoming' ? '#fde68a' : '#86efac')}`,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {statusObj.label}
                      </span>
                    </div>

                    {/* Exam Name Title */}
                    <h3 style={{ font: '800 16px/1.35 Manrope, sans-serif', color: '#0f172a', margin: '0 0 8px' }}>
                      {notif.service}
                    </h3>

                    {/* Post Name & Posts Count */}
                    {notif.postName && (
                      <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🎯 {notif.postName}</span>
                        {notif.posts && <span style={{ color: '#047857', background: '#d1fae5', padding: '2px 8px', borderRadius: '8px', fontSize: '11px' }}>{notif.posts}</span>}
                      </div>
                    )}

                    {/* Qualification & Age Limit Box */}
                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '10px 0', fontSize: '12px', color: '#334155', display: 'grid', gap: '5px' }}>
                      <div>
                        <strong>🎓 கல்வித் தகுதி:</strong> {notif.qualification || 'Any Graduation'}
                      </div>
                      {notif.ageLimit && (
                        <div style={{ color: '#475569' }}>
                          <strong>⏳ வயது வரம்பு:</strong> {notif.ageLimit}
                        </div>
                      )}
                      {notif.applicationFee && (
                        <div style={{ color: '#64748b', fontSize: '11.5px' }}>
                          <strong>💳 கட்டணம்:</strong> {notif.applicationFee}
                        </div>
                      )}
                      {notif.importantDetails && (
                        <div style={{ color: '#475569', fontSize: '11.5px', marginTop: '2px', lineHeight: 1.4, borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                          ℹ️ {notif.importantDetails}
                        </div>
                      )}
                    </div>

                    {/* Key Dates Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px', color: '#475569', margin: '12px 0' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #f1f5f9', padding: '8px 10px', borderRadius: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '10.5px' }}>தொடங்கும் தேதி:</span><br />
                        <strong style={{ color: '#334155' }}>{notif.openingDate || '-'}</strong>
                      </div>
                      <div style={{ background: statusObj.isClosed ? '#fef2f2' : '#f0fdf4', border: `1px solid ${statusObj.isClosed ? '#fecaca' : '#bbf7d0'}`, padding: '8px 10px', borderRadius: '8px' }}>
                        <span style={{ color: statusObj.isClosed ? '#dc2626' : '#15803d', fontSize: '10.5px', fontWeight: 800 }}>கடைசி தேதி (Last Date):</span><br />
                        <strong style={{ color: statusObj.isClosed ? '#dc2626' : '#15803d' }}>{notif.closingDate || '-'}</strong>
                      </div>
                      {notif.examDate && (
                        <div style={{ gridColumn: '1 / -1', background: '#fefce8', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fef08a', color: '#854d0e', fontWeight: 700, fontSize: '11.5px' }}>
                          📅 தேர்வு தேதி: {notif.examDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Official Links */}
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {notif.detailsLink && (
                      <a
                        href={notif.detailsLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <FileText size={14} /> <span>PDF விவரம்</span>
                      </a>
                    )}

                    {notif.applyLink && !statusObj.isClosed && (
                      <a
                        href={notif.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1.2,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                        }}
                      >
                        <span>விண்ணப்பிக்க</span> <ExternalLink size={14} />
                      </a>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        title="Delete notification"
                        style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '9px', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. ADMIN ADD NOTIFICATION MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'grid', placeItems: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '18px', padding: '24px 28px', width: 'min(580px, 94vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '16px', top: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
              ➕ புதிய தேர்வு / வேலைவாய்ப்பு அறிவிப்பு சேர்க்க
            </h2>

            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label htmlFor="modal-notif-category" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                பிரிவு (Category):
                <select
                  id="modal-notif-category"
                  name="notification_category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}
                >
                  <option value="banking">🏦 வங்கி & நிதி (Banking & Finance)</option>
                  <option value="upsc">🏛️ மத்திய அரசு (UPSC / Central Govt)</option>
                  <option value="ssc">📑 பணியாளர் தேர்வாணையம் (SSC)</option>
                  <option value="railway">🚆 ரயில்வே (Railway / RRB)</option>
                  <option value="tnpsc">🏢 தமிழ்நாடு அரசு (TNPSC / State Govt)</option>
                  <option value="police_defence">👮 காவல்துறை / ராணுவம் (Police & Defence)</option>
                  <option value="teaching">👨‍🏫 ஆசிரியர் பணி (Teaching & TET)</option>
                  <option value="medical">🏥 மருத்துவம் & நர்சிங் (Medical & Health)</option>
                  <option value="entrance">🎓 நுழைவுத் தேர்வுகள் (Entrance Exams)</option>
                  <option value="psu">🏭 பொதுத்துறை & தொழில்முறை (PSU & Technical)</option>
                </select>
              </label>

              <label htmlFor="modal-notif-organization" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                நிறுவனம் / அமைப்பு (Organization):
                <input
                  id="modal-notif-organization"
                  name="notification_organization"
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. UPSC / SSC / TNPSC / SBI / Railway"
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                />
              </label>

              <label htmlFor="modal-notif-service" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                அறிவிப்பு தலைப்பு (Exam / Recruitment Title):
                <input
                  id="modal-notif-service"
                  name="notification_title"
                  type="text"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="e.g. TNPSC Group 4 & VAO Services Examination 2026"
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-post" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  பதவிப் பெயர் (Post Name):
                  <input
                    id="modal-notif-post"
                    name="notification_post"
                    type="text"
                    value={formData.postName}
                    onChange={(e) => setFormData({ ...formData, postName: e.target.value })}
                    placeholder="e.g. VAO / Junior Assistant"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-posts" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  காலிப்பணியிடங்கள் (Posts):
                  <input
                    id="modal-notif-posts"
                    name="notification_posts_count"
                    type="text"
                    value={formData.posts}
                    onChange={(e) => setFormData({ ...formData, posts: e.target.value })}
                    placeholder="e.g. 8932+ Posts"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-qualification" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  கல்வித் தகுதி (Qualification):
                  <input
                    id="modal-notif-qualification"
                    name="notification_qualification"
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. 10th Pass / Degree"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-age" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  வயது வரம்பு (Age Limit):
                  <input
                    id="modal-notif-age"
                    name="notification_age_limit"
                    type="text"
                    value={formData.ageLimit}
                    onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                    placeholder="e.g. 18 - 32 Years"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-opening-date" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  தொடங்கும் தேதி (DD/MM/YYYY):
                  <input
                    id="modal-notif-opening-date"
                    name="notification_opening_date"
                    type="text"
                    value={formData.openingDate}
                    onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                    placeholder="01/08/2026"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-closing-date" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  கடைசி தேதி (DD/MM/YYYY):
                  <input
                    id="modal-notif-closing-date"
                    name="notification_closing_date"
                    type="text"
                    value={formData.closingDate}
                    onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                    placeholder="30/08/2026"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-exam-date" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  தேர்வு தேதி (Exam Date):
                  <input
                    id="modal-notif-exam-date"
                    name="notification_exam_date"
                    type="text"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    placeholder="e.g. October 2026"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-fee" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  விண்ணப்பக் கட்டணம் (Fee):
                  <input
                    id="modal-notif-fee"
                    name="notification_fee"
                    type="text"
                    value={formData.applicationFee}
                    onChange={(e) => setFormData({ ...formData, applicationFee: e.target.value })}
                    placeholder="e.g. ₹100 (SC/ST Nil)"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
              </div>

              <label htmlFor="modal-notif-details" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                முக்கிய விவரங்கள் (Important Details):
                <input
                  id="modal-notif-details"
                  name="notification_details"
                  type="text"
                  value={formData.importantDetails}
                  onChange={(e) => setFormData({ ...formData, importantDetails: e.target.value })}
                  placeholder="e.g. Tamil Eligibility Test + Single Paper OMR Test"
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-pdf-url" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  PDF / அறிவிப்பு URL:
                  <input
                    id="modal-notif-pdf-url"
                    name="notification_pdf_url"
                    type="url"
                    value={formData.detailsLink}
                    onChange={(e) => setFormData({ ...formData, detailsLink: e.target.value })}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-apply-url" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  விண்ணப்பிக்கும் URL:
                  <input
                    id="modal-notif-apply-url"
                    name="notification_apply_url"
                    type="url"
                    value={formData.applyLink}
                    onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                💾 அறிவிப்பை MongoDB Atlas-ல் சேமிக்கவும் (Save Notification)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
