"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addMentor(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const expertiseStr = formData.get("expertise");
  const expertise = expertiseStr ? expertiseStr.split(",").map(e => e.trim()) : [];

  const { data, error } = await supabase
    .from("mentors")
    .insert([{ name, email, expertise }])
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/add-mentor");
  return { success: true, mentor: data[0] };
}
