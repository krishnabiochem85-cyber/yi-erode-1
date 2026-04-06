const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const tables = [
  "assessment_results",
  "schedule_requests",
  "mentors",
  "sessions",
];

async function backupDB() {
  console.log("Starting backup...");
  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      continue;
    }

    if (data && data.length > 0) {
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) =>
        Object.values(row)
          .map((value) => {
            if (value === null || value === undefined) return "";
            if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            let str = String(value);
            if (str.includes(",") || str.includes("\\n") || str.includes('"')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      );
      const csv = [headers, ...rows].join("\\n");
      const filename = path.join(backupDir, `${table}_${timestamp}.csv`);
      fs.writeFileSync(filename, csv);
      console.log(`Backed up ${table} to ${filename} (${data.length} rows)`);
    } else {
      console.log(`No data in ${table} to backup.`);
    }
  }
  console.log("Backup complete.");
}

backupDB();
