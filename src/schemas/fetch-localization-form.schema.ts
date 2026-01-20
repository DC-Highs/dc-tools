import { ConfigLanguage } from "@dchighs/dc-config"

import { z } from "zod"

export const fetchLocalizationFormSchema = z.object({
    language: z.enum(ConfigLanguage),
    parseMode: z.enum(["array", "object"]),
})

export type FetchLocalizationFormValues = z.infer<typeof fetchLocalizationFormSchema>
