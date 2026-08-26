import React from 'react';
import PhotoToolsEngine from '../components/tools/PhotoToolsEngine';
import { getToolBySlugOrId, PHOTO_TOOLS_CATALOG } from '../data/photoToolsData';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';

export default function PhotoToolPage({ toolId, navigate, notify, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const tool = getToolBySlugOrId(toolId) || PHOTO_TOOLS_CATALOG[0];

  return (
    <div className="single-tool-page">
      {/* Breadcrumb Navigation Bar */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', marginBottom: '16px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748b', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Home size={14} /> {isTa ? 'முகப்பு' : 'Home'}
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('photo-tools')}
            style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, fontWeight: 700 }}
          >
            {isTa ? 'புகைப்படக் கருவிகள்' : 'Photo Tools'}
          </button>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 800 }}>
            {isTa ? tool.titleTa.split('|')[0] : tool.title.split('|')[0]}
          </span>
        </div>
      </div>

      {/* Main Tool Engine */}
      <PhotoToolsEngine tool={tool} lang={lang} navigate={navigate} notify={notify} />
    </div>
  );
}
