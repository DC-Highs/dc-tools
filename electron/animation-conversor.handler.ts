import { convertDdsToPng } from "@marcuth/dds-to-png"
import { app, dialog, ipcMain } from "electron"
import AdmZip from "adm-zip"

import path from "node:path"
import fs from "node:fs"

import { toAppUrl } from "./to-app-url.util"
import { cacheDir } from "./constants"

ipcMain.handle("convert-animation", async (event) => {
    if (!fs.existsSync(cacheDir)) {
        await fs.promises.mkdir(cacheDir, { recursive: true })
    }

    const result = dialog.showOpenDialogSync({
        title: "Select animation file",
        defaultPath: path.join(app.getPath("downloads")),
        filters: [
            { name: "ZIP", extensions: ["zip"] },
            { name: "All Files", extensions: ["*"] },
        ],
    })

    if (!result) {
        return null
    }

    const filePath = result[0]

    const zip = new AdmZip(filePath)
    const outDirName = path.basename(filePath, ".zip")
    const outDirPath = path.join(cacheDir, outDirName)

    zip.extractAllTo(outDirPath, true)

    const ddsFileNames = await fs.promises.readdir(outDirPath)

    for (const fileName of ddsFileNames) {
        if (fileName.endsWith(".dds")) {
            const ddsPath = path.join(outDirPath, fileName)
            const pngFileName = path.basename(fileName, ".dds") + ".png"
            const pngPath = path.join(outDirPath, pngFileName)
            await convertDdsToPng(ddsPath, pngPath)
            await fs.promises.unlink(ddsPath)
        }

        if (fileName.endsWith(".atlas")) {
            const atlasPath = path.join(outDirPath, fileName)
            const atlasContent = await fs.promises.readFile(atlasPath, "utf-8")
            const atlasLines = atlasContent.split("\n")

            const atlasLinesWithNewPng = atlasLines.map((line) => {
                if (line.endsWith(".dds")) {
                    return line.replace(".dds", ".png")
                }
                return line
            })

            await fs.promises.writeFile(atlasPath, atlasLinesWithNewPng.join("\n"))
        }
    }

    const outputFileNames = await fs.promises.readdir(outDirPath)

    const version = "spine-3-8-59_dxt5"

    const png = outputFileNames.find((fileName) => fileName.endsWith(`${version}.png`))
    const atlas = outputFileNames.find((fileName) => fileName.endsWith(`${version}.atlas`))
    const skel = outputFileNames.find((fileName) => fileName.endsWith(`${version}.skel`))
    const mapPng = outputFileNames.find((fileName) => fileName.endsWith(`${version}_map.png`))
    const mapSkel = outputFileNames.find((fileName) => fileName.endsWith(`${version}_map.skel`))
    const mapAtlas = outputFileNames.find((fileName) => fileName.endsWith(`${version}_map.atlas`))

    if (!png || !atlas || !skel || !mapPng || !mapSkel || !mapAtlas) {
        throw new Error("Some files were not found, check if the texture format is dxt5!")
    }

    return {
        png: toAppUrl(path.join(outDirName, png)),
        atlas: toAppUrl(path.join(outDirName, atlas)),
        skel: toAppUrl(path.join(outDirName, skel)),
        mapPng: toAppUrl(path.join(outDirName, mapPng)),
        mapSkel: toAppUrl(path.join(outDirName, mapSkel)),
        mapAtlas: toAppUrl(path.join(outDirName, mapAtlas)),
    }
})
