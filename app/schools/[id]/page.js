"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data
const mockSchoolDetails = {
  id: 1, 
  name: "Bharathi Vidya Bhavan", 
  district: "Erode", 
  board: "CBSE", 
  address: "123 School Road, Erode 638001",
  contact: { name: "Principal Sharma", phone: "+91 9876543210", email: "principal@bvb.edu.in" },
  demographics: {
    students: 450,
    grades: [8, 9, 10, 11]
  },
  status: "scheduled",
  moduleAssigned: "A2-B2",
  sessions: [
    { id: 1, type: "initial", date: "2026-04-15", time: "10:00 AM", status: "planned", mentors: ["Dr. Anitha", "Ramesh K."] }
  ]
};

export default function SchoolDetailPage() {
  const params = useParams();
  const school = mockSchoolDetails;

  return (
    <div>
      <div className="page-header">
        <Link href="/schools" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '8px', display: 'inline-block' }}>
          ← Back to Schools
        </Link>
        <div className="page-header-row">
          <div>
            <h1 className="page-title">{school.name}</h1>
            <p className="page-subtitle">{school.district} • {school.board} Board • {school.students || school.demographics.students} Students</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary">Edit Details</button>
            <button className="btn btn-primary">Schedule Session</button>
          </div>
        </div>
      </div>

      <div className="content-grid" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">School Information</h2>
          </div>
          <div className="form-group">
            <div className="form-label">Contact Person</div>
            <div>{school.contact.name} ({school.contact.phone})</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{school.contact.email}</div>
          </div>
          <div className="form-group">
            <div className="form-label">Address</div>
            <div>{school.address}</div>
          </div>
          <div className="form-group">
            <div className="form-label">Participating Grades</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {school.demographics.grades.map(g => (
                <span key={g} className="badge badge-info">Grade {g}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Program Status</h2>
            <span className="badge badge-primary">Scheduled</span>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div className="form-label" style={{ marginBottom: '8px' }}>Module Assigned</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="matrix-cell" style={{ display: 'inline-flex', width: '48px', height: '48px', backgroundColor: 'var(--accent-glow)', border: '1px solid var(--accent-400)' }}>
                <span style={{ fontSize: '14px', color: 'var(--accent-400)' }}>{school.moduleAssigned}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Based on Demographic A2 and Behavioral B2 assessment.
              </div>
            </div>
          </div>

          <div>
            <div className="form-label" style={{ marginBottom: '8px' }}>Upcoming Sessions</div>
            {school.sessions.map(session => (
              <div key={session.id} style={{ padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{session.type} Session</span>
                  <span className="badge badge-warning">{session.status}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  📅 {session.date} at {session.time}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  👥 Mentors: {session.mentors.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
