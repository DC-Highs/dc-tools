import { type FC, useEffect, useState } from "react"
import { LuPackage } from "react-icons/lu"
import { AlertCircle, RefreshCw } from "lucide-react"

import type { Release } from "@/dto/github-releases-api-response.dto"
import { Typography } from "@/components/ui/typography"
import ReleasesSkeleton from "./releases-skeleton"
import { Button } from "@/components/ui/button"
import { ReleaseCard } from "./release-card"

const ReleasesList: FC = () => {
    const [releases, setReleases] = useState<Release[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState<unknown>(null)

    const fetchReleases = async () => {
        setIsLoading(true)
        setFetchError(null)
        try {
            const response = await fetch("https://api.github.com/repos/dc-highs/dc-tools/releases")

            if (!response.ok) {
                throw new Error("Failed to fetch releases")
            }

            const releasesData = await response.json()

            setReleases(releasesData)
        } catch (errorData) {
            console.error(errorData)
            setFetchError(errorData)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReleases()
    }, [])

    if (isLoading) {
        return <ReleasesSkeleton />
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <Typography.H3 className="mb-2">Error loading releases</Typography.H3>
                <Typography.P className="text-muted-foreground mb-4">
                    Could not load releases from GitHub.
                </Typography.P>
                <Button onClick={fetchReleases} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <Typography.Small>Try again</Typography.Small>
                </Button>
            </div>
        )
    }

    if (!releases || releases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <LuPackage className="h-12 w-12 text-muted-foreground mb-4" />
                <Typography.H3 className="mb-2">No releases found</Typography.H3>
                <Typography.P className="text-muted-foreground">
                    This repository doesn't have any published releases yet.
                </Typography.P>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {releases.map((releaseItem, releaseIndex) => (
                <ReleaseCard key={releaseItem.id} release={releaseItem} isLatest={releaseIndex === 0} />
            ))}
        </div>
    )
}

export default ReleasesList
