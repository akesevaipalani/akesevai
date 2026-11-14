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
  AlertCircle,
  Calendar,
  Hourglass,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import {
  fetchNotificationsCloud,
  saveNotificationCloud,
  deleteNotificationCloud,
  syncBankingNotificationsCloud,
  subscribeNotificationsCloud,
  fetchPendingNotificationsCloud,
  fetchQuarantinedNotificationsCloud,
  fetchIngestionStatusCloud,
  approveNotificationCloud,
  rejectNotificationCloud,
  triggerIngestionJobCloud
} from '../utils/dataService';
import { INITIAL_NOTIFICATIONS } from '../data/initialNotifications';
import {
  getKolkataToday,
  calculateApplicationStatus,
  calculateExamStatus,
  formatDisplayDate,
  validateNotificationDateForm,
  enrichNotificationWithDateStatus,
  parseDateToComponents,
  getNotificationUiLabels,
  normalizeLanguage
} from '../utils/notificationDateHelper';

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
  if (c.includes('other')) return 'other';
  return cat;
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
  psu: { label: 'பொதுத்துறை & தொழில்முறை (PSU & Technical)', icon: Cpu, color: '#0284c7', bg: '#f0f9ff' },
  other: { label: 'பிற தேர்வுகள் (Other Govt Jobs)', icon: Sparkles, color: '#64748b', bg: '#f8fafc' }
};

export default function NotificationTables({ forceAdmin, lang = 'ta' }) {
  const resolvedLang = normalizeLanguage(lang);
  const ui = getNotificationUiLabels(resolvedLang);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active_app' | 'upcoming_exams' | 'app_closed' | 'exam_completed' | 'updates'
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
  const today = useMemo(() => getKolkataToday(), []);

  // Admin Ingestion, Quarantine & Telemetry States
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [quarantinedNotifications, setQuarantinedNotifications] = useState([]);
  const [showPendingQueue, setShowPendingQueue] = useState(false);
  const [showQuarantineQueue, setShowQuarantineQueue] = useState(false);
  const [showTelemetryPanel, setShowTelemetryPanel] = useState(false);
  const [ingestionTelemetry, setIngestionTelemetry] = useState(null);
  const [ingestionReport, setIngestionReport] = useState(null);

  const loadAdminIngestionQueues = () => {
    if (!isAdmin) return;
    fetchPendingNotificationsCloud().then((data) => {
      if (Array.isArray(data)) setPendingNotifications(data);
    }).catch(() => {});
    fetchQuarantinedNotificationsCloud().then((data) => {
      if (Array.isArray(data)) setQuarantinedNotifications(data);
    }).catch(() => {});
    fetchIngestionStatusCloud().then((status) => {
      if (status && status.status === 'ok') setIngestionTelemetry(status);
    }).catch(() => {});
  };

  // Load pending, quarantined, and source health telemetry when in Admin Mode
  useEffect(() => {
    loadAdminIngestionQueues();
  }, [isAdmin]);

  const handleApprovePending = async (id) => {
    try {
      const res = await approveNotificationCloud(id);
      if (res?.success) {
        setPendingNotifications((prev) => prev.filter((p) => p.id !== id));
        setQuarantinedNotifications((prev) => prev.filter((q) => q.id !== id));
        const fresh = await fetchNotificationsCloud();
        if (Array.isArray(fresh) && fresh.length > 0) setNotifications(fresh);
        setSyncMessage(
          resolvedLang === 'en'
            ? '✅ Notification approved and published to the live board.'
            : '✅ புதிய அறிவிப்பு வெற்றிகரமாக அங்கீகரிக்கப்பட்டு நேரலை தளத்தில் வெளியிடப்பட்டது!'
        );
      } else {
        alert(res?.message || (resolvedLang === 'en' ? 'Approval failed' : 'ஒப்புதல் அளிப்பதில் பிழை'));
      }
    } catch (e) {
      alert((resolvedLang === 'en' ? 'Approval failed: ' : 'ஒப்புதல் அளிப்பதில் பிழை: ') + e.message);
    }
  };

  const handleRejectPending = async (id) => {
    if (
      window.confirm(
        resolvedLang === 'en'
          ? 'Reject this notification and store it in rejection suppression memory?'
          : 'இந்த அறிவிப்பை நிராகரிக்க விரும்புகிறீர்களா? (Reject and store in suppression memory?)'
      )
    ) {
      try {
        await rejectNotificationCloud(id);
        setPendingNotifications((prev) => prev.filter((p) => p.id !== id));
        setQuarantinedNotifications((prev) => prev.filter((q) => q.id !== id));
        setSyncMessage(
          resolvedLang === 'en'
            ? 'ℹ️ Notification rejected and saved to Rejection Memory.'
            : 'ℹ️ அறிவிப்பு நிராகரிக்கப்பட்டு தற்காலிக நினைவகத்தில் (Rejection Memory) சேமிக்கப்பட்டது.'
        );
      } catch (e) {
        alert((resolvedLang === 'en' ? 'Rejection failed: ' : 'நிராகரிப்பதில் பிழை: ') + e.message);
      }
    }
  };

  const handleRunIngestion = async () => {
    setIsSyncing(true);
    setSyncMessage(
      resolvedLang === 'en'
        ? '⏳ Scanning official portals for new notifications...'
        : '⏳ அனைத்து அரசு தளங்களிலும் புதிய அறிவிப்புகள் தானாகத் தேடப்படுகின்றன (Scanning official sources)...'
    );
    try {
      const res = await triggerIngestionJobCloud();
      if (res?.success) {
        setIngestionReport(res.summary);
        setSyncMessage(
          resolvedLang === 'en'
            ? `✅ Automated scan completed! New: ${res.summary?.newRecordsInserted || 0}, Duplicates skipped: ${res.summary?.duplicatesSkipped || 0}`
            : `✅ தானியங்கி ஸ்கேன் நிறைவடைந்தது! புதியவை: ${res.summary?.newRecordsInserted || 0}, நகல்கள்: ${res.summary?.duplicatesSkipped || 0}`
        );
        loadAdminIngestionQueues();
        const freshPending = await fetchPendingNotificationsCloud();
        setPendingNotifications(freshPending || []);
        if (freshPending && freshPending.length > 0) {
          setShowPendingQueue(true);
        }
      } else {
        setSyncMessage(
          resolvedLang === 'en'
            ? '⚠️ Error running automated scan.'
            : '⚠️ தானியங்கி ஸ்கேன் செய்வதில் பிழை ஏற்பட்டது.'
        );
      }
    } catch (err) {
      setSyncMessage((resolvedLang === 'en' ? '⚠️ Scan error: ' : '⚠️ ஸ்கேன் பிழை: ') + err.message);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 6000);
    }
  };

  // Real-time MongoDB notifications subscription & safe read-only fetch on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchNotificationsCloud();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        } else if (isMounted && isAdmin && (!data || data.length === 0)) {
          // Only admins trigger master feed sync when DB is empty; public users stay strictly read-only
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
  }, [isAdmin]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    try {
      if (isAdmin) {
        const res = await syncBankingNotificationsCloud();
        if (res?.success) {
          setSyncMessage(ui.syncSuccessAdmin(res.count));
        }
      } else {
        // Public users strictly use read-only GET /api/notifications (zero 403 write calls)
        setSyncMessage(ui.syncSuccessPublic);
      }
      const fresh = await fetchNotificationsCloud();
      if (Array.isArray(fresh) && fresh.length > 0) {
        setNotifications(fresh);
      }
    } catch (err) {
      setSyncMessage(ui.syncError);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 4500);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm(ui.deleteConfirm)) {
      await deleteNotificationCloud(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // Form Validation Preview for Admin
  const adminValidation = useMemo(() => {
    return validateNotificationDateForm(formData.openingDate, formData.closingDate, formData.examDate, { lang: resolvedLang });
  }, [formData.openingDate, formData.closingDate, formData.examDate, resolvedLang]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service.trim()) return;

    if (!adminValidation.isValid) {
      alert(adminValidation.errors.join('\n'));
      return;
    }

    const notifPayload = {
      id: `notif-${Date.now()}`,
      category: formData.category,
      organization: formData.organization || 'Official Govt Agency',
      service: formData.service,
      postName: formData.postName || formData.service,
      qualification: formData.qualification || 'Any Graduation / Relevant Qualification',
      ageLimit: formData.ageLimit || 'As per official rules',
      posts: formData.posts || 'Multiple Vacancies',
      openingDate: formData.openingDate || today.displayDate,
      closingDate: formData.closingDate || '31-12-2026',
      examDate: formData.examDate || '',
      applicationFee: formData.applicationFee || 'Official Fee',
      notificationDate: formData.openingDate || today.displayDate,
      importantDetails: formData.importantDetails || 'Official Verified Government Exam Notification',
      detailsLink: formData.detailsLink || 'https://www.india.gov.in/',
      applyLink: formData.applyLink || 'https://www.india.gov.in/',
      isVerified: true,
      source: 'Verified Admin Entry',
      isNew: true,
      ingestionStatus: 'published',
      ingestionSource: 'manual_admin'
    };

    await saveNotificationCloud(notifPayload);
    setNotifications((prev) => [notifPayload, ...prev]);
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
    Object.keys(CATEGORY_CONFIG).forEach((k) => {
      if (k !== 'all') {
        res[k] = notifications.filter((n) => normalizeCategory(n.category) === k).length;
      }
    });
    return res;
  }, [notifications]);

  // Enriched & Filtered Notifications
  const filteredNotifications = useMemo(() => {
    const rawList = notifications && notifications.length > 0 ? notifications : INITIAL_NOTIFICATIONS;

    // 1. Enrich every notification with live computed statuses
    const enrichedList = rawList.map((item) => enrichNotificationWithDateStatus(item, today, { lang: resolvedLang }));

    // 2. Filter list
    let list = enrichedList.filter((item) => {
      // Category filter
      if (activeCategory !== 'all') {
        const itemNorm = normalizeCategory(item.category);
        if (itemNorm !== activeCategory) return false;
      }

      // Auto-hide expired applications ONLY if exam is also completed or not scheduled
      if (autoHideExpired && item.appStatus.isExpired && (item.examStatus.isCompleted || !item.examStatus.isUpcoming)) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active_app' && !item.appStatus.isOpen) return false;
      if (statusFilter === 'upcoming_exams' && !item.examStatus.isUpcoming && !item.examStatus.isToday) return false;
      if (statusFilter === 'app_closed' && !item.appStatus.isExpired) return false;
      if (statusFilter === 'exam_completed' && !item.examStatus.isCompleted) return false;
      if (statusFilter === 'updates') {
        const hasUpdateKeywords = `${item.service} ${item.importantDetails || ''}`.toLowerCase();
        const isUpdate = Boolean(
          item.resultStatus?.isPublished ||
          hasUpdateKeywords.includes('result') ||
          hasUpdateKeywords.includes('admit') ||
          hasUpdateKeywords.includes('hall ticket') ||
          hasUpdateKeywords.includes('answer key') ||
          item.examStatus.isCompleted
        );
        if (!isUpdate) return false;
      }

      // Search Query filter
      if (query.trim()) {
        const matchText = `${item.service} ${item.organization || ''} ${item.postName || ''} ${item.qualification || ''} ${item.importantDetails || ''} ${item.category || ''} ${item.formattedExamDate} ${item.formattedClosingDate}`.toLowerCase();
        if (!matchText.includes(query.toLowerCase())) return false;
      }

      return true;
    });

    // Intelligent Fallback if autoHideExpired yielded 0
    if (list.length === 0 && !query.trim() && autoHideExpired) {
      list = enrichedList.filter((item) => {
        if (activeCategory !== 'all') {
          return normalizeCategory(item.category) === activeCategory;
        }
        return true;
      });
    }

    // 3. Smart Sorting:
    // Priority 1: Open applications (closing soonest first)
    // Priority 2: Upcoming exams
    // Priority 3: Future applications
    // Priority 4: Closed / Completed
    return list.sort((a, b) => {
      // Both open: sort by nearest closing deadline
      if (a.appStatus.isOpen && b.appStatus.isOpen) {
        return (a.appStatus.daysRemaining || 999) - (b.appStatus.daysRemaining || 999);
      }
      if (a.appStatus.isOpen !== b.appStatus.isOpen) {
        return a.appStatus.isOpen ? -1 : 1;
      }
      // Both have upcoming exams: sort by nearest exam
      if (a.examStatus.isUpcoming && b.examStatus.isUpcoming) {
        return (a.examStatus.daysRemaining || 999) - (b.examStatus.daysRemaining || 999);
      }
      if (a.examStatus.isUpcoming !== b.examStatus.isUpcoming) {
        return a.examStatus.isUpcoming ? -1 : 1;
      }
      // Both closed: sort by newest notification first
      return (b.updatedAt ? new Date(b.updatedAt) : 0) - (a.updatedAt ? new Date(a.updatedAt) : 0);
    });
  }, [notifications, activeCategory, statusFilter, autoHideExpired, query, today, resolvedLang]);

  return (
    <div className="notification-tables-wrapper" data-lang={resolvedLang} style={{ marginTop: '16px', maxWidth: '1440px', marginInline: 'auto' }}>
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'grid',
          gap: '16px'
        }}
      >
        {/* Title & Live Feed Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ font: '800 20px/1.3 Manrope, sans-serif', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{ui.pageTitle}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #86efac',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🟢</span> <span>{ui.liveFeedBadge}</span>
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              {ui.pageSubtitle}
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
              <span>{isSyncing ? ui.syncing : (isAdmin ? ui.syncMaster : ui.refreshFeed)}</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={handleRunIngestion}
                  disabled={isSyncing}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
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
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  <Sparkles size={16} /> <span>{ui.runIngestion}</span>
                </button>

                <button
                  onClick={() => setShowPendingQueue(!showPendingQueue)}
                  style={{
                    background: pendingNotifications.length > 0 ? '#fef3c7' : '#f8fafc',
                    color: pendingNotifications.length > 0 ? '#b45309' : '#475569',
                    border: pendingNotifications.length > 0 ? '1px solid #fde68a' : '1px solid #cbd5e1',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{ui.pendingApprovals}</span>
                  <span
                    style={{
                      background: pendingNotifications.length > 0 ? '#ea580c' : '#64748b',
                      color: '#ffffff',
                      borderRadius: '20px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 900
                    }}
                  >
                    {pendingNotifications.length}
                  </span>
                </button>

                <button
                  onClick={() => setShowQuarantineQueue(!showQuarantineQueue)}
                  style={{
                    background: quarantinedNotifications.length > 0 ? '#fee2e2' : '#f8fafc',
                    color: quarantinedNotifications.length > 0 ? '#b91c1c' : '#475569',
                    border: quarantinedNotifications.length > 0 ? '1px solid #fca5a5' : '1px solid #cbd5e1',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ShieldAlert size={15} /> <span>{ui.quarantineBtn} ({quarantinedNotifications.length})</span>
                </button>

                <button
                  onClick={() => setShowTelemetryPanel(!showTelemetryPanel)}
                  style={{
                    background: showTelemetryPanel ? '#e0f2fe' : '#f8fafc',
                    color: '#0369a1',
                    border: '1px solid #bae6fd',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Info size={15} /> <span>{ui.sourceHealthBtn}</span>
                </button>

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
                  <Plus size={16} /> <span>{ui.addNotificationBtn}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {syncMessage && (
          <div
            style={{
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} color="#16a34a" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Admin Ingestion Quarantine Queue Panel */}
        {isAdmin && showQuarantineQueue && (
          <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '16px', padding: '18px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#991b1b' }}>
                {ui.quarantineQueueTitle} {quarantinedNotifications.length})
              </h3>
              <button onClick={() => setShowQuarantineQueue(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#991b1b' }}>
                <X size={18} />
              </button>
            </div>
            {quarantinedNotifications.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', textAlign: 'center', color: '#15803d', fontWeight: 700, fontSize: '12.5px' }}>
                {ui.quarantineQueueEmpty}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {quarantinedNotifications.map((qItem) => (
                  <div key={qItem.id} style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>{qItem.service}</div>
                      <div style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 700, marginTop: '4px' }}>
                        Reason: {qItem.quarantineReason || 'LOW_TRUST_OR_SUSPICIOUS'} • Score: {qItem.trustScore ?? 0}/100
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApprovePending(qItem.id)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{ui.approveOverrideBtn}</button>
                      <button onClick={() => handleRejectPending(qItem.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{ui.rejectOverrideBtn}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Ingestion Source Health & Safety Telemetry Panel */}
        {isAdmin && showTelemetryPanel && ingestionTelemetry && (
          <div style={{ background: '#f0f9ff', border: '2px solid #bae6fd', borderRadius: '16px', padding: '18px', display: 'grid', gap: '10px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#0369a1', fontSize: '14px' }}>
                📡 Persistent Source Health Telemetry (Auto-Publish: {ingestionTelemetry.safetyFlags?.autoPublishEnabled ? 'ON' : 'OFF (Safe Mode)'})
              </strong>
              <button onClick={() => setShowTelemetryPanel(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0369a1' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', color: '#0c4a6e', fontWeight: 700 }}>
              <span>Published: {ingestionTelemetry.counts?.published ?? 0}</span>
              <span>Pending: {ingestionTelemetry.counts?.pending ?? 0}</span>
              <span>Quarantined: {ingestionTelemetry.counts?.quarantined ?? 0}</span>
              <span>Rejected Memory: {ingestionTelemetry.counts?.rejected ?? 0}</span>
              <span>Fencing Token: #{ingestionTelemetry.lockState?.fencingToken ?? 0}</span>
            </div>
            {Array.isArray(ingestionTelemetry.sourceHealth) && ingestionTelemetry.sourceHealth.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {ingestionTelemetry.sourceHealth.map((sh) => (
                  <div key={sh.sourceKey} style={{ background: '#ffffff', border: '1px solid #e0f2fe', padding: '8px 10px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{sh.sourceKey}</div>
                    <div style={{ fontSize: '11px', color: sh.lastStatus === 'ok' ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                      Status: {sh.lastStatus} • Failures: {sh.consecutiveFailures || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Ingestion Pending Review Approval Queue Panel */}
        {isAdmin && showPendingQueue && (
          <div
            style={{
              background: '#fffbeb',
              border: '2px solid #fde68a',
              borderRadius: '16px',
              padding: '20px',
              display: 'grid',
              gap: '14px',
              boxShadow: '0 4px 16px rgba(217, 119, 6, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{ui.pendingQueueTitle}</span>
                  <span style={{ background: '#ea580c', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                    {pendingNotifications.length} {ui.pendingQueueCount}
                  </span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b45309' }}>
                  {ui.pendingQueueDesc}
                </p>
              </div>
              <button
                onClick={() => setShowPendingQueue(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#b45309' }}
              >
                <X size={20} />
              </button>
            </div>

            {pendingNotifications.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', textAlign: 'center', color: '#15803d', fontWeight: 700, fontSize: '13px' }}>
                {ui.pendingQueueEmpty}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                {pendingNotifications.map((cand) => (
                  <div
                    key={cand.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #fed7aa',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px' }}>
                          {cand.category?.toUpperCase() || 'EXAM'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{cand.organization}</span>
                        {cand.notificationNo && (
                          <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 700 }}>#{cand.notificationNo}</span>
                        )}
                        {typeof cand.trustScore === 'number' && (
                          <span style={{ fontSize: '11px', fontWeight: 800, background: cand.trustScore >= 85 ? '#dcfce7' : '#e0f2fe', color: cand.trustScore >= 85 ? '#15803d' : '#0369a1', padding: '2px 8px', borderRadius: '6px' }}>
                            Trust: {cand.trustScore}/100 ({cand.docVerificationStatus || 'unverified'})
                          </span>
                        )}
                        {cand.hasCorrigendum && (
                          <span style={{ fontSize: '11px', fontWeight: 800, background: '#f3e8ff', color: '#7e22ce', padding: '2px 8px', borderRadius: '6px' }}>
                            Corrigendum Proposal
                          </span>
                        )}
                      </div>
                      {cand.corrigendumSummary && (
                        <div style={{ fontSize: '11.5px', color: '#7e22ce', fontWeight: 700, marginBottom: '4px' }}>
                          {cand.corrigendumSummary}
                        </div>
                      )}
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', marginBottom: '6px' }}>
                        {cand.service}
                      </div>
                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px', color: '#475569' }}>
                        <span>📅 {ui.openingDateLabel} <strong>{cand.openingDate || (resolvedLang === 'en' ? 'Announced Soon' : 'அறிவிக்கப்படும்')}</strong></span>
                        <span>⏳ {ui.closingDateLabel} <strong>{cand.closingDate || (resolvedLang === 'en' ? 'Announced Soon' : 'அறிவிக்கப்படும்')}</strong></span>
                        {cand.detailsLink && (
                          <a href={cand.detailsLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span>{ui.pdfDetailsBtn}</span> <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleApprovePending(cand.id)}
                        style={{
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                        }}
                      >
                        <Check size={14} /> <span>{ui.approveBtn}</span>
                      </button>

                      <button
                        onClick={() => handleRejectPending(cand.id)}
                        style={{
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: '1px solid #fca5a5',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={14} /> <span>{ui.rejectBtn}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Bar & Auto-Hide Option */}
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
              placeholder={ui.searchPlaceholder}
            />
            {query && <span className="search-count-pill">{filteredNotifications.length} {ui.resultsCountSuffix}</span>}
          </div>

          <label
            htmlFor="notifications-autohide-expired"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '9px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#b45309',
              cursor: 'pointer'
            }}
          >
            <input
              id="notifications-autohide-expired"
              name="autohide_expired"
              type="checkbox"
              checked={autoHideExpired}
              onChange={(e) => setAutoHideExpired(e.target.checked)}
              style={{ accentColor: '#d97706', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>{ui.hideFinished}</span>
          </label>
        </div>

        {/* 2. CATEGORY SELECTOR CHIPS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'thin' }}>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isSelected = activeCategory === key;
            const count = counts[key] || 0;
            const catLabel = ui.categories?.[key] || cfg.label;

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
                <span>{catLabel}</span>
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

        {/* 3. DUAL-STATUS SMART FILTER PILLS */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
            paddingTop: '6px',
            borderTop: '1px solid #f1f5f9'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>{ui.filterHeading}</span>

          <button
            className={`status-pill-btn ${statusFilter === 'all' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            {ui.filterAll}
          </button>

          <button
            className={`status-pill-btn ${statusFilter === 'active_app' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('active_app')}
            style={statusFilter === 'active_app' ? { background: '#15803d', color: '#ffffff', borderColor: '#15803d' } : {}}
          >
            {ui.filterActiveApp}
          </button>

          <button
            className={`status-pill-btn ${statusFilter === 'upcoming_exams' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('upcoming_exams')}
            style={statusFilter === 'upcoming_exams' ? { background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' } : {}}
          >
            {ui.filterUpcomingExam}
          </button>

          <button
            className={`status-pill-btn ${statusFilter === 'app_closed' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('app_closed')}
            style={statusFilter === 'app_closed' ? { background: '#dc2626', color: '#ffffff', borderColor: '#dc2626' } : {}}
          >
            {ui.filterAppClosed}
          </button>

          <button
            className={`status-pill-btn ${statusFilter === 'exam_completed' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('exam_completed')}
          >
            {ui.filterExamCompleted}
          </button>

          <button
            className={`status-pill-btn ${statusFilter === 'updates' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('updates')}
          >
            {ui.filterUpdates}
          </button>
        </div>
      </div>

      {/* 4. NOTIFICATION CARDS GRID */}
      <div style={{ marginTop: '20px' }}>
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              background: '#ffffff',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '20px',
              padding: '50px 20px',
              color: '#64748b'
            }}
          >
            <Building2 size={48} color="#94a3b8" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#334155', margin: '0 0 8px' }}>
              {ui.emptyTitle}
            </h3>
            <p style={{ fontSize: '13px', margin: '0 0 20px', maxWidth: '500px', marginInline: 'auto' }}>
              {ui.emptySubtitle}
            </p>
            <button
              onClick={handleManualSync}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '11px 22px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {isAdmin ? ui.syncAllAction : ui.refreshAction}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredNotifications.map((notif) => {
              const catCfg = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.all;
              const Icon = catCfg.icon || Building2;
              const isNew = notif.isNew === true;
              const appSt = notif.appStatus;
              const examSt = notif.examStatus;
              const resSt = notif.resultStatus;
              const needsReview = notif.needsAdminReview === true;

              return (
                <div
                  key={notif.id}
                  className="notification-card govt-job-card notification-row-card"
                  data-category={notif.category}
                  data-id={notif.id}
                  data-app-status={notif.applicationStatus}
                  data-exam-status={notif.examStatusCode}
                  data-result-status={notif.resultStatusCode}
                  style={{
                    background: '#ffffff',
                    border: needsReview
                      ? '1.5px solid #f59e0b'
                      : (notif.canShowApplyCta ? '1.5px solid #86efac' : (examSt.isUpcoming ? '1.5px solid #bae6fd' : '1.5px solid #e2e8f0')),
                    borderRadius: '20px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: notif.canShowApplyCta ? '0 8px 24px rgba(22, 163, 74, 0.08)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
                    position: 'relative',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Organization Badge & Tags */}
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

                        {isNew && (
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

                      {notif.notificationDate && (
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                          {ui.publishedPrefix} {notif.formattedNotificationDate}
                        </span>
                      )}
                    </div>

                    {/* Notification Title */}
                    <h3 style={{ font: '800 16px/1.35 Manrope, sans-serif', color: '#0f172a', margin: '0 0 8px' }}>
                      {notif.service}
                    </h3>

                    {/* Post Name & Posts Count */}
                    {notif.postName && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#0284c7',
                          fontWeight: 800,
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span>🎯 {notif.postName}</span>
                        {notif.posts && (
                          <span style={{ color: '#047857', background: '#d1fae5', padding: '2px 8px', borderRadius: '8px', fontSize: '11px' }}>
                            {notif.posts}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Key Details Box */}
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        margin: '10px 0',
                        fontSize: '12px',
                        color: '#334155',
                        display: 'grid',
                        gap: '5px'
                      }}
                    >
                      <div>
                        <strong>🎓 {ui.qualificationLabel}</strong> {notif.qualification || 'Any Graduation'}
                      </div>
                      {notif.ageLimit && (
                        <div style={{ color: '#475569' }}>
                          <strong>⏳ {ui.ageLimitLabel}</strong> {notif.ageLimit}
                        </div>
                      )}
                      {notif.applicationFee && (
                        <div style={{ color: '#64748b', fontSize: '11.5px' }}>
                          <strong>💳 {ui.feeLabel}</strong> {notif.applicationFee}
                        </div>
                      )}
                      {notif.importantDetails && (
                        <div style={{ color: '#475569', fontSize: '11.5px', marginTop: '2px', lineHeight: 1.4, borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                          ℹ️ {notif.importantDetails}
                        </div>
                      )}
                    </div>

                    {/* 3-TILE CLEAR DATE GRID */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '11.5px',
                        margin: '14px 0 10px'
                      }}
                    >
                      {/* Tile 1: Application Start Date */}
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '8px 10px',
                          borderRadius: '10px'
                        }}
                      >
                        <span style={{ color: '#64748b', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} color="#0284c7" /> {ui.openingDateLabel}
                        </span>
                        <strong style={{ color: '#0f172a', fontSize: '12.5px', marginTop: '2px', display: 'block' }}>
                          {notif.formattedOpeningDate}
                        </strong>
                      </div>

                      {/* Tile 2: Application Closing Date */}
                      <div
                        style={{
                          background: appSt.isExpired ? '#fef2f2' : (appSt.isLastDay ? '#fffbeb' : (appSt.isInvalid || appSt.hasMissingDeadline ? '#fff7ed' : '#f0fdf4')),
                          border: `1px solid ${appSt.isExpired ? '#fecaca' : (appSt.isLastDay ? '#fde68a' : (appSt.isInvalid || appSt.hasMissingDeadline ? '#fed7aa' : '#bbf7d0'))}`,
                          padding: '8px 10px',
                          borderRadius: '10px'
                        }}
                      >
                        <span
                          style={{
                            color: appSt.tagColor || '#15803d',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Clock size={11} /> {appSt.hasExtendedDeadline ? ui.extendedClosingDateLabel : ui.closingDateLabel}
                        </span>
                        <strong
                          style={{
                            color: appSt.tagColor || '#15803d',
                            fontSize: '12.5px',
                            marginTop: '2px',
                            display: 'block'
                          }}
                        >
                          {notif.formattedClosingDate}
                        </strong>
                        {appSt.hasExtendedDeadline && notif.formattedOriginalClosingDate && (
                          <span style={{ display: 'block', fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                            {ui.originalClosingDateLabel} {notif.formattedOriginalClosingDate}
                          </span>
                        )}
                      </div>

                      {/* Tile 3: Exam Date (Spans Full Width) */}
                      <div
                        style={{
                          gridColumn: '1 / -1',
                          background: examSt.isToday ? '#fff7ed' : (examSt.isUpcoming ? '#f0f9ff' : (examSt.isCompleted || examSt.isInvalid ? '#fef2f2' : '#f8fafc')),
                          border: `1px solid ${examSt.isToday ? '#ffedd5' : (examSt.isUpcoming ? '#bae6fd' : (examSt.isCompleted || examSt.isInvalid ? '#fecaca' : '#e2e8f0'))}`,
                          padding: '9px 12px',
                          borderRadius: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '6px'
                        }}
                      >
                        <div>
                          <span
                            style={{
                              color: examSt.isToday ? '#ea580c' : (examSt.isUpcoming ? '#0369a1' : '#64748b'),
                              fontSize: '11px',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CalendarDays size={13} /> {ui.examDateLabel}
                          </span>
                          <strong
                            style={{
                              color: examSt.isToday ? '#c2410c' : (examSt.isUpcoming ? '#0c4a6e' : '#334155'),
                              fontSize: '13px',
                              marginTop: '2px',
                              display: 'block'
                            }}
                          >
                            {notif.formattedExamDate}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* INDEPENDENT TRIPLE-STATUS LIVE BADGES & COUNTDOWN CONTAINER */}
                    <div
                      style={{
                        display: 'grid',
                        gap: '6px',
                        background: '#fafafa',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        margin: '10px 0'
                      }}
                    >
                      {/* 1. Application Status Pill & Countdown */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: appSt.tagBg,
                            color: appSt.tagColor,
                            border: `1px solid ${appSt.tagBorder}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {appSt.label}
                        </span>

                        <span style={{ fontSize: '11px', fontWeight: 800, color: appSt.tagColor }}>
                          {appSt.countdown}
                        </span>
                      </div>

                      {/* 2. Exam Status Pill & Countdown */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: examSt.tagBg,
                            color: examSt.tagColor,
                            border: `1px solid ${examSt.tagBorder}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {examSt.label}
                        </span>

                        <span style={{ fontSize: '11px', fontWeight: 800, color: examSt.tagColor }}>
                          {examSt.countdown}
                        </span>
                      </div>

                      {/* 3. Independent Verified Result Status Row */}
                      {resSt && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: resSt.tagBg,
                              color: resSt.tagColor,
                              border: `1px solid ${resSt.tagBorder}`,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {resSt.label}
                          </span>
                          {resSt.isPublished && resSt.resultLink && (
                            <a
                              href={resSt.resultLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', textDecoration: 'underline' }}
                            >
                              {ui.viewResultLink}
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* DATE INCONSISTENCY / ADMIN REVIEW WARNING BANNER */}
                    {needsReview && notif.dateConsistency?.warnings?.length > 0 && (
                      <div
                        role="alert"
                        data-testid="admin-date-review-warning"
                        style={{
                          background: '#fffbeb',
                          border: '1px solid #f59e0b',
                          color: '#92400e',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          lineHeight: 1.45,
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}
                      >
                        <ShieldAlert size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div>{notif.dateConsistency.warnings[0]}</div>
                          {appSt.isOpen && !notif.canShowApplyCta && (
                            <div style={{ fontSize: '10.5px', color: '#b45309', marginTop: '3px' }}>
                              {ui.adminReviewPausedNote}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS & OFFICIAL LINKS */}
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'grid', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      {/* Official PDF / Details Button */}
                      {notif.detailsLink && (
                        <a
                          href={notif.detailsLink}
                          target="_blank"
                          rel="noopener noreferrer"
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
                          <FileText size={14} /> <span>{ui.pdfDetailsBtn}</span>
                        </a>
                      )}

                      {/* Official Apply CTA — strictly gated by application OPEN + safe URL + date consistency */}
                      {notif.applyCtaState === 'ACTIVE' ? (
                        <a
                          href={notif.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1.3,
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
                          <span>{ui.applyNowBtn}</span> <ExternalLink size={14} />
                        </a>
                      ) : (
                        <button
                          disabled
                          style={{
                            flex: 1.3,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: notif.applyCtaState === 'NEEDS_REVIEW_DISABLED' ? '#fef3c7' : '#f1f5f9',
                            color: notif.applyCtaState === 'NEEDS_REVIEW_DISABLED' ? '#92400e' : '#94a3b8',
                            border: notif.applyCtaState === 'NEEDS_REVIEW_DISABLED' ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'not-allowed'
                          }}
                        >
                          <span>
                            {notif.applyCtaState === 'NEEDS_REVIEW_DISABLED'
                              ? ui.applyPendingReviewBtn
                              : (appSt.isExpired
                                ? ui.applyClosedBtn
                                : (appSt.status === 'NOT_STARTED' ? ui.applyNotStartedBtn : ui.applyDateUnverifiedBtn))}
                          </span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          title="Delete notification"
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            padding: '9px',
                            borderRadius: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* Reference-only official URL when application is CLOSED (never an active Apply CTA) */}
                    {appSt.isExpired && notif.hasVerifiedReferenceApplyUrl && (
                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                        <span>{ui.referenceFooterLabel}</span>
                        <a
                          href={notif.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#475569', fontWeight: 700, textDecoration: 'underline' }}
                        >
                          {ui.referenceFooterAction}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. ADMIN ADD NOTIFICATION MODAL (WITH LIVE DATE VALIDATION & PREVIEW) */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px 28px',
              width: 'min(620px, 94vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
              {ui.modalTitle}
            </h2>

            {/* Live Admin Date Validation Warnings / Errors */}
            {adminValidation.errors.length > 0 && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  color: '#991b1b',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                {adminValidation.errors.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}

            {adminValidation.warnings.length > 0 && (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  color: '#92400e',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                {adminValidation.warnings.map((warn, i) => (
                  <div key={i}>{warn}</div>
                ))}
              </div>
            )}

            {/* Live Status Calculation Preview */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                padding: '10px 14px',
                borderRadius: '10px',
                marginBottom: '14px',
                fontSize: '12px',
                display: 'grid',
                gap: '4px'
              }}
            >
              <div style={{ fontWeight: 800, color: '#0369a1' }}>
                {ui.modalLivePreview}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>{ui.modalAppPrefix}</span>
                <span style={{ fontWeight: 800, color: adminValidation.appStatus.tagColor }}>
                  {adminValidation.appStatus.label} ({adminValidation.appStatus.countdown})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>{ui.modalExamPrefix}</span>
                <span style={{ fontWeight: 800, color: adminValidation.examStatus.tagColor }}>
                  {adminValidation.examStatus.label} ({adminValidation.examStatus.countdown})
                </span>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label htmlFor="modal-notif-category" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                {ui.modalCategory}
                <select
                  id="modal-notif-category"
                  name="notification_category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}
                >
                  <option value="banking">🏦 {ui.categories?.banking || 'Banking & Finance'}</option>
                  <option value="upsc">🏛️ {ui.categories?.upsc || 'UPSC / Central Govt'}</option>
                  <option value="ssc">📑 {ui.categories?.ssc || 'SSC'}</option>
                  <option value="railway">🚆 {ui.categories?.railway || 'Railway / RRB'}</option>
                  <option value="tnpsc">🏢 {ui.categories?.tnpsc || 'TNPSC / State Govt'}</option>
                  <option value="police_defence">👮 {ui.categories?.police_defence || 'Police & Defence'}</option>
                  <option value="teaching">👨‍🏫 {ui.categories?.teaching || 'Teaching & TET'}</option>
                  <option value="medical">🏥 {ui.categories?.medical || 'Medical & Health'}</option>
                  <option value="entrance">🎓 {ui.categories?.entrance || 'Entrance Exams'}</option>
                  <option value="psu">🏭 {ui.categories?.psu || 'PSU & Technical'}</option>
                </select>
              </label>

              <label htmlFor="modal-notif-organization" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                {ui.modalOrg}
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
                {ui.modalTitleField}
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
                  {ui.modalPostName}
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
                  {ui.modalPosts}
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
                  {ui.modalQualification}
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
                  {ui.modalAgeLimit}
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

              {/* DATES SECTION (DD-MM-YYYY OR YYYY-MM-DD) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-opening-date" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {ui.modalOpeningDate}
                  <input
                    id="modal-notif-opening-date"
                    name="notification_opening_date"
                    type="text"
                    value={formData.openingDate}
                    onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                    placeholder="01-08-2026"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-closing-date" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {ui.modalClosingDate}
                  <input
                    id="modal-notif-closing-date"
                    name="notification_closing_date"
                    type="text"
                    value={formData.closingDate}
                    onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                    placeholder="30-09-2026"
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label htmlFor="modal-notif-exam-date" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {ui.modalExamDate}
                  <input
                    id="modal-notif-exam-date"
                    name="notification_exam_date"
                    type="text"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    placeholder={resolvedLang === 'en' ? '15-11-2026 or November 2026' : '15-11-2026 அல்லது November 2026'}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }}
                  />
                </label>
                <label htmlFor="modal-notif-fee" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {ui.modalFee}
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
                {ui.modalDetails}
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
                  {ui.modalPdfUrl}
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
                  {ui.modalApplyUrl}
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
                disabled={!adminValidation.isValid}
                style={{
                  background: adminValidation.isValid
                    ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                    : '#94a3b8',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: adminValidation.isValid ? 'pointer' : 'not-allowed',
                  marginTop: '8px'
                }}
              >
                {ui.modalSaveBtn}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
