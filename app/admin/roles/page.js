import { getServerRole } from '@/utils/auth-server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import RoleTable from './RoleTable';

export default async function AdminRolesPage() {
  const { role } = await getServerRole();
  
  if (!role) {
    redirect('/login');
  }
  
  if (role !== 'admin') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ color: '#ef4444', fontSize: '24px', fontWeight: 700 }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)' }}>You must be an Administrator to manage roles.</p>
      </div>
    );
  }

  // Fetch all profiles from Supabase
  let profiles = [];
  let errorMsg = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      errorMsg = error.message;
    } else {
      profiles = data || [];
    }
  } catch (e) {
    errorMsg = 'Could not connect to database. Ensure Supabase is configured.';
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '28px', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <h1 className="page-title" style={{
            background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            🔐 Role Management
          </h1>
          <p className="page-subtitle">
            Assign permissions and access levels to users who sign in with Google
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'rgba(99, 102, 241, 0.06)',
        border: '1px solid rgba(99, 102, 241, 0.12)',
        marginBottom: '24px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--primary-400)' }}>How it works:</strong> When a user signs in with Google, they appear here as &quot;Unassigned&quot;. 
        Use the dropdown to assign them as <strong style={{ color: '#ef4444' }}>Admin</strong>, <strong style={{ color: '#10b981' }}>Mentor</strong>, or <strong style={{ color: '#f59e0b' }}>School Coordinator</strong>. 
        Changes take effect on their next page load.
      </div>

      {errorMsg ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#f59e0b', marginBottom: '8px' }}>Database Connection Issue</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
            {errorMsg}
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
            Make sure the <code style={{ color: 'var(--primary-400)' }}>profiles</code> table exists in your Supabase database.
          </p>
        </div>
      ) : (
        <RoleTable initialProfiles={profiles} />
      )}
    </div>
  );
}
