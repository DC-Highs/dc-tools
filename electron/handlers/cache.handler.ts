import { ipcMain } from "electron"
import fs from "node:fs"
import path from "node:path"
import { tempDir } from "../lib/constants"

export function registerCacheHandler() {
    ipcMain.handle("cache:get-size", async () => {
        try {
            return await getDirSize(tempDir)
        } catch (error) {
            console.error("Failed to get cache size:", error)
            return 0
        }
    })

    ipcMain.handle("cache:clear", async () => {
        try {
            const files = await fs.promises.readdir(tempDir)

            for (const file of files) {
                const filePath = path.join(tempDir, file)
                const stats = await fs.promises.stat(filePath)

                if (stats.isDirectory()) {
                    await fs.promises.rm(filePath, { recursive: true, force: true })
                } else {
                    await fs.promises.unlink(filePath)
                }
            }

            return true
        } catch (error) {
            console.error("Failed to clear cache:", error)
            return false
        }
    })
}

async function getDirSize(dirPath: string): Promise<number> {
    let size = 0
    const files = await fs.promises.readdir(dirPath)

    for (const file of files) {
        const filePath = path.join(dirPath, file)

        try {
            const stats = await fs.promises.stat(filePath)
            if (stats.isFile()) {
                size += stats.size
            } else if (stats.isDirectory()) {
                size += await getDirSize(filePath)
            }
        } catch {}
    }

    return size
}
