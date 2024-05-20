const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// if (process.env.NODE_ENV !== 'production') {
//     require('electron-reloader')(module);
//   }



let win 
function createWindow () { 
win = new BrowserWindow({
    //autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
}) // load the dist folder from Angular 
win.loadURL(url.format({ pathname: path.join(__dirname, 'dist/angular-app/browser/index.html'), protocol: 'file:', slashes: true })) 
// Open the DevTools optionally: 
//win.webContents.openDevTools();
win.maximize();
win.on('closed', () => { win = null }); 
} 

app.on('ready', createWindow) 
app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit() } }) 
app.on('activate', () => { if (win === null) { createWindow() } })