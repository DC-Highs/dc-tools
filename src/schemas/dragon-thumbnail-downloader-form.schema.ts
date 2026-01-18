import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { regexHelper } from "@/helpers/regex.helper"

export const dragonThumbnailDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.dragonImageName),
    phase: z.enum(Object.values(DragonPhase).map((v) => v.toString()) as [string, ...string[]]),
    skin: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().regex(regexHelper.dragonSkin).optional(),
    ),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
})

export type DragonThumbnailDownloaderFormValues = z.infer<typeof dragonThumbnailDownloaderFormSchema> & {
    skin?: string
}
