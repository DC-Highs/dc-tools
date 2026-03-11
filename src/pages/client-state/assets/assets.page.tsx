import { LuSearch, LuTrash, LuRefreshCcw, LuBox, LuArrowLeftRight } from "react-icons/lu"
import { useEffect, useState } from "react"
import type { FC } from "react"
import { toast } from "sonner"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const AssetsPage: FC = () => {
    const [assets, setAssets] = useState<string[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const assetList = await window.electronAPI.clientState.listAssets()
            setAssets(assetList)
        } catch (error) {
            toast.error("Failed to load assets")
        } finally {
            setLoading(false)
        }
    }

    const handleClearAssets = async () => {
        if (
            !confirm(
                "Are you sure you want to clear ALL cached assets? This will require the game to re-download them.",
            )
        )
            return
        const success = await window.electronAPI.clientState.clearAssets()
        if (success) {
            toast.success("Assets cleared")
            loadData()
        }
    }

    const handleDeleteAsset = async (assetName: string) => {
        const success = await window.electronAPI.clientState.deleteAsset(assetName)
        if (success) {
            toast.success(`Asset ${assetName} deleted`)
            setAssets((prev) => prev.filter((a) => a !== assetName))
        }
    }

    const handleReplaceAsset = async (assetName: string) => {
        const filePath = await window.electronAPI.selectImage()
        if (!filePath) return

        const success = await window.electronAPI.clientState.setAsset(assetName, filePath)
        if (success) {
            toast.success(`Asset ${assetName} replaced successfully`)
        }
    }

    const filteredAssets = assets.filter((a) => a.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <Typography.H1>Assets Manager</Typography.H1>
                    <Typography.P className="text-muted-foreground">
                        Manage files cached locally by Dragon City.
                    </Typography.P>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadData}>
                        <LuRefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="destructive" onClick={handleClearAssets}>
                        <LuTrash className="w-4 h-4 mr-2" />
                        Clear All Cache
                    </Button>
                </div>
            </div>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LuBox className="w-5 h-5 text-primary" />
                        Cached Files ({assets.length})
                    </CardTitle>
                    <CardDescription>Search and replace textures, sounds, or other cached assets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search assets..."
                            className="pl-10"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <div className="max-h-[600px] overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-secondary/80 backdrop-blur-md z-10">
                                    <TableRow>
                                        <TableHead>Filename</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-20 text-muted-foreground">
                                                <LuRefreshCcw className="w-8 h-8 mx-auto mb-2 animate-spin-slow" />
                                                Scanning LocalCache...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredAssets.length > 0 ? (
                                        filteredAssets.slice(0, 100).map((asset) => (
                                            <TableRow key={asset} className="hover:bg-primary/5 transition-colors">
                                                <TableCell className="font-mono text-[11px] truncate max-w-[400px]">
                                                    {asset}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8"
                                                            onClick={() => handleReplaceAsset(asset)}
                                                        >
                                                            <LuArrowLeftRight className="w-3 h-3 mr-2" />
                                                            Replace
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteAsset(asset)}
                                                        >
                                                            <LuTrash className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-20 text-muted-foreground">
                                                No assets found matching your search.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {filteredAssets.length > 100 && (
                        <div className="flex justify-center p-4 bg-secondary/30 rounded-lg">
                            <Typography.Small className="text-muted-foreground">
                                Showing first 100 of {filteredAssets.length} assets. Use search to find specific files.
                            </Typography.Small>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default AssetsPage
