import { ConfigFilter, ConfigPlatform } from "@dchighs/dc-config"
import { Controller, type UseFormReturn } from "react-hook-form"
import { LuCopy, LuDatabase, LuDownload } from "react-icons/lu"
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
import { ConfigLanguageSelect } from "@/components/common/config-language-select"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { type FetchConfigFormValues } from "@/schemas/fetch-config-form.schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

interface ConfigFetcherFormProps {
    form: UseFormReturn<FetchConfigFormValues>
    onSubmit: (data: FetchConfigFormValues) => void
    isFetching: boolean
    hasData: boolean
    handleCopyData: () => void
    handleSaveData: () => void
}

export const ConfigFetcherForm: FC<ConfigFetcherFormProps> = ({
    form,
    onSubmit,
    isFetching,
    hasData,
    handleCopyData,
    handleSaveData,
}) => {
    return (
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
                        <ConfigLanguageSelect
                            name="language"
                            control={form.control}
                            label="Language"
                            placeholder="Select a language"
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
                            disabled={!hasData || isFetching}
                            type="button"
                            onClick={handleCopyData}
                        >
                            <LuCopy />
                            Copy data
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!hasData || isFetching}
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
    )
}
