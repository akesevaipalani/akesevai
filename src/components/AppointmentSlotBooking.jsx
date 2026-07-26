import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { saveApplicationRecord } from '../utils/statusStore';

const TIME_SLOTS = [
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM'
];

const SERVICES_LIST = [
  'வருமானச் சான்றிதழ் (Income Certificate)',
  'சாதிச் சான்றிதழ் (Community Certificate)',
  'இருப்பிடச் சான்றிதழ் (Nativity Certificate)',
  'ஆதார் மொபைல் / முகவரி மாற்றம்',
  'புதிய ரேஷன் கார்டு / திருத்தம்',
  'பாஸ்போர்ட் அப்பாயிண்ட்மெண்ட்',
  'TNPSC / போட்டித்தேர்வு விண்ணப்பம்'
];

export default function AppointmentSlotBooking({ notify, onBooked }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedSuccess, setBookedSuccess] = useState(null);

  // Load booked slots for selected date
  useEffect(() => {
    try {
      const allBookings = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
      const dateBookings = allBookings
        .filter(b => b.date === selectedDate)
        .map(b => b.slot);
      setBookedSlots(dateBookings);
    } catch {
      setBookedSlots([]);
    }
  }, [selectedDate]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length !== 10 || !selectedSlot || !selectedService) {
      if (typeof notify === 'function') notify('⚠️ தயவுசெய்து அனைத்து விவரங்களையும் சரியாக உள்ளிடவும்.');
      return;
    }

    const tokenNo = `SLOT-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking = {
      tokenNo,
      customerName: name,
      phone,
      service: selectedService,
      date: selectedDate,
      slot: selectedSlot,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('akesevai-token-bookings', JSON.stringify(existing));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    // Save record to central store as well
    saveApplicationRecord({
      id: tokenNo,
      applicantName: name,
      phone,
      service: selectedService,
      statusLabel: `அப்பாயிண்ட்மெண்ட் முன்பதிவு (${selectedSlot})`,
      currentStage: 1,
      remarks: `${selectedDate} அன்று ${selectedSlot} நேரத்தில் முன்பதிவு செய்யப்பட்டது.`
    });

    setBookedSuccess(newBooking);
    if (typeof notify === 'function') notify('🎉 அப்பாயிண்ட்மெண்ட் வெற்றி பெற முன்பதிவு செய்யப்பட்டது!');
    if (typeof onBooked === 'function') onBooked(newBooking);
  };

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
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ fontSize: '28px' }}>📅</div>
        <div>
          <div style={{ color: '#38bdf8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>WALK-IN SLOT BOOKING</div>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 800, fontFamily: 'Manrope, sans-serif' }}>நேரடி அப்பாயிண்ட்மெண்ட் முன்பதிவு</div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>மையத்தில் வரிசையில் நிற்பதைத் தவிர்க்க உங்கள் நேரத்தைத் தேர்ந்தெடுக்கவும்.</div>
        </div>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {bookedSuccess ? (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
            <CheckCircle size={44} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ font: '800 20px Manrope', color: '#15803d', margin: '0 0 6px' }}>முன்பதிவு உறுதி செய்யப்பட்டது!</h3>
            <p style={{ fontSize: '13px', color: '#166534', margin: '0 0 16px' }}>
              அப்பாயிண்ட்மெண்ட் எண்: <strong>{bookedSuccess.tokenNo}</strong> | நாள்: <strong>{bookedSuccess.date}</strong> | நேரம்: <strong>{bookedSuccess.slot}</strong>
            </p>
            <button
              onClick={() => { setBookedSuccess(null); setSelectedSlot(''); }}
              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
            >
              மற்றொரு முன்பதிவு செய்ய
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>📅 தேதியைத் தேர்ந்தெடுக்கவும்:</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>📋 சேவையைத் தேர்ந்தெடுக்கவும்:</label>
                <select
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- சேவையைத் தேர்ந்தெடுக்கவும் --</option>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '8px' }}>⏰ நேரத்தைத் தேர்ந்தெடுக்கவும் (Time Slot):</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {TIME_SLOTS.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #022c7a' : '1px solid #cbd5e1',
                        background: isBooked ? '#f1f5f9' : isSelected ? '#eff6ff' : 'white',
                        color: isBooked ? '#94a3b8' : isSelected ? '#022c7a' : '#334155',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '12px',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {slot} {isBooked ? '(Full)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>👤 பெயர் (Applicant Name):</label>
                <input
                  type="text"
                  placeholder="உங்கள் பெயர்"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>📞 கைபேசி எண் (Mobile Number):</label>
                <input
                  type="tel"
                  placeholder="10 இலக்க எண்"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || phone.replace(/\D/g, '').length !== 10 || !selectedSlot || !selectedService}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: (!name.trim() || phone.replace(/\D/g, '').length !== 10 || !selectedSlot || !selectedService) ? 'not-allowed' : 'pointer',
                opacity: (!name.trim() || phone.replace(/\D/g, '').length !== 10 || !selectedSlot || !selectedService) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              📅 அப்பாயிண்ட்மெண்ட் முன்பதிவு செய்க <ChevronRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
