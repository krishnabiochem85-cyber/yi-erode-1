"use client";

import { useEffect, useState } from "react";
import { getDevUser } from "@/utils/auth";
import { getMentorFeedback, submitMentorAvailability } from "@/utils/mentor-actions";

const upcomingSessions = [
  { id: 1, date: "2026-04-10", time: "10:00 AM", school: "Bharathi Vidya Bhavan", module: "A2-B2", status: "confirmed", type: "Initial" },
  { id: 2, date: "2026-04-12", time: "02:00 PM", school: "Govt. Boys Hr Sec", module: "A1-B3", status: "planned", type: "Follow-up" },
];

export default function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Feedback State
  const [pastFeedback, setPastFeedback] = useState([]);
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // April 2026
  const [selectedDates, setSelectedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setUser(getDevUser());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Fetch real or fallback feedback
    getMentorFeedback().then(data => setPastFeedback(data));
    
    return () => clearInterval(timer);
  }, []);

  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  // --- Calendar Logic ---
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const handleDateToggle = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDates(prev => prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]);
  };

  const handleSubmitAvailability = async () => {
    if (selectedDates.length === 0) return;
    setIsSubmitting(true);
    const formattedDates = selectedDates.map(date => ({ date, status: 'pending' }));
    const result = await submitMentorAvailability(formattedDates);
    if (result.success) {
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
    setIsSubmitting(false);
  };

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
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{greeting} 👋</p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #6ee7b7, #34d399, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>
            {user?.name || 'Mentor'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Manage your upcoming schedule, block dates, and review student feedback.</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Stats & Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card emerald">
              <div className="stat-card-header"><div className="stat-card-icon">📅</div></div>
              <div className="stat-card-value">{upcomingSessions.length}</div>
              <div className="stat-card-label">Upcoming</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-card-header"><div className="stat-card-icon">✅</div></div>
              <div className="stat-card-value">{pastFeedback.length}</div>
              <div className="stat-card-label">Completed</div>
            </div>
            <div className="stat-card amber" style={{ position: 'relative' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">⭐</div>
                <div className="stat-card-badge up" style={{ color: 'var(--success-400)', background: 'var(--success-bg)' }}>Top 5%</div>
              </div>
              <div className="stat-card-value">
                {pastFeedback.some(f => f.rating) 
                 ? (pastFeedback.reduce((a,b)=>a+(b.rating||0),0)/pastFeedback.filter(f=>f.rating).length).toFixed(1) 
                 : '—'}
              </div>
              <div className="stat-card-label">Average Rating</div>
            </div>
          </div>

          {/* Feedback & Performance */}
          <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
            <div className="section-header">
              <h2 className="section-title">⭐ Student Feedback</h2>
              <span className="badge badge-primary">Performance</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pastFeedback.map((session, index) => (
                <div key={index} className="activity-item" style={{
                  padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{session.school}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>📅 {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>🕒 {session.time}</span>
                      </div>
                    </div>
                    {session.rating && (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(session.rating) ? "var(--warning-400)" : "var(--border)"}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                  {session.comments && (
                    <div style={{ padding: '12px', background: 'var(--bg-base)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary-400)' }}>
                      "{session.comments}"
                    </div>
                  )}
                  {!session.feedbackSubmitted && (
                    <div style={{ fontSize: '12px', color: 'var(--warning-400)' }}>Pending student responses...</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calendar */}
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both', position: 'sticky', top: '100px' }}>
          <div className="section-header">
            <h2 className="section-title">📅 Availability</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
            Click dates you wish to <b>block</b>. Admins will verify your schedule.
          </p>

          <div style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>◀</button>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>▶</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {[...Array(firstDayOfMonth)].map((_, i) => <div key={i}></div>)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDates.includes(dStr);
                const isPast = day < 4 && currentMonth.getMonth() === 3; // fake past for April 2026
                return (
                  <button 
                    key={day}
                    onClick={() => !isPast && handleDateToggle(day)}
                    disabled={isPast}
                    style={{
                      aspectRatio: '1', border: '1px solid', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: isPast ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                      background: isSelected ? 'var(--primary-glow)' : 'transparent',
                      color: isPast ? 'var(--text-tertiary)' : isSelected ? 'var(--primary-400)' : 'var(--text-secondary)',
                      borderColor: isSelected ? 'var(--primary-400)' : 'transparent'
                    }}
                    onMouseOver={e => !isPast && !isSelected && (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseOut={e => !isPast && !isSelected && (e.currentTarget.style.background = 'transparent')}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--primary-glow)', border: '1px solid var(--primary-400)' }}></div>
              Selected Blocked Dates ({selectedDates.length})
            </div>
            <button 
              onClick={handleSubmitAvailability}
              disabled={selectedDates.length === 0 || isSubmitting}
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isSubmitting ? 'Submitting...' : submitSuccess ? '✓ Submitted for Approval' : 'Submit Blocked Dates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
