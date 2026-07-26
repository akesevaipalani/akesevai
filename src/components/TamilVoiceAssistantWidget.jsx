import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, Sparkles, MessageCircle, Play, Pause, X } from 'lucide-react';

const voiceGuides = [
  {
    id: 'intro',
    title: 'மையம் அறிமுகம் (About AkEsevai)',
    audioText: 'வணக்கம்! பழனி AkEsevai மையத்திற்கு உங்களை அன்புடன் வரவேற்கிறோம். இங்கு வருமானச் சான்றிதழ், சாதிச் சான்றிதழ், ஆதார் புதுப்பித்தல், ஸ்மார்ட் குடும்ப அட்டை மற்றும் அனைத்து அரசுத் திட்டங்களுக்கும் விண்ணப்பிக்கலாம்.',
  },
  {
    id: 'docs',
    title: 'ஆவணங்கள் தயாரிப்பு (Document Checklist)',
    audioText: 'அரசுச் சான்றிதழ்களுக்கு விண்ணப்பிக்க உங்களின் ஆதார் கார்டு, குடும்ப அட்டை மற்றும் போட்டோ தேவைப்படும். ஆவணப் பட்டியலை வாட்ஸ்அப்பில் பெற ஸ்மார்ட் சேவை வழிகாட்டியைப் பயன்படுத்தலாம்.',
  },
  {
    id: 'token',
    title: 'டோக்கன் பதிவு (Token Pass Booking)',
    audioText: 'நேரத்தை மிச்சப்படுத்த டோக்கன் பாஸ் பக்கத்திற்குச் சென்று உங்களுக்கு வசதியான நேரத்தைத் தேர்ந்தெடுத்து முன்பதிவு செய்துகொள்ளலாம்.',
  }
];

export default function TamilVoiceAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeVoice, setActiveVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVoice = (guide) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current playing speech

      if (activeVoice?.id === guide.id && isPlaying) {
        setIsPlaying(false);
        setActiveVoice(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(guide.audioText);
      utterance.lang = 'ta-IN'; // Tamil Indian Accent Voice
      utterance.rate = 0.9; // Smooth natural speed

      utterance.onend = () => {
        setIsPlaying(false);
        setActiveVoice(null);
      };

      setActiveVoice(guide);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Tamil Voice Assistant is playing: ' + guide.audioText);
    }
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveVoice(null);
  };

  return (
    <>
      {/* FLOATING TAMIL VOICE ASSISTANT TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="voice-assistant-float-btn"
        title="தமிழ் குரல் வழி சேவை உதவியாளர்"
      >
        <Mic size={22} color="white" />
        <span className="voice-float-badge">
          <Sparkles size={11} fill="#fbbf24" color="#d97706" />
        </span>
      </button>

      {/* VOICE ASSISTANT DRAWER MODAL */}
      {isOpen && (
        <div className="voice-assistant-card">
          <div className="voice-card-header">
            <div>
              <span className="voice-kicker">
                <Mic size={13} /> TAMIL VOICE ASSISTANT • குரல் வழி வழிகாட்டி
              </span>
              <h4 className="voice-card-title">
                தமிழ் <span>குரல் உதவி</span> மைய வழிகாட்டி
              </h4>
            </div>
            <button onClick={() => { handleStopVoice(); setIsOpen(false); }} className="voice-close-btn">
              <X size={16} />
            </button>
          </div>

          <p className="voice-subtext">
            சான்றிதழ்கள் பெற என்ன செய்ய வேண்டும் என்பதைத் தமிழில் கேட்க கீழே உள்ள பொத்தானைக் அழுத்தவும்:
          </p>

          <div className="voice-guides-list">
            {voiceGuides.map((guide) => {
              const isCurrentPlaying = activeVoice?.id === guide.id && isPlaying;
              return (
                <div key={guide.id} className={`voice-guide-row ${isCurrentPlaying ? 'playing' : ''}`}>
                  <div className="guide-info">
                    <strong>{guide.title}</strong>
                    <p>{guide.audioText}</p>
                  </div>
                  <button
                    onClick={() => handlePlayVoice(guide)}
                    className={`voice-play-btn ${isCurrentPlaying ? 'stop' : ''}`}
                  >
                    {isCurrentPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{isCurrentPlaying ? 'நிறுத்து' : 'கேட்க'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="voice-footer-note">
            💡 <strong>குறிப்பு:</strong> ஸ்பீக்கர் ஒலியை இயக்கி வைக்கவும்.
          </div>
        </div>
      )}
    </>
  );
}
