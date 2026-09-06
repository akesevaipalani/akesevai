import React, { useState, useMemo } from 'react';
import {
  Search, X, Check, Copy, ExternalLink, ArrowRight, FileText,
  AlertCircle, ShieldCheck, HelpCircle, ChevronRight, Layers,
  Info, CheckCircle2, Building, Sparkles, SlidersHorizontal, KeyRound
} from 'lucide-react';
import {
  GOVERNMENT_SERVICES,
  SERVICE_CATEGORIES,
  searchGovernmentServices
} from '../data/governmentServicesData';
import '../styles/GovernmentServiceSelector.css';

export default function GovernmentServiceSelector({
  lang = 'ta',
  onSelectService,
  selectedServiceId = '',
  selectedServiceName = '',
  onClose,
  isModal = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(() => {
    if (selectedServiceId) {
      return GOVERNMENT_SERVICES.find(s => s.id === selectedServiceId) || null;
    }
    if (selectedServiceName) {
      return GOVERNMENT_SERVICES.find(s =>
        s.nameEn.toLowerCase() === selectedServiceName.toLowerCase() ||
        s.nameTa === selectedServiceName ||
        selectedServiceName.includes(s.nameEn) ||
        selectedServiceName.includes(s.nameTa)
      ) || null;
    }
    return null;
  });

  const [checkedDocs, setCheckedDocs] = useState({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filtered services list
  const filteredServices = useMemo(() => {
    return searchGovernmentServices(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  const toggleDocCheck = (docName) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setCheckedDocs({});
  };

  const handleConfirmSelection = (service) => {
    const targetService = service || selectedService;
    if (!targetService) return;
    if (typeof onSelectService === 'function') {
      onSelectService(targetService);
    }
    if (onClose) onClose();
  };

  const copyDocumentChecklist = () => {
    if (!selectedService) return;
    const isTa = lang === 'ta';
    const reqDocs = isTa && selectedService.requiredDocumentsTa?.length
      ? selectedService.requiredDocumentsTa
      : selectedService.requiredDocuments || [];

    const prereqs = isTa && selectedService.prerequisitesTa?.length
      ? selectedService.prerequisitesTa
      : selectedService.prerequisites || [];

    let text = `📋 ${isTa ? selectedService.nameTa : selectedService.nameEn} (${selectedService.id})\n` +
      `🏛️ ${isTa ? selectedService.departmentTa : selectedService.department}\n\n`;

    if (reqDocs.length > 0) {
      text += `${isTa ? 'தேவையான ஆவணங்கள் (Required Documents):' : 'Required Documents Checklist:'}\n` +
        reqDocs.map((d, i) => `${i + 1}. ${d}`).join('\n') + '\n\n';
    } else {
      text += `${isTa ? '✅ ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை (Zero Document Upload Required)' : '✅ No Document Upload Required'}\n\n`;
    }

    if (prereqs.length > 0) {
      text += `${isTa ? '🔑 முன்நிபந்தனைகள் / தேவைப்படும் தகவல்கள் (Prerequisites & Details):' : '🔑 Prerequisites & Details:'}\n` +
        prereqs.map((p, i) => `• ${p}`).join('\n') + '\n\n';
    }

    if (selectedService.notesTa || selectedService.notesEn) {
      text += `📌 ${isTa ? 'குறிப்பு:' : 'Note:'} ${isTa ? selectedService.notesTa : selectedService.notesEn}\n\n`;
    }

    text += `- AK E-SEVAI Application Assistance (Citizen Facilitation)`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  const isTa = lang === 'ta';

  return (
    <div className={`gov-service-selector-root ${isModal ? 'is-modal-layout' : 'is-embedded-layout'}`}>
      {/* Top Header / Search Toolbar */}
      <div className="selector-toolbar">
        <div className="selector-header-title">
          <div className="title-with-badge">
            <span className="gov-icon-badge">🏛️</span>
            <div>
              <h3>{isTa ? 'தமிழ்நாடு அரசு சேவைகள் வழிகாட்டி (98 சேவைகள்)' : 'Tamil Nadu Government Service Facilitation (98 Options)'}</h3>
              <p>{isTa ? 'சேவையைத் தேர்வு செய்து தேவையான ஆவணங்கள் மற்றும் முன்நிபந்தனைகளை சரிபார்க்கவும்' : 'Select any service option to view eligibility, required documents, and prerequisites'}</p>
            </div>
          </div>
          {isModal && onClose && (
            <button className="selector-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="selector-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTa ? 'சேவை, துறை அல்லது குறியீட்டைத் தேடுக (எ.கா: வருமானம், TNEB, Smart Card, RTO, REV-101)...' : 'Search service, dept or code (e.g., Income, Electricity, Ration Card, DL, NAT-2008)...'}
            className="search-input"
            autoFocus={isModal}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
          <span className="results-badge">
            {filteredServices.length} {isTa ? 'சேவைகள்' : 'Services'}
          </span>
        </div>

        {/* Categories Carousel / Tabs */}
        <div className="selector-category-scroll">
          {SERVICE_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`category-chip ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{isTa ? cat.nameTa : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout (List + Interactive Details) */}
      <div className="selector-main-grid">
        {/* Left: Service List */}
        <div className="service-list-pane">
          {filteredServices.length > 0 ? (
            <div className="service-cards-stack">
              {filteredServices.map(service => {
                const isSelected = selectedService?.id === service.id;
                const reqDocsCount = service.requiredDocuments?.length || 0;
                const prereqsCount = service.prerequisites?.length || 0;

                return (
                  <div
                    key={service.id}
                    className={`service-summary-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="card-top-row">
                      <span className="dept-tag">
                        {isTa ? service.departmentTa : service.department}
                      </span>
                      <span className="service-id-tag">{service.id}</span>
                    </div>

                    <h4 className="service-card-title">
                      {isTa ? service.nameTa : service.nameEn}
                    </h4>
                    <p className="service-sub-title">
                      {isTa ? service.nameEn : service.nameTa}
                    </p>

                    <div className="card-footer-row">
                      <span className={`service-type-badge type-${(service.serviceType || '').toLowerCase().replace(/[^a-z]/g, '')}`}>
                        {service.serviceType || 'Facilitation'}
                      </span>
                      {reqDocsCount > 0 ? (
                        <span className="doc-count-tag">
                          📄 {reqDocsCount} {isTa ? 'ஆவணங்கள்' : 'Docs'}
                        </span>
                      ) : (
                        <span className="doc-count-tag" style={{ background: '#dcfce7', color: '#166534', borderColor: '#86efac' }}>
                          ⚡ {isTa ? 'ஆவணம் தேவையில்லை' : 'No Upload'}
                        </span>
                      )}
                      {prereqsCount > 0 && (
                        <span className="prereq-count-tag" style={{ fontSize: '11px', color: '#854d0e', background: '#fef9c3', padding: '2px 6px', borderRadius: '4px', border: '1px solid #fef08a' }}>
                          🔑 {prereqsCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-services-found">
              <AlertCircle size={32} className="no-results-icon" />
              <h4>{isTa ? 'சேவைகள் எதுவும் கண்டறியப்படவில்லை' : 'No matching services found'}</h4>
              <p>{isTa ? 'வேறு தேடல் சொற்களைப் பயன்படுத்தி முயற்சிக்கவும்.' : 'Try adjusting your search terms or category filter.'}</p>
              <button
                className="reset-search-btn"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              >
                {isTa ? 'அனைத்து சேவைகளையும் காட்டுக' : 'Show All Services'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Rich Service Details & Document Checklist Card */}
        <div className="service-details-pane">
          {selectedService ? (
            <div className="service-detail-sheet">
              {/* Sheet Top Badges */}
              <div className="sheet-header">
                <div className="sheet-dept-meta">
                  <span className="badge-dept">
                    🏛️ {isTa ? selectedService.departmentTa : selectedService.department}
                  </span>
                  <span className="badge-id">{selectedService.id}</span>
                  <span className={`badge-type type-${(selectedService.serviceType || '').toLowerCase().replace(/[^a-z]/g, '')}`}>
                    {selectedService.serviceType || 'e-Sevai Facilitation'}
                  </span>
                </div>

                <div className="sheet-title-group">
                  <h2 className="sheet-main-title">
                    {isTa ? selectedService.nameTa : selectedService.nameEn}
                  </h2>
                  <h3 className="sheet-sec-title">
                    {isTa ? selectedService.nameEn : selectedService.nameTa}
                  </h3>
                </div>
              </div>

              {/* Purpose & Description Box */}
              <div className="sheet-section description-section">
                <h5 className="section-label">
                  <Info size={14} /> {isTa ? 'சேவையின் நோக்கம் (Purpose)' : 'What This Service Is For'}
                </h5>
                <p className="section-text">
                  {isTa ? selectedService.descriptionTa : selectedService.descriptionEn}
                </p>
              </div>

              {/* Eligibility Box */}
              <div className="sheet-section eligibility-section">
                <h5 className="section-label">
                  <ShieldCheck size={14} /> {isTa ? 'விண்ணப்பிக்க தகுதியானவர்கள் (Eligibility)' : 'Who Can Apply (Eligibility)'}
                </h5>
                <p className="section-text">
                  {isTa ? selectedService.eligibilityTa : selectedService.eligibilityEn}
                </p>
              </div>

              {/* Variable Requirements Alert if applicable */}
              {selectedService.variableRequirements && (
                <div className="variable-warning-banner">
                  <AlertCircle size={18} className="warn-icon" />
                  <div>
                    <strong>{isTa ? '⚠️ தேவையான ஆவணங்கள் வழக்குக்கு ஏற்ப மாறுபடலாம்' : '⚠️ Required documents may vary by case'}</strong>
                    <p>{selectedService.variableRequirementsNoteTa || (isTa ? 'விண்ணப்பதாரரின் குறிப்பிட்ட சூழ்நிலைக்கு ஏற்ப கூடுதல் ஆவணங்கள் தேவைப்படலாம்.' : 'Additional supporting documents may be requested based on specific situation.')}</p>
                  </div>
                </div>
              )}

              {/* PREREQUISITES & REQUIRED INFORMATION (NO UPLOAD) */}
              {selectedService.prerequisites && selectedService.prerequisites.length > 0 && (
                <div className="sheet-section prerequisites-section" style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <KeyRound size={16} color="#854d0e" />
                    <h5 style={{ margin: 0, font: '800 13px Manrope', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {isTa ? '🔑 முன்நிபந்தனைகள் & தேவைப்படும் தகவல்கள் (Prerequisites / தகவல்கள் மட்டும்)' : '🔑 Prerequisites & Details (Information Only — No Upload)'}
                    </h5>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '11.5px', color: '#a16207' }}>
                    {isTa
                      ? 'கீழே உள்ளவை ஆவணப் பதிவேற்றம் அல்ல; இச்சேவைக்கு விண்ணப்பிக்க தேவையான எண்கள் / தகவல்கள் / நிபந்தனைகள் ஆகும்:'
                      : 'The following are mandatory details/conditions to process the service (NOT document uploads):'}
                  </p>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    {(isTa && selectedService.prerequisitesTa?.length ? selectedService.prerequisitesTa : selectedService.prerequisites).map((item, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#713f12', lineHeight: 1.4 }}>
                        <span style={{ color: '#ca8a04', fontWeight: 900 }}>•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Required Documents Checklist */}
              <div className="sheet-section documents-section">
                <div className="docs-header-row">
                  <h5 className="section-label">
                    <FileText size={14} /> {isTa ? 'தேவையான ஆவணங்களின் பட்டியல் (Required Checklist)' : 'Required Documents Checklist'}
                  </h5>
                  <button
                    type="button"
                    className="copy-checklist-btn"
                    onClick={copyDocumentChecklist}
                    title="Copy document checklist to clipboard"
                  >
                    {copiedNotification ? (
                      <>
                        <CheckCircle2 size={13} color="#16a34a" /> {isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> {isTa ? 'பட்டியலை நகலெடு (Copy)' : 'Copy List'}
                      </>
                    )}
                  </button>
                </div>

                {selectedService.requiredDocuments && selectedService.requiredDocuments.length > 0 ? (
                  <div className="docs-checklist-box">
                    {(isTa && selectedService.requiredDocumentsTa?.length ? selectedService.requiredDocumentsTa : selectedService.requiredDocuments).map((doc, idx) => {
                      const isChecked = !!checkedDocs[doc];
                      return (
                        <label key={idx} className={`doc-check-item ${isChecked ? 'doc-is-checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDocCheck(doc)}
                          />
                          <span className="doc-num">{idx + 1}.</span>
                          <span className="doc-name">{doc}</span>
                          <span style={{ marginLeft: 'auto', background: '#fee2e2', color: '#991b1b', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                            {isTa ? 'கட்டாயம்' : 'Required'}
                          </span>
                          {isChecked && <Check size={14} className="check-indicator" />}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px', textAlign: 'center', margin: '8px 0' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#15803d' }}>
                      ⚡ {isTa ? 'இச்சேவைக்கு ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை!' : 'No document upload required for this service!'}
                    </p>
                    <small style={{ color: '#166534', fontSize: '11.5px', display: 'block', marginTop: '4px' }}>
                      {isTa ? 'மேலே உள்ள முன்நிபந்தனைகள் / பதிவு எண்களை மட்டும் சரிபார்த்து விண்ணப்பிக்கலாம்.' : 'Direct online search / token booking / digital processing using prerequisites above.'}
                    </small>
                  </div>
                )}

                {/* Conditional Documents */}
                {selectedService.conditionalDocuments && selectedService.conditionalDocuments.length > 0 && (
                  <div className="conditional-docs-block" style={{ marginTop: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px' }}>
                    <h6 style={{ margin: '0 0 8px', font: '800 12px Manrope', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⚠️ {isTa ? 'நிபந்தனைக்குட்பட்ட ஆவணங்கள் (Conditional Documents – Required only if):' : 'Conditional Documents (Required only if applicable):'}
                    </h6>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedService.conditionalDocuments.map((cond, cIdx) => (
                        <div key={cIdx} style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '8px 10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', display: 'block' }}>
                            📌 {isTa ? cond.conditionTa || cond.condition : cond.condition}:
                          </span>
                          <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>
                            👉 {isTa ? cond.requirementTa || cond.requirement : cond.requirement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional / Supporting Documents */}
                {selectedService.optionalDocuments && selectedService.optionalDocuments.length > 0 && (
                  <div className="optional-docs-block" style={{ marginTop: '12px' }}>
                    <h6>{isTa ? 'கூடுதல் / விருப்ப ஆவணங்கள் (Optional Documents):' : 'Additional / Optional Documents:'}</h6>
                    <ul>
                      {(isTa && selectedService.optionalDocumentsTa?.length ? selectedService.optionalDocumentsTa : selectedService.optionalDocuments).map((optDoc, oIdx) => (
                        <li key={oIdx}>• {optDoc} <span style={{ fontSize: '10px', color: '#64748b' }}>({isTa ? 'விருப்பம்' : 'Optional'})</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Notes & Validity */}
              {(selectedService.notesTa || selectedService.notesEn) && (
                <div className="sheet-section notes-section">
                  <h5 className="section-label">
                    <HelpCircle size={14} /> {isTa ? 'முக்கிய குறிப்பு & சான்றிதழ் செல்லுபடி காலம்' : 'Important Notes & Validity'}
                  </h5>
                  <p className="notes-text">
                    {isTa ? selectedService.notesTa : selectedService.notesEn}
                  </p>
                </div>
              )}

              {/* Official Source & Legal Disclaimer */}
              <div className="sheet-official-source-box">
                <div className="official-source-text">
                  <span>🏛️ {isTa ? 'அதிகாரப்பூர்வ அரசு தளம்:' : 'Official Department Portal:'} </span>
                  <a
                    href={selectedService.officialPortalUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="official-portal-link"
                  >
                    {selectedService.officialSource} <ExternalLink size={12} />
                  </a>
                </div>
                <small className="assistance-disclaimer">
                  {isTa
                    ? '🛡️ AK E-SEVAI என்பது தனியார் குடிமக்கள் சேவை மற்றும் வழிகாட்டுதல் மையமாகும். அரசு சட்டப்பூர்வ கட்டணங்கள் துறையின் விதிகளுக்கு உட்பட்டவை.'
                    : '🛡️ AK E-SEVAI is an independent citizen facilitation & digital assistance centre. Official government statutory fees apply as per actual department norms.'}
                </small>
              </div>

              {/* Action Toolbar */}
              <div className="sheet-actions-bar">
                <button
                  type="button"
                  className="btn-select-continue"
                  onClick={() => handleConfirmSelection(selectedService)}
                >
                  <span>{isTa ? 'ஆவணங்கள் பகுதிக்கு தொடர்க (Continue)' : 'Continue with this Service'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-details-placeholder">
              <div className="placeholder-content">
                <Building size={48} className="placeholder-icon" />
                <h3>{isTa ? 'சேவையைத் தேர்ந்தெடுக்கவும்' : 'Select a Service'}</h3>
                <p>
                  {isTa
                    ? 'இடதுபுறப் பட்டியலில் உள்ள சேவைகளில் ஒன்றைத் தேர்வு செய்து அதன் முழு விவரங்கள், தேவையான ஆவணங்கள் மற்றும் முன்நிபந்தனைகளைக் காண்க.'
                    : 'Choose a service from the catalog to view its purpose, eligibility, required documents, and prerequisite information.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
