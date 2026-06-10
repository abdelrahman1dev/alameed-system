import { ipcMain, app, BrowserWindow } from 'electron'
import { getAllProducts, createProduct } from '../services/product.service.ts'
import path from 'node:path'

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });


  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

ipcMain.handle('products:getAll', async () => {
  console.log('IPC CALLED');
  return await getAllProducts();
});