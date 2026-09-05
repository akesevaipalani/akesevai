import StatusTracker from '../components/StatusTracker';

export const pageMeta = { id: 'status-track', title: 'Status Track' };

export default function StatusTrackPage({ lang = 'ta' }) {
  return (
    <section className="page-width inner-page">
      <StatusTracker lang={lang} />
    </section>
  );
}
