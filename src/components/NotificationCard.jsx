import { ArrowRight, Calendar, Clock, ExternalLink } from 'lucide-react';
import {
  calculateApplicationStatus,
  calculateExamStatus,
  formatDisplayDate,
  getKolkataToday
} from '../utils/notificationDateHelper';

export default function NotificationCard({ notification }) {
  if (!notification) return null;

  const Icon = notification.icon;
  const today = getKolkataToday();

  // Compute dual status if dates exist
  const appStatus = calculateApplicationStatus(
    notification.openingDate || notification.applicationStartDate,
    notification.closingDate || notification.applicationEndDate,
    today
  );
  const examStatus = calculateExamStatus(notification.examDate, today);

  const formattedOpeningDate = formatDisplayDate(notification.openingDate || notification.applicationStartDate);
  const formattedClosingDate = formatDisplayDate(notification.closingDate || notification.applicationEndDate);
  const formattedExamDate = formatDisplayDate(notification.examDate);

  const title = notification.service || notification.title || 'Official Notification';
  const org = notification.organization || notification.english || 'Government of India / Tamil Nadu';
  const linkHref = notification.applyLink || notification.detailsLink || notification.href || '#';

  return (
    <article className="notification-card govt-notification-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        {Icon ? (
          <span className="notification-icon"><Icon size={20} /></span>
        ) : (
          <span className="notification-label" style={{ background: '#dbeafe', color: '#1d4ed8' }}>அரசு அறிவிப்பு</span>
        )}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '12px',
            background: appStatus.tagBg,
            color: appStatus.tagColor,
            border: `1px solid ${appStatus.tagBorder}`
          }}
        >
          {appStatus.label}
        </span>
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '4px 0 6px', color: '#0f172a' }}>{title}</h3>
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>{org}</p>

      {/* Date Tiles */}
      {(notification.openingDate || notification.closingDate || notification.examDate) && (
        <div style={{ display: 'grid', gap: '4px', fontSize: '11.5px', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', margin: '8px 0' }}>
          {notification.closingDate && (
            <div style={{ color: appStatus.tagColor, fontWeight: 700 }}>
              ⏰ கடைசி தேதி: {formattedClosingDate} ({appStatus.countdown})
            </div>
          )}
          {notification.examDate && (
            <div style={{ color: examStatus.tagColor, fontWeight: 700 }}>
              📝 தேர்வு தேதி: {formattedExamDate} ({examStatus.countdown})
            </div>
          )}
        </div>
      )}

      {notification.text && <small style={{ display: 'block', color: '#64748b', margin: '6px 0' }}>{notification.text}</small>}

      <a className="card-link" href={linkHref} target="_blank" rel="noreferrer" style={{ marginTop: '8px' }}>
        அதிகாரப்பூர்வ இணைப்பு <ExternalLink size={14} />
      </a>
    </article>
  );
}
