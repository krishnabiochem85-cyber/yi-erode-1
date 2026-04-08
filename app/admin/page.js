"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getGlobalFeedbackStats, getRecentComments } from "@/utils/feedback-actions";
import { getGlobalFeedbackStats, getRecentComments } from "@/utils/feedback-actions";
import { getAdminDashboardStats, getModuleMatrixDistribution } from "@/utils/admin-actions";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pillarStats, setPillarStats] = useState(null);
  const [recentComments, setRecentComments] = useState([]);
  const [topStats, setTopStats] = useState({ schools: 0, modules: 0, mentors: 0, responses: 0 });
  const [matrixData, setMatrixData] = useState({});
  
  useEffect(() => {
    async function loadAdminData() {
      const authResponse = await fetch('/api/auth/me');
      const auth = await authResponse.json();
      
      if (auth.user) {
        setUser(auth.user);
      }

      const [stats, comments, globalStats, distribution] = await Promise.all([
        getGlobalFeedbackStats(),
        getRecentComments(5),
        getAdminDashboardStats(),
        getModuleMatrixDistribution()
      ]);
      setPillarStats(stats);
      setRecentComments(comments);
      setTopStats(globalStats);
      setMatrixData(distribution);
    }
    loadAdminData();
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
            <div className="stat-card-badge up">Live</div>
          </div>
          <div className="stat-card-value">{topStats.schools}</div>
          <div className="stat-card-label">Total Schools Assessed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-card-icon">🎯</div>
          </div>
          <div className="stat-card-value">{topStats.modules}</div>
          <div className="stat-card-label">Active Modules</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-card-header">
            <div className="stat-card-icon">👥</div>
          </div>
          <div className="stat-card-value">{topStats.mentors}</div>
          <div className="stat-card-label">Registered Mentors</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">✅</div>
          </div>
          <div className="stat-card-value">{topStats.responses}</div>
          <div className="stat-card-label">Student Responses</div>
        </div>
      </div>

      <div className="content-grid">
        {/* About Program Section */}
        <div className="card content-grid-full" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0, alignItems: 'stretch' }}>
               <div style={{ position: 'relative', minHeight: '300px' }}>
                 <img src="/mission-on-hero.png" alt="Mission On" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--accent-glow)', color: 'var(--accent-400)', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '16px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
                   About the Program
                 </div>
                 <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Mission On: Smart Choices</h2>
                 <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px', fontSize: '15px' }}>
                    Project Shield empowers school students with the knowledge and mentorship to make safe, healthy decisions.
                 </p>
               </div>
             </div>
        </div>

        {/* Module Matrix Heatmap - Hardcoded for demo matrix but status can be updated */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Module Distribution</h2>
            <Link href="/modules" className="section-action" style={{ textDecoration: 'none' }}>View Full Matrix →</Link>
          </div>
          <div className="matrix-grid" style={{ gap: '8px' }}>
            {["A1-B1", "A2-B1", "A3-B1", "A1-B2", "A2-B2", "A3-B2", "A1-B3", "A2-B3", "A3-B3"].map((code) => {
              const count = matrixData[code] || 0;
              const intensity = Math.min(0.3, count * 0.05);
              return (
                <div key={code} className="matrix-cell" style={{ 
                  backgroundColor: `rgba(99, 102, 241, ${0.05 + intensity})`, 
                  borderRadius: '10px',
                  border: count > 0 ? '1px solid var(--primary-400)' : '1px solid var(--border)'
                }}>
                  <div className="matrix-cell-code" style={{ opacity: count > 0 ? 1 : 0.4 }}>{code}</div>
                  {count > 0 && <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{count}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity - Real Comments */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Latest Student Comments</h2>
            <span className="section-action">View All →</span>
          </div>
          <div className="activity-list">
            {recentComments.length === 0 ? (
               <div style={{ padding: '20px', color: 'var(--text-tertiary)', textAlign: 'center' }}>No recent feedback comments.</div>
            ) : recentComments.map((c, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot green"></div>
                <div>
                  <div className="activity-text">&quot;{c.comments}&quot;</div>
                  <div className="activity-time">{new Date(c.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Six Pillars - Dynamic Scores */}
        <div className="card content-grid-full">
          <div className="section-header">
            <h2 className="section-title">The Six Pillars of Project Shield (Live Analytics)</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Global Student Average Scores</span>
          </div>
          <div className="pillars-grid stagger">
            {[
              { emoji: '🚫', name: 'Saying No', score: pillarStats?.saying_no || '—', color: '#ef4444' },
              { emoji: '🛡️', name: 'Boundaries', score: pillarStats?.boundaries || '—', color: '#6366f1' },
              { emoji: '🤫', name: 'Confidential Sharing', score: pillarStats?.confidential || '—', color: '#a855f7' },
              { emoji: '❤️‍🩹', name: 'Suicide Awareness', score: pillarStats?.suicide || '—', color: '#ec4899' },
              { emoji: '📱', name: 'Social Media', score: pillarStats?.social || '—', color: '#3b82f6' },
              { emoji: '💊', name: 'Substance Abuse', score: pillarStats?.substance || '—', color: '#10b981' },
            ].map((pillar) => (
              <div className="pillar-item" key={pillar.name}>
                <div className="pillar-emoji">{pillar.emoji}</div>
                <div className="pillar-name">{pillar.name}</div>
                <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 800, color: pillar.color, letterSpacing: '-0.5px' }}>
                  {pillar.score}
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
              { label: 'Manage Mentors', icon: '👥', href: '/admin/mentors' },
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
