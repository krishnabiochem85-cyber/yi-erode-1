"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome to Project Shield Command Center</p>
          </div>
          <button className="btn btn-primary">
            <span>+</span> New Assessment
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-card-header">
            <div className="stat-card-icon">🏫</div>
            <div className="stat-card-badge up">+12%</div>
          </div>
          <div className="stat-card-value">124</div>
          <div className="stat-card-label">Total Schools Assessed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-card-icon">🎯</div>
            <div className="stat-card-badge up">+5%</div>
          </div>
          <div className="stat-card-value">86</div>
          <div className="stat-card-label">Active Modules</div>
        </div>
        <div className="stat-card pink">
          <div className="stat-card-header">
            <div className="stat-card-icon">👥</div>
            <div className="stat-card-badge">New</div>
          </div>
          <div className="stat-card-value">42</div>
          <div className="stat-card-label">Registered Mentors</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-badge up">+18%</div>
          </div>
          <div className="stat-card-value">156</div>
          <div className="stat-card-label">Sessions Completed</div>
        </div>
      </div>

      <div className="content-grid">
        {/* Module Matrix Heatmap */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Module Assignment Distribution</h2>
            <div className="section-action">View Full Matrix</div>
          </div>
          <div className="matrix-grid">
            {["A1-B1", "A2-B1", "A3-B1", "A1-B2", "A2-B2", "A3-B2", "A1-B3", "A2-B3", "A3-B3"].map((code, index) => {
              const counts = [12, 5, 2, 8, 24, 15, 3, 18, 37];
              // Background intensity for visual effect based on counts
              const intensity = counts[index] / 40; 
              return (
                <div 
                  key={code} 
                  className="matrix-cell" 
                  style={{ backgroundColor: `rgba(99, 102, 241, ${Math.max(0.05, intensity)})` }}
                >
                  <div className="matrix-cell-code">{code}</div>
                  <div className="matrix-cell-count">{counts[index]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <div className="section-action">View All</div>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot green"></div>
              <div>
                <div className="activity-text"><strong>Govt. Boys Hr Sec School</strong> completed assessment</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot purple"></div>
              <div>
                <div className="activity-text">Module <strong>A2-B3</strong> assigned to <strong>Bharathi Vidya Bhavan</strong></div>
                <div className="activity-time">5 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot pink"></div>
              <div>
                <div className="activity-text">Mentor <strong>Dr. Anitha</strong> requested schedule change</div>
                <div className="activity-time">Yesterday</div>
              </div>
            </div>
             <div className="activity-item">
              <div className="activity-dot blue"></div>
              <div>
                <div className="activity-text">Session completed successfully at <strong>St. Mary's Matriculation</strong></div>
                <div className="activity-time">Yesterday</div>
              </div>
            </div>
          </div>
        </div>

        {/* Six Pillars */}
        <div className="card content-grid-full">
          <div className="section-header">
            <h2 className="section-title">The Six Pillars of Project Shield</h2>
          </div>
          <div className="pillars-grid">
            <div className="pillar-item">
              <div className="pillar-emoji">🚫</div>
              <div className="pillar-name">Saying No</div>
            </div>
            <div className="pillar-item">
              <div className="pillar-emoji">🛡️</div>
              <div className="pillar-name">Boundaries</div>
            </div>
            <div className="pillar-item">
              <div className="pillar-emoji">🤫</div>
              <div className="pillar-name">Confidential Sharing</div>
            </div>
            <div className="pillar-item">
              <div className="pillar-emoji">❤️‍🩹</div>
              <div className="pillar-name">Suicide Awareness</div>
            </div>
            <div className="pillar-item">
              <div className="pillar-emoji">📱</div>
              <div className="pillar-name">Social Media</div>
            </div>
            <div className="pillar-item">
              <div className="pillar-emoji">💊</div>
              <div className="pillar-name">Substance Abuse</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
