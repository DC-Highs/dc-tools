import { LuPackage } from "react-icons/lu"
import { type FC } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"

interface DragonSpineAnimationPreviewProps {
    downloadUrl: string
}

export const DragonSpineAnimationPreview: FC<DragonSpineAnimationPreviewProps> = ({ downloadUrl }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4 p-6">
                    <div className="flex items-center gap-2 font-semibold text-lg text-primary/80">
                        <LuPackage /> {downloadUrl.split("/").pop()}
                    </div>
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="font-mono">
                <b>File URL:</b> <Typography.Code>{downloadUrl}</Typography.Code>
            </CardFooter>
        </Card>
    )
}
