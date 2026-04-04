"use client";

import Link from "next/link";

export default function AnalyticsDashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Feedback & Analytics</h1>
            <p className="page-subtitle">Analyze session effectiveness across the Six Pillars</p>
          </div>
          <button className="btn btn-secondary">
            Export Report (PDF)
          </button>
        </div>
      </div>

      <div className="stats-grid">
         <div className="stat-card indigo">
          <div className="stat-card-header">
            <div className="stat-card-icon">📝</div>
          </div>
          <div className="stat-card-value">342</div>
          <div className="stat-card-label">Total Feedback Responses</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">⭐</div>
          </div>
          <div className="stat-card-value">4.6</div>
          <div className="stat-card-label">Average Session Rating</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card content-grid-full">
          <div className="section-header">
            <h2 className="section-title">Six Pillars Effectiveness Score</h2>
            <div className="section-action">Last 30 Days</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { name: "Saying No", emoji: "🚫", score: 4.8, percent: 96 },
              { name: "Boundaries", emoji: "🛡️", score: 4.5, percent: 90 },
              { name: "Confidential Sharing", emoji: "🤫", score: 4.2, percent: 84 },
              { name: "Suicide Awareness", emoji: "❤️‍🩹", score: 4.7, percent: 94 },
              { name: "Social Media", emoji: "📱", score: 4.5, percent: 90 },
              { name: "Substance Abuse", emoji: "💊", score: 4.9, percent: 98 },
            ].map(pillar => (
              <div key={pillar.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  <span>{pillar.emoji} {pillar.name}</span>
                  <span>{pillar.score} / 5.0</span>
                </div>
                <div className="progress-bar">
                   <div className="progress-fill" style={{ width: `${pillar.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card content-grid-full">
          <div className="section-header">
            <h2 className="section-title">Recent Qualitative Feedback</h2>
          </div>
          <div className="activity-list">
             <div className="activity-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-info">Student</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Govt. Boys Hr Sec • Module A1-B3</span>
                </div>
                <div className="activity-text">"The part about handling social media pressure was very relatable to our daily lives."</div>
             </div>
             
             <div className="activity-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-primary">Teacher</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Bharathi Vidya Bhavan • Module A2-B2</span>
                </div>
                <div className="activity-text">"Well structured. The mentor established great boundaries while keeping the session interactive."</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
