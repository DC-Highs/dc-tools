import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { Controller, type UseFormReturn } from "react-hook-form"
import { LuCopy, LuDownload } from "react-icons/lu"
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
import { type DragonFlashAnimationDownloaderFormValues } from "@/schemas/dragon-flash-animation-downloader-form.schema"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DragonFlashAnimationFormProps {
    form: UseFormReturn<DragonFlashAnimationDownloaderFormValues>
    onSubmit: (data: DragonFlashAnimationDownloaderFormValues) => void
    isDownloading: boolean
    handleCopyUrl: () => void
}

export const DragonFlashAnimationForm: FC<DragonFlashAnimationFormProps> = ({
    form,
    onSubmit,
    isDownloading,
    handleCopyUrl,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dragon Flash Animation Downloader</CardTitle>
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
                                                    .filter(([currentName]) => currentName !== "Default")
                                                    .map(([currentName, currentPrefix]) => (
                                                        <SelectItem
                                                            key={`prefix-${currentPrefix.toString()}`}
                                                            value={currentPrefix.toString()}
                                                        >
                                                            <Typography.Small>{currentName}</Typography.Small>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a dragon phase" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    <Typography.Small>Phases</Typography.Small>
                                                </SelectLabel>
                                                {Object.entries(DragonPhase)
                                                    .filter(([currentKey]) => isNaN(Number(currentKey)))
                                                    .map(([currentName, currentPhase]) => (
                                                        <SelectItem
                                                            key={`phase-${currentPhase.toString()}`}
                                                            value={currentPhase.toString()}
                                                        >
                                                            <Typography.Small>{currentName}</Typography.Small>
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
                    <div className="mt-6 space-x-2">
                        <Button variant="secondary" type="button" onClick={handleCopyUrl}>
                            <LuCopy />
                            <Typography.Small>Copy file URL</Typography.Small>
                        </Button>
                        <Button disabled={isDownloading} type="submit">
                            {isDownloading ? (
                                <>
                                    <Spinner /> <Typography.Small>Downloading...</Typography.Small>
                                </>
                            ) : (
                                <>
                                    <LuDownload /> <Typography.Small>Download and save</Typography.Small>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
