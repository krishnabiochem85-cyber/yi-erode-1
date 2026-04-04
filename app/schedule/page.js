"use client";

import { useState } from "react";

const mockSchedule = [
  { id: 1, date: "2026-04-10", time: "10:00 AM", school: "Bharathi Vidya Bhavan", module: "A2-B2", mentors: ["Dr. Anitha"], status: "confirmed", warning: false },
  { id: 2, date: "2026-04-12", time: "02:00 PM", school: "Govt. Boys Hr Sec", module: "A1-B3", mentors: ["Ramesh K.", "Sneha V."], status: "planned", warning: false },
  { id: 3, date: "2026-04-12", time: "02:00 PM", school: "Kongu Vellalar Matric", module: "A3-B2", mentors: ["Ramesh K."], status: "planned", warning: true },
];

export default function SchedulePage() {
  const [view, setView] = useState("list");

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Schedule Planner</h1>
            <p className="page-subtitle">Coordinate sessions and allocate mentors</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: '4px', display: 'flex' }}>
              <button onClick={() => setView('list')} className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`} style={{ border: 'none' }}>List</button>
              <button onClick={() => setView('calendar')} className={`btn btn-sm ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} style={{ border: 'none' }}>Calendar</button>
            </div>
            <button className="btn btn-primary">
              <span>+</span> New Session
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {mockSchedule.some(s => s.warning) && (
          <div style={{ padding: '16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-400)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--danger-500)', fontSize: '14px' }}>Scheduling Conflict Detected</div>
              <div style={{ fontSize: '13px', color: 'var(--danger-400)' }}>Ramesh K. is double-booked on April 12 at 02:00 PM. Please resolve.</div>
            </div>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>School</th>
                <th>Module</th>
                <th>Assigned Mentors</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockSchedule.map(session => (
                <tr key={session.id} style={{ background: session.warning ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {session.date}
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{session.time}</div>
                  </td>
                  <td>{session.school}</td>
                  <td>
                    <span className="badge badge-primary">{session.module}</span>
                  </td>
                  <td>
                     <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {session.mentors.map(m => (
                          <span key={m} style={{ fontSize: '12px', padding: '2px 8px', background: 'var(--bg-glass)', borderRadius: '12px', border: session.warning && m === 'Ramesh K.' ? '1px solid var(--danger-400)' : '1px solid var(--border-subtle)' }}>
                            {m} {session.warning && m === 'Ramesh K.' && '⚠️'}
                          </span>
                        ))}
                     </div>
                  </td>
                  <td>
                    {session.status === 'confirmed' ? (
                      <span className="badge badge-success">Confirmed</span>
                    ) : (
                      <span className="badge badge-warning">Planned</span>
                    )}
                  </td>
                  <td>
                    <button className="section-action" style={{ border: 'none', background: 'transparent' }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
