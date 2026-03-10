import { StaticFileUrlPlatformPrefix, DragonStaticFileUrlParser, DragonPhase } from "@dchighs/dc-core"
import { LuCopy, LuRegex } from "react-icons/lu"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DragonSpineAnimationUrlParserPage: FC = () => {
    const [url, setUrl] = useState<string>(
        "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/engine/version_1_1/dragons/1000_dragon_nature_1/1000_dragon_nature_1_HD_tweened_dxt5.zip",
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
                    <CardTitle>Dragon Spine Animation URL Parser</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>
                                <Typography.Small>Image URL</Typography.Small>
                            </FieldLabel>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={url}
                                    onChange={(event) => setUrl(event.target.value)}
                                    placeholder="e.g. https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/engine/version_1_1/dragons/1000_dragon_nature_1/1000_dragon_nature_1_HD_tweened_dxt5.zip"
                                />
                            </div>
                        </Field>
                    </FieldGroup>
                    <Button onClick={handleParseUrl} className="mt-6">
                        <LuRegex /> <Typography.Small>Parse URL</Typography.Small>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Typography.H3>Parsing result</Typography.H3>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {parsedData ? (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
                            <div className="space-y-4">
                                <FieldLabel>
                                    <Typography.Small>Platform Prefix</Typography.Small>
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">
                                        {parsedData.platformPrefix ? (
                                            <>
                                                {parsedData.platformPrefix} (
                                                {
                                                    Object.entries(StaticFileUrlPlatformPrefix).find(
                                                        ([currentName, currentValue]) =>
                                                            currentName !== "Default" &&
                                                            currentValue === parsedData.platformPrefix,
                                                    )?.[0]
                                                }
                                                )
                                            </>
                                        ) : (
                                            <Typography.P className="text-red-500">-</Typography.P>
                                        )}
                                    </Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyPlatformPrefix}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FieldLabel>
                                    <Typography.Small>Dragon ID</Typography.Small>
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">{parsedData.id}</Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyDragonId}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FieldLabel>
                                    <Typography.Small>Image Name</Typography.Small>
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">{parsedData.imageName}</Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyImageName}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FieldLabel>
                                    <Typography.Small>Phase</Typography.Small>
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">
                                        {parsedData.phase !== null ? (
                                            <>
                                                {parsedData.phase} (
                                                {
                                                    Object.entries(DragonPhase).find(
                                                        ([_currentName, currentValue]) =>
                                                            currentValue === parsedData.phase,
                                                    )?.[0]
                                                }
                                                )
                                            </>
                                        ) : (
                                            <Typography.Small>-</Typography.Small>
                                        )}
                                    </Typography.Muted>
                                    <Button size="xs" variant="ghost" onClick={handleCopyPhase}>
                                        <LuCopy />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <FieldLabel>
                                    <Typography.Small>Skin</Typography.Small>
                                </FieldLabel>
                                <div className="flex items-center gap-2">
                                    <Typography.Muted className="text-sm">
                                        {parsedData.skin !== null ? (
                                            parsedData.skin
                                        ) : (
                                            <Typography.P className="text-red-500">-</Typography.P>
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

export default DragonSpineAnimationUrlParserPage
