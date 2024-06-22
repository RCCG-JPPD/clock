const { app, BrowserWindow } = require('electron');
const path = require('path');

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
    });

    let publicWindow = new BrowserWindow({
        width: 250,
        height: 100,
        x: 250,
        y: 250,
        frame: false, 
        alwaysOnTop: true, 
        webPreferences: {
            nodeIntegration: true,
        },
    });

    publicWindow.loadFile(path.join(__dirname, 'public-clock.html'));

    privateWindow.loadFile(path.join(__dirname, 'private-clock.html'));
}


app.on('ready', createWindows);
