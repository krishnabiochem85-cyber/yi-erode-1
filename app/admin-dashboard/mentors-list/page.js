"use client";

import { useState, useEffect } from "react";
import { getMentorsList } from "@/utils/admin-data-actions";

export default function MentorsListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, 1 = next month

  useEffect(() => {
    async function load() {
      const resp = await getMentorsList();
      setData(resp || []);
      setLoading(false);
    }
    load();
  }, []);

  // Compute month window
  const now = new Date();
  const targetYear = now.getFullYear();
  const targetMonth = now.getMonth() + monthOffset;
  const filteredMonthName = new Date(targetYear, targetMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="page-title">Mentors Intelligence Board</h1>
          <p className="page-subtitle">Track mentor availability, backgrounds, and historical sessions.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", background: "var(--bg-elevated)", padding: "8px", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <button 
            onClick={() => setMonthOffset(0)} 
            className={`btn ${monthOffset === 0 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: "8px 16px" }}
          >
            Present Month
          </button>
          <button 
            onClick={() => setMonthOffset(1)} 
            className={`btn ${monthOffset === 1 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: "8px 16px" }}
          >
            Next Month
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "16px", fontWeight: 700, color: "var(--primary-400)" }}>
        Viewing Availability For: {filteredMonthName}
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading mentor dossiers...</div>
        ) : data.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-tertiary)" }}>No mentors registered.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "var(--bg-glass)", borderBottom: "1px solid var(--border-subtle)" }}>
                <tr>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Identity</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Email</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Course & College</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Contact No.</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px", width: "20%" }}>{filteredMonthName} Availability</th>
                  <th style={{ padding: "16px 24px", fontWeight: 700, color: "var(--text-secondary)", fontSize: "14px" }}>Past Sessions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => {
                  // Filter availability by the selected month/year
                  const avail = (row.mentor_availability || []).filter(a => {
                    const d = new Date(a.date);
                    return d.getMonth() === (targetMonth % 12) && d.getFullYear() === (targetYear + Math.floor(targetMonth / 12));
                  });

                  const freeDates = avail.filter(a => a.type === 'free').map(a => new Date(a.date).getDate());
                  
                  // Filter sessions inside session_mentors
                  const pastSessions = (row.session_mentors || []).map(sm => sm.sessions).filter(s => s && new Date(s.session_date) < now);

                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid var(--border-subtle)", background: i % 2 === 0 ? "transparent" : "var(--bg-elevated)", transition: "background 0.2s" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ fontWeight: 600 }}>{row.full_name}</div>
                        <div style={{ fontSize: "12px", color: "var(--primary-400)", fontWeight: 700 }}>Alias: {row.pseudo_name || 'N/A'}</div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)", fontSize: "13px" }}>{row.email || '—'}</td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                        <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{row.course || <span style={{ color: "var(--warning-400)" }}>Unknown Course</span>}</div>
                        <div style={{ fontSize: "12px" }}>{row.college || 'Unknown College'}</div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>{row.phone || <span style={{ color: "var(--error-400)" }}>Missing</span>}</td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                        {freeDates.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {freeDates.map(d => (
                              <span key={d} style={{ background: "var(--emerald-glow)", color: "var(--emerald-400)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: 700 }}>
                                {d}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>No dates marked free.</span>
                        )}
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--text-secondary)", fontSize: "13px" }}>
                        {pastSessions.length > 0 ? (
                          <ul style={{ paddingLeft: "16px", margin: 0 }}>
                            {pastSessions.map(s => (
                              <li key={s.id}>{s.schools.name} <span style={{ color: "var(--text-tertiary)" }}>({new Date(s.session_date).toLocaleDateString()})</span></li>
                            ))}
                          </ul>
                        ) : (
                          <span style={{ color: "var(--text-tertiary)" }}>None</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
