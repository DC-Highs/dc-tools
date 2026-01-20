import { Config, FetchOptions } from "@dchighs/dc-config"
import { ipcMain } from "electron"

ipcMain.handle("fetch-config", async (_, options: FetchOptions) => {
    const configData = await Config.fetch(options)
    return configData
})
