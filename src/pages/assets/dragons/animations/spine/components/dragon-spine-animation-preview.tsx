import { LuPackage } from "react-icons/lu"
import { type FC } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ZipPreview } from "@/components/common/zip-preview"
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
                <ZipPreview url={downloadUrl} />
            </CardContent>
            <Separator />
            <CardFooter className="font-mono">
                <b>File URL:</b> <Typography.Code>{downloadUrl}</Typography.Code>
            </CardFooter>
        </Card>
    )
}
