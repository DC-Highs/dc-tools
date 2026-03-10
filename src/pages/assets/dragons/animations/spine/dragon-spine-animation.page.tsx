import { DragonPhase, StaticFileUrlPlatformPrefix, TextureCompressionFormat } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import dcAssets from "@dchighs/dc-assets"
import { useForm } from "react-hook-form"
import { useState, type FC } from "react"
import { toast } from "sonner"

import {
    dragonSpineAnimationDownloaderFormSchema,
    type DragonSpineAnimationDownloaderFormValues,
} from "@/schemas/dragon-spine-animation-downloader-form.schema"
import { DragonSpineAnimationPreview } from "./components/dragon-spine-animation-preview"
import { DragonSpineAnimationForm } from "./components/dragon-spine-animation-form"

const DragonSpineAnimationPage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const form = useForm<DragonSpineAnimationDownloaderFormValues>({
        resolver: zodResolver(dragonSpineAnimationDownloaderFormSchema) as any,
        defaultValues: {
            imageName: "1000_dragon_nature",
            phase: DragonPhase.Baby.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
            textureCompressionFormat: TextureCompressionFormat.DXT5,
            useNewUrlFormat: true,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.animations.spine(currentData as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (data: DragonSpineAnimationDownloaderFormValues) => {
        const currentDownloader = dcAssets.dragons.animations.spine(data as any)
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
        toast.success("URL copied to clipboard!")
    }

    return (
        <div className="space-y-2">
            <DragonSpineAnimationForm
                form={form}
                onSubmit={onSubmit}
                isDownloading={isDownloading}
                handleCopyUrl={handleCopyUrl}
            />
            <DragonSpineAnimationPreview downloadUrl={downloadUrl} />
        </div>
    )
}

export default DragonSpineAnimationPage
