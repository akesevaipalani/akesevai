import React, { useState, useMemo } from 'react';
import {
  Search, X, Check, Copy, ExternalLink, ArrowRight, FileText,
  AlertCircle, ShieldCheck, HelpCircle, ChevronRight, Layers,
  Info, CheckCircle2, Building, Sparkles, SlidersHorizontal
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
    const docs = isTa && selectedService.requiredDocumentsTa?.length
      ? selectedService.requiredDocumentsTa
      : selectedService.requiredDocuments;

    const text = `📋 ${isTa ? selectedService.nameTa : selectedService.nameEn} (${selectedService.id})\n` +
      `🏛️ ${isTa ? selectedService.departmentTa : selectedService.department}\n\n` +
      `${isTa ? 'தேவையான ஆவணங்கள் (Required Documents):' : 'Required Documents Checklist:'}\n` +
      docs.map((d, i) => `${i + 1}. ${d}`).join('\n') +
      (selectedService.notesTa ? `\n\n📌 குறிப்பு: ${isTa ? selectedService.notesTa : selectedService.notesEn}` : '') +
      `\n\n- AK E-SEVAI Application Assistance`;

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
              <h3>{isTa ? 'அரசு சேவை பட்டியல் & தேவையான ஆவணங்கள்' : 'Tamil Nadu Government Service Catalog'}</h3>
              <p>{isTa ? 'சேவையைத் தேர்வு செய்து தேவையான ஆவணங்களின் பட்டியலை சரிபார்க்கவும்' : 'Select any official service to view eligibility and required document checklist'}</p>
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
            placeholder={isTa ? 'சேவை அல்லது துறையைத் தேடுக (எ.கா: வருமானம், TNEB, Smart Card, RTO)...' : 'Search service or department (e.g., Income, Electricity, Ration Card, DL)...'}
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
                        {service.serviceType}
                      </span>
                      <span className="doc-count-tag">
                        📄 {service.requiredDocuments?.length || 0} {isTa ? 'ஆவணங்கள்' : 'Docs'}
                      </span>
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
                    {selectedService.serviceType}
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
                        {isChecked && <Check size={14} className="check-indicator" />}
                      </label>
                    );
                  })}
                </div>

                {/* Optional / Supporting Documents */}
                {selectedService.optionalDocuments && selectedService.optionalDocuments.length > 0 && (
                  <div className="optional-docs-block">
                    <h6>{isTa ? 'கூடுதல் / விருப்ப ஆவணங்கள் (Optional / If applicable):' : 'Additional / Optional Documents:'}</h6>
                    <ul>
                      {selectedService.optionalDocuments.map((optDoc, oIdx) => (
                        <li key={oIdx}>• {optDoc}</li>
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
                  <span>🏛️ {isTa ? 'அதிகாரப்பூர்வ அரசு தளம்:' : 'Official Portal:'} </span>
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
                    : '🛡️ AK E-SEVAI is an independent citizen facilitation & digital assistance centre. Official government fees apply as per actual department norms.'}
                </small>
              </div>

              {/* Action Toolbar */}
              <div className="sheet-actions-bar">
                <button
                  type="button"
                  className="btn-select-continue"
                  onClick={() => handleConfirmSelection(selectedService)}
                >
                  <span>{isTa ? 'ஆவணங்கள் பதிவேற்றத்திற்கு தொடர்க' : 'Continue to Documents'}</span>
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
                    ? 'இடதுபுறப் பட்டியலில் உள்ள சேவைகளில் ஒன்றைத் தேர்வு செய்து அதன் முழு விவரங்கள் மற்றும் தேவையான ஆவணங்களின் பட்டியலைக் காண்க.'
                    : 'Choose a service from the left catalog to view its purpose, eligibility, and interactive required-document checklist.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
