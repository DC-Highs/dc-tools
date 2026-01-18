import type { DecorationThumbnailDownloaderOptions } from "@dchighs/dc-assets"
import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

import { regexHelper } from "@/helpers/regex.helper"

export const decorationThumbnailDownloaderFormSchema = z.object({
    imageName: z.string().regex(regexHelper.buildingImageName),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
} satisfies Record<keyof DecorationThumbnailDownloaderOptions, any>)

export type DecorationThumbnailDownloaderFormValues = z.infer<typeof decorationThumbnailDownloaderFormSchema>
