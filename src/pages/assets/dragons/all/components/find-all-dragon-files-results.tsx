import { LuCopy, LuDownload } from "react-icons/lu"
import { type FC } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type DragonStaticFile } from "@/utils/find-dragon-static-files.util"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

interface FindAllDragonFilesResultsProps {
    files: DragonStaticFile[]
    handleCopy: (url: string) => void
    handleDownload: (url: string) => void
    isDownloading: boolean
    downloadingUrl: string | null
}

export const FindAllDragonFilesResults: FC<FindAllDragonFilesResultsProps> = ({
    files,
    handleCopy,
    handleDownload,
    isDownloading,
    downloadingUrl,
}) => {
    return (
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
                                    <TableCell className="space-x-2">
                                        <Button variant="secondary" onClick={() => handleCopy(file.value)}>
                                            <LuCopy />
                                        </Button>
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
    )
}
