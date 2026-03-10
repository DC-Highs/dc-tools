import { useState } from "react"
import { toast } from "sonner"

export const useMagicDownload = () => {
    const [isMagicDownloading, setIsMagicDownloading] = useState(false)

    const handleMagicDownload = async (downloadUrl: string) => {
        setIsMagicDownloading(true)
        const downloadToastId = toast.loading("Enlarging and downloading file...")
        try {
            const enlargedUrl = await window.electronAPI.bigjpgEnlarge(downloadUrl)
            const originalName = downloadUrl.split("/").pop() || "image.png"
            const largeName = originalName.replace(/\.[^/.]+$/, "") + "-large.png"

            const result = await window.electronAPI.downloadFile(enlargedUrl, largeName)

            if (typeof result === "string") {
                toast.success("File downloaded successfully!")
            } else {
                toast.warning("Download canceled!")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred while handling the file!")
        } finally {
            setIsMagicDownloading(false)
            toast.dismiss(downloadToastId)
        }
    }

    return {
        isMagicDownloading,
        handleMagicDownload,
    }
}
