import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { Controller, type UseFormReturn } from "react-hook-form"
import { type FC } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type DragonThumbnailDownloaderFormValues } from "@/schemas/dragon-thumbnail-downloader-form.schema"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { DownloadFormActions } from "@/components/common/download-form-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface DragonThumbnailFormProps {
    form: UseFormReturn<DragonThumbnailDownloaderFormValues>
    onSubmit: (data: DragonThumbnailDownloaderFormValues) => void
    isDownloading: boolean
    isMagicDownloading: boolean
    handleCopyUrl: () => void
    handleMagicDownload: (url: string) => void
    downloadUrl: string
}

export const DragonThumbnailForm: FC<DragonThumbnailFormProps> = ({
    form,
    onSubmit,
    isDownloading,
    isMagicDownloading,
    handleCopyUrl,
    handleMagicDownload,
    downloadUrl,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dragon Thumbnail Downloader</CardTitle>
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
                                    <Select onValueChange={field.onChange} value={field.value as string}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a dragon phase" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Dragon phases</SelectLabel>
                                                {Object.entries(DragonPhase)
                                                    .filter(([name]) => name !== "Default")
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
    )
}
