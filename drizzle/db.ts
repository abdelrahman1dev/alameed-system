import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { app } from "electron";
import path from "node:path";
import fs from "node:fs";

const userDbDir = path.join(app.getPath("userData"), "database");
const userDbPath = path.join(userDbDir, "store.db");

if (!fs.existsSync(userDbDir)) {
  fs.mkdirSync(userDbDir, { recursive: true });
}

// Copy the bundled database on first launch
if (!fs.existsSync(userDbPath)) {
  const bundledDb = app.isPackaged
    ? path.join(process.resourcesPath, "database", "store.db")
    : path.join(process.cwd(), "database", "store.db");

  fs.copyFileSync(bundledDb, userDbPath);
}

const client = createClient({
  url: `file:${userDbPath}`,
});

export const db = drizzle(client);