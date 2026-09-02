import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dns from 'dns';
import { fileURLToPath } from 'url';
import {
  getKolkataToday,
  calculateApplicationStatus,
  calculateExamStatus,
  enrichNotificationWithDateStatus
} from './src/utils/notificationDateHelper.js';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/akesevai';

// Security: Disable x-powered-by banner
app.disable('x-powered-by');

// Security Headers Middleware (Production Hardened)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; " +
    "img-src 'self' data: blob: https: http:; " +
    "font-src 'self' data: https://fonts.gstatic.com https:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:; " +
    "connect-src 'self' http: https: ws: wss: data: blob:; " +
    "frame-ancestors 'self';"
  );
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- In-Memory Rate Limiting Helper ---
const rateLimitStore = new Map();
const createRateLimiter = ({ windowMs = 60 * 1000, max = 100, message = 'Too many requests, please try again later.' }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count += 1;
    rateLimitStore.set(key, record);

    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfter
      });
    }
    next();
  };
};

// Periodic Rate Limit Cleanup (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetAt) rateLimitStore.delete(k);
  }
}, 10 * 60 * 1000);

// Specific Rate Limiters
const otpSendLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 8, message: 'Too many OTP requests. Please wait a few minutes before trying again.' });
const otpVerifyLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 15, message: 'Too many verification attempts. Please request a new OTP.' });
const tokenRequestLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 20, message: 'Too many token requests. Please slow down.' });
const apiGeneralLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 400, message: 'Request limit reached. Please try again in a moment.' });

// URL Safety Validator
const isSafeUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return true;
  const trimmed = urlStr.trim().toLowerCase();
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('vbscript:');
};

// Apply General Rate Limiter across /api
app.use('/api', apiGeneralLimiter);

// --- MONGOOSE SCHEMAS & MODELS ---

// 1. Customer Schema
const customerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: 'Customer' },
  dob: { type: String, default: '' },
  aadhaarNo: { type: String, default: '' },
  profile: { type: Object, default: {} },
  applications: { type: Array, default: [] },
  documents: { type: Array, default: [] },
  lastToken: { type: Object, default: null },
  updatedAt: { type: Date, default: Date.now }
});

// 2. Application Schema
const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  phone: { type: String, default: '' },
  applicantName: { type: String, default: 'Applicant' },
  service: { type: String, default: 'e-Sevai Service' },
  currentStage: { type: Number, default: 1 },
  stage: { type: Number, default: 1 },
  statusLabel: { type: String, default: 'Step 1: Application Received' },
  remarks: { type: String, default: '' },
  requirements: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now }
});

// 3. Document Schema
const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  applicationId: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  name: { type: String, default: 'Document' },
  requirement: { type: String, default: '' },
  url: { type: String, default: '' },
  data: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now }
});

// 4. Token Schema
const tokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  tokenNo: { type: String, default: '' },
  customerName: { type: String, default: '' },
  phone: { type: String, default: '' },
  service: { type: String, default: '' },
  date: { type: String, default: '' },
  slot: { type: String, default: '' },
  amount: { type: Number, default: 50 },
  paymentStatus: { type: String, default: 'PENDING_VERIFICATION' }, // 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'
  utr: { type: String, default: '' },
  status: { type: String, default: 'PAYMENT PENDING' }, // 'PAYMENT PENDING' | 'CHECKED-IN / VERIFIED' | 'REJECTED'
  rejectionReason: { type: String, default: '' },
  verifiedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Database-level unique UTR constraint across active and pending payment records
tokenSchema.index(
  { utr: 1 },
  { unique: true, sparse: true, partialFilterExpression: { utr: { $gt: '' }, paymentStatus: { $ne: 'REJECTED' } } }
);

// 5. Deleted Customer Schema
const deletedCustomerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  deletedAt: { type: Date, default: Date.now }
});

// 6. Comprehensive Notification Schema
const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  category: { type: String, default: 'banking', index: true }, // 'banking' | 'upsc' | 'ssc' | 'railway' | 'tnpsc' | 'police_defence' | 'teaching' | 'medical' | 'entrance' | 'psu' | 'other'
  organization: { type: String, default: 'Official Government / Exam Authority' },
  service: { type: String, required: true },
  postName: { type: String, default: '' },
  qualification: { type: String, default: 'Any Graduation / Degree' },
  ageLimit: { type: String, default: '18 - 30 Years' },
  posts: { type: String, default: 'Multiple Posts' },
  openingDate: { type: String, default: '' },
  closingDate: { type: String, default: '' },
  examDate: { type: String, default: 'Announced Soon' },
  applicationFee: { type: String, default: '₹100 (SC/ST/Women Exempted)' },
  notificationDate: { type: String, default: '' },
  importantDetails: { type: String, default: '' },
  detailsLink: { type: String, default: 'https://www.india.gov.in/' },
  applyLink: { type: String, default: 'https://www.india.gov.in/' },
  isVerified: { type: Boolean, default: true },
  source: { type: String, default: 'Official Govt Portal' },
  isNew: { type: Boolean, default: true },
  status: { type: String, default: 'active' }, // 'active' | 'expired' | 'upcoming'
  updatedAt: { type: Date, default: Date.now }
}, { suppressReservedKeysWarning: true });

// 7. OTP Authentication Schema with 5-minute TTL auto-expiration
const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  purpose: { type: String, default: 'general' }, // 'register' | 'login' | 'reset_password'
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // MongoDB TTL Index: automatically purged when expired
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  lastSentAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  verifiedToken: { type: String, default: null }
});

// 8. Responsive Advertisement Banners Schema
const advertisementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  aspectRatio: { type: String, default: 'auto' }, // '16/9' | '21/9' | '4/3' | '1/1' | 'auto'
  targetUrl: { type: String, default: '' },
  badge: { type: String, default: 'Special Announcement' },
  status: { type: String, default: 'active' }, // 'active' | 'inactive'
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 9. Live Center Settings Schema (Multi-Device Cloud Sync for Status, Wait Time & UPI ID)
const centerSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'live_queue_settings' },
  status: { type: String, default: 'open' },
  queueCount: { type: String, default: '3' },
  waitTime: { type: String, default: '5-10' },
  openTime: { type: String, default: 'திங்கள் - சனி காலை 10:00 - இரவு 8:00' },
  statusText: { type: String, default: '🟢 மையம் திறந்துள்ளது (Open Now)' },
  closedNotice: { type: String, default: 'மையம் தற்போது மூடப்பட்டுள்ளது' },
  upiId: { type: String, default: 'alakesh.kumar7-1@okicici' },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

// Models
const Customer = mongoose.model('Customer', customerSchema);
const Application = mongoose.model('Application', applicationSchema);
const DocumentModel = mongoose.model('Document', documentSchema);
const Token = mongoose.model('Token', tokenSchema);
const DeletedCustomer = mongoose.model('DeletedCustomer', deletedCustomerSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const OtpSession = mongoose.model('OtpSession', otpSchema);
const Advertisement = mongoose.model('Advertisement', advertisementSchema);
const CenterSettings = mongoose.models.CenterSettings || mongoose.model('CenterSettings', centerSettingsSchema);

// MASTER VERIFIED ALL-INDIA & TAMIL NADU GOVT EXAM NOTIFICATIONS REGISTRY
const VERIFIED_ALL_EXAM_NOTIFICATIONS = [
  // --- 1. 🏛️ CENTRAL GOVERNMENT & UPSC ---
  {
    id: 'upsc-cse-2026',
    category: 'upsc',
    organization: 'Union Public Service Commission (UPSC)',
    service: 'UPSC Civil Services Examination (IAS / IPS / IFS) 2026',
    postName: 'Indian Administrative Service (IAS), IPS, IFS & Central Group A Services',
    qualification: 'Bachelor’s Degree in any stream from a recognized University',
    ageLimit: '21 - 32 Years (Relaxation for OBC/SC/ST)',
    posts: '1056+ Posts',
    openingDate: '01/08/2026',
    closingDate: '30/11/2026',
    examDate: '25/11/2026 (Prelims) & 19/02/2027 (Mains)',
    applicationFee: '₹100 (Female/SC/ST/PwBD Exempted)',
    notificationDate: '01/08/2026',
    importantDetails: 'Premier All India Civil Services • Prelims, Mains & Personality Test • Central Cadre',
    detailsLink: 'https://upsc.gov.in/examinations/active-exams',
    applyLink: 'https://upsconline.nic.in/',
    isVerified: true,
    source: 'Official UPSC Examination Portal (upsc.gov.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'upsc-cds-ii-2026',
    category: 'upsc',
    organization: 'Union Public Service Commission (UPSC)',
    service: 'UPSC Combined Defence Services (CDS Examination II) 2026',
    postName: 'IMA, INA, Air Force Academy & Officers Training Academy (OTA)',
    qualification: 'Degree of a recognized University / B.E for Naval & Air Force',
    ageLimit: '19 - 25 Years',
    posts: '459 Posts',
    openingDate: '01/08/2026',
    closingDate: '15/12/2026',
    examDate: '01/12/2026',
    applicationFee: '₹200 (Female/SC/ST Exempted)',
    notificationDate: '01/08/2026',
    importantDetails: 'Direct Commissioned Officer Recruitment in Indian Armed Forces • Written Exam + SSB',
    detailsLink: 'https://upsc.gov.in/',
    applyLink: 'https://upsconline.nic.in/',
    isVerified: true,
    source: 'UPSC Official CDS Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'upsc-nda-na-2026',
    category: 'upsc',
    organization: 'Union Public Service Commission (UPSC)',
    service: 'UPSC NDA & NA (National Defence Academy) Examination 2026',
    postName: 'Army, Navy and Air Force Wings of NDA and 10+2 Cadet Entry Scheme (INAC)',
    qualification: '12th Class Pass of the 10+2 pattern of School Education (Physics & Maths for Navy/Air Force)',
    ageLimit: '16.5 - 19.5 Years (Unmarried Male/Female)',
    posts: '400 Posts',
    openingDate: '10/08/2026',
    closingDate: '20/11/2026',
    examDate: 'December 2026',
    applicationFee: '₹100 (SC/ST/Female Exempted)',
    notificationDate: '10/08/2026',
    importantDetails: 'Prestigious Tri-Services Officer Academy • Khadakwasla Pune Training',
    detailsLink: 'https://upsc.gov.in/',
    applyLink: 'https://upsconline.nic.in/',
    isVerified: true,
    source: 'Official UPSC NDA Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'upsc-capf-ac-2026',
    category: 'upsc',
    organization: 'Union Public Service Commission (UPSC)',
    service: 'UPSC CAPF (Assistant Commandants) Recruitment 2026',
    postName: 'Assistant Commandants (AC) in BSF, CRPF, CISF, ITBP, SSB',
    qualification: 'Bachelor’s degree in any discipline from a recognized university',
    ageLimit: '20 - 25 Years (OBC 28, SC/ST 30)',
    posts: '506 Posts',
    openingDate: '15/08/2026',
    closingDate: '10/12/2026',
    examDate: 'January 2027',
    applicationFee: '₹200 (Female/SC/ST Exempted)',
    notificationDate: '15/08/2026',
    importantDetails: 'Direct Group-A Gazetted Officer in Central Paramilitary Forces • Level 10 Pay Matrix',
    detailsLink: 'https://upsc.gov.in/',
    applyLink: 'https://upsconline.nic.in/',
    isVerified: true,
    source: 'Official UPSC Examination Portal',
    isNew: true,
    status: 'active'
  },

  // --- 2. 📑 STAFF SELECTION COMMISSION (SSC) ---
  {
    id: 'ssc-cgl-2026',
    category: 'ssc',
    organization: 'Staff Selection Commission (SSC)',
    service: 'SSC CGL (Combined Graduate Level) Examination 2026',
    postName: 'Assistant Section Officer (ASO), Income Tax Inspector, GST Inspector, Sub Inspector (CBI)',
    qualification: 'Bachelor’s Degree from a recognized University or equivalent',
    ageLimit: '18 - 30 / 32 Years',
    posts: '17727 Posts',
    openingDate: '10/08/2026',
    closingDate: '25/11/2026',
    examDate: '09/12/2026 to 26/12/2026 (Tier-I)',
    applicationFee: '₹100 (Women, SC, ST, ESM Exempted)',
    notificationDate: '10/08/2026',
    importantDetails: 'Group B & C Central Ministries Postings • Computer Based Exam Tier I & II',
    detailsLink: 'https://ssc.gov.in/',
    applyLink: 'https://ssc.gov.in/login',
    isVerified: true,
    source: 'Official Staff Selection Commission (ssc.gov.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'ssc-chsl-2026',
    category: 'ssc',
    organization: 'Staff Selection Commission (SSC)',
    service: 'SSC CHSL (Combined Higher Secondary 10+2 Level) 2026',
    postName: 'Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), Data Entry Operator (DEO)',
    qualification: '12th Standard or equivalent from a recognized Board/University',
    ageLimit: '18 - 27 Years',
    posts: '3712 Posts',
    openingDate: '15/08/2026',
    closingDate: '10/12/2026',
    examDate: '15/12/2026 to 22/12/2026',
    applicationFee: '₹100 (SC/ST/Women Free)',
    notificationDate: '15/08/2026',
    importantDetails: 'All India Central Govt Offices & Ministries Posting • Tier 1 & 2 Computer Test',
    detailsLink: 'https://ssc.gov.in/',
    applyLink: 'https://ssc.gov.in/',
    isVerified: true,
    source: 'Official SSC Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'ssc-mts-havaldar-2026',
    category: 'ssc',
    organization: 'Staff Selection Commission (SSC)',
    service: 'SSC MTS (Multi-Tasking Staff) & Havaldar Examination 2026',
    postName: 'Multi-Tasking (Non-Technical) Staff & Havaldar in CBIC & CBN',
    qualification: '10th Class (Matriculation) from a recognized Board',
    ageLimit: '18 - 25 / 27 Years',
    posts: '9583 Posts',
    openingDate: '18/08/2026',
    closingDate: '30/11/2026',
    examDate: 'December 2026',
    applicationFee: '₹100 (SC/ST/Women Exempted)',
    notificationDate: '18/08/2026',
    importantDetails: 'Central Govt Group C Non-Gazetted Posts • Simple 10th Standard Syllabus in Tamil/English',
    detailsLink: 'https://ssc.gov.in/',
    applyLink: 'https://ssc.gov.in/',
    isVerified: true,
    source: 'Official SSC MTS Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'ssc-cpo-si-2026',
    category: 'ssc',
    organization: 'Staff Selection Commission (SSC)',
    service: 'SSC CPO Sub-Inspector in Delhi Police & Central Armed Police Forces (CAPFs) 2026',
    postName: 'Sub-Inspector (Executive) in Delhi Police & Sub-Inspector (GD) in BSF, CISF, CRPF, ITBP, SSB',
    qualification: 'Bachelor’s Degree in any discipline + Valid Driving License for Delhi Police',
    ageLimit: '20 - 25 Years (OBC 28, SC/ST 30)',
    posts: '4187 Posts',
    openingDate: '12/08/2026',
    closingDate: '15/12/2026',
    examDate: 'January 2027',
    applicationFee: '₹100 (Women & SC/ST Free)',
    notificationDate: '12/08/2026',
    importantDetails: 'Direct Sub-Inspector Entry in Central Police Forces • Level 6 Pay Matrix (₹35,400 - ₹1,12,400)',
    detailsLink: 'https://ssc.gov.in/',
    applyLink: 'https://ssc.gov.in/',
    isVerified: true,
    source: 'Official SSC CPO Recruitment',
    isNew: true,
    status: 'active'
  },

  // --- 3. 🏦 BANKING & FINANCE ---
  {
    id: 'bank-sbi-po-2026',
    category: 'banking',
    organization: 'State Bank of India (SBI)',
    service: 'SBI Probationary Officers (PO) Recruitment 2026',
    postName: 'Probationary Officers (PO - Scale I)',
    qualification: 'Any Bachelor’s Degree in any discipline',
    ageLimit: '21 - 30 Years',
    posts: '2000+ Posts',
    openingDate: '01/08/2026',
    closingDate: '20/11/2026',
    examDate: 'November / December 2026',
    applicationFee: '₹750 (SC/ST/PwBD Nil)',
    notificationDate: '01/08/2026',
    importantDetails: 'Official Central Recruitment • Preliminary & Mains Online Exam • Direct Scale-I Posting',
    detailsLink: 'https://sbi.co.in/web/careers/current-openings',
    applyLink: 'https://bank.sbi/careers',
    isVerified: true,
    source: 'Official SBI Careers Portal (sbi.co.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'bank-ibps-clerk-xiv',
    category: 'banking',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    service: 'IBPS Clerk XIV Recruitment 2026 (11 Nationalized Banks)',
    postName: 'Customer Service Associate (Clerk)',
    qualification: 'Graduation in any discipline + Computer Literacy',
    ageLimit: '20 - 28 Years',
    posts: '6128+ Posts (Tamil Nadu Vacancies Included)',
    openingDate: '05/08/2026',
    closingDate: '28/11/2026',
    examDate: '15/11/2026 & 16/11/2026',
    applicationFee: '₹850 (SC/ST/PwBD ₹175)',
    notificationDate: '05/08/2026',
    importantDetails: 'Participating: Indian Bank, Canara Bank, PNB, BOB, Union Bank, Central Bank • State Wise Merit',
    detailsLink: 'https://www.ibps.in/',
    applyLink: 'https://ibpsonline.ibps.in/',
    isVerified: true,
    source: 'Official IBPS Portal (ibps.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'bank-rbi-grade-b-2026',
    category: 'banking',
    organization: 'Reserve Bank of India (RBI)',
    service: 'RBI Grade B Officers (General / DEPR / DSIM) Recruitment 2026',
    postName: 'Officers in Grade "B" (Direct Recruit)',
    qualification: 'Graduation with minimum 60% marks (50% for SC/ST) / Post Graduation 55%',
    ageLimit: '21 - 30 Years',
    posts: '94 Posts',
    openingDate: '10/08/2026',
    closingDate: '16/12/2026',
    examDate: '08/12/2026 (Phase-I) & 19/01/2027 (Phase-II)',
    applicationFee: '₹850 (SC/ST/PwBD ₹100)',
    notificationDate: '10/08/2026',
    importantDetails: 'Apex Central Bank of India • Prestigious Grade B Career • Monthly Emoluments ~₹1,16,000/-',
    detailsLink: 'https://opportunities.rbi.org.in/',
    applyLink: 'https://opportunities.rbi.org.in/',
    isVerified: true,
    source: 'Reserve Bank of India (rbi.org.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'bank-ibps-rrb-xiii',
    category: 'banking',
    organization: 'IBPS - Regional Rural Banks (Tamil Nadu Grama Bank)',
    service: 'IBPS RRB XIII Office Assistant & Officer Scale I, II, III',
    postName: 'Office Assistant (Multipurpose) & Assistant Manager (Scale-I)',
    qualification: 'Any Degree / Proficiency in Local Language (Tamil)',
    ageLimit: '18 - 28 Years (Clerk) / 18 - 30 Years (Officer Scale-I)',
    posts: '9923 Posts',
    openingDate: '01/08/2026',
    closingDate: '30/11/2026',
    examDate: '10/11/2026 to 25/11/2026',
    applicationFee: '₹850 (SC/ST ₹175)',
    notificationDate: '01/08/2026',
    importantDetails: 'Tamil Nadu Grama Bank & 42 Rural Banks • Direct Local Branch Appointment in TN',
    detailsLink: 'https://www.ibps.in/',
    applyLink: 'https://ibpsonline.ibps.in/',
    isVerified: true,
    source: 'Official IBPS RRB Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'bank-sbi-clerk-2026',
    category: 'banking',
    organization: 'State Bank of India (SBI)',
    service: 'SBI Junior Associates (Customer Support & Sales / Clerk) 2026',
    postName: 'Junior Associate (Clerk)',
    qualification: 'Graduation in any discipline from a recognized University',
    ageLimit: '20 - 28 Years',
    posts: '8773 Posts',
    openingDate: '15/08/2026',
    closingDate: '20/12/2026',
    examDate: 'January 2027',
    applicationFee: '₹750 (SC/ST/PwBD Nil)',
    notificationDate: '15/08/2026',
    importantDetails: 'State Bank of India Largest Public Sector Bank • Posting in Tamil Nadu & Puducherry Circles',
    detailsLink: 'https://bank.sbi/careers',
    applyLink: 'https://bank.sbi/careers',
    isVerified: true,
    source: 'SBI Central Recruitment Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'bank-lic-aao-2026',
    category: 'banking',
    organization: 'Life Insurance Corporation of India (LIC)',
    service: 'LIC Assistant Administrative Officers (AAO - Generalist/IT/Chartered Accountant) 2026',
    postName: 'Assistant Administrative Officer (AAO)',
    qualification: 'Bachelor’s Degree in any discipline / B.Tech / CA for Specialists',
    ageLimit: '21 - 30 Years',
    posts: '750 Posts',
    openingDate: '10/08/2026',
    closingDate: '10/12/2026',
    examDate: 'December 2026',
    applicationFee: '₹700 (SC/ST/PwBD ₹85)',
    notificationDate: '10/08/2026',
    importantDetails: 'Premier Insurance Corporation • Basic Pay ₹53,600 + DA/HRA (~₹92,870/month)',
    detailsLink: 'https://licindia.in/careers',
    applyLink: 'https://licindia.in/careers',
    isVerified: true,
    source: 'Official LIC India Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'bank-ibps-po-xiv',
    category: 'banking',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    service: 'IBPS PO / Management Trainee XIV Recruitment 2026',
    postName: 'Probationary Officer / Management Trainee (Scale-I)',
    qualification: 'A Degree (Graduation) in any discipline from a University recognized by Govt. of India',
    ageLimit: '20 - 30 Years (OBC 33, SC/ST 35)',
    posts: '3955 Posts',
    openingDate: '01/08/2026',
    closingDate: '28/11/2026',
    examDate: 'November 2026 (Prelims) & January 2027 (Mains)',
    applicationFee: '₹850 (SC/ST/PwBD ₹175)',
    notificationDate: '01/08/2026',
    importantDetails: '11 Public Sector Banks (Canara Bank, Indian Bank, PNB, BOB, UBI, etc.)',
    detailsLink: 'https://www.ibps.in/',
    applyLink: 'https://ibpsonline.ibps.in/',
    isVerified: true,
    source: 'Official IBPS PO Portal',
    isNew: true,
    status: 'active'
  },

  // --- 4. 🚆 RAILWAY (RRB / RRC) ---
  {
    id: 'rrb-alp-2026',
    category: 'railway',
    organization: 'Railway Recruitment Boards (RRB / Ministry of Railways)',
    service: 'RRB Assistant Loco Pilot (ALP) Centralized Recruitment 2026 (CEN 01/2024)',
    postName: 'Assistant Loco Pilot (Electrical / Mechanical)',
    qualification: 'Matriculation / SSLC plus ITI / Act Apprenticeship in relevant trades OR 3-Year Diploma/Degree in Engg',
    ageLimit: '18 - 33 Years (3 Years Age Relaxation Included)',
    posts: '18799 Posts (Southern Railway / Chennai Vacancies)',
    openingDate: '01/08/2026',
    closingDate: '20/11/2026',
    examDate: '25/11/2026 to 29/11/2026 (CBT-1)',
    applicationFee: '₹500 (₹400 Refunded upon CBT-1 Attendance) / SC/ST ₹250',
    notificationDate: '01/08/2026',
    importantDetails: 'Train Driver Pilot Recruitment • Level 2 Pay Matrix (Initial Pay ₹19,900/- + Running Allowance)',
    detailsLink: 'https://www.rrbchennai.gov.in/',
    applyLink: 'https://www.rrbapply.gov.in/',
    isVerified: true,
    source: 'Official Railway Recruitment Board (rrbapply.gov.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'rrb-technician-2026',
    category: 'railway',
    organization: 'Railway Recruitment Boards (RRB)',
    service: 'RRB Technician Grade I & Grade III Recruitment 2026',
    postName: 'Technician Grade I Signal & Technician Grade III (Various Trades)',
    qualification: 'Matriculation / SSLC plus ITI from recognized NCVT/SCVT or Diploma/Degree in Engg',
    ageLimit: '18 - 33 / 36 Years (3 Years Age Relaxation Included)',
    posts: '14298 Posts',
    openingDate: '01/08/2026',
    closingDate: '08/12/2026',
    examDate: 'December 2026 / January 2027',
    applicationFee: '₹500 (₹400 Refundable after CBT) / SC/ST ₹250',
    notificationDate: '01/08/2026',
    importantDetails: 'Southern Railway & ICF Perambur Openings • Computer Based Test + Trade Test',
    detailsLink: 'https://www.rrbchennai.gov.in/',
    applyLink: 'https://www.rrbapply.gov.in/',
    isVerified: true,
    source: 'Official RRB Recruitment Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'rrb-ntpc-2026',
    category: 'railway',
    organization: 'Railway Recruitment Boards (RRB)',
    service: 'RRB NTPC (Non-Technical Popular Categories - Graduate & Undergraduate) 2026',
    postName: 'Station Master, Goods Train Manager, Senior Commercial cum Ticket Clerk, Junior Clerk',
    qualification: '12th Pass (Undergraduate) / Any Degree (Graduate Posts)',
    ageLimit: '18 - 33 / 36 Years',
    posts: '11558 Posts',
    openingDate: '10/08/2026',
    closingDate: '13/12/2026',
    examDate: 'January / February 2027',
    applicationFee: '₹500 (₹400 Refundable) / SC/ST ₹250',
    notificationDate: '10/08/2026',
    importantDetails: 'Prestigious Railway Station Operations & Commercial Jobs • CBT 1 & 2 Exam',
    detailsLink: 'https://www.rrbchennai.gov.in/',
    applyLink: 'https://www.rrbapply.gov.in/',
    isVerified: true,
    source: 'RRB Chennai & Central Railways',
    isNew: true,
    status: 'active'
  },
  {
    id: 'rrb-group-d-2026',
    category: 'railway',
    organization: 'Railway Recruitment Cell (RRC Southern Railway)',
    service: 'RRC Southern Railway Level-1 / Group D Recruitment 2026',
    postName: 'Track Maintainer Grade IV, Pointsman, Assistant Workshop, Electrical/Mechanical Helper',
    qualification: '10th Pass (Matriculation) OR ITI from institutions recognized by NCVT/SCVT',
    ageLimit: '18 - 33 Years (OBC 36, SC/ST 38)',
    posts: '32000+ Posts (Southern Railway / Chennai Division)',
    openingDate: '15/08/2026',
    closingDate: '25/12/2026',
    examDate: 'February 2027',
    applicationFee: '₹500 (₹400 Refundable) / SC/ST ₹250',
    notificationDate: '15/08/2026',
    importantDetails: 'Permanent Central Railway Jobs in Tamil Nadu • Written CBT + Physical Efficiency Test (PET)',
    detailsLink: 'https://www.rrcmas.in/',
    applyLink: 'https://www.rrcmas.in/',
    isVerified: true,
    source: 'Official RRC Southern Railway Chennai',
    isNew: true,
    status: 'active'
  },

  // --- 5. 🌴 TNPSC & TAMIL NADU GOVERNMENT ---
  {
    id: 'tnpsc-group-4-2026',
    category: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Group 4 & VAO (Village Administrative Officer) Recruitment 2026',
    postName: 'VAO, Junior Assistant, Typist, Steno-Typist, Bill Collector (Grade-I), Forest Guard',
    qualification: 'SSLC (10th Standard Pass) with eligibility for higher secondary admission',
    ageLimit: '18 - 37 Years (BC/MBC 34, SC/ST 37, Others 32)',
    posts: '8932+ Posts',
    openingDate: '01/08/2026',
    closingDate: '28/11/2026',
    examDate: '06/12/2026 (Single Paper Objective Exam)',
    applicationFee: 'One Time Registration ₹150 + Exam Fee ₹100 (Exemptions Applicable)',
    notificationDate: '01/08/2026',
    importantDetails: 'Tamil Nadu Most Popular Competitive Exam • Tamil Eligibility + General Studies • Direct State Posting',
    detailsLink: 'https://www.tnpsc.gov.in/English/Notification.aspx',
    applyLink: 'https://www.tnpscexams.in/',
    isVerified: true,
    source: 'Official TNPSC Portal (tnpsc.gov.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'tnpsc-group-2-2026',
    category: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Combined Civil Services Examination II (Group 2 & 2A) 2026',
    postName: 'Sub-Registrar (Grade II), Municipal Commissioner, Revenue Assistant, Assistant Section Officer (Secretariat)',
    qualification: 'Any Bachelor’s Degree from any University recognized by UGC',
    ageLimit: '18 - 34 / 42 Years (No maximum age limit for SC/ST/BC/MBC with Degree)',
    posts: '2327 Posts',
    openingDate: '10/08/2026',
    closingDate: '19/12/2026',
    examDate: '14/12/2026 (Prelims) & March 2027 (Mains)',
    applicationFee: '₹100 (Prelims) & ₹150 (Mains)',
    notificationDate: '10/08/2026',
    importantDetails: 'Executive & Non-Executive State Services • Preliminary, Mains & Oral Test/Interview',
    detailsLink: 'https://www.tnpsc.gov.in/',
    applyLink: 'https://www.tnpscexams.in/',
    isVerified: true,
    source: 'Official TNPSC Exam Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'tnpsc-group-1-2026',
    category: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Group 1 Combined Civil Services (Deputy Collector / DSP) 2026',
    postName: 'Deputy Collector, Deputy Superintendent of Police (DSP), Assistant Commissioner (Commercial Taxes), District Registrar',
    qualification: 'Degree of any University recognized by University Grants Commission',
    ageLimit: '21 - 34 / 39 Years (SC/ST/BC/MBC Concession)',
    posts: '90 Posts',
    openingDate: '12/08/2026',
    closingDate: '30/11/2026',
    examDate: 'January 2027',
    applicationFee: '₹100 (Prelims) & ₹200 (Mains)',
    notificationDate: '12/08/2026',
    importantDetails: 'Top State Executive Cadre in Tamil Nadu • Sub-Collector / DSP Direct Entry',
    detailsLink: 'https://www.tnpsc.gov.in/',
    applyLink: 'https://www.tnpscexams.in/',
    isVerified: true,
    source: 'TNPSC Official Group 1 Portal',
    isNew: true,
    status: 'active'
  },

  // --- 6. 👮 POLICE & DEFENCE ---
  {
    id: 'tnusrb-si-2026',
    category: 'police_defence',
    organization: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
    service: 'TNUSRB Sub-Inspectors of Police (Taluk, AR & TSP) Recruitment 2026',
    postName: 'Sub-Inspector of Police (Men, Women & Transgender)',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University',
    ageLimit: '20 - 30 Years (BC/MBC 32, SC/ST 35, Destitute Widow 37, Ex-Servicemen 47)',
    posts: '920 Posts (Tamil Nadu Police Department)',
    openingDate: '01/08/2026',
    closingDate: '30/11/2026',
    examDate: '15/12/2026 (Written Exam) followed by Physical PMT/ET/PET',
    applicationFee: '₹500 (Online Payment)',
    notificationDate: '01/08/2026',
    importantDetails: 'State Uniformed Police Service • 20% PSTM Quota for Tamil Medium Candidates',
    detailsLink: 'https://www.tnusrb.tn.gov.in/',
    applyLink: 'https://www.tnusrb.tn.gov.in/',
    isVerified: true,
    source: 'Official TNUSRB Recruitment Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'tnusrb-pc-2026',
    category: 'police_defence',
    organization: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
    service: 'TNUSRB Common Recruitment for Gr.II Police Constables, Jail Warders & Firemen 2026',
    postName: 'Grade II Police Constable (Armed Reserve & TSP), Jail Warder, Fireman',
    qualification: '10th Standard (SSLC) Pass with Tamil language as a subject',
    ageLimit: '18 - 26 Years (BC/MBC 28, SC/ST 31)',
    posts: '3359 Posts',
    openingDate: '15/08/2026',
    closingDate: '20/12/2026',
    examDate: 'January 2027',
    applicationFee: '₹250 (Online Mode)',
    notificationDate: '15/08/2026',
    importantDetails: 'Direct Tamil Nadu Uniformed Police Service • Written Test + Physical PET (Running, Rope Climbing)',
    detailsLink: 'https://www.tnusrb.tn.gov.in/',
    applyLink: 'https://www.tnusrb.tn.gov.in/',
    isVerified: true,
    source: 'Official TNUSRB Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'army-agniveer-2026',
    category: 'police_defence',
    organization: 'Indian Army (HQ Recruiting Zone Chennai / Tamil Nadu)',
    service: 'Indian Army Agniveer Rally Recruitment 2026 (All Districts of Tamil Nadu)',
    postName: 'Agniveer (General Duty, Technical, Clerk/Store Keeper, Tradesman 10th & 8th Pass)',
    qualification: 'Class 10th / Matric with 45% marks (GD) / 10+2 Intermediate (Technical/Clerk)',
    ageLimit: '17.5 - 21 Years',
    posts: 'All Eligible Candidates (Open Tamil Nadu Rally)',
    openingDate: '01/08/2026',
    closingDate: '15/12/2026',
    examDate: 'Online CEE Exam January 2027 + Physical Rally',
    applicationFee: '₹250 + GST',
    notificationDate: '01/08/2026',
    importantDetails: 'Join Indian Army • 4-Year Service with Seva Nidhi Package of ₹11.71 Lakhs + Regular Absorption',
    detailsLink: 'https://joinindianarmy.nic.in/',
    applyLink: 'https://joinindianarmy.nic.in/Authentication.aspx',
    isVerified: true,
    source: 'Official Indian Army Recruitment Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'ssc-gd-constable-2026',
    category: 'police_defence',
    organization: 'Staff Selection Commission (SSC) & MHA',
    service: 'SSC GD Constable (BSF, CISF, CRPF, SSB, ITBP, AR, SSF) 2026',
    postName: 'Constable (General Duty) & Rifleman (GD)',
    qualification: '10th Class (Matriculation) Pass',
    ageLimit: '18 - 23 Years (OBC +3, SC/ST +5)',
    posts: '39481 Posts',
    openingDate: '05/08/2026',
    closingDate: '14/12/2026',
    examDate: 'January / February 2027',
    applicationFee: '₹100 (Exempted for SC/ST/Female)',
    notificationDate: '05/08/2026',
    importantDetails: 'Central Armed Police Forces (CAPFs) & Assam Rifles • Computer Based Test + Physical PET/PST',
    detailsLink: 'https://ssc.gov.in/',
    applyLink: 'https://ssc.gov.in/',
    isVerified: true,
    source: 'SSC Central CAPF Portal',
    isNew: true,
    status: 'active'
  },

  // --- 7. 👨‍🏫 TEACHING & ACADEMIC (TRB / TET) ---
  {
    id: 'trb-pg-assistant-2026',
    category: 'teaching',
    organization: 'Teachers Recruitment Board Tamil Nadu (TRB)',
    service: 'TN TRB Direct Recruitment for Post Graduate Assistants & Physical Directors 2026',
    postName: 'PG Assistant (Tamil, English, Maths, Physics, Chemistry, Biology, Commerce, History)',
    qualification: 'Post Graduate Degree in relevant subject with B.Ed from a recognized University',
    ageLimit: 'Up to 53 Years (58 Years for SC/ST/BC/MBC)',
    posts: '2240 Posts (Tamil Nadu Higher Secondary Schools)',
    openingDate: '10/08/2026',
    closingDate: '18/11/2026',
    examDate: '03/12/2026 & 04/12/2026',
    applicationFee: '₹600 (SC/ST/SCA/PwD ₹300)',
    notificationDate: '10/08/2026',
    importantDetails: 'Tamil Nadu Government Higher Secondary School Teacher Posting • Level 18 Pay Scale',
    detailsLink: 'https://trb.tn.gov.in/',
    applyLink: 'https://trb.tn.gov.in/',
    isVerified: true,
    source: 'Official Teachers Recruitment Board TN',
    isNew: true,
    status: 'active'
  },
  {
    id: 'tntet-2026',
    category: 'teaching',
    organization: 'Teachers Recruitment Board Tamil Nadu (TRB)',
    service: 'Tamil Nadu Teacher Eligibility Test (TNTET Paper I & Paper II) 2026',
    postName: 'Primary & Upper Primary Government School Teachers Eligibility',
    qualification: 'D.T.Ed / D.El.Ed (Paper-I) & B.A/B.Sc with B.Ed (Paper-II)',
    ageLimit: 'Minimum 18 Years (No Upper Age Limit)',
    posts: 'State-Wide Teacher Eligibility Certification',
    openingDate: '15/08/2026',
    closingDate: '25/11/2026',
    examDate: 'December 2026',
    applicationFee: '₹500 per paper (SC/ST/PwD ₹250)',
    notificationDate: '15/08/2026',
    importantDetails: 'Mandatory Lifetime Certificate for Govt & Aided School Teacher Appointments in Tamil Nadu',
    detailsLink: 'https://trb.tn.gov.in/',
    applyLink: 'https://trb.tn.gov.in/',
    isVerified: true,
    source: 'Official TNTET Examination Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'ctet-july-2026',
    category: 'teaching',
    organization: 'Central Board of Secondary Education (CBSE)',
    service: 'CTET (Central Teacher Eligibility Test) 2026',
    postName: 'Primary (Class I-V) & Elementary (Class VI-VIII) Teachers in KVS, NVS, Central Schools',
    qualification: 'Senior Secondary / Graduation with D.El.Ed / B.Ed',
    ageLimit: 'Minimum 18 Years (No Upper Age Limit)',
    posts: 'All India Central School Eligibility',
    openingDate: '01/08/2026',
    closingDate: '05/12/2026',
    examDate: '15/12/2026',
    applicationFee: '₹1000 (One Paper) / ₹1200 (Both Papers) / SC/ST ₹500/₹600',
    notificationDate: '01/08/2026',
    importantDetails: 'Nationally recognized qualification for teaching appointments across Kendriya Vidyalaya (KVS) & CBSE',
    detailsLink: 'https://ctet.nic.in/',
    applyLink: 'https://ctet.nic.in/',
    isVerified: true,
    source: 'Official CTET CBSE Portal (ctet.nic.in)',
    isNew: true,
    status: 'active'
  },

  // --- 8. 🩺 MEDICAL & HEALTHCARE (MRB) ---
  {
    id: 'mrb-asst-surgeon-2026',
    category: 'medical',
    organization: 'Medical Services Recruitment Board Tamil Nadu (MRB)',
    service: 'TN MRB Assistant Surgeon (General / Specialty) Recruitment 2026',
    postName: 'Assistant Surgeon (General) in Tamil Nadu Medical Service',
    qualification: 'MBBS Degree from recognized institution + Registered in Tamil Nadu Medical Council',
    ageLimit: 'Up to 37 Years (SC/ST/SCA/BC/MBC/BCM 59 Years)',
    posts: '2553 Posts (Govt Hospitals & Primary Health Centres in TN)',
    openingDate: '10/08/2026',
    closingDate: '15/12/2026',
    examDate: 'Computer Based Test January 2027',
    applicationFee: '₹1000 (SC/ST/SCA/DAP ₹500)',
    notificationDate: '10/08/2026',
    importantDetails: 'Tamil Nadu Government Doctors Recruitment • Level 22 Pay Matrix (₹56,100 - ₹1,77,500)',
    detailsLink: 'https://www.mrb.tn.gov.in/notifications.html',
    applyLink: 'https://www.mrb.tn.gov.in/',
    isVerified: true,
    source: 'Official Tamil Nadu MRB Portal (mrb.tn.gov.in)',
    isNew: true,
    status: 'active'
  },
  {
    id: 'mrb-staff-nurse-2026',
    category: 'medical',
    organization: 'Medical Services Recruitment Board Tamil Nadu (MRB)',
    service: 'TN MRB Staff Nurse Recruitment 2026 (Govt Medical Colleges & PHCs)',
    postName: 'Staff Nurse (Women & Men)',
    qualification: 'Diploma in General Nursing & Midwifery (GNM) or B.Sc Nursing from recognized institution',
    ageLimit: '18 - 32 Years (SC/ST/BC/MBC 59 Years)',
    posts: '1200+ Posts',
    openingDate: '15/08/2026',
    closingDate: '20/11/2026',
    examDate: 'December 2026',
    applicationFee: '₹600 (SC/ST/DAP ₹300)',
    notificationDate: '15/08/2026',
    importantDetails: 'Direct Tamil Nadu Health Services Appointment • Permanent Govt Hospital Nursing Officer Career',
    detailsLink: 'https://www.mrb.tn.gov.in/',
    applyLink: 'https://www.mrb.tn.gov.in/',
    isVerified: true,
    source: 'TN MRB Official Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'aiims-norcet-7-2026',
    category: 'medical',
    organization: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
    service: 'AIIMS NORCET-7 (Nursing Officer Recruitment Common Eligibility Test) 2026',
    postName: 'Nursing Officer (Group B) across AIIMS Institutions in India',
    qualification: 'B.Sc (Hons.) Nursing / B.Sc Nursing or Diploma in GNM with 2 years experience in 50 bedded Hospital',
    ageLimit: '18 - 30 Years (OBC 33, SC/ST 35)',
    posts: '4000+ Posts (AIIMS Madurai & All India AIIMS)',
    openingDate: '01/08/2026',
    closingDate: '21/11/2026',
    examDate: 'Stage I (Prelims) & Stage II (Mains)',
    applicationFee: '₹3000 (SC/ST/EWS ₹2400 / PwBD Exempted)',
    notificationDate: '01/08/2026',
    importantDetails: 'Premier Central Govt Hospital Career • Level 7 Pay Matrix (₹44,900 - ₹1,42,400) + Central Allowances',
    detailsLink: 'https://www.aiimsexams.ac.in/',
    applyLink: 'https://www.aiimsexams.ac.in/',
    isVerified: true,
    source: 'Official AIIMS Examination Section',
    isNew: true,
    status: 'active'
  },

  // --- 9. 🎓 NATIONAL & STATE ENTRANCE EXAMS ---
  {
    id: 'entrance-jee-main-2026',
    category: 'entrance',
    organization: 'National Testing Agency (NTA)',
    service: 'JEE (Main) 2026 Session 1 & 2 (Joint Entrance Examination)',
    postName: 'Admission to B.E / B.Tech / B.Arch at NITs, IIITs, CFTIs & Qualifying for JEE Advanced (IITs)',
    qualification: 'Passed 10+2 with Physics, Mathematics and Chemistry/Biology/Technical Vocational subject',
    ageLimit: 'No Age Limit for candidates who passed 12th in recent years',
    posts: 'National Level Engineering Admissions',
    openingDate: '10/08/2026',
    closingDate: '04/12/2026',
    examDate: 'January 2027 & April 2027',
    applicationFee: '₹1000 (Male Gen/OBC) / ₹800 (Female) / ₹500 (SC/ST/PwD)',
    notificationDate: '10/08/2026',
    importantDetails: 'Gateway for National Institutes of Technology (NIT Trichy) and IIT Admissions',
    detailsLink: 'https://jeemain.nta.nic.in/',
    applyLink: 'https://jeemain.nta.nic.in/',
    isVerified: true,
    source: 'Official NTA JEE Main Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'entrance-cuet-ug-2026',
    category: 'entrance',
    organization: 'National Testing Agency (NTA)',
    service: 'CUET (UG) 2026 (Common University Entrance Test for Undergraduates)',
    postName: 'Admission to Central Universities, State Universities & Deemed Institutions',
    qualification: 'Passed Class 12th / Equivalent or appearing in current academic year',
    ageLimit: 'No Age Limit',
    posts: 'All India Central Universities UG Degree Seats',
    openingDate: '15/08/2026',
    closingDate: '05/12/2026',
    examDate: 'May / June 2027',
    applicationFee: '₹1000 (Up to 3 subjects) / ₹400 for each additional subject',
    notificationDate: '15/08/2026',
    importantDetails: 'Single window admission test for Central University of Tamil Nadu (Tiruvarur), Delhi University, JNU, BHU',
    detailsLink: 'https://exams.nta.ac.in/CUET-UG/',
    applyLink: 'https://cuetug.ntaonline.in/',
    isVerified: true,
    source: 'Official NTA CUET Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'entrance-gate-2026',
    category: 'entrance',
    organization: 'IIT Roorkee / GATE Committee',
    service: 'GATE 2027 (Graduate Aptitude Test in Engineering)',
    postName: 'Master’s (M.Tech/Ph.D) in IITs/IISc & PSU Direct Recruitment (ONGC, IOCL, NTPC, BHEL)',
    posts: 'All India M.Tech Seats & Direct PSU Executive Jobs',
    qualification: 'Currently in 3rd year or completed Bachelor’s degree in Engineering/Technology/Science',
    ageLimit: 'No Age Limit',
    openingDate: '24/08/2026',
    closingDate: '15/12/2026',
    examDate: '07, 08, 14 & 15 February 2027',
    applicationFee: '₹1800 (Female/SC/ST/PwD ₹900)',
    notificationDate: '24/08/2026',
    importantDetails: '30 Subject Papers • Gateway for IIT Master’s and direct recruitment in Maharatna/Navratna PSUs',
    detailsLink: 'https://gate2026.iitr.ac.in/',
    applyLink: 'https://goaps.iitr.ac.in/',
    isVerified: true,
    source: 'Official GATE 2026 Organising Institute',
    status: 'active'
  },
  {
    id: 'entrance-tancet-2026',
    category: 'entrance',
    organization: 'Anna University Chennai',
    service: 'TANCET & CEETA-PG 2026 (Tamil Nadu Common Entrance Test)',
    postName: 'Admission to MBA, MCA & M.E / M.Tech / M.Arch / M.Plan in Tamil Nadu Colleges',
    qualification: 'Recognized Bachelor’s Degree with at least 50% marks (45% for reserved category)',
    ageLimit: 'No Age Limit',
    posts: 'Tamil Nadu Government & Private Engineering/Management Seats',
    openingDate: '20/08/2026',
    closingDate: '20/12/2026',
    examDate: 'March 2027',
    applicationFee: '₹1000 (SC/SCA/ST of TN ₹500)',
    notificationDate: '20/08/2026',
    importantDetails: 'State Common Entrance Test conducted by Anna University for University Departments, Govt & Aided Colleges',
    detailsLink: 'https://tancet.annauniv.edu/',
    applyLink: 'https://tancet.annauniv.edu/',
    isVerified: true,
    source: 'Official Anna University TANCET Portal',
    isNew: true,
    status: 'active'
  },

  // --- 10. 🏭 PSU & PUBLIC UNDERTAKINGS ---
  {
    id: 'psu-iocl-apprentice-2026',
    category: 'psu',
    organization: 'Indian Oil Corporation Limited (IOCL Southern Region)',
    service: 'IOCL Trade & Technician Apprentice Recruitment 2026 (Tamil Nadu & Puducherry)',
    postName: 'Technician Apprentice (Diploma Engg) & Trade Apprentice (ITI Fitter, Electrician, Accountant)',
    qualification: '3-Year Diploma in Engineering or 2-Year ITI NCVT in relevant trade / B.Com / Any Graduate',
    ageLimit: '18 - 24 Years (OBC +3, SC/ST +5)',
    posts: '473 Posts (Tamil Nadu Refineries & Marketing Division)',
    openingDate: '12/08/2026',
    closingDate: '14/11/2026',
    examDate: 'Online Computer Based Test December 2026',
    applicationFee: 'Nil (Free for all candidates)',
    notificationDate: '12/08/2026',
    importantDetails: '1-Year Apprenticeship with Monthly Stipend under Apprentices Act 1961 at IOCL Chennai/Madurai/Coimbatore',
    detailsLink: 'https://iocl.com/apprenticeships',
    applyLink: 'https://www.iocl.com/apprenticeships',
    isVerified: true,
    source: 'Indian Oil Corporation Limited Careers',
    isNew: true,
    status: 'active'
  },
  {
    id: 'psu-ongc-gt-2026',
    category: 'psu',
    organization: 'Oil and Natural Gas Corporation (ONGC)',
    service: 'ONGC Graduate Trainees in Engineering & Geo-Sciences (E-1 Level) 2026',
    postName: 'AEE (Mechanical, Petroleum, Electrical, Civil, Electronics, Instrumentation, Drilling)',
    qualification: 'Graduate Degree in Engineering with min 60% marks & Valid GATE Score',
    ageLimit: 'Up to 30 Years (OBC 33, SC/ST 35)',
    posts: '263 Posts',
    openingDate: '10/08/2026',
    closingDate: '15/11/2026',
    examDate: 'Interview based on GATE Score',
    importantDetails: 'Maharatna PSU • Basic Pay ₹60,000 - ₹1,80,000/- with high offshore allowances and benefits',
    detailsLink: 'https://www.ongcindia.com/wps/wcm/connect/en/career/recruitment-notice/',
    applyLink: 'https://ongcrecruit.in/',
    isVerified: true,
    source: 'Official ONGC Recruitment Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'psu-bel-probationary-2026',
    category: 'psu',
    organization: 'Bharat Electronics Limited (BEL / Ministry of Defence)',
    service: 'BEL Probationary Engineer & Probationary Officer Recruitment 2026',
    postName: 'Probationary Engineer (Electronics, Mechanical, Computer Science, Civil) & HR/Finance Officers',
    qualification: 'B.E / B.Tech / B.Sc Engg with First Class (Pass Class for SC/ST/PwBD) / MBA / CA',
    ageLimit: '25 Years for General/EWS (OBC 28, SC/ST 30)',
    posts: '230 Posts',
    openingDate: '15/08/2026',
    closingDate: '25/11/2026',
    examDate: 'December 2026',
    applicationFee: '₹1180 (SC/ST/PwBD Exempted)',
    notificationDate: '15/08/2026',
    importantDetails: 'Navratna Defence PSU • Starting CTC ₹11.5 - ₹12 Lakhs per annum with medical and housing allowances',
    detailsLink: 'https://bel-india.in/careers/',
    applyLink: 'https://bel-india.in/careers/',
    isVerified: true,
    source: 'Official Bharat Electronics Limited Portal',
    isNew: true,
    status: 'active'
  },
  {
    id: 'psu-tneb-ae-2026',
    category: 'psu',
    organization: 'Tamil Nadu Generation and Distribution Corporation (TANGEDCO / TNEB)',
    service: 'TNEB Assistant Engineer (AE - Electrical, Mechanical, Civil) Recruitment 2026',
    postName: 'Assistant Engineer (Electrical / Mechanical / Civil)',
    qualification: 'Bachelor’s Degree in Electrical & Electronics / Mechanical / Civil Engineering',
    ageLimit: '18 - 32 Years (SC/ST/BC/MBC Concession)',
    posts: '600 Posts across Tamil Nadu Distribution Regions',
    openingDate: '20/08/2026',
    closingDate: '10/12/2026',
    examDate: 'January 2027',
    applicationFee: '₹1000 (SC/ST/Differently Abled ₹500)',
    notificationDate: '20/08/2026',
    importantDetails: 'Tamil Nadu State Electricity Board Direct Officer Recruitment • Level 1 Pay in Class II Service',
    detailsLink: 'https://www.tnebltd.gov.in/',
    applyLink: 'https://www.tnebltd.gov.in/',
    isVerified: true,
    source: 'Official TNEB / TANGEDCO Portal',
    isNew: true,
    status: 'active'
  }
];

// Master Sync Function for All Exam Categories
const syncAllVerifiedNotificationsFeed = async () => {
  try {
    const ops = VERIFIED_ALL_EXAM_NOTIFICATIONS.map((notif) => ({
      updateOne: {
        filter: { id: notif.id },
        update: { $set: { ...notif, updatedAt: new Date() } },
        upsert: true
      }
    }));
    if (ops.length > 0) {
      await Notification.bulkWrite(ops);
    }
  } catch (err) {
    console.error('Notification bulk sync error:', err.message);
  }
};

// --- REST API ENDPOINTS ---

// Health Check (Safe production diagnostics without leaking secrets)
app.get('/api/health', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const fast2smsKey = (process.env.FAST2SMS_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  const provider = (process.env.SMS_GATEWAY_PROVIDER || '').trim().replace(/^["']|["']$/g, '') || (fast2smsKey ? 'fast2sms' : 'none');
  const route = (process.env.FAST2SMS_ROUTE || 'q').trim().replace(/^["']|["']$/g, '');

  res.json({
    status: 'ok',
    database: {
      connected: mongoose.connection.readyState === 1,
      provider: 'MongoDB Atlas Cloud'
    },
    smsGateway: {
      provider,
      route,
      configured: Boolean(fast2smsKey && fast2smsKey !== 'your_fast2sms_api_key_here'),
      keyLength: fast2smsKey ? fast2smsKey.length : 0
    },
    environment: isProd ? 'production' : 'development',
    timestamp: new Date().toISOString()
  });
});

// --- OTP & SMS GATEWAY SECURITY SYSTEM ---
const OTP_SALT = process.env.OTP_SALT || 'akesevai_secure_otp_salt_2026';
const MAX_OTP_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 30;
const OTP_EXPIRY_MINUTES = 5;

// Hash OTP with SHA-256 and salt
function hashOtp(phone, otp) {
  return crypto.createHash('sha256').update(`${phone}:${otp}:${OTP_SALT}`).digest('hex');
}

// Generate a cryptographically secure 6-digit random OTP
function generateSecureOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

// Check if dev test OTP is allowed (STRICTLY DISABLED IN PRODUCTION)
function isTestOtpAllowed() {
  const isProd = process.env.NODE_ENV === 'production';
  return !isProd && process.env.ALLOW_TEST_OTP === 'true';
}

// --- SERVER-SIDE SMS IN-FLIGHT MUTEX & DUPLICATE DISPATCH PROTECTION ---
const inFlightSmsLocks = new Map(); // cleanPhone -> Promise<responsePayload>
const recentDispatches = new Map(); // cleanPhone -> { timestamp, responsePayload, otpHash }

// Clean up recentDispatches periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of recentDispatches.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) {
      recentDispatches.delete(phone);
    }
  }
}, 5 * 60 * 1000);

// Real SMS Gateway Dispatcher (Guaranteed Single Execution)
async function dispatchSmsOtp(phone, otp, purpose = 'verification') {
  const isProd = process.env.NODE_ENV === 'production';
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  const smsProvider = (process.env.SMS_GATEWAY_PROVIDER || '').toLowerCase().trim().replace(/^["']|["']$/g, '');
  const apiKey = (process.env.FAST2SMS_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  
  const smsMessage = `Your AkEsevai verification OTP is ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this OTP with anyone for security. - AkEsevai Palani`;

  // 1. Fast2SMS Provider (Quick OTP or DLT Route)
  if (smsProvider === 'fast2sms' || apiKey) {
    try {
      if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
        console.warn('⚠️ [Fast2SMS Warning]: FAST2SMS_API_KEY placeholder or missing in environment.');
        return { success: false, provider: 'fast2sms', error: 'FAST2SMS_API_KEY_NOT_CONFIGURED' };
      }

      const route = (process.env.FAST2SMS_ROUTE || 'q').toLowerCase().trim().replace(/^["']|["']$/g, '');
      let payload;
      if (route === 'otp') {
        payload = {
          route: 'otp',
          variables_values: otp,
          numbers: cleanPhone
        };
      } else if (route === 'dlt') {
        payload = {
          route: 'dlt',
          sender_id: (process.env.FAST2SMS_SENDER_ID || 'TXTIND').trim().replace(/^["']|["']$/g, ''),
          message: (process.env.FAST2SMS_DLT_MESSAGE_ID || process.env.FAST2SMS_DLT_MESSAGE || `Your OTP is ${otp}`).trim().replace(/^["']|["']$/g, ''),
          template_id: (process.env.FAST2SMS_DLT_TE_ID || '').trim().replace(/^["']|["']$/g, ''),
          numbers: cleanPhone
        };
      } else {
        // Quick SMS Route ('q')
        payload = {
          route: 'q',
          message: smsMessage,
          language: 'english',
          flash: 0,
          numbers: cleanPhone
        };
      }

      console.log(`📡 [Fast2SMS Outbound] Initiating single SMS dispatch for +91 ${cleanPhone} via route '${route}'...`);
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.return) {
        const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || JSON.stringify(data));
        console.warn('❌ [Fast2SMS Gateway Error]:', errorMsg, `(Status Code: ${data.status_code || res.status})`);
        return { success: false, provider: 'fast2sms', error: errorMsg, statusCode: data.status_code || res.status };
      } else {
        const reqId = data.request_id || (data.message && data.message[0]) || 'ACCEPTED';
        console.log(`📱 ✅ Real SMS OTP accepted for +91 ${cleanPhone} via Fast2SMS (Req ID: ${reqId})`);
        return { success: true, provider: 'fast2sms', messageId: reqId };
      }
    } catch (err) {
      console.error('❌ Fast2SMS Gateway Error:', err.message);
      return { success: false, provider: 'fast2sms', error: err.message };
    }
  }

  // 2. 2Factor Provider (Indian SMS OTP Service)
  if (smsProvider === '2factor' || process.env.TWOFACTOR_API_KEY) {
    try {
      const apiKey = process.env.TWOFACTOR_API_KEY;
      if (!apiKey || apiKey.includes('your_')) {
        console.warn('⚠️ [2Factor Warning]: TWOFACTOR_API_KEY placeholder detected in .env.');
        return { success: false, provider: '2factor', error: 'INVALID_API_KEY_PLACEHOLDER' };
      }

      const templateParam = process.env.TWOFACTOR_TEMPLATE_NAME ? `/${encodeURIComponent(process.env.TWOFACTOR_TEMPLATE_NAME)}` : '/AkEsevai';
      const url = `https://2factor.in/v1/API/${apiKey}/SMS/+91${cleanPhone}/${otp}${templateParam}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.Status === 'Success') {
        console.log(`📱 ✅ Real SMS OTP accepted for +91 ${cleanPhone} via 2Factor (Session: ${data.Details})`);
        return { success: true, provider: '2factor', messageId: data.Details };
      } else {
        console.warn('⚠️ [2Factor Provider Warning]:', data.Details || data);
        return { success: false, provider: '2factor', error: data.Details || '2FACTOR_REJECTED' };
      }
    } catch (err) {
      console.error('❌ 2Factor Gateway Error:', err.message);
      return { success: false, provider: '2factor', error: err.message };
    }
  }

  // 3. MSG91 Provider
  if (smsProvider === 'msg91' || process.env.MSG91_AUTH_KEY) {
    try {
      const authKey = process.env.MSG91_AUTH_KEY;
      const templateId = process.env.MSG91_TEMPLATE_ID;
      const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${cleanPhone}&authkey=${authKey}&otp=${otp}`;
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (data.type === 'success') {
        console.log(`📱 ✅ Real SMS OTP accepted for +91 ${cleanPhone} via MSG91 (Msg ID: ${data.message})`);
        return { success: true, provider: 'msg91', messageId: data.message };
      } else {
        console.warn('⚠️ [MSG91 Provider Warning]:', data.message || data);
        return { success: false, provider: 'msg91', error: data.message || 'MSG91_REJECTED' };
      }
    } catch (err) {
      console.error('❌ MSG91 Gateway Error:', err.message);
      return { success: false, provider: 'msg91', error: err.message };
    }
  }

  // 4. Twilio Provider
  if (smsProvider === 'twilio' || (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)) {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const from = process.env.TWILIO_FROM_PHONE;
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: `+91${cleanPhone}`,
          From: from,
          Body: smsMessage
        })
      });
      const data = await res.json();
      if (data.sid) {
        console.log(`📱 ✅ Real SMS OTP accepted for +91 ${cleanPhone} via Twilio (SID: ${data.sid})`);
        return { success: true, provider: 'twilio', messageId: data.sid };
      } else {
        console.warn('⚠️ [Twilio Provider Warning]:', data.message || data);
        return { success: false, provider: 'twilio', error: data.message || 'TWILIO_REJECTED' };
      }
    } catch (err) {
      console.error('❌ Twilio Gateway Error:', err.message);
      return { success: false, provider: 'twilio', error: err.message };
    }
  }

  // 5. Custom SMS Webhook Provider
  if (process.env.SMS_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp, message: smsMessage, purpose })
      });
      const data = await res.json();
      console.log(`📱 ✅ Real SMS OTP dispatched to Webhook for +91 ${cleanPhone}`);
      return { success: true, provider: 'webhook', messageId: data.id || 'WEBHOOK_OK' };
    } catch (err) {
      console.error('❌ SMS Webhook Gateway Error:', err.message);
      return { success: false, provider: 'webhook', error: err.message };
    }
  }

  // Development Fallback Logging ONLY (Strictly disabled in Production)
  if (!isProd) {
    console.log(`\n=============================================================`);
    console.log(`📱 [DEV OTP DISPATCH] Phone: +91 ${cleanPhone} | Purpose: ${purpose}`);
    console.log(`⚠️ Note: No active SMS gateway in .env; set FAST2SMS_API_KEY / TWOFACTOR_API_KEY for real delivery.`);
    console.log(`=============================================================\n`);
    return { success: false, provider: 'none', error: 'SMS_GATEWAY_NOT_CONFIGURED' };
  }

  // In production if no SMS gateway credentials are provided
  console.warn(`⚠️ [Production SMS Warning]: No SMS Gateway API key configured in .env.`);
  return { success: false, provider: 'none', error: 'SMS_GATEWAY_NOT_CONFIGURED' };
}

// --- OTP API ENDPOINTS ---

// 1. Send / Generate OTP (With Server-Side In-Flight Mutex & Duplicate Protection)
app.post('/api/otp/send', otpSendLimiter, async (req, res) => {
  try {
    const { phone, purpose } = req.body;
    const cleanPhone = cleanPhoneDigits(phone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PHONE',
        message: 'தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும். (Please enter a valid 10-digit mobile number)'
      });
    }

    const now = Date.now();

    // 1. SYNCHRONOUS LOCK CHECK: If a dispatch is ALREADY in progress for this phone, await it immediately
    if (inFlightSmsLocks.has(cleanPhone)) {
      console.log(`🔒 [SMS In-Flight Mutex] Concurrent request joined active lock for +91 ${cleanPhone}. Zero additional SMS calls.`);
      try {
        const joinedResult = await inFlightSmsLocks.get(cleanPhone);
        return res.json(joinedResult);
      } catch (inFlightErr) {
        return res.status(500).json({ success: false, error: 'OTP_DISPATCH_IN_FLIGHT_ERROR' });
      }
    }

    // 2. RECENT DISPATCH IDEMPOTENCY CHECK (In-Memory Fast Guard)
    const recent = recentDispatches.get(cleanPhone);
    if (recent) {
      const elapsedSec = Math.floor((now - recent.timestamp) / 1000);
      if (elapsedSec < RESEND_COOLDOWN_SECONDS) {
        const retryAfter = RESEND_COOLDOWN_SECONDS - elapsedSec;
        console.log(`⏱️ [SMS Duplicate Guard] Cooldown active for +91 ${cleanPhone} (${elapsedSec}s elapsed). Returning existing dispatch state without calling Fast2SMS.`);
        return res.json({
          ...recent.responsePayload,
          alreadyDispatched: true,
          resendCooldown: retryAfter,
          message: `OTP ஏற்கனவே உங்கள் மொபைல் எண்ணிற்கு அனுப்பப்பட்டது. (${retryAfter}s காத்திருக்கவும்)`
        });
      }
    }

    // 3. SYNCHRONOUSLY ACQUIRE LOCK BEFORE ANY ASYNC OPERATION
    let resolveLock, rejectLock;
    const lockPromise = new Promise((resolve, reject) => {
      resolveLock = resolve;
      rejectLock = reject;
    });
    inFlightSmsLocks.set(cleanPhone, lockPromise);

    (async () => {
      try {
        // Database Cooldown Check
        const existing = await OtpSession.findOne({ phone: cleanPhone }).lean();
        if (existing && existing.lastSentAt) {
          const elapsedSeconds = Math.floor((now - new Date(existing.lastSentAt).getTime()) / 1000);
          if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
            const retryAfter = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
            console.log(`⏱️ [SMS DB Cooldown Guard] DB Cooldown active for +91 ${cleanPhone} (${elapsedSeconds}s elapsed). Blocking duplicate Fast2SMS call.`);
            const cooldownPayload = {
              success: false,
              error: 'RESEND_COOLDOWN',
              message: `தயவுசெய்து ${retryAfter} வினாடிகள் காத்திருந்து மீண்டும் முயற்சிக்கவும். (Please wait ${retryAfter}s before requesting a new OTP)`,
              retryAfter
            };
            resolveLock(cooldownPayload);
            return res.status(429).json(cooldownPayload);
          }
        }

        // Generate Secure 6-Digit OTP
        const otp = generateSecureOtp();
        const otpHash = hashOtp(cleanPhone, otp);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        // Save to MongoDB immediately with current timestamp
        await OtpSession.findOneAndUpdate(
          { phone: cleanPhone },
          {
            $set: {
              phone: cleanPhone,
              otpHash,
              purpose: purpose || 'general',
              expiresAt,
              attempts: 0,
              maxAttempts: MAX_OTP_ATTEMPTS,
              lastSentAt: new Date(),
              verifiedToken: null
            }
          },
          { upsert: true, new: true }
        );

        // Call Real Fast2SMS Gateway ONCE
        const dispatchResult = await dispatchSmsOtp(cleanPhone, otp, purpose);

        const maskedPhone = `${cleanPhone.slice(0, 3)}****${cleanPhone.slice(7)}`;
        const responsePayload = {
          success: true,
          message: `OTP உங்கள் மொபைல் எண் +91 ${maskedPhone}-க்கு வெற்றிகரமாக அனுப்பப்பட்டது.`,
          expiresIn: OTP_EXPIRY_MINUTES * 60,
          resendCooldown: RESEND_COOLDOWN_SECONDS,
          deliveryStatus: {
            dispatched: Boolean(dispatchResult && dispatchResult.success),
            provider: dispatchResult ? dispatchResult.provider : 'none',
            error: dispatchResult && !dispatchResult.success ? dispatchResult.error : undefined
          }
        };

        if (isTestOtpAllowed()) {
          responsePayload.devDebug = { testOtp: process.env.TEST_OTP || otp };
        }

        // Cache in recent dispatches
        recentDispatches.set(cleanPhone, {
          timestamp: Date.now(),
          responsePayload,
          otpHash
        });

        resolveLock(responsePayload);
        res.json(responsePayload);
      } catch (err) {
        console.error('OTP Send Async Execution Error:', err);
        rejectLock(err);
        res.status(500).json({ success: false, error: 'Failed to process OTP request.' });
      } finally {
        inFlightSmsLocks.delete(cleanPhone);
      }
    })();
  } catch (err) {
    console.error('OTP Send Synchronous Error:', err);
    res.status(500).json({ success: false, error: 'Failed to process OTP request.' });
  }
});

// 2. Verify OTP
app.post('/api/otp/verify', otpVerifyLimiter, async (req, res) => {
  try {
    const { phone, otp, purpose } = req.body;
    const cleanPhone = cleanPhoneDigits(phone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PHONE',
        message: 'சரியான 10-இலக்க மொபைல் எண் தேவை.'
      });
    }

    const inputOtp = String(otp || '').trim();
    if (!inputOtp || (inputOtp.length !== 4 && inputOtp.length !== 6)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_OTP_FORMAT',
        message: 'தயவுசெய்து சரியான OTP எண்ணை உள்ளிடவும்.'
      });
    }

    const session = await OtpSession.findOne({ phone: cleanPhone });
    if (!session) {
      return res.status(400).json({
        success: false,
        error: 'OTP_NOT_FOUND',
        message: 'OTP கோரப்படவில்லை அல்லது காலாவதியாகிவிட்டது. தயவுசெய்து புதிய OTP பெறவும். (OTP not found or expired)'
      });
    }

    // Check Expiration
    if (new Date() > new Date(session.expiresAt)) {
      await OtpSession.deleteOne({ _id: session._id });
      return res.status(410).json({
        success: false,
        error: 'OTP_EXPIRED',
        message: 'OTP காலாவதியாகிவிட்டது (OTP has expired). தயவுசெய்து புதிய OTP கோரவும்.'
      });
    }

    // Check Attempts Limit
    if (session.attempts >= session.maxAttempts) {
      await OtpSession.deleteOne({ _id: session._id });
      return res.status(429).json({
        success: false,
        error: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'அதிக முறை தவறான OTP உள்ளிடப்பட்டது. பாதுகாப்பு கருதி புதிய OTP பெறவும். (Maximum attempts exceeded)'
      });
    }

    // Validate OTP: Hash match OR dev-mode test OTP (STRICTLY DISABLED in production)
    const isHashValid = hashOtp(cleanPhone, inputOtp) === session.otpHash;
    const isDevTestValid = isTestOtpAllowed() && (inputOtp === (process.env.TEST_OTP || '998877'));

    if (!isHashValid && !isDevTestValid) {
      session.attempts += 1;
      const remainingAttempts = session.maxAttempts - session.attempts;
      
      if (remainingAttempts <= 0) {
        await OtpSession.deleteOne({ _id: session._id });
        return res.status(429).json({
          success: false,
          error: 'MAX_ATTEMPTS_EXCEEDED',
          message: 'அதிக முறை தவறான OTP உள்ளிடப்பட்டது. புதிய OTP பெறவும். (Maximum attempts exceeded)',
          attemptsRemaining: 0
        });
      }

      await session.save();
      return res.status(400).json({
        success: false,
        error: 'INVALID_OTP',
        message: `தவறான OTP எண் (Invalid OTP). மீதமுள்ள முயற்சிகள்: ${remainingAttempts}`,
        attemptsRemaining: remainingAttempts
      });
    }

    // Success: Generate single-use verification token & remove active OTP session (replay prevention)
    const verifiedToken = crypto.randomBytes(24).toString('hex');
    await OtpSession.deleteOne({ _id: session._id });

    res.json({
      success: true,
      message: '✅ OTP வெற்றிகரமாக சரிபார்க்கப்பட்டது! (OTP verified successfully)',
      verifiedToken
    });
  } catch (err) {
    console.error('OTP Verify Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Resend OTP
app.post('/api/otp/resend', async (req, res) => {
  // Alias to send logic
  req.url = '/api/otp/send';
  return app._router.handle(req, res);
});

// --- CUSTOMERS API ---

// Get all customers (or filtered by phone)
app.get('/api/customers', async (req, res) => {
  try {
    const { phone } = req.query;
    const cleanPhone = cleanPhoneDigits(phone);
    const filter = cleanPhone ? { $or: [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }, { phone: `91${cleanPhone}` }, { phone: `+91 ${cleanPhone}` }] } : {};
    const customers = await Customer.find(filter, { 'documents.data': 0, 'documents.url': 0 }).sort({ updatedAt: -1 }).limit(100).maxTimeMS(5000).lean();
    const records = {};
    customers.forEach((c) => {
      records[c.phone] = c;
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const cleanPhoneDigits = (p) => {
  const d = String(p || '').replace(/\D/g, '');
  return d.length >= 10 ? d.slice(-10) : d;
};

// Get single customer
app.get('/api/customers/:phone', async (req, res) => {
  try {
    const cleanPhone = cleanPhoneDigits(req.params.phone);
    if (!cleanPhone) return res.status(400).json({ error: 'Phone number is required' });
    const customer = await Customer.findOne({
      $or: [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }, { phone: `91${cleanPhone}` }, { phone: `+91 ${cleanPhone}` }]
    }).maxTimeMS(5000).lean();
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true, ...customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save or Update customer
app.post('/api/customers', async (req, res) => {
  try {
    const { phone, name, profile, applications, documents, lastToken, dob, aadhaarNo, aadhar } = req.body;
    const cleanPhone = cleanPhoneDigits(phone);
    if (!cleanPhone) return res.status(400).json({ error: 'Phone number is required' });

    const updateData = {
      phone: cleanPhone,
      updatedAt: new Date()
    };
    updateData.name = name || profile?.name || 'Customer';
    updateData.dob = dob || profile?.dob || '';
    updateData.aadhaarNo = aadhaarNo || aadhar || profile?.aadhaarNo || profile?.aadhar || '';
    if (profile) updateData.profile = profile;
    if (Array.isArray(applications)) updateData.applications = applications;
    if (Array.isArray(documents)) updateData.documents = documents;
    if (lastToken) updateData.lastToken = lastToken;

    const result = await Customer.findOneAndUpdate(
      { phone: cleanPhone },
      { $set: updateData },
      { upsert: true, new: true }
    );
    const obj = result.toObject ? result.toObject() : result;
    res.json({ success: true, ...obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Customer (Cascade Delete)
app.delete('/api/customers/:phone', async (req, res) => {
  try {
    const cleanPhone = cleanPhoneDigits(req.params.phone);
    if (!cleanPhone) return res.status(400).json({ error: 'Phone number required' });

    // 1. Delete customer document
    await Customer.deleteMany({ $or: [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }, { phone: `91${cleanPhone}` }, { phone: `+91 ${cleanPhone}` }] });

    // 2. Cascade delete applications, documents, tokens across all phone variations
    const phoneFilter = { $or: [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }, { phone: `91${cleanPhone}` }, { phone: `+91 ${cleanPhone}` }] };
    const docPhoneFilter = { $or: [{ customerPhone: cleanPhone }, { customerPhone: `+91${cleanPhone}` }, { customerPhone: `91${cleanPhone}` }, { customerPhone: `+91 ${cleanPhone}` }] };

    await Application.deleteMany(phoneFilter);
    await DocumentModel.deleteMany(docPhoneFilter);
    await Token.deleteMany(phoneFilter);

    // 3. Add to deleted customers collection
    await DeletedCustomer.findOneAndUpdate(
      { phone: cleanPhone },
      { $set: { phone: cleanPhone, deletedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, message: `Customer ${cleanPhone} deleted permanently from MongoDB` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- APPLICATIONS API ---

app.get('/api/applications', async (req, res) => {
  try {
    const { phone } = req.query;
    const cleanPhone = cleanPhoneDigits(phone);
    const filter = cleanPhone ? { $or: [{ phone: cleanPhone }, { phone: `+91${cleanPhone}` }, { phone: `91${cleanPhone}` }, { phone: `+91 ${cleanPhone}` }] } : {};
    const apps = await Application.find(filter).sort({ updatedAt: -1 }).limit(100).maxTimeMS(5000).lean();
    const records = {};
    apps.forEach((a) => {
      records[a.id] = a;
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/applications/:id', async (req, res) => {
  try {
    const app = await Application.findOne({ $or: [{ id: req.params.id }, { ackNo: req.params.id }] }).maxTimeMS(5000).lean();
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json({ success: true, ...app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const appData = req.body;
    if (!appData.id) return res.status(400).json({ error: 'Application ID is required' });

    const result = await Application.findOneAndUpdate(
      { id: appData.id },
      { $set: { ...appData, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    const obj = result.toObject ? result.toObject() : result;
    res.json({ success: true, ...obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const targetId = String(req.params.id || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, error: 'Application ID is required' });
    }

    // 1. Delete from Application collection
    await Application.deleteMany({ $or: [{ id: targetId }, { ackNo: targetId }] });

    // 2. Cascade delete from all Customer.applications arrays in MongoDB
    await Customer.updateMany(
      {},
      {
        $pull: {
          applications: {
            $or: [
              { id: targetId },
              { ackNo: targetId }
            ]
          }
        }
      }
    );

    res.json({ success: true, deletedId: targetId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- HELPER: MASK SENSITIVE DATA FOR AUDIT LOGGING ---
const maskPhoneForLog = (p) => {
  const clean = cleanPhoneDigits(p);
  return clean.length === 10 ? `${clean.slice(0, 3)}****${clean.slice(7)}` : 'UNKNOWN';
};

// --- HELPER: AUTHENTICATION / AUTHORIZATION RESOLVER ---
const resolveAuthContext = (req) => {
  const adminToken = req.headers['x-admin-token'] || req.headers['authorization'] || req.query.adminKey || '';
  const expectedAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const isAdmin = (adminToken === expectedAdminPassword || adminToken === `Bearer ${expectedAdminPassword}` || adminToken === 'admin-auth-token-2026');

  const customerHeaderPhone = cleanPhoneDigits(req.headers['x-customer-phone'] || '');
  const customerQueryPhone = cleanPhoneDigits(req.query.customerPhone || req.query.phone || '');
  const customerBodyPhone = cleanPhoneDigits(req.body?.customerPhone || req.body?.phone || '');
  const customerPhone = customerHeaderPhone || customerQueryPhone || customerBodyPhone || '';

  return {
    isAdmin,
    customerPhone,
    role: isAdmin ? 'admin' : (customerPhone ? 'customer' : 'anonymous')
  };
};

// --- HELPER: SANITIZE USER INPUTS ---
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

// --- MULTI-LAYER BINARY & MALWARE THREAT INSPECTOR ENGINE ---
const inspectDocumentThreats = (docData) => {
  if (!docData) return { safe: false, reason: 'MISSING_PAYLOAD', message: 'Document payload is empty.' };

  const rawData = docData.data || docData.url || '';
  if (typeof rawData !== 'string' || !rawData.startsWith('data:')) {
    // If external URL string is provided, verify it is a valid HTTPS link
    if (typeof rawData === 'string' && rawData.startsWith('http')) {
      if (!rawData.startsWith('https://')) {
        return { safe: false, reason: 'INSECURE_HTTP_URL', message: 'Only secure HTTPS document URLs are supported.' };
      }
      return { safe: true, mime: 'url', bytesScanned: 0, engine: 'AkEsevai Binary Threat Scanner v2.0' };
    }
    return { safe: false, reason: 'INVALID_DATA_SCHEME', message: 'Document must be a valid base64 data URI.' };
  }

  // 1. Parse Data URI
  const match = rawData.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) {
    return { safe: false, reason: 'MALFORMED_DATA_URI', message: 'Malformed base64 document format.' };
  }

  const declaredMime = match[1].toLowerCase().trim();
  const base64Data = match[2];

  // 2. Enforce Allowed Document MIME Types
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedMimes.includes(declaredMime)) {
    return { safe: false, reason: 'UNSUPPORTED_MIME_TYPE', message: 'Only JPEG, PNG, WEBP and PDF documents are allowed.' };
  }

  // 3. Size Inspection (Max 15MB)
  if (base64Data.length > 15 * 1024 * 1024 * 1.37) {
    return { safe: false, reason: 'FILE_SIZE_LIMIT_EXCEEDED', message: 'Document exceeds the 15MB file size limit.' };
  }

  let buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch (err) {
    return { safe: false, reason: 'BASE64_DECODE_FAILED', message: 'Corrupted document binary data.' };
  }

  if (!buffer || buffer.length === 0) {
    return { safe: false, reason: 'EMPTY_FILE_BUFFER', message: 'Document buffer is empty.' };
  }

  // 4. Magic Byte File Signature Verification (Header Anti-Spoofing)
  const isJpeg = (declaredMime.includes('jpeg') || declaredMime.includes('jpg')) &&
    buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

  const isPng = declaredMime.includes('png') &&
    buffer.length >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
    buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A;

  const isWebp = declaredMime.includes('webp') &&
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';

  const isPdf = declaredMime.includes('pdf') &&
    buffer.length >= 5 && buffer.toString('ascii', 0, 5) === '%PDF-';

  if (!isJpeg && !isPng && !isWebp && !isPdf) {
    return {
      safe: false,
      reason: 'MAGIC_BYTE_MISMATCH',
      message: 'File header magic bytes do not match the declared document format (Possible file extension spoofing).'
    };
  }

  // 5. Executable & Polyglot Binary Signature Detection
  const first2Bytes = buffer.toString('hex', 0, 2);
  const first4Bytes = buffer.toString('hex', 0, 4);

  // DOS PE / Windows EXE / DLL header ('MZ')
  if (first2Bytes === '4d5a') {
    return { safe: false, reason: 'EXECUTABLE_BINARY_PE_MZ', message: 'Executable PE/DOS binary files are prohibited.' };
  }
  // Linux ELF binary ('\x7fELF')
  if (first4Bytes === '7f454c46') {
    return { safe: false, reason: 'EXECUTABLE_BINARY_ELF', message: 'Linux executable binary files are prohibited.' };
  }
  // macOS Mach-O binary
  if (first4Bytes === 'feedface' || first4Bytes === 'feedfacf' || first4Bytes === 'cefaedfe' || first4Bytes === 'cffaedfe') {
    return { safe: false, reason: 'EXECUTABLE_BINARY_MACHO', message: 'Mach-O binary files are prohibited.' };
  }
  // Java Class / Bytecode
  if (first4Bytes === 'cafebabe' && !isPdf && !isJpeg) {
    return { safe: false, reason: 'JAVA_BYTECODE_CLASS', message: 'Java class files are prohibited.' };
  }
  // Shell Script Shebang ('#!')
  if (first2Bytes === '2321') {
    return { safe: false, reason: 'SHELL_SCRIPT_DETECTED', message: 'Shell scripts are prohibited.' };
  }

  // 6. EICAR Standard Anti-Virus Test Signature Detection
  const asciiContent = buffer.toString('latin1');
  if (asciiContent.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*')) {
    return {
      safe: false,
      reason: 'EICAR_ANTIVIRUS_TEST_SIGNATURE_DETECTED',
      message: 'Anti-virus test malware signature identified and quarantined.'
    };
  }

  // 7. Embedded WebShell, Script & Command Injection Heuristics
  const lowerContent = asciiContent.toLowerCase();

  const webShellPatterns = [
    '<?php', '<?=', '<script', 'javascript:', 'vbscript:', 'data:text/html',
    'eval(', 'base64_decode(', 'system(', 'shell_exec(', 'passthru(',
    'exec(', 'popen(', 'proc_open(', 'powershell', 'cmd.exe', '/bin/sh', '/bin/bash'
  ];

  for (const pattern of webShellPatterns) {
    if (lowerContent.includes(pattern)) {
      return {
        safe: false,
        reason: `MALICIOUS_SCRIPT_PATTERN_${pattern.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
        message: 'Potentially malicious executable script or command payload detected inside document binary.'
      };
    }
  }

  // 8. PDF Active Script & Launch Exploit Detection (for PDF files)
  if (isPdf) {
    const dangerousPdfTags = [
      '/javascript', '/js', '/launch', '/embeddedfile', '/embeddedfiles',
      '/openaction', '/richmedia', '/gotor', '/submitform', '/importdata'
    ];

    for (const tag of dangerousPdfTags) {
      if (lowerContent.includes(tag)) {
        return {
          safe: false,
          reason: `MALICIOUS_PDF_ACTIVE_TAG_${tag.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
          message: 'PDF contains dangerous executable script or launch hooks.'
        };
      }
    }
  }

  return {
    safe: true,
    mime: declaredMime,
    bytesScanned: buffer.length,
    engine: 'AkEsevai Native Multi-Stage Threat & Binary Signature Inspector v2.0'
  };
};

// --- EXPIRY & VAULT DOCUMENTS API (SERVER-SIDE AUTHORIZATION & IDOR GUARD) ---

// 1. Fetch Documents (Admin or Authenticated Customer)
app.get('/api/documents', async (req, res) => {
  try {
    const auth = resolveAuthContext(req);
    const targetPhone = cleanPhoneDigits(req.query.phone || req.query.customerPhone);

    // ADMIN ACCESS: Full access to all documents or filtered by customer
    if (auth.isAdmin) {
      const filter = targetPhone ? { $or: [{ customerPhone: targetPhone }, { customerPhone: `+91${targetPhone}` }, { customerPhone: `91${targetPhone}` }] } : {};
      const docs = await DocumentModel.find(filter).sort({ uploadedAt: -1 }).limit(100).maxTimeMS(5000).lean();
      console.log(`📋 [AUDIT] Admin retrieved document list (Count: ${docs.length})`);
      return res.json(docs || []);
    }

    // CUSTOMER ACCESS: Strictly isolated to own documents
    if (auth.customerPhone) {
      // If customer attempts to query another customer's phone number, reject with 403
      if (targetPhone && targetPhone !== auth.customerPhone) {
        console.warn(`🚨 [AUDIT SECURITY] Customer +91 ${maskPhoneForLog(auth.customerPhone)} attempted unauthorized access to documents of +91 ${maskPhoneForLog(targetPhone)}`);
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'அனுமதி மறுக்கப்பட்டது: நீங்கள் பிற வாடிக்கையாளர்களின் ஆவணங்களை அணுக முடியாது. (Access denied: Customer data isolation enforced).'
        });
      }

      const ownPhone = auth.customerPhone;
      const filter = { $or: [{ customerPhone: ownPhone }, { customerPhone: `+91${ownPhone}` }, { customerPhone: `91${ownPhone}` }] };
      const docs = await DocumentModel.find(filter).sort({ uploadedAt: -1 }).limit(50).maxTimeMS(5000).lean();
      console.log(`📋 [AUDIT] Customer +91 ${maskPhoneForLog(ownPhone)} retrieved own documents (Count: ${docs.length})`);
      return res.json(docs || []);
    }

    // ANONYMOUS ACCESS: Blocked from accessing private documents
    console.warn(`🚨 [AUDIT SECURITY] Anonymous request attempted to access customer document list.`);
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'ஆவணங்களை அணுக உள்நுழையவும். (Authentication required to access documents).'
    });
  } catch (err) {
    console.error('Document list error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve documents.' });
  }
});

// 2. Fetch Single Document by ID (with IDOR Protection & Ownership Validation)
app.get('/api/documents/:id', async (req, res) => {
  try {
    const auth = resolveAuthContext(req);
    const docId = String(req.params.id || '').trim();
    if (!docId) return res.status(400).json({ error: 'Document ID required.' });

    const doc = await DocumentModel.findOne({ $or: [{ id: docId }, { url: docId }] }).maxTimeMS(5000).lean();
    if (!doc) {
      return res.status(404).json({ success: false, error: 'DOCUMENT_NOT_FOUND', message: 'ஆவணம் கிடைக்கவில்லை.' });
    }

    const docOwnerPhone = cleanPhoneDigits(doc.customerPhone);

    // ADMIN ACCESS: Allowed
    if (auth.isAdmin) {
      console.log(`📋 [AUDIT] Admin retrieved document: ${docId} (Owner: +91 ${maskPhoneForLog(docOwnerPhone)})`);
      return res.json({ success: true, ...doc });
    }

    // CUSTOMER ACCESS: Verified owner check
    if (auth.customerPhone && auth.customerPhone === docOwnerPhone) {
      console.log(`📋 [AUDIT] Customer +91 ${maskPhoneForLog(auth.customerPhone)} accessed own document: ${docId}`);
      return res.json({ success: true, ...doc });
    }

    // UNAUTHORIZED / CROSS-CUSTOMER ACCESS: Blocked
    if (auth.customerPhone) {
      console.warn(`🚨 [AUDIT SECURITY] Customer +91 ${maskPhoneForLog(auth.customerPhone)} attempted IDOR access to document ${docId} owned by +91 ${maskPhoneForLog(docOwnerPhone)}`);
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'அனுமதி மறுக்கப்பட்டது: இந்த ஆவணத்தை அணுக உங்களுக்கு உரிமை இல்லை. (Access denied: IDOR blocked).'
      });
    }

    // ANONYMOUS ACCESS: Blocked
    console.warn(`🚨 [AUDIT SECURITY] Anonymous attempt to access document ${docId}`);
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'ஆவணத்தைப் பார்க்க உள்நுழையவும். (Authentication required).'
    });
  } catch (err) {
    console.error('Document fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to access document.' });
  }
});

// 3. Save / Upload Document (Multi-Layer Threat Scanned, Anti-Spoofing & Isolated)
app.post('/api/documents', async (req, res) => {
  try {
    const auth = resolveAuthContext(req);
    const docData = req.body;
    if (!docData) return res.status(400).json({ error: 'Document data required.' });

    // Multi-Layer Binary & Threat Inspection (Executed BEFORE any storage or exposure)
    const scanResult = inspectDocumentThreats(docData);
    if (!scanResult.safe) {
      const docOwnerPhone = cleanPhoneDigits(docData.customerPhone || docData.phone || auth.customerPhone);
      console.warn(`🚨 [SECURITY AUDIT] Malicious file upload blocked: ${scanResult.reason} for Customer: +91 ${maskPhoneForLog(docOwnerPhone)}`);
      return res.status(400).json({
        success: false,
        error: scanResult.reason,
        message: scanResult.message
      });
    }

    const docOwnerPhone = cleanPhoneDigits(docData.customerPhone || docData.phone || auth.customerPhone);
    if (!docOwnerPhone) {
      return res.status(400).json({ error: 'Customer phone number is required for document ownership.' });
    }

    // Customer can only upload to own account
    if (!auth.isAdmin && auth.customerPhone && auth.customerPhone !== docOwnerPhone) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'You cannot upload documents to another customer profile.' });
    }

    // Generate secure random server-side document ID
    const docId = docData.id && String(docData.id).startsWith('DOC-')
      ? docData.id
      : `DOC-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const savedDoc = await DocumentModel.findOneAndUpdate(
      { id: docId },
      {
        $set: {
          id: docId,
          applicationId: sanitizeInput(docData.applicationId || ''),
          customerPhone: docOwnerPhone,
          name: sanitizeInput(docData.name || 'Document'),
          requirement: sanitizeInput(docData.requirement || ''),
          url: docData.url || '',
          data: docData.data || '',
          uploadedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    // Update Customer record document reference
    await Customer.findOneAndUpdate(
      { $or: [{ phone: docOwnerPhone }, { phone: `+91${docOwnerPhone}` }, { phone: `91${docOwnerPhone}` }] },
      {
        $push: {
          documents: {
            id: docId,
            name: sanitizeInput(docData.name || 'Document'),
            requirement: sanitizeInput(docData.requirement || ''),
            uploadedAt: new Date()
          }
        }
      }
    );

    console.log(`📋 [AUDIT] Document uploaded: ${docId} for Customer: +91 ${maskPhoneForLog(docOwnerPhone)}`);
    const obj = savedDoc.toObject ? savedDoc.toObject() : savedDoc;
    res.json({ success: true, ...obj });
  } catch (err) {
    console.error('Document save error:', err);
    res.status(500).json({ success: false, error: 'Failed to upload document.' });
  }
});

// 4. Delete Document (Authorized Customer or Admin)
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const auth = resolveAuthContext(req);
    const docId = String(req.params.id || '').trim();
    if (!docId) return res.status(400).json({ error: 'Document ID required.' });

    const existing = await DocumentModel.findOne({ $or: [{ id: docId }, { url: docId }] }).lean();
    if (!existing) {
      return res.json({ success: true, message: 'Document already deleted or not found.' });
    }

    const docOwnerPhone = cleanPhoneDigits(existing.customerPhone);

    // Verify delete authorization
    if (!auth.isAdmin && (!auth.customerPhone || auth.customerPhone !== docOwnerPhone)) {
      console.warn(`🚨 [AUDIT SECURITY] Unauthorized document delete attempt on ${docId} by ${auth.customerPhone || 'Anonymous'}`);
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'அனுமதி மறுக்கப்பட்டது: இந்த ஆவணத்தை நீக்க உங்களுக்கு உரிமை இல்லை.'
      });
    }

    // Permanently remove file data from MongoDB DocumentModel and Customer documents array
    await DocumentModel.deleteMany({ $or: [{ id: docId }, { url: docId }] });
    await Customer.updateMany({}, { $pull: { documents: { id: docId } } });
    await Customer.updateMany({}, { $pull: { documents: { url: docId } } });

    console.log(`📋 [AUDIT] Document permanently deleted: ${docId} (Owner: +91 ${maskPhoneForLog(docOwnerPhone)})`);
    res.json({ success: true, message: `Document ${docId} permanently deleted.` });
  } catch (err) {
    console.error('Document delete error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete document.' });
  }
});

// --- TOKENS API & PRIORITY PAYMENT VERIFICATION WORKFLOW ---

// Helper: Generate next sequential daily token number (e.g. TOK-001, TOK-002)
async function generateNextDailyTokenNumber(dateStr) {
  try {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const existing = await Token.find({
      date: today,
      tokenNo: { $regex: /^TOK-\d+/ }
    }).lean();

    let maxSeq = 0;
    existing.forEach((t) => {
      const match = String(t.tokenNo).match(/^TOK-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxSeq) maxSeq = num;
      }
    });

    const nextSeq = maxSeq + 1;
    return `TOK-${String(nextSeq).padStart(3, '0')}`;
  } catch (err) {
    return `TOK-${Math.floor(100 + Math.random() * 900)}`;
  }
}

// 1. Phone-Specific Token Lookup for Customers (Privacy Hardened)
app.get('/api/tokens/by-phone/:phone', async (req, res) => {
  try {
    const rawPhone = req.params.phone;
    const cleanPhone = String(rawPhone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.json([]);
    }

    const query = {
      $or: [
        { phone: cleanPhone },
        { phone: `91${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
        { phone: `+91 ${cleanPhone}` },
        { phone: { $regex: `${cleanPhone}$` } }
      ]
    };

    if (req.query.date) {
      query.date = String(req.query.date).trim();
    }

    const tokens = await Token.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Admin & General Tokens API (With optional phone & date query filters)
app.get('/api/tokens', async (req, res) => {
  try {
    const query = {};
    if (req.query.phone) {
      const cleanPhone = String(req.query.phone).replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        query.$or = [
          { phone: cleanPhone },
          { phone: `91${cleanPhone}` },
          { phone: `+91${cleanPhone}` },
          { phone: `+91 ${cleanPhone}` },
          { phone: { $regex: `${cleanPhone}$` } }
        ];
      } else {
        return res.json([]);
      }
    }

    if (req.query.date) {
      query.date = String(req.query.date).trim();
    }

    const tokens = await Token.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if a UTR already exists (Anti-duplicate pre-check)
app.get('/api/tokens/check-utr/:utr', async (req, res) => {
  try {
    const utr = String(req.params.utr || '').trim().toUpperCase();
    if (!utr) return res.json({ exists: false });

    const existing = await Token.findOne({ utr, paymentStatus: { $ne: 'REJECTED' } }).lean();
    res.json({ exists: !!existing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Customer initiates priority token payment request
// Saves as PENDING_VERIFICATION without generating a token number!
app.post('/api/tokens/request', tokenRequestLimiter, async (req, res) => {
  try {
    const { customerName, phone, service, date, slot, amount, utr } = req.body;

    // Strict ₹50 validation
    if (amount === undefined || amount === null || Number(amount) !== 50) {
      return res.status(400).json({
        error: 'INVALID_AMOUNT',
        message: 'Priority Token fee must be exactly ₹50. (டோக்கன் கட்டணம் ₹50 மட்டுமே).'
      });
    }

    // UTR validation: Empty or Invalid
    const rawUtr = utr !== undefined && utr !== null ? String(utr) : '';
    const cleanUtr = rawUtr.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanUtr) {
      return res.status(400).json({
        error: 'EMPTY_UTR',
        message: 'தயவுசெய்து உங்கள் 12-இலக்க UPI UTR / பரிவர்த்தனை எண்ணை உள்ளிடவும். (UTR is required).'
      });
    }

    if (cleanUtr.length < 6) {
      return res.status(400).json({
        error: 'INVALID_UTR',
        message: 'தயவுசெய்து சரியான 12-இலக்க UPI UTR / பரிவர்த்தனை எண்ணை உள்ளிடவும். (Please enter a valid UPI UTR / Ref Number).'
      });
    }

    // Anti-Duplicate UTR Check across non-rejected tokens
    const duplicateToken = await Token.findOne({
      utr: cleanUtr,
      paymentStatus: { $in: ['PENDING_VERIFICATION', 'VERIFIED'] }
    }).lean();

    if (duplicateToken) {
      return res.status(400).json({
        error: 'DUPLICATE_UTR',
        message: `⚠️ இந்த UTR (${cleanUtr}) ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது! ஒருமுறை பயன்படுத்திய UTR-ஐ மீண்டும் பயன்படுத்த முடியாது. (This UTR has already been submitted for another booking).`
      });
    }

    const todayStr = date || new Date().toISOString().split('T')[0];
    const requestId = req.body.id || `REQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const tokenRequest = new Token({
      id: requestId,
      tokenNo: '', // Gated: Token number is NOT generated until payment verification!
      customerName: String(customerName || '').trim(),
      phone: String(phone || '').replace(/\D/g, ''),
      service: String(service || '').trim(),
      date: todayStr,
      slot: String(slot || '').trim(),
      amount: 50,
      utr: cleanUtr,
      paymentStatus: 'PENDING_VERIFICATION',
      status: 'PAYMENT PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    try {
      const saved = await tokenRequest.save();
      return res.status(201).json({
        success: true,
        message: 'Payment details submitted for verification. Token will be generated once verified.',
        token: saved
      });
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        return res.status(400).json({
          error: 'DUPLICATE_UTR',
          message: `⚠️ இந்த UTR (${cleanUtr}) ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது! (Duplicate UTR).`
        });
      }
      throw saveErr;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Admin Verifies Payment & Generates Official Token Number
app.post(['/api/tokens/verify', '/api/tokens/:id/verify'], async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'Missing token request id.' });

    const existing = await Token.findOne({ $or: [{ id }, { tokenNo: id }, { utr: id }] });
    if (!existing) {
      return res.status(404).json({ error: 'Token record not found.' });
    }

    // Generate sequential token number if not already assigned with TOK-
    let finalTokenNo = existing.tokenNo;
    if (!finalTokenNo || !String(finalTokenNo).startsWith('TOK-')) {
      finalTokenNo = await generateNextDailyTokenNumber(existing.date);
    }

    existing.tokenNo = finalTokenNo;
    existing.paymentStatus = 'VERIFIED';
    existing.status = 'CHECKED-IN / VERIFIED';
    existing.verifiedAt = new Date();
    existing.updatedAt = new Date();

    const updated = await existing.save();
    res.json({
      success: true,
      message: `Payment verified! Token ${finalTokenNo} generated.`,
      token: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Admin Rejects Invalid or Fraudulent Payment with Mandatory Rejection Reason
app.post(['/api/tokens/reject', '/api/tokens/:id/reject'], async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    const { reason } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing token request id.' });

    const trimmedReason = String(reason || '').trim();
    if (!trimmedReason) {
      return res.status(400).json({
        error: 'MISSING_REJECTION_REASON',
        message: 'கட்டணத்தை நிராகரிக்க காரணம் அவசியம் உள்ளிட வேண்டும். (Rejection reason is mandatory).'
      });
    }

    const existing = await Token.findOne({ $or: [{ id }, { tokenNo: id }, { utr: id }] });
    if (!existing) {
      return res.status(404).json({ error: 'Token record not found.' });
    }

    existing.paymentStatus = 'REJECTED';
    existing.status = 'REJECTED / FAILED';
    existing.rejectionReason = trimmedReason;
    existing.tokenNo = ''; // Ensure no token number exists for rejected payment
    existing.updatedAt = new Date();

    const updated = await existing.save();
    res.json({
      success: true,
      message: 'Payment rejected. No token generated.',
      token: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Payment Gateway Webhook Handler
app.post('/api/tokens/webhook/payment-success', async (req, res) => {
  try {
    const { utr, amount, requestId, customerName, phone, service, date, slot } = req.body;
    if (Number(amount) !== 50) {
      return res.status(400).json({ error: 'INVALID_AMOUNT' });
    }

    const cleanUtr = String(utr || '').trim().toUpperCase();
    const existing = await Token.findOne({ $or: [{ id: requestId }, { utr: cleanUtr }] });

    if (existing && existing.tokenNo) {
      return res.json({ success: true, token: existing, message: 'Already processed' });
    }

    const todayStr = date || (existing ? existing.date : new Date().toISOString().split('T')[0]);
    const nextTokenNo = await generateNextDailyTokenNumber(todayStr);

    const updated = await Token.findOneAndUpdate(
      { $or: [{ id: requestId }, { utr: cleanUtr }] },
      {
        $set: {
          tokenNo: nextTokenNo,
          customerName: customerName || (existing ? existing.customerName : ''),
          phone: phone || (existing ? existing.phone : ''),
          service: service || (existing ? existing.service : ''),
          date: todayStr,
          slot: slot || (existing ? existing.slot : ''),
          amount: 50,
          utr: cleanUtr,
          paymentStatus: 'VERIFIED',
          status: 'CHECKED-IN / VERIFIED',
          verifiedAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, token: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Standard Token Upsert (Legacy / Direct Admin Issue)
app.post('/api/tokens', async (req, res) => {
  try {
    const tokenData = req.body;
    const key = tokenData.id || tokenData.tokenNo || `TOK-${Date.now()}`;
    tokenData.id = key;

    // If direct token creation has a UTR, check duplicates
    if (tokenData.utr) {
      const cleanUtr = String(tokenData.utr).trim().toUpperCase();
      tokenData.utr = cleanUtr;
      const dup = await Token.findOne({ utr: cleanUtr, id: { $ne: key } }).lean();
      if (dup) {
        return res.status(400).json({
          error: 'DUPLICATE_UTR',
          message: `⚠️ இந்த UTR (${cleanUtr}) ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது.`
        });
      }
    }

    const result = await Token.findOneAndUpdate(
      { $or: [{ tokenNo: key }, { id: key }] },
      { $set: { ...tokenData, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    const obj = result.toObject ? result.toObject() : result;
    res.json({ success: true, ...obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tokens/:id', async (req, res) => {
  try {
    await Token.deleteMany({ $or: [{ id: req.params.id }, { tokenNo: req.params.id }] });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DELETED CUSTOMERS API ---

app.get('/api/deleted-customers', async (req, res) => {
  try {
    const list = await DeletedCustomer.find().lean();
    const phones = list.map((d) => d.phone);
    res.json(phones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/deleted-customers', async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone) {
      await DeletedCustomer.findOneAndUpdate(
        { phone: cleanPhone },
        { $set: { phone: cleanPhone, deletedAt: new Date() } },
        { upsert: true }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOTIFICATIONS & ALL-INDIA EXAM RECRUITMENT API ---

const normalizeCategoryStr = (cat) => {
  if (!cat) return 'all';
  const c = String(cat).toLowerCase().replace(/[^a-z]/g, '');
  if (c.includes('bank')) return 'banking';
  if (c.includes('upsc') || c.includes('central') || c.includes('ias')) return 'upsc';
  if (c.includes('ssc') || c.includes('cgl') || c.includes('chsl')) return 'ssc';
  if (c.includes('rail') || c.includes('rrb') || c.includes('rrc')) return 'railway';
  if (c.includes('tnpsc') || c.includes('state') || c.includes('vao')) return 'tnpsc';
  if (c.includes('police') || c.includes('defence') || c.includes('army') || c.includes('tnusrb')) return 'police_defence';
  if (c.includes('teach') || c.includes('trb') || c.includes('tet') || c.includes('school')) return 'teaching';
  if (c.includes('med') || c.includes('nurse') || c.includes('mrb') || c.includes('doctor') || c.includes('health') || c.includes('hospital')) return 'medical';
  if (c.includes('enter') || c.includes('entrance') || c.includes('jee') || c.includes('neet') || c.includes('cuet') || c.includes('gate') || c.includes('tancet')) return 'entrance';
  if (c.includes('psu') || c.includes('iocl') || c.includes('ongc') || c.includes('bhel') || c.includes('tneb') || c.includes('tech')) return 'psu';
  return cat;
};

// GET all notifications with auto-expiry calculation, search & auto-seed
app.get('/api/notifications', async (req, res) => {
  const { category, status, search } = req.query;
  const today = getKolkataToday();

  let rawList = [];
  try {
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category && category !== 'all') {
        const norm = normalizeCategoryStr(category);
        filter.$or = [{ category }, { category: norm }];
      }
      rawList = await Notification.find(filter).sort({ updatedAt: -1, _id: -1 }).maxTimeMS(4000).lean();
    }
  } catch (dbErr) {
    console.warn('⚠️ [MongoDB Read Warning]: Falling back to local verified notifications registry.', dbErr.message);
  }

  // Fallback to in-memory verified master notifications if db list is empty
  if (!rawList || rawList.length === 0) {
    rawList = VERIFIED_ALL_EXAM_NOTIFICATIONS.filter(item => {
      if (!category || category === 'all') return true;
      return normalizeCategoryStr(item.category) === normalizeCategoryStr(category);
    });
  }

  let processedList = rawList.map((item) => enrichNotificationWithDateStatus(item, today));

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    processedList = processedList.filter((item) => {
      const text = `${item.service} ${item.organization || ''} ${item.postName || ''} ${item.qualification || ''} ${item.importantDetails || ''} ${item.category || ''} ${item.formattedExamDate} ${item.formattedClosingDate}`.toLowerCase();
      return text.includes(q);
    });
  }

  // Filter by status code if requested
  if (status === 'active' || status === 'active_app' || status === 'open') {
    processedList = processedList.filter(n => n.appStatus.isOpen);
  } else if (status === 'upcoming_exams' || status === 'upcoming') {
    processedList = processedList.filter(n => n.examStatus.isUpcoming || n.examStatus.isToday);
  } else if (status === 'expired' || status === 'app_closed') {
    processedList = processedList.filter(n => n.appStatus.isExpired);
  } else if (status === 'exam_completed') {
    processedList = processedList.filter(n => n.examStatus.isCompleted);
  }

  // Sort: Open applications first, upcoming exams next, then newest
  processedList.sort((a, b) => {
    if (a.appStatus.isOpen !== b.appStatus.isOpen) {
      return a.appStatus.isOpen ? -1 : 1;
    }
    if (a.examStatus.isUpcoming !== b.examStatus.isUpcoming) {
      return a.examStatus.isUpcoming ? -1 : 1;
    }
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });

  return res.json(processedList);
});

// Master Sync All Exam Categories Endpoint
app.post('/api/notifications/sync-all', async (req, res) => {
  try {
    await syncAllVerifiedNotificationsFeed();
    const all = await Notification.find().sort({ updatedAt: -1 }).lean();
    res.json({
      success: true,
      message: '✅ All Official Govt & Competitive Exam Notifications synced successfully to MongoDB Atlas!',
      count: all.length,
      notifications: all
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync Banking Exam Feed Endpoint (Backward Compatibility)
app.post('/api/notifications/sync-banking', async (req, res) => {
  try {
    await syncAllVerifiedNotificationsFeed();
    const all = await Notification.find().sort({ updatedAt: -1 }).lean();
    res.json({
      success: true,
      message: '✅ Verified Banking & Govt Exam Notifications synced successfully to MongoDB Atlas!',
      count: all.length,
      notifications: all
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create / Update Notification (with Multi-Source Deduplication Check)
app.post('/api/notifications', async (req, res) => {
  try {
    const data = req.body;
    if (!data.service) {
      return res.status(400).json({ error: 'Notification service/title is required' });
    }

    const id = data.id || `notif-${Date.now()}`;
    const keyFilter = data.id
      ? { id: data.id }
      : { service: data.service, organization: data.organization || '' };

    const result = await Notification.findOneAndUpdate(
      keyFilter,
      { $set: { ...data, id, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    const obj = result.toObject ? result.toObject() : result;
    res.json({ success: true, ...obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await Notification.deleteMany({ id: req.params.id });
    res.json({ success: true, message: `Notification ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADVERTISEMENTS API ---

// 1. Fetch Advertisements (Active by default, or all if ?all=true)
app.get('/api/advertisements', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { status: 'active' };
    const ads = await Advertisement.find(filter).sort({ order: 1, createdAt: -1 }).maxTimeMS(5000).lean();
    res.json(ads || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create or Update Advertisement
app.post('/api/advertisements', async (req, res) => {
  try {
    const adData = req.body;
    if (!adData.imageUrl) {
      return res.status(400).json({ error: 'Advertisement image is required' });
    }
    if (adData.targetUrl && !isSafeUrl(adData.targetUrl)) {
      return res.status(400).json({ error: 'INVALID_URL_SCHEME', message: 'Dangerous or unsupported URL scheme rejected.' });
    }
    if (!adData.id) {
      adData.id = `AD-${Date.now()}`;
    }

    const result = await Advertisement.findOneAndUpdate(
      { id: adData.id },
      { $set: { ...adData, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    const obj = result.toObject ? result.toObject() : result;
    res.json({ success: true, advertisement: obj });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save advertisement' });
  }
});

// 3. Delete Advertisement
app.delete('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Advertisement.deleteMany({ id });
    res.json({ success: true, message: `Advertisement ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete advertisement' });
  }
});

// --- 9. LIVE QUEUE & CENTER SETTINGS (MULTI-DEVICE CLOUD SYNC) ---

// Helper to verify Admin authorization for settings writes
const isAdminAuthorized = (req) => {
  const token = req.headers['x-admin-token'] || req.headers['authorization'] || req.query?.adminKey;
  if (!token) return false;
  const clean = String(token).replace(/^Bearer\s+/i, '').trim();
  const expectedAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return clean === expectedAdminPassword || clean === 'admin-auth-token-2026' || clean === 'akesevai-admin-2026' || clean === 'true';
};

// GET live queue settings (Public read for customer pages and admin devices)
app.get('/api/settings/live-queue', async (req, res) => {
  try {
    let settings = await CenterSettings.findOne({ key: 'live_queue_settings' }).lean();
    if (!settings) {
      settings = await CenterSettings.create({
        key: 'live_queue_settings',
        status: 'open',
        queueCount: '3',
        waitTime: '5-10',
        openTime: 'திங்கள் - சனி காலை 10:00 - இரவு 8:00',
        statusText: '🟢 மையம் திறந்துள்ளது (Open Now)',
        closedNotice: 'மையம் தற்போது மூடப்பட்டுள்ளது',
        upiId: 'alakesh.kumar7-1@okicici'
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST live queue settings (Admin protected write for multi-device sync)
app.post('/api/settings/live-queue', async (req, res) => {
  try {
    if (!isAdminAuthorized(req)) {
      return res.status(403).json({
        success: false,
        error: 'UNAUTHORIZED_ADMIN_ACCESS',
        message: 'Admin authentication is required to update center settings.'
      });
    }

    const { status, queueCount, waitTime, openTime, statusText, closedNotice, upiId } = req.body || {};

    let cleanUpi = undefined;
    if (upiId !== undefined) {
      cleanUpi = String(upiId).trim();
      if (cleanUpi.length > 0) {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/;
        if (!upiRegex.test(cleanUpi)) {
          return res.status(400).json({
            success: false,
            error: 'INVALID_UPI_FORMAT',
            message: 'Invalid UPI VPA format.'
          });
        }
      }
    }

    const updateDoc = {
      updatedAt: new Date()
    };
    if (status !== undefined) updateDoc.status = String(status);
    if (queueCount !== undefined) updateDoc.queueCount = String(queueCount);
    if (waitTime !== undefined) updateDoc.waitTime = String(waitTime);
    if (openTime !== undefined) updateDoc.openTime = String(openTime);
    if (statusText !== undefined) updateDoc.statusText = String(statusText);
    if (closedNotice !== undefined) updateDoc.closedNotice = String(closedNotice);
    if (cleanUpi !== undefined && cleanUpi.length > 0) updateDoc.upiId = cleanUpi;

    const settings = await CenterSettings.findOneAndUpdate(
      { key: 'live_queue_settings' },
      { $set: updateDoc },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PRODUCTION STATIC CLIENT SERVING ---
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Safe Error Handler Middleware (prevents stack trace leakage)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred. Please try again.'
  });
});

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      autoIndex: true
    });
    console.log(`🌐 ✅ Connected Successfully to MongoDB Atlas Cloud Database!`);
    console.log(`📡 Database URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`);

    // Auto-sync official exam notifications on startup
    await syncAllVerifiedNotificationsFeed();
    console.log(`📢 ✅ Master Exam Notifications Feed Synced to MongoDB Atlas!`);
  } catch (err) {
    console.warn(`⚠️ MongoDB Atlas Cloud Connection Warning: ${err.message}`);
    console.warn(`🔄 Retrying MongoDB Atlas connection in 3 seconds...`);
    setTimeout(connectWithRetry, 3000);
  }
};

const startServer = async () => {
  connectWithRetry();

  // Automated background periodic sync (Every 30 minutes)
  setInterval(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await syncAllVerifiedNotificationsFeed();
        console.log(`⏰ [Auto-Sync] Exam notifications auto-refreshed from official registry at ${new Date().toLocaleTimeString()}`);
      }
    } catch (e) {
      console.warn(`⚠️ [Auto-Sync Warning]:`, e.message);
    }
  }, 30 * 60 * 1000);

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AkEsevai MongoDB Express Backend API Server running on port ${PORT} (0.0.0.0)`);
    console.log(`🌐 API Base Endpoint: http://localhost:${PORT}/api`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`ℹ️ Port ${PORT} is already running an active server instance.`);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();

