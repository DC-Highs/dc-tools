import { LuPlus, LuSearch, LuDatabase } from "react-icons/lu"
import { useState } from "react"
import type { FC } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const UserDefaultPage: FC = () => {
    const [rawKey, setRawKey] = useState("")
    const [rawValue, setRawValue] = useState("")
    const [history, setHistory] = useState<string[]>([])

    const handleGetRaw = async () => {
        if (!rawKey) {
            toast.error("Please enter a key")
            return
        }
        try {
            const value = await window.electronAPI.clientState.getUserDefaultValue(rawKey)
            setRawValue(typeof value === "object" ? JSON.stringify(value, null, 2) : String(value))
            toast.success(`Value for ${rawKey} retrieved`)
            if (!history.includes(rawKey)) {
                setHistory([rawKey, ...history].slice(0, 10))
            }
        } catch (error) {
            toast.error(`Failed to get key ${rawKey}`)
        }
    }

    const handleSetRaw = async () => {
        if (!rawKey) {
            toast.error("Please enter a key")
            return
        }
        let value: any = rawValue
        if (rawValue === "true") value = true
        else if (rawValue === "false") value = false
        else if (!isNaN(Number(rawValue)) && rawValue.trim() !== "") value = Number(rawValue)
        else {
            try {
                value = JSON.parse(rawValue)
            } catch {
                // keep as string
            }
        }

        try {
            const success = await window.electronAPI.clientState.setUserDefaultValue(rawKey, value)
            if (success) {
                toast.success(`Key ${rawKey} updated successfully`)
            } else {
                toast.error(`Failed to update key ${rawKey}`)
            }
        } catch (error) {
            toast.error("Error updating key")
        }
    }

    return (
        <div className="space-y-6 pb-10">
            <Typography.H1>UserDefault Raw Editor</Typography.H1>
            <Typography.P className="text-muted-foreground">
                Directly interact with <span className="font-mono text-primary">UserDefault.xml</span> using raw keys.
                Exercise caution when modifying internal game values.
            </Typography.P>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-background/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LuDatabase className="w-5 h-5 text-primary" />
                            Editor
                        </CardTitle>
                        <CardDescription>Get or set values by their internal XML key</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="xml-key">XML Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="xml-key"
                                    placeholder="e.g. options_music_disabled"
                                    value={rawKey}
                                    onChange={(event) => setRawKey(event.target.value)}
                                    className="font-mono"
                                />
                                <Button variant="outline" onClick={handleGetRaw}>
                                    <LuSearch className="w-4 h-4 mr-2" />
                                    Get
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="xml-value">Value</Label>
                            <Textarea
                                id="xml-value"
                                placeholder="Value (string, number, boolean, or JSON)"
                                value={rawValue}
                                onChange={(event) => setRawValue(event.target.value)}
                                className="font-mono min-h-[200px]"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button className="w-full sm:w-auto" onClick={handleSetRaw}>
                                <LuPlus className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            Recent Keys
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length > 0 ? (
                            <ul className="space-y-1">
                                {history.map((key) => (
                                    <li key={key}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start font-mono text-xs truncate"
                                            onClick={() => {
                                                setRawKey(key)
                                                // trigger get
                                            }}
                                        >
                                            {key}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography.Small className="text-muted-foreground italic text-center block py-4">
                                No recent searches
                            </Typography.Small>
                        )}

                        <Separator className="my-6" />

                        <div className="space-y-4">
                            <Typography.Small className="font-medium text-xs text-primary">
                                Common Keys:
                            </Typography.Small>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "options_music_disabled",
                                    "options_sound_disabled",
                                    "last_execution",
                                    "user_id",
                                    "device_id",
                                    "facebook_id",
                                ].map((k) => (
                                    <Button
                                        key={k}
                                        variant="outline"
                                        size="sm"
                                        className="text-[10px] font-mono h-7"
                                        onClick={() => setRawKey(k)}
                                    >
                                        {k}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UserDefaultPage
