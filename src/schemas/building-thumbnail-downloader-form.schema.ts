import type { BuildingThumbnailDownloaderOptions } from "@dchighs/dc-assets"
import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { regexHelper } from "@/helpers/regex.helper"

export const buildingThumbnailDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.buildingImageName),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
} satisfies Record<keyof BuildingThumbnailDownloaderOptions, any>)

export type BuildingThumbnailDownloaderFormValues = z.infer<typeof buildingThumbnailDownloaderFormSchema>
