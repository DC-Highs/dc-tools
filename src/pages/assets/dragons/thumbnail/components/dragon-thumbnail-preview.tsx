import { type FC } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"

interface DragonThumbnailPreviewProps {
    downloadUrl: string
}

export const DragonThumbnailPreview: FC<DragonThumbnailPreviewProps> = ({ downloadUrl }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4 p-6">
                    <img src={downloadUrl} alt="Preview" />
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="font-mono">
                <b>File URL:</b> <Typography.Code>{downloadUrl}</Typography.Code>
            </CardFooter>
        </Card>
    )
}
