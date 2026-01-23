import { app, dialog, ipcMain } from "electron"

import path from "node:path"
import fs from "node:fs"

import { toAppUrl } from "./to-app-url.util"
import { cacheDir } from "./constants"

ipcMain.handle("select-image", async (event) => {
    const result = dialog.showOpenDialogSync({
        title: "Select image",
        defaultPath: path.join(app.getPath("downloads")),
        filters: [
            { name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "bmp", "webp"] },
            { name: "All Files", extensions: ["*"] },
        ],
    })

    if (!result) {
        return null
    }

    const filePath = result[0]

    const fileName = path.basename(filePath)
    const destDirName = "images"
    const destDir = path.join(cacheDir, destDirName)

    if (!fs.existsSync(destDir)) {
        await fs.promises.mkdir(destDir, { recursive: true })
    }

    const outputFilePath = path.join(destDir, fileName)

    if (!fs.existsSync(outputFilePath)) {
        await fs.promises.copyFile(filePath, outputFilePath)
    }

    return toAppUrl(path.join(destDirName, fileName))
})
