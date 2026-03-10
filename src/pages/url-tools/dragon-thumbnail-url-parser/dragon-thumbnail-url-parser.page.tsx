import { StaticFileUrlPlatformPrefix, DragonStaticFileUrlParser, DragonPhase } from "@dchighs/dc-core"
import { LuCopy, LuRegex } from "react-icons/lu"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const DragonThumbnailUrlParserPage: FC = () => {
    const [url, setUrl] = useState<string>(
        "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/HD/thumb_1815_dragon_tailwind_3.png",
    )
    const [parsedData, setParsedData] = useState<{
        platformPrefix: StaticFileUrlPlatformPrefix | null
        id: number | null
        image_name: string | null
        phase: DragonPhase | null
        skin: string | null
    } | null>(null)

    const handleParseUrl = () => {
        const data = DragonStaticFileUrlParser.parseFromThumbnail(url)
        setParsedData(data)
    }

    const handleCopyImageName = async () => {
        if (!parsedData?.image_name) {
            toast.error("No image name to copy")
            return
        }

        await navigator.clipboard.writeText(parsedData.image_name)

        toast.success("Image name copied to clipboard")
    }

    const handleCopyDragonId = async () => {
        if (!parsedData?.id) {
            toast.error("No dragon ID to copy")
            return
        }

        await navigator.clipboard.writeText(parsedData.id.toString())

        toast.success("Dragon ID copied to clipboard")
    }

    const handleCopyPlatformPrefix = async () => {
        if (!parsedData?.platformPrefix) {
            toast.error("No platform prefix to copy")
            return
        }

        await navigator.clipboard.writeText(parsedData.platformPrefix)

        toast.success("Platform prefix copied to clipboard")
    }

    const handleCopyPhase = async () => {
        if (!parsedData?.phase) {
            toast.error("No phase to copy")
            return
        }

        await navigator.clipboard.writeText(parsedData.phase.toString())

        toast.success("Phase copied to clipboard")
    }

    const handleCopySkin = async () => {
        if (!parsedData?.skin) {
            toast.error("No skin to copy")
            return
        }

        await navigator.clipboard.writeText(parsedData.skin)

        toast.success("Skin copied to clipboard")
    }

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>Dragon Thumbnail URL Parser</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <Label>Image URL</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="e.g. https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/HD/thumb_1815_dragon_tailwind_3.png"
                            />
                        </div>
                    </div>
                    <Button onClick={handleParseUrl} className="mt-6">
                        <LuRegex /> Parse URL
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Parsing result</CardTitle>
                </CardHeader>
                <CardContent>
                    {parsedData ? (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
                            <div className="space-y-4">
                                <Label>Platform Prefix</Label>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">
                                        {parsedData.platformPrefix ? (
                                            <>
                                                {parsedData.platformPrefix} (
                                                {
                                                    Object.entries(StaticFileUrlPlatformPrefix).find(
                                                        ([key, value]) =>
                                                            key !== "Default" && value === parsedData.platformPrefix,
                                                    )?.[0]
                                                }
                                                )
                                            </>
                                        ) : (
                                            <span className="text-red-500">-</span>
                                        )}
                                    </Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyPlatformPrefix}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Dragon ID</Label>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">{parsedData.id}</Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyDragonId}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Image Name</Label>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">{parsedData.image_name}</Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyImageName}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Phase</Label>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">
                                        {parsedData.phase !== null ? (
                                            <>
                                                {parsedData.phase} (
                                                {
                                                    Object.entries(DragonPhase).find(
                                                        ([_, value]) => value === parsedData.phase,
                                                    )?.[0]
                                                }
                                                )
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyPhase}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Skin</Label>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">
                                        {parsedData.skin !== null ? (
                                            parsedData.skin
                                        ) : (
                                            <span className="text-red-500">-</span>
                                        )}
                                    </Typography.Muted>
                                    <Button
                                        size="xs"
                                        disabled={!parsedData.skin}
                                        variant="ghost"
                                        onClick={handleCopySkin}
                                    >
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Typography.P className="text-center">Parse a URL to see the result</Typography.P>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DragonThumbnailUrlParserPage
