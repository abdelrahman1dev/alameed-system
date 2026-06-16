const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  products: {
    getAll: () => ipcRenderer.invoke("products:getAll"),

    create: (data) => ipcRenderer.invoke("products:create", data),
    update: (id, data) => ipcRenderer.invoke("products:update", id, data),
    delete: (id) => ipcRenderer.invoke("products:delete", id),
  },

  sales: {
    create: (sale, items) =>
      ipcRenderer.invoke(
        "sales:create",
        sale,
        items,
      ),
  },
  invoice: {
    print: () => ipcRenderer.invoke("invoice:print"),
  },
});
