import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle, PlusCircle, Send, X, ThumbsUp } from 'lucide-react';
import { subscribeCustomerReviews, saveCustomerReviewCloud } from '../utils/firebaseService';

export default function CustomerTestimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeCustomerReviews((cloudReviews) => {
      if (Array.isArray(cloudReviews)) {
        setReviews(cloudReviews);
      }
    });
    return () => unsubscribe();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [service, setService] = useState('ஆதார் சேவை (Aadhaar)');
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: name.trim(),
      place: place.trim() || 'பழனி',
      rating,
      service,
      comment: comment.trim(),
      date: 'இன்று (Just Now)'
    };

    saveCustomerReviewCloud(newRev);

    // Reset form state
    setName('');
    setPlace('');
    setComment('');
    setRating(5);
    setShowForm(false);
    setSuccessMsg('🎉 நன்றி! உங்கள் மதிப்பீடு வெற்றிகரமாகப் பதிவிடப்பட்டது.');

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="testimonials-section-card">
      <div className="testimonials-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span className="testimonials-kicker">
            <ShieldCheck size={16} /> வாடிக்கையாளர் மதிப்புரைகள் / CITIZEN REVIEWS
          </span>
          <h3 className="testimonials-title">
            எங்கள் சேவையைப் பெற்ற <span>மக்களின் கருத்துகள் (4.9 ★★★★★)</span>
          </h3>
          <p className="testimonials-sub">
            பழனி மற்றும் சுற்றுவட்டாரப் பகுதிகளில் AkEsevai மையத்தில் சேவை பெற்ற வாடிக்கையாளர்களின் கருத்துகள்.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="button button-primary"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', whiteSpace: 'nowrap' }}
        >
          {showForm ? <X size={17} /> : <PlusCircle size={17} />}
          {showForm ? 'மூடுக / Close' : '✍️ உங்கள் கருத்து / Add Review'}
        </button>
      </div>

      {successMsg && (
        <div style={{ background: '#dcfce7', border: '1.5px solid #86efac', color: '#14532d', padding: '12px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThumbsUp size={18} /> {successMsg}
        </div>
      )}

      {/* REVIEW SUBMISSION FORM BOX */}
      {showForm && (
        <div style={{ background: '#f8fafc', border: '2px solid #93c5fd', borderRadius: '14px', padding: '24px', marginBottom: '25px', boxShadow: '0 8px 24px rgba(0,82,204,0.08)' }}>
          <h4 style={{ font: '800 18px Manrope', color: '#022c7a', margin: '0 0 6px', textAlign: 'left' }}>
            ✍️ உங்கள் மதிப்பீட்டைப் பதிவிடவும் / Submit Your Review
          </h4>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px', textAlign: 'left' }}>
            AkEsevai மையத்தில் நீங்கள் பெற்ற சேவை அனுபவத்தைப் பகிர்ந்து கொள்ளவும்.
          </p>

          <form onSubmit={handleSubmitReview} style={{ display: 'grid', gap: '14px', textAlign: 'left' }}>
            {/* STAR RATING PICKER */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                நட்சத்திர மதிப்பீடு / Rating:
              </label>
              <div style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{ transition: 'transform 0.15s', transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)' }}
                  />
                ))}
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#b45309', marginLeft: '10px' }}>
                  {rating}.0 Stars
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                உங்கள் பெயர் / Full Name *
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="உதாரணம்: முருகன் K."
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
                />
              </label>

              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                ஊர் / பகுதி (Place)
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="உதாரணம்: பழனி / சண்முகபுரம்"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '13px', outline: 'none' }}
                />
              </label>
            </div>

            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              பெற்ற சேவை / Service Received
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '13px', outline: 'none', background: 'white' }}
              >
                <option>ஆதார் சேவை (Aadhaar Update / Enrolment)</option>
                <option>வருமானச் சான்று / சாதிச் சான்று (Certificates)</option>
                <option>ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card)</option>
                <option>பாஸ்போர்ட் / PAN கார்டு (Passport / PAN)</option>
                <option>நலவாரியப் பதிவு & ஓய்வூதியம் (Welfare / Pension)</option>
                <option>TNPSC / தேர்வு விண்ணப்பங்கள் (Exam Application)</option>
                <option>பொது சேவை (General Service)</option>
              </select>
            </label>

            <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              உங்கள் கருத்து / Review Comment *
              <textarea
                required
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="எங்கள் சேவையைப்பற்றிய உங்கள் அனுபவம் அல்லது திருப்தியை எழுதவும்..."
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
              />
            </label>

            <button
              type="submit"
              className="button button-primary"
              style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', justifySelf: 'start', padding: '10px 24px' }}
            >
              <Send size={16} /> மதிப்பீட்டைச் சமர்ப்பி / Submit Review
            </button>
          </form>
        </div>
      )}

      {/* REVIEWS GRID DISPLAY */}
      <div className="testimonials-grid">
        {reviews.map((item) => (
          <div key={item.id} className="testimonial-card">
            <div className="card-top-stars">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span className="rating-badge-num">{item.rating}.0</span>
            </div>

            <p className="comment-text">"{item.comment}"</p>

            <div className="user-meta-row">
              <div className="user-avatar-circle">
                {item.name.charAt(0)}
              </div>
              <div className="user-info-text">
                <strong>{item.name} <CheckCircle size={13} style={{ color: '#16a34a', display: 'inline' }} /></strong>
                <small>{item.service} • {item.place}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
