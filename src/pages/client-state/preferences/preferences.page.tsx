import { LuMusic, LuVolume2, LuSettings, LuUser, LuClock, LuBookOpen } from "react-icons/lu"
import { useEffect, useState } from "react"
import type { FC } from "react"
import { toast } from "sonner"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldTitle } from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const ClientPreferencesPage: FC = () => {
    const [preferences, setPreferences] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const prefs = await window.electronAPI.clientState.getPreferences()
            setPreferences(prefs)
        } catch (error) {
            toast.error("Failed to load preferences")
        } finally {
            setLoading(false)
        }
    }

    const handleToggleMusic = async (checked: boolean) => {
        const success = await window.electronAPI.clientState.setMusicDisabled(checked)
        if (success) {
            setPreferences((prev: any) => ({ ...prev, musicDisabled: checked }))
            toast.success(`Music ${checked ? "disabled" : "enabled"}`)
        }
    }

    const handleToggleSound = async (checked: boolean) => {
        const success = await window.electronAPI.clientState.setSoundDisabled(checked)
        if (success) {
            setPreferences((prev: any) => ({ ...prev, soundDisabled: checked }))
            toast.success(`Sound ${checked ? "disabled" : "enabled"}`)
        }
    }

    const handleSetAllFarms = async (cropId: string) => {
        const id = parseInt(cropId)
        if (isNaN(id)) return
        const success = await window.electronAPI.clientState.setAllFarmCrops(id)
        if (success) {
            toast.success("All farms updated")
            loadData()
        }
    }

    const handleDeleteAllFarms = async () => {
        const success = await window.electronAPI.clientState.deleteAllFarmCrops()
        if (success) {
            toast.success("All farm crops deleted")
            loadData()
        }
    }

    const handleToggleTutorials = async (checked: boolean) => {
        const success = await window.electronAPI.clientState.setTutorialsShown(!checked)
        if (success) {
            toast.success(`Tutorials ${checked ? "hidden" : "shown"}`)
        }
    }

    if (loading) return <Typography.P>Loading preferences...</Typography.P>

    return (
        <div className="space-y-6 pb-10">
            <Typography.H1>Game Preferences</Typography.H1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuUser className="w-5 h-5 text-primary" />
                            Account Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Typography.Small className="text-muted-foreground">User ID</Typography.Small>
                            <Typography.P className="font-mono font-bold">{preferences?.userId || "N/A"}</Typography.P>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography.Small className="text-muted-foreground">Last Execution</Typography.Small>
                            <div className="flex items-center gap-2">
                                <LuClock className="w-4 h-4 text-muted-foreground" />
                                <Typography.P className="text-sm">
                                    {preferences?.lastExecution
                                        ? new Date(preferences.lastExecution).toLocaleString()
                                        : "N/A"}
                                </Typography.P>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuSettings className="w-5 h-5 text-primary" />
                            Audio & UI
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Field orientation="horizontal" className="justify-between">
                            <div className="flex items-center gap-3">
                                <LuMusic className="w-4 h-4" />
                                <FieldTitle>Disable Music</FieldTitle>
                            </div>
                            <Checkbox checked={preferences?.musicDisabled} onCheckedChange={handleToggleMusic} />
                        </Field>

                        <Field orientation="horizontal" className="justify-between">
                            <div className="flex items-center gap-3">
                                <LuVolume2 className="w-4 h-4" />
                                <FieldTitle>Disable Sound</FieldTitle>
                            </div>
                            <Checkbox checked={preferences?.soundDisabled} onCheckedChange={handleToggleSound} />
                        </Field>

                        <Field orientation="horizontal" className="justify-between">
                            <div className="flex items-center gap-3">
                                <LuBookOpen className="w-4 h-4" />
                                <FieldTitle>Hide Tutorials</FieldTitle>
                            </div>
                            <Checkbox onCheckedChange={handleToggleTutorials} />
                        </Field>
                    </CardContent>
                </Card>

                <Card className="bg-background/50 backdrop-blur-sm border-primary/20 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuSettings className="w-5 h-5 text-primary" />
                            Farms Management
                        </CardTitle>
                        <CardDescription>Quickly manage all your farms at once</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Typography.Small className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                                    Set All Farm Crops
                                </Typography.Small>
                                <div className="flex gap-2">
                                    <Select onValueChange={handleSetAllFarms}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select crop" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Bluebells (30s)</SelectItem>
                                            <SelectItem value="2">Dragon Bell (5m)</SelectItem>
                                            <SelectItem value="3">Caterpillar Coral (30m)</SelectItem>
                                            <SelectItem value="4">Rainbow Flower (2h)</SelectItem>
                                            <SelectItem value="5">Sharp Leaf (6h)</SelectItem>
                                            <SelectItem value="6">Jungle Juice (12h)</SelectItem>
                                            <SelectItem value="7">Clear Spike (1d)</SelectItem>
                                            <SelectItem value="8">Star Shine (2d)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Typography.Small className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
                                    Clean Up
                                </Typography.Small>
                                <Button variant="outline" className="w-full" onClick={handleDeleteAllFarms}>
                                    Clear All Farm Crops
                                </Button>
                            </div>
                        </div>

                        {preferences?.farmCrops && preferences.farmCrops.length > 0 && (
                            <div className="space-y-2">
                                <Typography.Small className="text-muted-foreground">
                                    Active Farm Slots:
                                </Typography.Small>
                                <div className="flex flex-wrap gap-2">
                                    {preferences.farmCrops.map((farm: any, index: number) => (
                                        <div
                                            key={index}
                                            className="px-2 py-1 bg-primary/10 rounded text-[10px] font-mono"
                                        >
                                            {farm["@_key"]}: {farm["#text"]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ClientPreferencesPage
