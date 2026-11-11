import React from 'react';
import { AlertTriangle, Home, Wrench, FileText } from 'lucide-react';
import SpaLink from '../components/SpaLink';

export default function NotFoundPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  return (
    <div style={{ maxWidth: '760px', margin: '48px auto', padding: '36px 24px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: '#fef2f2', color: '#dc2626', marginBottom: '16px' }}>
        <AlertTriangle size={40} />
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>
        404 — {isTa ? 'பக்கம் கிடைக்கவில்லை (Page Not Found)' : 'Page Not Found'}
      </h1>
      <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: '560px' }}>
        {isTa
          ? 'நீங்கள் தேடும் இணையதள முகவரி இல்லை அல்லது மாற்றப்பட்டிருக்கலாம். கீழே உள்ள அதிகாரப்பூர்வ சேவைகள் மற்றும் இலவச கருவிகள் பக்கங்களைப் பார்வையிடலாம்.'
          : 'The URL you requested does not exist or may have moved. Explore our Tamil Nadu online service guides and free browser tools below.'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#022c7a', color: 'white', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
          <Home size={16} /> {isTa ? 'முகப்பு (Home)' : 'Home Page'}
        </SpaLink>
        <SpaLink to="/photo-tools" navigate={navigate} scrollToTop style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16a34a', color: 'white', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
          <Wrench size={16} /> {isTa ? 'போட்டோ & PDF கருவிகள்' : 'Photo & PDF Tools'}
        </SpaLink>
        <SpaLink to="/esevai-services" navigate={navigate} scrollToTop style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
          <FileText size={16} /> {isTa ? 'தமிழ்நாடு இ-சேவை வழிகாட்டி' : 'e-Sevai Services Guide'}
        </SpaLink>
      </div>
    </div>
  );
}
