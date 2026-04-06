"use client";

import { useState } from "react";

const mockMentors = [
  { id: 1, name: "Dr. Anitha", department: "Psychology", institution: "JKKN Arts & Science", specialization: "Child Behavior", status: "active", sessionsConducted: 14, rating: 4.9, avatar: "DA" },
  { id: 2, name: "Ramesh K.", department: "Social Work", institution: "JKKN Engineering", specialization: "Substance Mitigation", status: "active", sessionsConducted: 8, rating: 4.5, avatar: "RK" },
  { id: 3, name: "Prof. Murugan", department: "Education", institution: "JKKN Education", specialization: "Curriculum Planning", status: "inactive", sessionsConducted: 2, rating: 4.2, avatar: "PM" },
  { id: 4, name: "Sneha V.", department: "Psychology", institution: "JKKN Arts & Science", specialization: "Peer Pressure Counseling", status: "active", sessionsConducted: 5, rating: 4.7, avatar: "SV" },
  { id: 5, name: "Dr. Karthik", department: "Psychiatry", institution: "JKKN Medical", specialization: "Addiction Recovery", status: "active", sessionsConducted: 11, rating: 4.8, avatar: "DK" },
];

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const filteredMentors = mockMentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMentors = mockMentors.filter(m => m.status === 'active').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Mentor Management</h1>
            <p className="page-subtitle">JKKN Institution Volunteers and Specialists</p>
          </div>
          <button className="btn btn-primary">
            <span>+</span> Add Mentor
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        marginBottom: '28px',
        animation: 'fadeInUp 0.4s ease-out 0.1s both'
      }}>
        {[
          { label: 'Total Mentors', value: mockMentors.length, color: 'var(--primary-400)', icon: '👥' },
          { label: 'Active', value: activeMentors, color: 'var(--success-400)', icon: '✅' },
          { label: 'Total Sessions', value: mockMentors.reduce((a, m) => a + m.sessionsConducted, 0), color: 'var(--accent-400)', icon: '📊' },
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

      {/* Search & View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', animation: 'fadeInUp 0.4s ease-out 0.15s both' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: '360px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="🔍  Search by name or specialization..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          background: 'var(--bg-glass)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '4px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button 
            onClick={() => setViewMode('cards')} 
            className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : ''}`}
            style={{ border: 'none', boxShadow: viewMode === 'cards' ? undefined : 'none', background: viewMode === 'cards' ? undefined : 'transparent' }}
          >
            Cards
          </button>
          <button 
            onClick={() => setViewMode('table')} 
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : ''}`}
            style={{ border: 'none', boxShadow: viewMode === 'table' ? undefined : 'none', background: viewMode === 'table' ? undefined : 'transparent' }}
          >
            Table
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '18px',
          animation: 'fadeInUp 0.4s ease-out 0.2s both'
        }}>
          {filteredMentors.map((mentor, index) => (
            <div key={mentor.id} className="card" style={{ 
              padding: '24px',
              animation: `fadeInUp 0.4s ease-out ${index * 70}ms both`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: mentor.status === 'active' 
                    ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                    : 'linear-gradient(135deg, #3f3f46, #52525b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: mentor.status === 'active' ? '0 0 16px rgba(99, 102, 241, 0.2)' : 'none'
                }}>
                  {mentor.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{mentor.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{mentor.institution}</div>
                </div>
                {mentor.status === 'active' ? (
                  <span className="badge badge-success" style={{ fontSize: '11px' }}>Active</span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: '11px' }}>Inactive</span>
                )}
              </div>

              <div style={{ 
                padding: '14px 16px', 
                background: 'var(--bg-glass)', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Specialization</div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{mentor.specialization}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{mentor.department}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-400)', letterSpacing: '-0.5px' }}>{mentor.sessionsConducted}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Sessions</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--warning-400)', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {mentor.rating} <span style={{ fontSize: '12px' }}>★</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Rating</div>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">Manage →</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease-out 0.2s both' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Institution & Department</th>
                  <th>Specialization</th>
                  <th>Sessions</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMentors.map(mentor => (
                  <tr key={mentor.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{mentor.name}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{mentor.institution}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{mentor.department}</div>
                    </td>
                    <td>{mentor.specialization}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-400)' }}>{mentor.sessionsConducted}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--warning-400)' }}>{mentor.rating}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}> ★</span>
                    </td>
                    <td>
                      {mentor.status === 'active' ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-warning">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button className="section-action" style={{ border: 'none', background: 'transparent' }}>
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
