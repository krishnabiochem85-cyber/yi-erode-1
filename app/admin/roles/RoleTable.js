'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './roles.module.css';

export default function RoleTable({ initialProfiles }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [loadingId, setLoadingId] = useState(null);
  const supabase = createClient();

  const handleRoleChange = async (profileId, newRole) => {
    setLoadingId(profileId);
    
    // Update role in Supabase profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profileId);
      
    if (error) {
      alert(`Failed to update role: ${error.message}`);
    } else {
      // Update local state
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, role: newRole } : p));
    }
    setLoadingId(null);
  };

  const roleColors = {
    admin: '#ef4444', // red
    school_coordinator: '#f59e0b', // yellow
    mentor: '#10b981', // green
    unassigned: '#71717a' // gray
  };

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>User Profile</th>
            <th className={styles.th}>Joined At</th>
            <th className={styles.th}>Access Level</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.profileInfo}>
                  <img 
                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || 'U'}`} 
                    alt="Avatar" 
                    className={styles.avatar}
                  />
                  <div>
                    <div className={styles.name}>{profile.full_name || 'Anonymous User'}</div>
                    <div className={styles.id}>ID: {profile.id.substring(0, 12)}...</div>
                  </div>
                </div>
              </td>
              <td className={styles.td} style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
                {new Date(profile.updated_at || Date.now()).toLocaleDateString()}
              </td>
              <td className={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span 
                    className={styles.statusIndicator} 
                    style={{ backgroundColor: roleColors[profile.role] || roleColors.unassigned }}
                  ></span>
                  <select 
                    className={styles.roleSelect}
                    value={profile.role}
                    onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                    disabled={loadingId === profile.id}
                  >
                    <option value="admin">Administrator</option>
                    <option value="school_coordinator">School Coordinator</option>
                    <option value="mentor">Mentor</option>
                    <option value="unassigned">Unassigned (No access)</option>
                  </select>
                  {loadingId === profile.id && <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>Saving...</span>}
                </div>
              </td>
            </tr>
          ))}
          
          {profiles.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                No user profiles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
