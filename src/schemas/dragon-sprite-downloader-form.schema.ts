import { DragonPhase, DragonSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { emptyKey } from "@/helpers/constants.helper"
import { regexHelper } from "@/helpers/regex.helper"

export const dragonSpriteDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.dragonImageName),
    phase: z.enum(Object.values(DragonPhase).map((v) => v.toString()) as [string, ...string[]]),
    skin: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().regex(regexHelper.dragonSkin).optional(),
    ),
    imageQuality: z.preprocess((value) => (value === emptyKey ? "" : value), z.enum(DragonSpriteQuality)),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
})

export type DragonSpriteDownloaderFormValues = Omit<
    z.infer<typeof dragonSpriteDownloaderFormSchema>,
    "imageQuality" | "skin"
> & {
    skin?: string
    imageQuality: string
}
