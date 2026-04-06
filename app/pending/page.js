"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { clearDevRole } from '@/utils/auth';

export default function PendingPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    clearDevRole();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
        padding: '48px 36px',
        borderRadius: '20px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeInUp 0.5s ease-out',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 800,
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Account Pending Review
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Your Google login was successful. An administrator needs to assign your role before you can access the platform.
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '2rem' }}>
          Contact the admin team at <strong style={{ color: 'var(--primary-400)' }}>krishnaveni_a@jkkn.ac.in</strong> to request access.
        </p>
        <button
          onClick={handleSignOut}
          style={{
            padding: '10px 24px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
