import { getServerRole } from '@/utils/auth-server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

// Admin email — gets auto-assigned admin role
const ADMIN_EMAIL = 'krishnaveni_a@jkkn.ac.in';

export default async function RootPage({ searchParams }) {
  const params = await searchParams;
  const code = params?.code;

  // If OAuth returns a ?code= to the root, exchange it for a session first
  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error.message);
        redirect('/login');
      }
    } catch (e) {
      console.error('Failed to exchange code:', e);
      redirect('/login');
    }
  }

  const { role, user } = await getServerRole();

  if (!role && !user) {
    redirect('/login');
  }

  // If user is logged in via Google but has no role yet, redirect based on email
  if (user && !role) {
    if (user.email === ADMIN_EMAIL) {
      redirect('/admin');
    }
    // New users go to a waiting page
    redirect('/pending');
  }

  if (role === 'admin') {
    redirect('/admin');
  }

  if (role === 'mentor') {
    redirect('/mentor-dashboard');
  }

  if (role === 'school_coordinator') {
    redirect('/school-dashboard');
  }

  // Handle unassigned role
  if (role === 'unassigned') {
    redirect('/pending');
  }

  // Fallback for unassigned
  redirect('/pending');
}
