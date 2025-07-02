
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../public/favicon.ico'),
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:8080' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  if (process.platform !== 'darwin') {
    mainWindow.setMenuBarVisibility(false);
  }
}

function createMenu() {
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Su Jok Therapy Manager',
        submenu: [
          { label: 'O aplikaciji', role: 'about' },
          { type: 'separator' },
          { label: 'Sakrij aplikaciju', accelerator: 'Command+H', role: 'hide' },
          { label: 'Sakrij ostale', accelerator: 'Command+Shift+H', role: 'hideothers' },
          { label: 'Prikaži sve', role: 'unhide' },
          { type: 'separator' },
          { label: 'Izađi', accelerator: 'Command+Q', click: () => app.quit() }
        ]
      },
      {
        label: 'Uređivanje',
        submenu: [
          { label: 'Opozovi', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
          { label: 'Ponovi', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
          { type: 'separator' },
          { label: 'Iseci', accelerator: 'CmdOrCtrl+X', role: 'cut' },
          { label: 'Kopiraj', accelerator: 'CmdOrCtrl+C', role: 'copy' },
          { label: 'Nalepi', accelerator: 'CmdOrCtrl+V', role: 'paste' },
          { label: 'Selektuj sve', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
        ]
      },
      {
        label: 'Prozor',
        submenu: [
          { label: 'Minimiziraj', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
          { label: 'Zatvori', accelerator: 'CmdOrCtrl+W', role: 'close' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
