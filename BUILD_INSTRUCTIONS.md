
# Instrukcije za kreiranje standalone aplikacije

## Korak 1: Priprema
1. Instaliraj Node.js sa https://nodejs.org (LTS verziju)
2. Instaliraj git sa https://git-scm.com
3. Otvori terminal/command prompt

## Korak 2: Kreiranje aplikacije
```bash
# Kloniraj projekat
git clone [URL_TVOG_PROJEKTA]
cd [IME_PROJEKTA]

# Instaliraj dependencies
npm install

# Build aplikaciju
npm run build
```

## Korak 3: Kreiranje desktop aplikacije sa Electron

1. Instaliraj Electron Builder:
```bash
npm install --save-dev electron electron-builder concurrently
```

2. Kreiraj main.js fajl u root direktorijumu:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

3. Dodaj u package.json:
```json
{
  "main": "main.js",
  "scripts": {
    "electron": "electron .",
    "build-electron": "npm run build && electron-builder",
    "dist": "npm run build && electron-builder --publish=never"
  },
  "build": {
    "appId": "com.yourname.therapy-app",
    "productName": "Therapy Manager",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "package.json"
    ],
    "mac": {
      "category": "public.app-category.medical"
    }
  }
}
```

## Korak 4: Build za macOS
```bash
npm run dist
```

Aplikacija će biti kreirana u `dist-electron` folderu.

## Korak 5: Pokretanje
- Za development: `npm run electron`
- Za production: Otvorit će se .app fajl u dist-electron folderu

## Napomene:
- Podaci se čuvaju u localStorage browsera unutar Electron aplikacije
- Za backup podataka, možeš eksportovati PDF izveštaje
- Aplikacija radi potpuno offline
