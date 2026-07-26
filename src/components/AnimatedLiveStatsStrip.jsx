import React from 'react';
import { Ticket, FileCheck2, Award, Zap, Smile } from 'lucide-react';

export default function AnimatedLiveStatsStrip() {
  return (
    <div className="animated-stats-strip-container">
      <div className="animated-stats-grid">
        <div className="stat-card-animated glow-green">
          <div className="stat-icon-wrapper">
            <Ticket size={24} />
          </div>
          <div className="stat-text-box">
            <h3 className="stat-number">15,420+</h3>
            <p className="stat-label">டோக்கன்கள் முன்பதிவு / Tokens Issued</p>
          </div>
        </div>

        <div className="stat-card-animated glow-blue">
          <div className="stat-icon-wrapper">
            <FileCheck2 size={24} />
          </div>
          <div className="stat-text-box">
            <h3 className="stat-number">12,850+</h3>
            <p className="stat-label">வெற்றிகரமான சான்றிதழ்கள் / Certificates</p>
          </div>
        </div>

        <div className="stat-card-animated glow-gold">
          <div className="stat-icon-wrapper">
            <Zap size={24} />
          </div>
          <div className="stat-text-box">
            <h3 className="stat-number">10 Mins</h3>
            <p className="stat-label">சராசரி விண்ணப்ப நேரம் / Processing Time</p>
          </div>
        </div>

        <div className="stat-card-animated glow-emerald">
          <div className="stat-icon-wrapper">
            <Smile size={24} />
          </div>
          <div className="stat-text-box">
            <h3 className="stat-number">99.8%</h3>
            <p className="stat-label">மக்களின் திருப்தி / Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
