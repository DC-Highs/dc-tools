import type { HabitatThumbnailDownloaderOptions } from "@dchighs/dc-assets"
import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { regexHelper } from "@/helpers/regex.helper"

export const habitatThumbnailDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.habitatImageName),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
} satisfies Record<keyof HabitatThumbnailDownloaderOptions, any>)

export type HabitatThumbnailDownloaderFormValues = z.infer<typeof habitatThumbnailDownloaderFormSchema>
