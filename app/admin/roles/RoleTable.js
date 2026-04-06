'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function RoleTable({ initialProfiles }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [loadingId, setLoadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const supabase = createClient();

  const handleRoleChange = async (profileId, newRole) => {
    setLoadingId(profileId);
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', profileId);
      
    if (error) {
      alert(`Failed to update role: ${error.message}`);
    } else {
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, role: newRole } : p));
      setSuccessId(profileId);
      setTimeout(() => setSuccessId(null), 2000);
    }
    setLoadingId(null);
  };

  const roleColors = {
    admin: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', label: 'Administrator' },
    school_coordinator: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', label: 'Coordinator' },
    mentor: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: '#10b981', label: 'Mentor' },
    unassigned: { bg: 'rgba(113, 113, 122, 0.08)', border: 'rgba(113, 113, 122, 0.2)', text: '#71717a', label: 'Unassigned' },
  };

  return (
    <div className="card">
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h2 className="section-title">Registered Users</h2>
        <span className="badge badge-primary">{profiles.length} users</span>
      </div>

      {profiles.length === 0 ? (
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>No users yet</h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
            Users will appear here after they sign in with Google for the first time.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const currentRole = roleColors[profile.role] || roleColors.unassigned;
                return (
                  <tr key={profile.id} style={{
                    background: successId === profile.id ? 'rgba(16, 185, 129, 0.04)' : undefined,
                    transition: 'background 0.3s'
                  }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'U')}&background=6366f1&color=fff&bold=true`} 
                          alt="Avatar"
                          style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            border: `2px solid ${currentRole.border}`,
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                            {profile.full_name || 'Anonymous'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                            ID: {profile.id?.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {profile.email || '—'}
                    </td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                      {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: currentRole.text,
                        background: currentRole.bg,
                        border: `1px solid ${currentRole.border}`,
                      }}>
                        {currentRole.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                          value={profile.role || 'unassigned'}
                          onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                          disabled={loadingId === profile.id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            outline: 'none',
                            minWidth: '140px'
                          }}
                        >
                          <option value="admin">🔐 Administrator</option>
                          <option value="school_coordinator">🏫 School Coordinator</option>
                          <option value="mentor">👤 Mentor</option>
                          <option value="unassigned">⏳ Unassigned</option>
                        </select>
                        {loadingId === profile.id && (
                          <span style={{ fontSize: '11px', color: 'var(--primary-400)', fontWeight: 600 }}>Saving...</span>
                        )}
                        {successId === profile.id && (
                          <span style={{ fontSize: '11px', color: 'var(--success-400)', fontWeight: 600 }}>✓ Saved</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
