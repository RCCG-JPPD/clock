const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 250,
        height: 100,
        frame: false, 
        alwaysOnTop: true, 
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile(path.join(__dirname, 'private-clock.html'));
}

app.on('ready', createWindow);
