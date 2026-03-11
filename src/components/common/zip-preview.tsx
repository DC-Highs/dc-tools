import { LuFile, LuFolder, LuRefreshCw, LuPackage, LuSearch } from "react-icons/lu"
import { useState, useEffect, useMemo, type FC } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBytes } from "@/utils/format-bytes.util"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ZipEntry {
    name: string
    size: number
    isDirectory: boolean
}

interface ZipPreviewProps {
    url: string
}

export const ZipPreview: FC<ZipPreviewProps> = ({ url }) => {
    const [entries, setEntries] = useState<ZipEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    const loadEntries = async () => {
        if (!url) return

        setIsLoading(true)
        setError(null)

        try {
            const data = await window.electronAPI.zip.list(url)
            setEntries(data)
        } catch (err: any) {
            console.error("Failed to list zip contents:", err)
            setError(err.message || "Failed to load zip contents")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadEntries()
    }, [url])

    const filteredEntries = useMemo(() => {
        return entries.filter((entry) => entry.name.toLowerCase().includes(search.toLowerCase()))
    }, [entries, search])

    if (!url) return null

    return (
        <Card className="overflow-hidden border-border/50">
            <CardHeader className="bg-muted/30 py-4 border-b border-border/50">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <LuPackage className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold tracking-tight">ZIP Contents</CardTitle>
                        <Badge variant="secondary" className="px-2 py-0 h-5 font-mono text-[10px]">
                            {entries.length} items
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadEntries}
                            disabled={isLoading}
                            className="p-1.5 hover:bg-background rounded-md transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <LuRefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-3 border-b border-border/50 bg-muted/10">
                    <div className="relative">
                        <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search in zip..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 bg-background border-border/50 focus-visible:ring-1"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground bg-muted/5">
                        <Spinner className="h-6 w-6" />
                        <span className="text-sm">Fetching zip contents...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2 text-destructive bg-destructive/5">
                        <span className="text-sm font-medium">Failed to load zip</span>
                        <p className="text-xs opacity-80">{error}</p>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground text-center">
                        <LuSearch className="h-8 w-8 opacity-20" />
                        <span className="text-sm">No files found</span>
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-auto divide-y divide-border/30">
                        {filteredEntries.map((entry, index) => (
                            <div
                                key={`${entry.name}-${index}`}
                                className="flex items-center justify-between p-3 py-2.5 hover:bg-muted/30 transition-colors group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {entry.isDirectory ? (
                                        <LuFolder className="h-4 w-4 text-amber-500 shrink-0" />
                                    ) : (
                                        <LuFile className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                    )}
                                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                        {entry.name}
                                    </span>
                                </div>
                                {!entry.isDirectory && (
                                    <Badge
                                        variant="ghost"
                                        className="font-mono text-[10px] text-muted-foreground h-5 shrink-0"
                                    >
                                        {formatBytes(entry.size)}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
