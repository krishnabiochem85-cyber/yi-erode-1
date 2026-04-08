"use server";

import { createClient } from "./supabase/server";

/**
 * Fetch top-level dashboard statistics
 */
export async function getAdminDashboardStats() {
  const supabase = await createClient();

  const [
    { count: schoolsCount },
    { count: modulesCount },
    { count: mentorsCount },
    { count: responsesCount }
  ] = await Promise.all([
    supabase.from('schools').select('*', { count: 'exact', head: true }),
    supabase.from('module_assignments').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mentor'),
    supabase.from('feedback').select('*', { count: 'exact', head: true })
  ]);

  return {
    schools: schoolsCount || 0,
    modules: modulesCount || 0,
    mentors: mentorsCount || 0,
    responses: responsesCount || 0
  };
}

/**
 * Fetch the distribution of schools across the 3x3 assessment matrix
 */
export async function getModuleMatrixDistribution() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('assessments')
    .select('module_code');

  if (error) return {};

  const distribution = {};
  data.forEach(item => {
    if (item.module_code) {
      distribution[item.module_code] = (distribution[item.module_code] || 0) + 1;
    }
  });

  return distribution;
}
