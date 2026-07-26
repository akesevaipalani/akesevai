import { ArrowRight } from 'lucide-react';

export default function NotificationCard({ notification }) {
  const Icon = notification.icon;

  return (
    <article className="notification-card">
      <span className="notification-icon"><Icon size={21} /></span>
      <span className="notification-label">NEW UPDATE</span>
      <h3>{notification.title}</h3>
      <p>{notification.english}</p>
      <small>{notification.text}</small>
      <a className="card-link" href={notification.href} target="_blank" rel="noreferrer">
        View official link <ArrowRight size={15} />
      </a>
    </article>
  );
}
