import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/roles';
import { redirect } from 'next/navigation';
import styles from './roles.module.css';
import RoleTable from './RoleTable';

export default async function AdminRolesPage() {
  // 1. Verify Authentication & Authorization
  const role = await getUserRole();
  
  if (!role) {
    redirect('/login');
  }
  
  if (role !== 'admin') {
    // Non-admins should not see this page
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title} style={{ color: '#ef4444' }}>Access Denied</h1>
          <p className={styles.subtitle}>You must be an Administrator to view and manage roles.</p>
        </div>
      </div>
    );
  }

  // 2. Fetch all profiles
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Role Management</h1>
        <p className={styles.subtitle}>Assign permissions and access levels to Project Shield users.</p>
      </div>

      {error ? (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>
          Failed to load profiles. Ensure database migrations are applied.
        </div>
      ) : (
        <RoleTable initialProfiles={profiles || []} />
      )}
    </div>
  );
}
