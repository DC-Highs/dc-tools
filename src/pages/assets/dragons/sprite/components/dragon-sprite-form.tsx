import { DragonPhase, DragonSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
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
import { type DragonSpriteDownloaderFormValues } from "@/schemas/dragon-sprite-downloader-form.schema"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { DownloadFormActions } from "@/components/common/download-form-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { emptyKey } from "@/helpers/constants.helper"
import { Input } from "@/components/ui/input"

interface DragonSpriteFormProps {
    form: UseFormReturn<DragonSpriteDownloaderFormValues>
    onSubmit: (data: DragonSpriteDownloaderFormValues) => void
    isDownloading: boolean
    isMagicDownloading: boolean
    handleCopyUrl: () => void
    handleMagicDownload: (url: string) => void
    downloadUrl: string
}

export const DragonSpriteForm: FC<DragonSpriteFormProps> = ({
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
                                                    .filter(([phaseName]) => isNaN(Number(phaseName)))
                                                    .map(([phaseName, phaseValue]) => (
                                                        <SelectItem
                                                            key={`phase-${phaseValue.toString()}`}
                                                            value={phaseValue.toString()}
                                                        >
                                                            {phaseName}
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
                                                    .filter(([qualityName]) => qualityName !== "Default")
                                                    .map(([qualityName, qualityValue]) => (
                                                        <SelectItem
                                                            key={`quality-${qualityValue.toString()}`}
                                                            value={qualityValue.toString() || emptyKey}
                                                        >
                                                            {qualityName}
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
