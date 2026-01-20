import { type FetchOptions, ConfigPlatform, ConfigLanguage, ConfigFilter } from "@dchighs/dc-config"

import { z } from "zod"

export const fetchConfigFormSchema = z.object({
    authToken: z.string(),
    platform: z.enum(ConfigPlatform),
    language: z.enum(ConfigLanguage),
    filter: z.array(z.enum(ConfigFilter)).optional(),
    userId: z.string(),
    url: z.string(),
} satisfies Record<keyof FetchOptions, any>)

export type FetchConfigFormValues = z.infer<typeof fetchConfigFormSchema>
