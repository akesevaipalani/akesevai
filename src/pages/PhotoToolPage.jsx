import React from 'react';
import PhotoToolsEngine from '../components/tools/PhotoToolsEngine';
import NotFoundPage from './NotFoundPage';
import { getToolBySlugOrId } from '../data/photoToolsData';
import { Home } from 'lucide-react';
import SpaLink from '../components/SpaLink';

export default function PhotoToolPage({ toolId, navigate, notify, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const tool = getToolBySlugOrId(toolId);

  if (!tool) {
    return <NotFoundPage navigate={navigate} lang={lang} />;
  }

  return (
    <div className="single-tool-page">
      {/* Crawlable Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', marginBottom: '16px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748b', flexWrap: 'wrap' }}>
          <SpaLink
            to="/"
            navigate={navigate}
            scrollToTop
            style={{ color: '#0052cc', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
          >
            <Home size={14} /> {isTa ? 'முகப்பு' : 'Home'}
          </SpaLink>
          <span>/</span>
          <SpaLink
            to="/photo-tools"
            navigate={navigate}
            scrollToTop
            style={{ color: '#0052cc', fontWeight: 700, textDecoration: 'none' }}
          >
            {isTa ? 'புகைப்பட & PDF கருவிகள்' : 'Photo & PDF Tools'}
          </SpaLink>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 800 }}>
            {isTa ? tool.titleTa.split('|')[0].trim() : tool.title.split('|')[0].trim()}
          </span>
        </div>
      </nav>

      {/* Main Tool Engine */}
      <PhotoToolsEngine tool={tool} lang={lang} navigate={navigate} notify={notify} />
    </div>
  );
}
