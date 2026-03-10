import { StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import { LuSearch } from "react-icons/lu"
import { type FC } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FindAllDragonFilesFormProps {
    imageName: string
    setImageName: (value: string) => void
    platformPrefix: StaticFileUrlPlatformPrefix
    setPlatformPrefix: (value: StaticFileUrlPlatformPrefix) => void
    handleSearch: () => void
    loading: boolean
}

export const FindAllDragonFilesForm: FC<FindAllDragonFilesFormProps> = ({
    imageName,
    setImageName,
    platformPrefix,
    setPlatformPrefix,
    handleSearch,
    loading,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Dragon Files Finder</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-4">
                        <Label>Image Name</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={imageName}
                                onChange={(e) => setImageName(e.target.value)}
                                placeholder="e.g. 1000_dragon_nature"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <Label>Platform Prefix</Label>
                        <div className="flex items-center gap-2">
                            <Select
                                onValueChange={(value) => setPlatformPrefix(value as StaticFileUrlPlatformPrefix)}
                                value={platformPrefix.toString()}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a platform prefix" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Platform prefixes</SelectLabel>
                                        {Object.entries(StaticFileUrlPlatformPrefix)
                                            .filter(([name]) => name !== "Default")
                                            .map(([name, prefix]) => (
                                                <SelectItem
                                                    key={`prefix-${prefix.toString()}`}
                                                    value={prefix.toString()}
                                                >
                                                    {name}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <Button onClick={handleSearch} disabled={loading} className="mt-6">
                    {loading ? (
                        <>
                            <Spinner /> Searching...
                        </>
                    ) : (
                        <>
                            <LuSearch /> Search all files
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
