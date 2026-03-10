import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import dcAssets from "@dchighs/dc-assets"
import { useState, type FC } from "react"
import { toast } from "sonner"

import {
    buildingThumbnailDownloaderFormSchema,
    type BuildingThumbnailDownloaderFormValues,
} from "@/schemas/building-thumbnail-downloader-form.schema"
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
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { DownloadFormActions } from "@/components/common/download-form-actions"
import { useMagicDownload } from "@/hooks/use-magic-download"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

const BuildingThumbnailPage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)
    const { isMagicDownloading, handleMagicDownload } = useMagicDownload()

    const form = useForm({
        resolver: zodResolver(buildingThumbnailDownloaderFormSchema),
        defaultValues: {
            imageName: "1_building_habitat_earth_01",
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.buildings.thumbnail(currentData as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (formData: BuildingThumbnailDownloaderFormValues) => {
        const downloader = dcAssets.buildings.thumbnail(formData as any)
        const urlForDownload = downloader.url

        setIsDownloading(true)

        const downloadToastId = toast.loading("Downloading file...")

        try {
            const result = await window.electronAPI.downloadFile(urlForDownload)

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
                    <CardTitle>Building Thumbnail Downloader</CardTitle>
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
                                                    <SelectLabel>
                                                        <Typography.Small>Platform prefixes</Typography.Small>
                                                    </SelectLabel>
                                                    {Object.entries(StaticFileUrlPlatformPrefix)
                                                        .filter(([platformName]) => platformName !== "Default")
                                                        .map(([platformName, platformPrefix]) => (
                                                            <SelectItem
                                                                key={`prefix-${platformPrefix.toString()}`}
                                                                value={platformPrefix.toString()}
                                                            >
                                                                {platformName}
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
                                            placeholder="e.g. 1_building_habitat_earth_01"
                                        />
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

export default BuildingThumbnailPage
