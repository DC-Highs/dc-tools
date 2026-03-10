import { ConfigLanguage } from "@dchighs/dc-config"
import type { FieldValues } from "react-hook-form"

import { FormSelectField, type FormSelectFieldProps } from "./form-select-field"

type ConfigLanguageSelectProps<T extends FieldValues> = Omit<
    FormSelectFieldProps<T>,
    "options" | "entries" | "getValue" | "getLabel" | "filter" | "groupLabel"
>

export const ConfigLanguageSelect = <T extends FieldValues>(props: ConfigLanguageSelectProps<T>) => {
    return (
        <FormSelectField
            {...props}
            groupLabel="Languages"
            entries={Object.entries(ConfigLanguage)}
            filter={([name]) => name !== "Default"}
            getValue={([_, prefix]) => prefix.toString()}
            getLabel={([name]) => name.split(/(?=[A-Z])/).join(" ")}
        />
    )
}
