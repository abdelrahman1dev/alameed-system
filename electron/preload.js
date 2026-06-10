const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  products: {
    getAll: () => ipcRenderer.invoke('products:getAll'),
    create: (data) => ipcRenderer.invoke('products:create', data),
  },
});