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
    downloadFile: (url: string, filename?: string) => Promise<string | null>
    onDownloadProgress: (callback: (progress: DownloadProgress) => void) => () => void
    onDownloadComplete: (callback: (filePath: string) => void) => () => void
    onDownloadError: (callback: (error: string) => void) => () => void
    request: <T = any>(options: HttpRequestOptions) => Promise<HttpResponse<T>>
    convertAnimation: () => Promise<ConvertAnimationResult | null>
    bigjpgEnlarge: (url: string) => Promise<string>
    fetchConfig: (options: FetchOptions) => Promise<GameConfigDto>
    selectImage: () => Promise<string | null>
    store: {
        get: <T = any>(key: string) => Promise<T>
        set: (key: string, value: any) => Promise<void>
        delete: (key: string) => Promise<void>
    }
    cache: {
        getSize: () => Promise<number>
        clear: () => Promise<boolean>
    }
    zip: {
        list: (url: string) => Promise<Array<{ name: string; size: number; isDirectory: boolean }>>
    }
    clientState: {
        getPath: () => Promise<string | null>
        getPreferences: () => Promise<{
            userId: number | undefined
            musicDisabled: boolean
            soundDisabled: boolean
            lastExecution: Date | undefined
        } | null>
        getUserId: () => Promise<number | undefined>
        setMusicDisabled: (disabled: boolean) => Promise<boolean>
        setSoundDisabled: (disabled: boolean) => Promise<boolean>
        setAllFarmCrops: (cropId: number) => Promise<boolean>
        deleteAllFarmCrops: () => Promise<boolean>
        getTutorials: () => Promise<any[]>
        setTutorialsShown: (shown: boolean) => Promise<boolean>
        getUserDefaultValue: (key: string) => Promise<any>
        setUserDefaultValue: (key: string, value: any) => Promise<boolean>
        listAssets: (types?: any[]) => Promise<string[]>
        setAsset: (assetName: string, filePath: string) => Promise<boolean>
        deleteAsset: (assetName: string) => Promise<boolean>
        clearAssets: () => Promise<boolean>
    }
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
        RufflePlayer: any
        spine: any
    }
}

export {}
