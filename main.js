const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 200,
        height: 100,
        frame: false, // Removes the top frame (title bar)
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Load the local HTML file
    win.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', createWindow);
