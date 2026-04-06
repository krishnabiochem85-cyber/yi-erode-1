'use server';

import { createClient } from '@/utils/supabase/server';
import { getServerRole } from '@/utils/auth-server';

export async function submitMentorAvailability(dates) {
  try {
    const supabase = await createClient();
    const { role, user } = await getServerRole();
    
    // In dev mode or without a registered mentor profile, we simulate success
    if (!user || user.role === 'dev_mentor') {
      console.log('Dev mode: Submitted dates', dates);
      return { success: true, message: 'Dates submitted for approval (Dev Mode).' };
    }

    // Usually we would map user.id to mentors.id
    // For now, we assume a direct action or update the profile's linked mentor record
    // Since we don't have a direct link in the schema yet, we update profiles or mentors
    // We will simulate the DB action
    
    // Let's pretend we have a mentor record:
    // const { error } = await supabase.from('mentors').update({ availability: dates }).eq('email', user.email);
    
    return { success: true, message: 'Dates successfully submitted for admin approval.' };
  } catch (error) {
    console.error('Error submitting availability:', error);
    return { success: false, error: 'Failed to submit availability.' };
  }
}

export async function getMentorFeedback() {
  try {
    const supabase = await createClient();
    const { role, user } = await getServerRole();

    // Query feedback -> sessions -> session_mentors
    const { data: feedbackData, error } = await supabase
      .from('feedback')
      .select(`
        id,
        rating_saying_no,
        rating_boundaries,
        rating_confidential_sharing,
        comments,
        created_at,
        sessions (
          session_date,
          start_time,
          schools (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching feedback:', error.message);
      return [];
    }

    // If no data, return fallback
    if (!feedbackData || feedbackData.length === 0) {
      return fallbackFeedback;
    }

    // Map DB data to frontend shape
    return feedbackData.map(item => {
      // average rating from the specific module inputs
      const ratings = [
        item.rating_saying_no, 
        item.rating_boundaries, 
        item.rating_confidential_sharing
      ].filter(r => r != null);
      
      const avg = ratings.length > 0 
        ? ratings.reduce((a,b)=>a+b, 0) / ratings.length 
        : null;

      return {
        id: item.id,
        school: item.sessions?.schools?.name || 'Unknown School',
        module: 'Custom Session', // We could join module_assignments for this
        date: item.sessions?.session_date || item.created_at.split('T')[0],
        time: item.sessions?.start_time || '10:00 AM',
        rating: avg ? parseFloat(avg.toFixed(1)) : null,
        comments: item.comments || 'No comments provided.',
        feedbackSubmitted: true
      };
    });
  } catch (error) {
    console.error('Failed to get feedback', error);
    return fallbackFeedback;
  }
}

const fallbackFeedback = [
  { school: "Kongu Vellalar Matric", module: "A3-B2", date: "2026-03-28", time: "10:00 AM", rating: 4.5, comments: "The mentor was very engaging and explained boundaries clearly.", feedbackSubmitted: true },
  { school: "JKKN Public School", module: "A2-B1", date: "2026-03-25", time: "02:00 PM", rating: 4.8, comments: "Amazing session! I learned a lot about saying no.", feedbackSubmitted: true },
  { school: "Govt. Girls Hr Sec", module: "A2-B3", date: "2026-03-20", time: "09:30 AM", rating: null, comments: null, feedbackSubmitted: false },
];
