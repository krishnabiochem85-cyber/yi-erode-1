"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function checkProfileCompletion() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { requireCompletion: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return { requireCompletion: false };

  // Logic to determine if fields are missing based on role
  let requireCompletion = false;
  let missingFields = [];

  if (profile.role === 'mentor') {
    if (!profile.course || !profile.college || !profile.phone || !profile.pseudo_name) {
      requireCompletion = true;
    }
  } else if (profile.role === 'student') {
    if (!profile.academic_class) {
      requireCompletion = true;
    }
  } else if (profile.role === 'school_coordinator') {
    if (!profile.phone) {
      requireCompletion = true;
    }
  }

  return { requireCompletion, profile };
}

export async function updateProfileDetails(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Not logged in" };

  const updatePayload = { updated_at: new Date().toISOString() };
  
  // Extract all potential fields
  const fields = ['phone', 'course', 'college', 'pseudo_name', 'academic_class'];
  fields.forEach(f => {
    if (formData.get(f)) {
      updatePayload[f] = formData.get(f);
    }
  });

  const { error } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id);

  if (error) {
    console.error("Error updating profile:", error.message);
    return { success: false, error: error.message };
  }

  // Revalidate everything
  revalidatePath('/', 'layout');
  return { success: true };
}
