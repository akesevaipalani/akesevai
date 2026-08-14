import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/akesevai';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
  status: { type: String, default: 'CHECKED-IN / VERIFIED' },
  updatedAt: { type: Date, default: Date.now }
});

// 5. Deleted Customer Schema
const deletedCustomerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  deletedAt: { type: Date, default: Date.now }
});

// Models
const Customer = mongoose.model('Customer', customerSchema);
const Application = mongoose.model('Application', applicationSchema);
const DocumentModel = mongoose.model('Document', documentSchema);
const Token = mongoose.model('Token', tokenSchema);
const DeletedCustomer = mongoose.model('DeletedCustomer', deletedCustomerSchema);

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'MongoDB', connected: mongoose.connection.readyState === 1 });
});

// --- CUSTOMERS API ---

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().lean();
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

// Save or Update customer
app.post('/api/customers', async (req, res) => {
  try {
    const { phone, name, profile, applications, documents, lastToken, dob, aadhaarNo } = req.body;
    const cleanPhone = cleanPhoneDigits(phone);
    if (!cleanPhone) return res.status(400).json({ error: 'Phone number is required' });

    const updateData = {
      phone: cleanPhone,
      updatedAt: new Date()
    };
    if (name) updateData.name = name;
    if (dob) updateData.dob = dob;
    if (aadhaarNo) updateData.aadhaarNo = aadhaarNo;
    if (profile) updateData.profile = profile;
    if (Array.isArray(applications)) updateData.applications = applications;
    if (Array.isArray(documents)) updateData.documents = documents;
    if (lastToken) updateData.lastToken = lastToken;

    const result = await Customer.findOneAndUpdate(
      { phone: cleanPhone },
      { $set: updateData },
      { upsert: true, new: true }
    );
    res.json(result);
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

    // 2. Cascade delete applications, documents, tokens
    await Application.deleteMany({ phone: cleanPhone });
    await DocumentModel.deleteMany({ customerPhone: cleanPhone });
    await Token.deleteMany({ phone: cleanPhone });

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
    const apps = await Application.find().lean();
    const records = {};
    apps.forEach((a) => {
      records[a.id] = a;
    });
    res.json(records);
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
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/applications/:id', async (req, res) => {
  try {
    await Application.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DOCUMENTS API ---

app.get('/api/documents', async (req, res) => {
  try {
    const docs = await DocumentModel.find().lean();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const docData = req.body;
    if (!docData.id) docData.id = `DOC-${Date.now()}`;

    const result = await DocumentModel.findOneAndUpdate(
      { id: docData.id },
      { $set: { ...docData, uploadedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    await DocumentModel.deleteMany({ $or: [{ id: req.params.id }, { url: req.params.id }] });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TOKENS API ---

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await Token.find().lean();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tokens', async (req, res) => {
  try {
    const tokenData = req.body;
    const key = tokenData.id || tokenData.tokenNo || `TOK-${Date.now()}`;
    tokenData.id = key;

    const result = await Token.findOneAndUpdate(
      { id: key },
      { $set: { ...tokenData, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json(result);
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

// --- START SERVER & MONGODB ATLAS CONNECTION ---

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true
    });
    console.log(`🌐 ✅ Connected Successfully to MongoDB Atlas Cloud Database!`);
    console.log(`📡 Database URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`);
  } catch (err) {
    console.warn(`⚠️ MongoDB Atlas Cloud Connection Warning: ${err.message}`);
    console.warn(`💡 Tip: Make sure your MongoDB Atlas connection string in .env is correct and IP 0.0.0.0/0 is allowed in Atlas Network Access.`);
  }

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
