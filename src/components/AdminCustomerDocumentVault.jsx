import React, { useState, useMemo } from 'react';
import {
  FileCheck2, Search, FileText, Eye, Download, User, Phone,
  Layers, ChevronDown, ChevronUp, Clock, CheckCircle2,
  AlertCircle, Folder, FolderOpen, ShieldCheck, Sparkles, Filter, X
} from 'lucide-react';
import { handleViewDocument, handleDownloadDocument } from '../utils/documentHelper';
import '../styles/AdminCustomerDocumentVault.css';

/**
 * Mask mobile number for privacy (e.g. 9600812345 -> +91 96008xxxxx)
 */
function formatMaskedMobile(phone) {
  if (!phone) return 'Mobile Not Provided';
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)}xxxxx`;
  }
  if (clean.length > 5) {
    return `+91 ${clean.slice(0, 5)}xxxxx`;
  }
  return clean ? `+91 ${clean}` : 'Mobile Not Provided';
}

/**
 * Group documents customer-wise with applications hierarchy and unlinked fallback
 */
function groupDocumentsCustomerWise({
  customerDocs = [],
  customerProfiles = {},
  customerTokens = [],
  applicationRecords = {}
}) {
  const customerMap = new Map();

  const getOrCreateCustomer = (phone, fallbackName = '') => {
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const key = cleanPhone || 'unassigned_general';

    if (!customerMap.has(key)) {
      // Find profile details
      const profile = customerProfiles[cleanPhone] || customerProfiles[phone] || {};
      const profileName = profile.profile?.name || profile.name || profile.applicantName || '';

      // Find token name fallback
      let tokenName = '';
      if (!profileName && cleanPhone) {
        const matchingTok = customerTokens.find(
          (t) => String(t.phone || t.customerPhone || '').replace(/\D/g, '') === cleanPhone && (t.customerName || t.applicantName)
        );
        if (matchingTok) tokenName = matchingTok.customerName || matchingTok.applicantName;
      }

      const finalName = profileName || tokenName || fallbackName || (cleanPhone ? `Customer (${cleanPhone.slice(0, 5)}...)` : 'General / Unassigned Customer');

      customerMap.set(key, {
        id: key,
        phone: cleanPhone,
        rawPhone: cleanPhone,
        maskedPhone: formatMaskedMobile(cleanPhone),
        name: finalName,
        profile: profile.profile || {},
        applicationsMap: new Map(),
        otherDocuments: [],
        allDocsSet: new Set()
      });
    }

    const cust = customerMap.get(key);
    if ((cust.name.startsWith('Customer (') || cust.name.includes('General')) && fallbackName) {
      cust.name = fallbackName;
    }
    return cust;
  };

  // 1. Seed customer applications from profiles
  Object.entries(customerProfiles || {}).forEach(([pKey, profileObj]) => {
    if (!profileObj) return;
    const cleanPhone = String(profileObj.phone || pKey).replace(/\D/g, '');
    if (!cleanPhone) return;

    const cust = getOrCreateCustomer(cleanPhone, profileObj.profile?.name || profileObj.name);
    const apps = Array.isArray(profileObj.applications) ? profileObj.applications : [];

    apps.forEach((app) => {
      if (!app) return;
      const appId = String(app.id || app.ackNo || app.tokenNo || '').trim();
      if (!appId) return;

      if (!cust.applicationsMap.has(appId)) {
        cust.applicationsMap.set(appId, {
          id: appId,
          name: app.name || app.service || 'Government Service Application',
          service: app.service || app.name || 'Government Service Application',
          status: app.statusLabel || app.status || 'Submitted',
          stage: app.currentStage || app.stage || 3,
          date: app.date || app.submittedDate || 'Recently',
          documents: []
        });
      }
    });
  });

  // 2. Seed customer applications from tokens / receipts
  (customerTokens || []).forEach((tok) => {
    if (!tok) return;
    const cleanPhone = String(tok.phone || tok.customerPhone || '').replace(/\D/g, '');
    if (!cleanPhone) return;

    const cust = getOrCreateCustomer(cleanPhone, tok.customerName || tok.applicantName);
    const appId = String(tok.tokenNo || tok.tokenId || tok.id || '').trim();

    if (appId && !cust.applicationsMap.has(appId)) {
      cust.applicationsMap.set(appId, {
        id: appId,
        name: tok.service || 'Service Token Booking',
        service: tok.service || 'Service Token Booking',
        status: tok.paymentStatus || 'Submitted',
        stage: tok.currentStage || 1,
        date: tok.date || tok.issuedAt || 'Recently',
        documents: []
      });
    }
  });

  // 3. Seed customer applications from applicationRecords
  Object.values(applicationRecords || {}).forEach((app) => {
    if (!app) return;
    const cleanPhone = String(app.phone || '').replace(/\D/g, '');
    if (!cleanPhone) return;

    const cust = getOrCreateCustomer(cleanPhone, app.applicantName);
    const appId = String(app.id || app.ackNo || '').trim();

    if (appId && !cust.applicationsMap.has(appId)) {
      cust.applicationsMap.set(appId, {
        id: appId,
        name: app.service || 'e-Sevai Application',
        service: app.service || 'e-Sevai Application',
        status: app.statusLabel || 'Submitted',
        stage: app.currentStage || 3,
        date: app.submittedDate || app.date || 'Recently',
        documents: []
      });
    }
  });

  // 4. Distribute documents into applications or "Other Customer Documents"
  const globalSeenDocIds = new Set();
  const globalSeenDocSignatures = new Set();

  (customerDocs || []).forEach((doc) => {
    if (!doc) return;

    const docId = doc.id ? String(doc.id).trim() : '';
    const cleanPhone = String(doc.customerPhone || doc.phone || '').replace(/\D/g, '');
    const docAppId = String(doc.applicationId || doc.appId || '').trim();
    const docName = String(doc.name || doc.requirement || doc.title || '').trim().toLowerCase();
    const docUrl = String(doc.url || doc.data || '').trim();

    // 1. Check ID uniqueness
    if (docId && globalSeenDocIds.has(docId)) return;

    // 2. Check Signature uniqueness (Phone + AppId + Name + Url snippet)
    const signature = `${cleanPhone}_${docAppId}_${docName}_${docUrl.slice(0, 80)}`;
    if (globalSeenDocSignatures.has(signature)) return;

    if (docId) globalSeenDocIds.add(docId);
    globalSeenDocSignatures.add(signature);

    const cust = getOrCreateCustomer(cleanPhone, doc.customerName || doc.applicantName);

    if (cust.allDocsSet.has(signature)) return;
    cust.allDocsSet.add(signature);

    let linked = false;

    if (docAppId && cust.applicationsMap.has(docAppId)) {
      cust.applicationsMap.get(docAppId).documents.push(doc);
      linked = true;
    } else if (docAppId) {
      // Create application entry for this docAppId if not already present
      const newApp = {
        id: docAppId,
        name: doc.service || doc.serviceName || `Application ${docAppId}`,
        service: doc.service || doc.serviceName || `Application ${docAppId}`,
        status: doc.status || 'Submitted',
        stage: 3,
        date: doc.uploadedAt || 'Recently',
        documents: [doc]
      };
      cust.applicationsMap.set(docAppId, newApp);
      linked = true;
    }

    if (!linked) {
      // Unlinked customer document
      cust.otherDocuments.push(doc);
    }
  });

  // 5. Build final sorted array of customer groups
  const customerList = [];
  customerMap.forEach((cust) => {
    const applications = Array.from(cust.applicationsMap.values());
    const totalDocsInApps = applications.reduce((sum, a) => sum + a.documents.length, 0);
    const totalDocs = totalDocsInApps + cust.otherDocuments.length;

    if (totalDocs > 0 || applications.length > 0) {
      // Determine latest upload timestamp
      const allDocs = [...cust.otherDocuments, ...applications.flatMap((a) => a.documents)];
      let latestTime = 0;
      allDocs.forEach((d) => {
        const t = new Date(d.uploadedAt || d.date || 0).getTime();
        if (!isNaN(t) && t > latestTime) latestTime = t;
      });

      const hasPending = applications.some(
        (a) => (a.status || '').toLowerCase().includes('pending') || a.documents.length === 0
      );

      customerList.push({
        id: cust.id,
        phone: cust.phone,
        rawPhone: cust.rawPhone,
        maskedPhone: cust.maskedPhone,
        name: cust.name,
        totalDocuments: totalDocs,
        totalApplications: applications.length,
        applications,
        otherDocuments: cust.otherDocuments,
        hasPending,
        isComplete: totalDocs > 0 && !hasPending,
        latestUploadTime: latestTime,
        latestUploadFormatted: latestTime ? new Date(latestTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'
      });
    }
  });

  // Sort by latest upload timestamp descending
  customerList.sort((a, b) => b.latestUploadTime - a.latestUploadTime);

  return customerList;
}

export default function AdminCustomerDocumentVault({
  customerDocs = [],
  customerProfiles = {},
  customerTokens = [],
  applicationRecords = {},
  notify
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'complete' | 'recent'
  const [expandedCustomers, setExpandedCustomers] = useState({});

  // Memoized customer-wise grouped data
  const customerGroups = useMemo(() => {
    return groupDocumentsCustomerWise({
      customerDocs,
      customerProfiles,
      customerTokens,
      applicationRecords
    });
  }, [customerDocs, customerProfiles, customerTokens, applicationRecords]);

  // Filter and search logic
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const cleanQ = q.replace(/\D/g, '');

    return customerGroups.filter((cust) => {
      // Filter tab condition
      if (activeFilter === 'pending' && !cust.hasPending) return false;
      if (activeFilter === 'complete' && !cust.isComplete) return false;
      if (activeFilter === 'recent') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (cust.latestUploadTime < sevenDaysAgo && cust.latestUploadTime > 0) return false;
      }

      // Search match
      if (!q) return true;

      const nameMatch = cust.name.toLowerCase().includes(q);
      const phoneMatch = (cleanQ && cust.rawPhone.includes(cleanQ)) || cust.maskedPhone.toLowerCase().includes(q);

      const appMatch = cust.applications.some(
        (app) =>
          app.id.toLowerCase().includes(q) ||
          app.name.toLowerCase().includes(q) ||
          app.service.toLowerCase().includes(q) ||
          app.documents.some(
            (d) =>
              (d.name || '').toLowerCase().includes(q) ||
              (d.requirement || '').toLowerCase().includes(q) ||
              (d.title || '').toLowerCase().includes(q)
          )
      );

      const otherDocMatch = cust.otherDocuments.some(
        (d) =>
          (d.name || '').toLowerCase().includes(q) ||
          (d.requirement || '').toLowerCase().includes(q) ||
          (d.title || '').toLowerCase().includes(q)
      );

      return nameMatch || phoneMatch || appMatch || otherDocMatch;
    });
  }, [customerGroups, searchQuery, activeFilter]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const total = customerGroups.length;
    const pending = customerGroups.filter((c) => c.hasPending).length;
    const complete = customerGroups.filter((c) => c.isComplete).length;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = customerGroups.filter((c) => c.latestUploadTime >= sevenDaysAgo || c.latestUploadTime === 0).length;

    return { total, pending, complete, recent };
  }, [customerGroups]);

  // Toggle single customer accordion
  const toggleCustomer = (custId) => {
    setExpandedCustomers((prev) => ({
      ...prev,
      [custId]: !prev[custId]
    }));
  };

  // Expand / Collapse all customers
  const handleExpandAll = () => {
    const all = {};
    filteredCustomers.forEach((c) => {
      all[c.id] = true;
    });
    setExpandedCustomers(all);
  };

  const handleCollapseAll = () => {
    setExpandedCustomers({});
  };

  // Total distinct document count
  const totalDistinctDocs = useMemo(() => {
    return customerGroups.reduce((acc, c) => acc + c.totalDocuments, 0);
  }, [customerGroups]);

  return (
    <div id="admin-smartdesk-documents-vault" className="admin-customer-vault-container">
      {/* ========================================================================= */}
      {/* 1. VAULT HEADER                                                           */}
      {/* ========================================================================= */}
      <div className="vault-header-wrap">
        <div className="vault-header-left">
          <span className="vault-badge">
            <FileCheck2 size={14} /> CUSTOMER UPLOADED DOCUMENTS VAULT
          </span>
          <h3 className="vault-title">
            📁 வாடிக்கையாளர் ஆவணக் காப்பகம் ({totalDistinctDocs} Documents · {customerGroups.length} Customers)
          </h3>
          <p className="vault-subtitle">
            வாடிக்கையாளர்கள் சமர்ப்பித்த ஆவணங்கள் வாடிக்கையாளர் வாரியாகவும் மற்றும் அவர்களின் சேவை விண்ணப்பங்கள் வாரியாகவும் துல்லியமாக ஒருங்கிணைக்கப்பட்டுள்ளன.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER CONTROLS                                               */}
      {/* ========================================================================= */}
      <div className="vault-controls-wrap">
        <div className="vault-search-row">
          <div className="vault-search-box">
            <Search size={18} color="#64748b" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Customer / Mobile / Application ID / Document (வாடிக்கையாளர் / மொபைல் / எண் / ஆவணம்)..."
              className="vault-search-input"
              aria-label="Search Customer / Mobile / Application ID / Document"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="vault-search-clear"
                title="Clear Search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills and Quick Actions */}
        <div className="vault-filters-row">
          <button
            type="button"
            className={`vault-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <Layers size={14} /> All Customers (அனைத்தும்)
            <span className="vault-filter-count">{counts.total}</span>
          </button>

          <button
            type="button"
            className={`vault-filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            <Clock size={14} /> Pending Documents (நிலுவை)
            <span className="vault-filter-count">{counts.pending}</span>
          </button>

          <button
            type="button"
            className={`vault-filter-btn ${activeFilter === 'complete' ? 'active' : ''}`}
            onClick={() => setActiveFilter('complete')}
          >
            <CheckCircle2 size={14} /> Complete (முழுமையானவை)
            <span className="vault-filter-count">{counts.complete}</span>
          </button>

          <button
            type="button"
            className={`vault-filter-btn ${activeFilter === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('recent')}
          >
            <Sparkles size={14} /> Recently Uploaded (சமீபத்தியவை)
            <span className="vault-filter-count">{counts.recent}</span>
          </button>

          <div className="vault-quick-actions">
            <button type="button" onClick={handleExpandAll} className="vault-action-link-btn">
              Expand All
            </button>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <button type="button" onClick={handleCollapseAll} className="vault-action-link-btn">
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CUSTOMER ACCORDION LIST                                                */}
      {/* ========================================================================= */}
      {filteredCustomers.length === 0 ? (
        <div className="vault-empty-box">
          <div className="vault-empty-icon">📂</div>
          <strong>பொருந்தும் ஆவணங்கள் அல்லது வாடிக்கையாளர்கள் கிடைக்கவில்லை</strong>
          <span style={{ fontSize: '12px' }}>
            (No customers or uploaded documents matched your search filter criteria).
          </span>
        </div>
      ) : (
        <div className="vault-customer-list">
          {filteredCustomers.map((customer, index) => {
            const isExpanded = Boolean(expandedCustomers[customer.id] || searchQuery.trim().length > 0);

            return (
              <div
                key={customer.id}
                className={`vault-customer-card ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Accordion Header */}
                <div
                  className="vault-customer-header"
                  onClick={() => toggleCustomer(customer.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCustomer(customer.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={`customer-vault-body-${customer.id}`}
                >
                  <div className="vault-customer-info">
                    <div className="vault-avatar">
                      {customer.name.charAt(0).toUpperCase() || '👤'}
                    </div>
                    <div className="vault-customer-meta">
                      <h4 className="vault-customer-name">
                        👤 {customer.name}
                      </h4>
                      <span className="vault-customer-phone">
                        📱 {customer.maskedPhone}
                      </span>
                    </div>
                  </div>

                  <div className="vault-customer-stats">
                    <span className="vault-stat-badge docs">
                      <FileText size={13} /> {customer.totalDocuments} {customer.totalDocuments === 1 ? 'Document' : 'Documents'}
                    </span>
                    <span className="vault-stat-badge apps">
                      <Layers size={13} /> {customer.totalApplications} {customer.totalApplications === 1 ? 'Service Request' : 'Service Requests'}
                    </span>
                    <button
                      type="button"
                      className="vault-toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCustomer(customer.id);
                      }}
                      aria-label={isExpanded ? 'Collapse documents' : 'View documents'}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={15} /> Close Documents
                        </>
                      ) : (
                        <>
                          <ChevronDown size={15} /> [ View Documents ]
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Customer Content */}
                {isExpanded && (
                  <div
                    id={`customer-vault-body-${customer.id}`}
                    className="vault-customer-content"
                  >
                    {/* Customer Applications */}
                    {customer.applications.map((app, appIdx) => {
                      return (
                        <div key={`${customer.id}_app_${app.id}_${appIdx}`} className="vault-application-block">
                          {/* Application Header */}
                          <div className="vault-application-header">
                            <div>
                              <div className="vault-app-kicker">APPLICATION {appIdx + 1}</div>
                              <h5 className="vault-app-title">
                                {app.name}
                                <span className="vault-app-id-badge">{app.id}</span>
                              </h5>
                            </div>
                            <div className="vault-app-meta">
                              <span
                                className={`vault-status-badge ${
                                  (app.status || '').toLowerCase().includes('pending')
                                    ? 'vault-status-pending'
                                    : (app.status || '').toLowerCase().includes('verif') || (app.status || '').toLowerCase().includes('complet')
                                    ? 'vault-status-verified'
                                    : 'vault-status-submitted'
                                }`}
                              >
                                Status: {app.status || 'Submitted'}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                📅 {app.date || 'Recently'}
                              </span>
                            </div>
                          </div>

                          {/* Documents in this Application */}
                          {app.documents.length === 0 ? (
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', padding: '8px 0' }}>
                              ⏳ இந்த சேவைக்கான ஆவணங்கள் இன்னும் பதிவேற்றப்படவில்லை (No documents uploaded for this application yet).
                            </div>
                          ) : (
                            <div className="vault-docs-grid">
                              {app.documents.map((doc, docIdx) => renderDocumentCard(doc, `${customer.id}_${app.id}_${docIdx}`, notify))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Other Customer Documents (Unlinked to specific application) */}
                    {customer.otherDocuments.length > 0 && (
                      <div className="vault-other-docs-block">
                        <div className="vault-other-docs-header">
                          <h5 className="vault-other-docs-title">
                            <FolderOpen size={16} /> Other Customer Documents (பிற வாடிக்கையாளர் ஆவணங்கள்)
                          </h5>
                          <span style={{ fontSize: '11.5px', color: '#9a3412', fontWeight: 700 }}>
                            {customer.otherDocuments.length} {customer.otherDocuments.length === 1 ? 'Document' : 'Documents'}
                          </span>
                        </div>
                        <div className="vault-docs-grid">
                          {customer.otherDocuments.map((doc, docIdx) =>
                            renderDocumentCard(doc, `${customer.id}_other_${docIdx}`, notify)
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Render single document item card with thumbnail, context, upload date, View & Download
 */
function renderDocumentCard(doc, key, notify) {
  const isPdf =
    (doc.name && doc.name.toLowerCase().endsWith('.pdf')) ||
    doc.type === 'application/pdf' ||
    (doc.url && doc.url.includes('application/pdf'));

  const docUrl = doc.url || doc.data || '';
  const isImg =
    !isPdf &&
    (docUrl || (doc.name && /\.(jpg|jpeg|png|webp|svg)$/i.test(doc.name)));

  const displayName = doc.requirement || doc.name || doc.title || 'Uploaded Document';
  const fileContext = doc.name && doc.name !== displayName ? doc.name : (doc.title && doc.title !== displayName ? doc.title : '');
  const uploadDate = doc.uploadedAt || doc.date || 'Recently';

  return (
    <div key={key} className="vault-doc-card">
      <div className="vault-doc-body">
        {/* Document Thumbnail / Icon */}
        <div
          className="vault-doc-thumb-wrap"
          onClick={() => handleViewDocument(doc, notify)}
          title={isImg ? 'Click to preview image' : isPdf ? 'Click to view PDF' : 'Click to view document'}
        >
          {isImg && docUrl ? (
            <img src={docUrl} alt={displayName} className="vault-doc-thumb-img" />
          ) : isPdf ? (
            <div className="vault-doc-thumb-pdf">
              <FileText size={18} />
              <span>PDF</span>
            </div>
          ) : (
            <div className="vault-doc-thumb-generic">
              <FileCheck2 size={20} />
            </div>
          )}
        </div>

        {/* Document Details */}
        <div className="vault-doc-details">
          <h6 className="vault-doc-name" title={displayName}>
            {displayName}
          </h6>
          {fileContext && (
            <p className="vault-doc-context" title={fileContext}>
              📄 {fileContext}
            </p>
          )}
          <p className="vault-doc-date">
            <Clock size={11} /> {uploadDate}
          </p>
        </div>
      </div>

      {/* Action Buttons: View & Download (No Delete) */}
      <div className="vault-doc-actions">
        <button
          type="button"
          onClick={() => handleViewDocument(doc, notify)}
          className="vault-btn-view"
          title="View Document in Viewer"
        >
          <Eye size={13} /> View (காண்க)
        </button>
        <button
          type="button"
          onClick={() => handleDownloadDocument(doc)}
          className="vault-btn-download"
          title="Download Original Document"
        >
          <Download size={13} /> Download (பதிவிறக்கு)
        </button>
      </div>
    </div>
  );
}
