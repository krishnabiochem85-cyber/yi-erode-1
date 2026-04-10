"use client";

import { useState, useEffect } from "react";
import { getSchoolCoordinatorsList } from "@/utils/admin-data-actions";

export default function SchoolsListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const resp = await getSchoolCoordinatorsList();
      setData(resp || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header">
        <h1 className="page-title">School Coordinators Directory</h1>
        <p className="page-subtitle">Overview of registered school representatives and their application status.</p>
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading coordinator data...</div>
        ) : data.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-tertiary)" }}>No school coordinators found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "var(--bg-glass)", borderBottom: "1px solid var(--border-subtle)" }}>
                <tr>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Coordinator Name</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>School Assigned</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Email ID</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Contact No.</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id} style={{ 
                    borderBottom: "1px solid var(--border-subtle)", 
                    background: i % 2 === 0 ? "transparent" : "var(--bg-elevated)", /* Tinted */
                    transition: "background 0.2s"
                  }}>
                    <td style={{ padding: "16px 24px", fontWeight: 600 }}>{row.full_name || 'N/A'}</td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                      {row.schools ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>{row.schools.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{row.schools.district}</div>
                        </div>
                      ) : (
                        <span style={{ color: "var(--amber-400)" }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>{row.email}</td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>{row.phone || <span style={{ color: "var(--error-400)" }}>Missing</span>}</td>
                    <td style={{ padding: "16px 24px" }}>
                      {row.schools?.status ? (
                        <span className={`badge badge-${row.schools.status === 'approved' ? 'success' : row.schools.status === 'rejected' ? 'danger' : 'warning'}`}>
                          {row.schools.status}
                        </span>
                      ) : (
                        <span className="badge badge-info">Pending Assign</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
