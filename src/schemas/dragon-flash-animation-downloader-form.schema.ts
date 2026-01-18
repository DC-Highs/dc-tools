import type { DragonFlashAnimationDownloaderOptions } from "@dchighs/dc-assets"
import { DragonPhase, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { regexHelper } from "@/helpers/regex.helper"

export const dragonFlashAnimationDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.dragonImageName),
    phase: z.enum(Object.values(DragonPhase).map((v) => v.toString()) as [string, ...string[]]),
    skin: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().regex(regexHelper.dragonSkin).optional(),
    ),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
} satisfies Record<keyof DragonFlashAnimationDownloaderOptions, any>)

export type DragonFlashAnimationDownloaderFormValues = Omit<
    z.infer<typeof dragonFlashAnimationDownloaderFormSchema>,
    "skin"
> & {
    skin?: string
}
