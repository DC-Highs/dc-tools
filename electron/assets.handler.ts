import dcAssets from "@dchighs/dc-assets"
import { ipcMain } from "electron"

// We don't strictly need to import Enums if we trust the values sent from frontend match what the library expects.
// But imports are good for safety if we use typescript.

export const registerAssetHandlers = () => {
    ipcMain.handle("assets:download", async (_, type: string, options: any) => {
        try {
            console.log(`[Assets] Requesting ${type} with options:`, options)
            let downloader: any = null

            switch (type) {
                case "dragon-flash":
                    downloader = dcAssets.dragons.animations.flash(options)
                    break
                case "dragon-spine":
                    downloader = dcAssets.dragons.animations.spine(options)
                    break
                case "dragon-sprite":
                    downloader = dcAssets.dragons.sprite(options)
                    break
                case "dragon-head": // Fallback or specific? User said "Thumbnail"
                case "dragon-thumb":
                    downloader = dcAssets.dragons.thumbnail(options)
                    break
                case "island-package":
                    // Library example: islandDownloader = dcAssets.islands.package({...})
                    downloader = dcAssets.islands.package(options)
                    break
                case "music":
                    downloader = dcAssets.sounds.music(options)
                    break
                case "chest-sprite":
                    downloader = dcAssets.chests.sprite(options)
                    break
                case "building-sprite":
                    downloader = dcAssets.buildings.sprite(options)
                    break
                case "building-thumb":
                    downloader = dcAssets.buildings.thumbnail(options)
                    break
                default:
                    throw new Error(`Unknown asset type: ${type}`)
            }

            if (!downloader) {
                throw new Error("Downloader could not be initialized")
            }

            // User suggested "use your download strategy" and "use .url"
            const url = downloader.url
            if (!url) {
                throw new Error("Could not determine URL from downloader")
            }

            console.log(`[Assets] Fetching URL: ${url}`)

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Failed to fetch asset from ${url}: ${response.status} ${response.statusText}`)
            }

            const arrayBuffer = await response.arrayBuffer()
            // Return as Buffer (Node.js) which Electron serializes well
            return Buffer.from(arrayBuffer)
        } catch (error) {
            console.error("[Assets] Error:", error)
            throw error // Propagate to renderer
        }
    })
}
