import { execSync } from "child_process";
import { existsSync, unlinkSync } from "fs";

const TEST_DB_FILES = ["./test.db", "./test.db-wal", "./test.db-shm"];

export async function setup() {
  // Nettoyage d'un eventuel test.db residuel
  for (const f of TEST_DB_FILES) {
    if (existsSync(f)) unlinkSync(f);
  }

  // Creation du schema dans la DB de test
  execSync("npx drizzle-kit push", {
    env: { ...process.env, DB_FILE: "file:./test.db" },
    stdio: "pipe",
  });
}

export async function teardown() {
  for (const f of TEST_DB_FILES) {
    if (existsSync(f)) unlinkSync(f);
  }
}
