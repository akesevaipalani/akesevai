import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { subscribeLiveQueue, subscribeTokens, readTokenBookings } from '../utils/dataService';
import { isWithinBusinessHours, BUSINESS_HOURS_CONFIG } from '../config/businessHours';

export default function LiveWaitTimeBanner({ lang = 'ta', navigate }) {
  const [queueData, setQueueData] = useState({});
  const [tokens, setTokens] = useState(() => {
    try {
      return readTokenBookings() || [];
    } catch (e) {
      return [];
    }
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const unsubQueue = subscribeLiveQueue((cloudData) => {
      if (cloudData && typeof cloudData === 'object') {
        setQueueData(cloudData);
      }
    });

    const unsubTokens = subscribeTokens((cloudTokens) => {
      if (Array.isArray(cloudTokens)) {
        setTokens(cloudTokens);
      }
    });

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      if (typeof unsubQueue === 'function') unsubQueue();
      if (typeof unsubTokens === 'function') unsubTokens();
      clearInterval(timer);
    };
  }, []);

  // 1. Operating Hours & Real Center Status from Central Config (10:00 AM - 8:00 PM)
  const isWithinHours = isWithinBusinessHours(currentTime);

  // Real Center Status: Controlled by Admin override, otherwise auto-detected by operating clock
  const isCenterOpen = queueData.status ? queueData.status === 'open' : isWithinHours;

  // 2. Real Waiting Customer Count (from active tokens / queue)
  const activeWaitingTokens = tokens.filter(t => {
    if (!t) return false;
    const st = String(t.status || '').toUpperCase();
    return st !== 'COMPLETED' && st !== 'DONE' && st !== 'CANCELLED';
  });

  const waitingCount = (queueData.queueCount !== undefined && queueData.queueCount !== '')
    ? parseInt(queueData.queueCount, 10) || 0
    : activeWaitingTokens.length;

  // 3. Average Wait Time Calculation
  let computedWaitTime = '5–10';
  if (waitingCount === 0) {
    computedWaitTime = '5';
  } else if (waitingCount <= 2) {
    computedWaitTime = '5–10';
  } else if (waitingCount <= 5) {
    computedWaitTime = '10–15';
  } else {
    computedWaitTime = `${waitingCount * 3}–${waitingCount * 5}`;
  }
  const waitTimeDisplay = queueData.waitTime || computedWaitTime;

  // 4. Operating Time Display
  const openTimeDisplay = queueData.openTime || BUSINESS_HOURS_CONFIG.timingSummaryEn;

  const isTa = lang === 'ta';

  return (
    <section
      className="center-operational-status-card live-wait-banner"
      style={{
        background: isCenterOpen
          ? 'linear-gradient(135deg, #022c7a 0%, #065f46 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '24px 28px',
        margin: '24px 0',
        color: '#ffffff',
        boxShadow: isCenterOpen
          ? '0 12px 36px rgba(2, 44, 122, 0.25)'
          : '0 12px 36px rgba(15, 23, 42, 0.25)',
        border: '1.5px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* BACKGROUND ACCENT GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: isCenterOpen ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.12)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      {/* TOP HEADER: STATUS & SUBTITLE (CLEAN & PROMINENT) */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isCenterOpen ? '#4ade80' : '#f87171',
              boxShadow: isCenterOpen ? '0 0 12px #4ade80' : '0 0 12px #f87171',
              display: 'inline-block'
            }}
          />
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 900,
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-0.01em'
            }}
          >
            {isCenterOpen
              ? (isTa ? 'எங்கள் மையம் திறந்துள்ளது!' : 'Our Center is Open!')
              : (isTa ? 'எங்கள் மையம் தற்போது மூடப்பட்டுள்ளது' : 'Center is Currently Closed')}
          </h2>
        </div>

        <p
          style={{
            fontSize: '15px',
            color: isCenterOpen ? '#dcfce7' : '#cbd5e1',
            margin: 0,
            fontWeight: 600,
            paddingLeft: '22px'
          }}
        >
          {isCenterOpen
            ? (isTa ? 'நேரடியாக வரலாம் அல்லது ஆன்லைனில் விண்ணப்பிக்கலாம்' : 'Visit directly or apply online via our customer portal')
            : (isTa ? 'நாளை காலை 10:00 மணிக்கு திறக்கப்படும். இப்போது ஆன்லைனில் விண்ணப்பிக்கலாம்.' : 'Opens next at 10:00 AM. You can apply online 24/7.')}
        </p>
      </div>

      {/* 4 KEY INFORMATION ITEMS GRID (RESPONSIVE & UNCLUTTERED) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          alignItems: 'stretch'
        }}
      >
        {/* INFO 1: WAITING CUSTOMERS */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}
          >
            <Users size={22} color="#86efac" />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: '#bfdbfe', fontWeight: 700, display: 'block' }}>
              {isTa ? 'காத்திருக்கும் வாடிக்கையாளர்கள்' : 'Waiting Customers'}
            </span>
            <strong style={{ fontSize: '17px', color: '#ffffff', fontWeight: 900 }}>
              {waitingCount} {isTa ? 'பேர்' : 'People'}
            </strong>
          </div>
        </div>

        {/* INFO 2: AVERAGE WAIT TIME */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}
          >
            <Clock size={22} color="#fde047" />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: '#bfdbfe', fontWeight: 700, display: 'block' }}>
              {isTa ? 'சராசரி காத்திருப்பு நேரம்' : 'Average Wait Time'}
            </span>
            <strong style={{ fontSize: '17px', color: '#fde047', fontWeight: 900 }}>
              {waitTimeDisplay} {isTa ? 'நிமிடங்கள்' : 'Minutes'}
            </strong>
          </div>
        </div>

        {/* INFO 3: TODAY'S OPENING HOURS */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0
            }}
          >
            <Calendar size={22} color="#93c5fd" />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: '#bfdbfe', fontWeight: 700, display: 'block' }}>
              {isTa ? 'இன்று திறந்திருக்கும் நேரம்' : "Today's Operating Hours"}
            </span>
            <strong style={{ fontSize: '15px', color: '#ffffff', fontWeight: 900 }}>
              {openTimeDisplay}
            </strong>
          </div>
        </div>

        {/* INFO 4: BIG PROMINENT APPLY NOW ACTION BUTTON */}
        <button
          onClick={() => {
            if (typeof navigate === 'function') {
              navigate('customer');
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            color: '#065f46',
            border: 'none',
            borderRadius: '14px',
            padding: '14px 20px',
            fontSize: '15px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.18s ease',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.2)';
          }}
        >
          <span>🔵 {isTa ? 'இப்போது விண்ணப்பிக்க' : 'Apply Online Now'}</span>
          <ArrowRight size={18} color="#065f46" />
        </button>
      </div>
    </section>
  );
}
