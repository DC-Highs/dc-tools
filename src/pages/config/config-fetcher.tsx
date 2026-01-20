import { ConfigFilter, ConfigLanguage, ConfigPlatform, type GameConfigDto } from "@dchighs/dc-config"
import { LuCopy, LuDatabase, LuDownload } from "react-icons/lu"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import { fetchConfigFormSchema, type FetchConfigFormValues } from "@/schemas/fetch-config-form.schema"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

const ConfigFetcherPage: FC = () => {
    const [data, setData] = useState<GameConfigDto | null>(null)
    const [isFetching, setIsFetching] = useState(false)

    const form = useForm({
        resolver: zodResolver(fetchConfigFormSchema),
        defaultValues: {
            authToken: "",
            filter: [],
            language: ConfigLanguage.English,
            platform: ConfigPlatform.iOS,
            url: "",
            userId: "",
        },
    })

    const onSubmit = async (data: FetchConfigFormValues) => {
        setIsFetching(true)

        const fetchingToastId = toast.loading("Fetching config...")

        try {
            const configData = await window.electronAPI.fetchConfig({
                authToken: data.authToken,
                userId: data.userId,
                language: data.language,
                platform: data.platform,
                url: data.url,
                filter: data.filter?.length === 0 ? undefined : data.filter,
            })

            toast.success("Config fetched successfully")
            setData(configData)
        } catch (error) {
            console.error("Error fetching config:", error)
            toast.error("Failed to fetch config")
        } finally {
            toast.dismiss(fetchingToastId)
            setIsFetching(false)
        }
    }

    const handleSaveData = async () => {
        if (!data) {
            toast.error("No data to save")
            return
        }

        const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "config.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopyData = async () => {
        if (!data) {
            toast.error("No data to copy")
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(data))
        toast.success("Data copied to clipboard")
    }

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>Config Fetcher</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="grid grid-cols-2">
                            <Controller
                                name="platform"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Platform</FieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Platforms</SelectLabel>
                                                    {Object.entries(ConfigPlatform)
                                                        .filter(([name]) => name !== "Default")
                                                        .map(([name, prefix]) => (
                                                            <SelectItem
                                                                key={`platform-${prefix.toString()}`}
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
                                name="filter"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Filters</FieldLabel>
                                        <MultiSelect
                                            options={Object.entries(ConfigFilter)
                                                .filter(([name]) => name !== "Default")
                                                .map(([name, prefix]) => ({
                                                    label: name.split(/(?=[A-Z])/).join(" "),
                                                    value: prefix.toString(),
                                                }))}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="Select filters"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="url"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>URL</FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            placeholder="e.g. https://api.example.com"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="authToken"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Auth token</FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            placeholder="e.g. fJhrILfYHSWOKgfQJdWhEQbkDQNhhGlL"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="userId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>User ID</FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            placeholder="e.g. 572216514421573"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <div className="mt-6 space-x-2">
                            <Button
                                variant="secondary"
                                disabled={!data || isFetching}
                                type="button"
                                onClick={handleCopyData}
                            >
                                <LuCopy />
                                Copy data
                            </Button>
                            <Button
                                variant="outline"
                                disabled={!data || isFetching}
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
                    {data ? (
                        <Typography.Code>{JSON.stringify(data).slice(0, 1000) + "...}"}</Typography.Code>
                    ) : (
                        <Typography.P className="text-center">No data</Typography.P>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ConfigFetcherPage
