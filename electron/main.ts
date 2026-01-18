import { app, BrowserWindow, session } from "electron"

import { registerAssetHandlers } from "./assets.handler"
import "./http-reqest.handler"
import "./downloader.handler"
import path from "node:path"

// Register IPC handlers
registerAssetHandlers()

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    })

    if (process.env.NODE_ENV === "development") {
        win.loadURL("http://localhost:5173")
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, "../dist/index.html"))
    }
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
