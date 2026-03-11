import { contextBridge, ipcRenderer } from "electron"

import { FetchOptions, GameConfigDto } from "@dchighs/dc-config"

import { HttpRequestOptions, HttpResponse } from "./handlers/http-request.handler"

interface DownloadProgress {
    progress: number
    receivedBytes: number
    totalBytes: number
}

contextBridge.exposeInMainWorld("electronAPI", {
    downloadFile: (url: string, filename?: string) => ipcRenderer.invoke("file:download", url, filename),

    onDownloadProgress: (callback: (progress: DownloadProgress) => void) => {
        ipcRenderer.on("file:download-progress", (_, progress) => callback(progress))
        return () => ipcRenderer.removeAllListeners("file:download-progress")
    },

    onDownloadComplete: (callback: (filePath: string) => void) => {
        ipcRenderer.on("file:download-complete", (_, filePath) => callback(filePath))
        return () => ipcRenderer.removeAllListeners("file:download-complete")
    },

    onDownloadError: (callback: (error: string) => void) => {
        ipcRenderer.on("file:download-error", (_, error) => callback(error))
        return () => ipcRenderer.removeAllListeners("file:download-error")
    },

    request: <T = any>(options: HttpRequestOptions): Promise<HttpResponse<T>> =>
        ipcRenderer.invoke("http:request", options),

    convertAnimation: () => ipcRenderer.invoke("animation:convert"),

    bigjpgEnlarge: (url: string) => ipcRenderer.invoke("bigjpg:enlarge", url),

    fetchConfig: (options: FetchOptions): Promise<GameConfigDto> => ipcRenderer.invoke("config:fetch", options),

    selectImage: (): Promise<string> => ipcRenderer.invoke("file:select"),

    store: {
        get: (key: string) => ipcRenderer.invoke("store:get", key),
        set: (key: string, value: any) => ipcRenderer.invoke("store:set", key, value),
        delete: (key: string) => ipcRenderer.invoke("store:delete", key),
    },

    cache: {
        getSize: (): Promise<number> => ipcRenderer.invoke("cache:get-size"),
        clear: (): Promise<boolean> => ipcRenderer.invoke("cache:clear"),
    },
    zip: {
        list: (url: string) => ipcRenderer.invoke("zip:list", url),
    },
    clientState: {
        getPath: () => ipcRenderer.invoke("client-state:get-path"),
        getPreferences: () => ipcRenderer.invoke("client-state:get-preferences"),
        getUserId: () => ipcRenderer.invoke("client-state:get-user-id"),
        setMusicDisabled: (disabled: boolean) => ipcRenderer.invoke("client-state:set-music-disabled", disabled),
        setSoundDisabled: (disabled: boolean) => ipcRenderer.invoke("client-state:set-sound-disabled", disabled),
        setAllFarmCrops: (cropId: number) => ipcRenderer.invoke("client-state:set-all-farm-crops", cropId),
        deleteAllFarmCrops: () => ipcRenderer.invoke("client-state:delete-all-farm-crops"),
        getTutorials: () => ipcRenderer.invoke("client-state:get-tutorials"),
        setTutorialsShown: (shown: boolean) => ipcRenderer.invoke("client-state:set-tutorials-shown", shown),
        getUserDefaultValue: (key: string) => ipcRenderer.invoke("client-state:get-user-default-value", key),
        setUserDefaultValue: (key: string, value: any) =>
            ipcRenderer.invoke("client-state:set-user-default-value", key, value),
        listAssets: (types?: any[]) => ipcRenderer.invoke("client-state:list-assets", types),
        setAsset: (assetName: string, filePath: string) =>
            ipcRenderer.invoke("client-state:set-asset", assetName, filePath),
        deleteAsset: (assetName: string) => ipcRenderer.invoke("client-state:delete-asset", assetName),
        clearAssets: () => ipcRenderer.invoke("client-state:clear-assets"),
    },
})
