import Sidebar from "@/components/Sidebar";
import { getServerRole } from '@/utils/auth-server';
import { redirect } from 'next/navigation';

export default async function MentorDashboardLayout({ children }) {
  const { role } = await getServerRole();
  
  if (!role) {
    redirect('/login');
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
