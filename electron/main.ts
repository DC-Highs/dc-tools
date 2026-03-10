import { app, BrowserWindow, protocol, shell } from "electron"

import path from "node:path"

import "./handlers/animation-conversor.handler"
import "./handlers/config-fetcher.handler"
import "./handlers/select-image.handler"
import "./handlers/http-request.handler"
import "./handlers/downloader.handler"
import "./handlers/bigjpg.handler"
import "./handlers/store.handler"
import "./lib/static-server"

function createWindow() {
    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
        icon:
            process.env.NODE_ENV === "development"
                ? path.join(__dirname, "..", "..", "public", "icon.png")
                : path.join(__dirname, "..", "..", "dist", "icon.png"),
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

app.whenReady().then(() => {
    protocol.registerFileProtocol("app", (request, callback) => {
        const url = decodeURI(request.url.replace("app://", ""))
        const diskId = url.split("/")[0]
        const filePath = url.split("/").slice(1).join("/")
        const fileSystemPath = path.normalize(`${diskId}:/${filePath}`)
        callback({ path: fileSystemPath })
    })
})
