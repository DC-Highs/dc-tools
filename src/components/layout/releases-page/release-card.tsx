import { Download, ChevronDown, ChevronUp, ExternalLink, Monitor, Apple, Package } from "lucide-react"
import { useState } from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Release } from "@/dto/github-releases-api-response.dto"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatBytes } from "@/utils/format-bytes.util"
import { getTimeAgo } from "@/utils/get-time-ago.util"
import { formatDate } from "@/utils/format-date.util"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

export function ReleaseCard({ release, isLatest }: ReleaseCardProps) {
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
                                    <h3 className="text-lg font-semibold truncate">
                                        {release.name || release.tag_name}
                                    </h3>
                                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                                        {release.tag_name}
                                    </Badge>
                                    {isLatest && (
                                        <Badge className="bg-primary text-primary-foreground shrink-0">
                                            Latest version
                                        </Badge>
                                    )}
                                    {release.prerelease && (
                                        <Badge variant="secondary" className="shrink-0">
                                            Pre-release
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage
                                                src={release.author.avatar_url || "/placeholder.svg"}
                                                alt={release.author.login}
                                            />
                                            <AvatarFallback>{release.author.login[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span>{release.author.login}</span>
                                    </div>
                                    <span title={formatDate(release.published_at)}>
                                        {getTimeAgo(release.published_at)}
                                    </span>
                                    {totalDownloads > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Download className="h-3.5 w-3.5" />
                                            {totalDownloads.toLocaleString("en-US")}
                                        </span>
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
                                            <span className="hidden sm:inline">Download</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-72">
                                        {downloadableAssets.map((asset) => (
                                            <DropdownMenuItem key={asset.id} asChild>
                                                <a
                                                    href={asset.browser_download_url}
                                                    className="flex items-center justify-between gap-2 cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        {getPlatformIcon(asset.name)}
                                                        <span className="truncate">{asset.name}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground shrink-0">
                                                        {formatBytes(asset.size)}
                                                    </span>
                                                </a>
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
                                        {release.body}
                                    </div>
                                </div>
                            )}
                            {downloadableAssets.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Assets ({downloadableAssets.length})
                                    </h4>
                                    <div className="grid gap-2">
                                        {downloadableAssets.map((asset) => (
                                            <a
                                                key={asset.id}
                                                href={asset.browser_download_url}
                                                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {getPlatformIcon(asset.name)}
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                            {asset.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {getPlatformName(asset.name)} • {formatBytes(asset.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                                                    <span className="flex items-center gap-1">
                                                        <Download className="h-3.5 w-3.5" />
                                                        {asset.download_count.toLocaleString("en-US")}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-end pt-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <a
                                        href={release.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gap-2"
                                    >
                                        View on GitHub
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
