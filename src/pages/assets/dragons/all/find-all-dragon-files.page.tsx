import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { type DragonStaticFile, findDragonStaticFileUrls } from "@/utils/find-dragon-static-files.util"
import { FindAllDragonFilesResults } from "./components/find-all-dragon-files-results"
import { FindAllDragonFilesForm } from "./components/find-all-dragon-files-form"

const FindAllDragonFilesPage: FC = () => {
    const [platformPrefix, setPlatformPrefix] = useState<StaticFileUrlPlatformPrefix>(StaticFileUrlPlatformPrefix.iOS)
    const [imageName, setImageName] = useState("1000_dragon_nature")
    const [files, setFiles] = useState<DragonStaticFile[]>([])
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        setLoading(true)

        const loadingToastId = toast.loading("Searching for files...")

        try {
            const staticFileUrls = await findDragonStaticFileUrls(imageName, platformPrefix)

            toast.success(`${staticFileUrls.length} files found!`)

            setFiles(staticFileUrls)
        } catch (error) {
            console.error(error)
            toast.error("Failed to search for files!")
        } finally {
            setLoading(false)
            toast.dismiss(loadingToastId)
        }
    }

    const handleDownload = async (url: string) => {
        try {
            const loadingToastId = toast.loading("Downloading file...")

            setIsDownloading(true)
            setDownloadingUrl(url)

            const filePath = await window.electronAPI.downloadFile(url)

            toast.dismiss(loadingToastId)

            if (!filePath) {
                toast.warning("Cancelled download!")
                return
            }

            toast.success("File downloaded!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to download file!")
        } finally {
            setIsDownloading(false)
            setDownloadingUrl(null)
        }
    }

    const handleCopy = async (url: string) => {
        await navigator.clipboard.writeText(url)
        toast.success("URL copied to clipboard!")
    }

    return (
        <div className="space-y-2">
            <FindAllDragonFilesForm
                imageName={imageName}
                setImageName={setImageName}
                platformPrefix={platformPrefix}
                setPlatformPrefix={setPlatformPrefix}
                handleSearch={handleSearch}
                loading={loading}
            />
            <FindAllDragonFilesResults
                files={files}
                handleCopy={handleCopy}
                handleDownload={handleDownload}
                isDownloading={isDownloading}
                downloadingUrl={downloadingUrl}
            />
        </div>
    )
}

export default FindAllDragonFilesPage
