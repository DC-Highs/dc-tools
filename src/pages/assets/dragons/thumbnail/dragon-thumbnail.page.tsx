import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import dcAssets from "@dchighs/dc-assets"
import { useForm } from "react-hook-form"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { useMagicDownload } from "@/hooks/use-magic-download"

import {
    dragonThumbnailDownloaderFormSchema,
    type DragonThumbnailDownloaderFormValues,
} from "@/schemas/dragon-thumbnail-downloader-form.schema"

import { DragonThumbnailPreview } from "./components/dragon-thumbnail-preview"
import { DragonThumbnailForm } from "./components/dragon-thumbnail-form"

const DragonThumbnailPage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)
    const { isMagicDownloading, handleMagicDownload } = useMagicDownload()

    const form = useForm<DragonThumbnailDownloaderFormValues>({
        resolver: zodResolver(dragonThumbnailDownloaderFormSchema) as any,
        defaultValues: {
            imageName: "1000_dragon_nature",
            phase: DragonPhase.Adult.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.thumbnail(currentData as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (data: DragonThumbnailDownloaderFormValues) => {
        const currentDownloader = dcAssets.dragons.thumbnail(data as any)
        const downloadUrl = currentDownloader.url

        setIsDownloading(true)

        const downloadToastId = toast.loading("Downloading file...")

        try {
            const result = await window.electronAPI.downloadFile(downloadUrl)

            if (typeof result === "string") {
                return toast.success("File downloaded successfully!")
            }

            toast.warning("Download canceled!")
        } catch (error: any) {
            console.error(error)
            toast.error("An error occurred while trying to download the file!")
        } finally {
            setIsDownloading(false)
            toast.dismiss(downloadToastId)
        }
    }

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(downloadUrl)
        toast.success("File URL copied to clipboard!")
    }

    return (
        <div className="space-y-2">
            <DragonThumbnailForm
                form={form}
                onSubmit={onSubmit}
                isDownloading={isDownloading}
                handleCopyUrl={handleCopyUrl}
                handleMagicDownload={handleMagicDownload}
                isMagicDownloading={isMagicDownloading}
                downloadUrl={downloadUrl}
            />

            <DragonThumbnailPreview downloadUrl={downloadUrl} />
        </div>
    )
}

export default DragonThumbnailPage
