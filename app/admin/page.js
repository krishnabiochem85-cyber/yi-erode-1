"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDevUser } from "@/utils/auth";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    setUser(getDevUser());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Hero Welcome Section */}
      <div style={{
        marginBottom: '36px',
        padding: '32px 36px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(236, 72, 153, 0.03) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '30%',
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
                {greeting} 👋
              </p>
              <h1 style={{
                fontSize: '30px',
                fontWeight: 800,
                letterSpacing: '-0.8px',
                background: 'linear-gradient(135deg, #a5b4fc, #818cf8, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                marginBottom: '6px'
              }}>
                {user?.name || 'Administrator'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                Here&apos;s your Project Shield command center overview
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="live-indicator">Live</div>
              <button className="btn btn-primary" style={{ fontSize: '13px' }}>
                <span>+</span> New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-card-header">
            <div className="stat-card-icon">🏫</div>
            <div className="stat-card-badge up">↑ 12%</div>
          </div>
          <div className="stat-card-value">124</div>
          <div className="stat-card-label">Total Schools Assessed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-card-icon">🎯</div>
            <div className="stat-card-badge up">↑ 5%</div>
          </div>
          <div className="stat-card-value">86</div>
          <div className="stat-card-label">Active Modules</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-card-header">
            <div className="stat-card-icon">👥</div>
            <div className="stat-card-badge" style={{ color: 'var(--accent-400)', background: 'var(--accent-glow)', border: '1px solid rgba(168, 85, 247, 0.15)' }}>New</div>
          </div>
          <div className="stat-card-value">42</div>
          <div className="stat-card-label">Registered Mentors</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-badge up">↑ 18%</div>
          </div>
          <div className="stat-card-value">156</div>
          <div className="stat-card-label">Sessions Completed</div>
        </div>
      </div>

      <div className="content-grid">
        {/* Module Matrix Heatmap */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Module Distribution</h2>
            <Link href="/modules" className="section-action" style={{ textDecoration: 'none' }}>View Full Matrix →</Link>
          </div>
          <div className="matrix-grid" style={{ gap: '8px' }}>
            {["A1-B1", "A2-B1", "A3-B1", "A1-B2", "A2-B2", "A3-B2", "A1-B3", "A2-B3", "A3-B3"].map((code, index) => {
              const counts = [12, 5, 2, 8, 24, 15, 3, 18, 37];
              const intensity = counts[index] / 40;
              const colors = [
                'rgba(16, 185, 129,', 'rgba(16, 185, 129,', 'rgba(16, 185, 129,',
                'rgba(245, 158, 11,', 'rgba(99, 102, 241,', 'rgba(245, 158, 11,',
                'rgba(239, 68, 68,',  'rgba(239, 68, 68,',  'rgba(239, 68, 68,'
              ];
              return (
                <div 
                  key={code} 
                  className="matrix-cell" 
                  style={{ 
                    backgroundColor: `${colors[index]} ${Math.max(0.06, intensity * 0.3)})`,
                    borderRadius: '10px'
                  }}
                >
                  <div className="matrix-cell-code" style={{ color: `${colors[index]} 0.8)` }}>{code}</div>
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
            <span className="section-action">View All →</span>
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
                <div className="activity-text">Session completed at <strong>St. Mary&apos;s Matriculation</strong></div>
                <div className="activity-time">Yesterday</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot amber"></div>
              <div>
                <div className="activity-text">New mentor <strong>Sneha V.</strong> awaiting confirmation</div>
                <div className="activity-time">2 days ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Six Pillars */}
        <div className="card content-grid-full">
          <div className="section-header">
            <h2 className="section-title">The Six Pillars of Project Shield</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Core Program Areas</span>
          </div>
          <div className="pillars-grid stagger">
            {[
              { emoji: '🚫', name: 'Saying No', score: '4.8', color: '#ef4444' },
              { emoji: '🛡️', name: 'Boundaries', score: '4.5', color: '#6366f1' },
              { emoji: '🤫', name: 'Confidential Sharing', score: '4.2', color: '#a855f7' },
              { emoji: '❤️‍🩹', name: 'Suicide Awareness', score: '4.7', color: '#ec4899' },
              { emoji: '📱', name: 'Social Media', score: '4.5', color: '#3b82f6' },
              { emoji: '💊', name: 'Substance Abuse', score: '4.9', color: '#10b981' },
            ].map((pillar) => (
              <div className="pillar-item" key={pillar.name}>
                <div className="pillar-emoji">{pillar.emoji}</div>
                <div className="pillar-name">{pillar.name}</div>
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '20px', 
                  fontWeight: 800, 
                  color: pillar.color,
                  letterSpacing: '-0.5px'
                }}>
                  {pillar.score}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px', fontWeight: 500 }}>
                  avg. score
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card content-grid-full" style={{ padding: '24px 28px' }}>
          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Register School', icon: '🏫', href: '/schools' },
              { label: 'Start Assessment', icon: '📝', href: '/assessments' },
              { label: 'Schedule Session', icon: '📅', href: '/schedule' },
              { label: 'Manage Mentors', icon: '👥', href: '/mentors' },
              { label: 'View Feedback', icon: '💬', href: '/feedback' },
              { label: 'Manage Roles', icon: '🔐', href: '/admin/roles' },
            ].map((action) => (
              <Link key={action.label} href={action.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <span style={{ fontSize: '18px' }}>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
