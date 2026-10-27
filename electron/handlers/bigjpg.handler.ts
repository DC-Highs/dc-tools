import { BigjpgOpen, type BigjpgNoise } from "bigjpg-open"
import { ipcMain } from "electron"

import { store } from "../lib/store"

export function registerBigjpgHandler() {
    ipcMain.handle("bigjpg:enlarge", async (_, url: string) => {
        const settings: any = store.get("settings")

        const bigjpg = new BigjpgOpen()

        const noise = Number(settings?.bigjpg?.noise ?? 0) as BigjpgNoise
        // Bigjpg only accepts 2x without an account (4x, 8x and 16x return param_error)
        const scale = 2

        try {
            const result = await bigjpg.enlarge({
                input: url,
                style: "art",
                noise: noise,
                scale: scale,
            })

            if (!result.url) {
                throw new Error("Bigjpg did not return an image URL")
            }

            return result.url
        } catch (error) {
            console.error("BigJPG error:", error)
            throw error
        }
    })
}
