"use client";

import Link from "next/link";

const mockAssessments = [
  { id: 1, school: "Govt. Boys Hr Sec School", date: "2026-04-03", finalCode: "A2-B3", status: "completed", assessedBy: "Dr. Anitha", overridden: false },
  { id: 2, school: "St. Mary's Matriculation", date: "2026-04-01", finalCode: "A1-B1", status: "completed", assessedBy: "Admin", overridden: true },
  { id: 3, school: "Kongu Vellalar Matric", date: "Pending", finalCode: "-", status: "pending", assessedBy: "-", overridden: false },
  { id: 4, school: "Bharathi Vidya Bhavan", date: "2026-03-29", finalCode: "A2-B2", status: "completed", assessedBy: "Ramesh K.", overridden: false },
];

const moduleCodeColors = {
  'A1': 'var(--success-400)',
  'A2': 'var(--primary-400)',
  'A3': 'var(--danger-400)',
};

export default function AssessmentsPage() {
  const completedCount = mockAssessments.filter(a => a.status === 'completed').length;
  const pendingCount = mockAssessments.filter(a => a.status === 'pending').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Assessments</h1>
            <p className="page-subtitle">Track school assessment results and assign module codes via the 3×3 Matrix</p>
          </div>
          <Link href="/assessments/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <span>+</span> Start Assessment
          </Link>
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
        <div style={{
          padding: '18px 20px',
          borderRadius: '14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span>📝</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-400)', letterSpacing: '-0.5px' }}>{mockAssessments.length}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Assessments</div>
        </div>
        <div style={{
          padding: '18px 20px',
          borderRadius: '14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span>✅</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success-400)', letterSpacing: '-0.5px' }}>{completedCount}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Completed</div>
        </div>
        <div style={{
          padding: '18px 20px',
          borderRadius: '14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span>⏳</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--warning-400)', letterSpacing: '-0.5px' }}>{pendingCount}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Pending</div>
        </div>
      </div>

      <div className="card" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        <div className="section-header">
          <h2 className="section-title">Assessment Records</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm">🔍 Filter</button>
            <button className="btn btn-secondary btn-sm">📤 Export</button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>School Name</th>
                <th>Assessment Date</th>
                <th>Module Code</th>
                <th>Assessed By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockAssessments.map(assessment => {
                const codeColor = assessment.finalCode !== '-' 
                  ? moduleCodeColors[assessment.finalCode.split('-')[0]] || 'var(--primary-400)'
                  : 'var(--text-tertiary)';
                
                return (
                  <tr key={assessment.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)", letterSpacing: '-0.1px' }}>{assessment.school}</td>
                    <td style={{ fontWeight: 500 }}>{assessment.date}</td>
                    <td>
                      {assessment.finalCode !== "-" ? (
                        <span style={{ 
                          fontWeight: 800, 
                          color: codeColor,
                          padding: '4px 12px',
                          borderRadius: '8px',
                          background: `${codeColor}12`,
                          border: `1px solid ${codeColor}25`,
                          fontSize: '13px',
                          letterSpacing: '0.5px'
                        }}>
                          {assessment.finalCode}
                          {assessment.overridden && (
                            <span style={{ 
                              marginLeft: '6px', 
                              fontSize: '10px',
                              color: 'var(--warning-400)',
                              fontWeight: 600
                            }}>
                              (overridden)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{assessment.assessedBy}</td>
                    <td>
                      {assessment.status === 'completed' ? (
                        <span className="badge badge-success">✓ Completed</span>
                      ) : (
                        <span className="badge badge-warning">◎ Pending</span>
                      )}
                    </td>
                    <td>
                      <button className="section-action" style={{ border: 'none', background: 'transparent' }}>
                        {assessment.status === 'completed' ? 'View →' : 'Continue →'}
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
