// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require("fs")
let musicMetadata = require('musicmetadata');

process.env.GOOGLE_API_KEY = "AIzaSyDWQ3-ucLTK4371yRDayjK9Hh4h5Nk0WO4"

let mainWindow;

let messageRef = {
  "SendProfiles": () => {
    let source = {}
    let raw = fs.readFileSync("./userdata/profiles.json")

    try {
      source = JSON.parse(raw)
    } catch (e) {
      console.log(e)
    }
    mainWindow.webContents.send("fromMain", "profiles", source);
  },
  "SaveProfiles": (newContent) => {
    if (newContent) {
      try {
        fs.writeFileSync("./userdata/profiles.json", JSON.stringify(newContent, null, 4))
      } catch (e) {
        console.log("Could not write new profile")
      }
    } else {
      console.log("error when saving profile")
    }
  },
  "ChangePage": (path) => {
    console.log(path)
    mainWindow.loadFile(path)
  },
  "Close": () => {
    mainWindow.close()
  },
  "ReadDir": () => {
    dialog.showOpenDialog({ properties: ['openDirectory'], title: "Select the directory containing your picture files" }).then(function(dir) {
      let files = fs.readdirSync(dir.filePaths[0]);

      mainWindow.webContents.send("fromMain", "dirFiles", {path: dir.filePaths[0], files: files})
    });
  },
  "ReadFile": (path) => {
    if (!path) {
      dialog.showOpenDialog({ properties: ['openFile'], title: "Select a music file", filters: [{ extensions: ['mp3', 'ogg']},]}).then(function(file) {
        musicMetadata(fs.createReadStream(file.filePaths[0]), (err, metadata) => {
          mainWindow.webContents.send("fromMain", "file", {path: file.filePaths[0], file: metadata})
        })
      })
    } else {
      musicMetadata(fs.createReadStream(path), (err, metadata) => {
        mainWindow.webContents.send("fromMain", "file", {path: path, file: metadata})
      })
    }
  },
  "OnPageLoad": (id) => {
    try {
      mainWindow.webContents.send("fromMain", "page", {page: id})
    } catch (error) {
      console.log("error: ", error)
    }
    // mainWindow.webContents.on("did-finish-load", () => {
    //   console.log("ready to send")
    //   mainWindow.webContents.send("fromMain", "page", {id: id})
    // })
  },
  "Log": (...args) => {
    console.log("log: ", args)
  }
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      nodeIntegration: false,
      preload: path.join(__dirname, 'bridges/preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./pages/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("toMain", (event, message, ...args) => {
  if (messageRef.hasOwnProperty(message)) {
    console.log("args: ", args)
    messageRef[message](...args)
  }
})

