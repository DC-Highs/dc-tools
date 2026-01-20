import { contextBridge, ipcRenderer } from "electron"

import { FetchOptions, GameConfigDto } from "@dchighs/dc-config"

import { HttpRequestOptions, HttpResponse } from "./http-request.handler"

interface DownloadProgress {
    progress: number
    receivedBytes: number
    totalBytes: number
}

contextBridge.exposeInMainWorld("electronAPI", {
    downloadFile: (url: string) => ipcRenderer.invoke("download-file", url),

    onDownloadProgress: (callback: (progress: DownloadProgress) => void) => {
        ipcRenderer.on("download-progress", (_, progress) => callback(progress))
        return () => ipcRenderer.removeAllListeners("download-progress")
    },

    onDownloadComplete: (callback: (filePath: string) => void) => {
        ipcRenderer.on("download-complete", (_, filePath) => callback(filePath))
        return () => ipcRenderer.removeAllListeners("download-complete")
    },

    onDownloadError: (callback: (error: string) => void) => {
        ipcRenderer.on("download-error", (_, error) => callback(error))
        return () => ipcRenderer.removeAllListeners("download-error")
    },

    request: <T = any>(options: HttpRequestOptions): Promise<HttpResponse<T>> =>
        ipcRenderer.invoke("http-request", options),

    fetchConfig: (options: FetchOptions): Promise<GameConfigDto> => ipcRenderer.invoke("fetch-config", options),
})
