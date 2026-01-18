import type { DragonSpineAnimationDownloaderOptions } from "@dchighs/dc-assets"
import { DragonPhase, StaticFileUrlPlatformPrefix, TextureCompressionFormat } from "@dchighs/dc-core"

import { z } from "zod"

import { regexHelper } from "@/helpers/regex.helper"

export const dragonSpineAnimationDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.dragonImageName),
    phase: z.enum(Object.values(DragonPhase).map((v) => v.toString()) as [string, ...string[]]),
    skin: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().regex(regexHelper.dragonSkin).optional(),
    ),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
    textureCompressionFormat: z.enum(TextureCompressionFormat),
    useNewUrlFormat: z.boolean().default(false),
} satisfies Record<keyof DragonSpineAnimationDownloaderOptions, any>)

export type DragonSpineAnimationDownloaderFormValues = Omit<
    z.infer<typeof dragonSpineAnimationDownloaderFormSchema>,
    "skin"
> & {
    skin?: string
}
