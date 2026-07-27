import React, { useState, useEffect } from 'react';
import { subscribeLiveQueue } from '../utils/firebaseService';

export default function LiveWaitTimeBanner() {
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

  const isOpen = queueData.status === 'open' || queueData.status === undefined;
  const waitingCount = parseInt(queueData.queueCount || '0', 10);
  const waitTime = queueData.waitTime || '10-15';
  const closedNotice = queueData.closedNotice || 'மையம் தற்போது மூடப்பட்டுள்ளது';
  const openTime = queueData.openTime || 'Mon–Sat 10:00 AM';

  if (queueData.status === 'closed') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        border: '1px solid #334155',
        marginTop: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🔒</div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CENTER STATUS</div>
            <div style={{ color: 'white', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{closedNotice}</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Center is currently closed • திறக்கும் நேரம்: {openTime}</div>
          </div>
        </div>
        <div style={{ background: '#374151', borderRadius: '10px', padding: '10px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 700 }}>
          📅 {openTime}
        </div>
      </div>
    );
  }

  const congestionColor = waitingCount <= 3 ? '#16a34a' : waitingCount <= 7 ? '#d97706' : '#dc2626';
  const congestionLabel = waitingCount <= 3 ? 'குறைவான நெரிசல் (Low)' : waitingCount <= 7 ? 'நடுத்தர நெரிசல் (Medium)' : 'அதிக நெரிசல் (High)';
  const barWidth = Math.min((waitingCount / 10) * 100, 100);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)',
      borderRadius: '16px',
      padding: '20px 28px',
      marginTop: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 12px 40px rgba(2, 44, 122, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative circles */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -10, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', position: 'relative' }}>
        {/* Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 10, height: 10, background: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 4px rgba(74,222,128,0.25)', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#86efac', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>LIVE NOW • நேரலை</span>
        </div>

        {/* Center Stat: Waiting count */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center', flex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: '34px', fontWeight: 900, lineHeight: 1, fontFamily: 'Manrope, sans-serif' }}>{waitingCount}</div>
            <div style={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 700, marginTop: '3px' }}>காத்திருக்கும் பேர்<br />People Waiting</div>
          </div>
          <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '28px', fontWeight: 900, lineHeight: 1 }}>~{waitTime}</div>
            <div style={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 700, marginTop: '3px' }}>நிமிட காத்திருப்பு<br />Min Wait Time</div>
          </div>
          <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: congestionColor === '#16a34a' ? '#4ade80' : congestionColor === '#d97706' ? '#fbbf24' : '#f87171', background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px' }}>
              {congestionLabel}
            </div>
            <div style={{ color: '#bfdbfe', fontSize: '10px', fontWeight: 700, marginTop: '6px' }}>நெரிசல் அளவு</div>
          </div>
        </div>

        {/* Right: Progress bar */}
        <div style={{ minWidth: '140px' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, marginBottom: '6px', textAlign: 'right' }}>நெரிசல் அளவீடு</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${barWidth}%`, background: congestionColor, borderRadius: '8px', transition: 'width 1s ease' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>{waitingCount} / 10</div>
        </div>
      </div>
    </div>
  );
}
