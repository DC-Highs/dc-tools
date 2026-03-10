import { type FC } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"

interface DragonSpritePreviewProps {
    downloadUrl: string
}

export const DragonSpritePreview: FC<DragonSpritePreviewProps> = ({ downloadUrl }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography.H4>Preview</Typography.H4>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4 p-6">
                    <img src={downloadUrl} alt="Preview" />
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="font-mono">
                <Typography.Small>
                    <b>File URL:</b> <Typography.Code>{downloadUrl}</Typography.Code>
                </Typography.Small>
            </CardFooter>
        </Card>
    )
}
