import React, { useState } from 'react';
import { Calculator, Clock, IndianRupee, FileCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const serviceData = {
  ' வருமானச் சான்று (Income Certificate)': {
    govtFee: 60,
    processDays: '3 - 7 வேலை நாட்கள்',
    docs: ['ஆதார் அட்டை நகல்', 'குடும்ப அட்டை (Smart Card)', 'சம்பளச் சான்று / வங்கி கணக்கு புத்தகம்', 'பாஸ்போர்ட் அளவு புகைப்படம்'],
    note: 'மாணவர் கல்வி உதவித்தொகை மற்றும் அரசு திட்டங்களுக்கு அத்தியாவசியமானது.'
  },
  ' சாதிச் சான்று (Community Certificate)': {
    govtFee: 60,
    processDays: '3 - 5 வேலை நாட்கள்',
    docs: ['ஆதார் அட்டை நகல்', 'பெற்றோர் சாதிச் சான்று நகல்', 'குடும்ப அட்டை நகல்', 'பள்ளி மாற்றுச் சான்றிதழ் (TC)'],
    note: 'பள்ளி / கல்லூரி சேர்க்கை மற்றும் அரசு வேலைவாய்ப்புகளுக்குத் தேவை.'
  },
  ' இருப்பிடச் சான்று (Nativity / Residence)': {
    govtFee: 60,
    processDays: '3 - 7 வேலை நாட்கள்',
    docs: ['ஆதார் அட்டை நகல்', 'குடும்ப அட்டை நகல்', 'வாக்காளர் அட்டை / EB பில் / வீட்டு வரி ரசீது', 'புகைப்படம்'],
    note: 'இருப்பிடச் சான்றளிப்பிற்கு VAO சரிபார்ப்பு தேவைப்படும்.'
  },
  ' ஆதாரில் முகவரி / மொபைல் மாற்றம்': {
    govtFee: 50,
    processDays: '2 - 5 வேலை நாட்கள்',
    docs: ['ஆதார் அட்டை அசல்', 'புதிய முகவரி சான்று (Smart Card / Voter ID / Passbook)', 'இணைக்கப்பட வேண்டிய மொபைல் எண்'],
    note: 'மொபைல் எண்ணிற்கு OTP வரும். அசல் ஆவணங்களை நேரில் கொண்டு வரவும்.'
  },
  ' புதிய குடும்ப அட்டை (Smart Ration Card)': {
    govtFee: 100,
    processDays: '15 - 30 வேலை நாட்கள்',
    docs: ['அனைத்து உறுப்பினர்களின் ஆதார் அட்டை', 'திருமணச் சான்றிதழ் / பெற்றோர் கார்டில் பெயர் நீக்கல் சான்று', 'வாடகை ஒப்பந்தம் / EB பில்', 'குடும்பத் தலைவர் புகைப்படம்'],
    note: 'பெயர் நீக்கல் சான்று இருந்தால் புதிய அட்டை விரைவாக ஒப்புதல் பெறலாம்.'
  },
  ' பட்டா & சிட்டா நகல் (Patta & Chitta)': {
    govtFee: 60,
    processDays: 'உடனடி (Same Day)',
    docs: ['நிலத்தின் சர்வே எண் (Survey No)', 'கிராமம் & தாலுகா விவரம்', 'பழைய பட்டா எண் அல்லது பத்திர நகல்'],
    note: 'உடனடியாக ஆன்லைனில் பதிவிறக்கம் செய்து அச்சிட்டுத் தரப்படும்.'
  }
};

export default function ServiceCalculatorWidget({ navigate }) {
  const [selectedService, setSelectedService] = useState(' வருமானச் சான்று (Income Certificate)');
  const [checkedDocs, setCheckedDocs] = useState({});

  const info = serviceData[selectedService] || serviceData[' வருமானச் சான்று (Income Certificate)'];

  const toggleDoc = (doc) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const totalDocs = info.docs.length;
  const readyDocs = info.docs.filter((d) => checkedDocs[d]).length;
  const readinessPercent = Math.round((readyDocs / totalDocs) * 100);

  return (
    <div className="calculator-widget-card">
      <div className="calculator-header">
        <div className="calculator-badge">
          <Calculator size={16} /> நேரடிக் கட்டண & ஆவணக் கணக்கீட்டுக் கருவி / INSTANT CALCULATOR
        </div>
        <h3 className="calculator-title">
          சேவை தேர்வு செய்து <span>கட்டணம் & தேவையான ஆவணங்களை அறியவும்</span>
        </h3>
        <p className="calculator-sub">
          உங்களுக்கு தேவையான சேவையைத் தேர்ந்தெடுத்து, தேவைப்படும் அரசு கட்டணம், நாட்கள் மற்றும் ஆவண சரிபார்ப்பு பட்டியலை உடனடியாகப் பாருங்கள்.
        </p>
      </div>

      <div className="calculator-body-grid">
        {/* LEFT SELECTOR FORM */}
        <div className="calculator-left-form">
          <label className="calc-label">
            சேவையைத் தேர்ந்தெடுக்கவும் / Select Service:
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setCheckedDocs({});
              }}
              className="calc-select"
            >
              {Object.keys(serviceData).map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </label>

          <div className="calc-metrics-row">
            <div className="metric-box">
              <span className="metric-icon green"><IndianRupee size={18} /></span>
              <div>
                <small>அரசு & சேவை கட்டணம்</small>
                <strong>₹{info.govtFee} மட்டுமே</strong>
              </div>
            </div>

            <div className="metric-box">
              <span className="metric-icon blue"><Clock size={18} /></span>
              <div>
                <small>எதிர்பார்க்கும் நாட்கள்</small>
                <strong>{info.processDays}</strong>
              </div>
            </div>
          </div>

          <div className="readiness-progress-box">
            <div className="progress-top">
              <span>ஆவணத் தயார்நிலை (Readiness): <strong>{readinessPercent}% Ready</strong></span>
              <small>{readyDocs} of {totalDocs} Checked</small>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${readinessPercent}%`,
                  background: readinessPercent === 100 ? '#16a34a' : 'linear-gradient(90deg, #f59e0b, #10b981)'
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT CHECKLIST BLOCK */}
        <div className="calculator-right-checklist">
          <h4 className="checklist-title">
            <FileCheck size={17} style={{ color: '#16a34a' }} /> தேவைப்படும் அசல் ஆவணங்கள் (Checklist):
          </h4>

          <div className="docs-interactive-list">
            {info.docs.map((doc) => (
              <label
                key={doc}
                className={`doc-check-item ${checkedDocs[doc] ? 'checked-item' : ''}`}
                onClick={() => toggleDoc(doc)}
              >
                <input
                  type="checkbox"
                  checked={!!checkedDocs[doc]}
                  onChange={() => {}}
                />
                <span>{doc}</span>
              </label>
            ))}
          </div>

          <div className="calc-note-box">
            <AlertCircle size={15} /> <span>{info.note}</span>
          </div>

          <button
            className="button button-primary button-wide"
            onClick={() => {
              if (typeof navigate === 'function') {
                navigate('token-generator');
              }
            }}
            style={{ marginTop: '14px', background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)' }}
          >
            இச்சேவைக்கு டோக்கன் பெற / Book Token for ₹{info.govtFee} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
