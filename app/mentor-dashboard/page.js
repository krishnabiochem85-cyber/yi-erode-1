"use client";

import { useEffect, useState } from "react";
import { 
  getMentorAvailability, 
  updateMentorAvailability, 
  getAssignedSchools, 
  getMentorInteractions,
  getMentorFeedbackStats
} from "@/utils/mentor-actions";
import Link from 'next/link';

export default function MentorDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [loading, setLoading] = useState(true);
  
  // Feature States
  const [availability, setAvailability] = useState([]);
  const [schools, setSchools] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch('/api/auth/me');
        const auth = await response.json();
        setUser(auth.user);

        if (auth.user?.id) {
          const [avail, assignedSchools, chatLog, feedbackData] = await Promise.all([
            getMentorAvailability(auth.user.id),
            getAssignedSchools(auth.user.id),
            getMentorInteractions(auth.user.id),
            getMentorFeedbackStats(auth.user.id)
          ]);
          setAvailability(avail);
          setSchools(assignedSchools);
          setInteractions(chatLog);
          setFeedback(feedbackData);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Initializing Mentor Workspace...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Mentor Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Welcome back, <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{user?.name || 'Mentor'}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn btn-secondary" onClick={() => window.location.reload()}>Refresh Data</button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-glass)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { id: 'calendar', label: '📅 Availability', color: 'var(--emerald-400)' },
          { id: 'schools', label: '🏫 Schools', color: 'var(--blue-400)' },
          { id: 'feedback', label: '⭐ Feedback', color: 'var(--amber-400)' },
          { id: 'chat', label: '💬 Interactions', color: 'var(--indigo-400)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
              background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
              color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card" style={{ padding: '32px', minHeight: '500px' }}>
        {activeTab === 'calendar' && user && <CalendarSection availability={availability} user={user} refresh={() => getMentorAvailability(user.id).then(setAvailability)} />}
        {activeTab === 'schools' && <SchoolsSection schools={schools} />}
        {activeTab === 'feedback' && <FeedbackSection feedback={feedback} />}
        {activeTab === 'chat' && <InteractionsSection interactions={interactions} />}
      </div>
    </div>
  );
}

/* --- CALENDAR SECTION --- */
function CalendarSection({ availability, user, refresh }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (type) => {
    setIsSaving(true);
    await updateMentorAvailability(user.id, selectedDate, type, reason);
    setSelectedDate(null);
    setReason('');
    refresh();
    setIsSaving(false);
  };

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Manage Availability</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Mark days as blocked for exams, hospital duties, or other schedules.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
        {days.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const record = availability.find(a => a.date === dateStr);
          const isBlocked = record?.type === 'blocked';
          
          return (
            <div 
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              style={{
                background: isBlocked ? 'var(--error-glow)' : 'var(--bg-elevated)',
                border: `1px solid ${isBlocked ? 'var(--error-400)' : 'var(--border)'}`,
                padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s',
                transform: selectedDate === dateStr ? 'scale(1.05)' : 'none'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0' }}>{date.getDate()}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: isBlocked ? 'var(--error-400)' : 'var(--success-400)' }}>
                {isBlocked ? 'Blocked' : 'Available'}
              </div>
              {record?.reason && (
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', fontStyle: 'italic' }}>
                  "{record.reason}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={{ marginTop: '32px', padding: '24px', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--primary-400)' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>Update {selectedDate}</h4>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Reason (if blocking)</label>
            <input 
              className="form-input" 
              placeholder="e.g. SEM Exams, Hospital Internship..." 
              value={reason} 
              onChange={e => setReason(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => handleSave('free')} disabled={isSaving}>Set as Available</button>
            <button className="btn btn-danger" onClick={() => handleSave('blocked')} disabled={isSaving}>Block this Date</button>
            <button className="btn btn-secondary" onClick={() => setSelectedDate(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- SCHOOLS SECTION --- */
function SchoolsSection({ schools }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Committed Schools</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>List of schools officially allocated to you by the Admin.</p>
        </div>
        <div className="badge badge-info">Admin Controls Allocation</div>
      </div>

      {schools.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', color: 'var(--text-tertiary)' }}>
          No schools currently allocated. Please check back after Admin assignment.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {schools.map(school => (
            <div key={school.id} className="activity-item" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                 <div style={{ fontWeight: 800, fontSize: '18px' }}>{school.name}</div>
                 <div className="badge badge-success">{school.status}</div>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                📍 {school.district}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div>Next Session: <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{school.next_session || 'TBD'}</span></div>
                <div>{school.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- FEEDBACK SECTION --- */
function FeedbackSection({ feedback }) {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Learner Feedback</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--emerald-glow), transparent)', border: '1px solid var(--emerald-400)' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--emerald-400)' }}>4.8</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Average Rating</div>
        </div>
        <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--blue-glow), transparent)', border: '1px solid var(--blue-400)' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--blue-400)' }}>{feedback.length}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Feedbacks</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {feedback.map(item => (
          <div key={item.id} style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700 }}>{item.school}</span>
                <span style={{ color: 'var(--amber-400)' }}>{'⭐'.repeat(item.rating)}</span>
             </div>
             <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{item.comment}"</p>
             <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px' }}>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- INTERACTIONS SECTION --- */
function InteractionsSection({ interactions }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Anonymous Interaction Wall</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Questions and messages from learners at your committed schools.</p>
        </div>
        <div className="badge badge-warning">Admin Moderated</div>
      </div>

      {interactions.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', color: 'var(--text-tertiary)' }}>
           No interactions yet. Messages will appear here as learners reach out.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {interactions.map(msg => (
            <div key={msg.id} style={{ 
              padding: '20px', borderRadius: '16px 16px 16px 0', background: 'var(--bg-glass)', border: '1px solid var(--border)',
              maxWidth: '80%', alignSelf: 'flex-start'
            }}>
               <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-400)', marginBottom: '8px', textTransform: 'uppercase' }}>
                 Learner @ {msg.schools?.name}
               </div>
               <p style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{msg.message}</p>
               <div style={{ textAlign: 'right', fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                 {new Date(msg.created_at).toLocaleString()}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
