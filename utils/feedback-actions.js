"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Submit student feedback for a session
 */
export async function submitStudentFeedback(sessionId, ratings, comments) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('feedback')
    .insert([{
      session_id: sessionId,
      respondent_type: 'student',
      rating_saying_no: ratings.saying_no,
      rating_boundaries: ratings.boundaries,
      rating_confidential_sharing: ratings.confidential_sharing,
      rating_suicide_awareness: ratings.suicide,
      rating_social_media: ratings.social_media,
      rating_substance_abuse: ratings.substance,
      comments: comments,
      is_anonymous: true
    }]);

  if (error) throw error;
  
  revalidatePath('/admin');
  return { success: true };
}

/**
 * Get aggregated scores for the Six Pillars across all sessions
 */
export async function getGlobalFeedbackStats() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('feedback')
    .select(`
      rating_saying_no,
      rating_boundaries,
      rating_confidential_sharing,
      rating_suicide_awareness,
      rating_social_media,
      rating_substance_abuse
    `);

  if (error) throw error;

  if (data.length === 0) return null;

  const count = data.length;
  const sums = data.reduce((acc, curr) => ({
    saying_no: acc.saying_no + (curr.rating_saying_no || 0),
    boundaries: acc.boundaries + (curr.rating_boundaries || 0),
    confidential: acc.confidential + (curr.rating_confidential_sharing || 0),
    suicide: acc.suicide + (curr.rating_suicide_awareness || 0),
    social: acc.social + (curr.rating_social_media || 0),
    substance: acc.substance + (curr.rating_substance_abuse || 0),
  }), { saying_no: 0, boundaries: 0, confidential: 0, suicide: 0, social: 0, substance: 0 });

  return {
    saying_no: (sums.saying_no / count).toFixed(1),
    boundaries: (sums.boundaries / count).toFixed(1),
    confidential: (sums.confidential / count).toFixed(1),
    suicide: (sums.suicide / count).toFixed(1),
    social: (sums.social / count).toFixed(1),
    substance: (sums.substance / count).toFixed(1),
    totalResponses: count
  };
}

/**
 * Get recent anonymous student comments
 */
export async function getRecentComments(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feedback')
    .select('comments, created_at, session_id')
    .not('comments', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
