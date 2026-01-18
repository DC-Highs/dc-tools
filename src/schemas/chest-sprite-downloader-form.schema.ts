import { ChestSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { emptyKey } from "@/helpers/constants.helper"
import { regexHelper } from "@/helpers/regex.helper"

export const chestSpriteDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.chestImageName),
    imageQuality: z.preprocess((value) => (value === emptyKey ? "" : value), z.enum(ChestSpriteQuality)),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
})

export type ChestSpriteDownloaderFormValues = Omit<z.infer<typeof chestSpriteDownloaderFormSchema>, "imageQuality"> & {
    imageQuality: string
}
