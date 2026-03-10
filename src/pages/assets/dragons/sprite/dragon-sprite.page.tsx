import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import dcAssets from "@dchighs/dc-assets"
import { useForm } from "react-hook-form"
import { useState, type FC } from "react"
import { toast } from "sonner"

import {
    dragonSpriteDownloaderFormSchema,
    type DragonSpriteDownloaderFormValues,
} from "@/schemas/dragon-sprite-downloader-form.schema"
import { DragonSpritePreview } from "./components/dragon-sprite-preview"
import { DragonSpriteForm } from "./components/dragon-sprite-form"
import { useMagicDownload } from "@/hooks/use-magic-download"
import { emptyKey } from "@/helpers/constants.helper"
import { cleanFormData } from "@/helpers/form.helper"

const DragonSpritePage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)
    const { isMagicDownloading, handleMagicDownload } = useMagicDownload()

    const form = useForm<DragonSpriteDownloaderFormValues>({
        resolver: zodResolver(dragonSpriteDownloaderFormSchema) as any,
        defaultValues: {
            imageName: "1000_dragon_nature",
            imageQuality: emptyKey,
            phase: DragonPhase.Adult.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.sprite(cleanFormData(currentData) as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (formData: DragonSpriteDownloaderFormValues) => {
        const downloader = dcAssets.dragons.sprite(cleanFormData(formData) as any)
        const urlForDownload = downloader.url

        setIsDownloading(true)

        const downloadToastId = toast.loading("Downloading file...")

        try {
            const result = await window.electronAPI.downloadFile(urlForDownload)

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
            <DragonSpriteForm
                form={form}
                onSubmit={onSubmit}
                isDownloading={isDownloading}
                isMagicDownloading={isMagicDownloading}
                handleCopyUrl={handleCopyUrl}
                handleMagicDownload={handleMagicDownload}
                downloadUrl={downloadUrl}
            />
            <DragonSpritePreview downloadUrl={downloadUrl} />
        </div>
    )
}

export default DragonSpritePage
