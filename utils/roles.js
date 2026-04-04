import { createClient } from '@/utils/supabase/server';

/**
 * Fetches the role of the currently authenticated user.
 * @returns {Promise<string|null>} 'admin', 'school_coordinator', 'mentor', 'unassigned', or null if not logged in.
 */
export async function getUserRole() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError);
    return 'unassigned';
  }

  return profile.role;
}
