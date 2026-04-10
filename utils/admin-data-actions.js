"use server";

import { createClient } from "./supabase/server";

// 1. Fetch School Coordinators + Schools
export async function getSchoolCoordinatorsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      school_id,
      schools:school_id (name, district, status)
    `)
    .eq('role', 'school_coordinator');
    
  if (error) {
    console.error("Error fetching school coordinators:", error);
    return [];
  }
  return data;
}

// 2. Fetch Mentors Data
export async function getMentorsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      course,
      college,
      pseudo_name,
      mentor_availability (date, type),
      session_mentors (
        sessions (id, session_date, schools(name))
      )
    `)
    .eq('role', 'mentor');
    
  if (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
  return data;
}

// 3. Fetch Learners Data
export async function getLearnersList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      academic_class,
      school_id,
      schools:school_id (name),
      assigned_mentor_id,
      mentor:assigned_mentor_id (pseudo_name, full_name)
    `)
    .eq('role', 'student');
    
  if (error) {
    console.error("Error fetching learners:", error);
    return [];
  }
  return data;
}
