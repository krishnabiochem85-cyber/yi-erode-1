"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Fetch all mentors with their assigned schools summary
 */
export async function getAllMentorsWithAllocations() {
  const supabase = await createClient();
  
  // 1. Get all mentors
  const { data: mentors, error: mentorError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('role', 'mentor');

  if (mentorError) throw mentorError;

  // 2. Get their allocations (via sessions)
  const { data: allocations, error: allocError } = await supabase
    .from('session_mentors')
    .select(`
      mentor_id,
      sessions (
        id,
        schools (
          id,
          name
        )
      )
    `);

  if (allocError) throw allocError;

  // Map allocations to mentors
  return mentors.map(mentor => {
    const mentorAllocations = allocations
      .filter(a => a.mentor_id === mentor.id)
      .map(a => ({
        sessionId: a.sessions?.id,
        schoolId: a.sessions?.schools?.id,
        schoolName: a.sessions?.schools?.name
      }));

    return {
      ...mentor,
      allocations: mentorAllocations
    };
  });
}

/**
 * Assign a mentor to a school's session
 */
export async function assignMentorToSchool(mentorId, schoolId) {
  const supabase = await createClient();
  
  // Find a planned session for this school that doesn't have this mentor
  // If no session exists, we might need to create one, but usually sessions are created by coordinators
  // For this "allocation" requirement, we'll ensure we link to the school's active sessions
  
  const { data: activeSessions, error: sessionError } = await supabase
    .from('sessions')
    .select('id')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (sessionError) throw sessionError;
  
  const sessionId = activeSessions?.[0]?.id;
  if (!sessionId) {
    return { success: false, error: "This school has no scheduled sessions to assign a mentor to." };
  }

  const { error } = await supabase
    .from('session_mentors')
    .insert([{
      session_id: sessionId,
      mentor_id: mentorId
    }]);

  if (error) {
    if (error.code === '23505') return { success: false, error: "Mentor is already assigned to this school." };
    throw error;
  }

  revalidatePath('/admin/mentors');
  return { success: true };
}

/**
 * Remove mentor allocation from a school
 */
export async function removeMentorFromSchool(mentorId, schoolId) {
  const supabase = await createClient();

  // Find the session link
  const { data: sessions, error: findError } = await supabase
    .from('sessions')
    .select('id')
    .eq('school_id', schoolId);

  if (findError) throw findError;
  const sessionIds = sessions.map(s => s.id);

  const { error } = await supabase
    .from('session_mentors')
    .delete()
    .eq('mentor_id', mentorId)
    .in('session_id', sessionIds);

  if (error) throw error;

  revalidatePath('/admin/mentors');
  return { success: true };
}
