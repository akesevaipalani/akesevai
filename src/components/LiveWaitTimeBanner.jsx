import React, { useState, useEffect } from 'react';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { subscribeLiveQueue } from '../utils/dataService';

export default function LiveWaitTimeBanner({ lang = 'ta', navigate }) {
  const [queueData, setQueueData] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeLiveQueue((cloudData) => {
      if (cloudData) {
        setQueueData(cloudData);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const isClosed = queueData.status === 'closed';
  const waitingCount = parseInt(queueData.queueCount || '3', 10);
  const waitTime = queueData.waitTime || '5-10';
  const openTime = queueData.openTime || (lang === 'ta' ? 'திங்கள் - சனி காலை 10:00 - மாலை 5:00' : 'Mon - Sat 10:00 AM - 5:00 PM');

  const isTa = lang === 'ta';

  return (
    <div style={{
      background: isClosed
        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)',
      borderRadius: '16px',
      padding: '22px 26px',
      marginTop: '20px',
      color: 'white',
      boxShadow: '0 10px 30px rgba(2, 44, 122, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Left Side Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: isClosed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(74, 222, 128, 0.2)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            {isClosed ? '🔒' : '🟢'}
          </div>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: isClosed ? '#fca5a5' : '#86efac',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isClosed ? '#ef4444' : '#4ade80', display: 'inline-block' }} />
              {isTa ? 'மையத்தின் சேவை நிலை • LIVE STATUS' : 'CENTER OPERATIONAL STATUS • LIVE'}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '3px 0 0 0', color: 'white' }}>
              {isClosed
                ? (isTa ? 'மையம் தற்போது மூடப்பட்டுள்ளது' : 'Center is Currently Closed')
                : (isTa ? 'மையம் தற்போது செயல்படுகிறது (Center Open)' : 'Center is Open & Operational Today')}
            </h3>

            <p style={{ fontSize: '12px', color: '#bfdbfe', margin: '3px 0 0 0', fontWeight: 600 }}>
              {isClosed
                ? (isTa ? `திறக்கும் நேரம்: ${openTime}` : `Opening Hours: ${openTime}`)
                : (isTa ? 'நேரடியாக வரலாம் அல்லது ஆன்லைனில் விண்ணப்பம் தொடங்கலாம்.' : 'Visit directly or apply online via Customer Portal.')}
            </p>
          </div>
        </div>

        {/* Center Live Badges: Waiting Count & Est Wait Time */}
        {!isClosed && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Users size={20} color="#86efac" />
              <div>
                <small style={{ color: '#bfdbfe', fontSize: '10px', display: 'block', fontWeight: 700 }}>
                  {isTa ? 'காத்திருக்கும் நபர்கள்' : 'Waiting Customers'}
                </small>
                <strong style={{ fontSize: '14px', color: 'white', fontWeight: 900 }}>
                  {waitingCount} {isTa ? 'நபர்கள்' : 'People'}
                </strong>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Clock size={20} color="#fbbf24" />
              <div>
                <small style={{ color: '#bfdbfe', fontSize: '10px', display: 'block', fontWeight: 700 }}>
                  {isTa ? 'எதிர்பார்க்கப்படும் நேரம்' : 'Est. Wait Time'}
                </small>
                <strong style={{ fontSize: '14px', color: '#fbbf24', fontWeight: 900 }}>
                  ~{waitTime} {isTa ? 'நிமிடங்கள்' : 'Mins'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Quick Action */}
        {navigate && (
          <button
            onClick={() => navigate('customer')}
            style={{
              background: '#ffffff',
              color: '#022c7a',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              marginLeft: 'auto'
            }}
          >
            {isTa ? 'ஆன்லைனில் விண்ணப்பிக்க' : 'Apply Online'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
