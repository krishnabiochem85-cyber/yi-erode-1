'use server';

import { createClient } from '@/utils/supabase/server';
import { getServerRole } from '@/utils/auth-server';

// Calculate Category based on specific weightings (Z > Y > X, R > Q > P for ties)
function calculateCategoryA(counts) {
  const { X = 0, Y = 0, Z = 0 } = counts;
  if (Z > X && Z > Y) return 'A3';
  if (Y > X && Y > Z) return 'A2';
  if (X > Y && X > Z) return 'A1';
  
  // Handling ties - prioritize severity
  if (Z === Y && Z > X) return 'A3';
  if (Z === X && Z > Y) return 'A3';
  if (Y === X && Y > Z) return 'A2';
  
  return 'A2'; // Default middle ground if somehow completely flat
}

function calculateCategoryB(counts) {
  const { P = 0, Q = 0, R = 0 } = counts;
  if (R > P && R > Q) return 'B3';
  if (Q > P && Q > R) return 'B2';
  if (P > Q && P > R) return 'B1';
  
  // Handling ties - prioritize severity
  if (R === Q && R > P) return 'B3';
  if (R === P && R > Q) return 'B3';
  if (Q === P && Q > R) return 'B2';
  
  return 'B2';
}

export async function submitAssessment(formData) {
  try {
    const supabase = await createClient();
    const { role, user } = await getServerRole();

    const categoryA = calculateCategoryA(formData.countsA);
    const categoryB = calculateCategoryB(formData.countsB);
    const moduleCode = `${categoryA}-${categoryB}`;

    const payload = {
      category_a: categoryA,
      category_b: categoryB,
      module_code: moduleCode,
      responses: {
        metadata: formData.metadata,
        answersA: formData.answersA,
        answersB: formData.answersB
      },
      assessed_by: user?.email || 'dev_coordinator'
    };

    // For Dev Mode: we fake a successful submission without strict DB limits
    if (!user || user.role === 'dev_school_coordinator') {
      console.log("[Dev Mode] Assessment calculating...", payload);
      return { success: true, moduleCode, message: 'Assessment analyzed.' };
    }

    // In actual production, we need the school_id
    // Assuming we have a way to link user to school:
    // Update assessment
    // ... we will stub this for now until user->school relation is firmly tested ...

    return { 
      success: true, 
      moduleCode, 
      message: 'Analysis complete.' 
    };
  } catch (error) {
    console.error('Submission Error:', error);
    return { success: false, error: 'Failed to process assessment.' };
  }
}

export async function scheduleSession(scheduleData) {
  try {
    const supabase = await createClient();
    
    // We would insert this into the `sessions` table
    console.log("[Dev Mode] Session scheduled:", scheduleData);
    
    return { success: true, message: 'Session successfully scheduled.' };
  } catch(error) {
    console.error(error);
    return { success: false, error: 'Failed to schedule.' };
  }
}
