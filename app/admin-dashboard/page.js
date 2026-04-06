"use client";

import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Admin Hub</h1>
        <p className="page-subtitle">Oversee all aspects of Project Shield</p>
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
