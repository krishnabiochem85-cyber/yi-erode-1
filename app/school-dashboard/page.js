"use client";

import { useEffect, useState } from "react";
import { getDevUser } from "@/utils/auth";
import Link from 'next/link';

const schoolInfo = {
  name: "Bharathi Vidya Bhavan",
  district: "Erode",
  board: "CBSE",
  students: 450,
  moduleCode: "A2-B2",
  moduleName: "Balanced Core",
  assessmentStatus: "completed",
  sessionsCompleted: 2,
  sessionsRemaining: 1,
};

const upcomingSessions = [
  { date: "2026-04-10", time: "10:00 AM", mentor: "Dr. Anitha", type: "Follow-through", module: "A2-B2", status: "confirmed" },
];

const pastSessions = [
  { date: "2026-03-28", mentor: "Dr. Anitha", type: "Initial", duration: "90 min", studentFeedback: 42, averageRating: 4.6 },
  { date: "2026-04-02", mentor: "Sneha V.", type: "Follow-up", duration: "60 min", studentFeedback: 38, averageRating: 4.8 },
];

export default function SchoolDashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setUser(getDevUser());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  const completionPercent = Math.round((schoolInfo.sessionsCompleted / (schoolInfo.sessionsCompleted + schoolInfo.sessionsRemaining)) * 100);

  return (
    <div>
      {/* Hero Welcome */}
      <div style={{
        marginBottom: '36px',
        padding: '32px 36px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.05) 50%, rgba(99, 102, 241, 0.03) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
            {greeting} 👋
          </p>
          <h1 style={{
            fontSize: '28px', fontWeight: 800, letterSpacing: '-0.8px',
            background: 'linear-gradient(135deg, #fcd34d, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.2, marginBottom: '6px'
          }}>
            {user?.name || 'School Coordinator'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            School dashboard for <strong style={{ color: 'var(--text-secondary)' }}>{schoolInfo.name}</strong>
          </p>
        </div>
      </div>

      {/* School Info Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '28px',
        animation: 'fadeInUp 0.5s ease-out 0.1s both'
      }}>
        <div className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', flexShrink: 0
          }}>🏫</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.3px' }}>{schoolInfo.name}</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>📍 {schoolInfo.district}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>📋 {schoolInfo.board}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>👨‍🎓 {schoolInfo.students} students</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '8px 18px', borderRadius: '10px',
              background: 'var(--primary-glow)', border: '1px solid rgba(99, 102, 241, 0.2)',
              fontWeight: 800, color: 'var(--primary-400)', fontSize: '16px', letterSpacing: '0.5px'
            }}>
              {schoolInfo.moduleCode}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', fontWeight: 500 }}>{schoolInfo.moduleName}</div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Program Progress</div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--success-400)', letterSpacing: '-1px', marginBottom: '8px' }}>{completionPercent}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionPercent}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
            {schoolInfo.sessionsCompleted} of {schoolInfo.sessionsCompleted + schoolInfo.sessionsRemaining} sessions completed
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '28px' }}>
        <div className="stat-card amber">
          <div className="stat-card-header">
            <div className="stat-card-icon">📅</div>
          </div>
          <div className="stat-card-value">{upcomingSessions.length}</div>
          <div className="stat-card-label">Upcoming Sessions</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">✅</div>
          </div>
          <div className="stat-card-value">{pastSessions.length}</div>
          <div className="stat-card-label">Sessions Completed</div>
        </div>
        <div className="stat-card indigo">
          <div className="stat-card-header">
            <div className="stat-card-icon">💬</div>
          </div>
          <div className="stat-card-value">{pastSessions.reduce((a, s) => a + s.studentFeedback, 0)}</div>
          <div className="stat-card-label">Student Feedback Count</div>
        </div>
      </div>

      <div className="content-grid">
        {/* Upcoming Session */}
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.15s both' }}>
          <div className="section-header">
            <h2 className="section-title">📅 Next Session</h2>
          </div>
          {upcomingSessions.length > 0 ? (
            <div style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)'
            }}>
              {upcomingSessions.map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{s.date}</div>
                    <span className="badge badge-success">✓ {s.status}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div>🕐 <strong>{s.time}</strong></div>
                    <div>👤 Mentor: <strong>{s.mentor}</strong></div>
                    <div>📋 Type: <span className="badge badge-primary" style={{ fontSize: '11px' }}>{s.type}</span></div>
                    <div>🎯 Module: <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>{s.module}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-text">No upcoming sessions</div>
            </div>
          )}
        </div>

        {/* Quick Actions for School */}
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
          <div className="section-header">
            <h2 className="section-title">⚡ Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/school-dashboard/assessment" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary-glow) 0%, rgba(99, 102, 241, 0.05) 100%)', 
                border: '1px solid var(--primary-400)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.2s', color: 'inherit'
              }}>
                <span style={{ fontSize: '24px' }}>📝</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary-400)', marginBottom: '2px' }}>Take Assessment & Schedule</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Complete questionnaire to receive Module Matrix</div>
                </div>
              </div>
            </Link>
            {[
              { icon: '📊', label: 'Student Feedback Report', desc: 'View aggregated student responses', color: 'var(--success-400)' },
              { icon: '📅', label: 'Request Schedule Change', desc: 'Submit a scheduling request', color: 'var(--warning-400)' },
              { icon: '💬', label: 'Contact Admin', desc: 'Send a message to the admin team', color: 'var(--accent-400)' },
            ].map((action) => (
              <button key={action.label} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.2s', color: 'inherit'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-glass-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <span style={{ fontSize: '20px' }}>{action.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>{action.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{action.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Past Sessions */}
        <div className="card content-grid-full" style={{ animation: 'fadeInUp 0.5s ease-out 0.25s both' }}>
          <div className="section-header">
            <h2 className="section-title">📋 Past Sessions</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mentor</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Student Feedback</th>
                  <th>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {pastSessions.map((session, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{session.date}</td>
                    <td>{session.mentor}</td>
                    <td><span className="badge badge-primary" style={{ fontSize: '11px' }}>{session.type}</span></td>
                    <td>{session.duration}</td>
                    <td style={{ fontWeight: 600 }}>{session.studentFeedback} responses</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--warning-400)' }}>{session.averageRating}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}> ★</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
