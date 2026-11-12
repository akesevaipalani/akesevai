import { ExternalLink, ShieldAlert } from 'lucide-react';
import {
  enrichNotificationWithDateStatus,
  getKolkataToday,
  getNotificationUiLabels,
  normalizeLanguage
} from '../utils/notificationDateHelper';

export default function NotificationCard({ notification, lang }) {
  if (!notification) return null;

  const resolvedLang = normalizeLanguage(lang ?? notification.lang);
  const ui = getNotificationUiLabels(resolvedLang);
  const Icon = notification.icon;
  const today = getKolkataToday();
  const enriched = enrichNotificationWithDateStatus(notification, today, { lang: resolvedLang });
  const { appStatus, examStatus, resultStatus, dateConsistency } = enriched;

  const formattedClosingDate = enriched.formattedClosingDate;
  const formattedExamDate = enriched.formattedExamDate;

  const title = notification.service || notification.title || 'Official Notification';
  const org = notification.organization || notification.english || 'Government of India / Tamil Nadu';
  const linkHref = enriched.canShowApplyCta
    ? notification.applyLink
    : (notification.detailsLink || notification.href || notification.applyLink || '#');

  return (
    <article
      className="notification-card govt-notification-card"
      data-lang={resolvedLang}
      data-app-status={enriched.applicationStatus}
      data-exam-status={enriched.examStatusCode}
      data-result-status={enriched.resultStatusCode}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        {Icon ? (
          <span className="notification-icon"><Icon size={20} /></span>
        ) : (
          <span className="notification-label" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{ui.govNotificationBadge}</span>
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
      {(notification.openingDate || notification.closingDate || notification.extendedClosingDate || notification.examDate) && (
        <div style={{ display: 'grid', gap: '4px', fontSize: '11.5px', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', margin: '8px 0' }}>
          {(notification.closingDate || notification.extendedClosingDate) && (
            <div style={{ color: appStatus.tagColor, fontWeight: 700 }}>
              {ui.cardClosingPrefix} {formattedClosingDate} ({appStatus.countdown})
            </div>
          )}
          {notification.examDate && (
            <div style={{ color: examStatus.tagColor, fontWeight: 700 }}>
              {ui.cardExamPrefix} {formattedExamDate} ({examStatus.countdown})
            </div>
          )}
          <div style={{ color: resultStatus.tagColor, fontWeight: 700 }}>
            {ui.cardResultPrefix} {resultStatus.label}
          </div>
        </div>
      )}

      {enriched.needsAdminReview && dateConsistency?.warnings?.length > 0 && (
        <div
          role="alert"
          style={{
            background: '#fffbeb',
            border: '1px solid #f59e0b',
            color: '#92400e',
            padding: '6px 8px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            margin: '6px 0',
            display: 'flex',
            gap: '6px',
            alignItems: 'flex-start'
          }}
        >
          <ShieldAlert size={14} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>{dateConsistency.warnings[0]}</span>
        </div>
      )}

      {notification.text && <small style={{ display: 'block', color: '#64748b', margin: '6px 0' }}>{notification.text}</small>}

      {enriched.canShowApplyCta ? (
        <a className="card-link" href={linkHref} target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px' }}>
          {ui.applyNowCardLink} <ExternalLink size={14} />
        </a>
      ) : (
        <a
          className="card-link"
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '8px', color: '#475569' }}
        >
          {appStatus.isExpired
            ? ui.cardClosedRefLink
            : (enriched.needsAdminReview ? ui.cardReviewRefLink : ui.cardOfficialRefLink)}{' '}
          <ExternalLink size={14} />
        </a>
      )}
    </article>
  );
}
