import { useState, useEffect } from 'react';
import { BriefcaseBusiness, CalendarDays, GraduationCap, ExternalLink, FileText, Search, Download, Trash2, Plus, X, Check, ShieldAlert } from 'lucide-react';
import { saveLiveQueueCloud, deleteNotificationCloud } from '../utils/firebaseService';

export function parseDateString(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

export function getDateStatus(openingDateStr, closingDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closingDate = parseDateString(closingDateStr);
  const openingDate = parseDateString(openingDateStr);

  if (closingDate) {
    closingDate.setHours(23, 59, 59, 999);
    if (today > closingDate) {
      return { code: 'closed', label: 'Closed / முடிந்தது', tagClass: 'status-badge-closed', isClosed: true };
    }
  }

  if (openingDate) {
    openingDate.setHours(0, 0, 0, 0);
    if (today < openingDate) {
      return { code: 'upcoming', label: 'New Opening / விரைவில்', tagClass: 'status-badge-upcoming', isClosed: false };
    }
  }

  return { code: 'open', label: 'Open / விண்ணப்பிக்கலாம்', tagClass: 'status-badge-open', isClosed: false };
}

export function getExamStatus(examDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = parseDateString(examDateStr);
  if (examDate) {
    examDate.setHours(23, 59, 59, 999);
    if (today > examDate) {
      return { code: 'closed', label: 'Exam Over / முடிந்தது', tagClass: 'status-badge-closed', isClosed: true };
    }
  }
  return { code: 'open', label: 'Upcoming Exam / வரவிருக்கிறது', tagClass: 'status-badge-open', isClosed: false };
}

export const initialJobData = [
  {
    id: 'job-1',
    service: "TNPSC Combined Technical Services Examination (Degree Level)",
    qualification: "Any Degree / B.E / B.Tech",
    posts: "26",
    openingDate: "30/06/2026",
    closingDate: "29/07/2026",
    detailsLink: "https://drive.google.com/file/d/1YaQW3WCVY7_QGzPOXuWxIEdLqrdloytI/view?usp=sharing",
    applyLink: "https://apply.tnpscexams.in/apply-now?app_id=UElZMDAwMDAwMQ=="
  },
  {
    id: 'job-2',
    service: "RRB Technician Recruitment 2026",
    qualification: "ITI, Diploma, B.E / B.Tech, B.Sc",
    posts: "6565",
    openingDate: "30/06/2026",
    closingDate: "29/07/2026",
    detailsLink: "https://drive.google.com/file/d/1WKhiqrw1BPi3yU5E92nLVrs33zRPhPRC/view?usp=sharing",
    applyLink: "https://www.rrbapply.gov.in/#/auth/landing"
  },
  {
    id: 'job-3',
    service: "TNPSC Combined Technical Services Examination (Diploma / ITI Level)",
    qualification: "ITI / DIPLOMA / B.E / B.TECH",
    posts: "839",
    openingDate: "17/07/2026",
    closingDate: "15/08/2026",
    detailsLink: "https://drive.google.com/file/d/1Ua399DASWc-y6ntRRLDOM4Kwr6PjsyrK/view?usp=sharing",
    applyLink: "https://apply.tnpscexams.in/apply-now?app_id=UElZMDAwMDAwMQ=="
  },
  {
    id: 'job-4',
    service: "SSC CGL (Combined Graduate Level) Examination 2026",
    qualification: "Any Bachelor's Degree",
    posts: "17727",
    openingDate: "24/06/2026",
    closingDate: "27/07/2026",
    detailsLink: "https://ssc.gov.in/",
    applyLink: "https://ssc.gov.in/login"
  },
  {
    id: 'job-5',
    service: "TNUSRB Police Constable & Sub Inspector Recruitment",
    qualification: "10th / 12th / Any Graduation",
    posts: "3359",
    openingDate: "01/08/2026",
    closingDate: "31/08/2026",
    detailsLink: "https://www.tnusrb.tn.gov.in/",
    applyLink: "https://www.tnusrb.tn.gov.in/"
  },
  {
    id: 'job-6',
    service: "TNPSC Group 4 Examination 2026",
    qualification: "10th SSLC Passed",
    posts: "6244",
    openingDate: "30/01/2026",
    closingDate: "28/02/2026",
    detailsLink: "https://www.tnpsc.gov.in/",
    applyLink: "https://apply.tnpscexams.in/"
  }
];

export const initialExamData = [
  {
    id: 'exam-1',
    service: "TNPSC Combined Technical Services Exam (Diploma Level)",
    examDate: "12/09/2026",
    hallTicketLink: "https://apply.tnpscexams.in/"
  },
  {
    id: 'exam-2',
    service: "RRB Technician CBT-1 Online Examination",
    examDate: "18/10/2026",
    hallTicketLink: "https://www.rrbapply.gov.in/"
  },
  {
    id: 'exam-3',
    service: "SSC CGL Tier-I Computer Based Examination",
    examDate: "09/09/2026",
    hallTicketLink: "https://ssc.gov.in/"
  },
  {
    id: 'exam-4',
    service: "TNEA Engineering Counselling & Rank List Release",
    examDate: "10/08/2026",
    hallTicketLink: "https://www.tneaonline.org/"
  },
  {
    id: 'exam-5',
    service: "TNUSRB Police Constable Written Examination",
    examDate: "25/08/2026",
    hallTicketLink: "https://www.tnusrb.tn.gov.in/"
  },
  {
    id: 'exam-6',
    service: "TNPSC Group 4 Preliminary Examination 2026",
    examDate: "09/06/2026",
    hallTicketLink: "https://www.tnpsc.gov.in/"
  }
];

export const initialEducationData = [
  {
    id: 'edu-1',
    institution: "MEDICAL EDUCATION DEPARTMENT",
    courses: "UG - AYURVEDHA, HOMEOPATHY, SIDDHA, UNANI (AYUSH)",
    startDate: "13/07/2026",
    endDate: "31/07/2026",
    detailsLink: "https://drive.google.com/file/d/13J5N-i7G0h-QUADh0Y6YH1V9jFKtu4dL/view?usp=sharing",
    applyLink: "https://tnayushonline.co.in/2026/REG/UGAYUSH/"
  },
  {
    id: 'edu-2',
    institution: "TAMIL NADU PARAMEDICAL DEGREE ADMISSIONS 2026",
    courses: "B.Sc Nursing, B.Pharm, BPT, BOT, B.Sc MLT Degrees",
    startDate: "20/07/2026",
    endDate: "10/08/2026",
    detailsLink: "https://tnmedicalselection.net/",
    applyLink: "https://tnmedicalselection.net/"
  },
  {
    id: 'edu-3',
    institution: "GOVT POLYTECHNIC COLLEGES TAMIL NADU (TNGPTA)",
    courses: "Diploma in Engineering (Civil, Mech, EEE, ECE, CSE)",
    startDate: "15/07/2026",
    endDate: "05/08/2026",
    detailsLink: "https://www.tnpoly.in/",
    applyLink: "https://www.tnpoly.in/"
  },
  {
    id: 'edu-4',
    institution: "TAMIL NADU LAW UNIVERSITY (TNDALU ADMISSIONS)",
    courses: "5-Year Integrated B.A LL.B & 3-Year LL.B Degree",
    startDate: "01/08/2026",
    endDate: "25/08/2026",
    detailsLink: "https://tndalu.ac.in/",
    applyLink: "https://tndalu.ac.in/"
  },
  {
    id: 'edu-5',
    institution: "TNEA - TAMIL NADU ENGINEERING ADMISSIONS",
    courses: "B.E / B.Tech Engineering Degree Counselling",
    startDate: "06/05/2026",
    endDate: "06/06/2026",
    detailsLink: "https://www.tneaonline.org/",
    applyLink: "https://www.tneaonline.org/"
  },
  {
    id: 'edu-6',
    institution: "TNGASA - GOVT ARTS & SCIENCE COLLEGES",
    courses: "B.A, B.Sc, B.Com, B.B.A, B.C.A Undergraduate Courses",
    startDate: "08/05/2026",
    endDate: "24/05/2026",
    detailsLink: "https://www.tngasa.in/",
    applyLink: "https://www.tngasa.in/"
  }
];

export const jobNotificationsData = initialJobData;
export const examScheduleData = initialExamData;
export const educationNotificationsData = initialEducationData;

export default function NotificationTables({ forceAdmin }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoHideExpired, setAutoHideExpired] = useState(true);

  // Dynamic notification lists initialized from default data
  const [jobs, setJobs] = useState(initialJobData);
  const [exams, setExams] = useState(initialExamData);
  const [education, setEducation] = useState(initialEducationData);

  // Admin status check (only true when forceAdmin prop is explicitly true)
  const isAdmin = forceAdmin === true;

  // Automated Next Upcoming Notifications Pipeline
  const upcomingJobsPool = [
    {
      id: 'job-next-1',
      service: "TN Village Administrative Officer (VAO) Group 4 Recruitment 2026",
      qualification: "10th SSLC Pass / Any Graduation",
      posts: "6250",
      openingDate: "05/08/2026",
      closingDate: "05/09/2026",
      detailsLink: "https://www.tnpsc.gov.in/",
      applyLink: "https://apply.tnpscexams.in/"
    },
    {
      id: 'job-next-2',
      service: "India Post Gramin Dak Sevak (GDS) Recruitment Cycle VI",
      qualification: "10th Standard Pass (Maths & English)",
      posts: "38400",
      openingDate: "12/08/2026",
      closingDate: "12/09/2026",
      detailsLink: "https://indiapostgdsonline.gov.in/",
      applyLink: "https://indiapostgdsonline.gov.in/"
    }
  ];

  const upcomingExamsPool = [
    {
      id: 'exam-next-1',
      service: "TNPSC Group 2 & 2A Preliminary Exam 2026",
      examDate: "28/09/2026",
      hallTicketLink: "https://apply.tnpscexams.in/hall-ticket"
    },
    {
      id: 'exam-next-2',
      service: "SSC GD Constable Computer Based Test (CBT)",
      examDate: "15/10/2026",
      hallTicketLink: "https://ssc.gov.in/"
    }
  ];

  const upcomingEduPool = [
    {
      id: 'edu-next-1',
      institution: "TNEA Engineering Lateral Entry Admissions 2026",
      courses: "B.E / B.Tech Direct 2nd Year Admissions",
      startDate: "01/08/2026",
      endDate: "25/08/2026",
      detailsLink: "https://www.tneaonline.org/",
      applyLink: "https://www.tneaonline.org/"
    },
    {
      id: 'edu-next-2',
      institution: "TNGASA Govt Arts & Science College Phase 2 Counselling",
      courses: "All UG Degree Courses (B.A, B.Sc, B.Com)",
      startDate: "05/08/2026",
      endDate: "20/08/2026",
      detailsLink: "https://www.tngasa.in/",
      applyLink: "https://www.tngasa.in/"
    }
  ];

  // Modal State for adding new notification
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryType, setCategoryType] = useState('job'); // 'job', 'exam', 'education'
  const [newTitle, setNewTitle] = useState('');
  const [newQual, setNewQual] = useState('');
  const [newPosts, setNewPosts] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDetailsLink, setNewDetailsLink] = useState('');
  const [newApplyLink, setNewApplyLink] = useState('');

  const saveLists = (updatedJobs, updatedExams, updatedEdu) => {
    setJobs(updatedJobs);
    setExams(updatedExams);
    setEducation(updatedEdu);
  };

  const autoReplenishIfEmpty = (updatedJobs, updatedExams, updatedEdu) => {
    let nextJobs = [...updatedJobs];
    let nextExams = [...updatedExams];
    let nextEdu = [...updatedEdu];

    if (nextJobs.length === 0) {
      nextJobs = [...upcomingJobsPool];
    }
    if (nextExams.length === 0) {
      nextExams = [...upcomingExamsPool];
    }
    if (nextEdu.length === 0) {
      nextEdu = [...upcomingEduPool];
    }

    return { nextJobs, nextExams, nextEdu };
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('இந்த வேலைவாய்ப்பு அறிவிப்பை நீக்க வேண்டுமா? (Delete this notification?)')) {
      const filtered = jobs.filter(item => item.id !== id);
      const { nextJobs, nextExams, nextEdu } = autoReplenishIfEmpty(filtered, exams, education);
      setJobs(nextJobs);
      setExams(nextExams);
      setEducation(nextEdu);
      saveLists(nextJobs, nextExams, nextEdu);
      await deleteNotificationCloud(id);
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('இந்த தேர்வு அறிவிப்பை நீக்க வேண்டுமா? (Delete this exam schedule?)')) {
      const filtered = exams.filter(item => item.id !== id);
      const { nextJobs, nextExams, nextEdu } = autoReplenishIfEmpty(jobs, filtered, education);
      setJobs(nextJobs);
      setExams(nextExams);
      setEducation(nextEdu);
      saveLists(nextJobs, nextExams, nextEdu);
      await deleteNotificationCloud(id);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (window.confirm('இந்த கல்வி அறிவிப்பை நீக்க வேண்டுமா? (Delete this education application?)')) {
      const filtered = education.filter(item => item.id !== id);
      const { nextJobs, nextExams, nextEdu } = autoReplenishIfEmpty(jobs, exams, filtered);
      setJobs(nextJobs);
      setExams(nextExams);
      setEducation(nextEdu);
      saveLists(nextJobs, nextExams, nextEdu);
      await deleteNotificationCloud(id);
    }
  };

  const handleClearExpiredAndAutoAddNext = () => {
    const activeJ = jobs.filter(j => !getDateStatus(j.openingDate, j.closingDate).isClosed);
    const activeE = exams.filter(e => !getExamStatus(e.examDate).isClosed);
    const activeEdu = education.filter(ed => !getDateStatus(ed.startDate, ed.endDate).isClosed);

    // Merge next upcoming entries automatically if empty or reduced
    const mergedJobs = [...activeJ, ...upcomingJobsPool.filter(poolItem => !activeJ.some(x => x.service === poolItem.service))];
    const mergedExams = [...activeE, ...upcomingExamsPool.filter(poolItem => !activeE.some(x => x.service === poolItem.service))];
    const mergedEdu = [...activeEdu, ...upcomingEduPool.filter(poolItem => !activeEdu.some(x => x.institution === poolItem.institution))];

    setJobs(mergedJobs);
    setExams(mergedExams);
    setEducation(mergedEdu);
    saveLists(mergedJobs, mergedExams, mergedEdu);
    alert('🧹 தேதி முடிந்த அறிவிப்புகள் நீக்கப்பட்டு, அடுத்த புதிய அறிவிப்புகள் தானாக சேர்க்கப்பட்டன!');
  };

  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    if (categoryType === 'job') {
      const newItem = {
        id: `job-${Date.now()}`,
        service: newTitle,
        qualification: newQual || 'Any Qualification',
        posts: newPosts || 'Multiple',
        openingDate: newStartDate || new Date().toLocaleDateString('en-IN'),
        closingDate: newEndDate || '31/12/2026',
        detailsLink: newDetailsLink || 'https://www.tn.gov.in/',
        applyLink: newApplyLink || 'https://www.tn.gov.in/'
      };
      const updated = [newItem, ...jobs];
      setJobs(updated);
      saveLists(updated, exams, education);
    } else if (categoryType === 'exam') {
      const newItem = {
        id: `exam-${Date.now()}`,
        service: newTitle,
        examDate: newEndDate || new Date().toLocaleDateString('en-IN'),
        hallTicketLink: newApplyLink || 'https://www.tn.gov.in/'
      };
      const updated = [newItem, ...exams];
      setExams(updated);
      saveLists(jobs, updated, education);
    } else if (categoryType === 'education') {
      const newItem = {
        id: `edu-${Date.now()}`,
        institution: newTitle,
        courses: newQual || 'Undergraduate / Postgraduate Courses',
        startDate: newStartDate || new Date().toLocaleDateString('en-IN'),
        endDate: newEndDate || '31/12/2026',
        detailsLink: newDetailsLink || 'https://www.tn.gov.in/',
        applyLink: newApplyLink || 'https://www.tn.gov.in/'
      };
      const updated = [newItem, ...education];
      setEducation(updated);
      saveLists(jobs, exams, updated);
    }

    // Reset Form
    setNewTitle('');
    setNewQual('');
    setNewPosts('');
    setNewStartDate('');
    setNewEndDate('');
    setNewDetailsLink('');
    setNewApplyLink('');
    setShowAddModal(false);
    alert('🎉 புதிய அறிவிப்பு வெற்றிகரமாக சேர்க்கப்பட்டது!');
  };

  const filterItem = (text, statusObj) => {
    if (autoHideExpired && statusObj.isClosed) return false;
    const matchesQuery = text.toLowerCase().includes(query.toLowerCase());
    if (!matchesQuery) return false;
    if (statusFilter === 'all') return true;
    return statusObj.code === statusFilter;
  };

  const filteredJobs = jobs.filter(item => {
    const status = getDateStatus(item.openingDate, item.closingDate);
    return filterItem(`${item.service} ${item.qualification}`, status);
  });

  const filteredExams = exams.filter(item => {
    const status = getExamStatus(item.examDate);
    return filterItem(`${item.service} ${item.examDate}`, status);
  });

  const filteredEducation = education.filter(item => {
    const status = getDateStatus(item.startDate, item.endDate);
    return filterItem(`${item.institution} ${item.courses}`, status);
  });

  return (
    <div className="notification-tables-wrapper">
      {/* Category Quick Selector & Search */}
      <div className="table-filter-bar" style={{ display: 'grid', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="service-search search-in-tables" style={{ flex: 1, margin: 0 }}>
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 அறிவிப்புகளை தேடவும்... Search notifications, exams & admissions"
            />
            {query && <span className="search-count-pill">Filtering results</span>}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, color: '#b45309', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoHideExpired}
                onChange={(e) => setAutoHideExpired(e.target.checked)}
                style={{ accentColor: '#d97706', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              🚫 தேதி முடிந்தவற்றை தானாக மறை (Auto-Hide Expired)
            </label>

            {isAdmin && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleClearExpiredAndAutoAddNext}
                  title="Clear Expired Notifications and automatically add next upcoming items"
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '9px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)' }}
                >
                  <Trash2 size={15} /> 🧹 தேதி முடிந்தவற்றை நீக்குக (Auto-Clean Expired)
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{ background: '#16a34a', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)' }}
                >
                  <Plus size={16} /> ➕ புதிய அறிவிப்பு சேர்க்க (Add Notification)
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="category-tabs category-table-tabs">
          <button className={activeTab === 'all' ? 'category-active' : ''} onClick={() => setActiveTab('all')}>
            அனைத்து அட்டவணைகள் / All Tables
          </button>
          <button className={activeTab === 'jobs' ? 'category-active' : ''} onClick={() => setActiveTab('jobs')}>
            📢 வேலைவாய்ப்பு ({filteredJobs.length})
          </button>
          <button className={activeTab === 'exams' ? 'category-active' : ''} onClick={() => setActiveTab('exams')}>
            📅 தேர்வு அட்டவணை ({filteredExams.length})
          </button>
          <button className={activeTab === 'education' ? 'category-active' : ''} onClick={() => setActiveTab('education')}>
            🎓 கல்வி விண்ணப்பங்கள் ({filteredEducation.length})
          </button>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="status-filter-pills">
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>நிலையை தேர்ந்தெடுக்கவும் / Filter Status:</span>
          <button className={`status-pill-btn ${statusFilter === 'all' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('all')}>
            📋 அனைத்து அறிவிப்புகள் (All)
          </button>
          <button className={`status-pill-btn ${statusFilter === 'open' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('open')}>
            🟢 தற்போது விண்ணப்பிக்கலாம் (Active Open)
          </button>
          <button className={`status-pill-btn ${statusFilter === 'upcoming' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('upcoming')}>
            ⏳ புதிய அறிவிப்புகள் / விரைவில் (New Opening)
          </button>
          <button className={`status-pill-btn ${statusFilter === 'closed' ? 'pill-active' : ''}`} onClick={() => setStatusFilter('closed')}>
            🔴 முடிந்தது (Closed)
          </button>
        </div>
      </div>

      {/* ADMIN ADD NOTIFICATION MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'grid', placeItems: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px 28px', width: 'min(520px, 94vw)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '16px', top: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
              ➕ புதிய அறிவிப்பு சேர்க்கவும் (Add New Notification)
            </h2>

            <form onSubmit={handleAddNotification} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                அறிவிப்பு வகை (Notification Category):
                <select value={categoryType} onChange={(e) => setCategoryType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}>
                  <option value="job">📢 வேலைவாய்ப்பு அறிவிப்பு (Recruitment Job)</option>
                  <option value="exam">📅 தேர்வு கால அட்டவணை (Exam Schedule & Hall Ticket)</option>
                  <option value="education">🎓 கல்லூரி & பல்கலைக்கழக சேர்க்கை (College Admissions)</option>
                </select>
              </label>

              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                அறிவிப்பு தலைப்பு / Title Name:
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. TNPSC Combined Engineering Services" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
              </label>

              {categoryType !== 'exam' && (
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  கல்வித் தகுதி / படிப்புகள் (Qualification / Courses):
                  <input type="text" value={newQual} onChange={(e) => setNewQual(e.target.value)} placeholder="e.g. B.E / B.Tech / Any Graduation" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                </label>
              )}

              {categoryType === 'job' && (
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  காலிப்பணியிடங்கள் (No. of Posts):
                  <input type="text" value={newPosts} onChange={(e) => setNewPosts(e.target.value)} placeholder="e.g. 1540" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                </label>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  தொடங்கும் தேதி / Start Date:
                  <input type="text" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} placeholder="DD/MM/YYYY" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                </label>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  முடிவடையும் தேதி / End Date:
                  <input type="text" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} placeholder="DD/MM/YYYY" style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                </label>
              </div>

              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                PDF / விவரங்கள் URL (Details Link):
                <input type="url" value={newDetailsLink} onChange={(e) => setNewDetailsLink(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
              </label>

              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                விண்ணப்பிக்கும் URL (Apply Link / Hall Ticket Link):
                <input type="url" value={newApplyLink} onChange={(e) => setNewApplyLink(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
              </label>

              <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
                💾 அறிவிப்பைச் சேமிக்கவும் (Save Notification)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABLE 1: RECRUITMENT NOTIFICATIONS */}
      {(activeTab === 'all' || activeTab === 'jobs') && (
        <section className="tdcsc-table-card green-theme-card" id="recruitment-table">
          <div className="tdcsc-table-header green-header">
            <div className="header-icon-box">
              <BriefcaseBusiness size={22} />
            </div>
            <div>
              <h3>📢 வேலைவாய்ப்பு அறிவிப்புகள் / Recruitment Notifications</h3>
              <p>கீழே உள்ள அறிவிப்புகளைப் பார்க்கவும் / View notifications below</p>
            </div>
          </div>
          <div className="tdcsc-table-scroll">
            <table className="tdcsc-data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>S.No</th>
                  <th>Services / பணி</th>
                  <th>Qualification / தகுதி</th>
                  <th style={{ textAlign: 'center' }}>No of Post / காலிப்பணியிடம்</th>
                  <th style={{ textAlign: 'center' }}>Opening Date</th>
                  <th style={{ textAlign: 'center' }}>Closing Date</th>
                  <th style={{ textAlign: 'center' }}>Status / நிலை</th>
                  <th style={{ textAlign: 'center' }}>Details (PDF/Link)</th>
                  <th style={{ textAlign: 'center' }}>Apply Link</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Admin Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((row, idx) => {
                    const status = getDateStatus(row.openingDate, row.closingDate);
                    return (
                      <tr key={row.id || row.sno || idx}>
                        <td data-label="S.No" style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td data-label="Services / பணி">
                          <strong className="table-service-title">{row.service}</strong>
                        </td>
                        <td data-label="Qualification / தகுதி">
                          <span className="qual-badge">{row.qualification}</span>
                        </td>
                        <td data-label="Vacancies / காலிப்பணியிடம்" style={{ textAlign: 'center' }}>
                          <span className="post-count-chip">{row.posts}</span>
                        </td>
                        <td data-label="Opening Date" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.openingDate}</td>
                        <td data-label="Closing Date" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {status.isClosed ? (
                            <span className="closing-date-tag-expired">{row.closingDate}</span>
                          ) : (
                            <span className="closing-date-tag">{row.closingDate}</span>
                          )}
                        </td>
                        <td data-label="Status / நிலை" style={{ textAlign: 'center' }}>
                          <span className={status.tagClass}>{status.label}</span>
                        </td>
                        <td data-label="Details Link" style={{ textAlign: 'center' }}>
                          {row.detailsLink ? (
                            <a href={row.detailsLink} target="_blank" rel="noreferrer" className="tdcsc-btn btn-details-green">
                              <FileText size={14} /> 📄 View Details
                            </a>
                          ) : '—'}
                        </td>
                        <td data-label="Apply Link" style={{ textAlign: 'center' }}>
                          {status.isClosed ? (
                            <span className="tdcsc-btn btn-closed">❌ Closed / முடிந்தது</span>
                          ) : row.applyLink ? (
                            <a href={row.applyLink} target="_blank" rel="noreferrer" className="tdcsc-btn btn-apply-orange">
                              <ExternalLink size={14} /> 📝 Apply Now
                            </a>
                          ) : '—'}
                        </td>
                        {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => handleDeleteJob(row.id)}
                              style={{ background: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={13} /> நீக்கு
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? "10" : "9"} className="empty-table-msg">
                      வேலைவாய்ப்பு அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No active job notifications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TABLE 2: EXAM SCHEDULE & HALL TICKET */}
      {(activeTab === 'all' || activeTab === 'exams') && (
        <section className="tdcsc-table-card orange-theme-card" id="exam-table">
          <div className="tdcsc-table-header orange-header">
            <div className="header-icon-box">
              <CalendarDays size={22} />
            </div>
            <div>
              <h3>📅 தேர்வு கால அட்டவணை / Exam Schedule & Hall Ticket</h3>
              <p>தேர்வு தேதிகள் மற்றும் ஹால் டிக்கெட் இணைப்பு</p>
            </div>
          </div>
          <div className="tdcsc-table-scroll">
            <table className="tdcsc-data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>S.No</th>
                  <th>Services / தேர்வு பெயர்</th>
                  <th style={{ textAlign: 'center' }}>Exam Date / தேர்வு தேதி</th>
                  <th style={{ textAlign: 'center' }}>Status / நிலை</th>
                  <th style={{ textAlign: 'center' }}>Hall Ticket Download Link</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Admin Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((row, idx) => {
                    const status = getExamStatus(row.examDate);
                    return (
                      <tr key={row.id || row.sno || idx}>
                        <td data-label="S.No" style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td data-label="Services / தேர்வு">
                          <strong className="table-service-title">{row.service}</strong>
                        </td>
                        <td data-label="Exam Date / தேர்வு தேதி" style={{ textAlign: 'center' }}>
                          <span className="exam-date-badge">📅 {row.examDate}</span>
                        </td>
                        <td data-label="Status / நிலை" style={{ textAlign: 'center' }}>
                          <span className={status.tagClass}>{status.label}</span>
                        </td>
                        <td data-label="Hall Ticket Link" style={{ textAlign: 'center' }}>
                          {status.isClosed ? (
                            <span className="tdcsc-btn btn-closed">Completed</span>
                          ) : row.hallTicketLink ? (
                            <a href={row.hallTicketLink} target="_blank" rel="noreferrer" className="tdcsc-btn btn-ticket-blue">
                              <Download size={14} /> 🎫 Download Hall Ticket
                            </a>
                          ) : '—'}
                        </td>
                        {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => handleDeleteExam(row.id)}
                              style={{ background: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={13} /> நீக்கு
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? "6" : "5"} className="empty-table-msg">
                      தேர்வு அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No active exam schedules found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TABLE 3: EDUCATION APPLICATION NOTIFICATIONS */}
      {(activeTab === 'all' || activeTab === 'education') && (
        <section className="tdcsc-table-card purple-theme-card" id="education-table">
          <div className="tdcsc-table-header purple-header">
            <div className="header-icon-box">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3>🎓 கல்லூரி மற்றும் பல்கலைக்கழகம் விண்ணப்பங்களுக்கான அறிவிப்புகள்</h3>
              <p>EDUCATION APPLICATION NOTIFICATIONS</p>
            </div>
          </div>
          <div className="tdcsc-table-scroll">
            <table className="tdcsc-data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>S.No</th>
                  <th>Institution Name</th>
                  <th>Courses</th>
                  <th style={{ textAlign: 'center' }}>Start Date</th>
                  <th style={{ textAlign: 'center' }}>End Date</th>
                  <th style={{ textAlign: 'center' }}>Status / நிலை</th>
                  <th style={{ textAlign: 'center' }}>Details (Notification)</th>
                  <th style={{ textAlign: 'center' }}>Apply Link</th>
                  {isAdmin && <th style={{ textAlign: 'center' }}>Admin Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEducation.length > 0 ? (
                  filteredEducation.map((row, idx) => {
                    const status = getDateStatus(row.startDate, row.endDate);
                    return (
                      <tr key={row.id || row.sno || idx}>
                        <td data-label="S.No" style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td data-label="Institution / நிறுவனம்">
                          <strong className="table-institution-title">{row.institution}</strong>
                        </td>
                        <td data-label="Courses / படிப்புகள்">
                          <span className="course-text-desc">{row.courses}</span>
                        </td>
                        <td data-label="Start Date" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.startDate}</td>
                        <td data-label="End Date" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {status.isClosed ? (
                            <span className="closing-date-tag-expired">{row.endDate}</span>
                          ) : (
                            <span className="closing-date-tag">{row.endDate}</span>
                          )}
                        </td>
                        <td data-label="Status / நிலை" style={{ textAlign: 'center' }}>
                          <span className={status.tagClass}>{status.label}</span>
                        </td>
                        <td data-label="Details Link" style={{ textAlign: 'center' }}>
                          {row.detailsLink ? (
                            <a href={row.detailsLink} target="_blank" rel="noreferrer" className="tdcsc-btn btn-details-blue">
                              <FileText size={14} /> 📄 Notification
                            </a>
                          ) : '—'}
                        </td>
                        <td data-label="Apply Link" style={{ textAlign: 'center' }}>
                          {status.isClosed ? (
                            <span className="tdcsc-btn btn-closed">❌ Closed / முடிந்தது</span>
                          ) : row.applyLink ? (
                            <a href={row.applyLink} target="_blank" rel="noreferrer" className="tdcsc-btn btn-apply-purple">
                              <ExternalLink size={14} /> 📝 Apply Now
                            </a>
                          ) : '—'}
                        </td>
                        {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => handleDeleteEdu(row.id)}
                              style={{ background: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={13} /> நீக்கு
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? "9" : "8"} className="empty-table-msg">
                      கல்வி விண்ணப்ப அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No active education applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
