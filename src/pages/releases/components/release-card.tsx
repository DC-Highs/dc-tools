import { Download, ChevronDown, ChevronUp, ExternalLink, Monitor, Apple, Package } from "lucide-react"
import { useState } from "react"
import type { FC } from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Release } from "@/dto/github-releases-api-response.dto"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { formatBytes } from "@/utils/format-bytes.util"
import { getTimeAgo } from "@/utils/get-time-ago.util"
import { formatDate } from "@/utils/format-date.util"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"

interface ReleaseCardProps {
    release: Release
    isLatest?: boolean
}

function getPlatformIcon(fileName: string) {
    const lowerName = fileName.toLowerCase()
    if (lowerName.includes("win") || lowerName.includes(".exe") || lowerName.includes(".msi")) {
        return <Monitor className="h-4 w-4" />
    }

    if (lowerName.includes("mac") || lowerName.includes("darwin") || lowerName.includes(".dmg")) {
        return <Apple className="h-4 w-4" />
    }

    if (
        lowerName.includes("linux") ||
        lowerName.includes(".appimage") ||
        lowerName.includes(".deb") ||
        lowerName.includes(".rpm")
    ) {
        return <Package className="h-4 w-4" />
    }

    return <Download className="h-4 w-4" />
}

function getPlatformName(fileName: string): string {
    const lowerName = fileName.toLowerCase()

    if (lowerName.includes("win") || lowerName.includes(".exe") || lowerName.includes(".msi")) {
        return "Windows"
    }

    if (lowerName.includes("mac") || lowerName.includes("darwin") || lowerName.includes(".dmg")) {
        return "macOS"
    }

    if (
        lowerName.includes("linux") ||
        lowerName.includes(".appimage") ||
        lowerName.includes(".deb") ||
        lowerName.includes(".rpm")
    ) {
        return "Linux"
    }
    return "Download"
}

export const ReleaseCard: FC<ReleaseCardProps> = ({ release, isLatest }) => {
    const [isOpen, setIsOpen] = useState(isLatest || false)

    const downloadableAssets = release.assets.filter(
        (asset) => !asset.name.endsWith(".blockmap") && !asset.name.endsWith(".yml") && !asset.name.endsWith(".yaml"),
    )

    const totalDownloads = release.assets.reduce((acc, asset) => acc + asset.download_count, 0)

    return (
        <Card
            className={`transition-all duration-200 ${isLatest ? "border-primary/50 bg-card/80" : "border-border/50 hover:border-border"}`}
        >
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Typography.H3 className="truncate">
                                        {release.name || release.tag_name}
                                    </Typography.H3>
                                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                                        <Typography.Small className="text-[10px]">{release.tag_name}</Typography.Small>
                                    </Badge>
                                    {isLatest && (
                                        <Badge className="bg-primary text-primary-foreground shrink-0">
                                            <Typography.Small className="text-[10px]">Latest version</Typography.Small>
                                        </Badge>
                                    )}
                                    {release.prerelease && (
                                        <Badge variant="secondary" className="shrink-0">
                                            <Typography.Small className="text-[10px]">Pre-release</Typography.Small>
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage
                                                src={release.author.avatar_url || "/placeholder.svg"}
                                                alt={release.author.login}
                                            />
                                            <AvatarFallback>
                                                <Typography.Small>
                                                    {release.author.login[0].toUpperCase()}
                                                </Typography.Small>
                                            </AvatarFallback>
                                        </Avatar>
                                        <Typography.Small className="text-muted-foreground truncate">
                                            {release.author.login}
                                        </Typography.Small>
                                    </div>
                                    <Typography.Small
                                        className="text-muted-foreground whitespace-nowrap"
                                        title={formatDate(release.published_at)}
                                    >
                                        {getTimeAgo(release.published_at)}
                                    </Typography.Small>
                                    {totalDownloads > 0 && (
                                        <Typography.Small className="flex items-center gap-1 text-muted-foreground">
                                            <Download className="h-3.5 w-3.5" />
                                            {totalDownloads.toLocaleString("en-US")}
                                        </Typography.Small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {downloadableAssets.length > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" className="gap-2">
                                            <Download className="h-4 w-4" />
                                            <Typography.Small className="hidden sm:inline">Download</Typography.Small>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-72">
                                        {downloadableAssets.map((asset) => (
                                            <DropdownMenuItem key={asset.id} asChild>
                                                <Link
                                                    href={asset.browser_download_url}
                                                    className="flex items-center justify-between gap-2 cursor-pointer w-full"
                                                    underline="none"
                                                    showExternalIcon={false}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        {getPlatformIcon(asset.name)}
                                                        <Typography.Small className="truncate">
                                                            {asset.name}
                                                        </Typography.Small>
                                                    </div>
                                                    <Typography.Small className="text-muted-foreground shrink-0 text-[10px]">
                                                        {formatBytes(asset.size)}
                                                    </Typography.Small>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    <span className="sr-only">Toggle details</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </CardHeader>
                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {release.body && (
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed">
                                        <Typography.Small>{release.body}</Typography.Small>
                                    </div>
                                </div>
                            )}
                            {downloadableAssets.length > 0 && (
                                <div className="space-y-2">
                                    <Typography.H4 className="text-sm font-medium text-muted-foreground">
                                        Assets ({downloadableAssets.length})
                                    </Typography.H4>
                                    <div className="grid gap-2">
                                        {downloadableAssets.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={item.browser_download_url}
                                                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                                                underline="none"
                                                showExternalIcon={false}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {getPlatformIcon(item.name)}
                                                    <div className="min-w-0">
                                                        <Typography.P className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                            {item.name}
                                                        </Typography.P>
                                                        <Typography.Small className="text-xs text-muted-foreground">
                                                            {getPlatformName(item.name)} • {formatBytes(item.size)}
                                                        </Typography.Small>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                                                    <Typography.Small className="flex items-center gap-1">
                                                        <Download className="h-3.5 w-3.5" />
                                                        {item.download_count.toLocaleString("en-US")}
                                                    </Typography.Small>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-end pt-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link
                                        href={release.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gap-2"
                                        showExternalIcon={false}
                                        underline="none"
                                    >
                                        <Typography.Small>View on GitHub</Typography.Small>
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
