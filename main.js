const { app, BrowserWindow } = require('electron');
const path = require('path');
const { setWindowOnTop } = require('./windows-api');

function createWindows() {
    let privateWindow = new BrowserWindow({
        width: 250,
        height: 100,
        x: 0,
        y: 0,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
        },
        type: 'toolbar'
    });

    let publicWindow = new BrowserWindow({
        width: 250,
        height: 100,
        x: -2691,
        y: 48,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
        },
        type: 'toolbar'
    });

    privateWindow.loadFile(path.join(__dirname, 'private-clock.html'));
    publicWindow.loadFile(path.join(__dirname, 'public-clock.html'));

    const ensureAlwaysOnTop = (window, title) => {
        window.setAlwaysOnTop(true, 'screen-saver'); // Using 'screen-saver' level
        window.on('focus', () => {
            window.setAlwaysOnTop(true, 'screen-saver');
        });
        setInterval(() => {
            setWindowOnTop(title);
        }, 5000); // Check every 5 seconds
    };

    privateWindow.setTitle('Private Window'); // Set a unique title
    publicWindow.setTitle('Public Window'); // Set a unique title

    ensureAlwaysOnTop(privateWindow, 'Private Window');
    ensureAlwaysOnTop(publicWindow, 'Public Window');

    setInterval(() => {
        if (!privateWindow.isAlwaysOnTop()) {
            privateWindow.setAlwaysOnTop(true, 'screen-saver');
        }
        if (!publicWindow.isAlwaysOnTop()) {
            publicWindow.setAlwaysOnTop(true, 'screen-saver');
        }
    }, 500);
}

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindows();
    }
});
