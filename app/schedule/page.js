"use client";

import { useState } from "react";

const mockSchedule = [
  { id: 1, date: "2026-04-10", time: "10:00 AM", school: "Bharathi Vidya Bhavan", module: "A2-B2", mentors: ["Dr. Anitha"], status: "confirmed", warning: false, type: "initial" },
  { id: 2, date: "2026-04-12", time: "02:00 PM", school: "Govt. Boys Hr Sec", module: "A1-B3", mentors: ["Ramesh K.", "Sneha V."], status: "planned", warning: false, type: "initial" },
  { id: 3, date: "2026-04-12", time: "02:00 PM", school: "Kongu Vellalar Matric", module: "A3-B2", mentors: ["Ramesh K."], status: "planned", warning: true, type: "follow_up" },
  { id: 4, date: "2026-04-15", time: "09:30 AM", school: "St. Mary's Matriculation", module: "A1-B1", mentors: ["Dr. Anitha", "Sneha V."], status: "confirmed", warning: false, type: "follow_through" },
];

const typeConfig = {
  initial: { label: 'Initial', color: 'var(--primary-400)', bg: 'var(--primary-glow)' },
  follow_up: { label: 'Follow-up', color: 'var(--accent-400)', bg: 'var(--accent-glow)' },
  follow_through: { label: 'Follow-through', color: 'var(--success-400)', bg: 'var(--success-bg)' },
};

export default function SchedulePage() {
  const [view, setView] = useState("list");

  const conflictCount = mockSchedule.filter(s => s.warning).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Schedule Planner</h1>
            <p className="page-subtitle">Coordinate sessions, allocate mentors, and resolve scheduling conflicts</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ 
              background: 'var(--bg-glass)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '4px', 
              display: 'flex',
              border: '1px solid var(--border-subtle)'
            }}>
              <button 
                onClick={() => setView('list')} 
                className={`btn btn-sm ${view === 'list' ? 'btn-primary' : ''}`} 
                style={{ border: 'none', boxShadow: view === 'list' ? undefined : 'none', background: view === 'list' ? undefined : 'transparent' }}
              >
                📋 List
              </button>
              <button 
                onClick={() => setView('calendar')} 
                className={`btn btn-sm ${view === 'calendar' ? 'btn-primary' : ''}`} 
                style={{ border: 'none', boxShadow: view === 'calendar' ? undefined : 'none', background: view === 'calendar' ? undefined : 'transparent' }}
              >
                📅 Calendar
              </button>
            </div>
            <button className="btn btn-primary">
              <span>+</span> New Session
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        marginBottom: '24px',
        animation: 'fadeInUp 0.4s ease-out 0.1s both'
      }}>
        {[
          { label: 'Total Sessions', value: mockSchedule.length, color: 'var(--primary-400)', icon: '📅' },
          { label: 'Confirmed', value: mockSchedule.filter(s => s.status === 'confirmed').length, color: 'var(--success-400)', icon: '✅' },
          { label: 'Planned', value: mockSchedule.filter(s => s.status === 'planned').length, color: 'var(--warning-400)', icon: '⏳' },
          { label: 'Conflicts', value: conflictCount, color: conflictCount > 0 ? 'var(--danger-400)' : 'var(--success-400)', icon: conflictCount > 0 ? '⚠️' : '✓' },
        ].map((stat) => (
          <div key={stat.label} style={{
            padding: '18px 20px',
            borderRadius: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span>{stat.icon}</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: stat.color, letterSpacing: '-0.5px' }}>{stat.value}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        {conflictCount > 0 && (
          <div style={{ 
            padding: '16px 20px', 
            background: 'var(--danger-bg)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--danger-400)', fontSize: '14px', letterSpacing: '-0.2px' }}>Scheduling Conflict Detected</div>
              <div style={{ fontSize: '13px', color: 'var(--danger-300)', marginTop: '2px' }}>Ramesh K. is double-booked on April 12 at 02:00 PM. Please resolve.</div>
            </div>
            <button className="btn btn-sm" style={{ 
              marginLeft: 'auto', 
              background: 'rgba(239, 68, 68, 0.15)', 
              color: 'var(--danger-400)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 600
            }}>
              Resolve →
            </button>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>School</th>
                <th>Module</th>
                <th>Type</th>
                <th>Assigned Mentors</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockSchedule.map(session => {
                const sessionType = typeConfig[session.type];
                return (
                  <tr key={session.id} style={{ background: session.warning ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {session.date}
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500, marginTop: '2px' }}>{session.time}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{session.school}</td>
                    <td>
                      <span className="badge badge-primary">{session.module}</span>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        padding: '3px 10px', 
                        borderRadius: '6px', 
                        color: sessionType.color, 
                        background: sessionType.bg,
                        border: `1px solid ${sessionType.color}20`
                      }}>
                        {sessionType.label}
                      </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {session.mentors.map(m => (
                            <span key={m} style={{ 
                              fontSize: '12px', 
                              padding: '4px 10px', 
                              background: 'var(--bg-glass)', 
                              borderRadius: '8px', 
                              border: session.warning && m === 'Ramesh K.' ? '1px solid var(--danger-400)' : '1px solid var(--border-subtle)',
                              fontWeight: 500,
                              color: session.warning && m === 'Ramesh K.' ? 'var(--danger-400)' : 'var(--text-secondary)'
                            }}>
                              {m} {session.warning && m === 'Ramesh K.' && '⚠️'}
                            </span>
                          ))}
                       </div>
                    </td>
                    <td>
                      {session.status === 'confirmed' ? (
                        <span className="badge badge-success">✓ Confirmed</span>
                      ) : (
                        <span className="badge badge-warning">◎ Planned</span>
                      )}
                    </td>
                    <td>
                      <button className="section-action" style={{ border: 'none', background: 'transparent' }}>
                        Edit →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
