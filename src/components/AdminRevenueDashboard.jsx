import React, { useState, useEffect } from 'react';
import { getStoredApplications } from '../utils/statusStore';

function AnimatedNumber({ target, duration = 1800 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = (target || 0) / (duration / 16);
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
  const [appsData, setAppsData] = useState(() => Object.values(getStoredApplications() || {}));
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const refresh = () => setAppsData(Object.values(getStoredApplications() || {}));
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = tokenBookings.length * 50;
  const completedApps = appsData.filter(a => a && a.currentStage === 6).length;
  const pendingApps = appsData.filter(a => a && a.currentStage < 6).length;

  const serviceFrequency = (() => {
    const freq = {};
    appsData.forEach(a => {
      if (a && a.service) {
        freq[a.service] = (freq[a.service] || 0) + 1;
      }
    });
    return Object.entries(freq).sort((x, y) => y[1] - x[1]).slice(0, 5);
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
            background: 'none', border: 'none', cursor: 'pointer'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '24px 28px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Applications', value: appsData.length, icon: '📋', color: '#eff6ff', textColor: '#1e40af', suffix: '' },
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
