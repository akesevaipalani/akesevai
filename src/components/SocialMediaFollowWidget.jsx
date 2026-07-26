import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export default function SocialMediaFollowWidget() {
  const channels = [
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@AkEsevai',
      subtext: 'சேவை வழிகாட்டிகள் & புதுப்பிப்புகள்',
      url: siteConfig.youtube,
      color: '#FF0000',
      bg: '#FEF2F2',
      border: '#FECACA',
      icon: YoutubeIcon,
      btnBg: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
      btnText: '▶️ Subscribe பண்ணுங்கள்'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@akesevai',
      subtext: 'செய்திகள் & உடனுக்குடன் தகவல்கள்',
      url: siteConfig.instagram,
      color: '#E1306C',
      bg: '#FDF2F8',
      border: '#FBCFE8',
      icon: InstagramIcon,
      btnBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      btnText: '📸 Follow பண்ணுங்கள்'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'AkEsevai Palani',
      subtext: 'பொது அறிவிப்புகள் & முகவரி',
      url: siteConfig.facebook,
      color: '#1877F2',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      icon: FacebookIcon,
      btnBg: 'linear-gradient(135deg, #1877F2 0%, #0056B3 100%)',
      btnText: '👍 Like / Follow'
    }
  ];

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #e2e8f0',
      borderRadius: '18px',
      padding: '24px 28px',
      marginTop: '28px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div>
          <span style={{ background: '#eff6ff', color: '#0052cc', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> CONNECT WITH US • சமூக வலைத்தளங்கள்
          </span>
          <h3 style={{ font: '800 20px Manrope', color: '#0f172a', margin: '4px 0 0' }}>
            எங்களின் சமூக வலைத்தளங்களில் இணையுங்கள்! 📲
          </h3>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          புதிய அரசு திட்டங்கள் & அறிவிப்புகளை உடனுக்குடன் பெற தொடருங்கள்
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {channels.map((ch) => {
          const IconComp = ch.icon;
          return (
            <div
              key={ch.id}
              style={{
                background: ch.bg,
                border: `1.5px solid ${ch.border}`,
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'white',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  flexShrink: 0
                }}>
                  <IconComp size={24} color={ch.color} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: ch.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ch.name}</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginTop: '2px' }}>{ch.handle}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>{ch.subtext}</div>
                </div>
              </div>

              <a
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: ch.btnBg,
                  color: 'white',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: `0 4px 12px ${ch.color}33`,
                  transition: 'transform 0.15s ease'
                }}
              >
                {ch.btnText} <ExternalLink size={13} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
