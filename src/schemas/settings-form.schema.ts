import { EnlargeValue, Noise } from "bigjpg/dist/enums"

import { z } from "zod"

export const settingsFormSchema = z.object({
    bigjpg: z
        .object({
            apiKey: z.string(),
            noise: z.enum(Noise),
            enlarge: z.enum(EnlargeValue),
        })
        .optional(),
    gameConfig: z
        .object({
            url: z.string(),
            authToken: z.string(),
            userId: z.string(),
            language: z.string(),
        })
        .optional(),
    localization: z
        .object({
            language: z.string(),
        })
        .optional(),
    convertio: z
        .object({
            apiKey: z.string(),
        })
        .optional(),
    conversionTool: z.enum(["convertio", "local"]),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
