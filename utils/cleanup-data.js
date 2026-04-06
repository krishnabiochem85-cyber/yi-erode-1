// utils/cleanup-data.js
// Server‑side script to remove duplicate rows from Supabase tables.
// Each function deletes rows where the combination of key columns is duplicated,
// keeping the row with the smallest `id` (or earliest timestamp).

require('dotenv').config({ path: '.env.local' });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Delete duplicate rows for a given table based on a set of columns that define uniqueness.
 * @param {string} table - Table name.
 * @param {string[]} uniqueCols - Columns that together should be unique.
 * @returns {Promise<number>} Number of rows deleted.
 */
async function deleteDuplicates(table, uniqueCols) {
  const { data, error } = await supabase.from(table).select('*');
  if (error || !data) {
    if (error && error.code !== '42P01') console.error(`Error fetching ${table}:`, error); // Ignore table not found
    return 0;
  }
  
  const seen = {};
  const idsToDelete = [];
  
  for (const row of data) {
    const key = uniqueCols.map(col => row[col]).join('|');
    if (seen[key]) {
      // It's a duplicate, delete the newer one (assuming higher ID or later row)
      idsToDelete.push(row.id);
    } else {
      seen[key] = row;
    }
  }

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase.from(table).delete().in('id', idsToDelete);
    if (deleteError) {
      console.error(`Error deleting duplicates in ${table}:`, deleteError);
      return 0;
    }
  }
  return idsToDelete.length;
}

async function cleanupAll() {
  const tables = [
    { name: "assessment_results", cols: ["school_id", "assessment_id"] },
    { name: "mentors", cols: ["email"] },
    { name: "sessions", cols: ["title", "scheduled_at"] }
  ];

  const summary = {};
  for (const t of tables) {
    const removed = await deleteDuplicates(t.name, t.cols);
    summary[t.name] = removed;
  }
  return summary;
}

module.exports = { cleanupAll };

// If this file is executed directly (node utils/cleanup-data.js), run the cleanup.
if (require.main === module) {
  cleanupAll().then((summary) => {
    console.log('Cleanup summary:', summary);
  }).catch(err => console.error('Cleanup failed:', err));
}
