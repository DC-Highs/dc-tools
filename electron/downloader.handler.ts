import { app, BrowserWindow, ipcMain, dialog, net } from "electron"

import path from "node:path"
import fs from "node:fs"

ipcMain.handle("download-file", async (event, url: string) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)

    if (!mainWindow) {
        throw new Error("Window not found")
    }

    const fileName = path.basename(new URL(url).pathname) || "download.png"

    const result = (await dialog.showSaveDialog(mainWindow, {
        title: "Salvar sprite",
        defaultPath: path.join(app.getPath("downloads"), fileName),
        filters: [
            { name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp"] },
            { name: "All Files", extensions: ["*"] },
        ],
    })) as any

    if (result.canceled || !result.filePath) {
        return null // usuário cancelou
    }

    const filePath = result.filePath

    return new Promise((resolve, reject) => {
        const request = net.request(url)

        request.on("response", (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`))
                return
            }

            const totalBytes = Number(response.headers["content-length"]) || 0
            let receivedBytes = 0

            const writeStream = fs.createWriteStream(filePath)

            response.on("data", (chunk) => {
                receivedBytes += chunk.length

                if (totalBytes) {
                    event.sender.send("download-progress", {
                        progress: (receivedBytes / totalBytes) * 100,
                        receivedBytes,
                        totalBytes,
                    })
                }
            })

            response.pipe(writeStream)

            writeStream.on("finish", () => {
                event.sender.send("download-complete", filePath)
                resolve(filePath)
            })

            writeStream.on("error", (err) => {
                fs.unlink(filePath, () => {})
                event.sender.send("download-error", err.message)
                reject(err)
            })
        })

        request.on("error", (err) => {
            event.sender.send("download-error", err.message)
            reject(err)
        })

        request.end()
    })
})
