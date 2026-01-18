import { DragonPhase, StaticFileUrlPlatformPrefix, TextureCompressionFormat } from "@dchighs/dc-core"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { LuDownload } from "react-icons/lu"
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
import { dragonSpineAnimationDownloaderFormSchema, type DragonSpineAnimationDownloaderFormValues } from "@/schemas/dragon-spine-animation-downloader-form.schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const DragonSpineAnimationPage: FC = () => {
    const [isDownloading, setIsDownloading] = useState(false)

    const form = useForm({
        resolver: zodResolver(dragonSpineAnimationDownloaderFormSchema),
        defaultValues: {
            imageName: "1000_dragon_nature",
            phase: DragonPhase.Baby.toString(),
            platformPrefix: StaticFileUrlPlatformPrefix.iOS,
            textureCompressionFormat: TextureCompressionFormat.DXT5,
            useNewUrlFormat: true,
        },
        mode: "onChange",
    })

    const currentData = form.watch()
    const currentDownloader = dcAssets.dragons.animations.spine(currentData as any)
    const downloadUrl = currentDownloader.url

    const onSubmit = async (data: DragonSpineAnimationDownloaderFormValues) => {
        const currentDownloader = dcAssets.dragons.animations.spine(data as any)
        const downloadUrl = currentDownloader.url

        try {
            setIsDownloading(true)
            toast.info("Downloading file...")

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
        }
    }

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>Dragon Spine Animation Downloader</CardTitle>
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
                                                        .slice(Object.values(StaticFileUrlPlatformPrefix).length / 2)
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
                                name="textureCompressionFormat"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Texture Compression Format</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a texture compression format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Texture compression formats</SelectLabel>
                                                    {Object.entries(TextureCompressionFormat)
                                                        .slice(Object.values(TextureCompressionFormat).length / 2)
                                                        .map(([name, format]) => (
                                                            <SelectItem
                                                                key={`format-${format.toString()}`}
                                                                value={format.toString()}
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
                                                        .slice(Object.values(DragonPhase).length / 2)
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
                            <Controller
                                name="useNewUrlFormat"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            <FieldLabel>Use New URL Format</FieldLabel>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <br />
                        <Button disabled={isDownloading} type="submit" className="mt-6">
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
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 p-6">
                        {/* <FlashPreview src={downloadUrl} /> */}
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

export default DragonSpineAnimationPage
