"use client";

import { useEffect, useState } from "react";
import { getAllMentorsWithAllocations } from "@/utils/admin-mentor-actions";

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await getAllMentorsWithAllocations();
        setMentors(data);
      } catch (err) {
        console.error("Error loading mentors:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMentors();
  }, []);

  const filteredMentors = mentors.filter(mentor => 
    mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMentors = mentors.length; // Simplified for now since status isn't in profiles yet

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Mentors...</div>;

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
          { label: 'Total Mentors', value: mentors.length, color: 'var(--primary-400)', icon: '👥' },
          { label: 'Active', value: activeMentors, color: 'var(--success-400)', icon: '✅' },
          { label: 'Total Allocations', value: mentors.reduce((a, m) => a + (m.allocations?.length || 0), 0), color: 'var(--accent-400)', icon: '📊' },
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
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 0 16px rgba(99, 102, 241, 0.2)'
                }}>
                  {mentor.full_name?.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{mentor.full_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{mentor.email}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '11px' }}>Active</span>
              </div>

              <div style={{ 
                padding: '14px 16px', 
                background: 'var(--bg-glass)', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Current Allocation</div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {mentor.allocations?.length > 0 ? mentor.allocations.map(a => a.schoolName).join(', ') : 'None assigned'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-400)', letterSpacing: '-0.5px' }}>{mentor.allocations?.length || 0}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Schools</div>
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
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{mentor.full_name}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{mentor.email}</div>
                    </td>
                    <td>{mentor.allocations?.length || 0} Schools</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-400)' }}>{mentor.allocations?.length || 0}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--warning-400)' }}>5.0</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}> ★</span>
                    </td>
                    <td>
                      <span className="badge badge-success">Active</span>
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
