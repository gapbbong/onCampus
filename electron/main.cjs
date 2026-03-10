const { app, BrowserWindow, globalShortcut, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

if (isDev) {
    app.disableHardwareAcceleration();
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        kiosk: !isDev,
        fullscreen: !isDev,
        alwaysOnTop: !isDev,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: isDev,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // mainWindow.setContentProtection(true);

    const url = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    mainWindow.loadURL(url);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    const template = [
        {
            label: '편집(Edit)',
            submenu: [
                { role: 'undo', label: '되돌리기' },
                { role: 'redo', label: '다시 실행' },
                { type: 'separator' },
                { role: 'cut', label: '오려두기' },
                { role: 'copy', label: '복사하기' },
                { role: 'paste', label: '붙여넣기' },
                { role: 'selectAll', label: '전체 선택' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);


    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    if (!isDev) {
        const shortcuts = [
            'CommandOrControl+R',
            'F5',
            'F12',
            'CommandOrControl+Shift+I',
            'Alt+Tab',
            'Alt+F4'
        ];

        shortcuts.forEach(shortcut => {
            globalShortcut.register(shortcut, () => {
                console.log(`Shortcut ${shortcut} is blocked.`);
                return false;
            });
        });
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
