const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindows() {
    const displays = screen.getAllDisplays();

    const privateScreenNumber = 0;
    const publicScreenNumber = 0;


    const secondDisplay = displays[publicScreenNumber];
    const thirdDisplay = displays[privateScreenNumber];

    const xposition = 0;
    const yposition = 0;

    const secondDisplayX = secondDisplay.bounds.x + xposition;
    const secondDisplayY = secondDisplay.bounds.y + yposition;
    const thirdDisplayX = thirdDisplay.bounds.x + xposition;
    const thirdDisplayY = thirdDisplay.bounds.y + yposition;

    let privateWindow = new BrowserWindow({
        width: 150,
        height: 50,
        x: thirdDisplayX,
        y: thirdDisplayY,
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
        x: secondDisplayX,
        y: secondDisplayY,
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