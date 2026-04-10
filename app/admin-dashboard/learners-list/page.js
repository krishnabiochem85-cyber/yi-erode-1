"use client";

import { useState, useEffect } from "react";
import { getLearnersList } from "@/utils/admin-data-actions";

export default function LearnersListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const resp = await getLearnersList();
      setData(resp || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header">
        <h1 className="page-title">Learners Roster</h1>
        <p className="page-subtitle">Master list of enrolled students, their classes, and their allocated mentors.</p>
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading learner database...</div>
        ) : data.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-tertiary)" }}>No learners found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "var(--bg-glass)", borderBottom: "1px solid var(--border-subtle)" }}>
                <tr>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Learner Name</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Academic Class</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Enrolled School</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Allocated Mentor (Alias)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id} style={{ 
                    borderBottom: "1px solid var(--border-subtle)", 
                    background: i % 2 === 0 ? "transparent" : "var(--bg-elevated)", 
                    transition: "background 0.2s" 
                  }}>
                    <td style={{ padding: "16px 24px", fontWeight: 600 }}>{row.full_name || 'Anonymous Student'}</td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                      {row.academic_class ? (
                        <span className="badge badge-info">{row.academic_class}</span>
                      ) : (
                        <span style={{ color: "var(--error-400)", fontSize: "12px" }}>Not provided</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                      {row.schools ? row.schools.name : <span style={{ color: "var(--amber-400)" }}>Unassigned</span>}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      {row.mentor ? (
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.mentor.pseudo_name || 'N/A'}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Real name hidden from learner</div>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-tertiary)", fontSize: "13px" }}>Awaiting allocation</span>
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
