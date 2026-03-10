import { DragonPhase, DragonSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import dcAssets from "@dchighs/dc-assets"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { useMagicDownload } from "@/hooks/use-magic-download"

import { DownloadFormActions } from "@/components/composition/download-form-actions"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    dragonSpriteDownloaderFormSchema,
    type DragonSpriteDownloaderFormValues,
} from "@/schemas/dragon-sprite-downloader-form.schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { emptyKey } from "@/helpers/constants.helper"
import { cleanFormData } from "@/helpers/form.helper"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

const DragonSpritePage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)
    const { isMagicDownloading, handleMagicDownload } = useMagicDownload()

    const form = useForm({
        resolver: zodResolver(dragonSpriteDownloaderFormSchema),
        defaultValues: {
            imageName: "1000_dragon_nature",
            imageQuality: emptyKey,
            phase: DragonPhase.Adult.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.sprite(cleanFormData(currentData) as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (formData: DragonSpriteDownloaderFormValues) => {
        const downloader = dcAssets.dragons.sprite(cleanFormData(formData) as any)
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
                    <CardTitle>Dragon Sprite Downloader</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="grid grid-cols-2">
                            <Controller
                                name="platformPrefix"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            <Typography.Small>Platform Prefix</Typography.Small>
                                        </FieldLabel>
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
                                                                <Typography.Small>{platformName}</Typography.Small>
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
                                        <FieldLabel>
                                            <Typography.Small>Image Name</Typography.Small>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g. 1000_dragon_nature"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phase"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            <Typography.Small>Dragon Phase</Typography.Small>
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value as string}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a dragon phase" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        <Typography.Small>Dragon phases</Typography.Small>
                                                    </SelectLabel>
                                                    {Object.entries(DragonPhase)
                                                        .filter(([phaseName]) => phaseName !== "Default")
                                                        .map(([phaseName, phaseValue]) => (
                                                            <SelectItem
                                                                key={`phase-${phaseValue.toString()}`}
                                                                value={phaseValue.toString()}
                                                            >
                                                                <Typography.Small>{phaseName}</Typography.Small>
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
                                name="imageQuality"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            <Typography.Small>Sprite Quality</Typography.Small>
                                        </FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value as string}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a sprite quality" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        <Typography.Small>Sprite qualities</Typography.Small>
                                                    </SelectLabel>
                                                    {Object.entries(DragonSpriteQuality)
                                                        .filter(([qualityName]) => qualityName !== "Default")
                                                        .map(([qualityName, qualityValue]) => (
                                                            <SelectItem
                                                                key={`quality-${qualityValue.toString()}`}
                                                                value={qualityValue.toString() || emptyKey}
                                                            >
                                                                <Typography.Small>{qualityName}</Typography.Small>
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
                                name="skin"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            <Typography.Small>Skin Key</Typography.Small>
                                        </FieldLabel>
                                        <Input
                                            {...(field as any)}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g. _skin1"
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
                    <CardTitle>
                        <Typography.H4>Preview</Typography.H4>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 p-6">
                        <img src={downloadUrl} alt="Preview" />
                    </div>
                </CardContent>
                <Separator />
                <CardFooter className="font-mono">
                    <Typography.Small>
                        <b>File URL:</b> <Typography.Code>{downloadUrl}</Typography.Code>
                    </Typography.Small>
                </CardFooter>
            </Card>
        </div>
    )
}

export default DragonSpritePage
