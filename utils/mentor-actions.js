"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { getServerRole } from "./auth-server";
import { logActivity } from "./logger";

/**
 * Fetch mentor availability
 */
export async function getMentorAvailability(profileId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('profile_id', profileId);
  
  if (error) {
    console.error('Error fetching availability:', error.message);
    return [];
  }
  return data;
}

/**
 * Update mentor availability (block/unblock dates)
 */
export async function updateMentorAvailability(profileId, date, type, reason = '') {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('mentor_availability')
    .upsert([{ 
      profile_id: profileId, 
      date, 
      type, 
      reason,
      updated_at: new Date().toISOString()
    }], { onConflict: 'profile_id, date' });

  if (error) {
    console.error('Error updating availability:', error.message);
    return { success: false, error: error.message };
  }
  
  if (type === 'blocked') {
    await logActivity('Blocked Calendar Date', `Date ${date} frozen. Reason: ${reason || 'Not provided'}`);
  } else {
    await logActivity('Freed Calendar Date', `Date ${date} marked as available again.`);
  }
  
  revalidatePath('/mentor-dashboard');
  return { success: true };
}

/**
 * Fetch schools assigned to this mentor
 */
export async function getAssignedSchools(profileId) {
  const supabase = await createClient();
  
  // Link: profiles -> session_mentors -> sessions -> schools
  const { data, error } = await supabase
    .from('session_mentors')
    .select(`
      session_id,
      sessions (
        id,
        session_date,
        session_type,
        schools (
          id,
          name,
          district,
          status
        )
      )
    `)
    .eq('mentor_id', profileId);

  if (error) {
    console.error('Error fetching schools:', error.message);
    return [];
  }

  // Deduplicate and format
  const schools = {};
  data.forEach(item => {
    const school = item.sessions?.schools;
    if (school && !schools[school.id]) {
      schools[school.id] = {
        ...school,
        next_session: item.sessions.session_date,
        type: item.sessions.session_type
      };
    }
  });

  return Object.values(schools);
}

/**
 * Fetch mentor interactions (anonymous messages)
 */
export async function getMentorInteractions(mentorId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('anonymous_interactions')
    .select(`
      *,
      schools ( name )
    `)
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching interactions:', error.message);
    return [];
  }
  return data;
}

/**
 * Submit an anonymous interaction (Student side)
 */
export async function submitInteraction(mentorId, schoolId, message) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('anonymous_interactions')
    .insert([{
      mentor_id: mentorId,
      school_id: schoolId,
      message,
      sender_type: 'student'
    }]);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Fetch feedback analytics for a specific mentor
 */
export async function getMentorFeedbackStats(mentorId) {
  const supabase = await createClient();
  
  // Get all session IDs for this mentor
  const { data: sessionLinks, error: linkError } = await supabase
    .from('session_mentors')
    .select('session_id')
    .eq('mentor_id', mentorId);

  if (linkError || !sessionLinks) return [];
  const sessionIds = sessionLinks.map(l => l.session_id);

  // Get feedback for those sessions
  const { data: feedback, error: feedError } = await supabase
    .from('feedback')
    .select(`
      *,
      sessions (
        session_date,
        schools ( name )
      )
    `)
    .in('session_id', sessionIds)
    .order('created_at', { ascending: false });

  if (feedError) return [];

  return feedback.map(f => ({
    id: f.id,
    school: f.sessions?.schools?.name,
    date: f.sessions?.session_date,
    comments: f.comments,
    // Average rating across pillars for the summary card
    rating: Math.round((
      (f.rating_saying_no || 5) + 
      (f.rating_boundaries || 5) + 
      (f.rating_confidential_sharing || 5) + 
      (f.rating_suicide_awareness || 5) + 
      (f.rating_social_media || 5) + 
      (f.rating_substance_abuse || 5)
    ) / 6)
  }));
}

/**
 * Create a new session (Mentor or Admin)
 */
export async function createSession(formData) {
  const supabase = await createClient();
  const auth = await getServerRole();

  if (!auth.user) return { error: "Unauthorized" };

  const sessionData = {
    title: formData.get('title'),
    description: formData.get('description'),
    session_date: formData.get('scheduled_at'),
    created_by: auth.user.id,
    session_type: 'awareness' // Default
  };

  const { data, error } = await supabase
    .from('sessions')
    .insert([sessionData])
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error.message);
    return { error: error.message };
  }

  revalidatePath('/mentor-dashboard');
  revalidatePath('/admin-dashboard');
  return { success: true, data };
}
