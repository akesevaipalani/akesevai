import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileCheck2,
  MapPin,
  Phone,
  ShieldCheck
} from 'lucide-react';
import SpaLink from './SpaLink';
import { siteConfig } from '../config/siteConfig';

export default function ServiceGuidancePageTemplate({ service, navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  if (!service) return null;

  const accent = service.accentColor || '#0052cc';

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 16px 64px' }}>
      {/* 1. Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: accent, textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </SpaLink>
        <span>/</span>
        <SpaLink to="/esevai-services" navigate={navigate} scrollToTop style={{ color: accent, textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'தமிழ்நாடு இ-சேவை மையம்' : 'TN e-Sevai Hub'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? service.seo.breadcrumbLabel : service.seo.breadcrumbLabel}
        </span>
      </nav>

      {/* 2. Header Banner & Sole H1 */}
      <header
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, ${accent} 100%)`,
          borderRadius: '22px',
          padding: '34px 28px',
          color: 'white',
          marginBottom: '24px'
        }}
      >
        <span
          style={{
            background: '#fef08a',
            color: '#854d0e',
            fontSize: '11.5px',
            fontWeight: 800,
            padding: '5px 13px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '12px'
          }}
        >
          {isTa ? service.badgeTa : service.badgeEn}
        </span>
        <h1 style={{ fontSize: 'clamp(24px, 3.4vw, 31px)', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa ? service.h1Ta : service.h1En}
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.95, margin: '0 0 20px', maxWidth: '860px', lineHeight: 1.65 }}>
          {isTa ? service.introTa : service.introEn}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/919342318844?text=${encodeURIComponent(`Hello AK E-SEVAI, I need guidance regarding ${service.seo.breadcrumbLabel}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#fef08a',
              color: '#0f172a',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '13.5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <Phone size={15} /> {isTa ? 'WhatsApp உதவி (+91 93423 18844)' : 'WhatsApp Guidance (+91 93423 18844)'}
          </a>
          <SpaLink
            to="/token-generator"
            navigate={navigate}
            scrollToTop
            style={{
              background: 'rgba(255,255,255,0.16)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.35)',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <Clock size={15} /> {isTa ? 'பழனி நேரில் டோக்கன் முன்பதிவு' : 'Palani Walk-In Token Booking'}
          </SpaLink>
        </div>
      </header>

      {/* 3. Mandatory Private Service & Statutory Authority Disclaimer */}
      <section
        aria-label="Service Disclosure"
        style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderLeft: `5px solid ${accent}`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '22px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}
      >
        <ShieldCheck size={20} color={accent} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
          <strong>
            {isTa ? 'தனியார் டிஜிட்டல் உதவி மைய அறிவிப்பு: ' : 'Independent Private Service Disclosure: '}
          </strong>
          {isTa
            ? 'AK E-SEVAI என்பது ஒரு தனியார் டிஜிட்டல் ஆவணத் தயாரிப்பு & விண்ணப்ப உதவி மையம் மட்டுமே; அரசு அலுவலகம் அல்ல. அனைத்து அதிகாரப்பூர்வ சான்றிதழ்கள், ஆவணங்கள் மற்றும் ஒப்புதல்கள் சம்பந்தப்பட்ட தமிழ்நாடு / இந்திய அரசுத் துறைகளால் மட்டுமே வழங்கப்படுகின்றன. நடப்பு அரசு கட்டணங்கள் மற்றும் கால அளவுகளைக் கீழ்க்கண்ட அதிகாரப்பூர்வ இணையதளங்களில் உறுதிப்படுத்தவும்.'
            : 'AK E-SEVAI is an independent private digital document preparation and guidance centre, NOT a government office. Official certificates, cards, and approvals are issued solely by the respective Tamil Nadu or Central Government departments. Always verify current statutory fees and timelines directly on the official portals linked below.'}
        </div>
      </section>

      {/* 4. Strict Aadhaar Authorized Kendra Notice (shown on /aadhaar-guidance) */}
      {service.aadhaarNoticeTa && (
        <section
          aria-label="Aadhaar Compliance Notice"
          style={{
            background: '#fff7ed',
            border: '1.5px solid #fb923c',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '26px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}
        >
          <AlertCircle size={22} color="#c2410c" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '13.5px', color: '#7c2d12', lineHeight: 1.6, fontWeight: 600 }}>
            {isTa ? service.aadhaarNoticeTa : service.aadhaarNoticeEn}
          </p>
        </section>
      )}

      {/* 5. Service Scope & Base Document Checklist Sections */}
      <section style={{ marginBottom: '34px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
          {isTa ? service.servicesCoveredTitleTa : service.servicesCoveredTitleEn}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {service.sections.map((sec, idx) => (
            <article
              key={idx}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '22px'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: '#eff6ff',
                  color: accent,
                  fontSize: '11.5px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  marginBottom: '10px'
                }}
              >
                {isTa ? sec.tagTa : sec.tagEn}
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                {isTa ? sec.titleTa : sec.titleEn}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 14px' }}>
                {isTa ? sec.descTa : sec.descEn}
              </p>
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck2 size={14} color={accent} />
                  {isTa ? 'ஆவணப் பட்டியல் குறிப்பு:' : 'Reference Checklist:'}
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>
                  {(isTa ? sec.checklistTa : sec.checklistEn).map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Official Government / Statutory Portals */}
      <section
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '22px',
          marginBottom: '30px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
          🌐 {isTa ? 'அதிகாரப்பூர்வ அரசு & துறை இணையதள இணைப்புகள்' : 'Verified Official Government & Statutory Portals'}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px' }}>
          {isTa
            ? 'தனிப்பட்ட OTP அல்லது கடவுச்சொல் இல்லாமல் நேரடியாக அதிகாரப்பூர்வ போர்ட்டல்களில் விதிகளையும் விண்ணப்ப நிலையையும் சரிபார்க்கவும்.'
            : 'Verify live statutory rules, applicable fees, and application status directly on the official external portals listed below.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {service.officialPortals.map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                textDecoration: 'none',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{isTa ? portal.labelTa : portal.labelEn}</span>
              <span style={{ fontSize: '11px', color: '#475569', background: '#e2e8f0', padding: '2px 6px', borderRadius: '6px' }}>
                {portal.domain}
              </span>
              <ExternalLink size={14} color={accent} />
            </a>
          ))}
        </div>
      </section>

      {/* 7. Free Client-Side Document Tools & Related Guides */}
      <section
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px'
        }}
      >
        <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#14532d', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#15803d" />
          {isTa ? 'ஆவணங்களைத் தயார் செய்ய இலவச பிரவுசர் கருவிகள் & தொடர்புடைய பக்கங்கள்' : 'Free Browser Document Preparation Tools & Related Guides'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {service.relatedTools.map((tool, idx) => (
            <SpaLink
              key={`tool-${idx}`}
              to={tool.to}
              navigate={navigate}
              scrollToTop
              style={{
                background: 'white',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isTa ? tool.labelTa : tool.labelEn} <ArrowRight size={13} />
            </SpaLink>
          ))}
          {service.relatedPages.map((pg, idx) => (
            <SpaLink
              key={`page-${idx}`}
              to={pg.to}
              navigate={navigate}
              scrollToTop
              style={{
                background: 'white',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                padding: '8px 14px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isTa ? pg.labelTa : pg.labelEn} <ArrowRight size={13} />
            </SpaLink>
          ))}
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions (FAQs)'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {service.faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '15px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f172a',
                  gap: '12px'
                }}
              >
                <span>{isTa ? faq.qTa : faq.qEn}</span>
                {openFaq === idx ? <ChevronUp size={18} color={accent} /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 18px 16px', fontSize: '14px', color: '#475569', lineHeight: 1.65, borderTop: '1px solid #f1f5f9' }}>
                  {isTa ? faq.aTa : faq.aEn}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Standardized SEO-02 Palani Walk-In NAP & Tamil Nadu Support Strip */}
      <section
        style={{
          background: '#f8fafc',
          border: `2px solid ${accent}`,
          borderRadius: '18px',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: accent, textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி மையம் (பழனி மட்டும்) & தமிழ்நாடு ஆன்லைன் வழிகாட்டல்' : 'Walk-In Centre (Palani Only) & Statewide Online Tools'}
          </span>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '4px 0 4px' }}>
            {siteConfig.name}
          </h3>
          <p style={{ fontSize: '13.5px', color: '#334155', margin: '0 0 4px' }}>
            Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601
          </p>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
            ⏰ {isTa ? 'திங்கள் – சனி: காலை 10:00 – இரவு 8:00 (ஞாயிறு விடுமுறை)' : 'Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed)'} | {siteConfig.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="tel:+919342318844"
            style={{
              background: accent,
              color: 'white',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Phone size={14} /> +91 93423 18844
          </a>
          <a
            href={siteConfig.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'white',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPin size={14} /> Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}

