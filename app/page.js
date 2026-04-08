import { getServerRole } from '@/utils/auth-server';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

// Admin email — gets auto-assigned admin role
const ADMIN_EMAIL = 'krishnaveni_a@jkkn.ac.in';

export default async function RootPage({ searchParams }) {
  const params = await searchParams;
  const code = params?.code;

  // If OAuth incorrectly returns a ?code= to the root, bounce it to the callback route
  // because Server Components cannot set cookies, but Route Handlers can.
  if (code) {
    redirect(`/auth/callback?code=${code}`);
  }

  const { role, user } = await getServerRole();

  if (!role && !user) {
    redirect('/login');
  }

  // If user is logged in via Google but has no role yet, redirect based on email
  if (user && !role) {
    if (user.email === ADMIN_EMAIL || user.email === 'krishna.biochem85@gmail.com') {
      redirect('/admin-dashboard');
    }
    // New users go to a waiting page
    redirect('/pending');
  }

  if (role === 'admin') {
    redirect('/admin-dashboard');
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
