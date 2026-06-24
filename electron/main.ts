import { ipcMain, app, BrowserWindow } from "electron";
import {
  getAllProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductsByCat
} from "../services/product.service.ts";
import path from "node:path";
import { createSale } from "../services/sale.service.ts";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
} from "../services/purchase.service.ts";
import { login } from "../services/auth.service.ts";
import { getAllCategories , getCategoryById } from "../services/category.service.ts";

import { fileURLToPath } from "node:url";
import { store } from "./store.ts";

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

// product functions

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

//print function 

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


// create a sale

ipcMain.handle(
  "sales:create",

  async (_, sale, items) => {
    return await createSale(sale, items);
  },
);


// purchase functions
ipcMain.handle(
  "purchases:create",

  async (_, {purchase, items}) => {
    return await createPurchase(purchase, items);
  },
);
ipcMain.handle(
  "purchases:getId",

  async (_, id) => {
    return await getPurchaseById(id);
  },
);
ipcMain.handle(
  "purchases:getAll",

  async () => {
    return await getAllPurchases();
  },
);

// login 

ipcMain.handle(
  "auth:login",

  async (_,username, password ) => {
    const user = await login(
      username,
      password
    );

    if (!user) {
      return null;
    }

    store.set("session", user);

    return user;
  }
);

ipcMain.handle(
  "auth:getSession",

  async () => {
    return (
      store.get("session") ??
      null
    );
  }
);

ipcMain.handle(
  "auth:logout",

  async () => {
    store.delete("session");

    return true;
  }
);

ipcMain.handle(
  "categories:getAll",
  async () => {
    return await getAllCategories()
  }

)
ipcMain.handle(
  "products:getByCategory",
  async (_,id) => {
    return await getProductsByCat(id)
  }

)