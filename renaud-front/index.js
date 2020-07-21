console.log('main process working')

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain
const Store = require('electron-store');
const storage = new Store({name:'settings'});

// Set the zoom factor to 200%
process.env.GOOGLE_API_KEY = "AIzaSyDWQ3-ucLTK4371yRDayjK9Hh4h5Nk0WO4"

let window;
let child;

function createWindow() {
    window = new BrowserWindow({
        webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true},frame: false,
        icon: path.join(__dirname, 'media/AppIcon.png')
    });

    window.setFullScreen(true)

    window.loadURL(url.format({
        pathname: path.join(__dirname, './html/index.html'),
        protocol: 'file',
        slashes: true
    }));

    // Uncomment the following line to open the devtool:
    window.on('closed', () => {
        window = null;
        child = null;
    })
}

ipc.on('open-colored-themes', (event) => {
    child = new BrowserWindow({
        parent: window,
        modal: true,
        center: true,
        frame: false,
        movable: false,
        resizable: false,
        transparent: true,
        autoHideMenuBar: true,
        width: 800, height:800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    child.loadFile('./html/ColoredThemes.html')
});

app.on('ready', createWindow);
