/**
 * Server-side auth utility.
 * Checks Supabase auth first, then falls back to dev cookie.
 */
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'krishnaveni_a@jkkn.ac.in';

export async function getServerRole() {
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
        .select('role, school_id')
        .eq('id', user.id)
        .single();

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

      // No profile yet — auto-assign admin for the designated email
      if (user.email === ADMIN_EMAIL) {
        // Try to upsert profile with admin role
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || 'Admin',
          avatar_url: user.user_metadata?.avatar_url,
          role: 'admin',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

        return { 
          role: 'admin', 
          school_id: null,
          user: { email: user.email, name: user.user_metadata?.full_name, id: user.id, avatar: user.user_metadata?.avatar_url } 
        };
      }

      // User exists but no profile — create one with 'unassigned'
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url,
        role: 'unassigned',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      return { 
        role: 'unassigned', 
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
    // Supabase not available — fall through to dev mode
  }

  // 2. Fallback: Check dev cookie
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
