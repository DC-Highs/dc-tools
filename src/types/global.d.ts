interface DownloadProgress {
    progress: number
    receivedBytes: number
    totalBytes: number
}

interface ElectronAPI {
    downloadFile: (url: string) => Promise<string | OnErrorEventHandlerNonNull>
    onDownloadProgress: (callback: (progress: DownloadProgress) => void) => () => void
    onDownloadComplete: (callback: (filePath: string) => void) => () => void
    onDownloadError: (callback: (error: string) => void) => () => void
    request: <T = any>(options: HttpRequestOptions) => Promise<HttpResponse<T>>
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
        RufflePlayer: any
    }
}

export {}
