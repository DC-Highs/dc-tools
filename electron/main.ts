import { app, BrowserWindow, Menu, protocol, shell } from "electron"

import path from "node:path"

import { registerAnimationConversorHandler } from "./handlers/animation-conversor.handler"
import { registerBigjpgHandler } from "./handlers/bigjpg.handler"
import { registerConfigFetcherHandler } from "./handlers/config-fetcher.handler"
import { registerDownloaderHandler } from "./handlers/downloader.handler"
import { registerHttpRequestHandler } from "./handlers/http-request.handler"
import { registerSelectImageHandler } from "./handlers/select-image.handler"
import { registerStoreHandlers } from "./handlers/store.handler"
import "./lib/static-server"

function registerIpcHandlers() {
    registerAnimationConversorHandler()
    registerBigjpgHandler()
    registerConfigFetcherHandler()
    registerDownloaderHandler()
    registerHttpRequestHandler()
    registerSelectImageHandler()
    registerStoreHandlers()
}

function createWindow() {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        icon: path.join(
            app.getAppPath(),
            process.env.NODE_ENV === "development" ? "public" : "dist",
            "icon.png"
        ),
    })

    win.maximize()
    win.show()

    if (process.env.NODE_ENV === "development") {
        win.loadURL("http://localhost:5173")
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, "../../dist/index.html"))
    }

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: "deny" }
    })
}

app.whenReady().then(() => {
    Menu.setApplicationMenu(null)
    registerIpcHandlers()
    createWindow()
})

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

app.whenReady().then(() => {
    protocol.registerFileProtocol("app", (request, callback) => {
        const url = decodeURI(request.url.replace("app://", ""))
        const diskId = url.split("/")[0]
        const filePath = url.split("/").slice(1).join("/")
        const fileSystemPath = path.normalize(`${diskId}:/${filePath}`)
        callback({ path: fileSystemPath })
    })
})
