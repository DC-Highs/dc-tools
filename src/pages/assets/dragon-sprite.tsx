import { DragonPhase, DragonSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
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
import {
    dragonSpriteDownloaderFormSchema,
    type DragonSpriteDownloaderFormValues,
} from "@/schemas/dragon-sprite-downloader-form.schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { emptyKey } from "@/helpers/constants.helper"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DragonSpritePage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const form = useForm({
        resolver: zodResolver(dragonSpriteDownloaderFormSchema),
        defaultValues: {
            imageName: "1000_dragon_nature",
            imageQuality: emptyKey,
            phase: DragonPhase.Baby.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.sprite(currentData as any)
    const downloadUrl = currentDownloader.url.replace(emptyKey, "")

    const onSubmit = async (data: DragonSpriteDownloaderFormValues) => {
        const currentDownloader = dcAssets.dragons.sprite(data as any)
        const downloadUrl = currentDownloader.url.replace(emptyKey, "")

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
                                        <FieldLabel>Dragon Phase</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a dragon phase" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Phases</SelectLabel>
                                                    {Object.entries(DragonPhase)
                                                        .filter(([key]) => isNaN(Number(key)))
                                                        .map(([name, phase]) => (
                                                            <SelectItem
                                                                key={`phase-${phase.toString()}`}
                                                                value={phase.toString()}
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
                                                    {Object.entries(DragonSpriteQuality)
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
                            <Controller
                                name="skin"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Skin Key</FieldLabel>
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

export default DragonSpritePage
