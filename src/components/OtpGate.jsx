import { useState } from 'react';
import { ArrowRight, LockKeyhole, Phone, ShieldCheck } from 'lucide-react';

export default function OtpGate({ onVerified, notify }) {
  const [phone, setPhone] = useState('');

  const handleDirectLogin = (event) => {
    if (event) event.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      notify('Please enter a valid 10-digit mobile number / 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.');
      return;
    }
    notify('✅ மொபைல் எண் சரிபார்க்கப்பட்டது! AkEsevai வாடிக்கையாளர் தளத்திற்கு நல்வரவு.');
    onVerified(cleanedPhone);
  };

  return (
    <div className="otp-gate" role="dialog" aria-modal="true">
      <div className="otp-gate-card">
        <div className="otp-gate-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="otp-gate-logo" style={{ margin: 0 }}>
            <LockKeyhole size={20} />
          </div>
        </div>

        <span className="section-kicker">CUSTOMER PORTAL ENTRY</span>
        <h2>வாடிக்கையாளர் தளம் / Customer Portal</h2>
        <p>Enter your 10-digit mobile number to open your customer account dashboard directly.</p>

        <form onSubmit={handleDirectLogin}>
          <label>
            Mobile Number / மொபைல் எண்
            <div className="otp-phone-input">
              <span>+91</span>
              <input
                autoFocus
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
              />
            </div>
          </label>

          <button className="button button-primary button-wide" type="submit" style={{ marginTop: '18px' }}>
            வாடிக்கையாளர் தளம் நுழைக / Direct Login <ArrowRight size={17} />
          </button>

          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <small className="otp-note" style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>உடனடி நேரடி உள்நுழைவு (WhatsApp OTP தேவையில்லை / No OTP required)</span>
            </small>
          </div>
        </form>

        <div className="otp-support" style={{ marginTop: '20px' }}>
          <Phone size={13} /> Need assistance? Call 93423 18844
        </div>
      </div>
    </div>
  );
}
