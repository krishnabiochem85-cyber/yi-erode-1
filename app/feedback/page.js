"use client";

import Link from "next/link";

const pillars = [
  { name: "Saying No", emoji: "🚫", score: 4.8, percent: 96, color: '#ef4444', gradient: 'linear-gradient(90deg, #ef4444, #f87171)' },
  { name: "Boundaries", emoji: "🛡️", score: 4.5, percent: 90, color: '#6366f1', gradient: 'linear-gradient(90deg, #6366f1, #818cf8)' },
  { name: "Confidential Sharing", emoji: "🤫", score: 4.2, percent: 84, color: '#a855f7', gradient: 'linear-gradient(90deg, #a855f7, #c084fc)' },
  { name: "Suicide Awareness", emoji: "❤️‍🩹", score: 4.7, percent: 94, color: '#ec4899', gradient: 'linear-gradient(90deg, #ec4899, #f472b6)' },
  { name: "Social Media", emoji: "📱", score: 4.5, percent: 90, color: '#3b82f6', gradient: 'linear-gradient(90deg, #3b82f6, #60a5fa)' },
  { name: "Substance Abuse", emoji: "💊", score: 4.9, percent: 98, color: '#10b981', gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
];

const feedbackItems = [
  { type: 'Student', typeClass: 'badge-info', school: "Govt. Boys Hr Sec", module: "A1-B3", text: "The part about handling social media pressure was very relatable to our daily lives. I learned how to recognize warning signs.", rating: 5 },
  { type: 'Teacher', typeClass: 'badge-primary', school: "Bharathi Vidya Bhavan", module: "A2-B2", text: "Well structured. The mentor established great boundaries while keeping the session interactive and age-appropriate.", rating: 4 },
  { type: 'Mentor', typeClass: 'badge-success', school: "St. Mary's Matriculation", module: "A1-B1", text: "Students were highly engaged during the Saying No module. The role-play exercises were particularly effective.", rating: 5 },
  { type: 'Student', typeClass: 'badge-info', school: "Kongu Vellalar Matric", module: "A3-B2", text: "I now understand how substance abuse affects not just the person but their entire family. Very eye-opening session.", rating: 4 },
];

export default function AnalyticsDashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Feedback & Analytics</h1>
            <p className="page-subtitle">Analyze session effectiveness across the Six Pillars</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary">📥 Export CSV</button>
            <button className="btn btn-primary">📄 Export Report</button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card indigo">
          <div className="stat-card-header">
            <div className="stat-card-icon">📝</div>
            <div className="stat-card-badge up">↑ 24%</div>
          </div>
          <div className="stat-card-value">342</div>
          <div className="stat-card-label">Total Responses</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">⭐</div>
          </div>
          <div className="stat-card-value">4.6</div>
          <div className="stat-card-label">Average Rating</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-card-icon">🎯</div>
          </div>
          <div className="stat-card-value">92%</div>
          <div className="stat-card-label">Positive Sentiment</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-card-header">
            <div className="stat-card-icon">📊</div>
          </div>
          <div className="stat-card-value">18</div>
          <div className="stat-card-label">Sessions Reviewed</div>
        </div>
      </div>

      <div className="content-grid">
        {/* Six Pillars Effectiveness */}
        <div className="card content-grid-full" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
          <div className="section-header">
            <h2 className="section-title">Six Pillars Effectiveness Score</h2>
            <span className="badge badge-primary">Last 30 Days</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pillars.map((pillar, i) => (
              <div key={pillar.name} style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{pillar.emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{pillar.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: pillar.color, letterSpacing: '-0.5px' }}>{pillar.score}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ 5.0</span>
                  </div>
                </div>
                <div style={{ 
                  height: '10px', 
                  background: 'var(--bg-glass-strong)', 
                  borderRadius: '5px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${pillar.percent}%`, 
                    background: pillar.gradient,
                    borderRadius: '5px',
                    transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2.5s ease-in-out infinite'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Feedback */}
        <div className="card content-grid-full" style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
          <div className="section-header">
            <h2 className="section-title">Recent Qualitative Feedback</h2>
            <span className="section-action">View All →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {feedbackItems.map((item, index) => (
              <div key={index} className="activity-item" style={{ 
                flexDirection: 'column', 
                alignItems: 'stretch',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                animation: `fadeInUp 0.4s ease-out ${index * 80}ms both`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`badge ${item.typeClass}`}>{item.type}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                      {item.school} • {item.module}
                    </span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ 
                          fontSize: '12px', 
                          color: star <= item.rating ? '#fbbf24' : 'var(--text-tertiary)',
                          opacity: star <= item.rating ? 1 : 0.3
                        }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)', 
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  position: 'relative',
                  paddingLeft: '16px'
                }}>
                  <span style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: '-4px', 
                    fontSize: '24px', 
                    color: 'var(--primary-400)', 
                    opacity: 0.3,
                    fontStyle: 'normal'
                  }}>&ldquo;</span>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
