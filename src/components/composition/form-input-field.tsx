import type { Control, FieldValues, Path } from "react-hook-form"
import { Controller } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface FormInputFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    type?: string
}

export const FormInputField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
}: FormInputFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{label}</FieldLabel>
                    <Input
                        {...field}
                        type={type}
                        aria-invalid={fieldState.invalid}
                        placeholder={placeholder}
                        value={field.value ?? ""}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    )
}
