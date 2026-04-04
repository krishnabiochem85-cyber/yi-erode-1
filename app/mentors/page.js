"use client";

import { useState } from "react";

const mockMentors = [
  { id: 1, name: "Dr. Anitha", department: "Psychology", institution: "JKKN Arts & Science", specialization: "Child Behavior", status: "active", sessionsConducted: 14 },
  { id: 2, name: "Ramesh K.", department: "Social Work", institution: "JKKN Engineering", specialization: "Substance Mitigation", status: "active", sessionsConducted: 8 },
  { id: 3, name: "Prof. Murugan", department: "Education", institution: "JKKN Education", specialization: "Curriculum Planning", status: "inactive", sessionsConducted: 2 },
  { id: 4, name: "Sneha V.", department: "Psychology", institution: "JKKN Arts & Science", specialization: "Peer Pressure Counseling", status: "active", sessionsConducted: 5 },
];

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMentors = mockMentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="card">
        <div className="section-header">
          <div className="form-group" style={{ marginBottom: 0, minWidth: '300px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name or specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <button className="btn btn-secondary btn-sm">Filter Active</button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Institution & Department</th>
                <th>Specialization</th>
                <th>Sessions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map(mentor => (
                <tr key={mentor.id}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{mentor.name}</td>
                  <td>
                    <div>{mentor.institution}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{mentor.department}</div>
                  </td>
                  <td>{mentor.specialization}</td>
                  <td>{mentor.sessionsConducted}</td>
                  <td>
                    {mentor.status === 'active' ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-warning">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button className="section-action" style={{ border: 'none', background: 'transparent' }}>
                      Manage Allocation
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
