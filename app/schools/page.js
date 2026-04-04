"use client";

import Link from "next/link";
import { useState } from "react";

// Mock Data for Phase 2 implementation
const mockSchools = [
  { id: 1, name: "Bharathi Vidya Bhavan", district: "Erode", board: "CBSE", students: 450, status: "scheduled", contact: "Principal Sharma" },
  { id: 2, name: "Govt. Boys Hr Sec School", district: "Erode", board: "Government", students: 820, status: "assessed", contact: "Mr. Rajendran" },
  { id: 3, name: "St. Mary's Matriculation", district: "Tiruppur", board: "Matriculation", students: 310, status: "completed", contact: "Sister Mary" },
  { id: 4, name: "Kongu Vellalar Matric", district: "Erode", board: "Matriculation", students: 620, status: "registered", contact: "Mrs. Kavitha" }
];

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge badge-success">Completed</span>;
      case 'scheduled': return <span className="badge badge-primary">Scheduled</span>;
      case 'assessed': return <span className="badge badge-warning">Assessed</span>;
      default: return <span className="badge badge-info">Registered</span>;
    }
  };

  const filteredSchools = mockSchools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="card">
        <div className="section-header">
          <div className="form-group" style={{ marginBottom: 0, minWidth: '300px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search schools by name or district..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary btn-sm">Export CSV</button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>School Name</th>
                <th>District</th>
                <th>Board</th>
                <th>Students (8-11)</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map(school => (
                <tr key={school.id}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{school.name}</td>
                  <td>{school.district}</td>
                  <td>{school.board}</td>
                  <td>{school.students}</td>
                  <td>{school.contact}</td>
                  <td>{getStatusBadge(school.status)}</td>
                  <td>
                    <Link href={`/schools/${school.id}`} className="section-action" style={{ textDecoration: 'none' }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan="7">
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
