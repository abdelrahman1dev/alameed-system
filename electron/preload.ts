const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  products: {
    getAll: () => ipcRenderer.invoke("products:getAll"),

    create: (data: Record<string, unknown>) => ipcRenderer.invoke("products:create", data),
    update: (id: string | number, data: Record<string, unknown>) => ipcRenderer.invoke("products:update", id, data),
    delete: (id: string | number) => ipcRenderer.invoke("products:delete", id),
    getByCategory: (id: string | number) => ipcRenderer.invoke("products:getByCategory", id),
    export: () => ipcRenderer.invoke("products:export"),
  },
  purchases: {
    getAll: () => ipcRenderer.invoke("purchases:getAll"),
    getById: (id: string | number) => ipcRenderer.invoke("purchases:getId", id),
    create: (purchase: Record<string, unknown>, items: Array<Record<string, unknown>>) =>
      ipcRenderer.invoke("purchases:create", purchase, items),
  },
  auth: {
    login: (username: string, password: string) => ipcRenderer.invoke("auth:login", username, password),

    getSession: () => ipcRenderer.invoke("auth:getSession"),

    logout: () => ipcRenderer.invoke("auth:logout"),
  },
  sales: {
    create: (sale: Record<string, unknown>, items: Array<Record<string, unknown>>) => ipcRenderer.invoke("sales:create", sale, items),
  },
  invoice: {
    print: () => ipcRenderer.invoke("invoice:print"),
  },
  categories: {
    getAll: () => ipcRenderer.invoke("categories:getAll"),
    create: (data: Record<string, unknown>) => ipcRenderer.invoke("categories:create", data),
    delete: (id: string | number) => ipcRenderer.invoke("categories:delete", id),
  },
  dashboard: {
    getStats: () => ipcRenderer.invoke("dashboard:getStats"),
  },
  reports: {

    getDashboard: (filters: any) =>
      ipcRenderer.invoke(
        "reports:getDashboard",
        filters,
      ),

    getInventory: () =>
      ipcRenderer.invoke(
        "reports:getInventory",
      ),

    getMovements: () =>
      ipcRenderer.invoke(
        "reports:getMovements",
      ),

    getSalesHistory: () =>
      ipcRenderer.invoke(
        "reports:getSalesHistory",
      ),

    getPurchaseHistory: () =>
      ipcRenderer.invoke(
        "reports:getPurchaseHistory",
      ),

  },
  backup: {
    create: () => ipcRenderer.invoke("backup:create"),
    restore: () => ipcRenderer.invoke("backup:restore"),
},
});
