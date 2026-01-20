import { StaticFileUrlPlatformPrefix, DragonStaticFileUrlParser, DragonPhase } from "@dchighs/dc-core"
import { LuCopy, LuRegex } from "react-icons/lu"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const DragonFlashAnimationUrlParserPage: FC = () => {
    const [url, setUrl] = useState<string>(
        "https://dci-static-s1.socialpointgames.com/static/dragoncity/assets/sprites/1000_dragon_nature_1.swf",
    )
    const [parsedData, setParsedData] = useState<{
        platformPrefix: StaticFileUrlPlatformPrefix | null
        id: number | null
        imageName: string | null
        phase: DragonPhase | null
        skin: string | null
    } | null>(null)

    const handleParseUrl = () => {
        const data = DragonStaticFileUrlParser.parseFromFlashAnimation(url)
        setParsedData(data)
    }

    const handleCopyImageName = async () => {
        if (!parsedData?.imageName) {
            toast.error("No image name to copy")
            return
        }

        await navigator.clipboard.writeText(parsedData.imageName)

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

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>Dragon Flash Animation URL Parser</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <Label>Image URL</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="e.g. https://dci-static-s1.socialpointgames.com/static/dragoncity/assets/sprites/1000_dragon_nature_1.swf"
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
                                    <Typography.Muted className="text-sm">{parsedData.imageName}</Typography.Muted>
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
                        </div>
                    ) : (
                        <Typography.P className="text-center">Parse a URL to see the result</Typography.P>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DragonFlashAnimationUrlParserPage
