import { BuildingSpriteQuality, StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { emptyKey } from "@/helpers/constants.helper"
import { regexHelper } from "@/helpers/regex.helper"

export const buildingSpriteDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.buildingImageName),
    imageQuality: z.preprocess((value) => (value === emptyKey ? "" : value), z.enum(BuildingSpriteQuality)),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
})

export type BuildingSpriteDownloaderFormValues = Omit<
    z.infer<typeof buildingSpriteDownloaderFormSchema>,
    "imageQuality"
> & {
    imageQuality: string
}
