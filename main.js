const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

const clockHeight = 30 * 2;
const clockWidth = 90 * 2;

function createWindows() {
  const displays = screen.getAllDisplays();
  const privateScreenNumber = 2; // default should be 2
  const publicScreenNumber = 0;  // default should be 1

  const secondDisplay = displays[publicScreenNumber];
  const thirdDisplay = displays[privateScreenNumber];

  const xposition = 0;
  const yposition = 0;

  const secondDisplayX = secondDisplay.bounds.x + xposition;
  const secondDisplayY = secondDisplay.bounds.y + yposition;
  const thirdDisplayX = thirdDisplay.bounds.x + xposition;
  const thirdDisplayY = thirdDisplay.bounds.y + yposition;

  let privateWindow = new BrowserWindow({
    width: clockWidth,
    height: clockHeight,
    x: thirdDisplayX,
    y: thirdDisplayY,
    frame: false,
    alwaysOnTop: true, // initial always-on-top flag
    minimizable: false, // prevent window from being minimized
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // On Windows, you can remove or change this property; 'toolbar' is a common type for overlay windows.
    // type: 'toolbar'
  });

  let publicWindow = new BrowserWindow({
    width: clockWidth,
    height: clockHeight,
    x: secondDisplayX,
    y: secondDisplayY,
    frame: false,
    alwaysOnTop: true,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // type: 'toolbar'
  });

  privateWindow.loadFile(path.join(__dirname, 'private-clock.html'));
  publicWindow.loadFile(path.join(__dirname, 'public-clock.html'));

  // Function to enforce highest-level always-on-top status
  const enforceAlwaysOnTop = (win) => {
    if (!win.isDestroyed()) {
      // Use 'screen-saver' level to keep the window above all other always-on-top windows
      win.setAlwaysOnTop(true, 'screen-saver');
      // Bring the window to the top without stealing focus
      win.moveTop();
    }
  };

  // Reapply always-on-top periodically (every 1000 ms)
  setInterval(() => {
    enforceAlwaysOnTop(privateWindow);
    enforceAlwaysOnTop(publicWindow);
  }, 1000);

  // Attach events to reapply always-on-top when window state changes
  const attachEvents = (win) => {
    win.on('minimize', (e) => {
      e.preventDefault();
      win.restore();
      enforceAlwaysOnTop(win);
    });

    win.on('hide', (e) => {
      e.preventDefault();
      win.show();
      enforceAlwaysOnTop(win);
    });

    win.on('blur', () => {
      enforceAlwaysOnTop(win);
    });
  };

  attachEvents(privateWindow);
  attachEvents(publicWindow);
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
