"use client";

import Link from "next/link";

const mockAssessments = [
  { id: 1, school: "Govt. Boys Hr Sec School", date: "2026-04-03", finalCode: "A2-B3", status: "completed" },
  { id: 2, school: "St. Mary's Matriculation", date: "2026-04-01", finalCode: "A1-B1", status: "completed" },
  { id: 3, school: "Kongu Vellalar Matric", date: "Pending", finalCode: "-", status: "pending" },
];

export default function AssessmentsPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Assessments</h1>
            <p className="page-subtitle">Track school assessment results and assign module codes</p>
          </div>
          <Link href="/assessments/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <span>+</span> Start Assessment
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <h2 className="section-title">Recent Assessments</h2>
          <button className="btn btn-secondary btn-sm">Filter</button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>School Name</th>
                <th>Assessment Date</th>
                <th>Module Code</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockAssessments.map(assessment => (
                <tr key={assessment.id}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{assessment.school}</td>
                  <td>{assessment.date}</td>
                  <td>
                    {assessment.finalCode !== "-" ? (
                      <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{assessment.finalCode}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {assessment.status === 'completed' ? (
                      <span className="badge badge-success">Completed</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    <button className="section-action" style={{ border: 'none', background: 'transparent' }}>
                      {assessment.status === 'completed' ? 'View Details' : 'Continue'}
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
