/**
 * Server-side auth utility.
 */

const ADMIN_EMAIL = 'krishnaveni_a@jkkn.ac.in';

export async function getServerRole() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  // 1. Check Supabase auth session
  try {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (user && !authError) {
      // User is logged in via Google — check their profile role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, school_id, full_name')
        .eq('id', user.id)
        .single();

      // Priority 1: Use the role from the database if it exists
      if (profile && profile.role) {
        return { 
          role: profile.role, 
          school_id: profile.school_id,
          user: { 
            email: user.email, 
            name: profile.full_name || user.user_metadata?.full_name, 
            id: user.id, 
            avatar: user.user_metadata?.avatar_url 
          } 
        };
      }

      // Priority 2: Auto-assign admin for designated emails if profile is missing or has no role
      if (user.email === ADMIN_EMAIL || user.email === 'krishna.biochem85@gmail.com') {
        const adminProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || 'Admin',
          avatar_url: user.user_metadata?.avatar_url,
          role: 'admin',
          updated_at: new Date().toISOString(),
        };

        await supabase.from('profiles').upsert(adminProfile, { onConflict: 'id' });

        return { 
          role: 'admin', 
          school_id: null,
          user: { email: user.email, name: adminProfile.full_name, id: user.id, avatar: user.id.avatar_url } 
        };
      }

      // Priority 3: User exists but no profile or role found (e.g. new registration)
      return { 
        role: null, 
        school_id: null,
        user: { 
          email: user.email, 
          name: user.user_metadata?.full_name || user.email, 
          id: user.id, 
          avatar: user.user_metadata?.avatar_url 
        } 
      };
    }
  } catch (e) {
    console.error("Supabase server session check failed:", e);
  }

  // 2. Fallback ONLY if no Supabase user is logged in
  const devRole = cookieStore.get('dev_role');
  if (devRole) {
    const devUser = cookieStore.get('dev_user');
    let user = null;
    if (devUser) {
      try {
        user = JSON.parse(decodeURIComponent(devUser.value));
      } catch {}
    }
    return { 
      role: devRole.value, 
      school_id: cookieStore.get('dev_school_id')?.value || null,
      user 
    };
  }

  return { role: null, school_id: null, user: null };
}
