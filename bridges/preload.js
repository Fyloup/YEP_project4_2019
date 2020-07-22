// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {ipcRenderer, contextBridge} = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, message, ...args) => {
            // whitelist channels
            console.log("sending")
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, message, ...args);
            }
        },
        receive: (channel, func) => {
            console.log("receiving")
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                console.log("channel", channel)
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => {console.log("received", args); ipcRenderer.send("toMain", "Log", args); func(...args);});
            }
        }
    }
);