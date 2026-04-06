"use client";

import Link from "next/link";
import { useState } from "react";

const mockSchools = [
  { id: 1, name: "Bharathi Vidya Bhavan", district: "Erode", board: "CBSE", students: 450, status: "scheduled", contact: "Principal Sharma", grade: "8-11" },
  { id: 2, name: "Govt. Boys Hr Sec School", district: "Erode", board: "Government", students: 820, status: "assessed", contact: "Mr. Rajendran", grade: "9-11" },
  { id: 3, name: "St. Mary's Matriculation", district: "Tiruppur", board: "Matriculation", students: 310, status: "completed", contact: "Sister Mary", grade: "8-10" },
  { id: 4, name: "Kongu Vellalar Matric", district: "Erode", board: "Matriculation", students: 620, status: "registered", contact: "Mrs. Kavitha", grade: "8-11" },
  { id: 5, name: "JKKN Public School", district: "Namakkal", board: "CBSE", students: 540, status: "assessed", contact: "Dr. Ramesh", grade: "9-11" },
];

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusConfig = {
    completed: { label: 'Completed', class: 'badge-success', icon: '✓' },
    scheduled: { label: 'Scheduled', class: 'badge-primary', icon: '◎' },
    assessed: { label: 'Assessed', class: 'badge-warning', icon: '◉' },
    registered: { label: 'Registered', class: 'badge-info', icon: '○' },
  };

  const filteredSchools = mockSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || school.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">School Management</h1>
            <p className="page-subtitle">Manage participating schools and track their assessment progress</p>
          </div>
          <button className="btn btn-primary">
            <span>+</span> Register School
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        marginBottom: '28px',
        animation: 'fadeInUp 0.5s ease-out 0.1s both'
      }}>
        {[
          { label: 'Total Schools', value: mockSchools.length, color: 'var(--primary-400)' },
          { label: 'Assessed', value: mockSchools.filter(s => s.status === 'assessed').length, color: 'var(--warning-400)' },
          { label: 'Scheduled', value: mockSchools.filter(s => s.status === 'scheduled').length, color: 'var(--info-400)' },
          { label: 'Completed', value: mockSchools.filter(s => s.status === 'completed').length, color: 'var(--success-400)' },
        ].map((stat) => (
          <div key={stat.label} style={{
            padding: '18px 20px',
            borderRadius: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: stat.color, letterSpacing: '-1px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div className="form-group" style={{ marginBottom: 0, minWidth: '280px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="🔍  Search schools by name or district..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '6px', 
              background: 'var(--bg-glass)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '4px',
              border: '1px solid var(--border-subtle)'
            }}>
              {['all', 'registered', 'assessed', 'scheduled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : ''}`}
                  style={{
                    border: 'none',
                    textTransform: 'capitalize',
                    fontSize: '11px',
                    padding: '5px 12px',
                    background: filterStatus === status ? undefined : 'transparent',
                    color: filterStatus === status ? 'white' : 'var(--text-secondary)',
                    boxShadow: filterStatus === status ? undefined : 'none'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">📤 Export CSV</button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>School Name</th>
                <th>District</th>
                <th>Board</th>
                <th>Grades</th>
                <th>Students</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map(school => {
                const status = statusConfig[school.status];
                return (
                  <tr key={school.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)", letterSpacing: '-0.1px' }}>{school.name}</td>
                    <td>{school.district}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'var(--bg-glass-strong)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {school.board}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{school.grade}</td>
                    <td style={{ fontWeight: 600 }}>{school.students.toLocaleString()}</td>
                    <td>{school.contact}</td>
                    <td><span className={`badge ${status.class}`}>{status.icon} {status.label}</span></td>
                    <td>
                      <Link href={`/schools/${school.id}`} className="section-action" style={{ textDecoration: 'none' }}>
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-state-icon">🏫</div>
                      <div className="empty-state-title">No schools found</div>
                      <div className="empty-state-text">Try adjusting your search criteria or register a new school.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
