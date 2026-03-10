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
import { type FetchLocalizationFormValues } from "@/schemas/fetch-localization-form.schema"
import { ConfigLanguageSelect } from "@/components/common/config-language-select"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

interface LocalizationFetcherFormProps {
    form: UseFormReturn<FetchLocalizationFormValues>
    onSubmit: (data: FetchLocalizationFormValues) => void
    isFetching: boolean
    hasData: boolean
    handleCopyUrl: () => void
    handleCopyData: () => void
    handleSaveData: () => void
}

export const LocalizationFetcherForm: FC<LocalizationFetcherFormProps> = ({
    form,
    onSubmit,
    isFetching,
    hasData,
    handleCopyUrl,
    handleCopyData,
    handleSaveData,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Localization Fetcher</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="grid grid-cols-2">
                        <ConfigLanguageSelect
                            name="language"
                            control={form.control}
                            label="Language"
                            placeholder="Select a language"
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
