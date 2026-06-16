import { ipcMain, app, BrowserWindow } from "electron";
import {
  getAllProducts,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../services/product.service.ts";
import path from "node:path";
import {
  createSale,
} from "../services/sale.service.ts"

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);

ipcMain.handle("products:getAll", async () => {
  console.log("IPC CALLED");
  return await getAllProducts();
});

ipcMain.handle(
  "products:create",

  async (_, data) => {
    return await createProduct(data);
  },
);
ipcMain.handle(
  "products:update",

  async (_, id, data) => {
    return await updateProduct(id, data);
  },
);
ipcMain.handle(
  "products:delete",

  async (_, id) => {
    return await deleteProduct(id);
  },
);

ipcMain.handle("invoice:print", async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  if (!win) return false;

  return new Promise((resolve) => {
    win.webContents.print(
      {
        silent: false,
        printBackground: true,
      },

      (success, errorType) => {
        if (!success) {
          console.error(errorType);

          resolve(false);

          return;
        }

        resolve(true);
      },
    );
  });
});

ipcMain.handle(
  "sales:create",

  async (_, sale, items) => {

    return await createSale(
      sale,
      items
    );

  }
);