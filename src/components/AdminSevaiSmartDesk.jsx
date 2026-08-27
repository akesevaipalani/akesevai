import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, FileText, CheckCircle2, Printer, MessageCircle, ArrowRight, UploadCloud, 
  RefreshCw, Sparkles, ShieldCheck, Download, PlusCircle, Volume2, Eye, Search, 
  FileCheck2, Trash2, Ticket, User, CreditCard, Globe, QrCode, Calendar, Clock, X, Layers 
} from 'lucide-react';
import { saveApplicationRecord, getStoredApplications, updateApplicationStage } from '../utils/statusStore';
import { 
  subscribeExpiryDocuments, deleteExpiryDocumentCloud, 
  subscribeTokens, deleteTokenBookingCloud, 
  subscribeCustomerProfiles, deleteCustomerProfileCloud, subscribeApplications,
  fetchAllCloudRecords, subscribeDailyVisitorLogsCloud, isDocumentDeletedByBlacklist,
  verifyTokenPaymentCloud, rejectTokenPaymentCloud
} from '../utils/dataService';
import { printElement } from '../utils/printHelper';
import AdminAutoFillProfileDrawer from './AdminAutoFillProfileDrawer';
import AdminSponsoredAdsManager from './AdminSponsoredAdsManager';
import AdminCenterBannersControl from './AdminCenterBannersControl';
import AdminPasswordModal from './AdminPasswordModal';
import { validatePhotoUpload } from '../utils/documentHelper';

export default function AdminSevaiSmartDesk({ notify, changeAdminPassword }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const moduleTabsRef = useRef(null);

  // Smooth Drag-to-Scroll for SmartDesk Module Tabs
  useEffect(() => {
    const el = moduleTabsRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMouseLeave = () => { isDown = false; };
    const onMouseUp = () => { isDown = false; };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [service, setService] = useState('வருமானச் சான்றிதழ் (Income Certificate)');
  const [fee, setFee] = useState('60');
  const [status, setStatus] = useState('விண்ணப்பிக்கப்பட்டது (Applied & Processing)');
  const [receipt, setReceipt] = useState(null);

  // Active Vault Tab: 'tokens' | 'documents' | 'customers'
  const [activeVaultTab, setActiveVaultTab] = useState('tokens');
  const [deskTab, setDeskTab] = useState('all'); // 'all', 'receipt', 'voice', 'ads', 'vault'

  // Customer Uploaded Documents state
  const [customerDocs, setCustomerDocs] = useState([]);
  const [docSearch, setDocSearch] = useState('');

  // Worldwide Generated Customer Tokens state
  const [customerTokens, setCustomerTokens] = useState([]);
  const [tokenSearch, setTokenSearch] = useState('');
  const [selectedTokenForView, setSelectedTokenForView] = useState(null);

  // Worldwide Customer Profiles state
  const [customerProfiles, setCustomerProfiles] = useState({});
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerForView, setSelectedCustomerForView] = useState(null);

  // Daily Website Visitors Traffic state
  const [visitorLogs, setVisitorLogs] = useState([]);

  // Real-time Cloud Subscriptions & Comprehensive Document/Token Merger
  useEffect(() => {
    let latestCloudDocs = [];
    let latestCloudTokens = [];
    let latestCustomerProfiles = {};
    let latestCloudApps = {};

    const syncAllCloudData = () => {
      const deletedTokens = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));
      const deletedDocs = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-docs') || '[]'));
      const deletedCustomers = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-customers') || '[]'));

      // Read local customer records from localStorage
      let localCust1 = {};
      let localCust2 = {};
      try {
        localCust1 = JSON.parse(localStorage.getItem('akesevai-customer-records') || '{}');
        localCust2 = JSON.parse(localStorage.getItem('akesevai-customers') || '{}');
      } catch (e) {}

      const allProfilesSource = {
        ...localCust2,
        ...localCust1,
        ...(latestCustomerProfiles || {})
      };

      // Filter profiles by blacklist
      const filteredProfiles = {};
      Object.keys(allProfilesSource).forEach((pKey) => {
        const cust = allProfilesSource[pKey];
        if (!cust) return;
        const cleanP = String(cust.phone || pKey).replace(/\D/g, '');
        if (cleanP && !deletedCustomers.has(pKey) && !deletedCustomers.has(cleanP)) {
          filteredProfiles[cleanP] = cust;
          filteredProfiles[pKey] = cust;
        }
      });
      setCustomerProfiles(filteredProfiles);

      // 1. MERGE ALL DOCUMENTS (Excluding deleted docs)
      const allDocsMap = new Map();

      const isDocDeleted = (docItem) => {
        if (!docItem) return true;
        if (isDocumentDeletedByBlacklist(docItem, deletedDocs)) return true;
        const phoneNo = String(docItem.customerPhone || docItem.phone || '').replace(/\D/g, '');
        const nameKey = String(docItem.name || docItem.requirement || docItem.title || '');
        const reqKey = String(docItem.requirement || docItem.name || docItem.title || '');

        const keys = [
          String(docItem.id || ''),
          String(docItem.url || ''),
          String(docItem.data || ''),
          String(docItem.storagePath || ''),
          nameKey,
          reqKey,
          (phoneNo && nameKey) ? `${phoneNo}_${nameKey}` : '',
          (phoneNo && reqKey) ? `${phoneNo}_${reqKey}` : ''
        ];
        return keys.some(k => k && k !== 'undefined' && deletedDocs.has(k));
      };

      const addDocToMap = (d, defaultPhone = '') => {
        if (!d || isDocDeleted(d)) return;
        
        const docName = d.name || d.requirement || d.title || d.fileName || d.filename || 'Uploaded Document';
        const validUrl = d.url || d.data || d.storagePath || '';
        const rawPhone = d.customerPhone || d.phone || defaultPhone || '';
        const phoneNo = String(rawPhone).replace(/\D/g, '');
        
        if (!docName && !validUrl && !d.id) return;

        // Smart deduplication: Search map for existing document matching ID, URL, or Filename+Phone
        let matchingKey = null;
        for (const [k, item] of allDocsMap.entries()) {
          const itemPhone = String(item.customerPhone || '').replace(/\D/g, '');
          if (phoneNo && itemPhone && phoneNo !== itemPhone) continue;

          const idMatch = d.id && item.id && String(d.id) === String(item.id);
          const urlMatch = validUrl && item.url && validUrl.length > 50 && (validUrl === item.url || validUrl === item.data);
          const reqAppMatch = d.requirement && item.requirement && d.requirement.trim().toLowerCase() === item.requirement.trim().toLowerCase() && d.applicationId && item.applicationId && d.applicationId === item.applicationId;

          if (idMatch || urlMatch || reqAppMatch) {
            matchingKey = k;
            break;
          }
        }

        const key = matchingKey || String(d.id || `${phoneNo}_${d.applicationId || 'app'}_${(d.requirement || docName || 'doc').replace(/\s+/g, '_')}_${Math.random()}`);

        const existing = allDocsMap.get(key);
        if (!existing) {
          allDocsMap.set(key, {
            ...d,
            id: key,
            name: docName,
            requirement: d.requirement || d.title || docName,
            title: d.title || d.requirement || docName,
            customerPhone: phoneNo,
            url: validUrl,
            data: validUrl,
            uploadedAt: d.uploadedAt || d.date || 'Recently'
          });
        } else {
          const bestUrl = validUrl || existing.url || existing.data || '';
          allDocsMap.set(key, {
            ...existing,
            ...d,
            id: key,
            name: docName && docName !== 'Uploaded Document' ? docName : existing.name,
            requirement: (existing.requirement && existing.requirement !== existing.name && existing.requirement !== 'Uploaded Document')
              ? existing.requirement
              : (d.requirement || existing.requirement || docName),
            title: d.title || existing.title || docName,
            customerPhone: phoneNo || existing.customerPhone,
            url: bestUrl,
            data: bestUrl,
            uploadedAt: d.uploadedAt || existing.uploadedAt || 'Recently'
          });
        }
      };

      // Source A: Cloud Documents (from Firestore 'documents' collection)
      if (Array.isArray(latestCloudDocs)) {
        latestCloudDocs.forEach((d) => addDocToMap(d));
      }

      // Source B: Local Expiry / Uploaded Documents (akesevai_expiry_docs)
      try {
        const localExpiryDocs = JSON.parse(localStorage.getItem('akesevai_expiry_docs') || '[]');
        if (Array.isArray(localExpiryDocs)) {
          localExpiryDocs.forEach((d) => addDocToMap(d));
        }
      } catch (e) {}

      // Source C: Customer Profiles (documents array inside customer profiles)
      if (allProfilesSource && typeof allProfilesSource === 'object') {
        Object.values(allProfilesSource).forEach((cust) => {
          if (!cust) return;
          const custPhone = cust.phone || '';
          const custDocs = Array.isArray(cust.documents) ? cust.documents : [];
          custDocs.forEach((docItem) => addDocToMap(docItem, custPhone));
        });
      }

      const mergedDocs = Array.from(allDocsMap.values());
      mergedDocs.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
      setCustomerDocs(mergedDocs);

      // 2. MERGE ALL TOKENS (Excluding deleted tokens)
      const allTokensMap = new Map();

      const isTokenDeleted = (tok) => {
        if (!tok) return true;
        const keys = [
          String(tok.tokenNo || ''),
          String(tok.tokenId || ''),
          String(tok.id || '')
        ];
        return keys.some((k) => k && deletedTokens.has(k));
      };

      if (Array.isArray(latestCloudTokens)) {
        latestCloudTokens.forEach((t) => {
          const key = String(t.tokenNo || t.tokenId || t.id || '');
          if (key && !isTokenDeleted(t)) allTokensMap.set(key, t);
        });
      }

      if (filteredProfiles && typeof filteredProfiles === 'object') {
        Object.values(filteredProfiles).forEach((cust) => {
          if (cust && cust.lastToken && !isTokenDeleted(cust.lastToken)) {
            const t = cust.lastToken;
            const key = String(t.tokenNo || t.tokenId || t.id || '');
            if (key && !allTokensMap.has(key)) {
              allTokensMap.set(key, t);
            }
          }
        });
      }

      if (latestCloudApps && typeof latestCloudApps === 'object') {
        Object.values(latestCloudApps).forEach((app) => {
          if (app && (app.tokenId || app.id)) {
            const key = String(app.tokenId || app.id);
            if (key && !isTokenDeleted({ tokenNo: key, tokenId: key, id: key }) && !allTokensMap.has(key)) {
              allTokensMap.set(key, {
                tokenNo: app.tokenId || app.id,
                tokenId: app.tokenId || app.id,
                id: app.id,
                customerName: app.applicantName || 'Customer',
                applicantName: app.applicantName || 'Customer',
                phone: app.phone || '',
                customerPhone: app.phone || '',
                service: app.service || 'e-Sevai Application',
                date: app.date || app.submittedDate || 'Today',
                slot: 'Counter Desk',
                paymentStatus: app.statusLabel || '✅ பதிவு செய்யப்பட்டது (Submitted)',
                issuedAt: app.submittedDate || 'Recently',
                updatedAt: app.updatedAt || new Date().toISOString()
              });
            }
          }
        });
      }

      try {
        const localToks = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
        if (Array.isArray(localToks)) {
          localToks.forEach((t) => {
            const key = String(t.tokenNo || t.tokenId || t.id || '');
            if (key && !isTokenDeleted(t) && !allTokensMap.has(key)) {
              allTokensMap.set(key, t);
            }
          });
        }
      } catch (e) {}

      // ✅ Also read admin-created application receipts (akesevai-application-records)
      try {
        const adminApps = JSON.parse(localStorage.getItem('akesevai-application-records') || '{}');
        Object.values(adminApps).forEach((app) => {
          if (!app) return;
          const key = String(app.id || app.ackNo || app.tokenId || '');
          if (key && !isTokenDeleted({ tokenNo: key, tokenId: key, id: key }) && !allTokensMap.has(key)) {
            allTokensMap.set(key, {
              tokenNo: app.id || app.ackNo,
              tokenId: app.tokenId || app.id || app.ackNo,
              id: app.id || app.ackNo,
              customerName: app.applicantName || 'Customer',
              applicantName: app.applicantName || 'Customer',
              phone: String(app.phone || '').replace(/\D/g, ''),
              customerPhone: String(app.phone || '').replace(/\D/g, ''),
              service: app.service || 'e-Sevai Application',
              date: app.submittedDate || app.date || 'Today',
              slot: 'Admin Counter Desk',
              paymentStatus: app.statusLabel || '✅ விண்ணப்பம் பெறப்பட்டது',
              issuedAt: app.submittedDate || app.date || 'Recently',
              updatedAt: app.updatedAt || new Date().toISOString(),
              fee: app.fee || '₹60',
              aadhaarNo: app.aadhaarNo || '',
              currentStage: app.currentStage || 1
            });
          }
        });
      } catch (e) {}

      // ✅ Also merge akesevai-customers profiles (alternate key used by some flows)
      try {
        const altCusts = JSON.parse(localStorage.getItem('akesevai-customers') || '{}');
        Object.entries(altCusts).forEach(([k, c]) => {
          if (!c) return;
          const cleanP = String(c.phone || k).replace(/\D/g, '');
          if (cleanP && !deletedCustomers.has(cleanP)) {
            filteredProfiles[cleanP] = filteredProfiles[cleanP] || c;
          }
        });
        setCustomerProfiles({ ...filteredProfiles });
      } catch (e) {}

      const mergedTokens = Array.from(allTokensMap.values());
      mergedTokens.sort((a, b) => new Date(b.updatedAt || b.issuedDate || 0) - new Date(a.updatedAt || a.issuedDate || 0));
      setCustomerTokens(mergedTokens);
    };

    const handleSyncEvent = () => syncAllCloudData();
    window.addEventListener('akesevai-data-changed', handleSyncEvent);

    // ✅ IMMEDIATE: Populate from localStorage right away (no Firebase wait)
    syncAllCloudData();

    // ✅ PREFETCH: Load cloud data before real-time listeners respond
    fetchAllCloudRecords().then((cloud) => {
      if (cloud) {
        if (cloud.customers && typeof cloud.customers === 'object') {
          latestCustomerProfiles = cloud.customers;
        }
        if (Array.isArray(cloud.tokens)) {
          latestCloudTokens = cloud.tokens;
        }
        if (Array.isArray(cloud.documents)) {
          latestCloudDocs = cloud.documents;
        }
        if (cloud.applications && typeof cloud.applications === 'object') {
          latestCloudApps = cloud.applications;
        }
        syncAllCloudData();
      }
    }).catch(() => {});

    const unsubDocs = subscribeExpiryDocuments((docs) => {
      latestCloudDocs = Array.isArray(docs) ? docs : [];
      syncAllCloudData();
    });

    const unsubTokens = subscribeTokens((tokens) => {
      latestCloudTokens = Array.isArray(tokens) ? tokens : [];
      syncAllCloudData();
    });

    const unsubProfiles = subscribeCustomerProfiles((profiles) => {
      latestCustomerProfiles = profiles && typeof profiles === 'object' ? profiles : {};
      syncAllCloudData();
    });

    const unsubApps = subscribeApplications((apps) => {
      latestCloudApps = apps && typeof apps === 'object' ? apps : {};
      syncAllCloudData();
    });

    const unsubVisitors = subscribeDailyVisitorLogsCloud((logs) => {
      if (Array.isArray(logs)) setVisitorLogs(logs);
    });

    return () => {
      window.removeEventListener('akesevai-data-changed', handleSyncEvent);
      if (typeof unsubDocs === 'function') unsubDocs();
      if (typeof unsubTokens === 'function') unsubTokens();
      if (typeof unsubProfiles === 'function') unsubProfiles();
      if (typeof unsubApps === 'function') unsubApps();
      if (typeof unsubVisitors === 'function') unsubVisitors();
    };
  }, []);

  // Photo Cropper & Compressor tool state
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [compressedPhoto, setCompressedPhoto] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [targetKb, setTargetKb] = useState(100);
  const [originalSize, setOriginalSize] = useState(0);

  const announceReceiptOverSpeaker = (name, ackNo) => {
    const cleanToken = (ackNo || '').replace(/^TN-AK-2026-/, '');
    const speechText = `வணக்கம்! ${name}, டோக்கன் எண் ${cleanToken}, கவுண்டர் 1-க்கு வரவும்.`;

    if (window.responsiveVoice && typeof window.responsiveVoice.speak === 'function') {
      window.responsiveVoice.speak(speechText, "Tamil Female", { rate: 0.85 });
      return;
    }

    try {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(speechText)}&tl=ta&client=tw-ob`;
      const audio = new Audio();
      audio.referrerPolicy = 'no-referrer';
      audio.crossOrigin = 'anonymous';
      audio.src = ttsUrl;
      audio.playbackRate = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  const processCompression = (dataUrl, targetSizeKb) => {
    const img = new Image();
    img.onload = () => {
      let quality = 0.92;
      let width = img.width;
      let height = img.height;

      if (targetSizeKb <= 50) {
        width = Math.min(width, 400);
        height = Math.round((img.height / img.width) * width);
      } else if (targetSizeKb <= 100) {
        width = Math.min(width, 600);
        height = Math.round((img.height / img.width) * width);
      } else if (targetSizeKb <= 150) {
        width = Math.min(width, 800);
        height = Math.round((img.height / img.width) * width);
      } else {
        width = Math.min(width, 1000);
        height = Math.round((img.height / img.width) * width);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      let resultUrl = canvas.toDataURL('image/jpeg', quality);
      let kb = Math.round((resultUrl.length * 3) / 4 / 1024);

      while (kb > targetSizeKb && quality > 0.08) {
        quality -= 0.06;
        resultUrl = canvas.toDataURL('image/jpeg', quality);
        kb = Math.round((resultUrl.length * 3) / 4 / 1024);
      }

      setCompressedPhoto(resultUrl);
      setCompressedSize(kb);
    };
    img.src = dataUrl;
  };

  const handlePhotoUploadAndCompress = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validatePhotoUpload(file, 1);
    if (!validation.valid) {
      if (typeof notify === 'function') notify(validation.error);
      else alert(validation.error);
      e.target.value = '';
      return;
    }

    setOriginalSize(Math.round(file.size / 1024));

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedPhoto(ev.target.result);
      processCompression(ev.target.result, targetKb);
    };
    reader.readAsDataURL(file);
  };

  const handleTargetKbChange = (newTarget) => {
    setTargetKb(newTarget);
    if (uploadedPhoto) {
      processCompression(uploadedPhoto, newTarget);
    }
  };

  const handleCreateApplicationReceipt = (e) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      if (typeof notify === 'function') notify('❌ பிழை: விண்ணப்பதாரரின் பெயரை உள்ளிடவும்!');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      if (typeof notify === 'function') notify('❌ பிழை: 10 இலக்கச் சரியான மொபைல் எண்ணை உள்ளிடவும்!');
      return;
    }

    const ackNo = `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReceipt = {
      ackNo,
      applicantName,
      phone: cleanPhone,
      aadhaarNo: aadhaarNo || 'XXXX XXXX 9842',
      service,
      fee: `₹${fee}`,
      status,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    saveApplicationRecord({
      id: ackNo,
      applicantName,
      phone: cleanPhone,
      aadhaarNo,
      service,
      fee: `₹${fee}`,
      currentStage: 3,
      statusLabel: status,
      remarks: `AkEsevai மையத்தில் ${service} விண்ணப்பம் பதிவு செய்யப்பட்டுள்ளது.`
    });

    const newAppObj = {
      id: ackNo,
      name: service,
      stage: 3,
      currentStage: 3,
      status: 'Submitted',
      statusLabel: status,
      date: newReceipt.date
    };

    let existingCustObj = {};
    try {
      const localCusts = JSON.parse(localStorage.getItem('akesevai-customers') || '{}');
      existingCustObj = localCusts[cleanPhone] || {};
    } catch (err) {}

    const updatedCustObj = {
      ...existingCustObj,
      phone: cleanPhone,
      profile: {
        ...(existingCustObj.profile || {}),
        name: applicantName,
        aadhaarNo: aadhaarNo || existingCustObj.profile?.aadhaarNo || '',
        complete: true
      },
      applications: [newAppObj, ...(existingCustObj.applications || [])],
      updatedAt: new Date().toISOString()
    };

    saveCustomerProfileCloud(cleanPhone, updatedCustObj);

    // ✅ Also save to token-bookings so vault shows this receipt
    const tokenEntry = {
      tokenNo: ackNo,
      tokenId: ackNo,
      id: ackNo,
      customerName: applicantName,
      applicantName,
      phone: cleanPhone,
      customerPhone: cleanPhone,
      service,
      date: newReceipt.date,
      slot: 'Admin Counter Desk',
      paymentStatus: status,
      issuedAt: newReceipt.date,
      updatedAt: new Date().toISOString(),
      fee: `₹${fee}`,
      aadhaarNo: aadhaarNo || ''
    };
    try {
      const existingToks = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
      const filtered = existingToks.filter(t => String(t.tokenNo || t.id) !== ackNo);
      localStorage.setItem('akesevai-token-bookings', JSON.stringify([tokenEntry, ...filtered]));
    } catch (e) {}
    try {
      saveTokenBookingCloud(tokenEntry);
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('akesevai-data-changed'));
    }

    setReceipt(newReceipt);
    announceReceiptOverSpeaker(applicantName, ackNo);

    if (typeof notify === 'function') notify(`✅ ${applicantName} வாடிக்கையாளர் விவரம் & விண்ணப்பம் சேமிக்கப்பட்டது!`);
  };

  const handlePrintReceipt = () => {
    printElement('admin-receipt-print-area');
  };

  const handlePrintTokenSlipModal = () => {
    printElement('admin-token-modal-print-area');
  };

  const handleSendWhatsAppAck = () => {
    if (!receipt) return;
    const text = encodeURIComponent(
      `🏛️ *AkEsevai மையம், பழனி*\n` +
      `*இ-சேவை விண்ணப்ப ஒப்புதல் சீட்டு*\n\n` +
      `ஒப்புதல் எண்: *${receipt.ackNo}*\n` +
      `விண்ணப்பதாரர்: *${receipt.applicantName}*\n` +
      `சேவை: *${receipt.service}*\n` +
      `கட்டணம்: *${receipt.fee} (Paid)*\n` +
      `நிலை: *${receipt.status}*\n\n` +
      `நன்றி! உங்கள் சான்றிதழ் தயாரானதும் SMS/WhatsApp மூலம் அறிவிக்கப்படும்.\n` +
      `AkEsevai Centre, Mill Road, Palani • 9342318844`
    );
    window.open(`https://wa.me/91${receipt.phone.replace(/\D/g, '')}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp token slip sender for cloud tokens
  const handleSendTokenWhatsApp = (tok) => {
    if (!tok) return;
    const text = encodeURIComponent(
      `🧾 *AkEsevai - OFFICIAL DIGITAL TOKEN SLIP*\n\n` +
      `🎫 *TOKEN NO:* *${tok.tokenNo || tok.tokenId || tok.id}*\n` +
      `👤 *APPLICANT:* ${tok.customerName || tok.applicantName || 'Valued Customer'}\n` +
      `📱 *MOBILE:* +91 ${tok.phone || tok.customerPhone || 'N/A'}\n` +
      `🛠️ *SERVICE:* ${tok.service || 'e-Sevai Service'}\n` +
      `📅 *VISIT DATE:* ${tok.date || 'Today'}\n` +
      `⏰ *SLOT:* ${tok.slot || 'Counter Desk'}\n\n` +
      `✅ *STATUS:* ${tok.paymentStatus || 'Confirmed'}\n` +
      `AkEsevai Digital Portal • Palani`
    );
    const targetPhone = String(tok.phone || tok.customerPhone || '').replace(/\D/g, '');
    window.open(`https://wa.me/91${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleVerifyTokenPayment = async (tokenItem) => {
    const reqId = tokenItem.id || tokenItem.tokenNo || tokenItem.utr;
    if (!reqId) return;
    try {
      const res = await verifyTokenPaymentCloud(reqId);
      if (res && (res.success || res.token)) {
        if (typeof notify === 'function') {
          notify(`✅ ${tokenItem.customerName || 'வாடிக்கையாளர்'} கட்டணம் ₹50 சரிபார்க்கப்பட்டது! புதிய டோக்கன் எண்: ${res.token?.tokenNo || 'TOK'} வழங்கப்பட்டது.`);
        }
      } else {
        if (typeof notify === 'function') notify(`⚠️ சரிபார்ப்பதில் பிழை: ${res?.error || 'மீண்டும் முயற்சிக்கவும்'}`);
      }
    } catch (err) {
      if (typeof notify === 'function') notify(`⚠️ பிழை: ${err.message}`);
    }
  };

  const handleRejectTokenPayment = async (tokenItem) => {
    const reqId = tokenItem.id || tokenItem.tokenNo || tokenItem.utr;
    if (!reqId) return;
    const reason = window.prompt(`❌ கட்டணத்தை நிராகரிக்க காரணம் உள்ளிடவும் (Reason for rejection):`, 'Invalid UTR / Payment not received');
    if (reason === null) return;
    const trimmedReason = String(reason).trim();
    if (!trimmedReason) {
      if (typeof notify === 'function') notify('⚠️ நிராகரிக்க காரணம் அவசியம் உள்ளிட வேண்டும் (Reason is mandatory)');
      return;
    }
    try {
      const res = await rejectTokenPaymentCloud(reqId, trimmedReason);
      if (res && res.success) {
        if (typeof notify === 'function') notify(`❌ ${tokenItem.customerName || 'வாடிக்கையாளர்'} டோக்கன் கட்டணம் நிராகரிக்கப்பட்டது.`);
      } else {
        if (typeof notify === 'function') notify(`⚠️ பிழை: ${res?.error || 'மீண்டும் முயற்சிக்கவும்'}`);
      }
    } catch (err) {
      if (typeof notify === 'function') notify(`⚠️ பிழை: ${err.message}`);
    }
  };

  const customerListMap = new Map();
  Object.values(customerProfiles || {}).forEach((c) => {
    if (c && (c.phone || c.profile?.name || c.name)) {
      const cleanP = String(c.phone || '').replace(/\D/g, '');
      if (!cleanP) return;

      const existing = customerListMap.get(cleanP) || {};
      const mergedName = c.name && c.name !== 'Customer' && !c.name.startsWith('Customer ') ? c.name :
                        c.profile?.name && c.profile.name !== 'Customer' && !c.profile.name.startsWith('Customer ') ? c.profile.name :
                        existing.name || existing.profile?.name || c.name || c.profile?.name || `Customer +91 ${cleanP}`;

      const mergedAadhaar = c.aadhaarNo || c.profile?.aadhaarNo || existing.aadhaarNo || existing.profile?.aadhaarNo || '';
      const mergedDob = c.dob || c.profile?.dob || existing.dob || existing.profile?.dob || '';
      const mergedToken = c.lastToken || existing.lastToken || null;
      const rawApps = [...(existing.applications || []), ...(c.applications || [])];
      const appsMap = new Map();
      rawApps.forEach((a) => {
        if (!a) return;
        const key = String(a.id || a.ackNo || a.name || '').trim();
        if (key && !appsMap.has(key)) appsMap.set(key, a);
      });
      const mergedApps = Array.from(appsMap.values());

      const rawDocs = [...(existing.documents || []), ...(c.documents || [])];
      const docsMap = new Map();
      rawDocs.forEach((d) => {
        if (!d) return;
        const key = String(d.id || d.url || `${d.requirement}_${d.name}` || '').trim();
        if (key && !docsMap.has(key)) docsMap.set(key, d);
      });
      const mergedDocs = Array.from(docsMap.values());

      customerListMap.set(cleanP, {
        ...existing,
        ...c,
        phone: cleanP,
        name: mergedName,
        profile: {
          ...(existing.profile || {}),
          ...(c.profile || {}),
          name: mergedName,
          aadhaarNo: mergedAadhaar,
          dob: mergedDob
        },
        aadhaarNo: mergedAadhaar,
        dob: mergedDob,
        lastToken: mergedToken,
        applications: mergedApps,
        documents: mergedDocs,
        updatedAt: c.updatedAt || existing.updatedAt || new Date().toISOString()
      });
    }
  });
  const customerListArray = Array.from(customerListMap.values());

  return (
    <div id="admin-smartdesk-console" style={{ background: '#f8fafc', border: '2px solid #0052cc', borderRadius: '18px', padding: '28px', textAlign: 'left', margin: '20px 0' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <span style={{ background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} /> SMART OPERATOR DESK • 2026 இ-சேவை நிர்வாகக் மையம்
          </span>
          <h3 style={{ font: '800 22px Manrope', color: '#022c7a', margin: '6px 0 0' }}>
            நேரடி இ-சேவை <span>விண்ணப்ப உருவாக்கி, டோக்கன் மேலாண்மை & ஆவணக் காப்பகம்</span>
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            <ShieldCheck size={14} /> 🔐 அட்மின் கடவுச்சொல் மாற்று (Change Admin Password)
          </button>
        </div>
      </div>

      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        changeAdminPassword={changeAdminPassword}
        notify={notify}
      />

      {/* SMART OPERATOR CONSOLE MODULE SELECTOR TABS */}
      <div ref={moduleTabsRef} className="smartdesk-module-tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0 24px', background: '#ffffff', padding: '10px 14px', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <button
          type="button"
          onClick={(e) => { setDeskTab('all'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: deskTab === 'all' ? '#0052cc' : '#f1f5f9',
            color: deskTab === 'all' ? 'white' : '#475569'
          }}
        >
          ⚡ அனைத்து கருவிகளும் (All Modules)
        </button>
        <button
          type="button"
          onClick={(e) => { setDeskTab('banners'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: deskTab === 'banners' ? '#16a34a' : '#f1f5f9',
            color: deskTab === 'banners' ? 'white' : '#475569'
          }}
        >
          🎏 முகப்பு பேனர்கள் மேலாண்மை (Home Banners)
        </button>
        <button
          type="button"
          onClick={(e) => { setDeskTab('payments'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: deskTab === 'payments' ? '#d97706' : '#f1f5f9',
            color: deskTab === 'payments' ? 'white' : '#475569',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          💳 கட்டண சரிபார்ப்பு (Payment Approvals)
          {customerTokens.filter(t => t && (t.paymentStatus === 'PENDING_VERIFICATION' || (t.utr && !t.tokenNo && t.paymentStatus !== 'REJECTED'))).length > 0 && (
            <span style={{ background: '#ef4444', color: 'white', padding: '2px 7px', borderRadius: '10px', fontSize: '10px', fontWeight: 900 }}>
              {customerTokens.filter(t => t && (t.paymentStatus === 'PENDING_VERIFICATION' || (t.utr && !t.tokenNo && t.paymentStatus !== 'REJECTED'))).length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={(e) => { setDeskTab('ads'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            background: deskTab === 'ads' ? '#7c3aed' : '#f1f5f9',
            color: deskTab === 'ads' ? 'white' : '#475569'
          }}
        >
          📢 விளம்பர ஸ்டுடியோ (Ad Studio)
        </button>
      </div>

      {/* 💳 PRIORITY TOKEN PAYMENT VERIFICATION & TOKEN APPROVAL DESK */}
      {(deskTab === 'all' || deskTab === 'payments') && (() => {
        const pendingTokens = customerTokens.filter(t => t && (t.paymentStatus === 'PENDING_VERIFICATION' || (t.utr && !t.tokenNo && t.paymentStatus !== 'REJECTED')));
        const verifiedTokens = customerTokens.filter(t => t && t.paymentStatus === 'VERIFIED' && Boolean(t.tokenNo));
        const rejectedTokens = customerTokens.filter(t => t && t.paymentStatus === 'REJECTED');
        const verifiedRevenue = verifiedTokens.length * 50;

        return (
          <div style={{ background: '#ffffff', border: '2px solid #f59e0b', borderRadius: '18px', padding: '24px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1.5px solid #fde68a', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={14} /> PRIORITY TOKEN PAYMENT VERIFICATION DESK
                </span>
                <h3 style={{ font: '800 20px Manrope', color: '#78350f', margin: '6px 0 0' }}>
                  💳 டோக்கன் கட்டணம் சரிபார்ப்பு & டோக்கன் அனுமதி மையம்
                </h3>
                <p style={{ fontSize: '12.5px', color: '#92400e', margin: '4px 0 0' }}>
                  வாடிக்கையாளர்கள் செலுத்திய ₹50 கட்டணத்தின் UTR எண்ணை சரிபார்த்து, அதிகாரப்பூர்வ டோக்கன் எண் வழங்கவும்.
                </p>
              </div>

              {/* Stats Strip */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', padding: '8px 14px', borderRadius: '12px', textAlign: 'center' }}>
                  <small style={{ fontSize: '10px', color: '#991b1b', fontWeight: 800, display: 'block' }}>⏳ சரிபார்க்க வேண்டியவை</small>
                  <strong style={{ fontSize: '16px', color: '#dc2626' }}>{pendingTokens.length}</strong>
                </div>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '8px 14px', borderRadius: '12px', textAlign: 'center' }}>
                  <small style={{ fontSize: '10px', color: '#166534', fontWeight: 800, display: 'block' }}>✅ உறுதிசெய்யப்பட்டவை</small>
                  <strong style={{ fontSize: '16px', color: '#16a34a' }}>{verifiedTokens.length}</strong>
                </div>
                <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '8px 14px', borderRadius: '12px', textAlign: 'center' }}>
                  <small style={{ fontSize: '10px', color: '#475569', fontWeight: 800, display: 'block' }}>💰 மொத்த வருவாய்</small>
                  <strong style={{ fontSize: '16px', color: '#0052cc' }}>₹{verifiedRevenue}</strong>
                </div>
              </div>
            </div>

            {/* PENDING APPROVAL REQUESTS */}
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#d97706" /> ⏳ சரிபார்ப்பிற்கு காத்திருக்கும் புதிய கட்டணங்கள் ({pendingTokens.length})
            </h4>

            {pendingTokens.length === 0 ? (
              <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', fontWeight: 700 }}>
                ✅ அனைத்து டோக்கன் கட்டணங்களும் சரிபார்க்கப்பட்டுவிட்டன. நிலுவையில் எதுவும் இல்லை. (No pending token payment requests)
              </div>
            ) : (
              <div className="smartdesk-pending-tokens-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                {pendingTokens.map((t, idx) => (
                  <div key={t.id ? `${t.id}_${idx}` : `pending_token_${t.utr || idx}_${idx}`} style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block' }}>{t.customerName || t.applicantName || 'Applicant'}</strong>
                          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>📱 +91 {t.phone || t.customerPhone}</span>
                        </div>
                        <span style={{ background: '#16a34a', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 900 }}>
                          ₹{t.amount || 50}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#475569', display: 'grid', gap: '4px', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                        <div>🛠️ சேவை: <strong style={{ color: '#0f172a' }}>{t.service}</strong></div>
                        <div>📅 தேதி: <strong>{t.date}</strong> ({t.slot || 'Morning'})</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #e2e8f0' }}>
                          <span>🔑 UTR / Ref: <strong style={{ color: '#0052cc', letterSpacing: '0.5px' }}>{t.utr || 'N/A'}</strong></span>
                          {t.utr && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(t.utr);
                                notify(`📋 UTR ${t.utr} copied!`);
                              }}
                              style={{ background: '#f1f5f9', border: 'none', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                            >
                              Copy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleVerifyTokenPayment(t)}
                        style={{
                          flex: 2,
                          background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                        }}
                      >
                        <CheckCircle2 size={15} /> சரிபார்த்து டோக்கன் வழங்குக
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectTokenPayment(t)}
                        style={{
                          flex: 1,
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1.5px solid #fca5a5',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        ❌ நிராகரி
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* LIVE CENTER OPERATIONAL STATUS & SERVICE OF THE DAY BANNERS CONTROL DESK */}
      {(deskTab === 'all' || deskTab === 'banners') && <AdminCenterBannersControl notify={notify} />}

      {/* HOMEPAGE SPONSORED ADS & AI BANNER STUDIO CONTROL DESK */}
      {(deskTab === 'all' || deskTab === 'ads') && <AdminSponsoredAdsManager notify={notify} />}

      {/* AUTO-FILL CUSTOMER PROFILE DRAWER FOR TNEGA */}
      <AdminAutoFillProfileDrawer />

      {/* ========================================================================= */}
      {/* FULL TOKEN SLIP VIEW & PRINT MODAL */}
      {/* ========================================================================= */}
      {selectedTokenForView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', zIndex: 99999, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '26px', maxWidth: '520px', width: '100%', border: '2px solid #0052cc', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <strong style={{ fontSize: '16px', color: '#022c7a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={18} color="#0052cc" /> 🎫 வாடிக்கையாளர் டோக்கன் சீட்டு விவரம்
              </strong>
              <button onClick={() => setSelectedTokenForView(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontWeight: 900 }}>✕</button>
            </div>

            {/* PRINTABLE TOKEN CARD AREA */}
            <div id="admin-token-modal-print-area" style={{ background: '#f8fafc', border: '2px solid #0052cc', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #0052cc', paddingBottom: '10px', marginBottom: '14px' }}>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ fontSize: '15px', color: '#022c7a', display: 'block' }}>AkEsevai Digital Portal</strong>
                  <small style={{ fontSize: '10px', color: '#16a34a', fontWeight: 900 }}>OFFICIAL TOKEN ACKNOWLEDGEMENT</small>
                </div>
                <div style={{ background: '#0052cc', color: 'white', padding: '6px 14px', borderRadius: '12px', fontSize: '16px', fontWeight: 900 }}>
                  {selectedTokenForView.tokenNo || selectedTokenForView.tokenId || 'TOK-001'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px', textAlign: 'left', marginBottom: '16px' }}>
                <div><small style={{ color: '#64748b' }}>விண்ணப்பதாரர்:</small><br /><strong>{selectedTokenForView.customerName || selectedTokenForView.applicantName || 'Valued Customer'}</strong></div>
                <div><small style={{ color: '#64748b' }}>மொபைல் எண்:</small><br /><strong>+91 {selectedTokenForView.phone || selectedTokenForView.customerPhone || 'N/A'}</strong></div>
                <div style={{ gridColumn: '1 / -1' }}><small style={{ color: '#64748b' }}>சேவை:</small><br /><strong style={{ color: '#0052cc' }}>{selectedTokenForView.service}</strong></div>
                <div><small style={{ color: '#64748b' }}>தேதி & நேரம்:</small><br /><strong>{selectedTokenForView.date} ({selectedTokenForView.slot || 'Morning'})</strong></div>
                <div><small style={{ color: '#64748b' }}>நிலை:</small><br /><strong style={{ color: '#16a34a' }}>{selectedTokenForView.paymentStatus || 'Confirmed'}</strong></div>
              </div>

              {/* Barcode & Stamp Simulation */}
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'left' }}>
                  <strong>AkEsevai Palani Centre</strong><br />
                  Mill Road • Counter 1<br />
                  Issued: {selectedTokenForView.issuedAt || 'Recently'}
                </div>
                <div style={{ border: '2px solid #16a34a', borderRadius: '8px', padding: '4px 8px', color: '#16a34a', fontSize: '10px', fontWeight: 900 }}>
                  ✅ SEAL VERIFIED
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrintTokenSlipModal}
                style={{ background: '#0052cc', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,82,204,0.3)' }}
              >
                <Printer size={16} /> 🖨️ சீட்டை அச்சிடு / Download PDF
              </button>

              <button
                onClick={() => handleSendTokenWhatsApp(selectedTokenForView)}
                style={{ background: '#25D366', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}
              >
                <MessageCircle size={16} /> WhatsApp
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
