import { ipcMain } from "electron"
import { ClientState, AssetType, Preferences } from "@dchighs/dc-client-state"

export function registerClientStateHandler() {
    const client = new ClientState()
    const preferences = new Preferences(client.userDefault)

    ipcMain.handle("client-state:get-path", async () => {
        try {
            return client.dragonCityDirPath
        } catch (error) {
            console.error("Failed to get game path:", error)
            return null
        }
    })

    // Preferences (High-level)
    ipcMain.handle("client-state:get-user-id", async () => {
        try {
            return await preferences.getUserId()
        } catch (error) {
            console.error("Failed to get User ID:", error)
            return null
        }
    })

    ipcMain.handle("client-state:get-preferences", async () => {
        try {
            const userId = await preferences.getUserId()
            const musicDisabled = await client.userDefault.get("options_music_disabled")
            const soundDisabled = await client.userDefault.get("options_sound_disabled")
            const lastExecution = await preferences.getLastExecution()
            const farmCrops = await preferences.getAllFarmCrops()

            return {
                userId,
                musicDisabled,
                soundDisabled,
                lastExecution,
                farmCrops,
            }
        } catch (error) {
            console.error("Failed to get preferences:", error)
            return null
        }
    })

    ipcMain.handle("client-state:set-music-disabled", async (_, disabled: boolean) => {
        try {
            if (disabled) {
                await preferences.disableMusic()
            } else {
                await preferences.enableMusic()
            }
            return true
        } catch (error) {
            console.error("Failed to set music status:", error)
            return false
        }
    })

    ipcMain.handle("client-state:set-sound-disabled", async (_, disabled: boolean) => {
        try {
            if (disabled) {
                await preferences.disableSound()
            } else {
                await preferences.enableSound()
            }
            return true
        } catch (error) {
            console.error("Failed to set sound status:", error)
            return false
        }
    })

    ipcMain.handle("client-state:set-all-farm-crops", async (_, cropId: number) => {
        try {
            await preferences.setAllFarmCrops(cropId)
            return true
        } catch (error) {
            console.error("Failed to set farm crops:", error)
            return false
        }
    })

    ipcMain.handle("client-state:delete-all-farm-crops", async () => {
        try {
            await preferences.deleteAllFarmCrops()
            return true
        } catch (error) {
            console.error("Failed to delete farm crops:", error)
            return false
        }
    })

    ipcMain.handle("client-state:get-tutorials", async () => {
        try {
            return await preferences.getDisplayTutorials()
        } catch (error) {
            return []
        }
    })

    ipcMain.handle("client-state:set-tutorials-shown", async (_, shown: boolean) => {
        try {
            await preferences.setDisplayTutorials(shown)
            return true
        } catch (error) {
            return false
        }
    })

    // UserDefault (Low-level)
    ipcMain.handle("client-state:get-user-default-value", async (_, key: string) => {
        try {
            return await client.userDefault.get(key)
        } catch (error) {
            console.error(`Failed to get key ${key}:`, error)
            return null
        }
    })

    ipcMain.handle("client-state:set-user-default-value", async (_, key: string, value: any) => {
        try {
            await client.userDefault.set(key, value)
            return true
        } catch (error) {
            console.error(`Failed to set key ${key}:`, error)
            return false
        }
    })

    // Assets
    ipcMain.handle("client-state:list-assets", async (_, types?: AssetType[]) => {
        try {
            return await client.assets.listAssets(types)
        } catch (error) {
            console.error("Failed to list assets:", error)
            return []
        }
    })

    ipcMain.handle("client-state:set-asset", async (_, assetName: string, filePath: string) => {
        try {
            await client.assets.set(assetName, filePath)
            return true
        } catch (error) {
            console.error(`Failed to set asset ${assetName}:`, error)
            return false
        }
    })

    ipcMain.handle("client-state:delete-asset", async (_, assetName: string) => {
        try {
            await client.assets.delete(assetName)
            return true
        } catch (error) {
            console.error(`Failed to delete asset ${assetName}:`, error)
            return false
        }
    })

    ipcMain.handle("client-state:clear-assets", async () => {
        try {
            await client.assets.clearAssets()
            return true
        } catch (error) {
            console.error("Failed to clear assets:", error)
            return false
        }
    })
}
