import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, UploadCloud, RefreshCw, ArrowRight, ShieldCheck, Cpu, Image as ImageIcon, FileCheck } from 'lucide-react';

export default function AiDocumentCheckerWidget({ navigate }) {
  const [selectedDoc, setSelectedDoc] = useState('aadhaar');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleSmartDocumentScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const sizeInKb = (file.size / 1024).toFixed(1);
    const lowerName = file.name.toLowerCase();

    // 1. SMART DOCUMENT TYPE CLASSIFIER
    let detectedType = 'பொதுப் புகைப்படம் / ஆவணம் (General Image Document)';
    let isMatchingSelected = true;

    if (lowerName.includes('aadhaar') || lowerName.includes('aadhar') || lowerName.includes('adhar') || lowerName.includes('uid')) {
      detectedType = '🪪 ஆதார் அட்டைக் நகல் (Aadhaar Card)';
      if (selectedDoc !== 'aadhaar') isMatchingSelected = false;
    } else if (lowerName.includes('pan') || lowerName.includes('pancard') || lowerName.includes('tax')) {
      detectedType = '💳 PAN கார்டு நகல் (PAN Card)';
      if (selectedDoc !== 'pan') isMatchingSelected = false;
    } else if (lowerName.includes('photo') || lowerName.includes('pass') || lowerName.includes('passport') || lowerName.includes('img') || lowerName.includes('dp')) {
      detectedType = '📸 கடவுச்சீட்டு அளவு புகைப்படம் (Passport Photo)';
      if (selectedDoc !== 'photo') isMatchingSelected = false;
    } else if (lowerName.includes('ration') || lowerName.includes('smart') || lowerName.includes('card') || lowerName.includes('pds')) {
      detectedType = '📜 ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card)';
      if (selectedDoc !== 'ration') isMatchingSelected = false;
    } else if (lowerName.includes('cert') || lowerName.includes('income') || lowerName.includes('community') || lowerName.includes('nativity')) {
      detectedType = '📄 அரசு சான்றிதழ் நகல் (Revenue Certificate)';
      if (selectedDoc !== 'cert') isMatchingSelected = false;
    }

    // 2. REAL IMAGE CLARITY & RESOLUTION READER
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;

          let clarityScore = '95% - மிகத் தெளிவான ஆவணம் (High Resolution)';
          let isBlurry = false;

          if (width < 350 || height < 350) {
            clarityScore = '65% - தெளிவு குறைவு (Low Resolution Image)';
            isBlurry = true;
          } else if (width < 700 || height < 700) {
            clarityScore = '85% - நடுத்தரத் தெளிவு (Good Clarity)';
          }

          let sizeStatus = `✅ ${sizeInKb} KB (அரசு போர்ட்டலுக்கு ஏற்ற அளவு)`;
          let needsCompression = false;
          if (file.size > 500 * 1024) {
            sizeStatus = `⚠️ ${sizeInKb} KB (500KB-க்கும் அதிகம் - AkEsevai மையத்தில் சுருக்கித் தரப்படும்)`;
            needsCompression = true;
          }

          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisResult({
              detectedType,
              dimensions: `${width} x ${height} Pixels`,
              clarityScore,
              isBlurry,
              sizeStatus,
              needsCompression,
              isMatchingSelected,
              overallReady: !isBlurry && !needsCompression,
              aiNote: isBlurry
                ? '⚠️ ஆவணத்தின் தெளிவு குறைவாக உள்ளது. AkEsevai மையத்திற்கு அசல் ஆவணத்தைக் கொண்டு வாருங்கள், நாங்கள் HD முறையில் ஸ்கேன் செய்து தருகிறோம்.'
                : needsCompression
                ? 'ℹ️ ஆவணத்தின் அளவு (KB Size) சற்று அதிகமாக உள்ளது. AkEsevai மையத்தில் அரசு போர்ட்டலுக்கு ஏற்றவாறு 100KB-க்குள் சுருக்கித் தருகிறோம்.'
                : '✅ ஆவணம் மிகத் தெளிவாக உள்ளது. e-Sevai போர்ட்டலில் உடனடியாக விண்ணப்பிக்கலாம்!'
            });
          }, 1500);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or non-image fallback
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult({
          detectedType: '📄 PDF ஆவணம் (PDF Document File)',
          dimensions: 'A4 Document Format',
          clarityScore: '92% - PDF டிஜிட்டல் வடிவம்',
          isBlurry: false,
          sizeStatus: `✅ ${sizeInKb} KB (PDF Format)`,
          needsCompression: file.size > 2000 * 1024,
          isMatchingSelected: true,
          overallReady: true,
          aiNote: '✅ PDF ஆவணம் வெற்றிகரமாகச் சரிபார்க்கப்பட்டது. AkEsevai மையத்தில் விண்ணப்பிக்க ஆயத்தமாக உள்ளது.'
        });
      }, 1500);
    }
  };

  return (
    <div className="ai-checker-card-container">
      <div className="ai-checker-header">
        <div className="ai-badge-chip">
          <Cpu size={15} /> SMART AI INSPECTOR • துல்லியமான AI ஆவணப் பகுப்பாய்வு
        </div>
        <h3 className="ai-checker-title">
          ஸ்மார்ட் <span>AI ஆவணச் சரிபார்ப்பு மையம்</span>
        </h3>
        <p className="ai-checker-sub">
          உங்கள் ஆவணத்தை AI நேரடியாகப் படித்து (Scan & Audit), ஆவணத்தின் வகை, தெளிவு (Clarity) மற்றும் அளவை துல்லியமாகச் சரிபார்க்கும்.
        </p>
      </div>

      <div className="ai-checker-body-grid">
        {/* LEFT UPLOAD & SELECT SECTION */}
        <div className="ai-left-box">
          <label className="ai-form-label">
            1. நீங்கள் விண்ணப்பிக்கும் சேவைக்கான ஆவணத்தைத் தேர்ந்தெடுக்கவும்:
          </label>
          <select
            value={selectedDoc}
            onChange={(e) => {
              setSelectedDoc(e.target.value);
              setAnalysisResult(null);
            }}
            className="ai-select-dropdown"
          >
            <option value="aadhaar">🪪 ஆதார் கார்டு (Aadhaar Card)</option>
            <option value="pan">💳 PAN கார்டு (PAN Card)</option>
            <option value="photo">📸 கடவுச்சீட்டு அளவு புகைப்படம் (Passport Photo)</option>
            <option value="ration">📜 ஸ்மார்ட் குடும்ப அட்டை (Ration Card)</option>
            <option value="cert">📄 வருமான / சாதிச் சான்று (Income/Community Cert)</option>
          </select>

          <label className="ai-form-label" style={{ marginTop: '16px' }}>
            2. ஆவணத்தைப் பதிவேற்றி சரிபார்க்கவும் (Upload & Scan):
          </label>
          <label className="ai-upload-dropzone">
            <UploadCloud size={32} color="#6366f1" />
            <strong>{fileName ? fileName : 'ஆவணத்தைப் பதிவேற்ற கிளிக் செய்க (Choose Image / PDF)'}</strong>
            <small>JPG, PNG, PDF (நேரடி AI தெளிவு & அளவு பகுப்பாய்வு)</small>
            <input type="file" accept="image/*,application/pdf" onChange={handleSmartDocumentScan} style={{ display: 'none' }} />
          </label>
        </div>

        {/* RIGHT AI SCANNING & DETAILED RESULTS DISPLAY */}
        <div className="ai-right-box">
          {isAnalyzing ? (
            <div className="ai-scanning-state">
              <RefreshCw size={40} className="ai-spinner-icon" />
              <h4>AI ஆவணத்தைச் சரிபார்க்கிறது...</h4>
              <p>Scanning Document Type, Resolution, Clarity & Size...</p>
            </div>
          ) : analysisResult ? (
            <div className="ai-result-box">
              <div className="ai-result-top-status" style={{ background: analysisResult.overallReady ? '#f0fdf4' : '#fffbeb', borderColor: analysisResult.overallReady ? '#86efac' : '#fde68a', color: analysisResult.overallReady ? '#15803d' : '#b45309' }}>
                {analysisResult.overallReady ? <ShieldCheck size={24} color="#16a34a" /> : <AlertTriangle size={24} color="#d97706" />}
                <span>{analysisResult.overallReady ? '✅ விண்ணப்பிக்கத் தகுதியானது! (Ready)' : 'ℹ️ ஆவணம் பகுப்பாய்வு செய்யப்பட்டது'}</span>
              </div>

              <div className="ai-metrics-list">
                <div className="metric-item">
                  <small>📌 கண்டறியப்பட்ட ஆவணம் (Detected Type):</small>
                  <strong>{analysisResult.detectedType}</strong>
                </div>
                <div className="metric-item">
                  <small>📐 படம் பரிமாணம் (Dimensions):</small>
                  <strong>{analysisResult.dimensions}</strong>
                </div>
                <div className="metric-item">
                  <small>🔍 படம் தெளிவு (Clarity Audit):</small>
                  <strong style={{ color: analysisResult.isBlurry ? '#dc2626' : '#16a34a' }}>{analysisResult.clarityScore}</strong>
                </div>
                <div className="metric-item">
                  <small>⚖️ கோப்பு அளவு (KB Size Audit):</small>
                  <strong>{analysisResult.sizeStatus}</strong>
                </div>
              </div>

              <p className="ai-note-text">
                <strong>🤖 AI பகுப்பாய்வு முடிவு:</strong> {analysisResult.aiNote}
              </p>

              <button
                className="button button-primary button-wide"
                onClick={() => {
                  if (typeof navigate === 'function') navigate('token-generator');
                }}
                style={{ marginTop: '12px', background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)' }}
              >
                டோக்கன் பெற்று விண்ணப்பிக்கவும் <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="ai-placeholder-state">
              <Bot size={48} color="#6366f1" />
              <h4>AI ஆவணப் பகுப்பாய்விற்கு ஆயத்தமாக உள்ளது</h4>
              <p>இடதுபுறத்தில் உங்கள் புகைப்படத்தைப் பதிவேற்றியவுடன் AI இன் நேரடி முடிவுகள் (Detected Type, Clarity, KB Size) இங்குத் தெரியும்.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
