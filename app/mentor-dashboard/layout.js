import { getServerRole } from '@/utils/auth-server';
import { redirect } from 'next/navigation';

export default async function MentorDashboardLayout({ children }) {
  const { role } = await getServerRole();
  
  if (!role) {
    redirect('/login');
  }

  return (
    <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {children}
    </main>
  );
}
