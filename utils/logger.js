"use server";

import { createClient } from "./supabase/server";

export async function logActivity(action, details = '') {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let userId = null;
    let userName = 'System Automator';

    if (user) {
      userId = user.id;
      userName = user.user_metadata?.full_name || 'System User';
      
      // Fallback to fetch real name from profiles
      if (!user.user_metadata?.full_name) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if (profile && profile.full_name) {
          userName = profile.full_name;
        }
      }
    }

    await supabase.from('activity_logs').insert([{
      user_id: userId,
      user_name: userName,
      action,
      details
    }]);
  } catch (err) {
    console.error("Failed to write to activity_logs:", err);
  }
}

export async function getRecentActivities(limit = 15) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch activity logs:", err);
    return [];
  }
}
