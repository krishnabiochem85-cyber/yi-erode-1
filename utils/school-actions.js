"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Fetch all schools from the database
 */
export async function getSchools() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching schools:', error.message);
    return [];
  }
  return data;
}

/**
 * Register a new school (Admin only)
 */
export async function registerSchool(formData) {
  const supabase = await createClient();
  
  const schoolData = {
    name: formData.get('name'),
    district: formData.get('district'),
    board_type: formData.get('board_type'),
    address: formData.get('address'),
    contact_person: formData.get('contact_person'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    status: 'registered'
  };

  const { data, error } = await supabase
    .from('schools')
    .insert([schoolData])
    .select()
    .single();

  if (error) {
    console.error('Error registering school:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/schools');
  return { success: true, data };
}

/**
 * Assign a coordinator to a school
 */
export async function assignSchoolToProfile(profileId, schoolId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ 
      school_id: schoolId,
      role: 'school_coordinator',
      updated_at: new Date().toISOString()
    })
    .eq('id', profileId);

  if (error) {
    console.error('Error assigning school:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/roles');
  return { success: true };
}

/**
 * Get single school by ID
 */
export async function getSchoolById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching school:', error.message);
    return null;
  }
  return data;
}

/**
 * Fetch sessions for a specific school
 */
export async function getSchoolSessions(schoolId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      session_mentors (
        profiles ( full_name )
      )
    `)
    .eq('school_id', schoolId)
    .order('session_date', { ascending: true });

  if (error) {
    console.error('Error fetching sessions:', error.message);
    return [];
  }
  return data;
}
