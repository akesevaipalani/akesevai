import { useState, useEffect } from 'react';
import { siteConfig } from './config/siteConfig';
import { translations } from './config/translations';
import { publicPages } from './data/pageManifest';
import { getStoredApplications } from './utils/statusStore';
import ServiceCard from './components/ServiceCard';
import NotificationCard from './components/NotificationCard';
import NotificationTables from './components/NotificationTables';
import OtpGate from './components/OtpGate';
import TokenPass from './components/TokenPass';
import StatusTrackPage from './pages/StatusTrackPage';
import TokenGeneratorPage from './pages/TokenGeneratorPage';
import SoftwarePage from './pages/SoftwarePage';
import HeroDocumentShowcase from './components/HeroDocumentShowcase';
import HeroBannerSlider from './components/HeroBannerSlider';
import ServicePhotoSlider from './components/ServicePhotoSlider';
import QuickTokenStatusLookup from './components/QuickTokenStatusLookup';
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
import CustomerReferralCard from './components/CustomerReferralCard';
import GoogleMapEmbed from './components/GoogleMapEmbed';
import SocialMediaFollowWidget from './components/SocialMediaFollowWidget';
import InstallPwaBanner from './components/InstallPwaBanner';
import GovernmentPhotoCropperTool from './components/GovernmentPhotoCropperTool';
import DocumentExpiryTracker from './components/DocumentExpiryTracker';
import PremiumHomeAdShowcase from './components/PremiumHomeAdShowcase';
import AkEsevaiOfficePhotoSlider from './components/AkEsevaiOfficePhotoSlider';
import CustomerEasyGuide from './components/CustomerEasyGuide';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './components/SocialIcons';
import {
  ArrowRight, BadgeCheck, Bell, CalendarDays, Check, ChevronDown, Clock3,
  FileCheck2, FileText, Headphones, Home, IndianRupee, Landmark, LockKeyhole,
  LogIn, Mail, Menu, MessageCircle, Phone, Plus, Search, ShieldCheck, Sparkles,
  UploadCloud, UserRound, Users, X, ClipboardCheck, MapPin, Send, ChevronRight,
  Camera, ExternalLink, FileCog, Megaphone, BriefcaseBusiness, GraduationCap,
  FormInput, Download, ImagePlus, Printer, Trash2, Sun, Contrast, ZoomIn,
  Crop, SlidersHorizontal, Eye, LogOut, Ticket, Volume2
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
  'Income Certificate': ['Aadhaar Card', 'Family Card', 'Income proof or salary certificate', 'Self declaration'],
  'Community Certificate': ['Aadhaar Card', 'Family Card', 'School transfer certificate or community proof', 'Parent or sibling community certificate if available'],
  'Nativity Certificate': ['Aadhaar Card', 'Family Card', 'Address proof', 'School certificate or birth certificate'],
  'Residence Certificate': ['Aadhaar Card', 'Family Card', 'Current address proof'],
  'First Graduate Certificate': ['Aadhaar Card', 'Family Card', 'Degree certificate', 'Sibling education declaration'],
  'Legal Heir Certificate': ['Aadhaar Card', 'Death certificate', 'Family Card', 'Relationship proof for legal heirs'],
  'Old Age Pension': ['Aadhaar Card', 'Family Card', 'Bank Passbook', 'Age proof'],
  'Destitute Widow Pension': ['Aadhaar Card', 'Family Card', 'Husband death certificate', 'Bank Passbook'],
  'Disability Pension': ['Aadhaar Card', 'Disability certificate', 'Family Card', 'Bank Passbook'],
  'Passport Application': ['Aadhaar Card', 'Date of birth proof', 'Address proof', 'Passport-size photo'],
  'New PAN Card': ['Aadhaar Card', 'Date of birth proof', 'Passport-size photo'],
  'PAN Card Correction': ['Existing PAN Card', 'Aadhaar Card', 'Supporting correction proof'],
  'New Smart Card': ['Aadhaar Cards of all family members', 'Address proof', 'Passport-size photo'],
  'Smart Card Address Change': ['Family Card', 'New address proof', 'Aadhaar Card'],
  'Smart Card Name Add or Remove': ['Family Card', 'Aadhaar Card', 'Birth, death, or marriage certificate as applicable'],
  'New Voter Card': ['Aadhaar Card', 'Age proof', 'Address proof', 'Passport-size photo'],
  'Voter Card Correction': ['Voter ID Card', 'Aadhaar Card', 'Correction supporting proof'],
  'Employment Exchange Registration': ['Aadhaar Card', 'Educational certificates', 'Community certificate if applicable', 'Passport-size photo'],
  'Employment Qualification Update': ['Employment registration card', 'New educational certificate', 'Aadhaar Card'],
  'Employment Renewal': ['Employment registration card', 'Aadhaar Card'],
  'e-Shram Card Registration': ['Aadhaar Card', 'Bank Passbook', 'Mobile number'],
  'FSSAI Food Business Registration': ['Aadhaar Card', 'Business address proof', 'Food business details', 'Passport-size photo'],
  'TNPSC Application Support': ['Aadhaar Card', 'Educational certificates', 'Community certificate if applicable', 'Passport-size photo'],
  'Duplicate Mark Sheet Application': ['Aadhaar Card', 'School or college details', 'Police complaint or affidavit if required'],
  'Welfare Board Registration and Renewal': ['Aadhaar Card', 'Bank Passbook', 'Work proof', 'Passport-size photo'],
  'Education Loan Application': ['Aadhaar Card', 'Admission letter', 'Fee structure', 'Bank Passbook'],
  'EPFO Claim Support': ['UAN details', 'Aadhaar Card', 'Bank Passbook', 'PAN Card if applicable'],
  'TN Police Verification Support': ['Aadhaar Card', 'Address proof', 'Passport-size photo'],
};

function getRequiredDocuments(serviceTitle, group) {
  if (serviceDocumentRequirements[serviceTitle]) return serviceDocumentRequirements[serviceTitle];
  if (serviceTitle.includes('Aadhaar')) return ['Aadhaar Card or enrolment ID', 'Registered mobile number', ...(serviceTitle.includes('Address') ? ['New address proof'] : [])];
  if (serviceTitle.includes('Certificate')) return ['Aadhaar Card', 'Family Card', 'Service-specific supporting proof'];
  return documentRequirements[group] || ['Aadhaar Card', 'Supporting document'];
}

const appointmentSlots = Array.from({ length: 14 }, (_, index) => {
  const formatTime = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
  };
  const start = 10 * 60 + index * 30;
  return `${formatTime(start)} - ${formatTime(start + 30)}`;
});

import { isFirebaseConfigured } from './config/firebase';
import { 
  saveCustomerProfileCloud, 
  saveTokenBookingCloud, 
  subscribeApplications, 
  subscribeTokens, 
  subscribeCustomerProfiles,
  recordLoginEventCloud,
  saveLiveQueueCloud,
  saveServiceOfDayCloud,
  syncAllLocalDataToFirebaseCloud,
  uploadFileToFirebaseStorage,
  uploadDataUrlToFirebaseStorage,
  saveExpiryDocumentCloud,
  fetchAllCloudRecords,
  deleteCustomerProfileCloud,
  deleteTokenBookingCloud
} from './utils/firebaseService';

const readCustomerRecords = () => {
  try { return JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}'); } catch { return {}; }
};

const saveCustomerRecord = (record) => {
  const records = readCustomerRecords();
  records[record.phone] = record;
  localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(records));
  saveCustomerProfileCloud(record.phone, record);
};

const readTokenBookings = () => {
  try { return JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]'); } catch { return []; }
};

const persistTokenBooking = (token) => {
  const tokens = readTokenBookings();
  // Avoid exact duplicates by tokenNo
  const updated = [token, ...tokens.filter(t => t.tokenNo !== token.tokenNo)];
  localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(updated));
  saveTokenBookingCloud(token);
  return updated;
};

const adminOnlyPages = new Set(['weblink', 'forms', 'software', 'photo-maker', 'admin']);
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
];

const webLinks = [
  { title: 'Tamil Nadu Government', text: 'Official state government services', href: 'https://www.tn.gov.in/', icon: Landmark },
  { title: 'TNeGA e-Sevai', text: 'தமிழ்நாடு அரசு இ-சேவை', href: 'https://www.tnesevai.tn.gov.in/Index.aspx', icon: Landmark },
  { title: 'CSC Services', text: 'பொது சேவை மையம்', href: 'https://digitalseva.csc.gov.in/', icon: ShieldCheck },
  { title: 'DigiPay Web', text: 'CSC digital payment services', href: 'https://digipayweb.csccloud.in/', icon: IndianRupee },
  { title: 'Tamil Nadu District Portals', text: 'மாவட்ட இணைய தளங்கள்', href: 'https://tndistricts.nic.in/', icon: MapPin },
  { title: 'TNPDS', text: 'பொது விநியோகத் திட்டம்', href: 'https://www.tnpds.gov.in/', icon: FileText },
  { title: 'Voters Service Portal', text: 'வாக்காளர் அட்டை சேவைகள்', href: 'https://voters.eci.gov.in/', icon: Users },
  { title: 'Electoral Roll Search', text: 'வாக்காளர் விபரம் தேடுதல்', href: 'https://electoralsearch.eci.gov.in/', icon: Search },
  { title: 'DigiLocker', text: 'Access your digital documents', href: 'https://www.digilocker.gov.in/', icon: FileCheck2 },
  { title: 'Aadhaar Download', text: 'ஆதார் பதிவிறக்கம்', href: 'https://myaadhaar.uidai.gov.in/', icon: ShieldCheck },
  { title: 'Aadhaar Status', text: 'பதிவு மற்றும் புதுப்பிப்பு நிலை', href: 'https://myaadhaar.uidai.gov.in/CheckAadhaarStatus/en', icon: ClipboardCheck },
  { title: 'Birth & Death Certificate', text: 'பிறப்பு இறப்பு சான்று', href: 'https://www.crstn.org/birth_death_tn/', icon: FileText },
  { title: 'Patta Chitta', text: 'பட்டா சிட்டா', href: 'https://eservices.tn.gov.in/eservicesnew/home.html', icon: Home },
  { title: 'Registration Department', text: 'பதிவுத்துறை', href: 'https://tnreginet.gov.in/portal/', icon: Landmark },
  { title: 'CM Health Insurance', text: 'மருத்துவ காப்பீடு', href: 'https://www.cmchistn.com/', icon: ShieldCheck },
  { title: 'TN Unorganised Workers Board', text: 'அமைப்புசாரா தொழிலாளர்கள் நலவாரியம்', href: 'https://tnuwwb.tn.gov.in/', icon: Users },
  { title: 'UDID Card', text: 'மாற்றுத்திறனாளி அடையாள அட்டை', href: 'https://swavlambancard.gov.in/Applyforudid', icon: BadgeCheck },
  { title: 'PMEGP DIC Loan', text: 'மாவட்ட தொழில் கடன்', href: 'https://kviconline.gov.in/pmegpeportal/pmegphome/index.jsp', icon: IndianRupee },
  { title: 'Jan Samarth Loan', text: 'Government loan schemes', href: 'https://www.jansamarth.in/home', icon: IndianRupee },
  { title: 'PM Kisan', text: 'விவசாயி நலத்திட்டம்', href: 'https://pmkisan.gov.in/', icon: Landmark },
  { title: 'Crop Insurance', text: 'பயிர் காப்பீடு', href: 'https://pmfby.gov.in/csclogin', icon: ShieldCheck },
  { title: 'PAN Aadhaar Linking', text: 'பான் ஆதார் இணைக்க', href: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar', icon: FileCheck2 },
  { title: 'PAN Service Portal', text: 'PAN applications and updates', href: 'https://tinpan.proteantech.in/', icon: FileText },
  { title: 'Train Ticket Booking', text: 'CSC travel service', href: 'https://cscsafar.in/', icon: CalendarDays },
  { title: 'eCourts Services', text: 'இ-கோர்ட் சேவை', href: 'https://services.csccloud.in/ecourt/Default.aspx', icon: Landmark },
  { title: 'Tele Law', text: 'இலவச சட்ட ஆலோசனை', href: 'https://www.tele-law.in/', icon: MessageCircle },
  { title: 'CSC All Payments', text: 'Bill payment services', href: 'https://billpaymentlite.csccloud.in/', icon: IndianRupee },
  { title: 'e-District Certificate Status', text: 'சான்றிதழ் நிலை அறிய', href: 'https://edistricts.tn.gov.in/revenue/status.html', icon: ClipboardCheck },
  { title: 'e-Pettagam', text: 'கல்வி சான்றிதழ் சேமிப்பு', href: 'https://www.epettagam.tn.gov.in/', icon: FileCheck2 },
  { title: 'TNEB Quick Pay', text: 'மின்கட்டணம் செலுத்த', href: 'https://www.tnebnet.org/qwp/qpay', icon: IndianRupee },
  { title: 'TNEB Bill Status', text: 'மின்கட்டண நிலை', href: 'https://www.tnebltd.gov.in/BillStatus/billstatus.xhtml', icon: ClipboardCheck },
  { title: 'TNPSC', text: 'தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம்', href: 'https://www.tnpsc.gov.in/', icon: GraduationCap },
  { title: 'TNPSC Exam Portal', text: 'TNPSC application portal', href: 'https://apply.tnpscexams.in/', icon: GraduationCap },
  { title: 'SSC', text: 'பணியாளர் தேர்வாணையம்', href: 'https://ssc.gov.in/login', icon: BriefcaseBusiness },
  { title: 'UPSC', text: 'மத்திய பணியாளர் தேர்வாணையம்', href: 'https://upsconline.nic.in/', icon: BriefcaseBusiness },
  { title: 'Railway Recruitment Board', text: 'RRB recruitment', href: 'https://www.rrbapply.gov.in/', icon: BriefcaseBusiness },
  { title: 'TNUSRB', text: 'தமிழ்நாடு சீருடைப் பணியாளர் தேர்வாணையம்', href: 'https://www.tnusrb.tn.gov.in/', icon: BriefcaseBusiness },
  { title: 'TN Employment Exchange', text: 'வேலைவாய்ப்பு பதிவு', href: 'https://tnvelaivaaippu.gov.in/Empower/', icon: BriefcaseBusiness },
  { title: 'National Scholarship Portal', text: 'தேசிய கல்வி உதவித்தொகை', href: 'https://scholarships.gov.in/', icon: GraduationCap },
  { title: 'CUET UG', text: 'Common University Entrance Test', href: 'https://cuet.nta.nic.in/', icon: GraduationCap },
  { title: 'JEE Main', text: 'Joint Entrance Examination', href: 'https://jeemain.nta.nic.in/', icon: GraduationCap },
  { title: 'NEET UG', text: 'Medical entrance examination', href: 'https://neet.nta.nic.in/', icon: GraduationCap },
  { title: 'TNEA Admissions', text: 'தமிழ்நாடு பொறியியல் சேர்க்கை', href: 'https://www.tneaonline.org/', icon: GraduationCap },
  { title: 'TN Govt Arts Admissions', text: 'அரசு கலை கல்லூரி சேர்க்கை', href: 'https://www.tngasa.in/', icon: GraduationCap },
  { title: 'Passport Seva', text: 'பாஸ்போர்ட் சேவை', href: 'https://www.passportindia.gov.in/psp', icon: FileText },
  { title: 'Udyam Registration', text: 'சிறுதொழில் பதிவு', href: 'https://udyamregistration.gov.in/UdyamRegistration.aspx', icon: BriefcaseBusiness },
  { title: 'GST Portal', text: 'GST services', href: 'https://www.gst.gov.in/', icon: FileText },
  { title: 'FSSAI FoSCoS', text: 'உணவு பாதுகாப்பு பதிவு', href: 'https://foscos.fssai.gov.in/', icon: FileCheck2 },
  { title: 'Parivahan', text: 'வாகன மற்றும் ஓட்டுநர் சேவைகள்', href: 'https://parivahan.gov.in/', icon: Home },
  { title: 'e-Challan', text: 'போக்குவரத்து அபராதம்', href: 'https://echallan.parivahan.gov.in/index/accused-challan', icon: ClipboardCheck },
  { title: 'TN Police Citizen Portal', text: 'தமிழ்நாடு காவல்துறை', href: 'https://www.police.tn.gov.in/citizenportal', icon: ShieldCheck },
  { title: 'Cyber Crime Portal', text: 'இணையக் குற்றப் புகார்', href: 'https://cybercrime.gov.in/', icon: ShieldCheck },
  { title: 'Jeevan Pramaan', text: 'ஆயுள் சான்று', href: 'https://jeevanpramaan.gov.in/v1.0/', icon: FileCheck2 },
  { title: 'EPFO Main Page', text: 'EPFO services', href: 'https://www.epfindia.gov.in/site_en/index.php', icon: FileText },
  { title: 'UMANG', text: 'All government services', href: 'https://web.umang.gov.in/landing/', icon: Landmark },
  { title: 'Income Tax', text: 'வருமான வரித்துறை', href: 'https://www.incometax.gov.in/iec/foportal/', icon: FileText },
  { title: 'ABHA Card', text: 'மருத்துவ சுகாதார அட்டை', href: 'https://abha.abdm.gov.in/abha/v3/', icon: ShieldCheck },
  { title: 'Remove Background', text: 'Online photo tool', href: 'https://www.remove.bg/', icon: Camera },
  { title: 'Online OCR', text: 'Image to Word converter', href: 'https://www.onlineocr.net/', icon: FileText },
  { title: 'iLovePDF', text: 'Merge, split and compress PDF', href: 'https://www.ilovepdf.com/', icon: FileCog },
  { title: 'QR Code Generator', text: 'Create QR codes', href: 'https://me-qr.com/', icon: ImagePlus },
  { title: 'Resume Maker', text: 'Create a professional resume', href: 'https://eformvle.com/free-resume-bio-maker', icon: FileText },
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

function App() {
  const [page, setPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('akesevai-lang') || 'ta');
  const [customer, setCustomer] = useState(() => {
    const phone = sessionStorage.getItem(CUSTOMER_SESSION_KEY);
    return phone ? readCustomerRecords()[phone] || null : null;
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const [toast, setToast] = useState('');
  const [tokenBookings, setTokenBookings] = useState(() => readTokenBookings());
  const [customerRecords, setCustomerRecords] = useState(() => readCustomerRecords());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(true);
  const [isDark, setIsDark] = useDarkMode();

  const t = translations[lang] || translations.en;

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    syncAllLocalDataToFirebaseCloud();

    fetchAllCloudRecords().then((cloudData) => {
      if (cloudData) {
        if (cloudData.customers && Object.keys(cloudData.customers).length) setCustomerRecords(cloudData.customers);
        if (cloudData.tokens && cloudData.tokens.length) setTokenBookings(cloudData.tokens);
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
        const activePhone = sessionStorage.getItem(CUSTOMER_SESSION_KEY);
        if (activePhone && cloudProfiles[activePhone]) {
          setCustomer(cloudProfiles[activePhone]);
        }
      }
    });

    return () => {
      unsubscribeTokens();
      unsubscribeProfiles();
    };
  }, []);

  const toggleLang = () => {
    const nextLang = lang === 'ta' ? 'en' : 'ta';
    setLang(nextLang);
    localStorage.setItem('akesevai-lang', nextLang);
    notify(nextLang === 'ta' ? 'தமிழ் மொழிக்கு மாற்றப்பட்டது' : 'Language switched to English');
  };

  const menuItems = [
    ['home', t.home],
    ['services', t.services],
    ['status-track', t.statusTrack],
    ['token-generator', t.tokenSlip],
    ['notifications', t.notifications],
    ['about', t.about],
    ['contact', t.contact],
  ];

  const saveToken = (token) => {
    const updated = persistTokenBooking(token);
    setTokenBookings(updated);
  };

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  const loginCustomer = (phone) => {
    const records = customerRecords || readCustomerRecords();
    const isNew = !records[phone];
    const record = records[phone] || {
      phone,
      profile: { name: '', createdAt: new Date().toISOString(), complete: false },
      applications: [],
      documents: [],
      appointment: { date: '', time: '' },
    };
    saveCustomerRecord(record);
    sessionStorage.setItem(CUSTOMER_SESSION_KEY, phone);
    setCustomer(record);
    setCustomerRecords((prev) => ({ ...prev, [phone]: record }));

    recordLoginEventCloud({
      type: 'customer_login',
      phone,
      isNewCustomer: isNew,
      profileName: record.profile?.name || 'Customer'
    });

    setIsFirstTimeLogin(isNew);
    setShowFirstLoginModal(true);
    notify(isNew ? 'Account created. Your details will be saved for your next login.' : 'Welcome back. Your saved details are ready.');
  };

  const updateCustomer = (updater) => {
    setCustomer((current) => {
      const updated = typeof updater === 'function' ? updater(current) : updater;
      saveCustomerRecord(updated);
      setCustomerRecords((prev) => ({
        ...prev,
        [updated.phone]: updated
      }));
      return updated;
    });
  };

  const logoutCustomer = () => {
    sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
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
    <div className="app-shell">
      <WelcomeSplashIntro />
      <CustomerLogoutModal
        isOpen={showLogoutModal}
        onClose={() => {
          setShowLogoutModal(false);
          navigate('home');
        }}
      />
      <FirstTimeLoginModal isOpen={showFirstLoginModal} isFirstTime={isFirstTimeLogin} customerName={customer?.profile?.name} onClose={() => setShowFirstLoginModal(false)} />
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label="AkEsevai home">
            <img src="/logo.png" alt="AkEsevai Logo" className="brand-logo-img" />
            <div className="brand-text-wrap">
              <strong className="brand-name">
                Ak <span className="brand-highlight">e-Sevai</span>
              </strong>
              <small className="brand-tagline">
                உங்கள் நம்பிக்கைக்குரிய இ-சேவை மையம்
              </small>
            </div>
          </button>

          <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'}>
            {menuItems.map(([id, label]) => (
              <button 
                key={id} 
                className={page === id ? 'nav-active' : ''} 
                onClick={() => { navigate(id); setMenuOpen(false); }}
              >
                {label}
              </button>
            ))}
            
            {/* Mobile Drawer Quick Action Links */}
            <div className="mobile-menu-actions">
              <button 
                className="nav-btn-customer" 
                onClick={() => { navigate('customer'); setMenuOpen(false); }}
              >
                <UserRound size={16} /> {t.customerPortal}
              </button>

              <button 
                className="nav-btn-admin" 
                onClick={() => { navigate('admin'); setMenuOpen(false); }}
              >
                <LockKeyhole size={15} /> {t.admin}
              </button>
            </div>
          </nav>

          <div className="header-actions-right">
            <DarkModeToggle isDark={isDark} setIsDark={setIsDark} />
            
            <button
              className="lang-switcher-btn"
              onClick={toggleLang}
              title={lang === 'ta' ? 'Switch language to English' : 'தமிழ் மொழிக்கு மாற்றுக'}
            >
              🌐 <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            <button
              className="nav-btn-admin desktop-only-btn"
              onClick={() => navigate('admin')}
              title="Admin Login"
            >
              <LockKeyhole size={13} style={{ color: '#fbbf24' }} /> {t.admin}
            </button>

            <button
              className="nav-btn-customer desktop-only-btn"
              onClick={() => navigate('customer')}
              title="Customer Portal"
            >
              <UserRound size={14} /> {t.customerPortal}
            </button>

            <button 
              className="menu-button" 
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
        <div className="announcement-track"><span>AK ESEVAI • PALANI'S DIGITAL SERVICE PARTNER</span><span>APPOINTMENTS OPEN TODAY • 10:00 AM - 5:00 PM</span><span>DOCUMENTS • CERTIFICATES • WELFARE SCHEMES</span><span>AK ESEVAI • PALANI'S DIGITAL SERVICE PARTNER</span></div>
      </div>

      <main>
        {page === 'home' && <HomePage navigate={navigate} notify={notify} lang={lang} />}
        {page === 'services' && <ServicesPage navigate={navigate} lang={lang} />}
        {page === 'weblink' && (adminLoggedIn ? <WeblinkPage /> : <PrivatePageGate navigate={navigate} />)}
        {page === 'photo-maker' && (adminLoggedIn ? <PhotoMakerPage notify={notify} /> : <PrivatePageGate navigate={navigate} />)}
        {page === 'forms' && (adminLoggedIn ? <FormsPage notify={notify} /> : <PrivatePageGate navigate={navigate} />)}
        {page === 'notifications' && <NotificationsPage lang={lang} />}
        {page === 'software' && (adminLoggedIn ? <SoftwarePage notify={notify} navigate={navigate} /> : <PrivatePageGate navigate={navigate} />)}
        {page === 'whatsapp-poster' && <WhatsappPosterPage notify={notify} />}
        {page === 'status-track' && <StatusTrackPage />}
        {page === 'token-generator' && <TokenGeneratorPage onTokenSaved={saveToken} />}
        {page === 'about' && <AboutPage navigate={navigate} lang={lang} />}
        {page === 'contact' && <ContactPage notify={notify} lang={lang} />}
        {page === 'customer' && !customer && <OtpGate notify={notify} onVerified={loginCustomer} />}
        {page === 'customer' && customer && <CustomerPage customer={customer} updateCustomer={updateCustomer} logout={logoutCustomer} notify={notify} saveToken={saveToken} />}
        {page === 'admin' && <AdminPage loggedIn={adminLoggedIn} login={loginAdmin} logout={logoutAdmin} navigate={navigate} tokenBookings={tokenBookings} customerRecords={customerRecords} notify={notify} />}
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

function HomePage({ navigate, notify, lang }) {
  const t = translations[lang] || translations.en;
  return <>
    <section className="hero">
      <div className="hero-content page-width">
        <div className="eyebrow"><span className="live-dot" /> {t.eyebrow}</div>
        <h1 className={lang === 'ta' ? 'hero-title-tamil' : ''}>{t.heroTitleLine1}<br /><em>{t.heroTitleLine2}</em></h1>
        <p className="hero-copy">{t.heroCopy}</p>
        <div className="hero-actions"><button className="button button-primary" onClick={() => navigate('customer')}>{t.startApp} <ArrowRight size={18} /></button><button className="button button-quiet" onClick={() => navigate('services')}>{t.exploreServices} <ChevronRight size={17} /></button></div>
        <div className="hero-note"><ShieldCheck size={16} /> {t.heroNote}</div>
      </div>
      <div className="hero-visual-showcase-container" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '860px', margin: '20px 0', flexShrink: 1 }}>
        <AkEsevaiOfficePhotoSlider />
      </div>
    </section>

    {/* INSTALL PWA MOBILE APP BANNER */}
    <div className="page-width">
      <InstallPwaBanner />
    </div>

    {/* 🔴 LIVE NOW • நேரலை CENTER QUEUE & WAIT TIME BANNER ON HOMEPAGE FRONT */}
    <div className="page-width">
      <LiveWaitTimeBanner />
    </div>

    {/* ⭐ SERVICE OF THE DAY BANNER - "இன்றைய சிறப்பு சேவை" */}
    <div className="page-width">
      <ServiceOfTheDayBanner navigate={navigate} />
    </div>



    {/* ANIMATED LIVE COUNTER STATS STRIP */}
    <div className="page-width">
      <AnimatedLiveStatsStrip />
    </div>

    {/* GOVERNMENT PASSPORT PHOTO & SIGNATURE CROPPER */}
    <div className="page-width">
      <GovernmentPhotoCropperTool />
    </div>



    {/* TDCOMMONESEVAI STYLE HERO BANNER SLIDER */}
    <div className="page-width">
      <HeroBannerSlider navigate={navigate} />
    </div>

    {/* AADHAAR MARQUEE BANNER ON HOME PAGE */}
    <div className="page-width" style={{ marginTop: '28px', marginBottom: '15px' }}>
      <div className="aadhaar-marquee-box" style={{ margin: '0' }}>
        <marquee scrollamount="4">
          {t.aadhaarMarqueeText}
        </marquee>
      </div>
    </div>

    {/* PREMIUM LOCAL SPONSORED ADVERTISEMENTS SHOWCASE */}
    <div className="page-width">
      <PremiumHomeAdShowcase navigate={navigate} />
    </div>





    {/* SMART AI DOCUMENT VERIFICATION CHECKER WIDGET */}
    <div className="page-width">
      <AiDocumentCheckerWidget navigate={navigate} />
    </div>



    {/* QUICK TOKEN & STATUS LOOKUP TRACKER */}
    <div className="page-width">
      <QuickTokenStatusLookup navigate={navigate} />
    </div>

    {/* SOCIAL MEDIA CHANNELS & FOLLOW WIDGET */}
    <div className="page-width">
      <SocialMediaFollowWidget />
    </div>

    <section className="notifications-section page-width"><div className="section-heading"><div><span className="section-kicker">{t.notificationsKicker}</span><h2>{t.notificationsTitle}</h2></div><button className="text-button" onClick={() => navigate('notifications')}>{t.viewAllNotifications} <ArrowRight size={16} /></button></div><div className="notification-grid">{notifications.map((notification) => <NotificationCard key={notification.title} notification={notification} />)}</div><div className="visitor-counter"><Eye /> <span>{t.totalVisitors}</span><strong>18,472</strong></div></section>


    {/* CITIZEN REVIEWS & TESTIMONIALS AT THE BOTTOM OF HOMEPAGE */}
    <div className="page-width">
      <CustomerTestimonials />
    </div>

    <section className="cta-section page-width"><div className="cta-box"><div><span className="section-kicker">{t.ctaKicker}</span><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><button className="button button-primary" onClick={() => navigate('contact')}>{t.talkToUs} <MessageCircle size={18} /></button></div></section>
  </>;
}

function ServicesPage({ navigate, lang }) {
  const t = translations[lang] || translations.en;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Services');
  const [selectedService, setSelectedService] = useState(null);
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
        {filteredServices.map(([tamil, title, group]) => (
          <article className="catalog-card" key={title}>
            <span className="catalog-icon"><FileText size={19} /></span>
            <span className="catalog-group">{group}</span>
            <h3>{lang === 'ta' ? tamil : title}</h3>
            <p>{lang === 'ta' ? title : tamil}</p>
            <button className="card-link" onClick={() => setSelectedService({ tamil, title, group })}>
              {t.viewDetails} <ArrowRight size={15} />
            </button>
          </article>
        ))}
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
      {selectedService && (
        <ServiceDetail
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onApply={() => navigate('customer')}
        />
      )}
    </PageIntro>
  );
}

function ServiceDetail({ service, onClose, onApply }) { const docs = getRequiredDocuments(service.title, service.group); return <div className="service-modal-backdrop" onClick={onClose}><div className="service-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><span className="catalog-group">{service.group}</span><h2>{service.tamil}</h2><p className="modal-english">{service.title}</p><h3 className="docs-heading">Documents required for this service</h3><div className="document-checklist">{docs.map((doc) => <span key={doc}><Check size={15} /> {doc}</span>)}</div><small className="docs-note">AkEsevai will verify the submitted documents before application submission.</small><button className="button button-primary" onClick={onApply}>Start this application <ArrowRight size={16} /></button></div></div>; }

function WeblinkPage() { const [query, setQuery] = useState(''); const filteredLinks = webLinks.filter((link) => `${link.title} ${link.text}`.toLowerCase().includes(query.toLowerCase())); return <PageIntro kicker="USEFUL WEBLINKS" title="Trusted links, all in one place." text="Open official portals directly from AkEsevai. Search by service name and choose Open to visit the official website."><div className="service-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="🔍 Link-ஐ தேடவும்... Search official links" /><span>{filteredLinks.length} links</span></div><div className="link-grid">{filteredLinks.map((link) => { const Icon = link.icon; return <a className="external-link-card" href={link.href} target="_blank" rel="noreferrer" key={link.title}><span className="link-icon"><Icon /></span><span><strong>{link.title}</strong><small>{link.text}</small></span><span className="open-link">Open <ExternalLink size={14} /></span></a>; })}</div><div className="link-note"><ShieldCheck size={18} /><span>Always check that you are on the official government website before entering personal details.</span></div></PageIntro>; }

function PhotoMakerPage({ notify }) {
  const [photo, setPhoto] = useState('');
  const [copies, setCopies] = useState(8);
  const [paper, setPaper] = useState('A4');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [border, setBorder] = useState(true);
  const [textEnabled, setTextEnabled] = useState(false);
  const [photoText, setPhotoText] = useState('');
  const [margins, setMargins] = useState({ top: 5, bottom: 5, left: 5, right: 5 });
  const [gaps, setGaps] = useState({ horizontal: 2.5, vertical: 2.5 });
  const updateMargin = (key, value) => setMargins({ ...margins, [key]: value });
  const updateGap = (key, value) => setGaps({ ...gaps, [key]: value });
  const clearPhoto = () => { setPhoto(''); setPhotoText(''); notify('Photo cleared.'); };
  const photoStyle = { filter: `brightness(${brightness}%) contrast(${contrast}%)`, transform: `scale(${zoom / 100})` };
  return <PageIntro kicker="PHOTO MAKER SOFTWARE" title="Create your passport photo sheet." text="Upload one photo, adjust the layout, and generate a ready-to-print sheet just like a service centre tool."><div className="photo-tool"><div className="photo-toolbar"><span className="tool-badge"><Camera size={18} /> PHOTO MAKER</span><button className="tool-action" onClick={() => notify('Photo sheet generated.')}>Generate Sheet</button><button className="tool-action" onClick={() => notify('Select the photo area in the preview to crop.')}> <Crop size={15} /> Crop Photo</button><button className="tool-action" onClick={() => notify('Crop applied.')}>Apply Crop</button><button className="tool-action" onClick={() => notify('PDF download is ready for printing.')}> <Download size={15} /> Download PDF</button></div><div className="photo-tool-layout"><aside className="photo-controls"><label className="photo-upload compact-upload"><ImagePlus size={25} /><strong>{photo ? 'Change photo' : 'Upload photo'}</strong><small>JPG or PNG up to 10 MB</small><input type="file" accept="image/png,image/jpeg" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPhoto(URL.createObjectURL(file)); notify('Photo loaded into the sheet.'); } }} /></label><div className="control-section"><strong><SlidersHorizontal size={15} /> Sheet settings</strong><label>Paper<select value={paper} onChange={(event) => setPaper(event.target.value)}><option>A4</option><option>4 x 6 inch</option><option>A5</option></select></label><label>Copies<input type="number" min="1" max="40" value={copies} onChange={(event) => setCopies(Math.max(1, Math.min(40, Number(event.target.value))))} /></label></div><div className="control-section"><strong><Sun size={15} /> Image adjustment</strong><label>Brightness <output>{brightness}%</output><input type="range" min="50" max="150" value={brightness} onChange={(event) => setBrightness(event.target.value)} /></label><label><Contrast size={14} /> Contrast <output>{contrast}%</output><input type="range" min="50" max="150" value={contrast} onChange={(event) => setContrast(event.target.value)} /></label><label><ZoomIn size={14} /> Zoom <output>{zoom}%</output><input type="range" min="70" max="140" value={zoom} onChange={(event) => setZoom(event.target.value)} /></label></div><div className="control-section"><strong>Margins (mm)</strong><div className="mini-input-grid"><label>Top<input type="number" value={margins.top} onChange={(event) => updateMargin('top', event.target.value)} /></label><label>Bottom<input type="number" value={margins.bottom} onChange={(event) => updateMargin('bottom', event.target.value)} /></label><label>Left<input type="number" value={margins.left} onChange={(event) => updateMargin('left', event.target.value)} /></label><label>Right<input type="number" value={margins.right} onChange={(event) => updateMargin('right', event.target.value)} /></label></div></div><div className="control-section"><strong>Gaps (mm)</strong><div className="mini-input-grid"><label>Horizontal<input type="number" step="0.5" value={gaps.horizontal} onChange={(event) => updateGap('horizontal', event.target.value)} /></label><label>Vertical<input type="number" step="0.5" value={gaps.vertical} onChange={(event) => updateGap('vertical', event.target.value)} /></label></div></div><div className="toggle-list"><label><input type="checkbox" checked={border} onChange={(event) => setBorder(event.target.checked)} /> Photo Border</label><label><input type="checkbox" checked={textEnabled} onChange={(event) => setTextEnabled(event.target.checked)} /> Text on Photo</label>{textEnabled && <input className="text-photo-input" value={photoText} onChange={(event) => setPhotoText(event.target.value)} placeholder="Name or ID number" />}</div><div className="tool-footer-actions"><button className="button button-primary" onClick={() => notify(`${copies} photos ready on ${paper} sheet.`)}><Printer size={16} /> Print Photos</button><button className="text-button" onClick={() => notify('Single photo saved as JPEG.')}><Download size={15} /> Save Single Photo (JPEG)</button><button className="text-button" onClick={() => notify('AI background removal requested.')}><Sparkles size={15} /> AI Remove BG</button><button className="clear-photo" onClick={clearPhoto}><Trash2 size={15} /> Clear Photo</button></div></aside><section className="sheet-workspace"><div className="workspace-head"><span><strong>Preview Sheet</strong><small>{paper} · {copies} copies · {margins.top}/{margins.bottom}/{margins.left}/{margins.right} mm margins</small></span><span className="workspace-status">● Ready</span></div><div className={`print-sheet ${paper === 'A5' ? 'paper-a5' : ''}`} style={{ padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`, gap: `${gaps.vertical}px ${gaps.horizontal}px` }}>{Array.from({ length: copies }).map((_, index) => <div className={`sheet-photo ${border ? 'with-border' : ''}`} key={index}>{photo ? <img src={photo} alt={`Photo copy ${index + 1}`} style={photoStyle} /> : <span><Camera size={18} />Upload a photo</span>}{textEnabled && photoText && <small>{photoText}</small>}</div>)}</div><div className="sheet-help"><Crop size={15} /> Photo size: 35 × 45 mm <span>•</span> Adjust controls on the left, then print your sheet</div></section></div></div>
    <PhotoBackgroundRemover />
  </PageIntro>;
}

function FormsPage({ notify }) { const [fileName, setFileName] = useState(''); const [query, setQuery] = useState(''); const [category, setCategory] = useState('All Forms'); const categories = ['All Forms', ...new Set(formsCatalog.map((form) => form[1]))]; const filteredForms = formsCatalog.filter((form) => (category === 'All Forms' || form[1] === category) && form.join(' ').toLowerCase().includes(query.toLowerCase())); return <PageIntro kicker="FORMS & DOWNLOADS" title="Official forms, ready to download." text="Search for a form and download the available official PDF from the TD Common e-Sevai forms collection."><div className="form-count"><FormInput size={18} /> <strong>📋 All Forms</strong><span>{filteredForms.length} forms available</span></div><div className="service-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="🔍 Form-ஐ தேடவும்... Search forms" /><span>{filteredForms.length} results</span></div><div className="category-tabs">{categories.map((item) => <button className={category === item ? 'category-active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="forms-directory">{filteredForms.map(([title, type]) => <FormRow title={title} type={type} notify={notify} key={title} />)}</div><label className="form-dropzone full-dropzone"><UploadCloud size={30} /><strong>{fileName || 'Upload a completed form'}</strong><small>PDF, JPG or PNG up to 10 MB</small><input type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name || '')} />{fileName && <span className="upload-ready"><Check size={14} /> Ready for review</span>}</label></PageIntro>; }
function FormRow({ title, type, notify }) { const sourceLink = tdcscFormLinks[title]; const downloadForm = () => { if (sourceLink) { window.open(toDownloadLink(sourceLink), '_blank', 'noopener,noreferrer'); notify(`${title} download opened.`); return; } notify(`${title} is not yet linked to an official PDF.`); }; return <div className="form-row"><span className="form-icon"><FormInput size={19} /></span><span><strong>{title}</strong><small>{type} · {sourceLink ? 'Official PDF download' : 'PDF link coming soon'}</small></span><button className="icon-button" aria-label={`Download ${title}`} onClick={downloadForm} disabled={!sourceLink}><Download size={17} /></button></div>; }

function NotificationsPage({ lang }) {
  const t = translations[lang] || translations.en;
  return (
    <PageIntro
      kicker={t.notifKicker}
      title={t.notifTitle}
      text={t.notifText}
    >
      <NotificationTables lang={lang} />
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

function WhatsappPosterPage({ notify }) { const [message, setMessage] = useState('AkEsevai - Digital services made simple'); return <PageIntro kicker="WHATSAPP POSTER" title="Create a shareable service poster." text="Add your message, preview a clean poster and share it with your customers or family groups."><div className="poster-maker"><div className="poster-controls"><label>Poster message<textarea rows="4" value={message} onChange={(event) => setMessage(event.target.value)} /></label><button className="button button-primary" onClick={() => notify('Poster preview is ready to share on WhatsApp.')}><Download size={17} /> Download poster</button></div><div className="poster-preview"><div className="poster-logo"><Sparkles size={17} /> AkEsevai</div><div className="poster-lines"><span>YOUR LOCAL</span><strong>{message}</strong><small>Mill Road, Sanmugapuram, Palani - 624601</small><b>93423 18844</b></div><div className="poster-stamp">OPEN<br /><strong>9 AM - 7 PM</strong></div></div></div></PageIntro>; }

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
          <div className="contact-item"><span><Phone /></span><div><small>{t.callUs}</small><a href="tel:9342318844"><strong>93423 18844</strong></a><p>Mon - Sat, 9:00 AM - 7:00 PM</p></div></div>
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
  const [queueCount, setQueueCount] = useState('3 நபர்கள் (In Queue)');
  const [waitTime, setWaitTime] = useState('~ 5 நிமிடங்கள்');
  const [statusText, setStatusText] = useState('🟢 மையம் திறந்துள்ளது (Open Now)');
  const [closedNoticeText, setClosedNoticeText] = useState('மையம் தற்போது மூடப்பட்டுள்ளது');
  const [openTimeText, setOpenTimeText] = useState('Mon–Sat 10:00 AM');
  const [serviceOfDay, setServiceOfDay] = useState('auto');
  const [upiId, setUpiId] = useState('alakesh.kumar7@okhdfcbank');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('akesevai-live-queue-status');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.status) setIsCenterOpen(parsed.status);
        if (parsed.queueCount) setQueueCount(parsed.queueCount);
        if (parsed.waitTime) setWaitTime(parsed.waitTime);
        if (parsed.statusText) setStatusText(parsed.statusText);
        if (parsed.closedNotice) setClosedNoticeText(parsed.closedNotice);
        if (parsed.openTime) setOpenTimeText(parsed.openTime);
        if (parsed.upiId) setUpiId(parsed.upiId);

        const savedSod = localStorage.getItem('akesevai-service-of-day');
        if (savedSod) {
          const parsedSod = JSON.parse(savedSod);
          if (parsedSod.tamil) setServiceOfDay(parsedSod.tamil);
        }
      } catch (e) { }
    }
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
    localStorage.setItem('akesevai-live-queue-status', JSON.stringify(data));
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
      localStorage.removeItem('akesevai-service-of-day');
      saveServiceOfDayCloud(null);
    } else {
      const selectedSodObj = sodCatalog.find(s => s.tamil === serviceOfDay);
      if (selectedSodObj) {
        localStorage.setItem('akesevai-service-of-day', JSON.stringify(selectedSodObj));
        saveServiceOfDayCloud(selectedSodObj);
      }
    }

    window.dispatchEvent(new Event('storage'));
    setMsg('✅ நேரலை மையம் & சிறப்பு சேவை விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!');
    setTimeout(() => setMsg(''), 3500);
  };

  return (
    <div style={{ background: '#f8fafc', border: '2px solid #93c5fd', borderRadius: '16px', padding: '28px', textAlign: 'left', maxWidth: '680px', margin: '0 auto' }}>
      <div className="panel-heading" style={{ marginBottom: '18px' }}>
        <div>
          <span className="section-kicker">LIVE CENTER QUEUE CONTROL</span>
          <h2 style={{ margin: '4px 0 0', color: '#022c7a' }}>⚙️ நேரலை மையம் & UPI நிர்வாகம்</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            கீழேயுள்ள கீழ்தோன்றும் பட்டியலிலிருந்து (Dropdown Select) நேரலை விவரங்களைத் தேர்ந்தெடுத்து உடனுக்குடன் புதுப்பிக்கலாம்.
          </p>
        </div>
      </div>

      {msg && (
        <div style={{ background: '#dcfce7', border: '1.5px solid #86efac', color: '#15803d', padding: '10px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', marginBottom: '18px' }}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
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

        {/* 2. CENTER STATUS LABEL */}
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
          2. நிலை அறிக்கை விவரம் (Status Display Label):
          <select
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #0052cc', borderRadius: '8px', padding: '11px', marginTop: '4px', fontSize: '13.5px', fontWeight: 700, background: 'white', outline: 'none', cursor: 'pointer' }}
          >
            <option value="🟢 மையம் திறந்துள்ளது (Open Now)">🟢 மையம் திறந்துள்ளது (Open Now)</option>
            <option value="🟡 கூட்டம் அதிகமாக உள்ளது (High Rush)">🟡 கூட்டம் அதிகமாக உள்ளது (High Rush - Book Slot)</option>
            <option value="🔴 மதிய உணவு இடைவேளை (Lunch Break)">🔴 மதிய உணவு இடைவேளை (Lunch Break 1:30 - 2:30 PM)</option>
            <option value="🔴 மையம் இன்று விடுமுறை (Closed Today)">🔴 மையம் இன்று விடுமுறை (Closed Today)</option>
            <option value="🟢 டோக்கன் பதிவு வரவேற்கப்படுகிறது (Tokens Open)">🟢 டோக்கன் பதிவு வரவேற்கப்படுகிறது (Tokens Open)</option>
          </select>
        </label>

        {/* 2 & 3. QUEUE COUNT & WAIT TIME DROPDOWNS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            2. வரிசையில் உள்ளவர்கள் (Queue Count):
            <select
              value={queueCount}
              onChange={(e) => setQueueCount(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '11px', marginTop: '4px', fontSize: '13.5px', fontWeight: 700, background: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="0 நபர்கள் (வரிசையில்லை)">0 நபர்கள் (வரிசையில்லை / Empty)</option>
              <option value="1 - 2 நபர்கள் (In Queue)">1 - 2 நபர்கள் (1-2 People)</option>
              <option value="3 நபர்கள் (In Queue)">3 நபர்கள் (3 People)</option>
              <option value="3 - 5 நபர்கள் (In Queue)">3 - 5 நபர்கள் (3-5 People)</option>
              <option value="5 - 10 நபர்கள் (In Queue)">5 - 10 நபர்கள் (5-10 People)</option>
              <option value="10+ நபர்கள் (In Queue)">10+ நபர்கள் (Heavy Queue)</option>
            </select>
          </label>

          <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            3. காத்திருக்கும் நேரம் (Wait Time):
            <select
              value={waitTime}
              onChange={(e) => setWaitTime(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '11px', marginTop: '4px', fontSize: '13.5px', fontWeight: 700, background: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="உடனடி அனுமதி (0 Mins)">உடனடி அனுமதி (Immediate Entry)</option>
              <option value="~ 5 நிமிடங்கள்">~ 5 நிமிடங்கள் (5 Mins)</option>
              <option value="~ 10 நிமிடங்கள்">~ 10 நிமிடங்கள் (10 Mins)</option>
              <option value="~ 15 - 20 நிமிடங்கள்">~ 15 - 20 நிமிடங்கள் (15-20 Mins)</option>
              <option value="~ 30 நிமிடங்கள்">~ 30 நிமிடங்கள் (30 Mins)</option>
              <option value="~ 1 மணி நேரம்">~ 1 மணி நேரம் (1 Hour)</option>
            </select>
          </label>
        </div>

        {/* 4. SERVICE OF THE DAY OVERRIDE */}
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
          4. இன்றைய சிறப்பு சேவைத் தேர்வு (Featured Service of the Day):
          <select
            value={serviceOfDay}
            onChange={(e) => setServiceOfDay(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #d97706', borderRadius: '8px', padding: '11px', marginTop: '4px', fontSize: '13.5px', fontWeight: 800, color: '#92400e', background: '#fffbeb', outline: 'none', cursor: 'pointer' }}
          >
            <option value="auto">🔄 தானாகவே சுழலும் (Automatic Daily Rotation)</option>
            <option value="வருமானச் சான்றிதழ்">📋 வருமானச் சான்றிதழ் (Income Certificate)</option>
            <option value="சாதிச் சான்றிதழ்">🏛️ சாதிச் சான்றிதழ் (Community Certificate)</option>
            <option value="ஆதார் மொபைல் மாற்றம்">📱 ஆதார் மொபைல் மாற்றம் (Aadhaar Mobile Update)</option>
            <option value="புதிய வாக்காளர் அட்டை">🗳️ புதிய வாக்காளர் அட்டை (New Voter Card)</option>
            <option value="TNPSC விண்ணப்பம்">📝 TNPSC விண்ணப்பம் (TNPSC Exam Registration)</option>
            <option value="e-SHRAM CARD">🪪 e-SHRAM CARD (Unorganised Worker Card)</option>
            <option value="புதிய குடும்ப அட்டை">👨‍👩‍👧‍👦 புதிய குடும்ப அட்டை (New Smart Ration Card)</option>
          </select>
        </label>

        {/* 5. UPI ID DROPDOWN & CUSTOM INPUT */}
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
          5. மையத்தின் UPI Payment ID (Target UPI ID):
          <select
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #16a34a', borderRadius: '8px', padding: '11px', marginTop: '4px', fontSize: '13.5px', fontWeight: 800, color: '#022c7a', background: '#f0fdf4', outline: 'none', cursor: 'pointer' }}
          >
            <option value="alakesh.kumar7@okhdfcbank">alakesh.kumar7@okhdfcbank (HDFC Bank Official)</option>
            <option value="9342318844@ybl">9342318844@ybl (Yes Bank PhonePe)</option>
            <option value="9342318844@paytm">9342318844@paytm (Paytm Payments Bank)</option>
            <option value="9342318844@postbank">9342318844@postbank (IPPB India Post)</option>
          </select>
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

function AdminPage({ loggedIn, login, logout, navigate, tokenBookings = [], customerRecords = {}, notify }) {
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');
  const [tokenSearch, setTokenSearch] = useState('');
  const [activeCustomer, setActiveCustomer] = useState('');
  const [adminTab, setAdminTab] = useState('smartdesk');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  if (!loggedIn) return <section className="customer-entry"><div className="login-art"><span className="eyebrow"><span className="live-dot" /> AkEsevai administration</span><h1>Manage customer<br /><em>service requests.</em></h1><p>Review every customer's selected service and their uploaded required documents in one place.</p></div><form className="login-card" onSubmit={(event) => { event.preventDefault(); if (login(password)) setPassword(''); }}><div className="login-icon"><LockKeyhole size={22} /></div><span className="section-kicker">ADMIN ACCESS</span><h2>Sign in to admin panel</h2><p>This area is only for the AkEsevai team.</p><label>Admin password<input className="admin-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" /></label><button className="button button-primary button-wide" type="submit">Open dashboard <ArrowRight size={17} /></button><small className="form-help">Demo password: admin123</small></form></section>;
  const activeRecords = (customerRecords && Object.keys(customerRecords).length > 0) ? customerRecords : readCustomerRecords();
  const customers = Object.values(activeRecords)
    .filter(c => c && (c.phone || c.profile?.name))
    .sort((a, b) => ((b.profile?.createdAt || b.updatedAt || '').localeCompare(a.profile?.createdAt || a.updatedAt || '')));
  
  const matchingCustomers = customers.filter((customer) => {
    const name = customer.profile?.name || 'Customer';
    const phone = customer.phone || '';
    const apps = Array.isArray(customer.applications) ? customer.applications.map((app) => app?.name || '').join(' ') : '';
    return `${name} ${phone} ${apps}`.toLowerCase().includes(query.toLowerCase());
  });

  const selected = matchingCustomers.find((customer) => customer.phone === activeCustomer) || matchingCustomers[0];
  const totalApplications = customers.reduce((total, customer) => total + (Array.isArray(customer.applications) ? customer.applications.length : 0), 0);
  const totalDocuments = customers.reduce((total, customer) => total + (Array.isArray(customer.documents) ? customer.documents.length : 0), 0);
  const filteredTokens = tokenBookings.filter((tok) => {
    const q = tokenSearch.trim().toLowerCase();
    if (!q) return true;
    return (tok.tokenNo || '').toLowerCase().includes(q) || (tok.phone || '').toLowerCase().includes(q) || (tok.customerName || '').toLowerCase().includes(q) || (tok.service || '').toLowerCase().includes(q) || (tok.date || '').toLowerCase().includes(q);
  });

  const handleSaveEditCustomer = async () => {
    if (!editingCustomer) return;
    const cleanOldPhone = editingCustomer.phone.replace(/\D/g, '');
    const cleanNewPhone = editPhone.replace(/\D/g, '') || cleanOldPhone;

    const updatedRecord = {
      ...editingCustomer,
      phone: cleanNewPhone,
      profile: {
        ...(editingCustomer.profile || {}),
        name: editName
      },
      updatedAt: new Date().toISOString()
    };

    if (cleanOldPhone !== cleanNewPhone) {
      await deleteCustomerProfileCloud(cleanOldPhone);
    }
    await saveCustomerProfileCloud(cleanNewPhone, updatedRecord);
    setEditingCustomer(null);
    notify('🎉 Customer profile updated and synced to Firebase Cloud!');
  };

  const handleDeleteCustomer = async (cust) => {
    if (!cust) return;
    const confirmDelete = window.confirm(`Are you sure you want to remove customer "${cust.profile?.name || 'Customer'}" (+91 ${cust.phone}) from Firebase Cloud?`);
    if (confirmDelete) {
      await deleteCustomerProfileCloud(cust.phone);
      notify(`🗑️ Customer ${cust.profile?.name || cust.phone} removed from Firebase database!`);
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
    if (!tok || !tok.tokenNo) return;
    const confirmDelete = window.confirm(`Delete Token ${tok.tokenNo} for ${tok.customerName}?`);
    if (confirmDelete) {
      await deleteTokenBookingCloud(tok.tokenNo);
      notify(`🗑️ Token ${tok.tokenNo} removed!`);
    }
  };

  return (
    <section className="admin-dashboard page-width">
      <div className="dashboard-top">
        <div><span className="section-kicker">ADMIN DASHBOARD</span><h1>Customer <em>requests.</em></h1><p>View submitted services, documents, and token bookings.</p></div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="logout-button" style={{ background: '#0052cc', color: 'white', borderColor: '#0043a8' }} onClick={async () => {
            notify('⏳ Fetching latest data from Firebase Cloud...');
            const cloud = await fetchAllCloudRecords();
            if (cloud) {
              notify('✅ Firebase Cloud sync complete!');
            } else {
              notify('⚡ Using latest synchronized cloud state');
            }
          }}><Sparkles size={14} /> 🔄 Sync Firebase Cloud</button>
          <button className="logout-button" onClick={logout}><LogOut size={14} /> Logout admin</button>
        </div>
      </div>
      <div className="admin-tools">
        <button onClick={() => navigate('weblink')}><ExternalLink size={18} /><span><strong>Weblinks</strong><small>Private service links</small></span></button>
        <button onClick={() => navigate('forms')}><FormInput size={18} /><span><strong>Forms</strong><small>Official PDF downloads</small></span></button>
        <button onClick={() => navigate('software')}><FileCog size={18} /><span><strong>Software</strong><small>AkEsevai tools</small></span></button>
        <button onClick={() => navigate('photo-maker')}><Camera size={18} /><span><strong>Photo Maker</strong><small>Private photo tools</small></span></button>
      </div>
      <div className="dashboard-stats">
        <div><span className="stat-icon yellow"><Users /></span><span><strong>{customers.length}</strong><small>Customers</small></span></div>
        <div><span className="stat-icon blue"><FileText /></span><span><strong>{totalApplications}</strong><small>Service requests</small></span></div>
        <div><span className="stat-icon green"><FileCheck2 /></span><span><strong>{totalDocuments}</strong><small>Uploaded documents</small></span></div>
        <div><span className="stat-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><CalendarDays /></span><span><strong>{tokenBookings.length}</strong><small>Token Bookings</small></span></div>
        <div><span className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><IndianRupee /></span><span><strong>₹{tokenBookings.length * 50}</strong><small>Est. Token Revenue</small></span></div>
      </div>
      <div className="dashboard-tabs" style={{ marginBottom: '24px' }}>
        <button className={adminTab === 'customers' ? 'tab-active' : ''} onClick={() => setAdminTab('customers')}>👥 Customer Requests</button>
        <button className={adminTab === 'tokens' ? 'tab-active' : ''} onClick={() => setAdminTab('tokens')}>🎫 Token Bookings {tokenBookings.length > 0 && <span className="tab-count">{tokenBookings.length}</span>}</button>
        <button className={adminTab === 'smartdesk' ? 'tab-active' : ''} onClick={() => setAdminTab('smartdesk')} style={{ background: adminTab === 'smartdesk' ? '#16a34a' : undefined, color: adminTab === 'smartdesk' ? 'white' : undefined }}>💻 Smart Operator Console</button>
        <button className={adminTab === 'analytics' ? 'tab-active' : ''} onClick={() => setAdminTab('analytics')} style={{ background: adminTab === 'analytics' ? '#7c3aed' : undefined, color: adminTab === 'analytics' ? 'white' : undefined }}>📊 Revenue Analytics</button>
        <button className={adminTab === 'queue' ? 'tab-active' : ''} onClick={() => setAdminTab('queue')} style={{ background: adminTab === 'queue' ? '#0052cc' : undefined, color: adminTab === 'queue' ? 'white' : undefined }}>⚙️ Live Center Queue Control</button>
      </div>

      {editingCustomer && (
        <div style={{ background: '#f8fafc', border: '2px solid #3b82f6', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>✏️ Edit Customer Profile ({editingCustomer.phone})</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ flex: 1, minWidth: '200px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Customer Name:
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }} />
            </label>
            <label style={{ flex: 1, minWidth: '200px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Mobile Phone Number:
              <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '13px', fontWeight: 700 }} />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => setEditingCustomer(null)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSaveEditCustomer} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>💾 Save Changes</button>
          </div>
        </div>
      )}

      {adminTab === 'smartdesk' && (
        <div style={{ marginTop: '10px' }}>
          <AdminSevaiSmartDesk notify={notify} />
        </div>
      )}
      {adminTab === 'analytics' && (
        <div style={{ marginTop: '10px' }}>
          <AdminRevenueDashboard tokenBookings={tokenBookings} />
        </div>
      )}
      {adminTab === 'customers' && (
        <div className="admin-grid">
          <aside className="admin-customers">
            <div className="panel-heading"><div><span className="section-kicker">CUSTOMERS</span><h2>All requests</h2></div></div>
            <div className="service-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer or service" /></div>
            {matchingCustomers.length ? matchingCustomers.map((customer) => <button className={`admin-customer-row ${selected?.phone === customer.phone ? 'admin-customer-active' : ''}`} onClick={() => setActiveCustomer(customer.phone)} key={customer.phone}><span className="avatar">{customer.profile.name.slice(0, 2).toUpperCase()}</span><span><strong>{customer.profile.name}</strong><small>+91 {customer.phone} · {customer.applications.length} services</small></span><ChevronRight size={16} /></button>) : <p className="empty-customer-state">No matching customer requests.</p>}
          </aside>
          <section className="admin-detail">
            {selected ? (() => {
              const liveCustomerMap = customerRecords || {};
              const cleanSelectedPhone = (selected.phone || '').replace(/\D/g, '');
              const profileRecord = liveCustomerMap[cleanSelectedPhone] || liveCustomerMap[selected.phone] || {};
              const globalExpiryDocs = JSON.parse(localStorage.getItem('akesevai_expiry_docs') || '[]');

              const combinedDocs = [
                ...(selected.documents || []),
                ...(profileRecord.documents || []),
                ...globalExpiryDocs.filter((d) => {
                  const docPhone = (d.customerPhone || '').replace(/\D/g, '');
                  return cleanSelectedPhone && docPhone && (docPhone === cleanSelectedPhone || docPhone.includes(cleanSelectedPhone) || cleanSelectedPhone.includes(docPhone));
                }).map(d => ({
                  id: d.id || d.url,
                  requirement: d.requirement || d.title || d.name,
                  name: d.name || 'Uploaded Document',
                  uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-IN') : 'Recently',
                  data: d.url || d.data
                }))
              ];

              const selectedDocs = combinedDocs.reduce((acc, current) => {
                const url = current.data || current.url;
                const name = current.name || current.requirement;
                const exists = acc.find(item => (url && (item.data === url || item.url === url)) || (item.name === name && item.name));
                if (!exists) return acc.concat([{ ...current, data: url || current.data }]);
                return acc;
              }, []);

              return (
                <>
                  <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span className="section-kicker">CUSTOMER DETAILS</span>
                      <h2>{selected.profile.name}</h2>
                      <p>+91 {selected.phone}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => { setEditingCustomer(selected); setEditName(selected.profile.name || ''); setEditPhone(selected.phone || ''); }}
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
                  <h3 className="admin-section-title">Selected services</h3>
                  {selected.applications.length ? selected.applications.map((application) => <div className="admin-service-row" key={application.id}><span className="doc-symbol"><FileText size={17} /></span><span><strong>{application.name}</strong><small>{application.id} · {application.status} · {application.date}</small></span></div>) : <p className="empty-customer-state">No service selected.</p>}
                  <h3 className="admin-section-title">Uploaded documents (வாடிக்கையாளர் பதிவேற்றிய ஆவணங்கள்) — {selectedDocs.length} Files</h3>
                  {selectedDocs.length ? selectedDocs.map((document, idx) => (
                    <div className="admin-service-row" key={document.id || idx} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
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
                        <a className="document-open" href={document.data} target="_blank" rel="noreferrer" title="View Document" style={{ background: '#0052cc', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}>
                          <Eye size={15} /> View (காண்க)
                        </a>
                        <a className="document-open" href={document.data} download={document.name || 'document.pdf'} style={{ background: '#16a34a', color: 'white', borderColor: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }} title="Download Document">
                          <Download size={14} /> Download (பதிவிறக்கு)
                        </a>
                      </div>
                    </div>
                  )) : <p className="empty-customer-state">This customer has not uploaded documents yet.</p>}
                </>
              );
            })() : <div className="empty-customer-state">Customer uploads will appear here after customers select a service and upload documents.</div>}
          </section>
        </div>
      )}
      {adminTab === 'tokens' && (
        <div className="admin-token-bookings">
          <div className="panel-heading" style={{ marginBottom: '16px' }}><div><span className="section-kicker">TOKEN BOOKINGS</span><h2>Appointment Requests & Token Slips</h2><p>Search by Token Number or Phone Number to easily locate token details.</p></div></div>
          <div className="admin-token-search-bar" style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="service-search" style={{ flex: 1, margin: 0 }}><Search size={18} /><input type="text" value={tokenSearch} onChange={(e) => setTokenSearch(e.target.value)} placeholder="🔍 Search by Token No (e.g. TOK-123) or Mobile Number (e.g. 9342318844)..." />{tokenSearch && <button type="button" onClick={() => setTokenSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', fontSize: '12px', color: 'var(--muted)' }}>Clear</button>}</div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{filteredTokens.length} {filteredTokens.length === 1 ? 'Token' : 'Tokens'} found</span>
          </div>
          {tokenBookings.length === 0 ? <div className="empty-customer-state" style={{ padding: '40px', textAlign: 'center' }}><CalendarDays size={36} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>No token bookings yet. Customers who generate a token from the Token Slip page will appear here.</p></div> : filteredTokens.length === 0 ? <div className="empty-customer-state" style={{ padding: '40px', textAlign: 'center' }}><Search size={36} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>No token found matching <strong>"{tokenSearch}"</strong>.</p><small style={{ color: 'var(--muted)' }}>Try searching with Token Number (e.g., TOK-101) or Mobile Number.</small></div> : <div className="token-bookings-table-wrap"><table className="admin-token-table"><thead><tr><th>Token No</th><th>Applicant Name</th><th>Mobile</th><th>Service</th><th>Visit Date</th><th>Time Slot</th><th>WhatsApp Alert</th><th>Technical Status</th><th>Action</th></tr></thead><tbody>{filteredTokens.map((tok) => {
            const waText = encodeURIComponent(`🙏 *வணக்கம் ${tok.customerName}*,\n\nஉங்கள் AkEsevai டோக்கன் *${tok.tokenNo}* உறுதி செய்யப்பட்டது.\nசேவை: ${tok.service}\nதேதி & நேரம்: ${tok.date} (${tok.slot})\n\nAkEsevai மையம், பழனியில் சேவையைப் பெறலாம்.`);
            return (
              <tr key={tok.tokenNo}>
                <td><span className="token-id-badge">{tok.tokenNo}</span></td>
                <td><strong>{tok.customerName}</strong></td>
                <td>+91 {tok.phone}</td>
                <td style={{ maxWidth: '200px' }}>{tok.service}</td>
                <td>{tok.date}</td>
                <td>{tok.slot}</td>
                <td>
                  <a
                    href={`https://wa.me/91${tok.phone.replace(/\D/g, '')}?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: '#25D366', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <MessageCircle size={13} /> WA Alert
                  </a>
                </td>
                <td>
                  <select
                    value={tok.status || 'CHECKED-IN / VERIFIED'}
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
                    <option value="CHECKED-IN / VERIFIED">🟢 VERIFIED / CHECKED-IN (பெறப்பட்டது)</option>
                    <option value="AWAITING VISIT">🟡 AWAITING VISIT (காத்திருப்பில்)</option>
                    <option value="COMPLETED / SERVED">🔵 COMPLETED / SERVED (நிறைவடைந்தது)</option>
                    <option value="NO-SHOW / CANCELLED">🔴 NO-SHOW / CANCELLED (வரவில்லை / ரத்து)</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteToken(tok)}
                    title="Delete Token"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            );
          })}</tbody></table></div>}
        </div>
      )}
      {adminTab === 'queue' && (
        <div style={{ marginTop: '10px' }}>
          <AdminLiveQueueControlForm />
        </div>
      )}
    </section>
  );
}

function CustomerPage({ customer, updateCustomer, logout, notify, saveToken }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState(customer.profile.name?.startsWith('Customer ') ? '' : (customer.profile.name || ''));
  if (!customer.profile.complete) return <section className="customer-entry"><div className="login-art"><span className="eyebrow"><span className="live-dot" /> Customer profile</span><h1>Welcome to<br /><em>AkEsevai.</em></h1><p>Please enter your name once. We will save it with your mobile number for your next login.</p></div><form className="login-card" onSubmit={(event) => { event.preventDefault(); const cleanedName = name.trim(); if (!cleanedName) return; updateCustomer((current) => ({ ...current, profile: { ...current.profile, name: cleanedName, complete: true } })); notify('Your name has been saved. Welcome to your dashboard.'); }}><div className="login-icon"><UserRound size={22} /></div><span className="section-kicker">YOUR DETAILS</span><h2>What is your name?</h2><p>This is visible only in your customer account and to AkEsevai administration.</p><label>Full name<input className="admin-password" autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your full name" /></label><button className="button button-primary button-wide" type="submit">Continue <ArrowRight size={17} /></button></form></section>;
  const tabs = [['overview', 'Overview'], ['documents', 'My documents'], ['token-slip', '🎫 Token Slip']];
  const applications = customer.applications;
  const addApplication = (event) => { event.preventDefault(); if (!selectedService) return; const service = serviceCatalog.find(([, title]) => title === selectedService); const requirements = getRequiredDocuments(selectedService, service?.[2]); const application = { id: `AK-${Date.now().toString().slice(-8)}`, name: selectedService, status: 'Submitted', date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), progress: 22, requirements }; updateCustomer((current) => ({ ...current, applications: [application, ...current.applications] })); setSelectedService(''); setActiveTab('documents'); notify('Service selected. Upload only the required documents for this application.'); };
  const initials = customer.profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <section className="customer-dashboard page-width">
      <div className="dashboard-top">
        <div><span className="section-kicker">PRIVATE CUSTOMER PORTAL</span><h1>Welcome, <em>{customer.profile.name}.</em></h1><p>Only the services, applications and documents for +91 {customer.phone} are shown here.</p></div>
        <div className="profile-pill"><span className="avatar">{initials}</span><span><strong>{customer.profile.name}</strong><small>Mobile: {customer.phone}</small></span><button className="logout-button" onClick={logout}><LogOut size={14} /> Logout</button></div>
      </div>
      <div className="dashboard-tabs">
        {tabs.map(([id, label]) => <button className={activeTab === id ? 'tab-active' : ''} onClick={() => setActiveTab(id)} key={id}>{label}{id === 'documents' && <span className="tab-count">{customer.documents.length}</span>}</button>)}
        <button className="notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
      </div>
      {activeTab === 'overview' && (
        <>
          <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div><span className="stat-icon yellow"><FileText /></span><span><strong>{applications.length}</strong><small>My services</small></span></div>
            <div><span className="stat-icon green"><Check /></span><span><strong>{customer.documents.length}</strong><small>My documents</small></span></div>
            <div><span className="stat-icon" style={{ background: '#fff7ed', color: '#c2410c' }}><Ticket /></span><span><strong>{customer.lastToken?.tokenNo || 'Get Token'}</strong><small>Token Slip</small></span></div>
          </div>
          <div className="dashboard-columns">
            <div className="application-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">YOUR ACTIVITY</span><h2>My selected services</h2></div>
                <button className="text-button" onClick={() => setActiveTab('token-slip')}>Get Token Slip <Ticket size={15} /></button>
              </div>
              {applications.length ? applications.map((application) => <ApplicationRow application={application} key={application.id} />) : <p className="empty-customer-state">No service selected yet. Choose a service to see its required documents.</p>}
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
      {activeTab === 'documents' && <DocumentsTab customer={customer} updateCustomer={updateCustomer} notify={notify} />}
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
          />
        </div>
      )}

      {/* BROWSER NOTIFICATION OPT-IN */}
      <div style={{ padding: '0 0 8px' }}>
        <BrowserNotificationOptIn />
      </div>

      {/* CUSTOMER REFERRAL CARD */}
      <CustomerReferralCard customerName={customer.profile.name || ''} />

    </section>
  );
}

function ApplicationRow({ application }) { return <div className="application-row"><span className={`app-icon ${application.status === 'Completed' ? 'done' : ''}`}>{application.status === 'Completed' ? <Check size={19} /> : <Clock3 size={19} />}</span><span className="app-info"><strong>{application.name}</strong><small>{application.id} · Started {application.date}</small></span><span className={`status-text ${application.status.toLowerCase().replace(' ', '-')}`}>{application.status}</span><span className="row-arrow"><ChevronRight size={17} /></span></div>; }
function DocumentsTab({ customer, updateCustomer, notify }) {
  const [applicationId, setApplicationId] = useState(customer.applications[0]?.id || '');
  const application = customer.applications.find((item) => item.id === applicationId);

  const uploadDocument = async (event, requirement) => { 
    const file = event.target.files?.[0]; 
    if (!file || !application) return; 
    if (file.size > 10 * 1024 * 1024) { 
      notify('❌ Please upload a document smaller than 10 MB.'); 
      return; 
    } 

    notify(`⏳ Uploading ${file.name} to Firebase Storage...`);
    const docRecord = await uploadFileToFirebaseStorage(file, 'customer_documents', customer.phone || 'guest');

    if (docRecord) {
      const documentObj = { 
        id: `${application.id}-${requirement}`, 
        applicationId: application.id, 
        requirement, 
        name: file.name, 
        type: file.type || 'File', 
        uploadedAt: new Date().toLocaleDateString('en-IN'), 
        data: docRecord.url || docRecord.data,
        storagePath: docRecord.storagePath || ''
      }; 

      updateCustomer((current) => {
        const existingDocs = current.documents || [];
        const filtered = existingDocs.filter((item) => item.requirement !== requirement && item.id !== documentObj.id);
        return { 
          ...current, 
          documents: [...filtered, documentObj] 
        };
      }); 

      saveExpiryDocumentCloud({
        id: documentObj.id,
        name: file.name,
        requirement,
        url: docRecord.url || docRecord.data,
        customerPhone: customer.phone,
        uploadedAt: new Date().toISOString()
      });

      notify(`🎉 UPLOAD SUCCESSFUL! (ஆவணம் வெற்றிகரமாக பதிவேற்றப்பட்டது: ${file.name})`); 
    }
  };

  if (!customer.applications.length) return <div className="tab-content"><div className="panel-heading"><div><span className="section-kicker">DOCUMENT VAULT</span><h2>My documents</h2><p>Select a service first. Its required document list will appear here.</p></div></div></div>;
  
  return (
    <div className="tab-content">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">DOCUMENT VAULT</span>
          <h2>Required documents</h2>
          <p>Only documents required for your selected service can be uploaded and viewed.</p>
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
          const globalExpiryDocs = JSON.parse(localStorage.getItem('akesevai_expiry_docs') || '[]');
          const cleanPhone = (customer.phone || '').replace(/\D/g, '');
          const allDocs = [
            ...(customer.documents || []),
            ...globalExpiryDocs.filter(d => {
              const docPhone = (d.customerPhone || '').replace(/\D/g, '');
              return cleanPhone && docPhone && (docPhone === cleanPhone || docPhone.includes(cleanPhone) || cleanPhone.includes(docPhone));
            }).map(d => ({
              id: d.id || d.url,
              requirement: d.requirement || d.title || d.name,
              name: d.name || 'Uploaded Document',
              uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-IN') : 'Recently',
              data: d.url
            }))
          ];

          const document = allDocs.find(
            (item) => item.requirement === requirement || item.id === `${application.id}-${requirement}` || (item.requirement && requirement && item.requirement.toLowerCase() === requirement.toLowerCase())
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
                  <span style={{ background: '#16a34a', color: 'white', padding: '4px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={13} /> UPLOAD SUCCESS
                  </span>

                  <a className="document-open" href={document.data} target="_blank" rel="noreferrer" title="View Document" style={{ background: '#0052cc', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} /> View (காண்க)
                  </a>

                  <a className="document-open" href={document.data} download={document.name || 'document.pdf'} style={{ background: '#16a34a', color: 'white', borderColor: '#15803d', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }} title="Download Document">
                    <Download size={14} /> Download (பதிவிறக்கு)
                  </a>

                  <label style={{ cursor: 'pointer', fontSize: '11px', color: '#0052cc', fontWeight: 700, textDecoration: 'underline', marginLeft: '4px' }}>
                    Change
                    <input type="file" accept=".pdf,image/png,image/jpeg" onChange={(event) => uploadDocument(event, requirement)} style={{ display: 'none' }} />
                  </label>
                </div>
              ) : (
                <label className="document-upload" style={{ marginLeft: 'auto' }}>
                  Upload PDF / JPG
                  <input type="file" accept=".pdf,image/png,image/jpeg" onChange={(event) => uploadDocument(event, requirement)} />
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
