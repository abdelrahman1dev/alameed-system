import { app, dialog } from "electron";
import fs from "fs/promises";
import path from "path";

export async function createBackup() {
  const dbPath = path.join(app.getAppPath(), "database", "store.db");

  const { filePath } = await dialog.showSaveDialog({
    defaultPath: `Alameed-Backup-${new Date().toISOString().split("T")[0]}.db`,
    filters: [
      {
        name: "SQLite Database",
        extensions: ["db"],
      },
    ],
  });

  if (!filePath) return;

  await fs.copyFile(dbPath, filePath);

  return {
    success: true,
    path: filePath,
  };
}

function getDatabasePath() {
  return path.join(app.getAppPath(), "database", "store.db");
}

export async function restoreBackup() {
  try {
    const result = await dialog.showOpenDialog({
      title: "Restore Database",
      properties: ["openFile"],
      filters: [
        {
          name: "SQLite Database",
          extensions: ["db"],
        },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return {
        success: false,
        message: "Restore cancelled.",
      };
    }

    const backupPath = result.filePaths[0];
    const databasePath = getDatabasePath();

    // Validate backup
    const stat = await fs.stat(backupPath);

    if (!stat.isFile() || stat.size === 0) {
      throw new Error("Selected file is not a valid database.");
    }

    // Backup current database before replacing it
    const backupCurrent = `${databasePath}.bak`;

    await fs.copyFile(databasePath, backupCurrent);

    // Replace database
    await fs.copyFile(backupPath, databasePath);

    // Restart application
    app.relaunch();
    app.exit(0);

    return {
      success: true,
      message: "Database restored successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to restore database.",
    };
  }
}