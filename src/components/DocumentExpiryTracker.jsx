import React, { useState, useEffect } from 'react';
import { ShieldAlert, Calendar, PlusCircle, Trash2, CheckCircle2, Clock, MessageCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { subscribeExpiryDocuments, saveExpiryDocumentCloud, deleteExpiryDocumentCloud } from '../utils/firebaseService';

const DOC_TYPES = [
  'வருமானச் சான்றிதழ் (Income Certificate)',
  'சாதிச் சான்றிதழ் (Community Certificate)',
  'இருப்பிடச் சான்றிதழ் (Nativity Certificate)',
  'முதல் பட்டதாரி சான்றிதழ் (First Graduate)',
  'ஓட்டுநர் உரிமம் (Driving License / DL)',
  'ஸ்மார்ட் ரேஷன் கார்டு (Smart Ration Card)',
  'பாஸ்போர்ட் (Passport)',
  'வாகனக் காப்பீடு (Vehicle Insurance)'
];

export default function DocumentExpiryTracker({ onBookTokenForRenewal }) {
  const [documents, setDocuments] = useState([]);
  const [docName, setDocName] = useState(DOC_TYPES[0]);
  const [certNo, setCertNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeExpiryDocuments((cloudDocs) => {
      if (Array.isArray(cloudDocs)) {
        setDocuments(cloudDocs);
      } else {
        setDocuments([]);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!expiryDate) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      docName,
      certNo: certNo.trim() || 'N/A',
      expiryDate
    };

    saveExpiryDocumentCloud(newDoc);
    setCertNo('');
    setExpiryDate('');
  };

  const handleDeleteDocument = async (id) => {
    await deleteExpiryDocumentCloud(id);
  };

  const getExpiryStatus = (expDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expDateStr);
    expDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `காலாவதியானது (${Math.abs(diffDays)} நாட்களுக்கு முன்)`, color: '#dc2626', bg: '#fef2f2', border: '#fecaca', type: 'expired' };
    } else if (diffDays <= 30) {
      return { label: `விரைவில் காலாவதியாகிறது (${diffDays} நாட்களில்)`, color: '#d97706', bg: '#fffbe6', border: '#ffe58f', type: 'warning' };
    } else {
      return { label: `செல்லுபடியாகும் (${diffDays} நாட்கள் பாக்கி)`, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', type: 'valid' };
    }
  };

  const handleSendWhatsAppRenewal = (doc) => {
    const text = encodeURIComponent(
      `🏛️ *AkEsevai மையம், பழனி*\n` +
      `*சான்றிதழ் புதுப்பித்தல் (Renewal Request)*\n\n` +
      `சான்றிதழ் பெயர்: *${doc.docName}*\n` +
      `சான்றிதழ் எண்: *${doc.certNo}*\n` +
      `காலாவதி தேதி: *${doc.expiryDate}*\n\n` +
      `வணக்கம்! எனது இ-சேவை சான்றிதழைப் புதுப்பிக்க டோக்கன் பதிவு செய்ய விரும்புகிறேன்.`
    );
    window.open(`https://wa.me/919342318844?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      background: 'white',
      border: '2px solid #0052cc',
      borderRadius: '20px',
      padding: '24px',
      margin: '24px 0',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    }}>
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
        <span style={{
          background: '#eff6ff',
          color: '#0052cc',
          border: '1px solid #bfdbfe',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Clock size={14} /> CERTIFICATE RENEWAL TRACKER
        </span>
        <h3 style={{ font: '800 22px Manrope', color: '#022c7a', margin: '6px 0 0' }}>
          ஆவணக் காலாவதி <span>& புதுப்பித்தல் நினைவூட்டல்</span>
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
          உங்கள் அரசுச் சான்றிதழ்களின் காலாவதி தேதிகளைச் சேமித்து வைத்து, முன்கூட்டியே புதுப்பிக்கலாம்.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
        {/* ADD DOCUMENT FORM */}
        <form onSubmit={handleAddDocument} style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <h4 style={{ font: '800 15px Manrope', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={18} color="#0052cc" /> புதிய ஆவணத்தைச் சேர்க்க:
          </h4>

          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            சான்றிதழ் / ஆவண வகை (Document Type)
            <select
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', background: 'white' }}
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            சான்றிதழ் / பதிவு எண் (Certificate / Application No)
            <input
              type="text"
              placeholder="எ.கா: TN-7202601004"
              value={certNo}
              onChange={(e) => setCertNo(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
            />
          </label>

          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            காலாவதி தேதி (Expiry Date) *
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
            />
          </label>

          <button
            type="submit"
            style={{
              background: '#0052cc',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '6px'
            }}
          >
            <PlusCircle size={16} /> ஆவணத்தைச் சேமிக்க (Add Document)
          </button>
        </form>

        {/* DOCUMENT LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ font: '800 15px Manrope', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', justify: 'space-between' }}>
            <span>📋 சேமிக்கப்பட்ட ஆவணங்கள் ({documents.length})</span>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>🔒 Local & Private Browser Storage</span>
          </h4>

          {documents.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              ஆவணங்கள் எதுவும் சேர்க்கப்படவில்லை.
            </div>
          ) : (
            documents.map((doc) => {
              const status = getExpiryStatus(doc.expiryDate);
              return (
                <div
                  key={doc.id}
                  style={{
                    background: 'white',
                    border: `1px solid ${status.border}`,
                    borderLeft: `5px solid ${status.color}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                        {doc.docName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        எண்: <strong>{doc.certNo}</strong> • காலாவதி: {doc.expiryDate}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      title="நீக்கு (Delete)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{
                      background: status.bg,
                      color: status.color,
                      border: `1px solid ${status.border}`,
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {status.type === 'expired' && <AlertTriangle size={12} />}
                      {status.type === 'warning' && <Clock size={12} />}
                      {status.type === 'valid' && <CheckCircle2 size={12} />}
                      {status.label}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleSendWhatsAppRenewal(doc)}
                        style={{
                          background: '#25D366',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <MessageCircle size={14} /> WhatsApp புதுப்பித்தல்
                      </button>

                      {typeof onBookTokenForRenewal === 'function' && (
                        <button
                          onClick={() => onBookTokenForRenewal(doc)}
                          style={{
                            background: '#0052cc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={14} /> டோக்கன் எடு
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
