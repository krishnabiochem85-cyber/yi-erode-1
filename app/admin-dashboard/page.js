"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/utils/admin-actions";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ totalSchools: 0, activeModules: 0, mentors: 0, responses: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [authRes, statsData] = await Promise.all([
          fetch('/api/auth/me').then(r => r.json()),
          getAdminDashboardStats()
        ]);
        
        setUser(authRes.user);
        setStats(statsData);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Hub</h1>
          <p className="page-subtitle">Welcome back, <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{user?.name || 'Administrator'}</span></p>
        </div>
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
            <span className="stat-card-badge up">Live</span>
          </div>
          <div className="stat-card-value">{loading ? '...' : stats.totalSchools}</div>
          <div className="stat-card-label">Schools Enrolled</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-card-icon">🧑‍⚕️</span>
            <span className="stat-card-badge up">Live</span>
          </div>
          <div className="stat-card-value">{loading ? '...' : stats.mentors}</div>
          <div className="stat-card-label">Mentors Available</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-card-header">
            <span className="stat-card-icon">✅</span>
          </div>
          <div className="stat-card-value">{loading ? '...' : stats.responses}</div>
          <div className="stat-card-label">Total Student Responses</div>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: "40px" }}>
        <h2 className="section-title">Program Controls</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <Link href="/schools" className="card action-card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div className="action-icon">🏫</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Manage Schools</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>Register and track participating schools</p>
          </div>
        </Link>
        <Link href="/mentors" className="card action-card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div className="action-icon">🧑‍⚕️</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Manage Mentors</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>Assign verified JKKN mentors</p>
          </div>
        </Link>
        <Link href="/admin-dashboard/roles" className="card action-card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div className="action-icon">🔑</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Manage User Roles</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>Assign roles and access levels</p>
          </div>
        </Link>
        <Link href="/modules" className="card action-card" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
          <div className="action-icon">🧩</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Framework Matrix</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>Review the 3x3 module distribution</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
