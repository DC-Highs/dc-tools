import { HabitatSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { emptyKey } from "@/helpers/constants.helper"
import { regexHelper } from "@/helpers/regex.helper"

export const habitatSpriteDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.habitatImageName),
    imageQuality: z.preprocess((value) => (value === emptyKey ? "" : value), z.enum(HabitatSpriteQuality)),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
})

export type HabitatSpriteDownloaderFormValues = Omit<
    z.infer<typeof habitatSpriteDownloaderFormSchema>,
    "imageQuality"
> & {
    imageQuality: string
}
