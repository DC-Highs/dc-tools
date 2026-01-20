import { Localization } from "@dchighs/dc-localization"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMemo, useState, type FC } from "react"
import { ConfigLanguage } from "@dchighs/dc-core"
import { toast } from "sonner"

import { LuCopy, LuDatabase, LuDownload } from "react-icons/lu"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchLocalizationFormSchema, type FetchLocalizationFormValues } from "@/schemas/fetch-localization-form.schema"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

const LocalizationFetcherPage: FC = () => {
    const [localization, setLocalization] = useState<Localization | null>(null)
    const [isFetching, setIsFetching] = useState(false)

    const form = useForm({
        resolver: zodResolver(fetchLocalizationFormSchema),
        defaultValues: {
            language: ConfigLanguage.English,
            parseMode: "array" as const,
        },
    })

    const data = useMemo(() => {
        if (!localization) {
            return null
        }

        const currentParseMode = form.getValues("parseMode")

        return currentParseMode === "array" ? localization.toArray() : localization.toObject()
    }, [localization, form.watch("parseMode")])

    const onSubmit = async (data: FetchLocalizationFormValues) => {
        setIsFetching(true)

        const fetchingToastId = toast.loading("Fetching localization...")

        try {
            const createdLocalization = await Localization.create(data.language)

            toast.success("Localization fetched successfully")
            setLocalization(createdLocalization)
        } catch (error) {
            console.error("Error fetching localization:", error)
            toast.error("Failed to fetch localization")
        } finally {
            toast.dismiss(fetchingToastId)
            setIsFetching(false)
        }
    }

    const handleSaveData = async () => {
        if (!localization) {
            toast.error("No data to save")
            return
        }

        const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "localization.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopyData = async () => {
        if (!localization) {
            toast.error("No data to copy")
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(localization.toArray()))
        toast.success("Data copied to clipboard")
    }

    const handleCopyUrl = async () => {
        const language = form.getValues("language")
        const url = Localization.buildUrl(language)
        await navigator.clipboard.writeText(url)
        toast.success("URL copied to clipboard")
    }

    const buildPreview = () => {
        if (!localization) {
            return null
        }

        const currentParseMode = form.getValues("parseMode")

        const data = currentParseMode === "array" ? localization.toArray() : localization.toObject()

        return JSON.stringify(data).slice(0, 1000) + "..." + (currentParseMode === "array" ? "]" : "}")
    }

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>Localization Fetcher</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="grid grid-cols-2">
                            <Controller
                                name="language"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Language</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Languages</SelectLabel>
                                                    {Object.entries(ConfigLanguage)
                                                        .filter(([name]) => name !== "Default")
                                                        .map(([name, prefix]) => (
                                                            <SelectItem
                                                                key={`language-${prefix.toString()}`}
                                                                value={prefix.toString()}
                                                            >
                                                                {name.split(/(?=[A-Z])/).join(" ")}
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
                                name="parseMode"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Parse Mode</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a parse mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Parse Modes</SelectLabel>
                                                    <SelectItem value="array">Array</SelectItem>
                                                    <SelectItem value="object">Object</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <div className="mt-6 space-x-2">
                            <Button variant="secondary" type="button" onClick={handleCopyUrl}>
                                <LuCopy />
                                Copy URL
                            </Button>
                            <Button
                                variant="secondary"
                                disabled={!localization || isFetching}
                                type="button"
                                onClick={handleCopyData}
                            >
                                <LuCopy />
                                Copy data
                            </Button>
                            <Button
                                variant="outline"
                                disabled={!localization || isFetching}
                                type="button"
                                onClick={handleSaveData}
                            >
                                <LuDownload /> Save data
                            </Button>
                            <Button disabled={isFetching} type="submit">
                                {isFetching ? (
                                    <>
                                        <Spinner /> Fetching...
                                    </>
                                ) : (
                                    <>
                                        <LuDatabase /> Fetch data
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    {localization ? (
                        <Typography.Code>{buildPreview()}</Typography.Code>
                    ) : (
                        <Typography.P className="text-center">No data</Typography.P>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default LocalizationFetcherPage
