import { LuCopy, LuDownload, LuWand } from "react-icons/lu"
import type { FC } from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

interface DownloadFormActionsProps {
    isDownloading: boolean
    onCopyUrl: () => void
    copyLabel?: string
    downloadLabel?: string
    downloadingLabel?: string
    onMagicDownload?: () => void
    isMagicDownloading?: boolean
}

export const DownloadFormActions: FC<DownloadFormActionsProps> = ({
    isDownloading,
    onCopyUrl,
    copyLabel = "Copy file URL",
    downloadLabel = "Download and save",
    downloadingLabel = "Downloading...",
    onMagicDownload,
    isMagicDownloading,
}) => {
    return (
        <div className="mt-6 flex gap-2">
            <Button variant="secondary" type="button" onClick={onCopyUrl}>
                <LuCopy className="mr-2 size-4" />
                {copyLabel}
            </Button>
            {onMagicDownload && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={onMagicDownload}
                                disabled={isMagicDownloading || isDownloading}
                            >
                                {isMagicDownloading ? (
                                    <>
                                        <Spinner className="size-4" /> Enlarging...
                                    </>
                                ) : (
                                    <>
                                        <LuWand className="size-4" />
                                        Enlarge and download
                                    </>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Enlarge and download with BigJPG</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            <Button disabled={isDownloading || isMagicDownloading} type="submit">
                {isDownloading ? (
                    <>
                        <Spinner className="mr-2 size-4" /> {downloadingLabel}
                    </>
                ) : (
                    <>
                        <LuDownload className="mr-2 size-4" /> {downloadLabel}
                    </>
                )}
            </Button>
        </div>
    )
}
