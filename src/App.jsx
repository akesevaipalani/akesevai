import { useState, useEffect, useRef, useMemo } from 'react';
import { siteConfig } from './config/siteConfig';
import { translations } from './config/translations';
import { APPOINTMENT_SLOTS_30MIN, BUSINESS_HOURS_CONFIG, getOperationalStatus } from './config/businessHours';
import { publicPages } from './data/pageManifest';
import { getStoredApplications, updateApplicationStage, deleteApplicationRecord, getDeletedAppsSet } from './utils/statusStore';
import { handleViewDocument, handleDownloadDocument, validatePhotoUpload } from './utils/documentHelper';
import {
  clearAllApplicationLocalStorage,
  saveCustomerProfileCloud,
  deleteCustomerProfileCloud,
  saveApplicationCloud,
  deleteApplicationCloud,
  subscribeApplications,
  saveTokenBookingCloud,
  deleteTokenBookingCloud,
  requestTokenBookingCloud,
  verifyTokenPaymentCloud,
  rejectTokenPaymentCloud,
  checkDuplicateUtrCloud,
  subscribeTokens,
  subscribeCustomerProfiles,
  subscribeExpiryDocuments,
  subscribeVisitorCounter,
  recordVisitorHitCloud,
  subscribeLiveQueue,
  saveLiveQueueCloud,
  subscribeServiceOfDay,
  saveServiceOfDayCloud,
  subscribeDailyVisitorLogsCloud,
  saveExpiryDocumentCloud,
  deleteExpiryDocumentCloud,
  recordLoginEventCloud,
  uploadFileToFirebaseStorage,
  uploadDataUrlToFirebaseStorage,
  fetchAllCloudRecords,
  fetchSingleCustomerProfileCloud,
  normalizePhone,
  subscribeSponsoredAds,
  saveSponsoredAdCloud,
  deleteSponsoredAdCloud
} from './utils/dataService';
import AdvertisementBannerSection from './components/AdvertisementBannerSection';
import ServiceCard from './components/ServiceCard';
import NotificationCard from './components/NotificationCard';
import NotificationTables from './components/NotificationTables';
import OtpGate from './components/OtpGate';
import TokenPass from './components/TokenPass';
import StatusTrackPage from './pages/StatusTrackPage';
import TokenGeneratorPage from './pages/TokenGeneratorPage';
import SoftwarePage from './pages/SoftwarePage';
import WeblinkPage from './pages/WeblinkPage';
import { allWebLinks } from './data/weblinksData';
import PhotoMakerPage from './pages/PhotoMakerPage';
import PhotoToolsHubPage from './pages/PhotoToolsHubPage';
import PhotoToolPage from './pages/PhotoToolPage';
import { PHOTO_TOOLS_CATALOG } from './data/photoToolsData';
import HeroDocumentShowcase from './components/HeroDocumentShowcase';
import HeroBannerSlider from './components/HeroBannerSlider';
import ServicePhotoSlider from './components/ServicePhotoSlider';
import CustomerTestimonials from './components/CustomerTestimonials';
import FloatingQuickActions from './components/FloatingQuickActions';
import AnimatedLiveStatsStrip from './components/AnimatedLiveStatsStrip';
import AiDocumentCheckerWidget from './components/AiDocumentCheckerWidget';
import CscDigitalHubWidget from './components/CscDigitalHubWidget';
import SmartServiceGuideWidget from './components/SmartServiceGuideWidget';
import AdminSevaiSmartDesk from './components/AdminSevaiSmartDesk';
import WelcomeSplashIntro from './components/WelcomeSplashIntro';
import CustomerLogoutModal from './components/CustomerLogoutModal';
import FirstTimeLoginModal from './components/FirstTimeLoginModal';
import TamilVoiceAssistantWidget from './components/TamilVoiceAssistantWidget';
import LiveWaitTimeBanner from './components/LiveWaitTimeBanner';
import WhatsAppQuickFormWidget from './components/WhatsAppQuickFormWidget';
import AdminRevenueDashboard from './components/AdminRevenueDashboard';
import DarkModeToggle, { useDarkMode } from './components/DarkModeToggle';
import ServiceOfTheDayBanner from './components/ServiceOfTheDayBanner';
import DocumentReadinessScore from './components/DocumentReadinessScore';
import PhotoBackgroundRemover from './components/PhotoBackgroundRemover';
import BrowserNotificationOptIn from './components/BrowserNotificationOptIn';
import GoogleMapEmbed from './components/GoogleMapEmbed';
import SocialMediaFollowWidget from './components/SocialMediaFollowWidget';
import InstallPwaBanner from './components/InstallPwaBanner';
import GovernmentPhotoCropperTool from './components/GovernmentPhotoCropperTool';
import DocumentExpiryTracker from './components/DocumentExpiryTracker';
import PremiumHomeAdShowcase from './components/PremiumHomeAdShowcase';
import AkEsevaiOfficePhotoSlider from './components/AkEsevaiOfficePhotoSlider';
import CustomerEasyGuide from './components/CustomerEasyGuide';
import SEOHeadManager from './components/SEOHeadManager';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './components/SocialIcons';
import {
  ArrowRight, Award, BadgeCheck, Bell, Calendar, CalendarDays, Check, ChevronDown, ChevronUp, Clock, Clock3, CreditCard,
  FileCheck2, FileText, Gift, Globe, Grid, Headphones, Home, IndianRupee, Landmark, LockKeyhole,
  LogIn, Mail, Menu, MessageCircle, MessageSquare, Phone, PhoneCall, Plus, Search, ShieldCheck, Sparkles,
  UploadCloud, User, UserCheck, UserPlus, UserRound, Users, X, ClipboardCheck, MapPin, Send, ChevronRight,
  Camera, ExternalLink, FileCog, Megaphone, BriefcaseBusiness, GraduationCap,
  FormInput, Download, ImagePlus, Printer, Trash2, Sun, Contrast, ZoomIn,
  Crop, SlidersHorizontal, Eye, LogOut, Ticket, Volume2, Flame, CheckCircle2, AlertCircle, Building2, Train, Shield, Stethoscope, BookOpen, Cpu
} from 'lucide-react';

const services = [
  { icon: Landmark, title: 'Government Certificates', tamil: 'அரசு சான்றிதழ்கள்', text: 'Community, income, nativity and legal heir certificates.' },
  { icon: FileText, title: 'Document Services', tamil: 'ஆவண சேவைகள்', text: 'Print, scan, lamination and application assistance.' },
  { icon: IndianRupee, title: 'Financial Services', tamil: 'நிதி சேவைகள்', text: 'Pension, insurance, banking and online payment support.' },
  { icon: ShieldCheck, title: 'Welfare Schemes', tamil: 'நலத்திட்டங்கள்', text: 'Find and apply for the right government welfare schemes.' },
  { icon: Users, title: 'Citizen Applications', tamil: 'குடிமக்கள் விண்ணப்பங்கள்', text: 'Apply online with a trained local service expert.' },
  { icon: BadgeCheck, title: 'Verification Support', tamil: 'சரிபார்ப்பு உதவி', text: 'Clear guidance to avoid errors and unnecessary visits.' },
];

const steps = [
  { number: '01', title: 'Tell us what you need', text: 'Choose a service and share the basics from your phone.' },
  { number: '02', title: 'Upload your documents', text: 'Securely send your documents before your visit.' },
  { number: '03', title: 'Track every update', text: 'Get clear progress notifications until completion.' },
];

const CUSTOMER_RECORDS_KEY = 'akesevai-customer-records';
const CUSTOMER_SESSION_KEY = 'akesevai-customer-session';
const ADMIN_SESSION_KEY = 'akesevai-admin-session';
const TOKEN_BOOKINGS_KEY = 'akesevai-token-bookings';

const documentRequirements = {
  Aadhaar: ['Aadhaar Card', 'Passport Photo'],
  Certificates: ['Aadhaar Card', 'Address Proof', 'Supporting Certificate'],
  'Welfare Schemes': ['Aadhaar Card', 'Family Card', 'Income Certificate', 'Bank Passbook'],
  'Identity Documents': ['Aadhaar Card', 'Address Proof', 'Passport Photo'],
  'Smart Card': ['Aadhaar Card', 'Family Card', 'Address Proof'],
  Employment: ['Aadhaar Card', 'Educational Certificate', 'Passport Photo'],
  'Education & Exams': ['Aadhaar Card', 'Educational Certificate', 'Passport Photo'],
  Business: ['Aadhaar Card', 'Address Proof', 'Business Supporting Document'],
  'Financial Services': ['Aadhaar Card', 'Bank Passbook', 'Supporting Certificate'],
  Verification: ['Aadhaar Card', 'Address Proof', 'Passport Photo'],
  'General Services': ['Aadhaar Card', 'Supporting Document'],
};

const serviceDocumentRequirements = {
  // Income Certificate / வருமானச்சான்று (5 Documents)
  'Income Certificate': ['Aadhaar Card', 'Family Card / Ration Card', 'Salary Certificate / Income Proof', 'Applicant Passport Photo', 'Self Declaration Form'],
  'வருமானச்சான்று': ['Aadhaar Card', 'Family Card / Ration Card', 'Salary Certificate / Income Proof', 'Applicant Passport Photo', 'Self Declaration Form'],
  'வருமானச் சான்றிதழ்': ['Aadhaar Card', 'Family Card / Ration Card', 'Salary Certificate / Income Proof', 'Applicant Passport Photo', 'Self Declaration Form'],
  
  // Community Certificate / சாதிச்சான்று (5 Documents)
  'Community Certificate': ['Aadhaar Card', 'Family Card / Ration Card', 'Applicant School TC / Transfer Certificate', 'Parent / Sibling Community Certificate', 'Applicant Passport Photo'],
  'சாதிச்சான்று': ['Aadhaar Card', 'Family Card / Ration Card', 'Applicant School TC / Transfer Certificate', 'Parent / Sibling Community Certificate', 'Applicant Passport Photo'],
  'சாதிச் சான்றிதழ்': ['Aadhaar Card', 'Family Card / Ration Card', 'Applicant School TC / Transfer Certificate', 'Parent / Sibling Community Certificate', 'Applicant Passport Photo'],
  
  // Nativity & Residence / பிறப்பிடச்சான்று & இருப்பிடச்சான்று (5 Documents)
  'Nativity Certificate': ['Aadhaar Card', 'Family Card / Ration Card', 'Current Address Proof (EB Bill / Gas Bill)', 'Birth Certificate or School TC', 'Applicant Passport Photo'],
  'பிறப்பிடச்சான்று': ['Aadhaar Card', 'Family Card / Ration Card', 'Current Address Proof (EB Bill / Gas Bill)', 'Birth Certificate or School TC', 'Applicant Passport Photo'],
  'Residence Certificate': ['Aadhaar Card', 'Family Card / Ration Card', 'Current Address Proof (EB Bill / Gas Bill)', 'Property Tax Receipt / Rental Agreement', 'Applicant Passport Photo'],
  'இருப்பிடச்சான்று': ['Aadhaar Card', 'Family Card / Ration Card', 'Current Address Proof (EB Bill / Gas Bill)', 'Property Tax Receipt / Rental Agreement', 'Applicant Passport Photo'],

  // First Graduate / முதல் பட்டதாரி (5 Documents)
  'First Graduate Certificate': ['Aadhaar Card', 'Family Card / Ration Card', 'Applicant 10th / 12th / Degree Mark Sheet', 'Parents Non-Graduate Proof', 'Sibling Education Declaration', 'Applicant Passport Photo'],
  'முதல் பட்டதாரி சான்றிதழ்': ['Aadhaar Card', 'Family Card / Ration Card', 'Applicant 10th / 12th / Degree Mark Sheet', 'Parents Non-Graduate Proof', 'Sibling Education Declaration', 'Applicant Passport Photo'],

  // Legal Heir / வாரிசு சான்றிதழ் (5 Documents)
  'Legal Heir Certificate': ['Deceased Person Aadhaar Card', 'Death Certificate of Deceased', 'Family Card / Ration Card', 'Aadhaar Cards of All Legal Heirs', 'Relationship Proof Form'],
  'வாரிசு சான்றிதழ்': ['Deceased Person Aadhaar Card', 'Death Certificate of Deceased', 'Family Card / Ration Card', 'Aadhaar Cards of All Legal Heirs', 'Relationship Proof Form'],

  // Pensions (5-6 Documents)
  'Old Age Pension': ['Aadhaar Card', 'Family Card / Ration Card', 'Age Proof (Voter ID / Birth Proof)', 'Bank Passbook (Single Account)', 'Destitute / Income Self Declaration', 'Applicant Passport Photo'],
  'முதியோர் ஓய்வூதியம்': ['Aadhaar Card', 'Family Card / Ration Card', 'Age Proof (Voter ID / Birth Proof)', 'Bank Passbook (Single Account)', 'Destitute / Income Self Declaration', 'Applicant Passport Photo'],
  'Destitute Widow Pension': ['Aadhaar Card', 'Family Card / Ration Card', 'Husband Death Certificate', 'Bank Passbook', 'Widow Self Declaration', 'Applicant Passport Photo'],
  'விதவை ஓய்வூதியம்': ['Aadhaar Card', 'Family Card / Ration Card', 'Husband Death Certificate', 'Bank Passbook', 'Widow Self Declaration', 'Applicant Passport Photo'],
  'Disability Pension': ['Aadhaar Card', 'Disability Certificate / UDID Card', 'Family Card / Ration Card', 'Bank Passbook', 'Applicant Passport Photo'],
  'மாற்றுத்திறனாளி ஓய்வூதியம்': ['Aadhaar Card', 'Disability Certificate / UDID Card', 'Family Card / Ration Card', 'Bank Passbook', 'Applicant Passport Photo'],

  // Passport & Identity (5 Documents)
  'Passport Application': ['Aadhaar Card', 'Date of Birth Proof (Birth Certificate / 10th Mark Sheet)', 'Current Address Proof', 'PAN Card / Voter ID', 'Passport Size Photo (White Background)'],
  'பாஸ்போர்ட்': ['Aadhaar Card', 'Date of Birth Proof (Birth Certificate / 10th Mark Sheet)', 'Current Address Proof', 'PAN Card / Voter ID', 'Passport Size Photo (White Background)'],
  'New PAN Card': ['Aadhaar Card', 'Date of Birth Proof', 'Current Address Proof', 'Passport-size photo', 'Signature / Thumb Impression Specimen'],
  'பான்கார்டு / PAN CARD': ['Aadhaar Card', 'Date of Birth Proof', 'Current Address Proof', 'Passport-size photo', 'Signature / Thumb Impression Specimen'],
  'PAN Card Correction': ['Existing PAN Card Copy', 'Aadhaar Card', 'Supporting Correction Proof', 'Passport-size photo', 'Signature Specimen'],
  'பான்கார்டு திருத்தம்': ['Existing PAN Card Copy', 'Aadhaar Card', 'Supporting Correction Proof', 'Passport-size photo', 'Signature Specimen'],

  // Smart Card / குடும்ப அட்டை (5 Documents)
  'New Smart Card': ['Aadhaar Cards of all family members', 'Address proof (Rental Agreement / EB Bill)', 'Marriage Certificate (if applicable)', 'Name Deletion Certificate', 'Head of Family Passport Photo'],
  'புதிய குடும்ப அட்டை / Smart Card': ['Aadhaar Cards of all family members', 'Address proof (Rental Agreement / EB Bill)', 'Marriage Certificate (if applicable)', 'Name Deletion Certificate', 'Head of Family Passport Photo'],
  'Smart Card Address Change': ['Family Card / Smart Card', 'New Address Proof (EB Bill / Tax Receipt)', 'Aadhaar Card of Head of Family', 'Supporting Document'],
  'குடும்ப அட்டை முகவரி மாற்றம்': ['Family Card / Smart Card', 'New Address Proof (EB Bill / Tax Receipt)', 'Aadhaar Card of Head of Family', 'Supporting Document'],
  'Smart Card Name Add or Remove': ['Family Card / Smart Card', 'Aadhaar Card of Member', 'Birth / Death / Marriage Certificate', 'Surrender Certificate if applicable'],
  'குடும்ப அட்டையில் பெயர் சேர்த்தல் / நீக்குதல்': ['Family Card / Smart Card', 'Aadhaar Card of Member', 'Birth / Death / Marriage Certificate', 'Surrender Certificate if applicable'],

  // Voter Card (4-5 Documents)
  'New Voter Card': ['Aadhaar Card', 'Age Proof (10th TC / Birth Certificate)', 'Address Proof', 'Passport-size photo', 'Family Member Voter ID Card'],
  'புதிய வாக்காளர் அட்டை': ['Aadhaar Card', 'Age Proof (10th TC / Birth Certificate)', 'Address Proof', 'Passport-size photo', 'Family Member Voter ID Card'],
  'Voter Card Correction': ['Existing Voter ID Card', 'Aadhaar Card', 'Correction Supporting Proof (TC / Mark Sheet)', 'Passport-size photo'],
  'வாக்காளர் அட்டை திருத்தம்': ['Existing Voter ID Card', 'Aadhaar Card', 'Correction Supporting Proof (TC / Mark Sheet)', 'Passport-size photo'],

  // Employment (5-6 Documents)
  'Employment Exchange Registration': ['Aadhaar Card', '10th Mark Sheet', '12th Mark Sheet / Diploma', 'Degree Certificate / Provisional', 'Community Certificate', 'Passport-size photo'],
  'வேலைவாய்ப்பு புதிய பதிவு': ['Aadhaar Card', '10th Mark Sheet', '12th Mark Sheet / Diploma', 'Degree Certificate / Provisional', 'Community Certificate', 'Passport-size photo'],
  'Employment Qualification Update': ['Employment Registration Card', 'New Educational Certificate / Mark Sheet', 'Aadhaar Card', 'Community Certificate'],
  'வேலைவாய்ப்பு கல்வி சேர்க்கை': ['Employment Registration Card', 'New Educational Certificate / Mark Sheet', 'Aadhaar Card', 'Community Certificate'],
  'Employment Renewal': ['Employment Registration Card', 'Aadhaar Card', 'Mobile Number'],
  'வேலைவாய்ப்பு புதுப்பித்தல்': ['Employment Registration Card', 'Aadhaar Card', 'Mobile Number'],
  'e-Shram Card Registration': ['Aadhaar Card', 'Bank Passbook', 'Active Mobile Number linked to Aadhaar', 'Nominee Details Document'],
  'e-SHRAM CARD': ['Aadhaar Card', 'Bank Passbook', 'Active Mobile Number linked to Aadhaar', 'Nominee Details Document'],

  // Business & Welfare (5 Documents)
  'FSSAI Food Business Registration': ['Applicant Aadhaar Card', 'Business Premise Address Proof (Rental / EB)', 'Food Business Category Details', 'NOC from Property Owner', 'Applicant Passport Photo'],
  'FSSAI REGISTRATION': ['Applicant Aadhaar Card', 'Business Premise Address Proof (Rental / EB)', 'Food Business Category Details', 'NOC from Property Owner', 'Applicant Passport Photo'],
  'TNPSC Application Support': ['Aadhaar Card', '10th / 12th / Degree Mark Sheets', 'Community Certificate', 'PSTM Certificate (if applicable)', 'Passport-size photo', 'Signature Specimen'],
  'TNPSC விண்ணப்பம்': ['Aadhaar Card', '10th / 12th / Degree Mark Sheets', 'Community Certificate', 'PSTM Certificate (if applicable)', 'Passport-size photo', 'Signature Specimen'],
  'Education Loan Application': ['Applicant Aadhaar & PAN Card', 'Parent / Co-applicant Aadhaar & PAN Card', 'College Admission Letter & Bonafide', 'Official Fee Structure of College', '10th, 12th & Degree Mark Sheets', 'Bank Passbook (6 Months)'],
  'கல்விக்கடன்': ['Applicant Aadhaar & PAN Card', 'Parent / Co-applicant Aadhaar & PAN Card', 'College Admission Letter & Bonafide', 'Official Fee Structure of College', '10th, 12th & Degree Mark Sheets', 'Bank Passbook (6 Months)'],
  'Welfare Board Registration and Renewal': ['Aadhaar Card', 'Bank Passbook', 'Work Proof / Employer Certificate', 'Family Card', 'Passport-size photo'],
  'நலவாரியம் புதிய பதிவு / புதுப்பித்தல்': ['Aadhaar Card', 'Bank Passbook', 'Work Proof / Employer Certificate', 'Family Card', 'Passport-size photo'],
  'EPFO Claim Support': ['UAN details / UAN Card', 'Aadhaar Card', 'Bank Passbook with IFSC', 'PAN Card (for TDS claim)', 'Cancelled Cheque Leaf'],
  'EPFO Advance Claim / Full Claim': ['UAN details / UAN Card', 'Aadhaar Card', 'Bank Passbook with IFSC', 'PAN Card (for TDS claim)', 'Cancelled Cheque Leaf'],

  // 10-Document Comprehensive Scheme
  'Comprehensive Business & Industrial Loan Scheme': [
    '1. Applicant Aadhaar Card',
    '2. Applicant PAN Card',
    '3. Co-Applicant / Guarantor Aadhaar Card',
    '4. Co-Applicant / Guarantor PAN Card',
    '5. Business Premise Rental Agreement / Property Document',
    '6. Business Project Report & Estimation',
    '7. GST Registration Certificate',
    '8. Bank Account Statement (Past 12 Months)',
    '9. Income Tax Return (ITR) Copy (Past 2 Years)',
    '10. Passport Size Photos of Applicant & Guarantor'
  ],
  'விரிவான அரசு கடன் திட்டம்': [
    '1. Applicant Aadhaar Card',
    '2. Applicant PAN Card',
    '3. Co-Applicant / Guarantor Aadhaar Card',
    '4. Co-Applicant / Guarantor PAN Card',
    '5. Business Premise Rental Agreement / Property Document',
    '6. Business Project Report & Estimation',
    '7. GST Registration Certificate',
    '8. Bank Account Statement (Past 12 Months)',
    '9. Income Tax Return (ITR) Copy (Past 2 Years)',
    '10. Passport Size Photos of Applicant & Guarantor'
  ]
};

function getRequiredDocuments(serviceTitle, group) {
  if (!serviceTitle) return documentRequirements[group] || ['Aadhaar Card', 'Family Card', 'Address Proof', 'Photo', 'Supporting Document'];

  const cleanTitle = String(serviceTitle).trim();
  if (serviceDocumentRequirements[cleanTitle]) return serviceDocumentRequirements[cleanTitle];

  // Try matching by lowercase or substring
  for (const [key, reqList] of Object.entries(serviceDocumentRequirements)) {
    if (cleanTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanTitle.toLowerCase())) {
      return reqList;
    }
  }

  // Keyword-based full 4-6 document lists for any unlisted or custom service
  if (cleanTitle.includes('வருமான') || cleanTitle.toLowerCase().includes('income')) {
    return serviceDocumentRequirements['Income Certificate'];
  }
  if (cleanTitle.includes('சாதி') || cleanTitle.toLowerCase().includes('community')) {
    return serviceDocumentRequirements['Community Certificate'];
  }
  if (cleanTitle.includes('பட்டதாரி') || cleanTitle.toLowerCase().includes('graduate')) {
    return serviceDocumentRequirements['First Graduate Certificate'];
  }
  if (cleanTitle.includes('வாரிசு') || cleanTitle.toLowerCase().includes('legal heir')) {
    return serviceDocumentRequirements['Legal Heir Certificate'];
  }
  if (cleanTitle.includes('ஓய்வூதியம்') || cleanTitle.toLowerCase().includes('pension')) {
    return serviceDocumentRequirements['Old Age Pension'];
  }
  if (cleanTitle.includes('பாஸ்போர்ட்') || cleanTitle.toLowerCase().includes('passport')) {
    return serviceDocumentRequirements['Passport Application'];
  }
  if (cleanTitle.includes('பான்கார்டு') || cleanTitle.toLowerCase().includes('pan')) {
    return serviceDocumentRequirements['New PAN Card'];
  }
  if (cleanTitle.includes('குடும்ப அட்டை') || cleanTitle.toLowerCase().includes('smart card')) {
    return serviceDocumentRequirements['New Smart Card'];
  }
  if (cleanTitle.includes('வாக்காளர்') || cleanTitle.toLowerCase().includes('voter')) {
    return serviceDocumentRequirements['New Voter Card'];
  }
  if (cleanTitle.includes('வேலைவாய்ப்பு') || cleanTitle.toLowerCase().includes('employment')) {
    return serviceDocumentRequirements['Employment Exchange Registration'];
  }

  if (documentRequirements[group]) return documentRequirements[group];
  return ['Aadhaar Card', 'Family Card / Ration Card', 'Current Address Proof', 'Applicant Passport Photo', 'Supporting Certificate / Proof'];
}

const appointmentSlots = APPOINTMENT_SLOTS_30MIN;

const isFirebaseConfigured = () => false;
import { setInStoreApplications } from './utils/statusStore';

const readCustomerRecords = () => {
  try {
    const raw1 = localStorage.getItem(CUSTOMER_RECORDS_KEY);
    const raw2 = localStorage.getItem('akesevai-customers');
    const recs1 = raw1 ? JSON.parse(raw1) : {};
    const recs2 = raw2 ? JSON.parse(raw2) : {};
    return { ...recs2, ...recs1 };
  } catch (e) {
    return {};
  }
};

const saveCustomerRecord = (record) => {
  if (!record || !record.phone) return;
  const cleanPhone = normalizePhone(record.phone);
  if (!cleanPhone) return;

  const normalizedRecord = {
    ...record,
    phone: cleanPhone
  };

  try {
    const current = readCustomerRecords();
    current[cleanPhone] = normalizedRecord;
    localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(current));
    localStorage.setItem('akesevai-customers', JSON.stringify(current));
  } catch (e) {}
  saveCustomerProfileCloud(cleanPhone, normalizedRecord);
};

const readTokenBookings = () => {
  try {
    const raw = localStorage.getItem(TOKEN_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const persistTokenBooking = (token) => {
  if (!token) return [];
  try {
    const current = readTokenBookings();
    const updated = [token, ...current.filter(t => String(t.tokenNo || t.id) !== String(token.tokenNo || token.id))];
    localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {}
  saveTokenBookingCloud(token);
  return [token];
};

const adminOnlyPages = new Set(['forms', 'software', 'admin']);
const menuItems = publicPages.filter(({ id }) => !adminOnlyPages.has(id)).map(({ id, label }) => [id, label]);

const notifications = [
  { icon: BriefcaseBusiness, title: 'வேலைவாய்ப்பு அறிவிப்புகள்', english: 'Recruitment Notifications', text: 'Latest government and private job openings with application details.', href: 'https://www.tnpsc.gov.in/' },
  { icon: CalendarDays, title: 'தேர்வு கால அட்டவணை / Hall Ticket', english: 'Exam Schedule & Hall Ticket', text: 'Check exam dates, download hall tickets and get last-date reminders.', href: 'https://www.dge.tn.gov.in/' },
  { icon: GraduationCap, title: 'கல்லூரி மற்றும் பல்கலைக்கழக விண்ணப்ப அறிவிப்புகள்', english: 'College & University Applications', text: 'Admissions, counselling dates, scholarships and application links.', href: 'https://www.tneaonline.org/' },
];

const serviceCatalog = [
  ['ஆதாரில் மொபைல் எண் இணைக்க', 'Aadhaar Mobile Number Update', 'Aadhaar'],
  ['ஆதாரில் முகவரி மாற்றம் செய்ய', 'Aadhaar Address Change', 'Aadhaar'],
  ['புதிய ஆதார் பதிவு / Photo & Biometric Update', 'New Aadhaar and biometric update', 'Aadhaar'],
  ['வருமானச்சான்று', 'Income Certificate', 'Certificates'],
  ['சாதிச்சான்று', 'Community Certificate', 'Certificates'],
  ['பிறப்பிடச்சான்று', 'Nativity Certificate', 'Certificates'],
  ['இருப்பிடச்சான்று', 'Residence Certificate', 'Certificates'],
  ['முதல் பட்டதாரி சான்றிதழ்', 'First Graduate Certificate', 'Certificates'],
  ['OBC சான்றிதழ்', 'OBC Certificate', 'Certificates'],
  ['தமிழ்வழிச் சான்றிதழ்', 'PSTM Certificate', 'Certificates'],
  ['வாரிசு சான்றிதழ்', 'Legal Heir Certificate', 'Certificates'],
  ['விதவை / ஆதரவற்ற விதவை சான்றிதழ்', 'Widow and Destitute Widow Certificate', 'Certificates'],
  ['கலப்புத் திருமணச் சான்றிதழ்', 'Inter Caste Marriage Certificate', 'Welfare Schemes'],
  ['முதியோர் ஓய்வூதியம்', 'Old Age Pension', 'Welfare Schemes'],
  ['விதவை ஓய்வூதியம்', 'Destitute Widow Pension', 'Welfare Schemes'],
  ['மாற்றுத்திறனாளி ஓய்வூதியம்', 'Disability Pension', 'Welfare Schemes'],
  ['விதவை மகள் திருமண நிதியுதவி', "Widow's Daughter Marriage Assistance", 'Welfare Schemes'],
  ['மாற்றுத்திறனாளி கல்வி நிதியுதவி', 'Differently Abled Scholarship', 'Welfare Schemes'],
  ['இலவச தையல் இயந்திரம்', 'Free Sewing Machine Scheme', 'Welfare Schemes'],
  ['பாஸ்போர்ட்', 'Passport Application', 'Identity Documents'],
  ['பான்கார்டு / PAN CARD', 'New PAN Card', 'Identity Documents'],
  ['பான்கார்டு திருத்தம்', 'PAN Card Correction', 'Identity Documents'],
  ['புதிய குடும்ப அட்டை / Smart Card', 'New Smart Card', 'Smart Card'],
  ['குடும்ப அட்டை முகவரி மாற்றம்', 'Smart Card Address Change', 'Smart Card'],
  ['குடும்ப அட்டையில் பெயர் சேர்த்தல் / நீக்குதல்', 'Smart Card Name Add or Remove', 'Smart Card'],
  ['புதிய வாக்காளர் அட்டை', 'New Voter Card', 'Identity Documents'],
  ['வாக்காளர் அட்டை திருத்தம்', 'Voter Card Correction', 'Identity Documents'],
  ['சிறு தொழில் சான்று', 'MSME Certificate', 'Business'],
  ['வேலைவாய்ப்பு புதிய பதிவு', 'Employment Exchange Registration', 'Employment'],
  ['வேலைவாய்ப்பு கல்வி சேர்க்கை', 'Employment Qualification Update', 'Employment'],
  ['வேலைவாய்ப்பு புதுப்பித்தல்', 'Employment Renewal', 'Employment'],
  ['e-SHRAM CARD', 'e-Shram Card Registration', 'Employment'],
  ['FSSAI REGISTRATION', 'FSSAI Food Business Registration', 'Business'],
  ['TNPSC விண்ணப்பம்', 'TNPSC Application Support', 'Education & Exams'],
  ['10, 12ஆம் வகுப்பு Duplicate Mark Sheet', 'Duplicate Mark Sheet Application', 'Education & Exams'],
  ['நலவாரியம் புதிய பதிவு / புதுப்பித்தல்', 'Welfare Board Registration and Renewal', 'Welfare Schemes'],
  ['கல்விக்கடன்', 'Education Loan Application', 'Financial Services'],
  ['மாவட்ட தொழில் மையக்கடன் / PMEGP', 'DIC Loan and PMEGP Support', 'Business'],
  ['EPFO Advance Claim / Full Claim', 'EPFO Claim Support', 'Financial Services'],
  ['TN Police Self Verification', 'TN Police Verification Support', 'Verification'],
  ['Typing / டைப்பிங் சேவை', 'Tamil and English Typing', 'General Services'],
  ['விரிவான அரசு கடன் திட்டம்', 'Comprehensive Business & Industrial Loan Scheme', 'Business'],
];



const formsCatalog = [
  ['ALL FORMS விண்ணப்பப்படிவங்கள்', 'General'], ['AADHAAR', 'Identity'], ['Adangal - Natham', 'Revenue'], ['ADANGAL SHEET', 'Revenue'], ['Adangal', 'Revenue'], ['AGE CERTIFICATE', 'General'], ['Agnipath Affidavit', 'Employment'], ['Application for Casual Leave', 'Employment'], ['Arasu Cable TV Declaration Form', 'Utility'], ['Bank KYC Form', 'Banking'], ['Bonafide Certificate - Paramedical', 'Education'], ['CCTV Camera Installation Form', 'General'], ['Community Certificate Form', 'Certificates'], ['Computer Course Certificate', 'Education'], ['Consent Letter Form', 'General'], ['Death Certificate Form', 'Certificates'], ['Disability Certificate Form', 'Welfare'], ['Driving Licence Form', 'Transport'], ['Education Loan Form', 'Banking'], ['Employment Exchange Registration', 'Employment'], ['E-Sevai Application Form', 'General'], ['FSSAI Registration Form', 'Business'], ['First Graduate Certificate', 'Education'], ['Fisherman Registration Form', 'Welfare'], ['Gas Connection Form', 'Utility'], ['Income Certificate Form', 'Certificates'], ['Inter Caste Marriage Assistance', 'Welfare'], ['Job Application Form', 'Employment'], ['Legal Heir Certificate', 'Certificates'], ['Life Certificate Form', 'Pension'], ['Marriage Certificate Form', 'Certificates'], ['Medical Insurance Form', 'Insurance'], ['Minor PAN Card Form', 'Identity'], ['MSME / Udyam Registration', 'Business'], ['Nativity Certificate Form', 'Certificates'], ['New Family Card Form', 'Smart Card'], ['New Voter ID Form', 'Identity'], ['Old Age Pension Form', 'Pension'], ['OBC Certificate Form', 'Certificates'], ['Passport Application Form', 'Identity'], ['PAN Card Application', 'Identity'], ['PAN Correction Form', 'Identity'], ['Patta Transfer Form', 'Revenue'], ['Pension Life Certificate', 'Pension'], ['Police Verification Form', 'Verification'], ['PM Kisan Registration', 'Welfare'], ['PMEGP Loan Application', 'Banking'], ['Property Tax Form', 'Utility'], ['Residence Certificate Form', 'Certificates'], ['Scholarship Application Form', 'Education'], ['Self Declaration Form', 'General'], ['Small Farmer Certificate', 'Welfare'], ['Smart Card Address Change', 'Smart Card'], ['Smart Card Name Addition', 'Smart Card'], ['Smart Card Name Deletion', 'Smart Card'], ['Smart Card Head of Family Change', 'Smart Card'], ['Student Bonafide Form', 'Education'], ['Tamil Medium Certificate / PSTM', 'Education'], ['TNPSC Application Form', 'Employment'], ['TN Police Self Verification', 'Verification'], ['Trade Licence Form', 'Business'], ['Two Female Child Scheme', 'Welfare'], ['Unemployed Youth Assistance', 'Employment'], ['Unmarried Certificate', 'Certificates'], ['Voter Correction Form', 'Identity'], ['Voter Name Deletion Form', 'Identity'], ['Voter Address Change Form', 'Identity'], ['Widow Certificate Form', 'Certificates'], ['Widow Pension Form', 'Pension'], ['Welfare Board Renewal', 'Welfare'], ['e-SHRAM Registration Form', 'Employment'], ['EPFO Claim Form', 'Pension'], ['EPFO Nominee Form', 'Pension'], ['ESI Registration Form', 'Insurance'], ['GST Registration Form', 'Business'], ['Income Tax Declaration Form', 'Tax'], ['IT Return Supporting Form', 'Tax'], ['Kisan Credit Card Form', 'Banking'], ['Labour Welfare Board Form', 'Welfare'], ['Loan Application Checklist', 'Banking'], ['NOC Application Form', 'General'], ['Passport Photo Declaration', 'Identity'], ['Ration Card Member Add Form', 'Smart Card'], ['Ration Card Member Remove Form', 'Smart Card'], ['Revenue Petition Form', 'Revenue'], ['School Admission Form', 'Education'], ['Self Employment Loan Form', 'Banking'], ['Skill Training Registration', 'Education'], ['Street Vendor Loan Form', 'Banking'], ['TNEB Name Transfer Form', 'Utility'], ['TNEB New Connection Form', 'Utility'], ['TNEB Name / Mobile Update Form', 'Utility'], ['Transport Permit Form', 'Transport'], ['UDID Application Form', 'Welfare'], ['University Admission Checklist', 'Education'], ['Vehicle Ownership Transfer', 'Transport'], ['Village Administrative Petition', 'Revenue'], ['Welfare Scheme Enquiry Form', 'Welfare'], ['Work Experience Certificate', 'Employment']
];

// Official download sources mirrored from tdcommonesevai.in/forms.
const tdcscFormLinks = {
  'AADHAAR': 'https://drive.google.com/file/d/1eqVIsUIiVLJRkAkeWjZQVXDu7CJiXxNR/view',
  'Adangal - Natham': 'https://drive.google.com/file/d/18kK5NoqTytK-fYCanaAVR2nAmlfGNHuU/view',
  'ADANGAL SHEET': 'https://drive.google.com/file/d/1bDAxCQKBXM8mGPoM4kTmVFSrl4G4sqel/view',
  'Adangal': 'https://drive.google.com/file/d/13kxBkaPmZXIlk5DDrzClVZknShoBAHmt/view',
  'AGE CERTIFICATE': 'https://docs.google.com/document/d/1Cvbhay5QmzxycRRpiyytYUqzgEC5cseA/edit',
  'Agnipath Affidavit': 'https://drive.google.com/file/d/1bS0fyygsm2P8IL4q67R99o_sKBeypP7C/view',
  'Arasu Cable TV Declaration Form': 'https://docs.google.com/document/d/1G5GWLkhIVnsf_p8h8nfXDRHB_5aSMY3y/edit',
  'Bank KYC Form': 'https://drive.google.com/file/d/1Obgy_2Y3x-Ko0ApHmBSsvVwA4BJI8VjV/view',
  'Bonafide Certificate - Paramedical': 'https://drive.google.com/file/d/15uSA7UvXy9MfamgOp9cTKigq--yzp492/view',
  'Community Certificate Form': 'https://drive.google.com/file/d/1fONuopHEsP1jhYyB5vhjWNeO7ffKhH99/view',
  'Death Certificate Form': 'https://drive.google.com/file/d/1GtnPfBE1WEkEpmzJCoQ9lKLic2kVxTs0/view',
  'Disability Certificate Form': 'https://drive.google.com/file/d/1R-PG2QOSCb9UKtjWSt_TNzkCZvAnj4p_/view',
  'Education Loan Form': 'https://drive.google.com/file/d/1x7z-z9d-4qqNG3qVcZ9eOOE4Iwd7BHKF/view',
  'Employment Exchange Registration': 'https://drive.google.com/file/d/1obV9PYzhcDc6X2318tjUkNsrsApbXLN3/view',
  'First Graduate Certificate': 'https://drive.google.com/file/d/1mPzl19mMSkI-soVd8N7BO08L3vgJM0Ji/view',
  'Income Certificate Form': 'https://drive.google.com/file/d/1bnnvcth8wCnByIGyaoYBXeJ9EbY29oBi/view',
  'Legal Heir Certificate': 'https://drive.google.com/file/d/1-Oc9oE31GD4J6okOvPC1N188K7vP62io/view',
  'Life Certificate Form': 'https://drive.google.com/file/d/1Pxbz6CmL6wKwpH0mgGWCXveNY-MpxMc2/view',
  'Medical Insurance Form': 'https://drive.google.com/file/d/1Xqd2VcGVU85sL8nkaBGqSqoKdsOjXGIR/view',
  'MSME / Udyam Registration': 'https://drive.google.com/drive/folders/1Yp8m-N5kor1FvR23PddTnBkKNoMe2Wla',
  'New Voter ID Form': 'https://drive.google.com/file/d/1BQhoH0nTsMyErd7v2Z9iCup0m1KuJr_l/view',
  'Old Age Pension Form': 'https://drive.google.com/drive/folders/1Icfwfalo6kMqfFUfogQn0Zu503e4yCMu',
  'PAN Card Application': 'https://drive.google.com/drive/folders/1LCr_YMoS_iKiMpNrDboEUCYoIMP771iH',
  'PAN Correction Form': 'https://drive.google.com/drive/folders/1LCr_YMoS_iKiMpNrDboEUCYoIMP771iH',
  'Passport Application Form': 'https://drive.google.com/file/d/1DsuCEFKHhkdSjfN8ndc2-ArDBcD-Le4G/view',
  'Patta Transfer Form': 'https://drive.google.com/file/d/1LzXI2bMI9g7EhdCAhkRPeIYEVbyfeGaJ/view',
  'Pension Life Certificate': 'https://drive.google.com/file/d/1Pxbz6CmL6wKwpH0mgGWCXveNY-MpxMc2/view',
  'Police Verification Form': 'https://drive.google.com/file/d/1aqVZyk1AtvCx8qDnZMcTT3r3TH-sDKwi/view',
  'PMEGP Loan Application': 'https://drive.google.com/file/d/1-oFS1M1AF-P07A7MzITkCovBnGP5KKUp/view',
  'Residence Certificate Form': 'https://drive.google.com/file/d/1kWNkrXKAMXq2Fh_kBZAqD8XJkl_y0c7M/view',
  'Self Declaration Form': 'https://drive.google.com/file/d/1EmFzehaUvRiVzS2wUUlnXmxD2tebU_Ca/view',
  'Smart Card Address Change': 'https://drive.google.com/file/d/1vagUs1FPKRvTOylDRiElOvntoJVlkYJ_/view',
  'TNPSC Application Form': 'https://drive.google.com/file/d/1gPkg-6Xm8t_fEhzkX_urSsUcGD8-a538/view',
  'TN Police Self Verification': 'https://drive.google.com/file/d/1aqVZyk1AtvCx8qDnZMcTT3r3TH-sDKwi/view',
  'Trade Licence Form': 'https://drive.google.com/file/d/1x7z-z9d-4qqNG3qVcZ9eOOE4Iwd7BHKF/view',
  'Unmarried Certificate': 'https://drive.google.com/file/d/1oSE2rULsPchbCxnbic25VWKR89p21PRf/view',
  'Vehicle Ownership Transfer': 'https://drive.google.com/file/d/11nqVJsMQfqMKz4_AQJMnSewv4mEJX053/view',
  'Welfare Board Renewal': 'https://drive.google.com/drive/folders/1Icfwfalo6kMqfFUfogQn0Zu503e4yCMu',
};

function toDownloadLink(link) {
  const file = link?.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (file) return `https://drive.google.com/uc?export=download&id=${file[1]}`;
  const document = link?.match(/docs\.google\.com\/document\/d\/([^/]+)/);
  if (document) return `https://docs.google.com/document/d/${document[1]}/export?format=pdf`;
  return link;
}

const validPages = [
  'home', 'services', 'status-track', 'token-generator', 'notifications',
  'about', 'contact', 'customer', 'admin', 'weblink', 'forms', 'software',
  'photo-maker', 'whatsapp-poster', 'photo-tools'
];

const getInitialPage = () => {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.replace(/^\/+/, '').replace(/\/$/, '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const queryPage = searchParams.get('page');
  const queryTool = searchParams.get('tool');

  if (queryTool) return `tools/${queryTool}`;
  if (queryPage) {
    if (queryPage === 'tools' && queryTool) return `tools/${queryTool}`;
    return queryPage;
  }

  if (pathname === 'photo-tools') return 'photo-tools';
  if (pathname.startsWith('tools/')) return pathname;
  if (pathname && validPages.includes(pathname)) return pathname;

  const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').trim();
  if (hash === 'photo-tools' || hash.startsWith('tools/')) return hash;
  if (hash && validPages.includes(hash)) return hash;

  return 'home';
};

function App() {
  const [page, setPage] = useState(getInitialPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        if (urlLang === 'en' || urlLang === 'ta') return urlLang;
      }
      const match = document.cookie.match(/akesevai-lang=(ta|en)/);
      if (match && match[1]) return match[1];
      const saved = localStorage.getItem('akesevai-lang');
      if (saved === 'en' || saved === 'ta') return saved;
    } catch (e) {}
    return 'ta';
  });
  const [customer, setCustomer] = useState(() => {
    const phone = sessionStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (!phone) return null;
    const records = readCustomerRecords();
    return records[phone] || { phone, profile: { name: 'Customer' }, applications: [], documents: [] };
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const [customerTab, setCustomerTab] = useState('overview');
  const [adminNavTab, setAdminNavTab] = useState('smartdesk');
  const [toast, setToast] = useState('');
  const [tokenBookings, setTokenBookings] = useState(() => readTokenBookings());
  const [customerRecords, setCustomerRecords] = useState(() => readCustomerRecords());
  const [applicationRecords, setApplicationRecords] = useState({});
  const [cloudExpiryDocs, setCloudExpiryDocs] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(true);
  const [isDark, setIsDark] = useDarkMode();
  const [visitorCount, setVisitorCount] = useState(18472);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const handlePopState = (event) => {
      let targetPage = 'home';
      if (event.state && event.state.page) {
        targetPage = event.state.page;
      } else {
        const pathname = window.location.pathname.replace(/^\/+/, '').replace(/\/$/, '').trim();
        if (pathname === 'photo-tools' || pathname.startsWith('tools/') || validPages.includes(pathname)) {
          targetPage = pathname;
        } else {
          const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').trim();
          if (hash === 'photo-tools' || hash.startsWith('tools/') || validPages.includes(hash)) {
            targetPage = hash;
          }
        }
      }
      setPage(targetPage);
      setMenuOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    const initial = getInitialPage();
    try {
      const cleanPath = initial === 'home' ? '/' : `/${initial}`;
      window.history.replaceState({ page: initial }, '', cleanPath);
    } catch (e) {
      console.warn('History replaceState notice:', e);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const pageTitles = {
      home: 'AkEsevai Palani | Digital Service Centre | Official Website www.akesevai.com',
      services: 'All eSevai Services in Palani | Aadhaar, Income & Community | www.akesevai.com',
      'status-track': 'Track Application Status Online | AkEsevai Palani | www.akesevai.com',
      'token-generator': 'Live Token Booking | AkEsevai Palani Digital Centre | www.akesevai.com',
      notifications: 'Government Job & Exam Notifications | AkEsevai Palani | www.akesevai.com',
      about: 'About AkEsevai Palani | Trusted Digital Service Centre | www.akesevai.com',
      contact: 'Contact Us | AkEsevai Palani Office Location & Phone | www.akesevai.com'
    };

    document.title = pageTitles[page] || 'AkEsevai Palani | Digital Service Centre | www.akesevai.com';
  }, [page]);

  useEffect(() => {
    fetchAllCloudRecords().then((cloudData) => {
      if (cloudData) {
        if (cloudData.customers && typeof cloudData.customers === 'object') {
          setCustomerRecords(cloudData.customers);
        }
        if (Array.isArray(cloudData.tokens)) {
          setTokenBookings(cloudData.tokens);
        }
        if (cloudData.applications && typeof cloudData.applications === 'object') {
          setApplicationRecords(cloudData.applications);
          setInStoreApplications(cloudData.applications);
        }
        if (Array.isArray(cloudData.documents)) {
          setCloudExpiryDocs(cloudData.documents);
        }
      }
    });

    const unsubscribeTokens = subscribeTokens((cloudTokens) => {
      if (cloudTokens && Array.isArray(cloudTokens)) {
        setTokenBookings(cloudTokens);
      }
    });

    const unsubscribeProfiles = subscribeCustomerProfiles((cloudProfiles) => {
      if (cloudProfiles && typeof cloudProfiles === 'object') {
        setCustomerRecords(cloudProfiles);
        const activePhone = sessionStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(CUSTOMER_SESSION_KEY);
        if (activePhone && (cloudProfiles[activePhone] || cloudProfiles[normalizePhone(activePhone)])) {
          setCustomer(cloudProfiles[activePhone] || cloudProfiles[normalizePhone(activePhone)]);
        }
      }
    });

    const unsubscribeApps = subscribeApplications((cloudApps) => {
      if (cloudApps && typeof cloudApps === 'object') {
        setApplicationRecords(cloudApps);
        setInStoreApplications(cloudApps);
      }
    });

    const unsubscribeDocs = subscribeExpiryDocuments((docs) => {
      if (docs && Array.isArray(docs)) {
        setCloudExpiryDocs(docs);
      }
    });

    recordVisitorHitCloud();
    const unsubscribeVisitor = subscribeVisitorCounter((count) => {
      if (typeof count === 'number' && count > 0) {
        setVisitorCount(count);
      }
    });

    const autoLogoutIfDeleted = () => {
      const activePhone = sessionStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(CUSTOMER_SESSION_KEY);
      if (activePhone) {
        const cleanActivePhone = String(activePhone).replace(/\D/g, '');
        const updatedRecords = readCustomerRecords();
        const deletedSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-customers') || '[]'));

        const isDeleted = (!updatedRecords[cleanActivePhone] && !updatedRecords[activePhone]) || deletedSet.has(cleanActivePhone) || deletedSet.has(activePhone);

        if (isDeleted) {
          sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
          localStorage.removeItem(CUSTOMER_SESSION_KEY);
          setCustomer(null);
          setPage('home');
          alert('⚠️ உங்கள் வாடிக்கையாளர் கணக்கு அட்மினால் நீக்கப்பட்டுள்ளது. தயவுசெய்து புதிய பயனராக மீண்டும் பதிவு செய்யவும்.');
        }
      }
    };

    const handleDataChanged = () => {
      const updatedRecords = readCustomerRecords();
      const updatedTokens = readTokenBookings();
      setCustomerRecords(updatedRecords);
      setTokenBookings(updatedTokens);

      autoLogoutIfDeleted();

      const activePhone = sessionStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(CUSTOMER_SESSION_KEY);
      if (activePhone) {
        const cleanActivePhone = String(activePhone).replace(/\D/g, '');
        if (updatedRecords[cleanActivePhone] || updatedRecords[activePhone]) {
          const storageRecord = updatedRecords[cleanActivePhone] || updatedRecords[activePhone];
          setCustomer(prev => {
            if (!prev) return storageRecord;
            const docMap = new Map();
            (prev.documents || []).forEach(d => {
              if (d) {
                const k = d.requirement || d.id;
                if (k) docMap.set(k, d);
              }
            });
            (storageRecord.documents || []).forEach(d => {
              if (d) {
                const k = d.requirement || d.id;
                if (k) {
                  const existing = docMap.get(k);
                  docMap.set(k, {
                    ...d,
                    data: d.data || d.url || existing?.data || existing?.url || '',
                    url: d.url || d.data || existing?.url || existing?.data || ''
                  });
                }
              }
            });
            return {
              ...storageRecord,
              documents: Array.from(docMap.values())
            };
          });
        }
      }
    };

    window.addEventListener('akesevai-data-changed', handleDataChanged);

    let syncChannel = null;
    if ('BroadcastChannel' in window) {
      try {
        syncChannel = new BroadcastChannel('akesevai_data_sync_channel');
        syncChannel.onmessage = (e) => {
          if (e.data && e.data.type === 'CUSTOMER_DELETED') {
            autoLogoutIfDeleted();
          }
        };
      } catch (e) {}
    }

    return () => {
      unsubscribeTokens();
      unsubscribeProfiles();
      unsubscribeApps();
      unsubscribeDocs();
      unsubscribeVisitor();
      window.removeEventListener('akesevai-data-changed', handleDataChanged);
      if (syncChannel) {
        try { syncChannel.close(); } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    try {
      if (lang) {
        localStorage.setItem('akesevai-lang', lang);
        document.cookie = `akesevai-lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch (e) {}
  }, [lang]);

  const toggleLang = () => {
    const nextLang = lang === 'ta' ? 'en' : 'ta';
    setLang(nextLang);
    try {
      localStorage.setItem('akesevai-lang', nextLang);
      document.cookie = `akesevai-lang=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}
    notify(nextLang === 'ta' ? 'தமிழ் மொழிக்கு மாற்றப்பட்டது' : 'Language switched to English');
  };

    let menuItems = [];
    if (adminLoggedIn) {
      menuItems = [
        ['admin:smartdesk', lang === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard'],
        ['admin:customers', lang === 'ta' ? 'வாடிக்கையாளர்கள்' : 'Customers'],
        ['admin:applications', lang === 'ta' ? 'விண்ணப்பங்கள்' : 'Applications'],
        ['admin:documents', lang === 'ta' ? 'ஆவணங்கள்' : 'Documents'],
        ['admin:tokens', lang === 'ta' ? 'கட்டணம் & டோக்கன்' : 'Payments & Tokens'],
        ['admin:notifications', lang === 'ta' ? 'அறிவிப்புகள்' : 'Notifications'],
        ['status-track', lang === 'ta' ? 'விண்ணப்ப நிலை' : 'Track Status']
      ];
    } else if (customer) {
      menuItems = [
        ['customer:overview', lang === 'ta' ? 'முகப்பு பலகை' : 'Dashboard'],
        ['customer:applications', lang === 'ta' ? 'எனது விண்ணப்பங்கள்' : 'My Applications'],
        ['customer:documents', lang === 'ta' ? 'எனது ஆவணங்கள்' : 'My Documents'],
        ['customer:token-slip', lang === 'ta' ? 'முன்னுரிமை டோக்கன்' : 'Priority Token'],
        ['status-track', lang === 'ta' ? 'விண்ணப்ப நிலை' : 'Track Status'],
        ['customer:profile-settings', lang === 'ta' ? 'சுயவிவரம்' : 'My Profile']
      ];
    } else {
      menuItems = [
        ['home', lang === 'ta' ? 'முகப்பு' : 'Home'],
        ['services', lang === 'ta' ? 'சேவைகள்' : 'Services'],
        ['notifications', lang === 'ta' ? 'அறிவிப்புகள்' : 'Notifications'],
        ['photo-tools', lang === 'ta' ? 'போட்டோ & PDF கருவிகள்' : 'Photo & PDF Tools'],
        ['weblink', lang === 'ta' ? '🌐 அரசு இணையதளங்கள்' : '🌐 Weblinks'],
        ['status-track', lang === 'ta' ? 'நிலை அறிதல்' : 'Track Status'],
        ['about', lang === 'ta' ? 'எங்களைப் பற்றி' : 'About Us'],
        ['contact', lang === 'ta' ? 'தொடர்பு' : 'Contact Us']
      ];
    }

    const handleNavClick = (id) => {
      setMenuOpen(false);
      if (id.startsWith('customer:')) {
        const subTab = id.replace('customer:', '');
        setCustomerTab(subTab);
        navigate('customer');
      } else if (id.startsWith('admin:')) {
        const subTab = id.replace('admin:', '');
        setAdminNavTab(subTab);
        navigate('admin');
      } else {
        navigate(id);
      }
    };

    const saveToken = (token) => {
      if (!token) return;
      const tokNo = String(token.tokenNo || token.tokenId || token.id || '').trim();

      // 1. Un-blacklist token number if creating a new active token
      if (tokNo) {
        try {
          const delSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));
          if (delSet.has(tokNo)) {
            delSet.delete(tokNo);
            localStorage.setItem('akesevai-deleted-tokens', JSON.stringify(Array.from(delSet)));
          }
        } catch (e) {}
      }

      persistTokenBooking(token);
      setTokenBookings((prev) => Array.isArray(prev) ? [token, ...prev.filter(t => String(t.tokenNo || t.id) !== String(token.tokenNo || token.id))] : [token]);
      saveTokenBookingCloud(token);

      // 2. Update customer's lastToken in customerRecords for immediate sync
      const cleanPhone = normalizePhone(token.phone);
      if (cleanPhone) {
        let updatedCust = null;
        setCustomerRecords((prevRecords = {}) => {
          const existingCust = prevRecords[cleanPhone] || prevRecords[token.phone] || { phone: cleanPhone, name: token.customerName };
          updatedCust = {
            ...existingCust,
            phone: cleanPhone,
            lastToken: token,
            updatedAt: new Date().toISOString()
          };
          return {
            ...prevRecords,
            [cleanPhone]: updatedCust
          };
        });
        if (updatedCust) {
          saveCustomerProfileCloud(cleanPhone, updatedCust);
        }
      }

      if ('BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('akesevai_token_sync_channel');
          channel.postMessage({ type: 'NEW_TOKEN', data: token });
          channel.close();
        } catch (e) {}
      }
    };

    const navigate = (nextPage) => {
      setPage((prevPage) => {
        if (prevPage !== nextPage) {
          try {
            const cleanPath = nextPage === 'home' ? '/' : `/${nextPage}`;
            window.history.pushState({ page: nextPage }, '', cleanPath);
          } catch (e) {
            console.warn('History pushState notice:', e);
          }
        }
        return nextPage;
      });
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const notify = (message) => {
      setToast(message);
      window.setTimeout(() => setToast(''), 3500);
    };

    const findExistingCustomerRecord = (phoneInput, recordsObj) => {
      if (!phoneInput) return null;
      const cleanP = normalizePhone(phoneInput);
      if (!cleanP) return null;
      
      const possibleKeys = [cleanP, phoneInput, `+91${cleanP}`, `91${cleanP}`, `+91 ${cleanP}`];
      for (const k of possibleKeys) {
        if (recordsObj && recordsObj[k]) {
          return recordsObj[k];
        }
      }

      if (recordsObj && typeof recordsObj === 'object') {
        const found = Object.values(recordsObj).find(c => {
          if (!c) return false;
          const cPhone = normalizePhone(c.phone || c.profile?.phone);
          return cPhone && cPhone === cleanP;
        });
        if (found) return found;
      }

      return null;
    };

    const loginCustomer = async (phone, pass = '', regDetails = null) => {
      const cleanPhone = normalizePhone(phone);
      if (!cleanPhone) return false;

      const deletedSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-customers') || '[]'));

      if (cleanPhone && deletedSet.has(cleanPhone)) {
        deletedSet.delete(cleanPhone);
        localStorage.setItem('akesevai-deleted-customers', JSON.stringify(Array.from(deletedSet)));
      }

      const records = customerRecords || readCustomerRecords();
      let existingRecord = findExistingCustomerRecord(cleanPhone, records);

      // If not found in local storage and not a new registration, check MongoDB cloud server directly
      if (!existingRecord && cleanPhone && !regDetails) {
        try {
          const singleCust = await fetchSingleCustomerProfileCloud(cleanPhone);
          if (singleCust && singleCust.phone) {
            existingRecord = singleCust;
          }
        } catch (e) {}
      }

      const hasName = existingRecord?.name || existingRecord?.profile?.name;
      const isExistingProfileComplete = Boolean(
        existingRecord &&
        existingRecord.profile?.complete &&
        hasName &&
        !hasName.startsWith('Customer ')
      );

      const isNew = !isExistingProfileComplete && !regDetails;

      const custName = regDetails?.name || (isExistingProfileComplete ? (existingRecord.name || existingRecord.profile?.name) : '');
      const custDob = regDetails?.dob || (isExistingProfileComplete ? (existingRecord.dob || existingRecord.profile?.dob) : '');
      const custAadhaar = regDetails?.aadhaarNo || (isExistingProfileComplete ? (existingRecord.aadhaarNo || existingRecord.profile?.aadhaarNo || existingRecord.aadhar) : '');
      const isComplete = Boolean(regDetails || isExistingProfileComplete);

      const record = isComplete ? {
        ...(existingRecord || {}),
        phone: cleanPhone,
        name: custName,
        dob: custDob,
        aadhaarNo: custAadhaar,
        aadhar: custAadhaar,
        profile: {
          ...(existingRecord?.profile || {}),
          name: custName,
          dob: custDob,
          aadhaarNo: custAadhaar,
          aadhar: custAadhaar,
          password: pass || existingRecord?.profile?.password || '',
          complete: true
        },
        applications: existingRecord?.applications || [],
        documents: existingRecord?.documents || [],
        appointment: existingRecord?.appointment || { date: '', time: '' }
      } : {
        phone: cleanPhone,
        name: '',
        dob: '',
        aadhaarNo: '',
        profile: { name: '', password: pass, createdAt: new Date().toISOString(), complete: false },
        applications: [],
        documents: [],
        appointment: { date: '', time: '' },
      };

      saveCustomerRecord(record);
      sessionStorage.setItem(CUSTOMER_SESSION_KEY, cleanPhone || phone);
      localStorage.setItem(CUSTOMER_SESSION_KEY, cleanPhone || phone);
      setCustomer(record);
      setCustomerRecords((prev) => ({ ...prev, [cleanPhone || phone]: record }));

      if (isComplete) {
        saveCustomerProfileCloud(cleanPhone, record);
      }

      recordLoginEventCloud({
        type: 'customer_login',
        phone,
        isNewCustomer: isNew,
        profileName: record.profile?.name || 'Customer'
      });

      setIsFirstTimeLogin(isNew);
      setShowFirstLoginModal(true);
      notify(isNew ? 'Account created. Your details will be saved for your next login.' : `Welcome back ${custName}! Your saved details are ready.`);
    };

    const updateCustomer = (updater) => {
      setCustomer((current) => {
        const updated = typeof updater === 'function' ? updater(current) : updater;
        saveCustomerRecord(updated);
        setCustomerRecords((prev) => ({
          ...prev,
          [updated.phone]: updated
        }));
        if (updated && updated.phone) {
          saveCustomerProfileCloud(updated.phone, updated);
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('akesevai-data-changed'));
        }
        return updated;
      });
    };

    const logoutCustomer = () => {
      sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
      setCustomer(null);
      setShowLogoutModal(true);
      navigate('home');
      notify('பாதுகாப்பாக வெளியேற்றப்பட்டீர்கள். முகப்புப் பக்கம் மாற்றப்பட்டது.');
    };

    const loginAdmin = (password) => {
      if (password !== 'admin123') { notify('Incorrect admin password.'); return false; }
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setAdminLoggedIn(true);
      recordLoginEventCloud({
        type: 'admin_login',
        role: 'Administrator'
      });
      notify('Admin dashboard opened.');
      return true;
    };

    const logoutAdmin = () => {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setAdminLoggedIn(false);
      navigate('home');
      notify('Admin logged out safely.');
    };

    return (
      <div className={`app-shell ${isDark ? 'dark' : 'light'}`}>
        <SEOHeadManager activeTab={page} currentToolId={page.startsWith('tools/') ? page.replace('tools/', '') : ''} />
        <CustomerLogoutModal
          isOpen={showLogoutModal}
          onClose={() => {
            setShowLogoutModal(false);
            navigate('home');
          }}
        />
        <header className="site-header">
          <div className="header-inner">
            <button className="brand" onClick={() => navigate('home')} aria-label="AK e-Sevai home">
              <div className="brand-logo-container">
                <img src="/logo.png" alt="AK e-Sevai Logo" className="brand-logo-img" />
              </div>
              <div className="brand-text-wrap">
                <strong className="brand-name">
                  AK <span className="brand-highlight">e-Sevai</span>
                </strong>
                <small className="brand-tagline">
                  {lang === 'ta' ? 'நம்பகமான இ-சேவை மையம்' : 'Your Trusted e-Sevai Centre'}
                </small>
              </div>
            </button>

            {/* MAIN NAVIGATION (DESKTOP & MOBILE DRAWER) */}
            <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} id="site-navigation-drawer">
              {/* MOBILE DRAWER TOP BAR (Visible only when mobile drawer is open) */}
              <div className="mobile-drawer-header">
                <div className="mobile-drawer-brand">
                  <img src="/logo.png" alt="AK e-Sevai Logo" className="mobile-drawer-logo" />
                  <div>
                    <strong className="mobile-drawer-title">AK <span style={{ color: '#16a34a' }}>e-Sevai</span></strong>
                    <small className="mobile-drawer-subtitle">{lang === 'ta' ? 'பழனி டிஜிட்டல் மையம்' : 'Palani Digital Centre'}</small>
                  </div>
                </div>
                <button
                  type="button"
                  id="mobile-drawer-close-btn"
                  className="mobile-drawer-close-btn"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  title={lang === 'ta' ? 'மெனுவை மூடுக' : 'Close Menu'}
                >
                  <X size={22} strokeWidth={2.5} />
                </button>
              </div>

              {/* NAVIGATION LINKS */}
              <div className="nav-links-container">
                {menuItems.map(([id, label]) => (
                  <button
                    key={id}
                    id={`nav-item-${id.replace(':', '-')}`}
                    className={`nav-link-btn ${(page === id || (id === 'photo-tools' && page.startsWith('tools/')) || (id.startsWith('customer:') && page === 'customer' && customerTab === id.replace('customer:', '')) || (id.startsWith('admin:') && page === 'admin' && adminNavTab === id.replace('admin:', ''))) ? 'nav-active' : ''}`}
                    onClick={() => handleNavClick(id)}
                  >
                    <span className="nav-link-text">{label}</span>
                    <ChevronRight size={16} className="mobile-nav-arrow" />
                  </button>
                ))}
              </div>

              {/* MOBILE ACTION GRID (Row 1: Language & Customer Login, Row 2: Admin) */}
              <div className="mobile-menu-actions">
                <button
                  type="button"
                  id="mobile-drawer-lang-btn"
                  className="drawer-action-btn drawer-lang-btn"
                  onClick={() => { toggleLang(); }}
                  title={lang === 'ta' ? 'Switch to English' : 'தமிழ் மொழிக்கு மாற்றுக'}
                >
                  🌐 <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
                </button>

                {adminLoggedIn ? (
                  <button
                    type="button"
                    className="drawer-action-btn drawer-logout-btn"
                    style={{ gridColumn: '1 / -1' }}
                    onClick={() => { logoutAdmin(); setMenuOpen(false); }}
                  >
                    <LogOut size={16} /> {lang === 'ta' ? 'நிர்வாகி வெளியேறு' : 'Logout Admin'}
                  </button>
                ) : customer ? (
                  <button
                    type="button"
                    className="drawer-action-btn drawer-logout-btn"
                    style={{ gridColumn: '1 / -1' }}
                    onClick={() => { logoutCustomer(); setMenuOpen(false); }}
                  >
                    <LogOut size={16} /> {lang === 'ta' ? 'வெளியேறு' : 'Logout'}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      id="mobile-drawer-customer-btn"
                      className="drawer-action-btn drawer-customer-btn"
                      onClick={() => { navigate('customer'); setMenuOpen(false); }}
                    >
                      <UserRound size={16} /> <span>{lang === 'ta' ? 'வாடிக்கையாளர்' : 'Customer Login'}</span>
                    </button>

                    <button
                      type="button"
                      id="mobile-drawer-admin-btn"
                      className="drawer-action-btn drawer-admin-btn"
                      onClick={() => { navigate('admin'); setMenuOpen(false); }}
                    >
                      <LockKeyhole size={15} /> <span>{lang === 'ta' ? 'நிர்வாகி' : 'Admin'}</span>
                    </button>
                  </>
                )}
              </div>
            </nav>

            <div className="header-actions-right">
              <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />

              <button
                type="button"
                id="header-lang-switcher-btn"
                className="lang-switcher-btn desktop-header-lang-btn"
                onClick={toggleLang}
                title={lang === 'ta' ? 'Switch language to English' : 'தமிழ் மொழிக்கு மாற்றுக'}
              >
                🌐 <span className="lang-switcher-text">{lang === 'ta' ? 'EN' : 'தமிழ்'}</span>
              </button>

              {adminLoggedIn ? (
                <>
                  <button
                    className="desktop-only-btn"
                    onClick={() => { setAdminNavTab('smartdesk'); navigate('admin'); }}
                    style={{ background: '#f0fdf4', border: '1.5px solid #86efac', color: '#15803d', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ShieldCheck size={14} color="#16a34a" /> {lang === 'ta' ? 'நிர்வாகம்' : 'Admin: ON'}
                  </button>
                  <button
                    className="desktop-only-btn"
                    onClick={logoutAdmin}
                    style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#dc2626', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <LogOut size={14} /> {lang === 'ta' ? 'வெளியேறு' : 'Logout'}
                  </button>
                </>
              ) : customer ? (
                <>
                  <button
                    className="desktop-only-btn"
                    onClick={() => { setCustomerTab('overview'); navigate('customer'); }}
                    style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1e40af', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <UserRound size={14} /> {customer.profile?.name || customer.name || 'Customer'}
                  </button>
                  <button
                    className="desktop-only-btn"
                    onClick={logoutCustomer}
                    style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#dc2626', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <LogOut size={14} /> {lang === 'ta' ? 'வெளியேறு' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="nav-btn-customer desktop-only-btn"
                    id="desktop-nav-customer-btn"
                    onClick={() => navigate('customer')}
                    title="Customer Portal"
                  >
                    <UserRound size={14} /> {lang === 'ta' ? 'வாடிக்கையாளர்' : 'Customer Login'}
                  </button>

                  <button
                    type="button"
                    className="nav-btn-admin desktop-only-btn"
                    id="desktop-nav-admin-btn"
                    onClick={() => navigate('admin')}
                    title="Admin Login"
                  >
                    <LockKeyhole size={13} style={{ color: '#fbbf24' }} /> {lang === 'ta' ? 'நிர்வாகி' : 'Admin'}
                  </button>
                </>
              )}

              <button
                type="button"
                className="menu-button"
                id="header-hamburger-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                title="Toggle mobile menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>
        <div className="announcement-bar" aria-label="AkEsevai updates">
          <div className="announcement-track"><span>AK ESEVAI • PALANI'S DIGITAL SERVICE PARTNER</span><span>APPOINTMENTS OPEN TODAY • 10:00 AM - 8:00 PM</span><span>DOCUMENTS • CERTIFICATES • WELFARE SCHEMES</span><span>AK ESEVAI • PALANI'S DIGITAL SERVICE PARTNER</span></div>
        </div>

        <main>
          {page === 'home' && <HomePage navigate={navigate} notify={notify} lang={lang} visitorCount={visitorCount} />}
          {page === 'services' && <ServicesPage navigate={navigate} lang={lang} />}
          {page === 'photo-tools' && <PhotoToolsHubPage navigate={navigate} lang={lang} />}
          {page.startsWith('tools/') && <PhotoToolPage toolId={page.replace('tools/', '')} navigate={navigate} notify={notify} lang={lang} />}
          {page === 'weblink' && <WeblinkPage notify={notify} lang={lang} />}
          {page === 'photo-maker' && <PhotoMakerPage notify={notify} lang={lang} />}
          {page === 'forms' && (adminLoggedIn ? <FormsPage notify={notify} lang={lang} /> : <PrivatePageGate navigate={navigate} />)}
          {page === 'notifications' && <NotificationsPage lang={lang} navigate={navigate} />}
          {page === 'software' && (adminLoggedIn ? <SoftwarePage notify={notify} navigate={navigate} lang={lang} /> : <PrivatePageGate navigate={navigate} />)}
          {page === 'whatsapp-poster' && <WhatsappPosterPage notify={notify} lang={lang} />}
          {page === 'status-track' && <StatusTrackPage lang={lang} />}
          {page === 'token-generator' && <TokenGeneratorPage onTokenSaved={saveToken} lang={lang} />}
          {page === 'about' && <AboutPage navigate={navigate} lang={lang} />}
          {page === 'contact' && <ContactPage notify={notify} lang={lang} />}
          {page === 'customer' && !customer && <OtpGate notify={notify} onVerified={loginCustomer} onClose={() => navigate('home')} />}
          {page === 'customer' && customer && <CustomerPage customer={customer} updateCustomer={updateCustomer} logout={logoutCustomer} notify={notify} saveToken={saveToken} cloudExpiryDocs={cloudExpiryDocs} activeTab={customerTab} setActiveTab={setCustomerTab} lang={lang} navigate={navigate} />}
          {page === 'admin' && <AdminPage loggedIn={adminLoggedIn} login={loginAdmin} logout={logoutAdmin} navigate={navigate} tokenBookings={tokenBookings} setTokenBookings={setTokenBookings} customerRecords={customerRecords} setCustomerRecords={setCustomerRecords} applicationRecords={applicationRecords} setApplicationRecords={setApplicationRecords} cloudExpiryDocs={cloudExpiryDocs} notify={notify} activeTab={adminNavTab} setActiveTab={setAdminNavTab} lang={lang} />}
        </main>

        <footer className="site-footer">
          <div>
            <button className="brand footer-brand" onClick={() => navigate('home')} style={{ gap: '12px' }}>
              <img src="/logo.png" alt="AkEsevai Logo" className="brand-logo-img" style={{ height: '44px', background: 'white', padding: '4px', borderRadius: '8px' }} />
              <div>
                <strong className="brand-name" style={{ fontSize: '18px', color: 'white' }}>AkEsevai CENTRE</strong>
                <small style={{ color: '#86efac', display: 'block', fontSize: '9px', fontWeight: 700, lineHeight: 1.25 }}>{t.tagline}</small>
              </div>
            </button>
            <p>{t.footerDesc}</p>
            <div className="footer-social-links" style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={siteConfig.youtube} target="_blank" rel="noreferrer" title="YouTube: @AkEsevai" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FF0000', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 3px 10px rgba(255,0,0,0.3)' }}>
                <YoutubeIcon size={15} color="white" /> YouTube
              </a>
              <a href={siteConfig.instagram} target="_blank" rel="noreferrer" title="Instagram: @akesevai" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 3px 10px rgba(225,48,108,0.3)' }}>
                <InstagramIcon size={15} color="white" /> Instagram
              </a>
              <a href={siteConfig.facebook} target="_blank" rel="noreferrer" title="Facebook Page" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1877F2', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 3px 10px rgba(24,119,242,0.3)' }}>
                <FacebookIcon size={15} color="white" /> Facebook
              </a>
            </div>

            {/* Photo Tools Footer Links */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <strong style={{ fontSize: '12px', color: '#93c5fd', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                📸 Free Photo & Document Tools:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px' }}>
                <button onClick={() => navigate('photo-tools')} style={{ background: 'none', border: 'none', color: '#86efac', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>All Tools Hub</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/passport-size-photo')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Passport Photo</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/photo-compress-20kb')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Compress 20KB</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/photo-compress-50kb')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Compress 50KB</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/photo-compress-100kb')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Compress 100KB</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/photo-crop')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Photo Crop</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/jpg-to-pdf')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>JPG to PDF</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/png-to-jpg')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>PNG to JPG</button>
                <span style={{ color: '#475569' }}>•</span>
                <button onClick={() => navigate('tools/pdf-compress')} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>PDF Compress</button>
              </div>
            </div>
          </div>
          <div className="footer-contact"><span><MapPin size={16} /> {siteConfig.address}</span><a href={`tel:${siteConfig.phone}`}><Phone size={16} /> {siteConfig.displayPhone}</a><a href={`mailto:${siteConfig.email}`}><Mail size={16} /> {siteConfig.email}</a></div>
          <div className="footer-bottom"><span>{t.footerRights}</span><span>{t.footerAssistance}</span></div>
        </footer>
        <FloatingQuickActions navigate={navigate} />
        <CustomerEasyGuide navigate={navigate} />
        {toast && <div className="toast"><Check size={18} /> {toast}</div>}
      </div>
    );
  }

function AdEnquiryCard() {
      return (
        <div className="ad-enquiry-card">
          <div className="ad-enquiry-inner">
            <span className="ad-speaker-icon">📢</span>
            <div className="ad-text-block">
              <strong className="ad-title-label">விளம்பரத்தொடர்புக்கு / For Advertisement Enquiry:</strong>
              <a href="tel:9342318844" className="ad-phone-number">
                📞 <span>+91 93423 18844</span>
              </a>
            </div>
            <a
              href="https://wa.me/919342318844?text=🙏%20*வணக்கம்*,%20விளம்பரம்%20குறித்து%20தொடர்பு%20கொள்கிறேன்.%20AkEsevai%20இணையதளம்%20மூலம்."
              target="_blank"
              rel="noreferrer"
              className="ad-whatsapp-btn"
            >
              <MessageCircle size={16} /> 💬 WhatsApp
            </a>
          </div>
        </div>
      );
    }

function HomePage({ navigate, notify, lang, visitorCount = 18472 }) {
  const isTa = lang === 'ta';
  const t = translations[lang] || translations.en;

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="top-announcement-banner">
        <marquee scrollamount="4">
          {isTa
            ? '✨ AK e-Sevai மையம் பழனி • அரசு சான்றிதழ்கள், ஆதார், பட்டா, ஸ்மார்ட் கார்டு, உதவித்தொகை மற்றும் அனைத்து அரசு நலத்திட்ட விண்ணப்பங்கள் • நேரம்: திங்கள் – சனி காலை 10:00 – இரவு 8:00 • உதவிக்கு: 93423 18844 ✨'
            : '✨ AK e-Sevai Centre Palani • Government Certificates, Aadhaar, Smart Card, Pension & All Online Welfare Schemes • Hours: Mon–Sat 10:00 AM – 8:00 PM • Help: 93423 18844 ✨'}
        </marquee>
      </div>

      <div className="page-width">
        {/* 2. COMPACT MODERN HERO SECTION */}
        <section className="modern-home-hero">
          <div className="hero-badge-pill">
            <span>🏛️</span>
            <span>{isTa ? 'தமிழ்நாடு & மத்திய அரசு அங்கீகரிக்கப்பட்ட இ-சேவை மையம் • Palani' : 'Government Approved e-Sevai Digital Centre • Palani'}</span>
          </div>

          <h1 className="hero-main-headline">
            AK e-Sevai Centre
            <span style={{ display: 'block', color: '#16a34a', fontSize: '0.85em', marginTop: '6px' }}>
              {isTa ? 'அரசு மற்றும் ஆன்லைன் சேவைகளை எளிதாக பெறுங்கள்' : 'Essential Government & Citizen Services Made Simple'}
            </span>
          </h1>

          <p className="hero-main-subtitle">
            {isTa
              ? 'வீட்டிலிருந்தே விண்ணப்பிக்கலாம் • ஆவணங்களை பதிவேற்றலாம் • விண்ணப்ப நிலையை உடனுக்குடன் கண்காணிக்கலாம்'
              : 'Apply online from home • Upload documents safely • Track application progress in real time'}
          </p>

          {/* 5 PRIMARY ACTION BUTTONS */}
          <div className="hero-cta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <button className="hero-cta-btn hero-cta-primary" onClick={() => navigate('services')}>
              <Grid size={17} /> {isTa ? '🟢 சேவைகள்' : '🟢 View Services'}
            </button>

            <button className="hero-cta-btn hero-cta-login" onClick={() => navigate('customer')}>
              <UserRound size={17} /> {isTa ? '🔵 விண்ணப்பிக்க' : '🔵 Apply / Login'}
            </button>

            <button className="hero-cta-btn hero-cta-track" onClick={() => navigate('status-track')}>
              <Search size={17} /> {isTa ? '🔍 நிலை அறிய' : '🔍 Track Status'}
            </button>

            <button className="hero-cta-btn hero-cta-token" onClick={() => navigate('token-generator')}>
              <Ticket size={17} /> {isTa ? '🎟️ முன்னுரிமை டோக்கன்' : '🎟️ Priority Token'}
            </button>

            <button 
              className="hero-cta-btn" 
              onClick={() => navigate('photo-tools')}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Camera size={17} /> {isTa ? '📸 போட்டோ கருவிகள்' : '📸 Photo Tools'}
            </button>
          </div>

          {/* COMPACT REAL OFFICE SHOWCASE SLIDER */}
          <div className="home-centre-image-section" style={{ width: '100%', maxWidth: '960px', margin: '20px auto 14px', position: 'relative' }}>
            <AkEsevaiOfficePhotoSlider />
          </div>

          {/* TRUST HIGHLIGHT BADGES */}
          <div className="hero-trust-strip">
            <span className="hero-trust-item"><ShieldCheck size={15} color="#16a34a" /> {isTa ? 'அரசு அங்கீகாரம்' : 'Govt Authorized'}</span>
            <span className="hero-trust-item">⚡ {isTa ? 'Same-Day சமர்ப்பிப்பு' : 'Same-Day Processing'}</span>
            <span className="hero-trust-item">📄 {isTa ? '100 KB ஆவண பெட்டகம்' : '100 KB Doc Vault'}</span>
            <span className="hero-trust-item">🔒 {isTa ? 'பாதுகாப்பான தளம்' : '256-Bit Secure'}</span>
            <span className="hero-trust-item">📱 {isTa ? 'நேரடி SMS நிலை' : 'Live SMS Alerts'}</span>
          </div>
        </section>
      </div>

      {/* 3. OPERATIONAL STATUS & LIVE QUEUE STRIP */}
      <div className="page-width">
        <LiveWaitTimeBanner lang={lang} navigate={navigate} />
      </div>

      {/* 4. RESPONSIVE ADVERTISEMENT BANNER CAROUSEL (Active Ads Only) */}
      <AdvertisementBannerSection lang={lang} navigate={navigate} />



      {/* 8. SHORT CONTACT & ASSISTANCE STRIP */}
      <div className="page-width">
        <section style={{ background: 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)', color: '#ffffff', padding: '20px 24px', borderRadius: '16px', margin: '20px auto 32px', boxShadow: '0 8px 20px rgba(2, 44, 122, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fde047', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
                {isTa ? 'நேரடி உதவி மையம்' : 'DIRECT ASSISTANCE'}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '6px 0 2px', color: '#ffffff' }}>
                {isTa ? 'உங்களுக்கு உதவி அல்லது ஆலோசனை தேவையா?' : 'Need Help or Guidance?'}
              </h3>
              <p style={{ fontSize: '12px', color: '#e0f2fe', margin: 0 }}>
                📍 AK e-Sevai Centre, Mill Road, Palani • 🕘 {isTa ? 'திங்கள் – சனி காலை 10:00 – இரவு 8:00' : 'Mon–Sat 10:00 AM – 8:00 PM'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="tel:9342318844" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', color: '#022c7a', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>
                <PhoneCall size={16} color="#16a34a" /> <span>+91 93423 18844</span>
              </a>

              <a href="https://wa.me/919342318844" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#ffffff', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>
                <MessageSquare size={16} color="#ffffff" /> <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const getServiceVisual = (group, title = '') => {
  const t = title.toLowerCase();
  let bgGradient = 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)';
  let icon = '📄';
  let bannerImage = '';

  const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '');

  if (t.includes('aadhaar') || t.includes('ஆதார்')) {
    bgGradient = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
    icon = '🪪';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#ffffff" rx="10"/><rect x="0" y="0" width="400" height="38" fill="#e11d48"/><text x="15" y="24" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">भारत सरकार · Government of India</text><rect x="20" y="52" width="75" height="90" fill="#f1f5f9" rx="6" stroke="#cbd5e1"/><circle cx="57" cy="85" r="22" fill="#94a3b8"/><path d="M37 125 c0-15 40-15 40 0" fill="#64748b"/><text x="110" y="72" fill="#0f172a" font-family="sans-serif" font-size="13" font-weight="bold">AADHAAR CARD · ஆதார்</text><text x="110" y="93" fill="#475569" font-family="sans-serif" font-size="11">DOB: 01/01/1990 · Male</text><text x="110" y="112" fill="#475569" font-family="sans-serif" font-size="11">Update & Correction Service</text><rect x="110" y="125" width="260" height="15" fill="#0f172a" opacity="0.1" rx="3"/><text x="200" y="182" fill="#e11d48" font-family="monospace" font-size="20" font-weight="bold" text-anchor="middle">5819 4012 8912</text><text x="200" y="205" fill="#0284c7" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Unique Identification Authority of India (UIDAI)</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else if (t.includes('pan') || t.includes('பான்')) {
    bgGradient = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
    icon = '💳';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#fffbeb" rx="10" stroke="#fcd34d"/><rect x="0" y="0" width="400" height="40" fill="#b45309"/><text x="15" y="25" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">INCOME TAX DEPARTMENT · வருமான வரித் துறை</text><rect x="20" y="55" width="70" height="85" fill="#fef3c7" rx="6" stroke="#fcd34d"/><circle cx="55" cy="90" r="20" fill="#d97706"/><text x="105" y="75" fill="#78350f" font-family="sans-serif" font-size="11" font-weight="bold">GOVT OF INDIA · PAN CARD</text><text x="105" y="100" fill="#b45309" font-family="monospace" font-size="18" font-weight="bold">ABCDE 1234 F</text><text x="105" y="122" fill="#451a03" font-family="sans-serif" font-size="11">NAME: CARD HOLDER NAME</text><rect x="20" y="155" width="360" height="48" fill="#ffffff" rx="6" stroke="#fcd34d"/><text x="200" y="184" fill="#d97706" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">💳 PERMANENT ACCOUNT NUMBER CARD</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else if (t.includes('passport') || t.includes('பாஸ்போர்ட்')) {
    bgGradient = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
    icon = '🛂';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#0f172a" rx="10"/><rect x="15" y="12" width="370" height="196" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-dasharray="3"/><circle cx="200" cy="85" r="32" fill="none" stroke="#f59e0b" stroke-width="3"/><text x="200" y="93" fill="#f59e0b" font-family="serif" font-size="26" text-anchor="middle">🏛️</text><text x="200" y="140" fill="#f59e0b" font-family="serif" font-size="18" font-weight="bold" text-anchor="middle">PASSPORT</text><text x="200" y="162" fill="#fbbf24" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle">REPUBLIC OF INDIA</text><text x="200" y="186" fill="#94a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">Passport Seva Application Support</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else if (t.includes('smart card') || t.includes('famil') || t.includes('குடும்ப அட்டை') || t.includes('ration')) {
    bgGradient = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
    icon = '🌾';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#f0fdf4" rx="10" stroke="#16a34a"/><rect x="0" y="0" width="400" height="40" fill="#15803d"/><text x="15" y="25" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">TAMIL NADU PDS · SMART RATION CARD</text><rect x="20" y="55" width="75" height="90" fill="#dcfce7" rx="6" stroke="#86efac"/><circle cx="57" cy="90" r="22" fill="#16a34a"/><text x="110" y="75" fill="#14532d" font-family="sans-serif" font-size="13" font-weight="bold">தமிழ்நாடு அரசு உணவளிப்புத் துறை</text><text x="110" y="98" fill="#166534" font-family="sans-serif" font-size="11">Smart Card Type: NPHH / PHH</text><text x="110" y="118" fill="#166534" font-family="sans-serif" font-size="11">Family Head: Card Member Name</text><rect x="20" y="155" width="360" height="48" fill="#ffffff" rx="6" stroke="#86efac"/><text x="35" y="184" fill="#15803d" font-family="monospace" font-size="14" font-weight="bold">33/W/0123456</text><text x="365" y="184" fill="#16a34a" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="end">🌾 TNPDS SMART CARD</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else if (t.includes('voter') || t.includes('வாக்காளர்')) {
    bgGradient = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
    icon = '🗳️';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#fef2f2" rx="10" stroke="#dc2626"/><rect x="0" y="0" width="400" height="40" fill="#b91c1c"/><text x="15" y="25" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">ELECTION COMMISSION OF INDIA · வாக்காளர் அட்டை</text><rect x="20" y="55" width="75" height="90" fill="#fee2e2" rx="6" stroke="#fca5a5"/><circle cx="57" cy="90" r="22" fill="#dc2626"/><text x="110" y="78" fill="#991b1b" font-family="monospace" font-size="16" font-weight="bold">EPIC NO: TN/04/123456</text><text x="110" y="102" fill="#7f1d1d" font-family="sans-serif" font-size="12">ELECTOR NAME: VOTER NAME</text><text x="110" y="122" fill="#7f1d1d" font-family="sans-serif" font-size="11">Assembly Constituency: Tamil Nadu</text><rect x="20" y="155" width="360" height="48" fill="#ffffff" rx="6" stroke="#fca5a5"/><text x="200" y="184" fill="#dc2626" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">🗳️ VOTER ID CARD SERVICES</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else if (t.includes('income') || t.includes('வருமான') || t.includes('community') || t.includes('சாதி') || t.includes('nativity') || t.includes('residence') || t.includes('graduate') || t.includes('heir') || t.includes('certif') || t.includes('சான்றிதழ்')) {
    bgGradient = 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)';
    icon = '📜';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#faf5ff" rx="10" stroke="#9333ea"/><rect x="0" y="0" width="400" height="38" fill="#7e22ce"/><text x="15" y="24" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">TNeGA · GOVERNMENT OF TAMIL NADU e-SEVAI</text><rect x="15" y="48" width="370" height="158" fill="#ffffff" rx="6" stroke="#e9d5ff"/><text x="200" y="75" fill="#6b21a8" font-family="serif" font-size="15" font-weight="bold" text-anchor="middle">OFFICIAL GOVERNMENT CERTIFICATE</text><text x="200" y="100" fill="#7e22ce" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">${cleanTitle.slice(0, 32)}</text><text x="200" y="122" fill="#581c87" font-family="monospace" font-size="11" text-anchor="middle">TN-720260728101</text><line x1="40" y1="135" x2="360" y2="135" stroke="#f3e8ff" stroke-width="2"/><text x="200" y="158" fill="#16a34a" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✅ Digitally Signed & Revenue Approved</text><text x="200" y="182" fill="#6b21a8" font-family="sans-serif" font-size="11" text-anchor="middle">AkEsevai Fast Processing Portal</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else if (t.includes('employment') || t.includes('வேலைவாய்ப்பு') || t.includes('shram')) {
    bgGradient = 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)';
    icon = '💼';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#f0f9ff" rx="10" stroke="#0284c7"/><rect x="0" y="0" width="400" height="40" fill="#0369a1"/><text x="15" y="25" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">MINISTRY OF LABOUR & EMPLOYMENT · e-SHRAM</text><rect x="20" y="52" width="360" height="152" fill="#ffffff" rx="8" stroke="#bae6fd"/><circle cx="200" cy="95" r="28" fill="#e0f2fe"/><text x="200" y="103" fill="#0284c7" font-family="sans-serif" font-size="22" text-anchor="middle">💼</text><text x="200" y="148" fill="#0369a1" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${cleanTitle.slice(0, 32)}</text><text x="200" y="174" fill="#0284c7" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Employment Registration & Renewal Card</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else {
    bgGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
    icon = '📄';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="100%" height="100%" fill="#eff6ff" rx="10" stroke="#2563eb"/><rect x="0" y="0" width="400" height="40" fill="#1d4ed8"/><text x="15" y="25" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">AkEsevai OFFICIAL SERVICE CARD</text><rect x="20" y="52" width="360" height="152" fill="#ffffff" rx="8" stroke="#bfdbfe"/><circle cx="200" cy="95" r="28" fill="#dbeafe"/><text x="200" y="103" fill="#1d4ed8" font-family="sans-serif" font-size="22" text-anchor="middle">📋</text><text x="200" y="148" fill="#1e40af" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${cleanTitle.slice(0, 32)}</text><text x="200" y="174" fill="#2563eb" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">AkEsevai Verified Online Service</text></svg>`;
    bannerImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  return { bgGradient, icon, bannerImage };
};

  function ServicesPage({ navigate, lang }) {
    const t = translations[lang] || translations.en;
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All Services');
    const [selectedService, setSelectedService] = useState(null);
    const [expandedTitle, setExpandedTitle] = useState(null);

    const categories = ['All Services', ...new Set(serviceCatalog.map((service) => service[2]))];
    const filteredServices = serviceCatalog.filter((service) => {
      const matchesQuery = service.join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All Services' || service[2] === category;
      return matchesQuery && matchesCategory;
    });

    return (
      <PageIntro
        kicker={t.servicesKicker}
        title={t.servicesTitle}
        text={t.servicesText}
        action={<button className="button button-primary" onClick={() => navigate('customer')}>{t.startApp} <ArrowRight size={18} /></button>}
      >
        {/* 1. TOP ANNOUNCEMENT BANNER (RUNNING MARQUEE) */}
        <div className="top-announcement-banner">
          <marquee scrollamount="4">
            {t.topAnnouncementText}
          </marquee>
        </div>

        {/* 3. LOGO SHOWCASE BANNER */}
        <div className="brand-logo-showcase-bar">
          <img src="/logo.png" alt="AkEsevai Logo" className="showcase-logo-img" />
          <span className="showcase-logo-text">{t.brandShowcaseText}</span>
        </div>

        <div className="service-search">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
          <span>{filteredServices.length} {t.resultsCount}</span>
        </div>

        <div className="category-tabs">
          {categories.map((item) => (
            <button className={category === item ? 'category-active' : ''} key={item} onClick={() => setCategory(item)}>
              {item === 'All Services' ? t.allCategories : item}
            </button>
          ))}
        </div>

        <div className="catalog-grid">
          {filteredServices.map(([tamil, title, group]) => {
            const visual = getServiceVisual(group, title);
            const isExpanded = expandedTitle === title;
            const docs = getRequiredDocuments(title, group);

            return (
              <article
                className={`catalog-card ${isExpanded ? 'catalog-card-expanded' : ''}`}
                key={title}
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div
                  className="service-card-image-header"
                  style={{
                    position: 'relative',
                    height: '120px',
                    background: visual.bgGradient,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '12px',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75)), url(${visual.bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#0f172a',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 800,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{visual.icon}</span> {group}
                  </span>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <h3 style={{ font: '800 15px Manrope', margin: 0, color: 'var(--ink)', lineHeight: 1.3 }}>
                    {lang === 'ta' ? tamil : title}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0, fontWeight: 500 }}>
                    {lang === 'ta' ? title : tamil}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', alignItems: 'center' }}>
                    <button
                      className="card-link"
                      style={{
                        background: isExpanded ? '#f1f5f9' : '#e0f2fe',
                        color: isExpanded ? '#334155' : '#0052cc',
                        padding: '7px 12px',
                        borderRadius: '7px',
                        fontWeight: 800,
                        fontSize: '11px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onClick={() => setExpandedTitle(isExpanded ? null : title)}
                    >
                      {isExpanded ? '✕ Hide (மறை)' : `📄 ${t.viewDetails}`}
                    </button>

                    <button
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        padding: '7px 14px',
                        borderRadius: '7px',
                        fontWeight: 800,
                        fontSize: '11px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginLeft: 'auto'
                      }}
                      onClick={() => navigate('customer')}
                    >
                      Apply <ArrowRight size={13} />
                    </button>
                  </div>

                  {isExpanded && (
                    <div
                      className="inline-service-detail"
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px dashed #cbd5e1',
                        animation: 'fadeIn 0.2s ease'
                      }}
                    >
                      <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📋 தேவைப்படும் ஆவணங்கள் (Required Documents):
                      </h4>
                      <div style={{ display: 'grid', gap: '6px', marginBottom: '12px' }}>
                        {docs.map((doc) => (
                          <span key={doc} style={{ fontSize: '11px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <Check size={14} style={{ color: '#16a34a', flexShrink: 0 }} /> {doc}
                          </span>
                        ))}
                      </div>
                      <button
                        className="button button-primary"
                        style={{ width: '100%', fontSize: '11px', padding: '8px', justifyContent: 'center' }}
                        onClick={() => navigate('customer')}
                      >
                        Start this application <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {filteredServices.length === 0 && <div className="empty-search">{t.noServiceFound}</div>}
        <div className="service-callout">
          <div className="service-callout-icon"><Phone /></div>
          <div>
            <h3>{t.cantFindTitle}</h3>
            <p>{t.cantFindDesc}</p>
          </div>
          <button className="text-button" onClick={() => navigate('contact')}>{t.askTeam} <ArrowRight size={16} /></button>
        </div>
      </PageIntro>
    );
  }

  function ServiceDetail({ service, onClose, onApply }) {
    const docs = getRequiredDocuments(service.title, service.group);
    return (
      <div className="service-modal-backdrop" onClick={onClose}>
        <div className="service-modal" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <span className="catalog-group">{service.group}</span>
          <h2>{service.tamil}</h2>
          <p className="modal-english">{service.title}</p>
          <h3 className="docs-heading">Documents required for this service</h3>
          <div className="document-checklist">
            {docs.map((doc) => <span key={doc}><Check size={15} /> {doc}</span>)}
          </div>
          <small className="docs-note">AkEsevai will verify the submitted documents before application submission.</small>
          <button className="button button-primary" onClick={onApply}>Start this application <ArrowRight size={16} /></button>
        </div>
      </div>
    );
  }



  function FormsPage({ notify, lang = 'ta' }) { const [fileName, setFileName] = useState(''); const [query, setQuery] = useState(''); const [category, setCategory] = useState('All Forms'); const categories = ['All Forms', ...new Set(formsCatalog.map((form) => form[1]))]; const filteredForms = formsCatalog.filter((form) => (category === 'All Forms' || form[1] === category) && form.join(' ').toLowerCase().includes(query.toLowerCase())); return <PageIntro kicker="FORMS & DOWNLOADS" title="Official forms, ready to download." text="Search for a form and download the available official PDF from the TD Common e-Sevai forms collection."><div className="form-count"><FormInput size={18} /> <strong>📋 All Forms</strong><span>{filteredForms.length} forms available</span></div><div className="service-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="🔍 Form-ஐ தேடவும்... Search forms" /><span>{filteredForms.length} results</span></div><div className="category-tabs">{categories.map((item) => <button className={category === item ? 'category-active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="forms-directory">{filteredForms.map(([title, type]) => <FormRow title={title} type={type} notify={notify} key={title} />)}</div><label className="form-dropzone full-dropzone"><UploadCloud size={30} /><strong>{fileName || 'Upload a completed form'}</strong><small>PDF, JPG or PNG up to 10 MB</small><input type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name || '')} />{fileName && <span className="upload-ready"><Check size={14} /> Ready for review</span>}</label></PageIntro>; }
  function FormRow({ title, type, notify }) { const sourceLink = tdcscFormLinks[title]; const downloadForm = () => { if (sourceLink) { window.open(toDownloadLink(sourceLink), '_blank', 'noopener,noreferrer'); notify(`${title} download opened.`); return; } notify(`${title} is not yet linked to an official PDF.`); }; return <div className="form-row"><span className="form-icon"><FormInput size={19} /></span><span><strong>{title}</strong><small>{type} · {sourceLink ? 'Official PDF download' : 'PDF link coming soon'}</small></span><button className="icon-button" aria-label={`Download ${title}`} onClick={downloadForm} disabled={!sourceLink}><Download size={17} /></button></div>; }

  function NotificationsPage({ lang, navigate }) {
    const t = translations[lang] || translations.en;
    return (
      <PageIntro
        kicker={t.notifKicker}
        title={t.notifTitle}
        text={t.notifText}
      >
        {/* Photo Tools Helper Banner for Exam Applicants */}
        <div style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)', borderRadius: '12px', padding: '16px 20px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>
              📸 {lang === 'ta' ? 'அரசுத் தேர்வுகளுக்கு விண்ணப்பிக்கிறீர்களா?' : 'Applying for Government Exams?'}
            </strong>
            <span style={{ fontSize: '12px', opacity: 0.9 }}>
              {lang === 'ta' ? 'போட்டோ மற்றும் கையொப்பத்தை 20 KB / 50 KB அளவுக்கு துல்லியமாக சுருக்க இலவச ஆன்லைன் கருவிகளைப் பயன்படுத்துங்கள்.' : 'Resize and compress your photo & signature to exact 20 KB / 50 KB online.'}
            </span>
          </div>
          {navigate && (
            <button
              onClick={() => navigate('photo-tools')}
              style={{ background: '#22c55e', color: '#064e3b', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {lang === 'ta' ? 'போட்டோ கருவிகள் ➔' : 'Open Photo Tools ➔'}
            </button>
          )}
        </div>

        <NotificationTables forceAdmin={false} lang={lang} />
        <div className="notice-list" style={{ marginTop: '35px' }}>
          <div>
            <Megaphone size={18} />
            <span>
              <strong>{lang === 'ta' ? 'புதிய அறிவிப்புகள் தொடர்ந்து புதுப்பிக்கப்படும்' : 'New updates are added regularly'}</strong>
              <small>{lang === 'ta' ? 'சந்தேகங்கள் மற்றும் உதவிக்கு எங்களை அழைக்கலாம்: 93423 18844.' : 'For doubts and support, call us: 93423 18844.'}</small>
            </span>
          </div>
          <div>
            <Clock3 size={18} />
            <span>
              <strong>{lang === 'ta' ? 'கடைசி தேதியை எப்போதும் சரிபார்க்கவும்' : 'Always verify the last date'}</strong>
              <small>{lang === 'ta' ? 'தேதிகள் மாற்றப்படலாம். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ தளத்தை சரிபார்க்கவும்.' : 'Dates may change. Please verify with official portal before applying.'}</small>
            </span>
          </div>
        </div>
      </PageIntro>
    );
  }

  // SoftwarePage loaded from ./pages/SoftwarePage.jsx

  function WhatsappPosterPage({ notify }) { const [message, setMessage] = useState('AkEsevai - Digital services made simple'); return <PageIntro kicker="WHATSAPP POSTER" title="Create a shareable service poster." text="Add your message, preview a clean poster and share it with your customers or family groups."><div className="poster-maker"><div className="poster-controls"><label>Poster message<textarea rows="4" value={message} onChange={(event) => setMessage(event.target.value)} /></label><button className="button button-primary" onClick={() => notify('Poster preview is ready to share on WhatsApp.')}><Download size={17} /> Download poster</button></div><div className="poster-preview"><div className="poster-logo"><Sparkles size={17} /> AkEsevai</div><div className="poster-lines"><span>YOUR LOCAL</span><strong>{message}</strong><small>Mill Road, Sanmugapuram, Palani - 624601</small><b>93423 18844</b></div><div className="poster-stamp">OPEN<br /><strong>10 AM - 8 PM</strong></div></div></div></PageIntro>; }

  function AboutPage({ navigate, lang }) {
    return <PageIntro kicker={lang === 'ta' ? 'AKESEVAI பற்றி' : 'ABOUT AKESEVAI'} title={lang === 'ta' ? 'உள்ளூர் அனுபவம். டிஜிட்டல் நிச்சயம்.' : 'Local knowledge. Digital confidence.'} text={lang === 'ta' ? 'பழனி மற்றும் சுற்றியுள்ள குடும்பங்களுக்கு படிவங்கள், இணையதளங்களின் சிரமமின்றி அத்தியாவசிய ஆன்லைன் சேவைகளை பெற உதவுகிறோம்.' : 'We help families in and around Palani navigate essential online services without the stress of forms, portals and follow-ups.'}><div className="about-grid"><div className="about-photo"><div className="photo-overlay"><span>{lang === 'ta' ? 'பழனி மக்களுக்குச் சேவை' : 'Serving Palani'}</span><strong>{lang === 'ta' ? 'முதல் நாளிலிருந்தே கனிவுடன்.' : 'With care since day one.'}</strong></div></div><div className="about-copy"><span className="section-kicker">{lang === 'ta' ? 'எங்கள் உறுதிமொழி' : 'OUR PROMISE'}</span><h2>{lang === 'ta' ? 'ஒவ்வொரு விண்ணப்பத்திற்கும் மனித வழிகாட்டுதல் அவசியம்.' : 'Every application deserves a human guide.'}</h2><p>{lang === 'ta' ? 'அரசு தளங்கள் கடினமாக இருக்கலாம். சிறு தவறுகள் தாமதத்தை உருவாக்கலாம். AkEsevai உங்களை சரியான பாதையில் அழைத்துச் செல்லும்.' : 'Government websites can be hard to navigate and small mistakes can create long delays. AkEsevai combines local understanding with a simple digital process so you always know what is happening next.'}</p><div className="promise-list"><span><Check /> {lang === 'ta' ? 'தொ தொடங்கும் முன் தெளிவான கட்டணம்' : 'Clear pricing before we begin'}</span><span><Check /> {lang === 'ta' ? 'எளிதில் புரியும் உடனுக்குடன் தகவல்கள்' : 'Updates you can understand'}</span><span><Check /> {lang === 'ta' ? 'பாதுகாப்பான ஆவண பராமரிப்பு' : 'Your documents handled with care'}</span></div><button className="button button-primary" onClick={() => navigate('contact')}>{lang === 'ta' ? 'பழனியில் எங்களைச் சந்திக்க' : 'Meet us in Palani'} <MapPin size={17} /></button></div></div></PageIntro>;
  }

  function ContactPage({ notify, lang }) {
    const t = translations[lang] || translations.en;
    return (
      <PageIntro kicker={t.contactKicker} title={t.contactTitle} text={t.contactText}>
        <div className="contact-grid">
          <div className="contact-panel">
            <div className="contact-item"><span><MapPin /></span><div><small>{t.visitUs}</small><strong>Mill Road, Sanmugapuram</strong><p>Palani - 624601, Tamil Nadu</p></div></div>
            <div className="contact-item"><span><Phone /></span><div><small>{t.callUs}</small><a href="tel:9342318844"><strong>93423 18844</strong></a><p>{lang === 'ta' ? siteConfig.hoursTamil : siteConfig.hours}</p></div></div>
            <div className="contact-item"><span><Mail /></span><div><small>EMAIL US</small><a href="mailto:akesevaipalani@gmail.com"><strong>akesevaipalani@gmail.com</strong></a><p>We reply within 24 hours</p></div></div>
            <div className="contact-item"><span><MessageCircle /></span><div><small>{t.whatsappUs}</small><a href="https://wa.me/919342318844"><strong>Chat with AkEsevai</strong></a><p>Quick questions and document checklist</p></div></div>
            <div className="contact-item"><span><YoutubeIcon size={20} color="#FF0000" /></span><div><small>YOUTUBE CHANNEL</small><a href={siteConfig.youtube} target="_blank" rel="noreferrer"><strong>@AkEsevai</strong></a><p>Subscribe for video guides & updates</p></div></div>
            <div className="contact-item"><span><InstagramIcon size={20} color="#E1306C" /></span><div><small>INSTAGRAM PAGE</small><a href={siteConfig.instagram} target="_blank" rel="noreferrer"><strong>@akesevai</strong></a><p>Follow us for daily posts & news</p></div></div>
            <div className="contact-item"><span><FacebookIcon size={20} color="#1877F2" /></span><div><small>FACEBOOK PAGE</small><a href={siteConfig.facebook} target="_blank" rel="noreferrer"><strong>AkEsevai Facebook</strong></a><p>Connect on our Facebook page</p></div></div>
          </div>
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); notify(lang === 'ta' ? 'செய்தி பெறப்பட்டது. AkEsevai விரைவில் உங்களை அழைக்கும்.' : 'Message received. AkEsevai will call you shortly.'); event.currentTarget.reset(); }}>
            <label>{t.yourName}<input required placeholder="Enter your name" /></label>
            <label>{t.phoneNumber}<input required type="tel" placeholder="10-digit mobile number" /></label>
            <label>{t.howCanWeHelp}<textarea required placeholder="Tell us a little about your service need" rows="4" /></label>
            <button className="button button-primary" type="submit">{t.sendMessage} <Send size={16} /></button>
          </form>
        </div>

        {/* SOCIAL MEDIA FOLLOW WIDGET */}
        <SocialMediaFollowWidget />

        {/* GOOGLE MAPS EMBED */}
        <GoogleMapEmbed />
      </PageIntro>
    );
  }
  function PageIntro({ kicker, title, text, action, children }) { return <section className="page-width inner-page"><div className="inner-hero"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{text}</p>{action}</div>{children}</section>; }

  function PrivatePageGate({ navigate }) {
    return <section className="private-gate page-width"><div><span className="section-kicker">PRIVATE ADMIN AREA</span><h1>This page is not public.</h1><p>Only an AkEsevai administrator can open Weblinks, Forms, Software, and Photo Maker tools.</p><button className="button button-primary" onClick={() => navigate('admin')}><LockKeyhole size={17} /> Admin sign in</button></div></section>;
  }

  function AdminLiveQueueControlForm() {
    const [isCenterOpen, setIsCenterOpen] = useState('open'); // 'open' or 'closed'
    const [queueCount, setQueueCount] = useState('3 நபர்கள்');
    const [waitTime, setWaitTime] = useState('5-10 நிமிடங்கள்');
    const [statusText, setStatusText] = useState('🟢 மையம் திறந்துள்ளது (Open Now)');
    const [closedNoticeText, setClosedNoticeText] = useState('மையம் தற்போது மூடப்பட்டுள்ளது');
    const [openTimeText, setOpenTimeText] = useState('Mon–Sat 10:00 AM');
    const [serviceOfDay, setServiceOfDay] = useState('auto');
    const [upiId, setUpiId] = useState('alakesh.kumar7@okhdfcbank');
    const [msg, setMsg] = useState('');

    useEffect(() => {
      const unsubQueue = subscribeLiveQueue((parsed) => {
        if (parsed && Object.keys(parsed).length > 0) {
          if (parsed.status) setIsCenterOpen(parsed.status);
          if (parsed.queueCount !== undefined) setQueueCount(parsed.queueCount);
          if (parsed.waitTime !== undefined) setWaitTime(parsed.waitTime);
          if (parsed.statusText) setStatusText(parsed.statusText);
          if (parsed.closedNotice) setClosedNoticeText(parsed.closedNotice);
          if (parsed.openTime) setOpenTimeText(parsed.openTime);
          if (parsed.upiId) setUpiId(parsed.upiId);
        }
      });

      const unsubSod = subscribeServiceOfDay((parsedSod) => {
        if (parsedSod && parsedSod.tamil) {
          setServiceOfDay(parsedSod.tamil);
        }
      });

      return () => {
        unsubQueue();
        unsubSod();
      };
    }, []);

    const handleSave = (e) => {
      e.preventDefault();
      const data = {
        status: isCenterOpen,
        queueCount,
        waitTime,
        statusText,
        closedNotice: closedNoticeText,
        openTime: openTimeText,
        upiId
      };
      saveLiveQueueCloud(data);

      // Handle Service of the Day override
      const sodCatalog = [
        { tamil: 'வருமானச் சான்றிதழ்', english: 'Income Certificate', emoji: '📋', color: '#3b82f6', bg: '#eff6ff', desc: 'கல்வி உதவித்தொகை மற்றும் அரசு திட்டங்களுக்கு அவசியமானது.', fee: '₹60', days: '3-7 நாட்கள்' },
        { tamil: 'சாதிச் சான்றிதழ்', english: 'Community Certificate', emoji: '🏛️', color: '#16a34a', bg: '#f0fdf4', desc: 'கல்லூரி சேர்க்கை மற்றும் அரசு வேலைவாய்ப்புகளுக்குத் தேவை.', fee: '₹60', days: '3-5 நாட்கள்' },
        { tamil: 'ஆதார் மொபைல் மாற்றம்', english: 'Aadhaar Mobile Update', emoji: '📱', color: '#7c3aed', bg: '#faf5ff', desc: 'ஆதார் அட்டையில் மொபைல் எண்ணை விரைவாக இணைக்கலாம்.', fee: '₹50', days: '2-5 நாட்கள்' },
        { tamil: 'புதிய வாக்காளர் அட்டை', english: 'New Voter Card', emoji: '🗳️', color: '#dc2626', bg: '#fef2f2', desc: 'புதிய வாக்காளர் பதிவு மற்றும் திருத்தங்களுக்கு உதவுகிறோம்.', fee: '₹0 (Free)', days: '7-14 நாட்கள்' },
        { tamil: 'TNPSC விண்ணப்பம்', english: 'TNPSC Application', emoji: '📝', color: '#d97706', bg: '#fffbeb', desc: 'TNPSC தேர்வு விண்ணப்பம் தவறின்றி பூர்த்தி செய்ய உதவுகிறோம்.', fee: '₹100+', days: '1-2 நாட்கள்' },
        { tamil: 'e-SHRAM CARD', english: 'e-Shram Card', emoji: '🪪', color: '#0052cc', bg: '#eff6ff', desc: 'அசங்கடித் தொழிலாளர்களுக்கான அரசு அடையாள அட்டை.', fee: '₹50', days: '1 நாள்' },
        { tamil: 'புதிய குடும்ப அட்டை', english: 'New Smart Card', emoji: '👨‍👩‍👧‍👦', color: '#15803d', bg: '#f0fdf4', desc: 'புதிய ரேஷன் அட்டை மற்றும் திருத்தங்களுக்கு விண்ணப்பிக்கலாம்.', fee: '₹100', days: '5-10 நாட்கள்' },
      ];

      if (serviceOfDay === 'auto') {
        saveServiceOfDayCloud(null);
      } else {
        const selectedSodObj = sodCatalog.find(s => s.tamil === serviceOfDay);
        if (selectedSodObj) {
          saveServiceOfDayCloud(selectedSodObj);
        }
      }

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('akesevai_queue_updated'));
      setMsg('✅ நேரலை மையம், வரிசை எண்ணிக்கை & காத்திருப்பு விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!');
      setTimeout(() => setMsg(''), 4000);
    };

    return (
      <div style={{ background: '#f8fafc', border: '2px solid #93c5fd', borderRadius: '16px', padding: '28px', textAlign: 'left', maxWidth: '680px', margin: '0 auto' }}>
        <div className="panel-heading" style={{ marginBottom: '18px' }}>
          <div>
            <span className="section-kicker">LIVE CENTER QUEUE CONTROL</span>
            <h2 style={{ margin: '4px 0 0', color: '#022c7a' }}>⚙️ நேரலை மையம் & UPI நிர்வாகம்</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              நேரலை மையத்தின் நிலை, காத்திருக்கும் நபர்களின் எண்ணிக்கை மற்றும் ஆகும் நேரம் ஆகியவற்றைப் புதுப்பிக்கலாம்.
            </p>
          </div>
        </div>

        {msg && (
          <div style={{ background: '#dcfce7', border: '1.5px solid #86efac', color: '#15803d', padding: '10px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', marginBottom: '18px' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '18px' }}>
          {/* 1. CENTER OPEN / CLOSED TOGGLE */}
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            1. மையம் திறப்பு / மூடல் நிலை (Center Status):
            <select
              value={isCenterOpen}
              onChange={(e) => {
                setIsCenterOpen(e.target.value);
                if (e.target.value === 'closed') {
                  setStatusText('🔴 மையம் இன்று விடுமுறை (Closed Today)');
                } else {
                  setStatusText('🟢 மையம் திறந்துள்ளது (Open Now)');
                }
              }}
              style={{ width: '100%', border: '2px solid #022c7a', borderRadius: '8px', padding: '11px', marginTop: '4px', fontSize: '14px', fontWeight: 800, background: isCenterOpen === 'open' ? '#f0fdf4' : '#fef2f2', color: isCenterOpen === 'open' ? '#15803d' : '#dc2626', outline: 'none', cursor: 'pointer' }}
            >
              <option value="open">🟢 மையம் திறந்துள்ளது (Center OPEN)</option>
              <option value="closed">🔒 மையம் மூடப்பட்டுள்ளது (Center CLOSED)</option>
            </select>
          </label>

          {isCenterOpen === 'closed' && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '16px', display: 'grid', gap: '12px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#991b1b' }}>
                🔒 மூடல் தகவல் செய்தி (Notice Text):
                <input
                  type="text"
                  value={closedNoticeText}
                  onChange={(e) => setClosedNoticeText(e.target.value)}
                  placeholder="எ.கா: மையம் தற்போது மூடப்பட்டுள்ளது / ஞாயிறு விடுமுறை"
                  style={{ width: '100%', border: '1px solid #fca5a5', borderRadius: '6px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </label>

              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#991b1b' }}>
                ⏰ அடுத்த திறக்கும் நேரம் (Next Opening Time Info):
                <input
                  type="text"
                  value={openTimeText}
                  onChange={(e) => setOpenTimeText(e.target.value)}
                  placeholder="எ.கா: Mon–Sat 10:00 AM / நாளை காலை 10:00 மணி"
                  style={{ width: '100%', border: '1px solid #fca5a5', borderRadius: '6px', padding: '9px', marginTop: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </label>
            </div>
          )}

          {/* 2. QUEUE COUNT (இன்னும் எத்தனை பேர் இருக்கிறார்கள் / Number of People Waiting) */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', padding: '16px', display: 'grid', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              👥 2. இன்னும் எத்தனை பேர் இருக்கிறார்கள்? (வரிசை நபர்கள் எண்ணிக்கை / Queue Count):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select
                value={queueCount}
                onChange={(e) => setQueueCount(e.target.value)}
                style={{ border: '1.5px solid #86efac', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 800, color: '#14532d', background: 'white' }}
              >
                <option value="0 நபர்கள்">0 நபர்கள் (வரிசையில் யாருமில்லை)</option>
                <option value="1 நபர்">1 நபர் (1 Person Waiting)</option>
                <option value="2 நபர்கள்">2 நபர்கள் (2 People Waiting)</option>
                <option value="3 நபர்கள்">3 நபர்கள் (3 People Waiting)</option>
                <option value="5 நபர்கள்">5 நபர்கள் (5 People Waiting)</option>
                <option value="7 நபர்கள்">7 நபர்கள் (7 People Waiting)</option>
                <option value="10 நபர்கள்">10 நபர்கள் (10 People Waiting)</option>
                <option value="15+ நபர்கள்">15+ நபர்கள் (அதிக நெரிசல்)</option>
              </select>
              <input
                type="text"
                value={queueCount}
                onChange={(e) => setQueueCount(e.target.value)}
                placeholder="எ.கா: 3 நபர்கள்"
                style={{ border: '1.5px solid #86efac', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, color: '#0f172a', background: 'white' }}
              />
            </div>
            <small style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
              💡 வாடிக்கையாளர்களின் நேரலை பேனரில் "காத்திருக்கும் பேர்" எண்ணிக்கையாக இது தோன்றும்.
            </small>
          </div>

          {/* 3. ESTIMATED WAIT TIME (எவ்வளவு நேரம் ஆகும் / Wait Time in Minutes) */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '16px', display: 'grid', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ 3. சேவையைப் பெற எவ்வளவு நேரம் ஆகும்? (காத்திருக்கும் நேரம் / Estimated Wait Time):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                style={{ border: '1.5px solid #fcd34d', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 800, color: '#78350f', background: 'white' }}
              >
                <option value="5 நிமிடங்கள்">~ 5 நிமிடங்கள் (5 Mins Wait)</option>
                <option value="10 நிமிடங்கள்">~ 10 நிமிடங்கள் (10 Mins Wait)</option>
                <option value="15 நிமிடங்கள்">~ 15 நிமிடங்கள் (15 Mins Wait)</option>
                <option value="20 நிமிடங்கள்">~ 20 நிமிடங்கள் (20 Mins Wait)</option>
                <option value="30 நிமிடங்கள்">~ 30 நிமிடங்கள் (30 Mins Wait)</option>
                <option value="காத்திருப்பு இல்லை">காத்திருப்பு இல்லை (No Wait Time)</option>
              </select>
              <input
                type="text"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                placeholder="எ.கா: ~ 10 நிமிடங்கள்"
                style={{ border: '1.5px solid #fcd34d', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, color: '#0f172a', background: 'white' }}
              />
            </div>
            <small style={{ fontSize: '11px', color: '#b45309', fontWeight: 700 }}>
              💡 வாடிக்கையாளர்களுக்கு தோராயமாக காத்திருக்க வேண்டிய நேரம் நிமிடங்களில் காட்டும்.
            </small>
          </div>

          {/* 4. SERVICE OF THE DAY (இன்றைய சிறப்பு சேவை) */}
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            ⭐ 4. இன்றைய சிறப்பு சேவை (Service of the Day):
            <select
              value={serviceOfDay}
              onChange={(e) => setServiceOfDay(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '13px', fontWeight: 700, background: 'white' }}
            >
              <option value="auto">🔄 தானியங்கு முறை (Auto Rotating Daily)</option>
              <option value="வருமானச் சான்றிதழ்">📋 வருமானச் சான்றிதழ் (Income Certificate)</option>
              <option value="சாதிச் சான்றிதழ்">🏛️ சாதிச் சான்றிதழ் (Community Certificate)</option>
              <option value="ஆதார் மொபைல் மாற்றம்">📱 ஆதார் மொபைல் மாற்றம் (Aadhaar Mobile Update)</option>
              <option value="புதிய வாக்காளர் அட்டை">🗳️ புதிய வாக்காளர் அட்டை (New Voter Card)</option>
              <option value="TNPSC விண்ணப்பம்">📝 TNPSC விண்ணப்பம் (TNPSC Application)</option>
              <option value="e-SHRAM CARD">🪪 e-SHRAM CARD</option>
              <option value="புதிய குடும்ப அட்டை">👨‍👩‍👧‍👦 புதிய குடும்ப அட்டை (New Smart Card)</option>
            </select>
          </label>

          {/* 5. UPI PAYMENT ID */}
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            💳 5. கட்டணம் செலுத்தும் UPI ID (GPay / PhonePe / Paytm):
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. alakesh.kumar7@okhdfcbank"
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '13px', fontWeight: 700 }}
            />
          </label>

          <button
            type="submit"
            className="button button-primary"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', justifySelf: 'start', padding: '12px 28px', marginTop: '6px' }}
          >
            <Check size={18} /> நேரலை விவரங்களைச் சேமி / Update Live Status
          </button>
        </form>
      </div>
    );
  }

  function AdminDocumentUploadCard({ customerPhone, customerName, notify, setCustomerRecords }) {
    const [docCategory, setDocCategory] = useState('Aadhaar Card');
    const [customRequirement, setCustomRequirement] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleAdminUpload = async (e) => {
      e.preventDefault();
      if (!selectedFile) {
        notify('❌ Please select a PDF or Image file to upload.');
        return;
      }
      const cleanPhone = String(customerPhone).replace(/\D/g, '');
      if (!cleanPhone) {
        notify('❌ Invalid customer phone number.');
        return;
      }

      const fileName = selectedFile.name || '';
      const fileExt = fileName.split('.').pop().toLowerCase();
      const validExts = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
      const isAllowedType = validExts.includes(fileExt) || selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf';

      if (!isAllowedType) {
        notify('❌ தவறான கோப்பு வகை (Invalid file format)! PDF அல்லது JPG/PNG கோப்பை மட்டும் பதிவேற்றவும்.');
        return;
      }

      const rawKb = Math.round(selectedFile.size / 1024);
      const isImage = selectedFile.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt);

      if (!isImage && rawKb > 100) {
        notify(`⚠️ கோப்பின் அளவு அதிகம் (${rawKb} KB)! ஆவணம் கண்டிப்பாக 100 KB-க்குள் இருக்க வேண்டும். (PDF must be <= 100 KB)`);
        return;
      }

      const requirementName = docCategory === 'Other' ? (customRequirement.trim() || 'Uploaded Document') : docCategory;
      
      setUploading(true);
      notify(`⏳ Processing & Uploading ${selectedFile.name}...`);

      try {
        const docRecord = await uploadFileToFirebaseStorage(selectedFile, 'customer_documents', cleanPhone);
        if (docRecord && docRecord.url) {
          const docId = `AK-${cleanPhone}-${requirementName.replace(/[^a-zA-Z0-9]/g, '_')}`;
          const newDocument = {
            id: docId,
            applicationId: `ADMIN-${Date.now()}`,
            requirement: requirementName,
            name: selectedFile.name,
            type: selectedFile.type || 'File',
            uploadedAt: new Date().toLocaleDateString('en-IN'),
            data: docRecord.url,
            url: docRecord.url,
            customerPhone: cleanPhone,
            storagePath: docRecord.storagePath || ''
          };

          // Save to 'documents' collection in Firestore
          await saveExpiryDocumentCloud(newDocument);

          // Update customer profile in 'customers' collection in Firestore
          let currentCust = readCustomerRecords()[cleanPhone] || { phone: cleanPhone, profile: { name: customerName } };
          const existingDocs = Array.isArray(currentCust.documents) ? currentCust.documents : [];
          const filteredDocs = existingDocs.filter(d => d.requirement !== requirementName && d.id !== docId);
          const updatedCust = {
            ...currentCust,
            phone: cleanPhone,
            documents: [...filteredDocs, newDocument],
            updatedAt: new Date().toISOString()
          };
          await saveCustomerProfileCloud(cleanPhone, updatedCust);

          // Update React state
          if (setCustomerRecords) {
            setCustomerRecords(prev => ({
              ...prev,
              [cleanPhone]: updatedCust
            }));
          }

          setSelectedFile(null);
          setCustomRequirement('');
          notify(`🎉 Document "${requirementName}" uploaded and saved successfully!`);
        } else {
          notify('❌ Upload failed. Please try again.');
        }
      } catch (err) {
        notify(`❌ Upload error: ${err.message || String(err)}`);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div style={{ background: '#f0f9ff', border: '2px dashed #0284c7', borderRadius: '12px', padding: '16px', margin: '16px 0 20px' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '14px', font: '800 14px Manrope', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UploadCloud size={18} /> 📤 Admin Document Upload for +91 {customerPhone} ({customerName})
        </h4>
        <form onSubmit={handleAdminUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: '4px' }}>
              Document Category / Name:
            </label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #7dd3fc', fontSize: '12px', fontWeight: 700 }}
            >
              <option value="Aadhaar Card">Aadhaar Card (ஆதார் கார்டு)</option>
              <option value="Smart Card / Ration Card">Smart Card / Ration Card (ரேஷன் கார்டு)</option>
              <option value="Income Proof / Payslip">Income Proof (வருமானச் சான்று)</option>
              <option value="Community Certificate">Community Certificate (சாதிச் சான்றிதழ்)</option>
              <option value="Nativity / Residence Cert">Nativity / Residence Certificate</option>
              <option value="Educational Marksheet / TC">Educational Marksheet / TC</option>
              <option value="Passport Size Photo">Passport Size Photo</option>
              <option value="Other">Other / Custom Document Name...</option>
            </select>
          </div>

          {docCategory === 'Other' ? (
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: '4px' }}>
                Custom Document Name:
              </label>
              <input
                type="text"
                required
                value={customRequirement}
                onChange={(e) => setCustomRequirement(e.target.value)}
                placeholder="e.g. Bank Passbook"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #7dd3fc', fontSize: '12px', fontWeight: 700 }}
              />
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: '4px' }}>
                Select File (PDF or JPG Image, Photo max 1MB):
              </label>
              <input
                type="file"
                accept=".pdf,image/jpeg,.jpg,.jpeg"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && (docCategory === 'Passport Size Photo' || file.type.startsWith('image/'))) {
                    const val = validatePhotoUpload(file, 1);
                    if (!val.valid) {
                      notify(val.error);
                      e.target.value = '';
                      setSelectedFile(null);
                      return;
                    }
                  }
                  setSelectedFile(file);
                }}
                style={{ width: '100%', padding: '6px', fontSize: '11px' }}
              />
            </div>
          )}

          {docCategory === 'Other' && (
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: '4px' }}>
                Select File (PDF or JPG Image, Photo max 1MB):
              </label>
              <input
                type="file"
                accept=".pdf,image/jpeg,.jpg,.jpeg"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.type.startsWith('image/')) {
                    const val = validatePhotoUpload(file, 1);
                    if (!val.valid) {
                      notify(val.error);
                      e.target.value = '';
                      setSelectedFile(null);
                      return;
                    }
                  }
                  setSelectedFile(file);
                }}
                style={{ width: '100%', padding: '6px', fontSize: '11px' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            style={{
              background: '#0284c7',
              color: 'white',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: uploading ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px'
            }}
          >
            {uploading ? '⏳ Uploading...' : '☁️ Upload Document'}
          </button>
        </form>
      </div>
    );
  }

  function AdminPage({ loggedIn, login, logout, navigate, tokenBookings = [], setTokenBookings, customerRecords = {}, setCustomerRecords, applicationRecords = {}, setApplicationRecords, cloudExpiryDocs = [], notify, activeTab: propAdminTab, setActiveTab: setPropAdminTab, lang = 'ta' }) {
    const [password, setPassword] = useState('');
    const [query, setQuery] = useState('');
    const [tokenSearch, setTokenSearch] = useState('');
    const [tokenFilterStatus, setTokenFilterStatus] = useState('all');
    const [appSearch, setAppSearch] = useState('');
    const [activeCustomer, setActiveCustomer] = useState('');
    const [internalAdminTab, setInternalAdminTab] = useState(propAdminTab || 'smartdesk');
    const adminTab = propAdminTab || internalAdminTab;
    const setAdminTab = setPropAdminTab || setInternalAdminTab;
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editDob, setEditDob] = useState('');
    const [editAadhaar, setEditAadhaar] = useState('');
    const [activeDocPreview, setActiveDocPreview] = useState(null);

    // Visitor Logs & New Customer Registration state
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [visitorSearch, setVisitorSearch] = useState('');
    const [showAddCustForm, setShowAddCustForm] = useState(false);
    const [newCustName, setNewCustName] = useState('');
    const [newCustPhone, setNewCustPhone] = useState('');
    const [newCustDob, setNewCustDob] = useState('');
    const [newCustAadhar, setNewCustAadhar] = useState('');
    const [newCustNotes, setNewCustNotes] = useState('');

    // Sponsored Advertisements Manager state
    const [sponsoredAds, setSponsoredAds] = useState([]);
    const [adTitle, setAdTitle] = useState('');
    const [adSubtitle, setAdSubtitle] = useState('');
    const [adTargetUrl, setAdTargetUrl] = useState('');
    const [adBadge, setAdBadge] = useState('Special Announcement');
    const [adImageUrl, setAdImageUrl] = useState('');
    const [adImageAspectRatio, setAdImageAspectRatio] = useState('16/9');
    const [adIsActive, setAdIsActive] = useState(true);
    const [adUploading, setAdUploading] = useState(false);
    const dashboardTabsRef = useRef(null);

    // Smooth Drag-to-Scroll for Admin Navigation Tabs
    useEffect(() => {
      const el = dashboardTabsRef.current;
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
    }, [loggedIn]);

    useEffect(() => {
      const unsubLogs = subscribeDailyVisitorLogsCloud((logs) => {
        if (Array.isArray(logs)) setVisitorLogs(logs);
      });
      const unsubAds = subscribeSponsoredAds((ads) => {
        if (Array.isArray(ads)) setSponsoredAds(ads);
      });
      return () => {
        if (typeof unsubLogs === 'function') unsubLogs();
        if (typeof unsubAds === 'function') unsubAds();
      };
    }, []);

    if (!loggedIn) return <section className="customer-entry"><div className="login-art"><span className="eyebrow"><span className="live-dot" /> AkEsevai administration</span><h1>Manage customer<br /><em>service requests.</em></h1><p>Review every customer's selected service and their uploaded required documents in one place.</p></div><form className="login-card" onSubmit={(event) => { event.preventDefault(); if (login(password)) setPassword(''); }}><div className="login-icon"><LockKeyhole size={22} /></div><span className="section-kicker">ADMIN ACCESS</span><h2>Sign in to admin panel</h2><p>This area is only for the AkEsevai team.</p><label>Admin password<input className="admin-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" /></label><button className="button button-primary button-wide" type="submit">Open dashboard <ArrowRight size={17} /></button></form></section>;
    const localRecords = readCustomerRecords();
    const activeRecords = { ...localRecords, ...(customerRecords || {}) };
    const deletedCustSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-customers') || '[]'));
    const appCustomersMap = new Map();
    Object.values(activeRecords).forEach((c) => {
      if (c && (c.phone || c.profile?.name || c.name)) {
        const cleanP = String(c.phone || '').replace(/\D/g, '');
        if (!cleanP || deletedCustSet.has(cleanP) || deletedCustSet.has(c.phone)) return;

        const existing = appCustomersMap.get(cleanP) || {};
        const mergedName = c.name && c.name !== 'Customer' && !c.name.startsWith('Customer ') ? c.name :
                          c.profile?.name && c.profile.name !== 'Customer' && !c.profile.name.startsWith('Customer ') ? c.profile.name :
                          existing.name || existing.profile?.name || c.name || c.profile?.name || `Customer +91 ${cleanP}`;

        const mergedAadhaar = c.aadhaarNo || c.profile?.aadhaarNo || existing.aadhaarNo || existing.profile?.aadhaarNo || '';
        const mergedDob = c.dob || c.profile?.dob || existing.dob || existing.profile?.dob || '';
        const mergedToken = c.lastToken || existing.lastToken || null;
        const mergedAppsMap = new Map();
        [...(existing.applications || []), ...(c.applications || [])].forEach((a) => {
          if (!a) return;
          const k = String(a.id || a.ackNo || a.name || '').trim();
          if (k && !mergedAppsMap.has(k)) mergedAppsMap.set(k, a);
        });
        const mergedApps = Array.from(mergedAppsMap.values());

        const mergedDocsMap = new Map();
        [...(existing.documents || []), ...(c.documents || [])].forEach((d) => {
          if (!d) return;
          const k = String(d.id || d.url || d.data || d.requirement || d.name || '').trim();
          if (k && !mergedDocsMap.has(k)) mergedDocsMap.set(k, d);
        });
        const mergedDocs = Array.from(mergedDocsMap.values());

        appCustomersMap.set(cleanP, {
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

    const customers = Array.from(appCustomersMap.values())
      .sort((a, b) => ((b.profile?.createdAt || b.updatedAt || '').localeCompare(a.profile?.createdAt || a.updatedAt || '')));

    const matchingCustomers = customers.filter((customer) => {
      const name = customer.profile?.name || customer.name || 'Customer';
      const phone = customer.phone || '';
      const apps = Array.isArray(customer.applications) ? customer.applications.map((app) => app?.name || '').join(' ') : '';
      return `${name} ${phone} ${apps}`.toLowerCase().includes(query.toLowerCase());
    });

    const selected = matchingCustomers.find((customer) => customer.phone === activeCustomer) || matchingCustomers[0];
    const totalApplications = Object.keys(applicationRecords || {}).length || customers.reduce((total, customer) => total + (Array.isArray(customer.applications) ? customer.applications.length : 0), 0);

    const uniqueDocsCounterMap = new Map();
    (cloudExpiryDocs || []).forEach((d) => {
      if (!d) return;
      const k = String(d.id || d.url || d.data || d.requirement || d.name || '').trim();
      if (k) uniqueDocsCounterMap.set(k, d);
    });
    customers.forEach((c) => {
      if (c && Array.isArray(c.documents)) {
        c.documents.forEach((d) => {
          if (!d) return;
          const k = String(d.id || d.url || d.data || d.requirement || d.name || '').trim();
          if (k) uniqueDocsCounterMap.set(k, d);
        });
      }
    });
    const totalDocuments = uniqueDocsCounterMap.size;
    
    const deletedTokensSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));

    const combinedTokensList = [
      ...(tokenBookings || []),
      ...Object.values(customerRecords || {}).map(c => c.lastToken).filter(Boolean)
    ].filter(t => {
      if (!t) return false;
      const tNo = String(t.tokenNo || t.tokenId || t.id || '').trim();
      return tNo && !deletedTokensSet.has(tNo);
    }).reduce((acc, current) => {
      const tNo = String(current.tokenNo || current.tokenId || current.id || '').trim();
      if (tNo && !acc.some(item => String(item.tokenNo || item.tokenId || item.id || '').trim() === tNo)) {
        acc.push(current);
      }
      return acc;
    }, []);

    const filteredTokens = combinedTokensList.filter((tok) => {
      const q = tokenSearch.trim().toLowerCase();
      if (!q) return true;
      return (tok.tokenNo || '').toLowerCase().includes(q) || (tok.phone || '').toLowerCase().includes(q) || (tok.customerName || '').toLowerCase().includes(q) || (tok.service || '').toLowerCase().includes(q) || (tok.date || '').toLowerCase().includes(q);
    });

    const customerAppsList = [];
    Object.values(customerRecords || {}).forEach((cust) => {
      if (!cust) return;
      const custName = cust.profile?.name || cust.name || 'வாடிக்கையாளர்';
      const custPhone = cust.phone || '';
      const apps = Array.isArray(cust.applications) ? cust.applications : [];
      const docs = Array.isArray(cust.documents) ? cust.documents : [];

      apps.forEach((app) => {
        if (!app || !app.id) return;
        const storeRecord = applicationRecords && (applicationRecords[app.id] || applicationRecords[app.ackNo]);
        const stageNum = storeRecord?.currentStage || app.currentStage || app.stage || (app.status === 'Completed' ? 6 : 3);
        const isCompleted = stageNum === 6;

        customerAppsList.push({
          id: app.id,
          ackNo: app.id,
          applicantName: custName,
          phone: custPhone,
          service: app.name || 'e-Sevai Application',
          submittedDate: app.date || new Date().toLocaleDateString('en-IN'),
          currentStage: stageNum,
          statusLabel: storeRecord?.statusLabel || app.statusLabel || (isCompleted ? 'Approved & Completed (சான்றிதழ் தயாராக உள்ளது)' : (app.status || 'Submitted & In Progress')),
          statusColor: storeRecord?.statusColor || app.statusColor || (isCompleted ? '#16a34a' : '#0052cc'),
          documentsCount: docs.length,
          customerRef: cust
        });
      });
    });

    const allAppsMap = {};

    customerAppsList.forEach((app) => {
      if (app && app.id) {
        allAppsMap[app.id] = app;
      }
    });

    Object.values(applicationRecords || {}).forEach((app) => {
      if (app && (app.id || app.ackNo)) {
        const key = app.id || app.ackNo;
        allAppsMap[key] = {
          ...(allAppsMap[key] || {}),
          ...app
        };
      }
    });

    const delAppsSet = getDeletedAppsSet();
    const allAppsList = Object.values(allAppsMap).filter((app) => {
      if (!app) return false;
      const appIdKey = String(app.id || app.ackNo || '').trim();
      return appIdKey && !delAppsSet.has(appIdKey);
    });

    const filteredApps = allAppsList.filter((app) => {
      const q = appSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        (app.id || '').toLowerCase().includes(q) ||
        (app.applicantName || '').toLowerCase().includes(q) ||
        (app.phone || '').toLowerCase().includes(q) ||
        (app.service || '').toLowerCase().includes(q) ||
        (app.statusLabel || '').toLowerCase().includes(q)
      );
    });

    const handleUpdateAppStage = async (appId, newStage, appObj = {}) => {
      const targetAppId = appId || appObj.id || appObj.ackNo;
      const updated = updateApplicationStage(targetAppId, newStage, null, null, appObj);

      if (updated && setApplicationRecords) {
        setApplicationRecords((prev) => ({
          ...prev,
          [targetAppId]: updated,
          ...(appObj.id ? { [appObj.id]: updated } : {}),
          ...(appObj.ackNo ? { [appObj.ackNo]: updated } : {})
        }));
      }

      const rawPhone = appObj.phone || appObj.customerPhone || appObj.customerRef?.phone || '';
      const cleanPhone = String(rawPhone).replace(/\D/g, '');

      if (cleanPhone && setCustomerRecords) {
        setCustomerRecords((prevRecords = {}) => {
          const custKey = Object.keys(prevRecords).find(k => {
            const c = prevRecords[k];
            if (!c) return false;
            const cPhone = String(c.phone || k).replace(/\D/g, '');
            return cPhone === cleanPhone || (cleanPhone && cPhone.includes(cleanPhone));
          }) || cleanPhone;

          const existingCust = prevRecords[custKey] || {
            phone: cleanPhone,
            profile: { name: appObj.applicantName || appObj.name || 'Customer' },
            applications: [],
            documents: []
          };

          const existingApps = Array.isArray(existingCust.applications) ? existingCust.applications : [];
          let matched = false;

          const updatedApps = existingApps.map(a => {
            const aId = String(a.id || a.ackNo || '');
            const targetStr = String(targetAppId || '');
            const isMatch = aId === targetStr || (aId && targetStr && (aId.includes(targetStr) || targetStr.includes(aId))) || (a.name && appObj.service && a.name.toLowerCase() === appObj.service.toLowerCase());
            if (isMatch) {
              matched = true;
              return {
                ...a,
                stage: newStage,
                currentStage: newStage,
                progress: newStage === 6 ? 100 : Math.round((newStage / 6) * 100),
                status: newStage === 6 ? 'Completed' : 'Processing',
                statusLabel: updated?.statusLabel || (newStage === 6 ? 'Approved & Completed (சான்றிதழ் தயாராக உள்ளது)' : 'In Progress'),
                remarks: updated?.remarks || a.remarks
              };
            }
            return a;
          });

          if (!matched) {
            updatedApps.push({
              id: targetAppId,
              name: appObj.service || appObj.name || 'e-Sevai Application',
              stage: newStage,
              currentStage: newStage,
              progress: newStage === 6 ? 100 : Math.round((newStage / 6) * 100),
              status: newStage === 6 ? 'Completed' : 'Processing',
              statusLabel: updated?.statusLabel || 'In Progress',
              date: appObj.submittedDate || appObj.date || new Date().toLocaleDateString('en-IN')
            });
          }

          const updatedCust = {
            ...existingCust,
            phone: cleanPhone,
            applications: updatedApps,
            updatedAt: new Date().toISOString()
          };

          saveCustomerProfileCloud(cleanPhone, updatedCust);

          return {
            ...prevRecords,
            [cleanPhone]: updatedCust,
            [custKey]: updatedCust
          };
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('akesevai-data-changed'));
      }

      notify(`✅ Application ${targetAppId} updated to Stage ${newStage}!`);
    };

    const handleDeleteApp = async (appId) => {
      if (!appId) return;
      const strId = String(appId).trim();
      const confirmDelete = window.confirm(`Are you sure you want to PERMANENTLY delete application "${strId}"? / இந்த விண்ணப்பத்தை நிச்சயமாக நிரந்தரமாக நீக்க விரும்புகிறீர்களா?`);
      if (!confirmDelete) return;

      // 1. Blacklist & remove from local storage & memory & customer applications
      deleteApplicationRecord(strId);

      // 2. Remove from React state
      if (setApplicationRecords) {
        setApplicationRecords((prev = {}) => {
          const copy = { ...prev };
          delete copy[strId];
          return copy;
        });
      }
      if (setCustomerRecords) {
        setCustomerRecords((prevRecords = {}) => {
          const updatedRecords = { ...prevRecords };
          Object.keys(updatedRecords).forEach((key) => {
            const cust = updatedRecords[key];
            if (cust && Array.isArray(cust.applications)) {
              const filteredApps = cust.applications.filter(a => a && String(a.id || a.ackNo).trim() !== strId);
              if (filteredApps.length !== cust.applications.length) {
                const cleanPhone = String(cust.phone || key).replace(/\D/g, '');
                const updatedCust = { ...cust, phone: cleanPhone, applications: filteredApps, updatedAt: new Date().toISOString() };
                updatedRecords[key] = updatedCust;
                if (cleanPhone) {
                  updatedRecords[cleanPhone] = updatedCust;
                  saveCustomerProfileCloud(cleanPhone, updatedCust);
                }
              }
            }
          });
          return updatedRecords;
        });
      }

      // 3. Remove from Mongo Cloud
      try {
        await deleteApplicationCloud(strId);
      } catch (e) {}

      notify(`🗑️ Application ${strId} deleted permanently from everywhere!`);
    };

    const handleAddNewCustomer = async (e) => {
      e.preventDefault();
      const cleanPhone = newCustPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length !== 10) {
        notify('⚠️ தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும் (Please enter 10-digit phone number).');
        return;
      }
      if (!newCustName.trim()) {
        notify('⚠️ வாடிக்கையாளர் பெயரை உள்ளிடவும் (Please enter Customer Name).');
        return;
      }

      const existingCust = (customers || []).find(c => (c.phone || '').replace(/\D/g, '') === cleanPhone);
      const updatedCust = {
        ...(existingCust || {}),
        phone: cleanPhone,
        name: newCustName.trim(),
        dob: newCustDob || existingCust?.dob || '',
        aadhaarNo: newCustAadhar.trim() || existingCust?.aadhaarNo || '',
        aadhar: newCustAadhar.trim() || existingCust?.aadhar || '',
        notes: newCustNotes.trim() || existingCust?.notes || '',
        profile: {
          ...(existingCust?.profile || {}),
          name: newCustName.trim(),
          phone: cleanPhone,
          dob: newCustDob || existingCust?.profile?.dob || '',
          aadhaarNo: newCustAadhar.trim() || existingCust?.profile?.aadhaarNo || ''
        },
        applications: existingCust?.applications || [],
        documents: existingCust?.documents || [],
        updatedAt: new Date().toISOString()
      };

      await saveCustomerProfileCloud(cleanPhone, updatedCust);
      if (setCustomerRecords) {
        setCustomerRecords((prev) => ({
          ...prev,
          [cleanPhone]: updatedCust,
          [newCustPhone]: updatedCust
        }));
      }
      notify(`✅ வாடிக்கையாளர் ${newCustName.trim()} (+91 ${cleanPhone}) வெற்றிகரமாகச் சேர்க்கப்பட்டார்!`);

      setNewCustName('');
      setNewCustPhone('');
      setNewCustDob('');
      setNewCustAadhar('');
      setNewCustNotes('');
      setShowAddCustForm(false);
      setActiveCustomer(cleanPhone);
    };

    const handleSendMonthlyWhatsAppReminder = async (customer) => {
      if (!customer) return;
      const cleanPhone = String(customer.phone || '').replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length !== 10) {
        notify('⚠️ செல்லுபடியாகும் மொபைல் எண் இல்லை (Invalid phone number).');
        return;
      }
      const custName = customer.profile?.name || customer.name || 'வாடிக்கையாளர்';
      const reminderMsg = encodeURIComponent(
        `வணக்கம் ${custName} அவர்களுக்கு,\n\n` +
        `AkEsevai டிஜிட்டல் சேவை மையம் (பழனி) சார்பாக மாதாந்திர அன்பு வாழ்த்துகள்! 🌸\n\n` +
        `உங்கள் ஆதார், ரேஷன் கார்டு, வருமானச் சான்றிதழ், பட்டா சிட்டா, வாக்காளர் அட்டை அல்லது அரசின் புதிய திட்டங்கள்/புதுப்பிப்பு சேவைகளுக்கு எங்களை அணுகலாம்.\n\n` +
        `📍 முகவரி: Mill Road, Sanmugapuram, Palani - 624601\n` +
        `📞 தொடர்புக்கு: 93423 18844\n` +
        `🌐 AkEsevai Portal: akesevaipalani.com`
      );

      window.open(`https://wa.me/91${cleanPhone}?text=${reminderMsg}`, '_blank');

      const updatedRecord = {
        ...customer,
        phone: cleanPhone,
        lastReminderSent: new Date().toISOString()
      };
      await saveCustomerProfileCloud(cleanPhone, updatedRecord);
      if (setCustomerRecords) {
        setCustomerRecords((prev) => ({
          ...prev,
          [cleanPhone]: updatedRecord
        }));
      }
      notify(`💬 ${custName} அவர்களுக்கு WhatsApp மாதாந்திர நினைவுறுத்தல் அனுப்பப்பட்டது!`);
    };

    const handleSaveEditCustomer = async () => {
      if (!editingCustomer) return;
      const cleanOldPhone = editingCustomer.phone.replace(/\D/g, '');
      const cleanNewPhone = editPhone.replace(/\D/g, '') || cleanOldPhone;

      const updatedRecord = {
        ...editingCustomer,
        name: editName,
        phone: cleanNewPhone,
        dob: editDob || editingCustomer.dob || '',
        aadhaarNo: editAadhaar || editingCustomer.aadhaarNo || '',
        aadhar: editAadhaar || editingCustomer.aadhar || '',
        profile: {
          ...(editingCustomer.profile || {}),
          name: editName,
          phone: cleanNewPhone,
          dob: editDob || editingCustomer.profile?.dob || '',
          aadhaarNo: editAadhaar || editingCustomer.profile?.aadhaarNo || ''
        },
        updatedAt: new Date().toISOString()
      };

      if (cleanOldPhone !== cleanNewPhone) {
        await deleteCustomerProfileCloud(cleanOldPhone);
      }
      await saveCustomerProfileCloud(cleanNewPhone, updatedRecord);
      if (setCustomerRecords) {
        setCustomerRecords((prev) => {
          const copy = { ...prev };
          delete copy[cleanOldPhone];
          copy[cleanNewPhone] = updatedRecord;
          return copy;
        });
      }
      setEditingCustomer(null);
      notify('🎉 Customer profile updated successfully!');
    };

    const handleDeleteCustomer = async (cust) => {
      if (!cust) return;
      const custName = cust.profile?.name || cust.name || 'Customer';
      const cleanPhone = String(cust.phone || '').replace(/\D/g, '');
      const confirmDelete = window.confirm(`Are you sure you want to PERMANENTLY remove customer "${custName}" (+91 ${cleanPhone})?\n\nஇந்த வாடிக்கையாளரின் அனைத்து விவரங்கள், பதிவேற்றிய ஆவணங்கள் மற்றும் டோக்கன் சீட்டுகளை நிச்சயமாக நீக்க விரும்புகிறீர்களா?`);
      if (confirmDelete) {
        if (setCustomerRecords) {
          setCustomerRecords((prevRecords = {}) => {
            const copy = {};
            Object.keys(prevRecords).forEach((k) => {
              const kClean = String(k).replace(/\D/g, '');
              const valClean = String(prevRecords[k]?.phone || prevRecords[k]?.profile?.phone || '').replace(/\D/g, '');
              if (kClean !== cleanPhone && valClean !== cleanPhone) {
                copy[k] = prevRecords[k];
              }
            });
            return copy;
          });
        }
        setActiveCustomer('');
        await deleteCustomerProfileCloud(cleanPhone);
        await deleteCustomerProfileCloud(cust.phone);
        notify(`🗑️ Customer ${custName} (+91 ${cleanPhone}) deleted permanently from all pages & database!`);
      }
    };

    const handleUpdateTokenStatus = async (tok, newStatus) => {
      const updated = {
        ...tok,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      await saveTokenBookingCloud(updated);
      notify(`✅ Token ${tok.tokenNo} status updated to "${newStatus}"!`);
    };

    const handleDeleteToken = async (tok) => {
      if (!tok) return;
      const targetTokNo = String(tok.tokenNo || tok.tokenId || tok.id || '');
      if (!targetTokNo) return;

      const confirmDelete = window.confirm(`Are you sure you want to PERMANENTLY delete Token ${targetTokNo} for ${tok.customerName || tok.applicantName || 'Customer'}?\n\nஇந்த டோக்கன் சீட்டை நிச்சயமாக நீக்க விரும்புகிறீர்களா?`);
      if (!confirmDelete) return;

      if (setTokenBookings) {
        setTokenBookings((prev) => prev.filter(t => String(t.tokenNo || t.tokenId || t.id) !== targetTokNo));
      }

      if (setCustomerRecords) {
        setCustomerRecords((prevRecords = {}) => {
          const updated = { ...prevRecords };
          Object.keys(updated).forEach((k) => {
            if (updated[k] && updated[k].lastToken) {
              const tNo = String(updated[k].lastToken.tokenNo || updated[k].lastToken.tokenId || updated[k].lastToken.id || '');
              if (tNo === targetTokNo) {
                updated[k] = { ...updated[k], lastToken: null, updatedAt: new Date().toISOString() };
              }
            }
          });
          return updated;
        });
      }

      await deleteTokenBookingCloud(targetTokNo, tok.phone || tok.customerPhone);
      notify(`🗑️ Token ${targetTokNo} removed permanently from all pages & database!`);
    };

    const handleVerifyPayment = async (tok) => {
      if (!tok) return;
      const targetId = tok.id || tok.tokenNo || tok.utr;
      try {
        const verified = await verifyTokenPaymentCloud(targetId);
        const tokNo = verified?.token?.tokenNo || verified?.tokenNo || 'TOK';
        notify(`✅ ₹50 கட்டணம் சரிபார்க்கப்பட்டது! அதிகாரப்பூர்வ டோக்கன் எண் ${tokNo} உருவாக்கப்பட்டது.`);
      } catch (err) {
        notify(`❌ சரிபார்ப்பு பிழை: ${err.message || String(err)}`);
      }
    };

    const handleRejectPayment = async (tok) => {
      if (!tok) return;
      const reason = window.prompt(
        `கட்டணத்தை நிராகரிப்பதற்கான காரணத்தை உள்ளிடவும் (Rejection Reason):\n\n(Applicant: ${tok.customerName || 'Customer'}, UTR: ${tok.utr || 'N/A'})`,
        'தவறான UTR / கட்டணம் கணக்கில் வரவு வைக்கப்படவில்லை (Invalid UTR / Amount not credited)'
      );
      if (reason === null) return;
      const targetId = tok.id || tok.tokenNo || tok.utr;
      try {
        await rejectTokenPaymentCloud(targetId, reason || 'Invalid UTR');
        notify(`❌ கட்டணம் நிராகரிக்கப்பட்டது (${tok.customerName || 'Customer'}). டோக்கன் உருவாக்கப்படவில்லை.`);
      } catch (err) {
        notify(`❌ பிழை: ${err.message || String(err)}`);
      }
    };

    return (
      <section className="admin-dashboard page-width">
        <div className="dashboard-top">
          <div><span className="section-kicker">ADMIN DASHBOARD</span><h1>Customer <em>requests.</em></h1><p>View submitted services, documents, and token bookings.</p></div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="logout-button" style={{ background: '#0052cc', color: 'white', borderColor: '#0043a8' }} onClick={async () => {
              notify('⏳ Fetching latest data from cloud database...');
              const cloud = await fetchAllCloudRecords();
              if (cloud) {
                if (cloud.customers) setCustomerRecords(cloud.customers);
                if (Array.isArray(cloud.tokens)) setTokenBookings(cloud.tokens);
                if (cloud.applications) {
                  setApplicationRecords(cloud.applications);
                  setInStoreApplications(cloud.applications);
                }
                if (Array.isArray(cloud.documents)) setCloudExpiryDocs(cloud.documents);
                notify('✅ Database sync complete!');
              } else {
                notify('⚡ Using latest synchronized cloud state');
              }
            }}><Sparkles size={14} /> 🔄 Sync Database</button>
            <button className="logout-button" onClick={logout}><LogOut size={14} /> Logout admin</button>
          </div>
        </div>
        <div className="admin-tools">
          <button id="admin-tool-notifications" onClick={() => setAdminTab('notifications')}><Bell size={18} /><span><strong>Notifications</strong><small>Add & delete notifications</small></span></button>
          <button id="admin-tool-weblinks" onClick={() => navigate('weblink')}><ExternalLink size={18} /><span><strong>Weblinks</strong><small>359+ Official Portals</small></span></button>
          <button id="admin-tool-photomaker" onClick={() => setAdminTab('photomaker')}><Camera size={18} /><span><strong>Photo Maker</strong><small>Passport & Signature Studio</small></span></button>
          <button id="admin-tool-forms" onClick={() => navigate('forms')}><FormInput size={18} /><span><strong>Forms</strong><small>Official PDF downloads</small></span></button>
          <button id="admin-tool-software" onClick={() => navigate('software')}><FileCog size={18} /><span><strong>Software</strong><small>AkEsevai tools</small></span></button>
        </div>
        <div className="dashboard-stats">
          <div
            id="admin-stat-customers"
            onClick={() => setAdminTab('customers')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            title="Click to view Customer Requests & Profiles (வாடிக்கையாளர்கள்)"
          >
            <span className="stat-icon yellow"><Users /></span>
            <span><strong id="admin-count-customers">{customers.length}</strong><small>Customers (வாடிக்கையாளர்கள்)</small></span>
          </div>

          <div
            id="admin-stat-applications"
            onClick={() => setAdminTab('applications')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            title="Click to view Applications Manager (விண்ணப்பங்கள்)"
          >
            <span className="stat-icon blue"><FileText /></span>
            <span><strong id="admin-count-applications">{totalApplications}</strong><small>Service requests (விண்ணப்பங்கள்)</small></span>
          </div>

          <div
            id="admin-stat-documents"
            onClick={() => setAdminTab('smartdesk')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            title="Click to view Uploaded Documents in Smart Desk (ஆவணங்கள்)"
          >
            <span className="stat-icon green"><FileCheck2 /></span>
            <span><strong id="admin-count-documents">{totalDocuments}</strong><small>Uploaded documents (ஆவணங்கள்)</small></span>
          </div>

          <div
            id="admin-stat-tokens"
            onClick={() => setAdminTab('tokens')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            title="Click to view Token Bookings (டோக்கன் சீட்டுகள்)"
          >
            <span className="stat-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><CalendarDays /></span>
            <span><strong id="admin-count-tokens">{combinedTokensList.length}</strong><small>Token Bookings (டோக்கன்கள்)</small></span>
          </div>

          <div
            id="admin-stat-revenue"
            onClick={() => setAdminTab('tokens')}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            title="Click to view Token Bookings & Revenue (வருமானம்)"
          >
            <span className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><IndianRupee /></span>
            <span><strong id="admin-count-revenue">₹{combinedTokensList.length * 50}</strong><small>Est. Token Revenue (வருமானம்)</small></span>
          </div>
        </div>
        <div ref={dashboardTabsRef} className="dashboard-tabs" style={{ marginBottom: '24px' }}>
          <button id="admin-tab-applications" className={adminTab === 'applications' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('applications'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }} style={{ background: adminTab === 'applications' ? '#0052cc' : undefined, color: adminTab === 'applications' ? 'white' : undefined }}>📋 Applications Manager ({allAppsList.length})</button>
          <button id="admin-tab-customers" className={adminTab === 'customers' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('customers'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}>👥 Customer Requests ({customers.length})</button>
          <button id="admin-tab-tokens" className={adminTab === 'tokens' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('tokens'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }}>🎫 Token Bookings ({combinedTokensList.length})</button>
          <button id="admin-tab-photomaker" className={adminTab === 'photomaker' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('photomaker'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }} style={{ background: adminTab === 'photomaker' ? '#0284c7' : undefined, color: adminTab === 'photomaker' ? 'white' : undefined }}>📸 Photo Maker Studio</button>
          <button id="admin-tab-notifications" className={adminTab === 'notifications' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('notifications'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }} style={{ background: adminTab === 'notifications' ? '#d97706' : undefined, color: adminTab === 'notifications' ? 'white' : undefined }}>📢 Notifications Manager (அறிவிப்புகள் மேலாண்மை)</button>
          <button id="admin-tab-advertisements" className={adminTab === 'advertisements' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('advertisements'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }} style={{ background: adminTab === 'advertisements' ? '#7c3aed' : undefined, color: adminTab === 'advertisements' ? 'white' : undefined }}>📢 Advertisements ({sponsoredAds.length})</button>
          <button id="admin-tab-smartdesk" className={adminTab === 'smartdesk' ? 'tab-active' : ''} onClick={(e) => { setAdminTab('smartdesk'); e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }} style={{ background: adminTab === 'smartdesk' ? '#16a34a' : undefined, color: adminTab === 'smartdesk' ? 'white' : undefined }}>💻 Smart Operator Console</button>
        </div>

        {editingCustomer && (
          <div style={{ background: '#f8fafc', border: '2px solid #3b82f6', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>✏️ Edit Customer Profile ({editingCustomer.phone})</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: '180px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Customer Name:
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }} />
              </label>
              <label style={{ flex: 1, minWidth: '180px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Mobile Phone Number:
                <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }} />
              </label>
              <label style={{ flex: 1, minWidth: '180px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Date of Birth (DOB):
                <input type="date" value={editDob} onChange={(e) => setEditDob(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }} />
              </label>
              <label style={{ flex: 1, minWidth: '180px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Aadhaar Number:
                <input type="text" value={editAadhaar} onChange={(e) => setEditAadhaar(e.target.value)} placeholder="12-digit Aadhaar" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingCustomer(null)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveEditCustomer} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>💾 Save Changes</button>
            </div>
          </div>
        )}

        {adminTab === 'applications' && (
          <div style={{ marginTop: '10px' }}>
            <div className="panel-heading" style={{ marginBottom: '16px' }}>
              <div>
                <span className="section-kicker">APPLICATIONS MANAGER</span>
                <h2>All Created Service Applications</h2>
                <p>Manage stages, update status, or delete application records from Firebase Cloud.</p>
              </div>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="service-search" style={{ flex: 1, margin: 0 }}>
                <Search size={18} />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="🔍 Search by Application ID (e.g. TN-AK-2026-12345), Applicant Name, or Mobile Number..."
                />
                {appSearch && (
                  <button type="button" onClick={() => setAppSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '12px', color: 'var(--muted)' }}>Clear</button>
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {filteredApps.length} {filteredApps.length === 1 ? 'Application' : 'Applications'}
              </span>
            </div>

            {filteredApps.length === 0 ? (
              <div className="empty-customer-state" style={{ padding: '40px', textAlign: 'center' }}>
                <FileText size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No applications found.</p>
              </div>
            ) : (
              <div className="token-bookings-table-wrap">
                <table className="admin-token-table">
                  <thead>
                    <tr>
                      <th>App ID / Ack No</th>
                      <th>Applicant Name</th>
                      <th>Mobile</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Stage (1-6)</th>
                      <th>Status Label</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => (
                      <tr key={app.id || app.ackNo}>
                        <td><span className="token-id-badge">{app.id || app.ackNo}</span></td>
                        <td><strong>{app.applicantName || app.name || 'Applicant'}</strong></td>
                        <td>+91 {app.phone}</td>
                        <td style={{ maxWidth: '200px' }}>{app.service || app.serviceName || 'General Service'}</td>
                        <td>{app.date || app.submittedDate || 'Recently'}</td>
                        <td>
                          <select
                            value={app.currentStage || 1}
                            onChange={(e) => handleUpdateAppStage(app.id || app.ackNo, parseInt(e.target.value, 10), app)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: app.currentStage === 7 ? '1.5px solid #ef4444' : app.currentStage === 6 ? '1.5px solid #16a34a' : '1.5px solid #0052cc',
                              fontWeight: 800,
                              fontSize: '11px',
                              cursor: 'pointer',
                              background: app.currentStage === 7 ? '#fef2f2' : app.currentStage === 6 ? '#f0fdf4' : '#eff6ff',
                              color: app.currentStage === 7 ? '#dc2626' : app.currentStage === 6 ? '#166534' : '#1d4ed8'
                            }}
                          >
                            <option value={1}>1. Application Submitted (விண்ணப்பம் பெறப்பட்டது)</option>
                            <option value={2}>2. Document Verification (ஆவணங்கள் சரிபார்க்கப்படுகிறது)</option>
                            <option value={3}>3. Document Pending (கூடுதல் ஆவணம் தேவை)</option>
                            <option value={4}>4. Under Process / Fee Paid (செயலாக்கத்தில் உள்ளது)</option>
                            <option value={5}>5. Officer Review (அதிகாரி பரிசீலனை)</option>
                            <option value={6}>6. Approved & Completed (சான்றிதழ் தயார் / நிறைவடைந்தது)</option>
                            <option value={7}>7. Rejected (நிராகரிக்கப்பட்டது)</option>
                          </select>
                        </td>
                        <td style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                          {app.statusLabel || app.status || 'Processing'}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteApp(app.id || app.ackNo)}
                            title="Delete Application"
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {adminTab === 'smartdesk' && (
          <div style={{ marginTop: '10px' }}>
            <AdminSevaiSmartDesk notify={notify} />
          </div>
        )}
        {adminTab === 'notifications' && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '16px', padding: '18px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px', color: '#b45309', textTransform: 'uppercase' }}>ADMIN NOTIFICATION MANAGEMENT</span>
                <h2 style={{ margin: '4px 0 0', fontSize: '18px', color: '#78350f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📢 அறிவிப்புகள் மேலாண்மை / Notification Management Panel
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#92400e' }}>
                  அட்மின்கள் மட்டுமே புதிய அறிவிப்புகளைச் சேர்க்கவும், பழைய அறிவிப்புகளை நீக்கவும், மற்றும் தேதி முடிந்தவற்றைத் தானாக நீக்கவும் முடியும்.
                </p>
              </div>
            </div>
            <NotificationTables forceAdmin={true} lang={lang || 'ta'} />
          </div>
        )}

        {adminTab === 'visitors' && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #334155', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', color: 'white' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px', color: '#fbbf24', textTransform: 'uppercase' }}>REAL-TIME TRAFFIC & VISITORS MONITOR</div>
              <h2 style={{ margin: '4px 0 0', fontSize: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                👀 தினசரி பார்வையாளர்கள் மேலாண்மை (Daily Visitor Analytics)
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                உங்கள் AkEsevai இணையதளத்தை தினமும் யாரெல்லாம் பார்வையிடுகிறார்கள், எந்தப் பக்கத்தைப் பார்க்கிறார்கள் மற்றும் மொபைல்/கணினி விவரங்களை நேரலையாகக் காணலாம்.
              </p>

              <div className="visitor-analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '18px' }}>
                <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', display: 'block' }}>இன்றைய பார்வையாளர்கள் (Today's Visitors)</small>
                  <strong style={{ fontSize: '24px', color: 'white', display: 'block', marginTop: '4px' }}>
                    {visitorLogs.filter(l => l.date === new Date().toISOString().split('T')[0]).length}
                  </strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', display: 'block' }}>மொத்த வருகைப் பதிவுகள் (Total Visitor Logs)</small>
                  <strong style={{ fontSize: '24px', color: 'white', display: 'block', marginTop: '4px' }}>
                    {visitorLogs.length}
                  </strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', display: 'block' }}>மொபைல் பயனர்கள் (Mobile Users)</small>
                  <strong style={{ fontSize: '24px', color: 'white', display: 'block', marginTop: '4px' }}>
                    {visitorLogs.filter(l => (l.device || '').toLowerCase().includes('mobile')).length}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="service-search" style={{ flex: 1, margin: 0 }}>
                <Search size={18} />
                <input
                  type="text"
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  placeholder="🔍 பார்வையாளர் பெயர், மொபைல் எண், பக்கம் அல்லது தேதி வைத்துத் தேடவும்..."
                />
                {visitorSearch && (
                  <button type="button" onClick={() => setVisitorSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '12px', color: 'var(--muted)' }}>Clear</button>
                )}
              </div>
            </div>

            <div className="token-bookings-table-wrap" style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table className="admin-token-table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th>தேதி & நேரம் (Date & Time)</th>
                    <th>பார்வையாளர் விவரம் (Visitor Name / Mobile)</th>
                    <th>பார்த்த பக்கம் (Page Visited)</th>
                    <th>சாதனம் (Device / Browser)</th>
                    <th>நடவடிக்கை (Action)</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorLogs.filter((l) => {
                    const q = visitorSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (l.name || '').toLowerCase().includes(q) || (l.phone || '').toLowerCase().includes(q) || (l.page || '').toLowerCase().includes(q) || (l.date || '').toLowerCase().includes(q) || (l.device || '').toLowerCase().includes(q);
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        பார்வையாளர் பதிவுகள் எதுவும் கிடைக்கவில்லை (No visitor logs found).
                      </td>
                    </tr>
                  ) : (
                    visitorLogs.filter((l) => {
                      const q = visitorSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (l.name || '').toLowerCase().includes(q) || (l.phone || '').toLowerCase().includes(q) || (l.page || '').toLowerCase().includes(q) || (l.date || '').toLowerCase().includes(q) || (l.device || '').toLowerCase().includes(q);
                    }).map((log, idx) => (
                      <tr key={log.id || idx}>
                        <td>
                          <strong style={{ fontSize: '12px', color: '#1e293b' }}>{log.date || 'Today'}</strong>
                          <small style={{ display: 'block', color: '#64748b', fontSize: '10px' }}>{log.time || log.timestamp || 'Recently'}</small>
                        </td>
                        <td>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>👤 {log.name || 'Guest Visitor'}</strong>
                          {log.phone && (
                            <small style={{ display: 'block', color: '#2563eb', fontWeight: 700, fontSize: '11px' }}>
                              📱 +91 {log.phone}
                            </small>
                          )}
                        </td>
                        <td>
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                            📄 {log.page || 'Home'}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#475569' }}>
                          {log.device || 'Mobile Browser'}
                        </td>
                        <td>
                          {log.phone ? (
                            <button
                              onClick={() => window.open(`https://wa.me/91${log.phone.replace(/\D/g, '')}`, '_blank')}
                              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <MessageCircle size={13} /> WhatsApp மெசேஜ்
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>இணைப்பில்லை (Guest)</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {adminTab === 'customers' && (
          <div className="admin-grid">
            <aside className="admin-customers">
              <div className="panel-heading" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <div><span className="section-kicker">CUSTOMERS REGISTER</span><h2>All requests ({matchingCustomers.length})</h2></div>
                <button
                  onClick={() => setShowAddCustForm(!showAddCustForm)}
                  style={{
                    background: showAddCustForm ? '#94a3b8' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {showAddCustForm ? '✕ Close' : '➕ New Customer'}
                </button>
              </div>

              {showAddCustForm && (
                <form onSubmit={handleAddNewCustomer} style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '12px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <strong style={{ fontSize: '12px', color: '#15803d' }}>➕ புதிய வாடிக்கையாளர் பதிவு (New Registration)</strong>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151' }}>
                    பெயர் (Name)*:
                    <input type="text" required value={newCustName} onChange={(e) => setNewCustName(e.target.value)} placeholder="e.g. Ramesh" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '2px', fontSize: '12px' }} />
                  </label>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151' }}>
                    மொபைல் எண் (Mobile)*:
                    <input type="tel" required maxLength="10" value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} placeholder="10-digit mobile" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '2px', fontSize: '12px' }} />
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <label style={{ flex: 1, fontSize: '11px', fontWeight: 700, color: '#374151' }}>
                      பிறந்த தேதி (DOB):
                      <input type="date" value={newCustDob} onChange={(e) => setNewCustDob(e.target.value)} style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '2px', fontSize: '11px' }} />
                    </label>
                    <label style={{ flex: 1, fontSize: '11px', fontWeight: 700, color: '#374151' }}>
                      ஆதார் (Aadhaar):
                      <input type="text" maxLength="14" value={newCustAadhar} onChange={(e) => setNewCustAadhar(e.target.value)} placeholder="12-digit Aadhaar" style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '2px', fontSize: '11px' }} />
                    </label>
                  </div>
                  <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', padding: '7px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', marginTop: '2px' }}>
                    💾 Save Customer Profile (சேமிக்க)
                  </button>
                </form>
              )}

              <div className="service-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer or service" /></div>
              {matchingCustomers.length ? matchingCustomers.map((customer) => {
                const custName = customer.profile?.name || customer.name || customer.phone || 'Customer';
                const avatar = custName.slice(0, 2).toUpperCase();
                const appCount = Array.isArray(customer.applications) ? customer.applications.length : 0;
                return (
                  <button className={`admin-customer-row ${selected?.phone === customer.phone ? 'admin-customer-active' : ''}`} onClick={() => setActiveCustomer(customer.phone)} key={customer.phone || Math.random()}>
                    <span className="avatar">{avatar}</span>
                    <span><strong>{custName}</strong><small>+91 {customer.phone} · {appCount} services</small></span>
                    <ChevronRight size={16} />
                  </button>
                );
              }) : <p className="empty-customer-state">No matching customer requests.</p>}
            </aside>
            <section className="admin-detail">
              {selected ? (() => {
                const liveCustomerMap = customerRecords || {};
                const cleanSelectedPhone = (selected.phone || '').replace(/\D/g, '');
                const profileRecord = liveCustomerMap[cleanSelectedPhone] || liveCustomerMap[selected.phone] || {};
                const globalExpiryDocs = cloudExpiryDocs || [];

                const rawSelectedApps = Array.isArray(selected.applications) ? selected.applications : [];
                // Deduplicate applications by ID / service name for clean display
                const selectedAppsMap = new Map();
                rawSelectedApps.forEach((app) => {
                  if (!app) return;
                  const key = String(app.id || app.name || '');
                  if (!selectedAppsMap.has(key)) {
                    selectedAppsMap.set(key, app);
                  }
                });
                const selectedApps = Array.from(selectedAppsMap.values());
                const selectedAppIds = selectedApps.map(a => a.id).filter(Boolean);

                const combinedDocs = [
                  ...(selected.documents || []),
                  ...(profileRecord.documents || []),
                  ...globalExpiryDocs.filter((d) => {
                    const docPhone = (d.customerPhone || '').replace(/\D/g, '');
                    const docAppId = d.applicationId || d.id || '';
                    const matchesPhone = cleanSelectedPhone && docPhone && (docPhone === cleanSelectedPhone || docPhone.includes(cleanSelectedPhone) || cleanSelectedPhone.includes(docPhone));
                    const matchesApp = selectedAppIds.some(appId => docAppId.includes(appId));
                    return matchesPhone || matchesApp;
                  }).map(d => ({
                    id: d.id || d.url,
                    requirement: d.requirement || d.title || d.name,
                    name: d.name || 'Uploaded Document',
                    uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-IN') : 'Recently',
                    data: d.url || d.data
                  }))
                ];

                const selectedDocs = combinedDocs.reduce((acc, current) => {
                  if (!current) return acc;
                  const curId = String(current.id || '');
                  const curReq = (current.requirement || current.title || '').trim().toLowerCase();
                  const curAppId = String(current.applicationId || '');

                  const existingIndex = acc.findIndex((item) => {
                    const itemId = String(item.id || '');
                    const itemReq = (item.requirement || item.title || '').trim().toLowerCase();
                    const itemAppId = String(item.applicationId || '');

                    const idMatch = curId && itemId && curId === itemId;
                    const reqAppMatch = curReq && itemReq && curReq === itemReq && curAppId && itemAppId && curAppId === itemAppId;

                    return idMatch || reqAppMatch;
                  });

                  if (existingIndex === -1) {
                    acc.push(current);
                  } else {
                    const existing = acc[existingIndex];
                    acc[existingIndex] = {
                      ...existing,
                      ...current,
                      url: current.url || current.data || existing.url || existing.data,
                      data: current.url || current.data || existing.url || existing.data
                    };
                  }
                  return acc;
                }, []);

                const selectedName = selected.profile?.name || selected.name || 'Customer';

                return (
                  <>
                    <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span className="section-kicker">CUSTOMER DETAILS</span>
                        <h2>{selectedName}</h2>
                        <p style={{ fontWeight: 800, color: '#16a34a' }}>📱 +91 {selected.phone}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleSendMonthlyWhatsAppReminder(selected)}
                          style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <MessageCircle size={14} /> 💬 மாதாந்திர WhatsApp நினைவுறுத்தல்
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer(selected);
                            setEditName(selectedName);
                            setEditPhone(selected.phone || '');
                            setEditDob(selected.dob || selected.profile?.dob || profileRecord.dob || '');
                            setEditAadhaar(selected.aadhaarNo || selected.aadhar || selected.profile?.aadhaarNo || profileRecord.aadhaarNo || '');
                          }}
                          style={{ background: '#0052cc', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          ✏️ Edit Profile
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(selected)}
                          style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          🗑️ Delete Customer
                        </button>
                      </div>
                    </div>

                    {/* Customer Profile Quick Overview Box: Aadhaar, DOB, Token & Reminder */}
                    <div className="customer-quick-overview-grid" style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={16} color="#0052cc" />
                        <span>ஆதார் எண்: <strong style={{ color: '#0f172a' }}>{selected.aadhaarNo || selected.aadhar || selected.profile?.aadhaarNo || selected.profile?.aadhar || profileRecord.aadhaarNo || profileRecord.aadhar || 'பதிவாகவில்லை'}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#d97706" />
                        <span>பிறந்த தேதி: <strong style={{ color: '#0f172a' }}>{selected.dob || selected.profile?.dob || profileRecord.dob || 'பதிவாகவில்லை'}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Ticket size={16} color="#16a34a" />
                        <span>டோக்கன் சீட்டு: <strong style={{ color: '#16a34a' }}>{(selected.lastToken || profileRecord.lastToken) ? `${(selected.lastToken || profileRecord.lastToken).tokenNo} (${(selected.lastToken || profileRecord.lastToken).service || 'Service'})` : 'டோக்கன் இல்லை'}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} color="#7c3aed" />
                        <span>நினைவுறுத்தல்: <strong style={{ color: '#7c3aed' }}>{selected.lastReminderSent ? new Date(selected.lastReminderSent).toLocaleDateString('ta-IN') : 'இன்னும் அனுப்பப்படவில்லை'}</strong></span>
                      </div>
                    </div>





                    <h3 className="admin-section-title">Selected services (விண்ணப்பித்த சேவைகள் & நிலைகள்)</h3>
                    {selectedApps.length ? selectedApps.map((application, appIdx) => {
                      const appIdKey = application.id || application.ackNo;
                      const storeRecord = applicationRecords && (applicationRecords[appIdKey] || applicationRecords[application.name]);
                      const currentStageNum = storeRecord?.currentStage || application.currentStage || application.stage || (application.status === 'Completed' ? 6 : 1);

                      return (
                        <div className="admin-service-row" key={application.id ? `${application.id}_${appIdx}` : `app_${application.name}_${appIdx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="doc-symbol"><FileText size={17} /></span>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{application.name}</strong>
                              <small style={{ fontSize: '11px', color: '#64748b' }}>
                                ID: <strong>{application.id}</strong> · Submitted: {application.date}
                              </small>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {/* Step-by-step Stage Change Selector Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                              <small style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                                📊 Step / நிலை:
                              </small>
                              <select
                                value={currentStageNum}
                                onChange={(e) => {
                                  const newStage = parseInt(e.target.value, 10);
                                  handleUpdateAppStage(appIdKey, newStage, {
                                    ...application,
                                    id: appIdKey,
                                    applicantName: selectedName,
                                    phone: selected.phone,
                                    service: application.name
                                  });
                                  notify(`🔄 ${application.name} நிலை Step ${newStage}-க்கு மாற்றப்பட்டது!`);
                                }}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1.5px solid #0052cc',
                                  fontWeight: 800,
                                  fontSize: '11.5px',
                                  cursor: 'pointer',
                                  background: currentStageNum === 6 ? '#f0fdf4' : '#eff6ff',
                                  color: currentStageNum === 6 ? '#15803d' : '#1d4ed8'
                                }}
                              >
                                <option value={1}>Step 1: விண்ணப்பம் பெறப்பட்டது (Received)</option>
                                <option value={2}>Step 2: ஆவணங்கள் சரிபார்க்கப்பட்டது (Verified)</option>
                                <option value={3}>Step 3: கட்டணம் பெறப்பட்டது (Fee Paid)</option>
                                <option value={4}>Step 4: அரசு தளத்தில் தாக்கல் செய்யப்பட்டது (Submitted to Govt)</option>
                                <option value={5}>Step 5: அதிகாரி பரிசீலனை (Officer Review)</option>
                                <option value={6}>Step 6: சான்றிதழ் தயார் / நிறைவடைந்தது (Approved & Completed)</option>
                              </select>
                            </div>

                            <button
                              onClick={async () => {
                                const cleanPhone = String(selected.phone).replace(/\D/g, '');
                                handleUpdateAppStage(appIdKey, 6, {
                                  ...application,
                                  id: appIdKey,
                                  applicantName: selectedName,
                                  phone: selected.phone,
                                  service: application.name
                                });
                                notify(`🎉 Service "${application.name}" marked COMPLETED for ${selectedName}!`);
                              }}
                              style={{ background: '#f0fdf4', color: '#15803d', border: '1.5px solid #86efac', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              ✅ Mark Completed
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete application "${application.name}" (${application.id})? / இந்த விண்ணப்பத்தை நீக்க விரும்புகிறீர்களா?`)) {
                                  const cleanPhone = String(selected.phone).replace(/\D/g, '');
                                  const updatedApps = (selected.applications || []).filter(a => a.id !== application.id && a.name !== application.name);
                                const updatedRecord = {
                                  ...selected,
                                  applications: updatedApps,
                                  updatedAt: new Date().toISOString()
                                };
                                await saveCustomerProfileCloud(cleanPhone, updatedRecord);
                                if (application.id) await deleteApplicationCloud(application.id);
                                if (setCustomerRecords) {
                                  setCustomerRecords((prev) => ({
                                    ...prev,
                                    [cleanPhone]: updatedRecord,
                                    [selected.phone]: updatedRecord
                                  }));
                                }
                                if (setApplicationRecords && application.id) {
                                  setApplicationRecords((prev) => {
                                    const copy = { ...prev };
                                    delete copy[application.id];
                                    return copy;
                                  });
                                }
                                notify(`🗑️ Application "${application.name}" deleted successfully!`);
                              }
                            }}
                            style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={13} /> Delete (நீக்கு)
                          </button>
                          </div>
                        </div>
                      );
                    }) : <p className="empty-customer-state">No service selected.</p>}
                    <h3 className="admin-section-title">Uploaded documents (வாடிக்கையாளர் பதிவேற்றிய ஆவணங்கள்) — {selectedDocs.length} Files</h3>
                    {selectedDocs.length ? selectedDocs.map((document, idx) => (
                      <div className="admin-service-row" key={document.id ? `${document.id}_${idx}` : `doc_${document.name}_${idx}`} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className="doc-symbol" style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '8px' }}>
                            <FileCheck2 size={20} />
                          </span>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{document.requirement || document.name}</strong>
                            <small style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>📄 {document.name} · Uploaded {document.uploadedAt}</small>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                          <button className="document-open" onClick={() => handleViewDocument(document)} title="View Document" style={{ background: '#0052cc', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                            <Eye size={15} /> View (காண்க)
                          </button>
                          <button className="document-open" onClick={() => handleDownloadDocument(document)} title="Download Document" style={{ background: '#16a34a', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                            <Download size={14} /> Download (பதிவிறக்கு)
                          </button>
                          <button
                            className="document-open"
                            onClick={async () => {
                              const reqName = document.requirement || document.name;
                              if (window.confirm(`Are you sure you want to PERMANENTLY delete document "${reqName}"? / இந்த ஆவணத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா?`)) {
                                const docId = document.id || document.url;
                                const phone = selected.phone;

                                if (setCustomerRecords) {
                                  setCustomerRecords((prev) => {
                                    const cleanPhone = String(phone).replace(/\D/g, '');
                                    const custObj = prev[cleanPhone] || prev[phone];
                                    if (!custObj) return prev;
                                    const updatedDocs = (custObj.documents || []).filter(
                                      (d) => String(d.id) !== String(docId) && d.requirement !== reqName && String(d.url || d.data) !== String(docId) && String(d.name) !== String(document.name)
                                    );
                                    const updatedCust = { ...custObj, documents: updatedDocs, updatedAt: new Date().toISOString() };
                                    saveCustomerProfileCloud(cleanPhone, updatedCust);
                                    return {
                                      ...prev,
                                      [cleanPhone]: updatedCust,
                                      [phone]: updatedCust
                                    };
                                  });
                                }

                                await deleteExpiryDocumentCloud(docId, phone);
                                notify(`🗑️ Document "${reqName}" deleted successfully!`);
                              }
                            }}
                            title="Delete Document"
                            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            <Trash2 size={14} /> Delete (நீக்கு)
                          </button>
                        </div>
                      </div>
                    )) : <p className="empty-customer-state">This customer has not uploaded documents yet.</p>}
                  </>
                );
              })() : <div className="empty-customer-state">Customer uploads will appear here after customers select a service and upload documents.</div>}
            </section>
          </div>
        )}
        {adminTab === 'tokens' && (() => {
          const pendingTokens = combinedTokensList.filter(t => t.paymentStatus === 'PENDING_VERIFICATION' || t.status === 'PAYMENT PENDING' || (!t.tokenNo && t.paymentStatus !== 'REJECTED'));
          const verifiedTokens = combinedTokensList.filter(t => (t.paymentStatus === 'VERIFIED' || t.paymentStatus?.includes('PAID') || t.tokenNo) && t.paymentStatus !== 'REJECTED');
          const rejectedTokens = combinedTokensList.filter(t => t.paymentStatus === 'REJECTED');

          const filteredList = combinedTokensList.filter((tok) => {
            if (tokenFilterStatus === 'pending') {
              const isPend = tok.paymentStatus === 'PENDING_VERIFICATION' || tok.status === 'PAYMENT PENDING' || (!tok.tokenNo && tok.paymentStatus !== 'REJECTED');
              if (!isPend) return false;
            } else if (tokenFilterStatus === 'verified') {
              const isVer = (tok.paymentStatus === 'VERIFIED' || tok.paymentStatus?.includes('PAID') || tok.tokenNo) && tok.paymentStatus !== 'REJECTED';
              if (!isVer) return false;
            } else if (tokenFilterStatus === 'rejected') {
              if (tok.paymentStatus !== 'REJECTED') return false;
            }

            const q = tokenSearch.trim().toLowerCase();
            if (!q) return true;
            return (tok.tokenNo || '').toLowerCase().includes(q) ||
                   (tok.phone || '').toLowerCase().includes(q) ||
                   (tok.customerName || '').toLowerCase().includes(q) ||
                   (tok.service || '').toLowerCase().includes(q) ||
                   (tok.date || '').toLowerCase().includes(q) ||
                   (tok.utr || '').toLowerCase().includes(q);
          });

          return (
            <div className="admin-token-bookings">
              <div className="panel-heading" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="section-kicker">TOKEN & PAYMENT MANAGEMENT</span>
                  <h2>💳 கட்டண சரிபார்ப்பு & டோக்கன் மேலாண்மை (Token Bookings)</h2>
                  <p>Customer UPI UTR submissions-ஐ சரிபார்த்து அதிகாரப்பூர்வ டோக்கன் எண்ணை உருவாக்கலாம் அல்லது நிராகரிக்கலாம்.</p>
                </div>
              </div>

              {/* PENDING PAYMENT VERIFICATION QUEUE (PROMINENT ALERT BOX) */}
              {pendingTokens.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 20px rgba(245,158,11,0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: '#d97706', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 900 }}>
                        ⚡ உடனடி சரிபார்ப்பு தேவை
                      </span>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#92400e', fontWeight: 900 }}>
                        சரிபார்க்கப்பட வேண்டிய கட்டணங்கள் ({pendingTokens.length} கோரிக்கைகள்)
                      </h3>
                    </div>
                    <small style={{ color: '#b45309', fontWeight: 700, fontSize: '12px' }}>
                      ₹50 கட்டணம் கணக்கில் வரவு வைக்கப்பட்டதை உறுதி செய்து டோக்கன் உருவாக்கவும்.
                    </small>
                  </div>

                  <div className="admin-pending-tokens-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                    {pendingTokens.map((pTok, pIdx) => (
                      <div
                        key={pTok.id ? `${pTok.id}_${pIdx}` : `pending_${pTok.utr || pIdx}_${pIdx}`}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #fde68a',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '15px', color: '#0f172a' }}>{pTok.customerName}</strong>
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 900 }}>
                              ₹50.00
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                            <div>📞 <strong>+91 {pTok.phone}</strong></div>
                            <div>🛠️ <strong>{pTok.service}</strong></div>
                            <div>📅 <strong>{pTok.date} ({pTok.slot})</strong></div>
                            <div style={{ marginTop: '4px', background: '#f1f5f9', padding: '6px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800 }}>UTR / REF:</span>
                              <code style={{ fontSize: '12.5px', fontWeight: 900, color: '#022c7a' }}>{pTok.utr || 'N/A'}</code>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment(pTok)}
                            style={{
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '11.5px',
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Check size={14} /> Verify & Issue
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectPayment(pTok)}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '11.5px',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            <X size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEARCH BAR & STATUS TABS */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div className="service-search" style={{ flex: 1, minWidth: '240px', margin: 0 }}>
                  <Search size={18} />
                  <input
                    type="text"
                    value={tokenSearch}
                    onChange={(e) => setTokenSearch(e.target.value)}
                    placeholder="🔍 Search by Token No, Mobile, Name, Service, or UTR..."
                  />
                  {tokenSearch && (
                    <button type="button" onClick={() => setTokenSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '12px', color: 'var(--muted)' }}>
                      Clear
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setTokenFilterStatus('all')}
                    style={{
                      background: tokenFilterStatus === 'all' ? '#0052cc' : '#f1f5f9',
                      color: tokenFilterStatus === 'all' ? 'white' : '#475569',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    All ({combinedTokensList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTokenFilterStatus('pending')}
                    style={{
                      background: tokenFilterStatus === 'pending' ? '#d97706' : '#fffbeb',
                      color: tokenFilterStatus === 'pending' ? 'white' : '#b45309',
                      border: '1px solid #fde68a',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Pending ({pendingTokens.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTokenFilterStatus('verified')}
                    style={{
                      background: tokenFilterStatus === 'verified' ? '#16a34a' : '#f0fdf4',
                      color: tokenFilterStatus === 'verified' ? 'white' : '#15803d',
                      border: '1px solid #bbf7d0',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Verified ({verifiedTokens.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTokenFilterStatus('rejected')}
                    style={{
                      background: tokenFilterStatus === 'rejected' ? '#dc2626' : '#fef2f2',
                      color: tokenFilterStatus === 'rejected' ? 'white' : '#991b1b',
                      border: '1px solid #fecaca',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Rejected ({rejectedTokens.length})
                  </button>
                </div>
              </div>

              {/* TOKENS TABLE */}
              {combinedTokensList.length === 0 ? (
                <div className="empty-customer-state" style={{ padding: '40px', textAlign: 'center' }}>
                  <CalendarDays size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>No token bookings or payment requests yet. Customers who book from the Token Slip page will appear here.</p>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="empty-customer-state" style={{ padding: '40px', textAlign: 'center' }}>
                  <Search size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>No token found matching your filter / search.</p>
                </div>
              ) : (
                <div className="token-bookings-table-wrap">
                  <table className="admin-token-table">
                    <thead>
                      <tr>
                        <th>Token No</th>
                        <th>Applicant Name</th>
                        <th>Mobile</th>
                        <th>Service</th>
                        <th>Visit Date & Slot</th>
                        <th>UTR / Fee</th>
                        <th>WhatsApp Alert</th>
                        <th>Technical Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.map((tok, tIdx) => {
                        const isTokPending = tok.paymentStatus === 'PENDING_VERIFICATION' || tok.status === 'PAYMENT PENDING' || (!tok.tokenNo && tok.paymentStatus !== 'REJECTED');
                        const isTokRejected = tok.paymentStatus === 'REJECTED';
                        const waText = encodeURIComponent(`🙏 *வணக்கம் ${tok.customerName}*,\n\nஉங்கள் AkEsevai டோக்கன் *${tok.tokenNo || 'சரிபார்ப்பில் உள்ளது'}* உறுதி செய்யப்பட்டது.\nசேவை: ${tok.service}\nதேதி & நேரம்: ${tok.date} (${tok.slot})\n\nAkEsevai மையம், பழனியில் சேவையைப் பெறலாம்.`);

                        return (
                          <tr key={tok.id ? `${tok.id}_${tIdx}` : `tok_${tok.tokenNo || tok.utr || tIdx}_${tIdx}`}>
                            <td>
                              {tok.tokenNo ? (
                                <span className="token-id-badge">{tok.tokenNo}</span>
                              ) : isTokRejected ? (
                                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 900 }}>REJECTED</span>
                              ) : (
                                <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 900 }}>PENDING</span>
                              )}
                            </td>
                            <td><strong>{tok.customerName}</strong></td>
                            <td>+91 {tok.phone}</td>
                            <td style={{ maxWidth: '180px' }}>{tok.service}</td>
                            <td>{tok.date}<br /><small style={{ color: '#64748b', fontWeight: 700 }}>{tok.slot}</small></td>
                            <td>
                              <div style={{ fontSize: '11.5px' }}>
                                <strong style={{ color: '#16a34a' }}>₹{tok.amount || 50}</strong>
                                {tok.utr && <div style={{ color: '#022c7a', fontWeight: 800, fontSize: '11px' }}>UTR: {tok.utr}</div>}
                              </div>
                            </td>
                            <td>
                              {tok.tokenNo ? (
                                <a
                                  href={`https://wa.me/91${String(tok.phone || '').replace(/\D/g, '')}?text=${waText}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ background: '#25D366', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <MessageCircle size={13} /> WA Alert
                                </a>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '11px' }}>—</span>
                              )}
                            </td>
                            <td>
                              {isTokPending ? (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyPayment(tok)}
                                  style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, cursor: 'pointer' }}
                                >
                                  ✅ Verify UTR
                                </button>
                              ) : (
                                <select
                                  value={tok.status || (isTokRejected ? 'NO-SHOW / CANCELLED' : 'CHECKED-IN / VERIFIED')}
                                  onChange={(e) => handleUpdateTokenStatus(tok, e.target.value)}
                                  style={{
                                    background: (tok.status?.includes('COMPLETED') || tok.status?.includes('SERVED')) ? '#f0fdf4' : (tok.status?.includes('AWAITING') || tok.status?.includes('PENDING')) ? '#fffbebf' : (tok.status?.includes('NO-SHOW') || tok.status?.includes('CANCELLED')) ? '#fef2f2' : '#eff6ff',
                                    color: (tok.status?.includes('COMPLETED') || tok.status?.includes('SERVED')) ? '#16a34a' : (tok.status?.includes('AWAITING') || tok.status?.includes('PENDING')) ? '#d97706' : (tok.status?.includes('NO-SHOW') || tok.status?.includes('CANCELLED')) ? '#dc2626' : '#2563eb',
                                    border: '1.5px solid currentColor',
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="CHECKED-IN / VERIFIED">🟢 VERIFIED (சரிபார்க்கப்பட்டது)</option>
                                  <option value="AWAITING VISIT">🟡 AWAITING VISIT (காத்திருப்பில்)</option>
                                  <option value="COMPLETED / SERVED">🔵 COMPLETED (நிறைவடைந்தது)</option>
                                  <option value="NO-SHOW / CANCELLED">🔴 CANCELLED / REJECTED</option>
                                </select>
                              )}
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteToken(tok)}
                                style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}

        {adminTab === 'photomaker' && (
          <div style={{ marginTop: '10px' }}>
            <PhotoMakerPage notify={notify} lang={lang || 'ta'} />
          </div>
        )}

        {adminTab === 'advertisements' && (
          <div className="admin-advertisements-panel" style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div className="panel-heading" style={{ marginBottom: '20px' }}>
              <div>
                <span className="section-kicker" style={{ color: '#7c3aed' }}>RESPONSIVE ADVERTISEMENTS & BANNERS</span>
                <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '4px 0 6px' }}>📢 விளம்பரங்கள் & அறிவிப்பு பேனர்கள் மேலாண்மை</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  எந்த size அல்லது dimension விளம்பர படத்தை பதிவேற்றினாலும் தானாகவே Desktop, Tablet & Mobile-க்கு ஏற்ற aspect ratio-வுடன் Home Page-ல் தோன்றும்.
                </p>
              </div>
            </div>

            {/* ADD / UPLOAD NEW AD FORM */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!adImageUrl.trim()) {
                  notify('⚠️ தயவுசெய்து விளம்பர படத்தை பதிவேற்றவும் அல்லது Image URL-ஐ உள்ளிடவும்.');
                  return;
                }
                setAdUploading(true);
                try {
                  const newAd = {
                    id: 'ad-' + Date.now(),
                    title: adTitle.trim(),
                    subtitle: adSubtitle.trim(),
                    imageUrl: adImageUrl.trim(),
                    aspectRatio: adImageAspectRatio || '16/9',
                    targetUrl: adTargetUrl.trim(),
                    badge: adBadge.trim() || 'Special Announcement',
                    status: adIsActive ? 'active' : 'inactive',
                    isActive: adIsActive,
                    order: sponsoredAds.length + 1
                  };
                  await saveSponsoredAdCloud(newAd);
                  setAdTitle('');
                  setAdSubtitle('');
                  setAdImageUrl('');
                  setAdTargetUrl('');
                  setAdBadge('Special Announcement');
                  setAdImageAspectRatio('16/9');
                  notify('🎉 புதிய விளம்பரம் வெற்றிகரமாக சேமிக்கப்பட்டது!');
                } catch (err) {
                  notify('❌ விளம்பரம் சேமிப்பதில் பிழை: ' + (err.message || 'Unknown error'));
                } finally {
                  setAdUploading(false);
                }
              }}
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '28px'
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#334155', fontWeight: 800 }}>
                ➕ புதிய விளம்பர பேனர் சேர்க்க (Add New Advertisement Banner)
              </h3>

              <div className="admin-ad-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                {/* Image Upload / URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    1. விளம்பரப் படம் (Image File / Upload) *:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const dataUrl = evt.target.result;
                        setAdImageUrl(dataUrl);
                        const img = new Image();
                        img.onload = () => {
                          const w = img.naturalWidth || 1;
                          const h = img.naturalHeight || 1;
                          const ratio = (w / h).toFixed(2);
                          setAdImageAspectRatio(`${w}/${h}`);
                          notify(`📐 Aspect Ratio கண்டறியப்பட்டது: ${w}x${h} (${ratio})`);
                        };
                        img.src = dataUrl;
                      };
                      reader.readAsDataURL(file);
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b' }}>அல்லது நேரடி Image URL:</div>
                  <input
                    type="url"
                    value={adImageUrl.startsWith('data:') ? '' : adImageUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      setAdImageUrl(url);
                      if (url) {
                        const img = new Image();
                        img.onload = () => {
                          const w = img.naturalWidth || 1;
                          const h = img.naturalHeight || 1;
                          setAdImageAspectRatio(`${w}/${h}`);
                        };
                        img.src = url;
                      }
                    }}
                    placeholder="https://example.com/banner.jpg"
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', marginTop: '4px' }}
                  />
                </div>

                {/* Title & Subtitle */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    2. விளம்பரத் தலைப்பு (Title - Optional):
                  </label>
                  <input
                    type="text"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="எ.கா: TNPSC Group 4 சிறப்பு பயிற்சி"
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', marginBottom: '10px' }}
                  />

                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    3. விவரம் / Tagline (Subtitle - Optional):
                  </label>
                  <input
                    type="text"
                    value={adSubtitle}
                    onChange={(e) => setAdSubtitle(e.target.value)}
                    placeholder="எ.கா: இன்றே பதிவு செய்து அரசு வேலைவாய்ப்பை வெல்லுங்கள்"
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px' }}
                  />
                </div>

                {/* Target URL & Badge */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    4. கிளிக் செய்யும் இணைப்பு (Target URL / WhatsApp / Link):
                  </label>
                  <input
                    type="text"
                    value={adTargetUrl}
                    onChange={(e) => setAdTargetUrl(e.target.value)}
                    placeholder="https://wa.me/919342318844 அல்லது https://..."
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', marginBottom: '10px' }}
                  />

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                        5. Badge Text:
                      </label>
                      <input
                        type="text"
                        value={adBadge}
                        onChange={(e) => setAdBadge(e.target.value)}
                        placeholder="Special Announcement"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ paddingTop: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#16a34a', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={adIsActive}
                          onChange={(e) => setAdIsActive(e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        Active (நேரலையில்)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE IMAGE PREVIEW IN FORM */}
              {adImageUrl && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#475569' }}>🖼️ Preview (Aspect Ratio: {adImageAspectRatio}):</strong>
                    <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#64748b' }}>Original Aspect Ratio Preserved</span>
                  </div>
                  <div style={{ maxHeight: '180px', display: 'flex', justifyContent: 'center', background: '#0f172a', borderRadius: '8px', overflow: 'hidden', padding: '6px' }}>
                    <img src={adImageUrl} alt="Ad Preview" style={{ maxHeight: '168px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={adUploading}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: adUploading ? 'wait' : 'pointer',
                    boxShadow: '0 3px 10px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  {adUploading ? '⏳ சேமிக்கப்படுகிறது...' : '💾 விளம்பரத்தை வெளியிட (Publish Ad)'}
                </button>
              </div>
            </form>

            {/* LIST OF CURRENT ADVERTISEMENTS */}
            <div>
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#0f172a', fontWeight: 800 }}>
                📋 தற்போதுள்ள விளம்பரங்கள் ({sponsoredAds.length})
              </h3>

              {sponsoredAds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📢</div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#64748b' }}>தற்போது விளம்பரங்கள் எதுவும் இல்லை</strong>
                  <p style={{ fontSize: '12px', margin: '4px 0 0' }}>விளம்பரங்களை சேர்த்தவுடன் Home Page-ல் தோன்றும்; இல்லையென்றால் banner section தானாக hide ஆகும்.</p>
                </div>
              ) : (
                <div className="admin-active-ads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {sponsoredAds.map((ad) => (
                    <div
                      key={ad.id}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ height: '140px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={ad.imageUrl}
                          alt={ad.title || 'Advertisement'}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: ad.isActive ? '#16a34a' : '#64748b',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 900,
                            padding: '3px 8px',
                            borderRadius: '12px'
                          }}
                        >
                          {ad.isActive ? '● Live Active' : '○ Inactive'}
                        </span>
                        {ad.badge && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: '#7c3aed',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 900,
                              padding: '3px 8px',
                              borderRadius: '12px'
                            }}
                          >
                            {ad.badge}
                          </span>
                        )}
                      </div>

                      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                            {ad.title || 'Untitled Banner'}
                          </strong>
                          {ad.subtitle && (
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px' }}>
                              {ad.subtitle}
                            </p>
                          )}
                          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <span>📐 Ratio: <strong>{ad.aspectRatio || 'Auto'}</strong></span>
                            {ad.targetUrl && (
                              <span style={{ color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                🔗 {ad.targetUrl}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                          <button
                            onClick={async () => {
                              const updated = { ...ad, isActive: !ad.isActive, status: !ad.isActive ? 'active' : 'inactive' };
                              await saveSponsoredAdCloud(updated);
                              notify(updated.isActive ? '🟢 விளம்பரம் இயக்கப்பட்டது!' : '⚪ விளம்பரம் முடக்கப்பட்டது!');
                            }}
                            style={{
                              background: ad.isActive ? '#fef3c7' : '#dcfce7',
                              color: ad.isActive ? '#92400e' : '#15803d',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            {ad.isActive ? 'Pause Ad' : 'Activate Ad'}
                          </button>

                          <button
                            onClick={async () => {
                              if (window.confirm('இந்த விளம்பரத்தை நீக்க விரும்புகிறீர்களா?')) {
                                await deleteSponsoredAdCloud(ad.id);
                                notify('🗑️ விளம்பரம் நீக்கப்பட்டது!');
                              }
                            }}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  function CustomerPage({ customer, updateCustomer, logout, notify, saveToken, cloudExpiryDocs = [], activeTab: propTab, setActiveTab: setPropTab, lang = 'ta', navigate }) {
    const [internalTab, setInternalTab] = useState(propTab || 'overview');
    const activeTab = propTab || internalTab;
    const setActiveTab = setPropTab || setInternalTab;
    const [selectedService, setSelectedService] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [name, setName] = useState(customer.profile.name?.startsWith('Customer ') ? '' : (customer.profile.name || ''));
    const [dobInput, setDobInput] = useState(customer.profile.dob || customer.dob || '');
    const [aadhaarInput, setAadhaarInput] = useState(customer.profile.aadhaarNo || customer.profile.aadhar || customer.aadhaarNo || customer.aadhar || '');

    // Editable state inside customer settings
    const [editName, setEditName] = useState(customer.profile.name || '');
    const [editDob, setEditDob] = useState(customer.profile.dob || customer.dob || '');
    const [editAadhaar, setEditAadhaar] = useState(customer.profile.aadhaarNo || customer.profile.aadhar || customer.aadhaarNo || customer.aadhar || '');

    // FIRST TIME PROFILE COMPLETION SCREEN: Name, DOB, Aadhaar Number
    if (!customer.profile.complete) {
      return (
        <section className="customer-entry">
          <div className="login-art">
            <span className="eyebrow"><span className="live-dot" /> Customer Profile Registration</span>
            <h1>Welcome to<br /><em>AkEsevai.</em></h1>
            <p>உங்கள் பெயர், பிறந்த தேதி மற்றும் ஆதார் எண் விவரங்களை ஒருமுறை உள்ளிடவும். இவை பாதுகாப்பாகச் சேமிக்கப்படும்.</p>
          </div>
          <form
            className="login-card"
            onSubmit={async (event) => {
              event.preventDefault();
              const cleanedName = name.trim();
              if (!cleanedName) {
                notify('⚠️ தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.');
                return;
              }

              const updatedProfile = {
                ...customer.profile,
                name: cleanedName,
                dob: dobInput,
                aadhaarNo: aadhaarInput,
                aadhar: aadhaarInput,
                complete: true
              };

              const updatedCustomerRecord = {
                ...customer,
                name: cleanedName,
                dob: dobInput,
                aadhaarNo: aadhaarInput,
                aadhar: aadhaarInput,
                profile: updatedProfile
              };

              updateCustomer(() => updatedCustomerRecord);
              if (typeof saveCustomerProfileCloud === 'function') {
                await saveCustomerProfileCloud(customer.phone, updatedCustomerRecord);
              }
              notify('🎉 உங்கள் பெயர், பிறந்த தேதி மற்றும் ஆதார் எண் வெற்றிகரமாக சேமிக்கப்பட்டது!');
            }}
          >
            <div className="login-icon"><UserRound size={24} /></div>
            <span className="section-kicker">YOUR DETAILS / உங்கள் விவரங்கள்</span>
            <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '4px 0 6px' }}>வாடிக்கையாளர் விவரங்கள்</h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              இந்த விவரங்கள் உங்கள் வாடிக்கையாளர் கணக்கில் மற்றும் AkEsevai நிர்வாகத்தில் மட்டுமே பாதுகாப்பாக இருக்கும்.
            </p>

            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
              1. Full Name / முழு பெயர் *
              <input
                className="admin-password"
                autoFocus
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="உதாரணம்: K. Ramesh"
                style={{ width: '100%', marginTop: '4px', padding: '10px', fontSize: '13.5px', fontWeight: 700 }}
              />
            </label>

            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
              2. Date of Birth / பிறந்த தேதி (DOB) *
              <input
                type="date"
                className="admin-password"
                required
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                style={{ width: '100%', marginTop: '4px', padding: '10px', fontSize: '13.5px', fontWeight: 700 }}
              />
            </label>

            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '16px', textTransform: 'uppercase' }}>
              3. Aadhaar Number / 12-இலக்க ஆதார் எண் *
              <input
                type="text"
                maxLength="14"
                className="admin-password"
                required
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value)}
                placeholder="5678 9012 3456"
                style={{ width: '100%', marginTop: '4px', padding: '10px', fontSize: '13.5px', fontWeight: 700 }}
              />
            </label>

            <button className="button button-primary button-wide" type="submit" style={{ padding: '12px', fontSize: '13px', fontWeight: 800 }}>
              சேமித்து உள்நுழைக / Save Profile & Continue <ArrowRight size={17} />
            </button>
          </form>
        </section>
      );
    }

    const tabs = [
      ['overview', lang === 'ta' ? '📊 முகப்பு பலகை' : '📊 Dashboard'],
      ['applications', lang === 'ta' ? '📋 எனது விண்ணப்பங்கள்' : '📋 My Applications'],
      ['documents', lang === 'ta' ? '📁 எனது ஆவணங்கள்' : '📁 My Documents'],
      ['token-slip', lang === 'ta' ? '🎟️ முன்னுரிமை டோக்கன்' : '🎟️ Priority Token'],
      ['compressor', lang === 'ta' ? '📸 போட்டோ அமுக்கி' : '📸 Photo Compressor'],
      ['profile-settings', lang === 'ta' ? '👤 சுயவிவரம் & அமைப்புகள்' : '👤 Profile & Settings']
    ];

    const rawApps = customer.applications || [];
    const applicationsMap = new Map();
    rawApps.forEach((a) => {
      if (!a) return;
      const key = String(a.id || a.ackNo || a.name || '').trim();
      if (key && !applicationsMap.has(key)) {
        applicationsMap.set(key, a);
      }
    });
    const applications = Array.from(applicationsMap.values());
    const addApplication = (event) => {
      event.preventDefault();
      if (!selectedService) return;
      
      const existingApp = (customer.applications || []).find(
        (a) => a && a.name && a.name.trim().toLowerCase() === selectedService.trim().toLowerCase()
      );
      
      if (existingApp) {
        setSelectedService('');
        setActiveTab('documents');
        notify(`ℹ️ "${selectedService}" சேவை ஏற்கனவே சேர்க்கப்பட்டுள்ளது! (${existingApp.id})`);
        return;
      }

      const service = serviceCatalog.find(([tamil, title]) => 
        tamil === selectedService || 
        title === selectedService || 
        `${tamil} (${title})` === selectedService ||
        selectedService.includes(tamil) || 
        selectedService.includes(title)
      );
      const requirements = getRequiredDocuments(selectedService, service?.[2]);
      const application = {
        id: `AK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        name: selectedService,
        status: 'Submitted',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        progress: 22,
        requirements
      };
      
      updateCustomer((current) => ({
        ...current,
        applications: [application, ...(current.applications || [])]
      }));
      setSelectedService('');
      setActiveTab('documents');
      notify('🎉 Service selected!');
    };

    const handleSaveSelfProfile = async () => {
      const updatedProfile = {
        ...customer.profile,
        name: editName || customer.profile.name,
        dob: editDob,
        aadhaarNo: editAadhaar,
        aadhar: editAadhaar
      };
      const updatedCustomerRecord = {
        ...customer,
        name: editName || customer.profile.name,
        dob: editDob,
        aadhaarNo: editAadhaar,
        aadhar: editAadhaar,
        profile: updatedProfile
      };

      updateCustomer(() => updatedCustomerRecord);
      if (typeof saveCustomerProfileCloud === 'function') {
        await saveCustomerProfileCloud(customer.phone, updatedCustomerRecord);
      }
      notify('✅ உங்கள் கணக்கு சுயவிவரம் புதுப்பிக்கப்பட்டது! (Profile updated)');
    };

    const handleDeleteSelfAccount = async () => {
      const confirmDelete = window.confirm(
        `⚠️ எச்சரிக்கை! உங்கள் கணக்கு (+91 ${customer.phone}) மற்றும் பதிவேற்றப்பட்ட ஆவணங்கள் அனைத்தும் நிரந்தரமாக நீக்கப்படும்!\n\nநிச்சயமாக உங்கள் வாடிக்கையாளர் கணக்கை நீக்க விரும்புகிறீர்களா? (Are you sure you want to delete your customer account?)`
      );
      if (confirmDelete) {
        const cleanPhone = String(customer.phone).replace(/\D/g, '');
        if (typeof deleteCustomerProfileCloud === 'function') {
          await deleteCustomerProfileCloud(cleanPhone);
        }
        try {
          const rawRecords = localStorage.getItem('akesevai-customer-records') || '{}';
          const records = JSON.parse(rawRecords);
          delete records[cleanPhone];
          delete records[customer.phone];
          localStorage.setItem('akesevai-customer-records', JSON.stringify(records));
          localStorage.setItem('akesevai-customers', JSON.stringify(records));
        } catch (e) {}
        localStorage.removeItem('akesevai-customer-session');
        localStorage.removeItem('AKESEVAI_CUSTOMER');
        notify('🗑️ உங்கள் கணக்கு வெற்றிகரமாக நீக்கப்பட்டது. (Account deleted successfully)');
        logout();
      }
    };

    const handleDeleteCustomerToken = async (tokenNo) => {
      const targetTokNo = tokenNo || customer?.lastToken?.tokenNo;
      if (!targetTokNo) return;

      const confirmDelete = window.confirm(
        `⚠️ உங்கள் டோக்கன் சீட்டை (${targetTokNo}) நிச்சயமாக ரத்து செய்து நீக்க விரும்புகிறீர்களா?\n\n(Are you sure you want to cancel and delete your active token pass ${targetTokNo}?)`
      );
      if (!confirmDelete) return;

      if (typeof deleteTokenBookingCloud === 'function') {
        await deleteTokenBookingCloud(targetTokNo, customer.phone);
      }

      updateCustomer((curr) => {
        const copy = { ...curr };
        delete copy.lastToken;
        return copy;
      });

      notify(`🗑️ டோக்கன் ${targetTokNo} வெற்றிகரமாக ரத்து செய்யப்பட்டது! (Token ${targetTokNo} deleted successfully)`);
    };

    const getActiveUploadedDocsCount = () => {
      const custDocs = customer.documents || [];
      const custApps = customer.applications || [];

      if (custApps.length === 0) {
        const uniqueMap = new Map();
        custDocs.forEach(d => {
          if (d) {
            const k = d.requirement || d.name || d.id;
            if (k) uniqueMap.set(k, d);
          }
        });
        return uniqueMap.size;
      }

      const allReqs = new Set();
      custApps.forEach(app => {
        (app.requirements || []).forEach(r => allReqs.add(r));
      });

      let uploadedCount = 0;
      allReqs.forEach(req => {
        const hasDoc = custDocs.some(item =>
          item && (
            item.requirement === req ||
            (item.requirement && req && item.requirement.trim().toLowerCase() === req.trim().toLowerCase()) ||
            (item.name && req && item.name.trim().toLowerCase().includes(req.trim().toLowerCase()))
          )
        );
        if (hasDoc) uploadedCount++;
      });

      return uploadedCount;
    };

    const uploadedCount = getActiveUploadedDocsCount();
    const initials = (customer.profile.name || 'C').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    return (
      <section className="customer-dashboard page-width">
        <div className="dashboard-top">
          <div><span className="section-kicker">PRIVATE CUSTOMER PORTAL</span><h1>Welcome, <em>{customer.profile.name}.</em></h1><p>Only the services, applications and documents for +91 {customer.phone} are shown here.</p></div>
          <div className="profile-pill">
            <span className="avatar">{initials}</span>
            <span><strong>{customer.profile.name}</strong><small>Mobile: {customer.phone}</small></span>
            <button
              type="button"
              id="customer-dashboard-home-btn"
              className="customer-dashboard-home-btn"
              onClick={() => typeof navigate === 'function' ? navigate('home') : (window.location.href = '/')}
              title="முகப்புக்குத் திரும்பு / Back to Home"
            >
              <Home size={14} /> முகப்பு (Home)
            </button>
            <button className="logout-button" onClick={logout}><LogOut size={14} /> Logout</button>
          </div>
        </div>
        <div className="dashboard-tabs">
          {tabs.map(([id, label]) => <button className={activeTab === id ? 'tab-active' : ''} onClick={() => setActiveTab(id)} key={id}>{label}{id === 'documents' && <span className="tab-count">{uploadedCount}</span>}</button>)}
          <button
            className="notification-button"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative', cursor: 'pointer' }}
            title="Click to view notifications"
          >
            <Bell size={18} />
            <i />
          </button>
        </div>

        {/* NOTIFICATIONS CENTER MODAL */}
        {showNotifications && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowNotifications(false)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '520px',
                width: '100%',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                border: '1.5px solid #cbd5e1'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: '#eff6ff', color: '#0052cc', padding: '10px', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                    <Bell size={22} />
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>🔔 அறிவிப்புகள் மையம் (Notifications)</h3>
                    <small style={{ color: '#64748b', fontSize: '12px' }}>உங்கள் கணக்கின் நேரடி தகவல்கள்</small>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', fontWeight: 900, color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Check size={20} color="#16a34a" />
                  <div>
                    <strong style={{ fontSize: '13px', color: '#166534', display: 'block' }}>அறிவிப்புகள் நேரலையில் இயங்குகிறது!</strong>
                    <span style={{ fontSize: '12px', color: '#15803d' }}>உங்கள் சான்றிதழ் தயாரானதும் அல்லது நிலைகள் மாறும்போது உடனே தெரிவிக்கப்படும்.</span>
                  </div>
                </div>

                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>📋 {app.name} ({app.id})</strong>
                        <small style={{ fontSize: '12px', color: '#64748b' }}>தற்போதைய நிலை: <span style={{ color: '#0052cc', fontWeight: 700 }}>{app.status || 'Submitted'}</span></small>
                      </div>
                      <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '12px' }}>
                        {app.status === 'Completed' ? 'முடிந்தது' : 'செயல்பாட்டில்'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', color: '#64748b', fontSize: '12.5px' }}>
                    ℹ️ இதுவரை புதிய சேவைகள் எதும் பதிவு செய்யப்படவில்லை.
                  </div>
                )}

                {customer.lastToken && (
                  <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#c2410c', display: 'block' }}>🎫 டோக்கன் சீட்டு பெறப்பட்டது!</strong>
                      <small style={{ fontSize: '12px', color: '#9a3412' }}>Token No: {customer.lastToken.tokenNo} ({customer.lastToken.slot || 'Active'})</small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#ffedd5', color: '#c2410c', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '12px' }}>
                        ACTIVE
                      </span>
                      <button
                        onClick={() => handleDeleteCustomerToken(customer.lastToken.tokenNo)}
                        title="Delete/Cancel Token"
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Trash2 size={12} /> ரத்து செய்
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: '#0052cc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                >
                  அனைத்தும் சரி (Mark as Read)
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'overview' && (
          <>
            <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div
                onClick={() => {
                  const el = document.querySelector('.application-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveTab('documents');
                }}
                style={{ cursor: 'pointer' }}
                title="Click to view My selected services"
              >
                <span className="stat-icon yellow"><FileText /></span>
                <span><strong>{applications.length}</strong><small>My services</small></span>
              </div>

              <div
                onClick={() => setActiveTab('documents')}
                style={{ cursor: 'pointer' }}
                title="Click to open My documents vault"
              >
                <span className="stat-icon green"><Check /></span>
                <span><strong>{uploadedCount}</strong><small>My documents</small></span>
              </div>

              <div
                onClick={() => setActiveTab('token-slip')}
                style={{ cursor: 'pointer' }}
                title="Click to generate Token Slip"
              >
                <span className="stat-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><Ticket /></span>
                <span><strong>{customer.lastToken?.tokenNo || 'Get Token'}</strong><small>Token Slip</small></span>
              </div>
            </div>

            {/* Quick Compressor Promo Card on Overview */}
            <div style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)', color: 'white', borderRadius: '14px', padding: '18px 22px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', boxShadow: '0 8px 20px rgba(2,44,122,0.15)' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#bfdbfe', textTransform: 'uppercase' }}>CUSTOMER PHOTO & DOC TOOL</span>
                <h3 style={{ margin: '2px 0 0', fontSize: '17px', color: 'white' }}>
                  📸 போட்டோ & ஆவண அமுக்கி (Image & Doc Target Size Compressor)
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#cbd5e1' }}>
                  அரசு சேவைகளுக்கு ஏற்றவாறு படத்தை 50KB, 100KB, 200KB வரம்பிற்குள் சுருக்கலாம்!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('compressor')}
                style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}
              >
                <Camera size={16} /> அமுக்கி திறக்க (Open Compressor)
              </button>
            </div>

            <div className="dashboard-columns">
              <div className="application-panel">
                <div className="panel-heading">
                  <div><span className="section-kicker">YOUR ACTIVITY</span><h2>My selected services</h2></div>
                  <button className="text-button" onClick={() => setActiveTab('token-slip')}>Get Token Slip <Ticket size={15} /></button>
                </div>
                {applications.length ? applications.map((application) => (
                  <ApplicationRow
                    application={application}
                    customerDocs={customer.documents}
                    key={application.id}
                  />
                )) : <p className="empty-customer-state">No service selected yet. Choose a service to see its required documents.</p>}
              </div>
              <div className="quick-panel">
                <span className="section-kicker">SELECT A SERVICE</span><h2>Start your request</h2><p>We will show only the documents required for the service you choose.</p>
                <form onSubmit={addApplication}>
                  <select value={selectedService} onChange={(event) => setSelectedService(event.target.value)} required>
                    <option value="">Select a service</option>
                    {serviceCatalog.map(([, title]) => <option key={title}>{title}</option>)}
                  </select>
                  <button className="button button-primary button-wide" type="submit">Continue to documents <ArrowRight size={16} /></button>
                </form>
              </div>
            </div>
          </>
        )}
        {activeTab === 'applications' && (
          <div style={{ marginTop: '20px' }}>
            <div className="application-panel" style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1.5px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="section-kicker">MY ACTIVE SERVICES</span>
                  <h2 style={{ margin: '4px 0 0', fontSize: '20px', color: '#0f172a' }}>📋 எனது விண்ணப்பங்கள் (My Applications)</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    நீங்கள் விண்ணப்பித்த அரசு சேவைகள் மற்றும் அவற்றின் தற்போதைய நிலைகள்.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  + புதிய சேவை சேர்க்க (Add Service)
                </button>
              </div>

              {applications.length ? (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {applications.map((application) => (
                    <ApplicationRow
                      application={application}
                      customerDocs={customer.documents}
                      key={application.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-customer-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FileText size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ fontWeight: 700, color: '#334155' }}>இதுவரை விண்ணப்பங்கள் எதுவும் சேர்க்கப்படவில்லை.</p>
                  <small style={{ color: '#64748b' }}>முகப்பு பலகையில் இருந்து உங்களுக்குத் தேவையான சேவையைத் தேர்வு செய்யவும்.</small>
                  <div style={{ marginTop: '16px' }}>
                    <button className="button button-primary" onClick={() => setActiveTab('overview')}>
                      சேவையைத் தேர்வு செய்க ➔
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'documents' && <DocumentsTab customer={customer} updateCustomer={updateCustomer} notify={notify} cloudExpiryDocs={cloudExpiryDocs} />}
        {activeTab === 'compressor' && (
          <div className="tab-content" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '20px' }}>
            <GovernmentPhotoCropperTool />
          </div>
        )}
        {activeTab === 'token-slip' && (
          <div className="tab-content" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '20px' }}>
            <TokenPass
              defaultToken={customer.lastToken || null}
              initialName={customer.profile.name || ''}
              initialPhone={customer.phone || ''}
              onTokenSaved={(tok) => {
                if (typeof saveToken === 'function') saveToken(tok);
                updateCustomer((curr) => ({ ...curr, lastToken: tok }));
                notify(`Token ${tok.tokenNo} generated and saved to your customer portal!`);
              }}
              onTokenDeleted={(tokNo) => {
                handleDeleteCustomerToken(tokNo);
              }}
            />
          </div>
        )}

        {activeTab === 'profile-settings' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#0052cc', letterSpacing: '1px', textTransform: 'uppercase' }}>CUSTOMER ACCOUNT SETTINGS</span>
                  <h2 style={{ margin: '4px 0 0', fontSize: '20px', color: '#0f172a' }}>👤 எனது விவரங்கள் & கணக்கு அமைப்புகள்</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    உங்கள் பெயர், பிறந்த தேதி, ஆதார் எண் விவரங்களைப் பார்வையிடலாம் அல்லது புதுப்பிக்கலாம்.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontWeight: 800, fontSize: '11px', display: 'block' }}>வாடிக்கையாளர் பெயர் (Name)</small>
                  <strong style={{ fontSize: '16px', color: '#0f172a', display: 'block', marginTop: '4px' }}>{customer.profile.name}</strong>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontWeight: 800, fontSize: '11px', display: 'block' }}>மொபைல் எண் (Mobile)</small>
                  <strong style={{ fontSize: '16px', color: '#16a34a', display: 'block', marginTop: '4px' }}>+91 {customer.phone}</strong>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontWeight: 800, fontSize: '11px', display: 'block' }}>பிறந்த தேதி (DOB)</small>
                  <strong style={{ fontSize: '16px', color: '#d97706', display: 'block', marginTop: '4px' }}>{customer.profile.dob || customer.dob || 'பதிவாகவில்லை'}</strong>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                  <small style={{ color: '#64748b', fontWeight: 800, fontSize: '11px', display: 'block' }}>ஆதார் எண் (Aadhaar Number)</small>
                  <strong style={{ fontSize: '16px', color: '#0052cc', display: 'block', marginTop: '4px' }}>{customer.profile.aadhaarNo || customer.profile.aadhar || customer.aadhaarNo || customer.aadhar || 'பதிவாகவில்லை'}</strong>
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '18px', marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>✏️ விவரங்களை மாற்று / Update DOB & Aadhaar</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    பெயர் (Name):
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                  </label>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    பிறந்த தேதி (DOB):
                    <input type="date" value={editDob} onChange={(e) => setEditDob(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                  </label>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    ஆதார் எண் (Aadhaar No):
                    <input type="text" maxLength="14" value={editAadhaar} onChange={(e) => setEditAadhaar(e.target.value)} placeholder="12-digit Aadhaar" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px' }} />
                  </label>
                </div>
                <button onClick={handleSaveSelfProfile} style={{ background: '#0052cc', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', marginTop: '12px' }}>
                  💾 விவரங்களை சேமிக்க (Save Profile Changes)
                </button>
              </div>

              {/* DANGER ZONE: DELETE ACCOUNT */}
              <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#dc2626', letterSpacing: '1px', textTransform: 'uppercase' }}>DANGER ZONE</span>
                  <h3 style={{ margin: '2px 0 0', fontSize: '16px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🗑️ கணக்கை நிரந்தரமாக நீக்குக (Delete Customer Account)
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7f1d1d' }}>
                    உங்களுக்கு கணக்கு தேவையில்லையெனில், உங்கள் கணக்கு மற்றும் ஆவணங்களை நிரந்தரமாக நீக்கலாம்.
                  </p>
                </div>
                <button
                  onClick={handleDeleteSelfAccount}
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(220,38,38,0.25)' }}
                >
                  <Trash2 size={15} /> எனது கணக்கை நீக்குக (Delete Account)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BROWSER NOTIFICATION OPT-IN */}
        <div style={{ padding: '0 0 8px' }}>
          <BrowserNotificationOptIn />
        </div>

      </section>
    );
  }

  function ApplicationRow({ application, customerDocs = [] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const appDocs = (customerDocs || []).filter((d) => {
      if (!d) return false;
      const appIdMatch = d.applicationId && application.id && (String(d.applicationId) === String(application.id));
      const appNameMatch = d.requirement && application.requirements && application.requirements.some(r => String(r).toLowerCase().includes(String(d.requirement).toLowerCase()) || String(d.requirement).toLowerCase().includes(String(r).toLowerCase()));
      const reqNameMatch = d.name && application.requirements && application.requirements.some(r => String(r).toLowerCase().includes(String(d.name).toLowerCase()) || String(d.name).toLowerCase().includes(String(r).toLowerCase()));
      return appIdMatch || appNameMatch || reqNameMatch;
    });

    const isAppComplete = appDocs.length > 0 && application.requirements && appDocs.length >= application.requirements.length;

    return (
      <div style={{ marginBottom: '10px', borderRadius: '12px', border: isExpanded ? '2px solid #0052cc' : '1px solid #e2e8f0', overflow: 'hidden', background: '#ffffff', transition: 'all 0.2s ease' }}>
        <div
          className="application-row"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isExpanded ? '#eff6ff' : '#ffffff' }}
          title="Click to view uploaded documents for this service"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`app-icon ${isAppComplete ? 'done' : ''}`} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isAppComplete ? '#dcfce7' : '#fef3c7', color: isAppComplete ? '#16a34a' : '#d97706', display: 'grid', placeItems: 'center' }}>
              {isAppComplete ? <Check size={18} /> : <Clock3 size={18} />}
            </span>
            <span className="app-info">
              <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block' }}>{application.name}</strong>
              <small style={{ fontSize: '12px', color: '#64748b' }}>{application.id} · Started {application.date}</small>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            <span className={`status-text ${application.status?.toLowerCase().replace(' ', '-')}`} style={{ fontWeight: 800, fontSize: '13px', color: isAppComplete ? '#16a34a' : '#d97706', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {application.status || 'Submitted'} {isExpanded ? <ChevronUp size={16} /> : <ChevronRight size={16} />}
            </span>
          </div>
        </div>

        {/* Expandable Document Checklist Section directly below the row */}
        {isExpanded && (
          <div style={{ padding: '14px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <h5 style={{ margin: '0 0 10px', font: '800 13px Manrope', color: '#022c7a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck2 size={16} color="#16a34a" /> 📑 {application.name} — பதிவேற்றப்பட்ட ஆவணங்கள் ({appDocs.length} Files):
            </h5>

            {appDocs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {appDocs.map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #86efac',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                        📄 {doc.requirement || doc.name}
                      </strong>
                      <small style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>
                        File: {doc.name} · Uploaded: {doc.uploadedAt || 'Recently'}
                      </small>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 900 }}>
                      ✓ பதிவேற்றப்பட்டது (Uploaded)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                  இச்சேவைக்கு ஆவணங்கள் எதுவும் இன்னும் பதிவேற்றப்படவில்லை. "My documents" பக்கத்தில் சென்று பதிவேற்றலாம்!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  function DocumentsTab({ customer, updateCustomer, notify, cloudExpiryDocs = [] }) {
    const activeApps = customer.applications && customer.applications.length > 0 ? customer.applications : [{
      id: `AK-${Date.now().toString().slice(-8)}`,
      name: 'Income Certificate',
      status: 'Submitted',
      date: new Date().toLocaleDateString('en-IN'),
      requirements: ['Aadhaar Card', 'Family Card', 'Applicant Photo', 'Salary Certificate']
    }];
    const [applicationId, setApplicationId] = useState(activeApps[0]?.id || '');
    const application = activeApps.find((item) => item.id === applicationId) || activeApps[0];

    const uploadDocument = async (event, requirement) => {
      const file = event.target.files?.[0];
      if (!file || !application) return;

      const fileName = file.name || '';
      const fileExt = fileName.split('.').pop().toLowerCase();
      const validExts = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
      const isAllowedType = validExts.includes(fileExt) || file.type.startsWith('image/') || file.type === 'application/pdf';

      if (!isAllowedType) {
        notify('❌ தவறான கோப்பு வகை (Invalid file format)! தயவுசெய்து PDF அல்லது JPG/PNG கோப்பை மட்டும் பதிவேற்றவும் (Select PDF or JPG/PNG).');
        event.target.value = '';
        return;
      }

      const targetMaxKb = 100;
      const rawKb = Math.round(file.size / 1024);
      const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt);

      // PDF validation: Must be <= 100 KB
      if (!isImage && rawKb > targetMaxKb) {
        notify(`⚠️ கோப்பின் அளவு அதிகம் (${rawKb} KB)! ஆவணத்தின் அளவு கண்டிப்பாக 100 KB-க்குள் மட்டுமே இருக்க வேண்டும். (PDF must be <= 100 KB)`);
        event.target.value = '';
        return;
      }

      if (rawKb > targetMaxKb && isImage) {
        notify(`⏳ கோப்பின் அளவு ${rawKb} KB. 100 KB வரம்பிற்குள் தானாக அமுக்கப்படுகிறது (Auto-compressing image under 100 KB)...`);
      } else {
        notify(`⏳ Processing ${file.name}...`);
      }

      // 1. Read file as Data URL INSTANTLY & Compress Images strictly <= 100 KB!
      const rawDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      if (!rawDataUrl) {
        notify('❌ Failed to read file. Please try again.');
        event.target.value = '';
        return;
      }

      let localDataUrl = rawDataUrl;
      if (isImage) {
        try {
          localDataUrl = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              let w = img.width;
              let h = img.height;
              const maxDim = 800;
              if (w > maxDim || h > maxDim) {
                if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
                else { w = Math.round((w * maxDim) / h); h = maxDim; }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              
              let quality = 0.70;
              let result = canvas.toDataURL('image/jpeg', quality);
              let calcKb = Math.round((result.length * 3) / 4 / 1024);
              
              // Incrementally reduce quality if needed to ensure <= 100 KB
              while (calcKb > 100 && quality > 0.15) {
                quality -= 0.10;
                result = canvas.toDataURL('image/jpeg', quality);
                calcKb = Math.round((result.length * 3) / 4 / 1024);
              }
              resolve(result);
            };
            img.onerror = () => resolve(rawDataUrl);
            img.src = rawDataUrl;
          });
        } catch (e) {
          localDataUrl = rawDataUrl;
        }
      }

      const finalKb = Math.round((localDataUrl.length * 3) / 4 / 1024);
      if (finalKb > targetMaxKb && !isImage) {
        notify(`⚠️ கோப்பின் அளவு அதிகம் (${finalKb} KB)! ஆவணம் 100 KB-க்குள் இருக்க வேண்டும்.`);
        event.target.value = '';
        return;
      }

      // UNIQUE docId ensures EVERY document uploaded by a customer is saved separately!
      const cleanPhone = (customer.phone || 'guest').replace(/\D/g, '');
      const docId = `DOC-${cleanPhone}-${requirement.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}`;
      const documentObj = {
        id: docId,
        applicationId: application.id,
        requirement,
        name: file.name,
        type: file.type || 'File',
        uploadedAt: new Date().toLocaleDateString('en-IN'),
        data: localDataUrl,
        url: localDataUrl,
        customerPhone: customer.phone,
        storagePath: ''
      };

      const existingDocs = customer?.documents || [];
      const filteredDocs = existingDocs.filter(
        (item) =>
          item.id !== docId &&
          !(
            (item.applicationId === application.id || !item.applicationId) &&
            item.requirement &&
            requirement &&
            item.requirement.trim().toLowerCase() === requirement.trim().toLowerCase()
          )
      );

      const updatedCustomerRecord = {
        ...customer,
        documents: [...filteredDocs, documentObj]
      };

      // 1. Update React state immediately with full documentObj for 0ms green card display
      updateCustomer(updatedCustomerRecord);

      // 2. Persist to MongoDB backend and localStorage
      saveExpiryDocumentCloud({
        id: docId,
        applicationId: application.id,
        name: file.name,
        requirement,
        url: localDataUrl,
        data: localDataUrl,
        customerPhone: customer.phone,
        uploadedAt: new Date().toISOString()
      });

      notify(`🎉 UPLOAD SUCCESSFUL! (ஆவணம் வெற்றிகரமாக பதிவேற்றப்பட்டது: ${file.name} - ${finalKb} KB)`);
      try {
        event.target.value = '';
      } catch (e) {}
    };

    const deleteDocument = async (requirement, documentObj) => {
      if (!documentObj) return;
      const docName = documentObj.name || requirement;
      const confirmDelete = window.confirm(`ஆவணம் "${docName}"-ஐ நிச்சயமாக நீக்க விரும்புகிறீர்களா? (Delete uploaded document permanently?)`);
      if (!confirmDelete) return;

      const targetId = documentObj.id || `${application.id}-${requirement}`;

      // 1. Delete from local state instantly without deleting unrelated requirement docs
      updateCustomer((current) => {
        const existingDocs = current.documents || [];
        const filtered = existingDocs.filter(
          (item) =>
            item.id !== targetId &&
            item.data !== documentObj.data &&
            item.name !== documentObj.name
        );
        return {
          ...current,
          documents: filtered
        };
      });

      // 2. Delete from Cloud Firestore & Storage
      try {
        await deleteExpiryDocumentCloud(targetId, customer.phone);
      } catch (err) {
        console.warn('Cloud delete notice:', err);
      }

      notify(`🗑️ ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது! (${docName} deleted permanently from everywhere)`);
    };

    if (!customer.applications.length) return <div className="tab-content"><div className="panel-heading"><div><span className="section-kicker">DOCUMENT VAULT</span><h2>My documents</h2><p>Select a service first. Its required document list will appear here.</p></div></div></div>;

    return (
      <div className="tab-content">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">DOCUMENT VAULT</span>
            <h2>Required documents</h2>
            <p>Only documents required for your selected service can be uploaded, viewed, or deleted.</p>
          </div>
        </div>

        <label className="document-service-select">
          Service
          <select value={applicationId} onChange={(event) => setApplicationId(event.target.value)}>
            {customer.applications.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </label>

        <div className="document-list">
          {application.requirements.map((requirement) => {
            const customerDocs = customer.documents || [];
            const globalExpiryDocs = cloudExpiryDocs || [];
            const cleanPhone = (customer.phone || '').replace(/\D/g, '');

            const document = customerDocs.find(
              (item) =>
                (item.applicationId === application.id || !item.applicationId) &&
                (item.requirement === requirement ||
                item.id === `${application.id}-${requirement}` ||
                (item.requirement && requirement && item.requirement.trim().toLowerCase() === requirement.trim().toLowerCase()))
            ) || globalExpiryDocs.filter(d => {
              const docPhone = (d.customerPhone || '').replace(/\D/g, '');
              const docAppId = d.applicationId || '';
              const matchesPhone = cleanPhone && docPhone && (docPhone === cleanPhone || docPhone.includes(cleanPhone) || cleanPhone.includes(docPhone));
              const matchesApp = !docAppId || docAppId === application.id;
              return matchesPhone && matchesApp;
            }).map(d => ({
              id: d.id || d.url,
              applicationId: d.applicationId,
              requirement: d.requirement || d.title || d.name,
              name: d.name || 'Uploaded Document',
              uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-IN') : 'Recently',
              data: d.url || d.data
            })).find(
              (item) =>
                item.requirement === requirement ||
                item.id === `${application.id}-${requirement}` ||
                (item.requirement && requirement && item.requirement.trim().toLowerCase() === requirement.trim().toLowerCase())
            );

            return (
              <div key={requirement} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '16px', background: document ? '#f0fdf4' : 'white', border: document ? '1.5px solid #86efac' : '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="doc-symbol" style={{ background: document ? '#dcfce7' : '#eff6ff', color: document ? '#16a34a' : '#0052cc' }}>
                    {document ? <FileCheck2 size={20} /> : <FileText size={20} />}
                  </span>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{requirement}</strong>
                    {document ? (
                      <small style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>
                        📄 {document.name} · Uploaded {document.uploadedAt}
                      </small>
                    ) : (
                      <small style={{ fontSize: '12px', color: '#64748b' }}>Required — not uploaded yet</small>
                    )}
                  </div>
                </div>

                {document ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                    <span style={{ background: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}>
                      <Check size={13} /> UPLOAD SUCCESS (வெற்றி)
                    </span>

                    <button className="document-open" onClick={() => handleViewDocument(document)} title="View Document" style={{ background: '#0052cc', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <Eye size={14} /> View (காண்க)
                    </button>

                    <button className="document-open" onClick={() => handleDownloadDocument(document)} title="Download Document" style={{ background: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <Download size={14} /> Download (பதிவிறக்கு)
                    </button>

                    <button onClick={() => deleteDocument(requirement, document)} title="Delete Document" style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <Trash2 size={14} /> Delete (நீக்குக)
                    </button>

                    <label style={{ cursor: 'pointer', fontSize: '11px', color: '#0052cc', fontWeight: 700, textDecoration: 'underline', marginLeft: '4px' }}>
                      Change
                      <input type="file" accept=".pdf,image/jpeg,.jpg,.jpeg" onChange={(event) => uploadDocument(event, requirement)} style={{ display: 'none' }} />
                    </label>
                  </div>
                ) : (
                  <label className="document-upload" style={{ marginLeft: 'auto', background: '#0052cc', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                    📤 Upload PDF / JPG
                    <input type="file" accept=".pdf,image/jpeg,.jpg,.jpeg" onChange={(event) => uploadDocument(event, requirement)} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  export default App;
