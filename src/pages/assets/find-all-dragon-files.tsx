import { LuDownload, LuSearch } from "react-icons/lu"
import { useState, type FC } from "react"

import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { toast } from "sonner"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type DragonStaticFile, findDragonStaticFileUrls } from "@/utils/find-dragon-static-files.util"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"

const FindAllDragonFilesPage: FC = () => {
    const [platformPrefix, setPlatformPrefix] = useState<StaticFileUrlPlatformPrefix>(StaticFileUrlPlatformPrefix.iOS)
    const [imageName, setImageName] = useState("1000_dragon_nature")
    const [files, setFiles] = useState<DragonStaticFile[]>([])
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        try {
            const loadingToastId = toast.loading("Searching for files...")

            setLoading(true)

            const staticFileUrls = await findDragonStaticFileUrls(imageName, platformPrefix)

            toast.dismiss(loadingToastId)
            toast.success(`${staticFileUrls.length} files found!`)

            setFiles(staticFileUrls)
        } catch (error) {
            console.error(error)
            toast.error("Failed to search for files!")
        } finally {
            setLoading(false)
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

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>All Dragon Files Finder</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-4">
                            <Label>Image Name</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={imageName}
                                    onChange={(e) => setImageName(e.target.value)}
                                    placeholder="e.g. 1000_dragon_nature"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <Label>Platform Prefix</Label>
                            <div className="flex items-center gap-2">
                                <Select
                                    onValueChange={(value) => setPlatformPrefix(value as StaticFileUrlPlatformPrefix)}
                                    value={platformPrefix.toString()}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a platform prefix" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Platform prefixes</SelectLabel>
                                            {Object.entries(StaticFileUrlPlatformPrefix)
                                                .filter(([name]) => name !== "Default")
                                                .map(([name, prefix]) => (
                                                    <SelectItem
                                                        key={`prefix-${prefix.toString()}`}
                                                        value={prefix.toString()}
                                                    >
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleSearch} disabled={loading} className="mt-6">
                        {loading ? (
                            <>
                                <Spinner /> Searching...
                            </>
                        ) : (
                            <>
                                <LuSearch /> Search all files
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Files {files.length > 0 ? `(${files.length})` : ""}</CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Label</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map((file, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{file.label}</TableCell>
                                        <TableCell>
                                            <Link href={file.value} target="_blank" rel="noopener noreferrer">
                                                {file.value.slice(0, 75)}...
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleDownload(file.value)} disabled={isDownloading}>
                                                {isDownloading && downloadingUrl === file.value ? (
                                                    <>
                                                        <Spinner /> Downloading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <LuDownload />
                                                        Download
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography.P className="text-center">No files to display.</Typography.P>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default FindAllDragonFilesPage
