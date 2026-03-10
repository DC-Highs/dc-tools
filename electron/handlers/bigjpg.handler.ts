import { Bigjpg, EnlargeValue, Noise, Style } from "bigjpg"
import { ipcMain } from "electron"

import { store } from "../lib/store"

ipcMain.handle("bigjpg:enlarge", async (_, url: string) => {
    const settings: any = store.get("settings")
    const apiKey = settings?.bigjpg?.apiKey

    if (!apiKey) {
        throw new Error("BigJPG API Key not found in settings")
    }

    const bigjpg = new Bigjpg({ apiKey: apiKey })

    const noise = (settings?.bigjpg?.noise || Noise.Low) as Noise
    const enlarge = (settings?.bigjpg?.enlarge || EnlargeValue["2x"]) as EnlargeValue

    try {
        const result = await bigjpg.enlarge({
            imageUrl: url,
            style: Style.Art,
            noise: noise,
            enlargeValue: enlarge,
        })

        return result.url
    } catch (error) {
        console.error("BigJPG error:", error)
        throw error
    }
})
