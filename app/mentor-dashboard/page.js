"use client";

import { useEffect, useState } from "react";
import { getDevUser } from "@/utils/auth";

const upcomingSessions = [
  { id: 1, date: "2026-04-10", time: "10:00 AM", school: "Bharathi Vidya Bhavan", module: "A2-B2", status: "confirmed", type: "Initial" },
  { id: 2, date: "2026-04-12", time: "02:00 PM", school: "Govt. Boys Hr Sec", module: "A1-B3", status: "planned", type: "Follow-up" },
  { id: 3, date: "2026-04-15", time: "09:30 AM", school: "St. Mary's Matriculation", module: "A1-B1", status: "confirmed", type: "Follow-through" },
];

const pastSessions = [
  { school: "Kongu Vellalar Matric", module: "A3-B2", date: "2026-03-28", rating: 4.5, feedbackSubmitted: true },
  { school: "JKKN Public School", module: "A2-B1", date: "2026-03-25", rating: 4.8, feedbackSubmitted: true },
  { school: "Govt. Girls Hr Sec", module: "A2-B3", date: "2026-03-20", rating: null, feedbackSubmitted: false },
];

export default function MentorDashboard() {
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
      {/* Hero Welcome */}
      <div style={{
        marginBottom: '36px',
        padding: '32px 36px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(99, 102, 241, 0.03) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
            {greeting} 👋
          </p>
          <h1 style={{
            fontSize: '28px', fontWeight: 800, letterSpacing: '-0.8px',
            background: 'linear-gradient(135deg, #6ee7b7, #34d399, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.2, marginBottom: '6px'
          }}>
            {user?.name || 'Mentor'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Your mentoring dashboard — manage sessions and submit feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <div className="stat-card-icon">📅</div>
          </div>
          <div className="stat-card-value">{upcomingSessions.length}</div>
          <div className="stat-card-label">Upcoming Sessions</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-header">
            <div className="stat-card-icon">✅</div>
          </div>
          <div className="stat-card-value">{pastSessions.length}</div>
          <div className="stat-card-label">Completed Sessions</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-card-header">
            <div className="stat-card-icon">⭐</div>
          </div>
          <div className="stat-card-value">4.7</div>
          <div className="stat-card-label">Average Rating</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-card-icon">💬</div>
            <div className="stat-card-badge down" style={{ color: 'var(--warning-400)', background: 'var(--warning-bg)' }}>1 pending</div>
          </div>
          <div className="stat-card-value">{pastSessions.filter(s => s.feedbackSubmitted).length}</div>
          <div className="stat-card-label">Feedback Submitted</div>
        </div>
      </div>

      <div className="content-grid">
        {/* Upcoming Sessions */}
        <div className="card content-grid-full" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <div className="section-header">
            <h2 className="section-title">📅 Upcoming Sessions</h2>
            <span className="badge badge-primary">{upcomingSessions.length} scheduled</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>School</th>
                  <th>Module</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSessions.map(session => (
                  <tr key={session.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {session.date}
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{session.time}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{session.school}</td>
                    <td><span className="badge badge-primary">{session.module}</span></td>
                    <td>
                      <span style={{
                        fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px',
                        color: session.type === 'Initial' ? 'var(--primary-400)' : session.type === 'Follow-up' ? 'var(--accent-400)' : 'var(--success-400)',
                        background: session.type === 'Initial' ? 'var(--primary-glow)' : session.type === 'Follow-up' ? 'var(--accent-glow)' : 'var(--success-bg)',
                      }}>
                        {session.type}
                      </span>
                    </td>
                    <td>
                      {session.status === 'confirmed' ? (
                        <span className="badge badge-success">✓ Confirmed</span>
                      ) : (
                        <span className="badge badge-warning">◎ Planned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Past Sessions with Feedback Status */}
        <div className="card content-grid-full" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
          <div className="section-header">
            <h2 className="section-title">📋 Past Sessions & Feedback</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pastSessions.map((session, index) => (
              <div key={index} className="activity-item" style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div className={`activity-dot ${session.feedbackSubmitted ? 'green' : 'amber'}`}></div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{session.school}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {session.module} • {session.date}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {session.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--warning-400)' }}>{session.rating}</span>
                      <span style={{ fontSize: '12px', color: 'var(--warning-400)' }}>★</span>
                    </div>
                  )}
                  {session.feedbackSubmitted ? (
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>Feedback Sent</span>
                  ) : (
                    <button className="btn btn-primary btn-sm">Submit Feedback</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
