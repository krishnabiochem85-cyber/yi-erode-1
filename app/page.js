import { getUserRole } from '@/utils/roles';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function NormalUserDashboard() {
  const role = await getUserRole();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Not logged in -> Login page
  if (!role || !user) {
    redirect('/login');
  }

  // 2. Admin -> Redirect to ultimate control panel
  if (role === 'admin') {
    redirect('/admin');
  }

  // 3. Unassigned User -> Show waiting page
  if (role === 'unassigned') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#0f0f1a',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3rem',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
            Account Under Review
          </h1>
          <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '2rem' }}>
            Your account has been successfully created with your Google login. However, for security purposes, a Project Shield administrator must manually verify your identity and allocate a specific role before you can access the platform.
          </p>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>
            Account ID: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{user?.email}</code>
          </div>
        </div>
      </div>
    );
  }

  // 4. Mentor / School Coordinator -> Show Normal Portal
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Normal User Simple Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ fontWeight: 'bold', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span>🛡️</span> Project Shield Portal
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#a1a1aa', textTransform: 'capitalize' }}>Role: {role}</span>
          <form action="/auth/signout" method="POST">
             {/* Just redirect out for now instead of complex server actions */}
          </form>
        </div>
      </nav>

      {/* Normal Portal Content */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome to the Portal</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>You are logged in via standard access.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Custom widgets based on role */}
          {role === 'mentor' && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>My Assigned Sessions</h2>
               <p style={{ color: '#71717a' }}>You have no upcoming sessions assigned.</p>
            </div>
          )}

          {role === 'school_coordinator' && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>My School Dashboard</h2>
               <button style={{ background: '#6366f1', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Fill Initial Assessment</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
