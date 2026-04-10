"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchAdminNotes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_notes')
    .select(`
      *,
      profiles:author_id (full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching admin notes:", error);
    return [];
  }
  return data;
}

export async function submitAdminNote(formData, parentId = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const content = formData.get('content');
  if (!content) return { success: false, error: "Content is required" };

  const { error } = await supabase
    .from('admin_notes')
    .insert([{
      author_id: user.id,
      content,
      parent_id: parentId
    }]);

  if (error) {
    console.error("Error creating admin note:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin-dashboard/notes');
  return { success: true };
}
