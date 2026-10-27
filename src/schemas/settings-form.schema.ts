import { z } from "zod"

export const settingsFormSchema = z.object({
    bigjpg: z
        .object({
            noise: z.enum(["-1", "0", "1", "2", "3"]),
            enlarge: z.enum(["1", "2", "3", "4"]),
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
