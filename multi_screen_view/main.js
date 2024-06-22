const { app, BrowserWindow, ipcMain } = require('electron');
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');

let mainWindow;
const captureInterval = 250; // Capture interval in milliseconds (e.g., 1000 ms = 1 second)

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        clearInterval(captureTimer); // Clear interval when the window is closed
    });
}

app.on('ready', createWindow);

let captureTimer;

async function captureScreen(display, index) {
    try {
        const img = await screenshot({ screen: display.id });
        const filePath = path.join(__dirname, `screenshot_${index}.png`);
        fs.writeFileSync(filePath, img);
        return filePath;
    } catch (err) {
        console.error(`Error capturing screen ${index}:`, err);
    }
}

ipcMain.on('start-capturing', async () => {
    try {
        const displays = await screenshot.listDisplays();
        console.log('Displays:', displays); // Log the displays to verify

        captureTimer = setInterval(async () => {
            try {
                const screenshots = await Promise.all(displays.map((display, index) => captureScreen(display, index)));
                console.log('Captured image paths:', screenshots); // Log the captured image paths
                mainWindow.webContents.send('screenshots-captured', screenshots);
            } catch (err) {
                console.error('Error capturing screens:', err);
            }
        }, captureInterval);
    } catch (err) {
        console.error('Error listing displays:', err);
    }
});

ipcMain.on('stop-capturing', () => {
    clearInterval(captureTimer);
});

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
