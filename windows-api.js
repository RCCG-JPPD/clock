const ffi = require('ffi-napi');
const ref = require('ref-napi');

const user32 = ffi.Library('user32', {
    'SetWindowPos': ['bool', ['int', 'int', 'int', 'int', 'int', 'int', 'uint']],
    'FindWindowA': ['int', ['string', 'string']],
});

const HWND_TOPMOST = -1;
const SWP_NOMOVE = 0x0002;
const SWP_NOSIZE = 0x0001;
const SWP_SHOWWINDOW = 0x0040;

function setWindowOnTop(windowTitle) {
    const hwnd = user32.FindWindowA(null, windowTitle);
    if (hwnd !== 0) {
        user32.SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
    }
}

module.exports = {
    setWindowOnTop,
};
