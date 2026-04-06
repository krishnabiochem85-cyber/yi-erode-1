"use client";

const modules = [
  { code: "A1-B1", name: "Foundation Focus", desc: "For aware schools with low behavioral risk issues", color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
  { code: "A2-B1", name: "Guided Prevention", desc: "For moderate awareness schools with low risk", color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
  { code: "A3-B1", name: "Intensive Basics", desc: "For unaware schools with low risk", color: '#34d399', bg: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.15)' },
  
  { code: "A1-B2", name: "Targeted Interventions", desc: "High awareness, moderate behavioral risk", color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)' },
  { code: "A2-B2", name: "Balanced Core", desc: "Moderate awareness, moderate risk (Typical)", color: '#818cf8', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)' },
  { code: "A3-B2", name: "Deep Structuring", desc: "Low awareness, moderate risk", color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.15)' },
  
  { code: "A1-B3", name: "Advanced Mitigation", desc: "High awareness but deep behavioral issues", color: '#f87171', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)' },
  { code: "A2-B3", name: "Critical Support", desc: "Moderate awareness with high behavioral risk", color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)' },
  { code: "A3-B3", name: "Crisis Management", desc: "Low awareness with high risk behaviors", color: '#fca5a5', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' }
];

const schoolCounts = [12, 5, 2, 8, 24, 15, 3, 18, 37];

const riskLabels = ['B1 — Low Risk', 'B2 — Moderate Risk', 'B3 — High Risk'];

export default function ModulesPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Module Assignment Matrix</h1>
            <p className="page-subtitle">The 9 designated Project Shield modules — Demographic (A) × Behavioral (B)</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary">📊 Analytics</button>
            <button className="btn btn-primary">Edit Modules</button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '28px',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        animation: 'fadeInUp 0.4s ease-out 0.1s both'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Risk Level:
        </div>
        {[
          { label: 'Low Risk', color: '#10b981' },
          { label: 'Moderate Risk', color: '#f59e0b' },
          { label: 'High Risk', color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, boxShadow: `0 0 8px ${item.color}40` }}></span>
            {item.label}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
          Total Schools: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{schoolCounts.reduce((a, b) => a + b, 0)}</span>
        </div>
      </div>

      {/* Matrix */}
      <div style={{ display: 'flex', gap: '24px', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        {/* Y Axis Label */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '28px', flexShrink: 0 }}>
          <div style={{ 
            transform: 'rotate(-90deg)', 
            whiteSpace: 'nowrap', 
            fontWeight: 700, 
            color: 'var(--text-tertiary)', 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            fontSize: '10px'
          }}>
            Behavioral Axis (B) →
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {/* Column Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '12px' }}>
            {['A1 — High Awareness', 'A2 — Moderate', 'A3 — Low Awareness'].map((label) => (
              <div key={label} style={{ 
                textAlign: 'center', 
                fontWeight: 700, 
                color: 'var(--text-secondary)', 
                fontSize: '12px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                letterSpacing: '0.3px'
              }}>
                {label}
              </div>
            ))}
          </div>

          {/* Module Grid - 3 rows */}
          {[0, 1, 2].map((row) => (
            <div key={row}>
              {/* Row label */}
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                color: 'var(--text-tertiary)', 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                marginBottom: '8px',
                marginTop: row > 0 ? '16px' : '0',
                paddingLeft: '4px'
              }}>
                {riskLabels[row]}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '200px', gap: '16px' }}>
              {modules.slice(row * 3, row * 3 + 3).map((mod, colIndex) => {
                const globalIndex = row * 3 + colIndex;
                return (
                  <div key={mod.code} className="card" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '22px', 
                    borderColor: mod.border,
                    background: mod.bg,
                    cursor: 'pointer',
                    animation: `fadeInUp 0.4s ease-out ${globalIndex * 60}ms both`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ 
                        padding: '5px 14px', 
                        borderRadius: '8px', 
                        backgroundColor: `${mod.color}15`, 
                        color: mod.color, 
                        fontWeight: 800, 
                        fontSize: '13px',
                        border: `1px solid ${mod.color}30`,
                        letterSpacing: '0.5px'
                      }}>
                        {mod.code}
                      </div>
                      <div style={{ 
                        fontSize: '22px', 
                        fontWeight: 800, 
                        color: mod.color,
                        letterSpacing: '-0.5px'
                      }}>
                        {schoolCounts[globalIndex]}
                      </div>
                    </div>
                    
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{mod.name}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                      {mod.desc}
                    </p>
                    
                    <div style={{ 
                      marginTop: 'auto', 
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '11px', 
                      color: 'var(--text-tertiary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      fontWeight: 500
                    }}>
                      <span>📋 4 Activities</span>
                      <span style={{ opacity: 0.3 }}>•</span>
                      <span>⏱️ 90 mins</span>
                      <span style={{ opacity: 0.3 }}>•</span>
                      <span style={{ color: mod.color, fontWeight: 600 }}>{schoolCounts[globalIndex]} schools</span>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          ))}

          {/* Bottom Axis Label */}
          <div style={{ 
            textAlign: 'center', 
            fontWeight: 700, 
            color: 'var(--text-tertiary)', 
            marginTop: '24px', 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            fontSize: '10px'
          }}>
            Demographic Axis (A) →
          </div>
        </div>
      </div>
    </div>
  );
}
