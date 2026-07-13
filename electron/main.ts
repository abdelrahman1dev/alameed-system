import { ipcMain, app, BrowserWindow } from "electron";
import {
  getAllProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductsByCat,
  exportProducts
} from "../services/product.service";
import path from "node:path";
import { createSale } from "../services/sale.service";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
} from "../services/purchase.service";
import { login } from "../services/auth.service";
import { createCategory, deleteCategory, getAllCategories } from "../services/category.service";
import { getDashboardStats } from "../services/dashboard.service";

import { store } from "./store";
import http from "node:http";
import { Menu } from "electron";
import handler from "serve-handler";

import { getReportsDashboard } from "../services/reports.service";
import { getInventoryMovements } from "../services/reports/movments";
import { getInventoryReport } from "../services/reports/inventory";
import { getSalesHistory } from "../services/reports/sales";
import { getPurchaseHistory } from "../services/reports/purchase";
import { createBackup ,restoreBackup } from "../services/backup.service";

let server: http.Server;



type Session = {
  id: number;
  username: string;
  role: string;
};

function requireSession() {
  const session = store.get("session") as Session | null;

  if (!session) {
    throw new Error("User is not logged in");
  }

  return session;
}

function requireRole(roles: string[]) {
  const session = requireSession();

  if (!roles.includes(session.role)) {
    throw new Error("You do not have permission to perform this action");
  }

  return session;
}

function createWindow(url: string) {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, "../../assets/icon.ico"),
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadURL(url);
  win.setMenuBarVisibility(true);
}


const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      { role: "quit" }
    ]
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" }
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { role: "togglefullscreen" }
    ]
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "close" }
    ]
  },
  {
    label: "Help",
    submenu: []
  }
]);

Menu.setApplicationMenu(menu);




app.whenReady().then(() => {
  if (app.isPackaged) {
    const publicDir = path.join(process.resourcesPath, "frontend");

    server = http.createServer((req, res) =>
      handler(req, res, {
        public: publicDir,
        cleanUrls: true,
        rewrites: [
          {
            source: "**",
            destination: "/index.html",
          },
        ],
      })
    );

    server.listen(3131, () => {
      createWindow("http://127.0.0.1:3131");
    });
  } else {
    createWindow("http://localhost:3000");
  }
});

app.on("window-all-closed", () => {
  server?.close();

  if (process.platform !== "darwin") {
    app.quit();
  }
});



// product functions

ipcMain.handle("products:getAll", async () => {
  return await getAllProducts();
});

ipcMain.handle(
  "products:create",

  async (_, data) => {
    requireRole(["admin", "manager"]);
    return await createProduct(data);
  },
);
ipcMain.handle(
  "products:update",

  async (_, id, data) => {
    requireRole(["admin", "manager"]);
    return await updateProduct(id, data);
  },
);
ipcMain.handle(
  "products:delete",

  async (_, id) => {
    requireRole(["admin"]);
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

ipcMain.handle("sales:create", async (_, sale, items) => {
  const session = requireSession();

  return await createSale(
    {
      ...sale,
      createdBy: session.id,
    },
    items,
  );
});


// purchase functions
ipcMain.handle(
  "purchases:create",

  async (_, purchase, items) => {
    const session = requireRole(["admin", "manager"]);

    return await createPurchase({ ...purchase, createdBy: session.id }, items);
  }
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

  async (_, username, password) => {
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
ipcMain.handle("categories:create", async (_, data) => {
  requireRole(["admin", "manager"]);

  return await createCategory(data);
});

ipcMain.handle("categories:delete", async (_, id) => {
  requireRole(["admin"]);

  return await deleteCategory(id);
});

ipcMain.handle(
  "products:getByCategory",
  async (_, id) => {
    return await getProductsByCat(id)
  }

)

ipcMain.handle("dashboard:getStats", async () => {
  requireSession();

  return await getDashboardStats();
});


ipcMain.handle(
  "reports:getDashboard",
  async (_, filters) => {
    return await getReportsDashboard(filters);
  },
);

ipcMain.handle(
  "reports:getInventory",
  async () => {
    return await getInventoryReport();
  },
);

ipcMain.handle(
  "reports:getMovements",
  async () => {
    return await getInventoryMovements();
  },
);

ipcMain.handle(
  "reports:getSalesHistory",
  async () => {
    return await getSalesHistory();
  },
);

ipcMain.handle(
  "reports:getPurchaseHistory",
  async () => {
    return await getPurchaseHistory();
  },
);

ipcMain.handle(
  "products:export",
  exportProducts,
);
ipcMain.handle("backup:create", createBackup);
ipcMain.handle("backup:restore", restoreBackup);