import type { Control, FieldValues, Path } from "react-hook-form"
import { Controller } from "react-hook-form"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

export interface SelectOption {
    label: string
    value: string
    disableDefaultPrefix?: boolean
}

export interface FormSelectFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    options?: SelectOption[]
    groupLabel?: string
    /**
     * Optional map/object to convert to options.
     * Useful for enums or objects where key is label/value or similar.
     * This is a flexible prop to handle your existing `Object.entries` patterns.
     */
    entries?: [string, any][]
    /**
     * Function to transform an entry into a value.
     */
    getValue?: (entry: [string, any]) => string
    /**
     * Function to transform an entry into a label.
     */
    getLabel?: (entry: [string, any]) => string
    /**
     * Filter function for entries.
     */
    filter?: (entry: [string, any]) => boolean
}

export const FormSelectField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    options,
    entries,
    getValue,
    getLabel,
    filter,
    groupLabel,
}: FormSelectFieldProps<T>) => {
    // Helper to generate options if not provided directly
    const localOptions: SelectOption[] = options || []

    if (!options && entries) {
        let processedEntries = entries
        if (filter) {
            processedEntries = processedEntries.filter(filter)
        }

        processedEntries.forEach((entry) => {
            localOptions.push({
                label: getLabel ? getLabel(entry) : entry[0],
                value: getValue ? getValue(entry) : String(entry[1]),
            })
        })
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{label}</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
                                {localOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    )
}
