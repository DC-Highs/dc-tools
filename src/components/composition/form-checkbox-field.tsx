import type { Control, FieldValues, Path } from "react-hook-form"
import { Controller } from "react-hook-form"

import { Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

interface FormCheckboxFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
}

export const FormCheckboxField = <T extends FieldValues>({ control, name, label }: FormCheckboxFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Field>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...(field as any)} // Spread safe props, but Checkbox expects specific ones
                        />
                        <FieldLabel>{label}</FieldLabel>
                    </div>
                </Field>
            )}
        />
    )
}
