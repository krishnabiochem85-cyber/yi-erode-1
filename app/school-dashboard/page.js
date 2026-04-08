"use client";

import { useEffect, useState } from "react";
import { getServerRole } from "@/utils/auth-server";
import { getSchoolById } from "@/utils/school-actions";
import Link from 'next/link';

export default function SchoolDashboard() {
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      // Use internal API or server utility to get role and school_id
      // For client components, we usually fetch from a route or pass as props, 
      // but here we'll use a client-side fetch pattern for simplicity in this dev flow.
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      setUser(data.user);
      
      if (data.school_id) {
        const schoolData = await getSchoolById(data.school_id);
        setSchool(schoolData);
      }
      setLoading(false);
    }
    
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading dashboard...</div>;
  }

  if (!school) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Waiting for Assignment</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            Hello {user?.name || 'there'}! Your account has the <strong>School Coordinator</strong> role, but you haven't been assigned to a specific school yet.
          </p>
          <div style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'left', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-tertiary)' }}>
              <strong>Next Steps:</strong> Please contact the Project Shield Admin to link your account to your school. Once linked, you can start the assessment and scheduling process.
            </p>
          </div>
          <Link href="/" className="btn btn-secondary">Return to Home</Link>
        </div>
      </div>
    );
  }

  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  // Mock data for sessions for now (to be implemented in next step)
  const upcomingSessions = [];
  const pastSessions = [];
  const completionPercent = school.status === 'completed' ? 100 : school.status === 'scheduled' ? 66 : school.status === 'assessed' ? 33 : 0;

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
            School dashboard for <strong style={{ color: 'var(--text-secondary)' }}>{school.name}</strong>
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
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.3px' }}>{school.name}</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>📍 {school.district}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>📋 {school.board}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>👤 {school.contact_person || 'No contact assigned'}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '8px 18px', borderRadius: '10px',
              background: 'var(--primary-glow)', border: '1px solid rgba(99, 102, 241, 0.2)',
              fontWeight: 800, color: 'var(--primary-400)', fontSize: '16px', letterSpacing: '0.5px'
            }}>
              {school.module_code || 'TBD'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', fontWeight: 500 }}>Assigned Module</div>
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
             Current Status: <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'capitalize' }}>{school.status}</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Next Step Card */}
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.15s both' }}>
          <div className="section-header">
            <h2 className="section-title">🎯 Next Step</h2>
          </div>
          {school.status === 'registered' ? (
            <div style={{ padding: '10px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                The first step of the program is to complete the <strong>School Assessment</strong>. This questionnaire helps us understand your school's demographic and behavioral needs to assign the most effective awareness module.
              </p>
              <Link href="/school-dashboard/assessment" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Start Assessment →
              </Link>
            </div>
          ) : school.status === 'assessed' ? (
            <div style={{ padding: '10px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                 Assessment complete! Your school has been assigned module <strong>{school.module_code}</strong>. Please coordinate with Admin to schedule your sessions.
              </p>
              <Link href="/schedule" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                View Schedule →
              </Link>
            </div>
          ) : (
            <div style={{ padding: '10px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                    Follow your active schedule and collect feedback after each session.
                </p>
                <Link href="/feedback" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Feedback Dashboard
                </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
          <div className="section-header">
            <h2 className="section-title">⚡ Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '📝', label: 'Update Proile', desc: 'Manage your contact info', color: 'var(--primary-400)' },
              { icon: '📊', label: 'Student Reports', desc: 'View feedback analytics', color: 'var(--success-400)' },
              { icon: '📅', label: 'Class Schedule', desc: 'View session dates', color: 'var(--warning-400)' },
              { icon: '💬', label: 'Support', desc: 'Contact admin team', color: 'var(--accent-400)' },
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
      </div>
    </div>
  );
}

