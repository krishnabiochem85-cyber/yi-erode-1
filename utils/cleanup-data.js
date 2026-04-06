// utils/cleanup-data.js
// Server‑side script to remove duplicate rows from Supabase tables.
// Each function deletes rows where the combination of key columns is duplicated,
// keeping the row with the smallest `id` (or earliest timestamp).

require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Delete duplicate rows for a given table based on a set of columns that define uniqueness.
 * @param {string} table - Table name.
 * @param {string[]} uniqueCols - Columns that together should be unique.
 * @returns {Promise<number>} Number of rows deleted.
 */
async function deleteDuplicates(table, uniqueCols) {
  const cols = uniqueCols.join(', ');
  const { data, error } = await supabase.rpc('delete_duplicates', {
    table_name: table,
    unique_columns: cols,
  });
  if (error) {
    console.error(`Error cleaning ${table}:`, error);
    return 0;
  }
  return data?.deleted || 0;
}

export async function cleanupAll() {
  const tables = [
    { name: "assessment_results", cols: ["school_id", "assessment_id"] },
    { name: "schedule_requests", cols: ["school_id", "requested_at"] },
    { name: "mentor_availability", cols: ["mentor_id", "date"] },
    { name: "sessions", cols: ["title", "scheduled_at"] },
    { name: "mentors", cols: ["email"] },
  ];

  const summary = {};
  for (const t of tables) {
    const removed = await deleteDuplicates(t.name, t.cols);
    summary[t.name] = removed;
  }
  return summary;
}

export { cleanupAll };

// If this file is executed directly (node utils/cleanup-data.js), run the cleanup.
if (require.main === module) {
  cleanupAll().then((summary) => {
    console.log('Cleanup summary:', summary);
  }).catch(err => console.error('Cleanup failed:', err));
}
