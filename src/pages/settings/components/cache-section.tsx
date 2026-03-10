import { LuTrash2, LuRefreshCw } from "react-icons/lu"
import { useEffect, useState, type FC } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

export const CacheSection: FC = () => {
    const [cacheSize, setCacheSize] = useState<number | null>(null)
    const [isClearing, setIsClearing] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const loadCacheSize = async () => {
        setIsRefreshing(true)
        try {
            const size = await window.electronAPI.cache.getSize()
            setCacheSize(size)
        } catch (error) {
            console.error("Failed to load cache size:", error)
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleClearCache = async () => {
        setIsClearing(true)
        const toastId = toast.loading("Clearing cache...")
        try {
            const success = await window.electronAPI.cache.clear()
            if (success) {
                toast.success("Cache cleared successfully", { id: toastId })
                await loadCacheSize()
            } else {
                toast.error("Failed to clear cache", { id: toastId })
            }
        } catch (error) {
            console.error("Failed to clear cache:", error)
            toast.error("An error occurred while clearing cache", { id: toastId })
        } finally {
            setIsClearing(false)
        }
    }

    useEffect(() => {
        loadCacheSize()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cache Management</CardTitle>
                <CardDescription>Manage temporary files and application cache.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Current cache size:</span>
                        <Typography.P className="text-xl font-semibold">
                            {cacheSize !== null ? formatSize(cacheSize) : "Loading..."}
                        </Typography.P>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={loadCacheSize}
                            disabled={isRefreshing || isClearing}
                        >
                            <LuRefreshCw className={isRefreshing ? "animate-spin" : ""} />
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleClearCache}
                            disabled={isClearing || (cacheSize !== null && cacheSize === 0)}
                        >
                            <LuTrash2 className="mr-2 h-4 w-4" />
                            Clear Cache
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
