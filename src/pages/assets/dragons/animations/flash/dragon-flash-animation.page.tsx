import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import dcAssets from "@dchighs/dc-assets"
import { useForm } from "react-hook-form"
import { useState, type FC } from "react"
import { toast } from "sonner"

import {
    dragonFlashAnimationDownloaderFormSchema,
    type DragonFlashAnimationDownloaderFormValues,
} from "@/schemas/dragon-flash-animation-downloader-form.schema"

import { DragonFlashAnimationPreview } from "./components/dragon-flash-animation-preview"
import { DragonFlashAnimationForm } from "./components/dragon-flash-animation-form"

const DragonFlashAnimationPage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const form = useForm<DragonFlashAnimationDownloaderFormValues>({
        resolver: zodResolver(dragonFlashAnimationDownloaderFormSchema) as any,
        defaultValues: {
            imageName: "1000_dragon_nature",
            phase: DragonPhase.Baby.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.animations.flash(currentData as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (data: DragonFlashAnimationDownloaderFormValues) => {
        const currentDownloader = dcAssets.dragons.animations.flash(data as any)
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
            <DragonFlashAnimationForm
                form={form}
                onSubmit={onSubmit}
                isDownloading={isDownloading}
                handleCopyUrl={handleCopyUrl}
            />
            <DragonFlashAnimationPreview downloadUrl={downloadUrl} />
        </div>
    )
}

export default DragonFlashAnimationPage
