const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  products: {
    getAll: () => ipcRenderer.invoke("products:getAll"),

    create: (data) => ipcRenderer.invoke("products:create", data),
    update: (id, data) => ipcRenderer.invoke("products:update", id, data),
    delete: (id) => ipcRenderer.invoke("products:delete", id),
    getByCategory: (id) => ipcRenderer.invoke("products:getByCategory", id)
  },
  purchases: {
    getAll: () => ipcRenderer.invoke("purchases:getAll"),
    getById: (id) => ipcRenderer.invoke("purchases:getId", id),
    create: (purchase, items) =>
      ipcRenderer.invoke("purchases:create", purchase, items),
  },
  auth: {
    login: (username, password) => ipcRenderer.invoke("auth:login",  username ,password),

    getSession: () => ipcRenderer.invoke("auth:getSession"),

    logout: () => ipcRenderer.invoke("auth:logout"),
  },
  sales: {
    create: (sale, items) => ipcRenderer.invoke("sales:create", sale, items),
  },
  invoice: {
    print: () => ipcRenderer.invoke("invoice:print"),
  },
  categories: {
    getAll: () => ipcRenderer.invoke("categories:getAll"),
  }
});
