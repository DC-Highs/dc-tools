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
})
