const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindows() {
    const displays = screen.getAllDisplays();

    const privateScreenNumber = 2;
    const publicScreenNumber = 1;

    const secondDisplay = displays[publicScreenNumber];
    const thirdDisplay = displays[privateScreenNumber];

    // Get the width and height of the displays
    const secondDisplayWidth = secondDisplay.bounds.width;
    const secondDisplayHeight = secondDisplay.bounds.height;
    const thirdDisplayWidth = thirdDisplay.bounds.width;
    const thirdDisplayHeight = thirdDisplay.bounds.height;

    // Create private window on the third screen, full screen
    let privateWindow = new BrowserWindow({
        width: thirdDisplayWidth,
        height: thirdDisplayHeight,
        x: thirdDisplay.bounds.x,
        y: thirdDisplay.bounds.y,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        type: 'darwin'
    });

    // Create public window on the second screen, full screen
    let publicWindow = new BrowserWindow({
        width: secondDisplayWidth,
        height: secondDisplayHeight,
        x: secondDisplay.bounds.x,
        y: secondDisplay.bounds.y,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        type: 'darwin'
    });

    privateWindow.loadFile(path.join(__dirname, 'private-clock.html'));
    publicWindow.loadFile(path.join(__dirname, 'private-clock.html'));

    const bringToTop = (window) => {
        window.setAlwaysOnTop(true);
        window.showInactive();
    };

    // Ensure the windows stay on top by bringing them to the front periodically
    setInterval(() => {
        bringToTop(privateWindow);
        bringToTop(publicWindow);
    }, 100); // interval check in ms
}

app.commandLine.appendSwitch('enable-accelerated-2d-canvas', 'true');
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');

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
