import { BuildingSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { emptyKey } from "@/helpers/constants.helper"
import { regexHelper } from "@/helpers/regex.helper"

export const decorationSpriteDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.decorationImageName),
    imageQuality: z.preprocess((value) => (value === emptyKey ? "" : value), z.enum(BuildingSpriteQuality)),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
})

export type DecorationSpriteDownloaderFormValues = Omit<
    z.infer<typeof decorationSpriteDownloaderFormSchema>,
    "imageQuality"
> & {
    imageQuality: string
}
