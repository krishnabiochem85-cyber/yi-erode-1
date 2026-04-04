"use client";

import Link from "next/link";

// 3x3 Matrix Logic Visualization
const modules = [
  { code: "A1-B1", name: "Foundation Focus", desc: "For aware schools with low behavioral risk issues", color: "var(--success-bg)", text: "var(--success-400)" },
  { code: "A2-B1", name: "Guided Prevention", desc: "For moderate awareness schools with low risk", color: "var(--success-bg)", text: "var(--success-400)" },
  { code: "A3-B1", name: "Intensive Basics", desc: "For unaware schools with low risk", color: "var(--success-bg)", text: "var(--success-400)" },
  
  { code: "A1-B2", name: "Targeted Interventions", desc: "High awareness, moderate behavioral risk", color: "var(--warning-bg)", text: "var(--warning-400)" },
  { code: "A2-B2", name: "Balanced Core", desc: "Moderate awareness, moderate risk (Typical)", color: "var(--primary-glow)", text: "var(--primary-400)" },
  { code: "A3-B2", name: "Deep Structuring", desc: "Low awareness, moderate risk", color: "var(--warning-bg)", text: "var(--warning-400)" },
  
  { code: "A1-B3", name: "Advanced Mitigation", desc: "High awareness but deep behavioral issues", color: "var(--danger-bg)", text: "var(--danger-400)" },
  { code: "A2-B3", name: "Critical Support", desc: "Moderate awareness with high behavioral risk", color: "var(--danger-bg)", text: "var(--danger-400)" },
  { code: "A3-B3", name: "Crisis Management", desc: "Low awareness with high risk behaviors", color: "rgba(239, 68, 68, 0.2)", text: "#fca5a5" }
];

export default function ModulesPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Module Assignment Matrix</h1>
            <p className="page-subtitle">The 9 designated Project Shield modules categorized by demographic (A) and behavior (B)</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Y Axis Label */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '20px' }}>
          <div style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Behavioral Axis (B) →
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>A1 (High Awareness)</div>
            <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>A2 (Moderate)</div>
            <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>A3 (Low Awareness)</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 180px)', gap: '16px' }}>
            {modules.map((mod) => (
              <div key={mod.code} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: `1px solid ${mod.text}`, backgroundColor: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: mod.color, color: mod.text, fontWeight: 700, fontSize: '14px' }}>
                    {mod.code}
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }}>Edit</button>
                </div>
                
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{mod.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1 }}>
                  {mod.desc}
                </p>
                
                <div style={{ marginTop: 'auto', fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📋 4 Activities</span>
                  <span>•</span>
                  <span>⏱️ 90 mins</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Demographic Axis (A) →
          </div>
        </div>
      </div>
    </div>
  );
}
