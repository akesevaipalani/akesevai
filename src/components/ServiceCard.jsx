import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ service, lang = 'ta' }) {
  const Icon = service.icon;

  return (
    <article className="service-card">
      <span className="service-icon"><Icon size={22} /></span>
      <h3>{lang === 'ta' ? service.tamil : service.title}</h3>
      <p className="tamil">{lang === 'ta' ? service.title : service.tamil}</p>
      <p>{service.text}</p>
      <span className="card-arrow"><ArrowRight size={17} /></span>
    </article>
  );
}
