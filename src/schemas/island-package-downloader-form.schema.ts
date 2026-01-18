import type { IslandPackageDownloaderOptions } from "@dchighs/dc-assets"
import { IslandType } from "@dchighs/dc-core"

import { z } from "zod"

export const islandPackageDownloaderFormSchema = z.object({
    islandType: z.enum(IslandType),
    fileName: z.string(),
} satisfies Omit<Record<keyof IslandPackageDownloaderOptions, any>, "path">)

export type IslandPackageDownloaderFormValues = z.infer<typeof islandPackageDownloaderFormSchema>
