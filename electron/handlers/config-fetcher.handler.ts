import { Config, FetchOptions } from "@dchighs/dc-config"
import { ipcMain } from "electron"

export function registerConfigFetcherHandler() {
    ipcMain.handle("config:fetch", async (_, options: FetchOptions) => {
        const configData = await Config.fetch(options)
        return configData
    })
}
