import { useState } from 'react';
import { BriefcaseBusiness, CalendarDays, GraduationCap, ExternalLink, FileText, Search, Download, Clock } from 'lucide-react';

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

export const jobNotificationsData = [
  {
    sno: 1,
    service: "TNPSC Combined Technical Services Examination (Degree Level)",
    qualification: "Any Degree / B.E / B.Tech",
    posts: "26",
    openingDate: "30/06/2026",
    closingDate: "29/07/2026",
    detailsLink: "https://drive.google.com/file/d/1YaQW3WCVY7_QGzPOXuWxIEdLqrdloytI/view?usp=sharing",
    applyLink: "https://apply.tnpscexams.in/apply-now?app_id=UElZMDAwMDAwMQ=="
  },
  {
    sno: 2,
    service: "RRB Technician Recruitment 2026",
    qualification: "ITI, Diploma, B.E / B.Tech, B.Sc",
    posts: "6565",
    openingDate: "30/06/2026",
    closingDate: "29/07/2026",
    detailsLink: "https://drive.google.com/file/d/1WKhiqrw1BPi3yU5E92nLVrs33zRPhPRC/view?usp=sharing",
    applyLink: "https://www.rrbapply.gov.in/#/auth/landing"
  },
  {
    sno: 3,
    service: "TNPSC Combined Technical Services Examination (Diploma / ITI Level)",
    qualification: "ITI / DIPLOMA / B.E / B.TECH",
    posts: "839",
    openingDate: "17/07/2026",
    closingDate: "15/08/2026",
    detailsLink: "https://drive.google.com/file/d/1Ua399DASWc-y6ntRRLDOM4Kwr6PjsyrK/view?usp=sharing",
    applyLink: "https://apply.tnpscexams.in/apply-now?app_id=UElZMDAwMDAwMQ=="
  },
  {
    sno: 4,
    service: "SSC CGL (Combined Graduate Level) Examination 2026",
    qualification: "Any Bachelor's Degree",
    posts: "17727",
    openingDate: "24/06/2026",
    closingDate: "27/07/2026",
    detailsLink: "https://ssc.gov.in/",
    applyLink: "https://ssc.gov.in/login"
  },
  {
    sno: 5,
    service: "TNUSRB Police Constable & Sub Inspector Recruitment",
    qualification: "10th / 12th / Any Graduation",
    posts: "3359",
    openingDate: "01/08/2026",
    closingDate: "31/08/2026",
    detailsLink: "https://www.tnusrb.tn.gov.in/",
    applyLink: "https://www.tnusrb.tn.gov.in/"
  },
  {
    sno: 6,
    service: "TNPSC Group 4 Examination 2026",
    qualification: "10th SSLC Passed",
    posts: "6244",
    openingDate: "30/01/2026",
    closingDate: "28/02/2026",
    detailsLink: "https://www.tnpsc.gov.in/",
    applyLink: "https://apply.tnpscexams.in/"
  }
];

export const examScheduleData = [
  {
    sno: 1,
    service: "TNPSC Combined Technical Services Exam (Diploma Level)",
    examDate: "12/09/2026",
    hallTicketLink: "https://apply.tnpscexams.in/"
  },
  {
    sno: 2,
    service: "RRB Technician CBT-1 Online Examination",
    examDate: "18/10/2026",
    hallTicketLink: "https://www.rrbapply.gov.in/"
  },
  {
    sno: 3,
    service: "SSC CGL Tier-I Computer Based Examination",
    examDate: "09/09/2026",
    hallTicketLink: "https://ssc.gov.in/"
  },
  {
    sno: 4,
    service: "TNEA Engineering Counselling & Rank List Release",
    examDate: "10/08/2026",
    hallTicketLink: "https://www.tneaonline.org/"
  },
  {
    sno: 5,
    service: "TNUSRB Police Constable Written Examination",
    examDate: "25/08/2026",
    hallTicketLink: "https://www.tnusrb.tn.gov.in/"
  },
  {
    sno: 6,
    service: "TNPSC Group 4 Preliminary Examination 2026",
    examDate: "09/06/2026",
    hallTicketLink: "https://www.tnpsc.gov.in/"
  }
];

export const educationNotificationsData = [
  {
    sno: 1,
    institution: "MEDICAL EDUCATION DEPARTMENT",
    courses: "UG - AYURVEDHA, HOMEOPATHY, SIDDHA, UNANI (AYUSH)",
    startDate: "13/07/2026",
    endDate: "31/07/2026",
    detailsLink: "https://drive.google.com/file/d/13J5N-i7G0h-QUADh0Y6YH1V9jFKtu4dL/view?usp=sharing",
    applyLink: "https://tnayushonline.co.in/2026/REG/UGAYUSH/"
  },
  {
    sno: 2,
    institution: "TAMIL NADU PARAMEDICAL DEGREE ADMISSIONS 2026",
    courses: "B.Sc Nursing, B.Pharm, BPT, BOT, B.Sc MLT Degrees",
    startDate: "20/07/2026",
    endDate: "10/08/2026",
    detailsLink: "https://tnmedicalselection.net/",
    applyLink: "https://tnmedicalselection.net/"
  },
  {
    sno: 3,
    institution: "GOVT POLYTECHNIC COLLEGES TAMIL NADU (TNGPTA)",
    courses: "Diploma in Engineering (Civil, Mech, EEE, ECE, CSE)",
    startDate: "15/07/2026",
    endDate: "05/08/2026",
    detailsLink: "https://www.tnpoly.in/",
    applyLink: "https://www.tnpoly.in/"
  },
  {
    sno: 4,
    institution: "TAMIL NADU LAW UNIVERSITY (TNDALU ADMISSIONS)",
    courses: "5-Year Integrated B.A LL.B & 3-Year LL.B Degree",
    startDate: "01/08/2026",
    endDate: "25/08/2026",
    detailsLink: "https://tndalu.ac.in/",
    applyLink: "https://tndalu.ac.in/"
  },
  {
    sno: 5,
    institution: "TNEA - TAMIL NADU ENGINEERING ADMISSIONS",
    courses: "B.E / B.Tech Engineering Degree Counselling",
    startDate: "06/05/2026",
    endDate: "06/06/2026",
    detailsLink: "https://www.tneaonline.org/",
    applyLink: "https://www.tneaonline.org/"
  },
  {
    sno: 6,
    institution: "TNGASA - GOVT ARTS & SCIENCE COLLEGES",
    courses: "B.A, B.Sc, B.Com, B.B.A, B.C.A Undergraduate Courses",
    startDate: "08/05/2026",
    endDate: "24/05/2026",
    detailsLink: "https://www.tngasa.in/",
    applyLink: "https://www.tngasa.in/"
  },
  {
    sno: 7,
    institution: "TANUVAS - VETERINARY & ANIMAL SCIENCES",
    courses: "B.V.Sc & A.H / B.Tech Food Technology",
    startDate: "03/06/2026",
    endDate: "28/06/2026",
    detailsLink: "https://tanuvas.ac.in/",
    applyLink: "https://tanuvas.ac.in/"
  },
  {
    sno: 8,
    institution: "TNAU - TAMIL NADU AGRICULTURAL UNIVERSITY",
    courses: "B.Sc (Hons) Agriculture & Horticulture Degrees",
    startDate: "10/05/2026",
    endDate: "15/06/2026",
    detailsLink: "https://tnagriportal.in/",
    applyLink: "https://tnagriportal.in/"
  }
];

export default function NotificationTables() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'upcoming', 'closed'

  const filterItem = (text, statusObj) => {
    const matchesQuery = text.toLowerCase().includes(query.toLowerCase());
    if (!matchesQuery) return false;
    if (statusFilter === 'all') return true;
    return statusObj.code === statusFilter;
  };

  const filteredJobs = jobNotificationsData.filter(item => {
    const status = getDateStatus(item.openingDate, item.closingDate);
    return filterItem(`${item.service} ${item.qualification}`, status);
  });

  const filteredExams = examScheduleData.filter(item => {
    const status = getExamStatus(item.examDate);
    return filterItem(`${item.service} ${item.examDate}`, status);
  });

  const filteredEducation = educationNotificationsData.filter(item => {
    const status = getDateStatus(item.startDate, item.endDate);
    return filterItem(`${item.institution} ${item.courses}`, status);
  });

  return (
    <div className="notification-tables-wrapper">
      {/* Category Quick Selector & Search */}
      <div className="table-filter-bar">
        <div className="service-search search-in-tables">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 அறிவிப்புகளை தேடவும்... Search notifications, exams & admissions"
          />
          {query && <span className="search-count-pill">Filtering results</span>}
        </div>

        <div className="category-tabs category-table-tabs">
          <button
            className={activeTab === 'all' ? 'category-active' : ''}
            onClick={() => setActiveTab('all')}
          >
            அனைத்து அட்டவணைகள் / All Tables
          </button>
          <button
            className={activeTab === 'jobs' ? 'category-active' : ''}
            onClick={() => setActiveTab('jobs')}
          >
            📢 வேலைவாய்ப்பு (Jobs)
          </button>
          <button
            className={activeTab === 'exams' ? 'category-active' : ''}
            onClick={() => setActiveTab('exams')}
          >
            📅 தேர்வு அட்டவணை (Exams)
          </button>
          <button
            className={activeTab === 'education' ? 'category-active' : ''}
            onClick={() => setActiveTab('education')}
          >
            🎓 கல்வி விண்ணப்பங்கள் (Education)
          </button>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="status-filter-pills">
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--muted)' }}>நிலையை தேர்ந்தெடுக்கவும் / Filter Status:</span>
          <button
            className={`status-pill-btn ${statusFilter === 'all' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            📋 அனைத்து அறிவிப்புகள் (All)
          </button>
          <button
            className={`status-pill-btn ${statusFilter === 'open' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('open')}
          >
            🟢 தற்போது விண்ணப்பிக்கலாம் (Active Open)
          </button>
          <button
            className={`status-pill-btn ${statusFilter === 'upcoming' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('upcoming')}
          >
            ⏳ புதிய அறிவிப்புகள் / விரைவில் (New Opening)
          </button>
          <button
            className={`status-pill-btn ${statusFilter === 'closed' ? 'pill-active' : ''}`}
            onClick={() => setStatusFilter('closed')}
          >
            🔴 முடிந்தது (Closed)
          </button>
        </div>
      </div>

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
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((row, idx) => {
                    const status = getDateStatus(row.openingDate, row.closingDate);
                    return (
                      <tr key={row.sno || idx}>
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
                            <a
                              href={row.detailsLink}
                              target="_blank"
                              rel="noreferrer"
                              className="tdcsc-btn btn-details-green"
                            >
                              <FileText size={14} /> 📄 View Details
                            </a>
                          ) : '—'}
                        </td>
                        <td data-label="Apply Link" style={{ textAlign: 'center' }}>
                          {status.isClosed ? (
                            <span className="tdcsc-btn btn-closed">❌ Closed / முடிந்தது</span>
                          ) : row.applyLink ? (
                            <a
                              href={row.applyLink}
                              target="_blank"
                              rel="noreferrer"
                              className="tdcsc-btn btn-apply-orange"
                            >
                              <ExternalLink size={14} /> 📝 Apply Now
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="empty-table-msg">
                      வேலைவாய்ப்பு அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No job notifications match search or status filter.
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
                </tr>
              </thead>
              <tbody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((row, idx) => {
                    const status = getExamStatus(row.examDate);
                    return (
                      <tr key={row.sno || idx}>
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
                            <a
                              href={row.hallTicketLink}
                              target="_blank"
                              rel="noreferrer"
                              className="tdcsc-btn btn-ticket-blue"
                            >
                              <Download size={14} /> 🎫 Download Hall Ticket
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table-msg">
                      தேர்வு அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No exam schedules match search or status filter.
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
                </tr>
              </thead>
              <tbody>
                {filteredEducation.length > 0 ? (
                  filteredEducation.map((row, idx) => {
                    const status = getDateStatus(row.startDate, row.endDate);
                    return (
                      <tr key={row.sno || idx}>
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
                            <a
                              href={row.detailsLink}
                              target="_blank"
                              rel="noreferrer"
                              className="tdcsc-btn btn-details-blue"
                            >
                              <FileText size={14} /> 📄 Notification
                            </a>
                          ) : '—'}
                        </td>
                        <td data-label="Apply Link" style={{ textAlign: 'center' }}>
                          {status.isClosed ? (
                            <span className="tdcsc-btn btn-closed">❌ Closed / முடிந்தது</span>
                          ) : row.applyLink ? (
                            <a
                              href={row.applyLink}
                              target="_blank"
                              rel="noreferrer"
                              className="tdcsc-btn btn-apply-purple"
                            >
                              <ExternalLink size={14} /> 📝 Apply Now
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-table-msg">
                      கல்வி விண்ணப்ப அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No education applications match search or status filter.
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
