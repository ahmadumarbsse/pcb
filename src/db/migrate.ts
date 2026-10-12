import fs from "fs";
import path from "path";
import { getDb } from "./index";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  console.log("Starting database schema migration...");
  const db = getDb();

  const migrationsDir = path.resolve(process.cwd(), "src/db/migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.error("Migrations directory not found:", migrationsDir);
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Executing migration file: ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");

    const statements = rawContent
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        await db.execute(sql.raw(stmt));
      } catch (err: any) {
        const errorMsg = (err.message || "") + " " + (err.cause?.message || "");
        const errorCode = err.code || err.cause?.code;

        if (
          errorMsg.includes("already exists") ||
          errorCode === "42P07" ||
          errorCode === "42710"
        ) {
          // Relation or constraint already exists - safe on idempotent rerun
          continue;
        }
        console.error(`Error executing SQL statement:\n${stmt.substring(0, 100)}...`, err.message);
        throw err;
      }
    }

    console.log(`✓ Migration ${file} applied successfully.`);
  }

  console.log("✓ All migrations completed successfully.");
}

if (require.main === module || process.argv[1]?.includes("migrate")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
