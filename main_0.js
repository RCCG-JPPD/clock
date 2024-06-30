const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindows() {
    let privateWindow = new BrowserWindow({
        width: 150,
        height: 50,
        x: 0,
        y: 0,
        frame: false, 
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
        },
        type: 'darwin' //'toolbar'
    });

    let publicWindow = new BrowserWindow({
        width: 150,
        height: 50,
        x: 250,
        y: 250,
        frame: false, 
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
        },
        type: 'darwin' //'toolbar'
    });

    privateWindow.loadFile(path.join(__dirname, 'private-clock.html'));
    publicWindow.loadFile(path.join(__dirname, 'public-clock.html'));

    const bringToTop = (window) => {
        window.setAlwaysOnTop(true);
        window.showInactive();
    };

    // Ensure the windows stay on top by bringing them to the front periodically
    setInterval(() => {
        bringToTop(privateWindow);
        bringToTop(publicWindow);
    }, 100);
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
