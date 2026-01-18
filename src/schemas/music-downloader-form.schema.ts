import type { MusicDownloaderOptions } from "@dchighs/dc-assets"
import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"

import { z } from "zod"

export const musicDownloaderFormSchema = z.object({
    keyName: z.string(),
    platformPrefix: z.enum(StaticFileUrlPlatformPrefix),
} satisfies Record<keyof MusicDownloaderOptions, any>)

export type MusicDownloaderFormValues = z.infer<typeof musicDownloaderFormSchema>
