"use client";

import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Admin Hub</h1>
        <p className="page-subtitle">Oversee all aspects of Project Shield</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>
          <div style={{ position: 'relative', minHeight: '280px' }}>
            <img 
              src="/mission-on-hero.png" 
              alt="Mission On" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--accent-glow)', color: 'var(--accent-400)', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '12px', alignSelf: 'flex-start' }}>
              About the Program
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Mission On: Smart Choices
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0', fontSize: '14px' }}>
              Young Indians (Yi) Erode Chapter presents <strong>Project Shield</strong>, a comprehensive awareness program focused on substance abuse prevention. "Mission On" empowers students with tools and mentorship to make safe decisions.
            </p>
          </div>
        </div>
      </div>


      <div className="stats-grid">
        <div className="stat-card indigo">
          <div className="stat-card-header">
            <span className="stat-card-icon">🏫</span>
            <span className="stat-card-badge up">Active</span>
          </div>
          <div className="stat-card-value">24</div>
          <div className="stat-card-label">Schools Enrolled</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-card-icon">🧑‍⚕️</span>
            <span className="stat-card-badge up">Active</span>
          </div>
          <div className="stat-card-value">12</div>
          <div className="stat-card-label">Mentors Available</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <span className="stat-card-icon">✅</span>
          </div>
          <div className="stat-card-value">45</div>
          <div className="stat-card-label">Sessions Completed</div>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: "40px" }}>
        <h2 className="section-title">Quick Actions</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Link href="/school-dashboard" className="card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{ fontSize: "32px" }}>🏫</div>
          <div>
            <h3 style={{ margin: 0 }}>View School Dashboard</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px" }}>See what School Coordinators see</p>
          </div>
        </Link>
        <Link href="/mentor-dashboard" className="card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div style={{ fontSize: "32px" }}>🧑‍⚕️</div>
          <div>
            <h3 style={{ margin: 0 }}>View Mentor Dashboard</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px" }}>See what Mentors see</p>
          </div>
        </Link>
        <Link href="/admin-dashboard/add-mentor" className="card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none", gridColumn: "1 / -1" }}>
          <div style={{ fontSize: "32px" }}>➕</div>
          <div>
            <h3 style={{ margin: 0 }}>Add New Mentor</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px" }}>Register a verified JKKN mentor to the DB</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
