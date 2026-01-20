import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { LuCopy, LuDownload } from "react-icons/lu"
import dcAssets from "@dchighs/dc-assets"
import { useState, type FC } from "react"
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
import { musicDownloaderFormSchema, type MusicDownloaderFormValues } from "@/schemas/music-downloader-form.schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MusicPage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const form = useForm({
        resolver: zodResolver(musicDownloaderFormSchema),
        defaultValues: {
            keyName: "531_dc_party_planning_island",
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.sounds.music(currentData as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (data: MusicDownloaderFormValues) => {
        const currentDownloader = dcAssets.sounds.music(data as any)
        const downloadUrl = currentDownloader.url

        setIsDownloading(true)

        const downloadToastId = toast.info("Downloading file...")

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
            <Card>
                <CardHeader>
                    <CardTitle>Music Downloader</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="grid grid-cols-2">
                            <Controller
                                name="platformPrefix"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Platform Prefix</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a platform prefix" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Platform prefixes</SelectLabel>
                                                    {Object.entries(StaticFileUrlPlatformPrefix)
                                                        .filter(([name]) => name !== "Default")
                                                        .map(([name, type]) => (
                                                            <SelectItem
                                                                key={`prefix-${type.toString()}`}
                                                                value={type.toString()}
                                                            >
                                                                {name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="keyName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Key Name</FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g. runner-island-test_d.zip"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <div className="mt-6 space-x-2">
                            <Button variant="secondary" type="button" onClick={handleCopyUrl}>
                                <LuCopy />
                                Copy file URL
                            </Button>
                            <Button disabled={isDownloading} type="submit">
                                {isDownloading ? (
                                    <>
                                        <Spinner /> Downloading...
                                    </>
                                ) : (
                                    <>
                                        <LuDownload /> Download and save
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 p-6">
                        <audio controls>
                            <source src={downloadUrl} type="audio/mpeg" />
                        </audio>
                    </div>
                </CardContent>
                <Separator />
                <CardFooter className="font-mono">
                    <b>File URL:</b> <Typography.Code>{downloadUrl}</Typography.Code>
                </CardFooter>
            </Card>
        </div>
    )
}

export default MusicPage
