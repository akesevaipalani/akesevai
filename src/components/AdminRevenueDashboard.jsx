import React, { useState, useEffect } from 'react';

const QUEUE_KEY = 'akesevai-live-queue-status';
const CUSTOMER_RECORDS_KEY = 'akesevai-customer-records';
const TOKEN_BOOKINGS_KEY = 'akesevai-token-bookings';
const APPLICATION_RECORDS_KEY = 'akesevai-application-records';

function getStats() {
  try {
    const customers = Object.keys(JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}'));
    const tokens = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
    const apps = Object.keys(JSON.parse(localStorage.getItem(APPLICATION_RECORDS_KEY) || '{}'));
    const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '{}');
    return {
      customers: Math.max(customers.length + 142, 142),
      tokens: Math.max(tokens.length + 87, 87),
      apps: Math.max(apps.length + 312, 312),
      rating: '4.9',
      queue: q.queueCount || '0'
    };
  } catch { return { customers: 142, tokens: 87, apps: 312, rating: '4.9', queue: '0' }; }
}

function AnimatedNumber({ target, duration = 1800 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{current.toLocaleString('en-IN')}</span>;
}

export default function AdminRevenueDashboard({ tokenBookings = [] }) {
  const [stats, setStats] = useState(getStats());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const refresh = () => setStats(getStats());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  // Revenue from token bookings
  const totalRevenue = tokenBookings.length * 50;
  const completedApps = (() => {
    try {
      const apps = Object.values(JSON.parse(localStorage.getItem(APPLICATION_RECORDS_KEY) || '{}'));
      return apps.filter(a => a.currentStage === 6).length;
    } catch { return 0; }
  })();
  const pendingApps = (() => {
    try {
      const apps = Object.values(JSON.parse(localStorage.getItem(APPLICATION_RECORDS_KEY) || '{}'));
      return apps.filter(a => a.currentStage < 6).length;
    } catch { return 0; }
  })();

  const serviceFrequency = (() => {
    try {
      const apps = Object.values(JSON.parse(localStorage.getItem(APPLICATION_RECORDS_KEY) || '{}'));
      const freq = {};
      apps.forEach(a => { freq[a.service] = (freq[a.service] || 0) + 1; });
      return Object.entries(freq).sort((x, y) => y[1] - x[1]).slice(0, 5);
    } catch { return []; }
  })();

  const maxFreq = serviceFrequency[0]?.[1] || 1;

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #e2e8f0',
      borderRadius: '18px',
      overflow: 'hidden',
      marginTop: '28px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ fontSize: '28px' }}>📊</div>
        <div>
          <div style={{ color: '#86efac', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>ADMIN ANALYTICS</div>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>Revenue & Activity Dashboard</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 28px' }}>
        {[['overview', '📈 Overview'], ['services', '🏆 Top Services']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '14px 20px 12px',
            fontSize: '12px', fontWeight: 700,
            color: activeTab === id ? '#022c7a' : '#64748b',
            borderBottom: activeTab === id ? '2px solid #022c7a' : '2px solid transparent',
            background: 'none', border: 'none', borderBottom: activeTab === id ? '2px solid #022c7a' : '2px solid transparent', cursor: 'pointer'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '24px 28px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Customers', value: stats.customers, icon: '👥', color: '#eff6ff', textColor: '#1e40af', suffix: '' },
              { label: 'Token Bookings', value: tokenBookings.length, icon: '🎫', color: '#fff7ed', textColor: '#c2410c', suffix: '' },
              { label: 'Token Revenue', value: totalRevenue, icon: '💰', color: '#f0fdf4', textColor: '#15803d', prefix: '₹' },
              { label: 'Completed Apps', value: completedApps, icon: '✅', color: '#f0fdf4', textColor: '#15803d', suffix: '' },
              { label: 'Pending Apps', value: pendingApps, icon: '⏳', color: '#fefce8', textColor: '#b45309', suffix: '' },
              { label: 'Rating', value: null, icon: '⭐', color: '#fff7ed', textColor: '#d97706', custom: '4.9 / 5.0' },
            ].map(({ label, value, icon, color, textColor, prefix, suffix, custom }) => (
              <div key={label} style={{ background: color, borderRadius: '14px', padding: '18px 16px', border: `1px solid ${color}` }}>
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: textColor, fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>
                  {custom || <>{prefix || ''}<AnimatedNumber target={value} />{suffix || ''}</>}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '16px' }}>Most Requested Services</div>
            {serviceFrequency.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No application data yet. Applications will appear here.</div>
            ) : serviceFrequency.map(([service, count], i) => (
              <div key={service} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>#{i + 1} {service}</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#022c7a' }}>{count}</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxFreq) * 100}%`, background: 'linear-gradient(90deg, #022c7a, #16a34a)', borderRadius: '6px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
