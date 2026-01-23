import type { FetchOptions } from "@dchighs/dc-config"

interface DownloadProgress {
    progress: number
    receivedBytes: number
    totalBytes: number
}

export interface ConvertAnimationResult {
    png: string
    atlas: string
    skel: string
    mapPng: string
    mapSkel: string
    mapAtlas: string
}

interface ElectronAPI {
    downloadFile: (url: string) => Promise<string | OnErrorEventHandlerNonNull>
    onDownloadProgress: (callback: (progress: DownloadProgress) => void) => () => void
    onDownloadComplete: (callback: (filePath: string) => void) => () => void
    onDownloadError: (callback: (error: string) => void) => () => void
    request: <T = any>(options: HttpRequestOptions) => Promise<HttpResponse<T>>
    convertAnimation: () => Promise<ConvertAnimationResult | null>
    fetchConfig: (options: FetchOptions) => Promise<GameConfigDto>
    selectImage: () => Promise<string | null>
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
        RufflePlayer: any
        spine: any
    }
}

export {}
