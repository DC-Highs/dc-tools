import { BuildingSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import dcAssets from "@dchighs/dc-assets"
import { useState, type FC } from "react"
import { toast } from "sonner"

import {
    decorationSpriteDownloaderFormSchema,
    type DecorationSpriteDownloaderFormValues,
} from "@/schemas/decoration-sprite-downloader-form.schema"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadFormActions } from "@/components/composition/download-form-actions"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { useMagicDownload } from "@/hooks/use-magic-download"
import { Typography } from "@/components/ui/typography"
import { emptyKey } from "@/helpers/constants.helper"
import { cleanFormData } from "@/helpers/form.helper"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

const DecorationSpritePage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)
    const { isMagicDownloading, handleMagicDownload } = useMagicDownload()

    const form = useForm({
        resolver: zodResolver(decorationSpriteDownloaderFormSchema),
        defaultValues: {
            imageName: "1_decoration_fountain_youth_01",
            imageQuality: emptyKey,
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.decorations.sprite(cleanFormData(currentData) as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (data: DecorationSpriteDownloaderFormValues) => {
        const currentDownloader = dcAssets.decorations.sprite(cleanFormData(data) as any)
        const downloadUrl = currentDownloader.url

        setIsDownloading(true)

        const downloadToastId = toast.loading("Downloading file...")

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
                    <CardTitle>Decoration Sprite Downloader</CardTitle>
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
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="imageName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Image Name</FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g. 1_decoration_fountain_youth_01"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="imageQuality"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Sprite Quality</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value as string}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a sprite quality" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Sprite qualities</SelectLabel>
                                                    {Object.entries(BuildingSpriteQuality)
                                                        .filter(([key]) => key !== "Default")
                                                        .map(([name, quality]) => (
                                                            <SelectItem
                                                                key={`quality-${quality.toString()}`}
                                                                value={quality.toString() || emptyKey}
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
                        </FieldGroup>
                        <DownloadFormActions
                            isDownloading={isDownloading}
                            onCopyUrl={handleCopyUrl}
                            onMagicDownload={() => handleMagicDownload(downloadUrl)}
                            isMagicDownloading={isMagicDownloading}
                        />
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 p-6">
                        <img src={downloadUrl} alt="Preview" />
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

export default DecorationSpritePage
