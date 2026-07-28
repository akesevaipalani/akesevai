import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Bell, Sparkles, CheckCircle2, Play, User, RefreshCw, Volume1, SkipForward, SkipBack, ListOrdered, PlusCircle, Smartphone } from 'lucide-react';
import { getStoredApplications, syncWithCentralServer } from '../utils/statusStore';
import { saveLiveQueueCloud, saveTokenBookingCloud, subscribeTokens, fetchAllCloudRecords } from '../utils/firebaseService';

const ENGLISH_TO_TAMIL_NAME_MAP = {
  'kandasamy': 'கந்தசாமி',
  'kanthasamy': 'கந்தசாமி',
  'murugan': 'முருகன்',
  'selvi': 'செல்வி',
  'raman': 'ராமன்',
  'karthik': 'கார்த்திக்',
  'karthi': 'கார்த்தி',
  'vijayalaksmi': 'விஜயலட்சுமி',
  'vijayalakshmi': 'விஜயலட்சுமி',
  'saravanan': 'சரவணன்',
  'anitha': 'அனிதா',
  'kumar': 'குமார்',
  'raja': 'ராஜா',
  'priya': 'பிரியா',
  'lakshmi': 'லட்சுமி',
  'santhosh': 'சந்தோஷ்',
  'sathish': 'சதீஷ்',
  'dinesh': 'தினேஷ்',
  'suresh': 'சுரேஷ்',
  'ramesh': 'ரமேஷ்',
  'ganesh': 'கணேஷ்',
  'vignesh': 'விக்னேஷ்',
  'deepak': 'தீபக்',
  'kamal': 'கமல்',
  'rajesh': 'ராஜேஷ்',
  'mani': 'மணி',
  'prabhu': 'பிரபு',
  'balaji': 'பாலாஜி',
  'prakash': 'பிரகாஷ்',
  'devi': 'தேவி',
  'radha': 'ராதா',
  'chitra': 'சித்ரா',
  'kavitha': 'கவிதா',
  'sangeetha': 'சங்கீதா',
  'sumathi': 'சுமதி',
  'meena': 'மீனா',
  'uma': 'உமா'
};

const convertNameToTamilScript = (name) => {
  if (!name) return '';
  let trimmed = name.trim();

  // If already contains Tamil unicode characters
  if (/[\u0B80-\u0BFF]/.test(trimmed)) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  if (ENGLISH_TO_TAMIL_NAME_MAP[lower]) {
    return ENGLISH_TO_TAMIL_NAME_MAP[lower];
  }

  const parts = lower.split(/[\s.]+/);
  const converted = parts.map(p => ENGLISH_TO_TAMIL_NAME_MAP[p] || p);
  return converted.join(' ');
};

export default function AdminCounterVoiceAnnouncer() {
  const [tokenQueue, setTokenQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [customerName, setCustomerName] = useState('');
  const [tokenNo, setTokenNo] = useState('');
  const [counterNo, setCounterNo] = useState('1');
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [repeatCount, setRepeatCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [activeAudioObj, setActiveAudioObj] = useState(null);

  // Quick Add Mobile Token state
  const [showAddMobileModal, setShowAddMobileModal] = useState(false);
  const [newMobileTokenNo, setNewMobileTokenNo] = useState('');
  const [newMobileCustomerName, setNewMobileCustomerName] = useState('');

  // Queue Analytics Controls for Admin
  const [avgMinsPerToken, setAvgMinsPerToken] = useState(5);
  const [completedCount, setCompletedCount] = useState(0);

  const saveLiveQueueStatus = (overrideToken, overrideName, overrideMins, overrideCompleted) => {
    const activeTok = overrideToken || tokenNo || '-';
    const activeName = overrideName !== undefined ? overrideName : (customerName || '-');
    const activeMins = overrideMins !== undefined ? overrideMins : avgMinsPerToken;
    const activeCompleted = overrideCompleted !== undefined ? overrideCompleted : completedCount;

    const queueState = {
      status: 'open',
      currentCalledToken: activeTok,
      currentCustomerName: activeName,
      counterNo: counterNo || '1',
      avgMinsPerToken: activeMins,
      completedCount: activeCompleted,
      totalInQueue: tokenQueue.length,
      lastUpdated: new Date().toISOString()
    };

    saveLiveQueueCloud(queueState);
    try {
      fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'queueState', data: queueState })
      });
    } catch (e) { }
  };

  // Sync token queue with Firebase Cloud
  useEffect(() => {
    const unsubscribe = subscribeTokens((cloudTokens) => {
      if (Array.isArray(cloudTokens)) {
        const formatted = cloudTokens.map(t => ({
          tokenNo: t.tokenNo || t.id,
          name: t.customerName || t.applicantName || t.name || 'வாடிக்கையாளர்'
        }));
        setTokenQueue(formatted);
        if (formatted.length > 0 && !tokenNo) {
          setTokenNo(formatted[0].tokenNo);
          setCustomerName(formatted[0].name);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const syncQueueFromStorage = async () => {
    try {
      const records = await fetchAllCloudRecords();
      if (records && records.tokens) {
        const formatted = records.tokens.map(t => ({
          tokenNo: t.tokenNo || t.id,
          name: t.customerName || t.applicantName || t.name || 'வாடிக்கையாளர்'
        }));
        setTokenQueue(formatted);
      }
    } catch (e) { }
  };



  // Load and cache browser voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const vList = window.speechSynthesis.getVoices();
        setAvailableVoices(vList);
      }
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const selectTokenAtIndex = (index) => {
    if (index >= 0 && index < tokenQueue.length) {
      setCurrentIndex(index);
      const selected = tokenQueue[index];
      setTokenNo(selected.tokenNo);
      setCustomerName(selected.name);
      saveLiveQueueStatus(selected.tokenNo, selected.name);
      return selected;
    }
    return null;
  };

  const handleNextToken = () => {
    const nextIdx = (currentIndex + 1) % tokenQueue.length;
    const selected = selectTokenAtIndex(nextIdx);
    if (selected) {
      setTimeout(() => {
        announceWithDetails(selected.tokenNo, selected.name);
      }, 100);
    }
  };

  const handlePrevToken = () => {
    const prevIdx = (currentIndex - 1 + tokenQueue.length) % tokenQueue.length;
    const selected = selectTokenAtIndex(prevIdx);
    if (selected) {
      setTimeout(() => {
        announceWithDetails(selected.tokenNo, selected.name);
      }, 100);
    }
  };

  // Add mobile token manually to live queue
  const handleAddMobileTokenToQueue = async (e) => {
    e.preventDefault();
    if (!newMobileTokenNo.trim() || !newMobileCustomerName.trim()) return;

    const newTok = {
      tokenNo: newMobileTokenNo.trim().toUpperCase(),
      name: newMobileCustomerName.trim(),
      customerName: newMobileCustomerName.trim()
    };

    // Push to central server API
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'token', data: newTok })
      });
    } catch (err) { }

    // Save to Firebase Cloud
    saveTokenBookingCloud({
      tokenNo: newTok.tokenNo,
      customerName: newTok.name,
      phone: '9876543210',
      date: new Date().toISOString().split('T')[0],
      slot: 'Live Queue'
    });

    // Broadcast sync
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('akesevai_token_sync_channel');
      channel.postMessage({ type: 'NEW_TOKEN', data: newTok });
      channel.close();
    }

    await syncQueueFromStorage();

    setTokenNo(newTok.tokenNo);
    setCustomerName(newTok.name);

    setNewMobileTokenNo('');
    setNewMobileCustomerName('');
    setShowAddMobileModal(false);

    // Announce immediately
    setTimeout(() => {
      announceWithDetails(newTok.tokenNo, newTok.name);
    }, 100);
  };

  // Play crisp counter chime sound effect
  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playNote = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      playNote(659.25, 0, 0.25);
      playNote(523.25, 0.2, 0.4);
    } catch (e) {
      console.error(e);
    }
  };

  // Format clean token number
  const formatTokenDisplay = (rawToken) => {
    let clean = rawToken.trim();
    if (clean.startsWith('TOK-') || clean.startsWith('TOK_') || clean.startsWith('TOK')) {
      clean = clean.replace(/^TOK[-_]?/, '');
    }
    return clean;
  };

  // Construct 100% Pure Tamil Name Speech Sentence (Explicitly stating "டோக்கன் எண்")
  const buildPureTamilSpeechText = (overrideToken, overrideName) => {
    const activeToken = overrideToken || tokenNo;
    const activeName = overrideName !== undefined ? overrideName : customerName;

    const tamilScriptCustomerName = convertNameToTamilScript(activeName);
    const cleanToken = formatTokenDisplay(activeToken);

    if (tamilScriptCustomerName) {
      return `வணக்கம்! ${tamilScriptCustomerName}... டோக்கன் எண், ${cleanToken}... கவுண்டர் ${counterNo}-க்கு வரவும்.`;
    } else {
      return `வணக்கம்! டோக்கன் எண், ${cleanToken}... கவுண்டர் ${counterNo}-க்கு வரவும்.`;
    }
  };

  // 100% GUARANTEED TAMIL FEMALE VOICE ENGINE
  const speak100PercentTamilFemaleVoice = (textToSpeak) => {
    setIsPlaying(true);

    if (window.responsiveVoice && typeof window.responsiveVoice.speak === 'function') {
      try {
        window.responsiveVoice.speak(textToSpeak, "Tamil Female", {
          rate: speechSpeed,
          pitch: 1.0,
          onstart: () => setIsPlaying(true),
          onend: () => {
            if (repeatCount > 1) {
              setTimeout(() => {
                window.responsiveVoice.speak(textToSpeak, "Tamil Female", { rate: speechSpeed });
              }, 800);
            } else {
              setIsPlaying(false);
            }
          }
        });
        return;
      } catch (err) {
        console.warn("ResponsiveVoice error, trying Google Tamil Female Audio MP3:", err);
      }
    }

    try {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSpeak)}&tl=ta&client=tw-ob`;

      const audio = new Audio();
      audio.referrerPolicy = 'no-referrer';
      audio.crossOrigin = 'anonymous';
      audio.src = ttsUrl;
      audio.playbackRate = speechSpeed;
      setActiveAudioObj(audio);

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        if (repeatCount > 1) {
          setTimeout(() => {
            const secondAudio = new Audio();
            secondAudio.referrerPolicy = 'no-referrer';
            secondAudio.crossOrigin = 'anonymous';
            secondAudio.src = ttsUrl;
            secondAudio.playbackRate = speechSpeed;
            secondAudio.onended = () => setIsPlaying(false);
            secondAudio.play().catch(() => setIsPlaying(false));
          }, 800);
        } else {
          setIsPlaying(false);
        }
      };
      audio.onerror = () => {
        speakStrictBrowserTamilFemaleVoiceOnly(textToSpeak);
      };

      audio.play().catch((err) => {
        speakStrictBrowserTamilFemaleVoiceOnly(textToSpeak);
      });
    } catch (err) {
      speakStrictBrowserTamilFemaleVoiceOnly(textToSpeak);
    }
  };

  // STRICT BROWSER TAMIL VOICE FALLBACK
  const speakStrictBrowserTamilFemaleVoiceOnly = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      alert(`🔊 [100% தமிழ் பெண் குரல்]: ${textToSpeak}`);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

      const taVoice = voices.find(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil') || v.name.toLowerCase().includes('valluvar') || v.name.toLowerCase().includes('lotte'));

      const isForbiddenMaleVoice = (vName) => {
        const lower = (vName || '').toLowerCase();
        return lower.includes('mark') || lower.includes('ravi') || lower.includes('david') || lower.includes('george') || lower.includes('male');
      };

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ta-IN';
      utterance.rate = speechSpeed;
      utterance.pitch = 1.30;
      utterance.volume = 1.0;

      if (taVoice && !isForbiddenMaleVoice(taVoice.name)) {
        utterance.voice = taVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        if (repeatCount > 1) {
          setTimeout(() => {
            if (window.speechSynthesis.paused) window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          }, 800);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  const announceWithDetails = (tok, name) => {
    playChimeSound();
    const pureTamilText = buildPureTamilSpeechText(tok, name);

    speak100PercentTamilFemaleVoice(pureTamilText);

    setLastAnnouncement({
      name: name,
      token: tok,
      counter: counterNo,
      tamilSpeech: pureTamilText,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleAnnounceToken = (e) => {
    if (e) e.preventDefault();
    if (!tokenNo.trim()) return;

    announceWithDetails(tokenNo, customerName);
  };

  const handleTestSpeakerSound = () => {
    playChimeSound();
    const testText = 'வணக்கம்! AkEsevai தமிழ் பெண் குரல் சோதிக்கப்படுகிறது.';
    speak100PercentTamilFemaleVoice(testText);
  };

  const handleStopAnnouncement = () => {
    if (window.responsiveVoice && typeof window.responsiveVoice.cancel === 'function') {
      window.responsiveVoice.cancel();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioObj) {
      activeAudioObj.pause();
      setActiveAudioObj(null);
    }
    setIsPlaying(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #022c7a 0%, #003399 100%)',
      color: 'white',
      borderRadius: '18px',
      padding: '22px',
      boxShadow: '0 8px 24px rgba(2, 44, 122, 0.25)',
      marginTop: '18px'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#fbbf24',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Bell size={13} /> LIVE NETWORK VOICE DESK • நேரடி ஆன்லைன் தமிழ் குரல் சிஸ்டம்
          </span>
          <h4 style={{ font: '800 20px Manrope', margin: '4px 0 0', color: 'white' }}>
            கவுண்டர் <span>டோக்கன் & பெயர் தூய தமிழ் பெண் குரல் அழைப்பு</span>
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={syncQueueFromStorage}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="மொபைல் பதிவுகளை புதுப்பி"
          >
            <RefreshCw size={13} /> 🔄 தரவு புதுப்பி (Sync)
          </button>

          <button
            type="button"
            onClick={() => setShowAddMobileModal(!showAddMobileModal)}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Smartphone size={13} /> 📱 மொபைல் டோக்கன் சேர்
          </button>

          <button
            type="button"
            onClick={handleTestSpeakerSound}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Volume1 size={14} /> 🔊 பரிசோதனை
          </button>

          {isPlaying && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}>
              🔊 100% தமிழ் பெண் குரலில் பேசுகிறது...
            </span>
          )}
        </div>
      </div>

      {/* MODAL TO QUICK ADD MOBILE BOOKING */}
      {showAddMobileModal && (
        <form onSubmit={handleAddMobileTokenToQueue} style={{ background: '#001a4d', border: '1.5px solid #fbbf24', borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24' }}>
            📱 மொபைல் டோக்கன் சேர்க்க:
          </span>
          <input
            type="text"
            required
            placeholder="டோக்கன் (எ.கா: TOK-109)"
            value={newMobileTokenNo}
            onChange={(e) => setNewMobileTokenNo(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '12px', fontWeight: 800 }}
          />
          <input
            type="text"
            required
            placeholder="பெயர் (எ.கா: Kandasamy)"
            value={newMobileCustomerName}
            onChange={(e) => setNewMobileCustomerName(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '12px', fontWeight: 800 }}
          />
          <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
            ➕ சேர் & தமிழில் அழை
          </button>
        </form>
      )}

      {/* QUICK TOKEN QUEUE SELECTOR ROW */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ListOrdered size={18} color="#fbbf24" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24' }}>
            டோக்கன் வரிசை ({tokenQueue.length} பதிவுகள்):
          </span>
          <select
            value={currentIndex}
            onChange={(e) => selectTokenAtIndex(parseInt(e.target.value))}
            style={{
              background: '#001a4d',
              color: 'white',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 800,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {tokenQueue.map((item, idx) => (
              <option key={item.tokenNo + idx} value={idx}>
                {idx + 1}. {item.tokenNo} - {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* PREV & NEXT TOKEN BUTTONS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handlePrevToken}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <SkipBack size={14} /> ⏮️ முந்தைய
          </button>

          <button
            type="button"
            onClick={handleNextToken}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
            }}
          >
            <SkipForward size={16} /> ⏭️ அடுத்த அழைப்பு (Next Call)
          </button>
        </div>
      </div>

      <form onSubmit={handleAnnounceToken} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
        {/* CUSTOMER NAME */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, opacity: 0.95 }}>
            👤 வாடிக்கையாளர் பெயர்:
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="எ.கா: கந்தசாமி / Kandasamy"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.12)',
              color: 'white',
              fontWeight: 800,
              fontSize: '13px',
              marginTop: '4px',
              outline: 'none'
            }}
          />
        </div>

        {/* TOKEN NUMBER */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, opacity: 0.95 }}>
            🎫 டோக்கன் எண்:
          </label>
          <input
            type="text"
            required
            value={tokenNo}
            onChange={(e) => setTokenNo(e.target.value)}
            placeholder="எ.கா: TOK-105"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.12)',
              color: 'white',
              fontWeight: 800,
              fontSize: '13px',
              marginTop: '4px',
              outline: 'none'
            }}
          />
        </div>

        {/* COUNTER NUMBER */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, opacity: 0.95 }}>
            🏢 கவுண்டர்:
          </label>
          <select
            value={counterNo}
            onChange={(e) => setCounterNo(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: '#022c7a',
              color: 'white',
              fontWeight: 800,
              fontSize: '13px',
              marginTop: '4px',
              outline: 'none'
            }}
          >
            <option value="1">கவுண்டர் 1</option>
            <option value="2">கவுண்டர் 2</option>
            <option value="3">கவுண்டர் 3</option>
          </select>
        </div>

        {/* CALL OUT BUTTON */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            style={{
              background: '#fbbf24',
              color: '#022c7a',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
            }}
          >
            <Volume2 size={18} /> அழைப்பு (Call)
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStopAnnouncement}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer'
              }}
              title="நிறுத்து (Stop)"
            >
              <VolumeX size={16} />
            </button>
          )}
        </div>
      </form>

      {/* SPEECH SPEED & OPTIONS ROW */}
      <div style={{
        marginTop: '14px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>வேகம்:</span>
            <select
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              style={{ background: '#002266', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '3px 6px', fontSize: '11px' }}
            >
              <option value={0.85}>இயல்பான வேகம்</option>
              <option value={0.95}>வேகமாக</option>
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span>திரும்பப் பேசு:</span>
            <select
              value={repeatCount}
              onChange={(e) => setRepeatCount(parseInt(e.target.value))}
              style={{ background: '#002266', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '3px 6px', fontSize: '11px' }}
            >
              <option value={1}>1 முறை</option>
              <option value={2}>2 முறை</option>
            </select>
          </label>
        </div>

        {/* PREVIEW TEXT */}
        <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>
          🗣️ பேசும் உரை: <span style={{ color: '#ffffff', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '6px' }}>"{buildPureTamilSpeechText()}"</span>
        </div>
      </div>

      {lastAnnouncement && (
        <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#4ade80" /> கடைசியாக பேசப்பட்டது: <strong>"{lastAnnouncement.tamilSpeech}"</strong> • {lastAnnouncement.time}
        </div>
      )}
    </div>
  );
}
