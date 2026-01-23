import { app, dialog, ipcMain } from "electron"

import path from "node:path"
import fs from "node:fs"

import { toAppUrl } from "./to-app-url.util"
import { tempDir } from "./constants"

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

    const fileName = `${Date.now()}-${path.basename(filePath)}`

    const outputFilePath = path.join(tempDir, fileName)

    if (!fs.existsSync(outputFilePath)) {
        await fs.promises.copyFile(filePath, outputFilePath)
    }

    return toAppUrl(fileName)
})
