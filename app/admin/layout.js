import Sidebar from "@/components/Sidebar";
import { getUserRole } from '@/utils/roles';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const role = await getUserRole();
  
  if (!role) {
    redirect('/login');
  }
  
  // Only Admins get the Ultimate Control Layout
  if (role !== 'admin') {
    redirect('/'); 
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
