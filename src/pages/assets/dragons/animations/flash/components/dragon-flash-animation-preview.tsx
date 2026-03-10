import { type FC } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import FlashPreview from "@/components/features/flash-preview"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"

interface DragonFlashAnimationPreviewProps {
    downloadUrl: string
}

export const DragonFlashAnimationPreview: FC<DragonFlashAnimationPreviewProps> = ({ downloadUrl }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography.H3>Preview</Typography.H3>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4 p-6">
                    <FlashPreview src={downloadUrl} />
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="font-mono">
                <Typography.P>
                    <Typography.Large className="inline">File URL:</Typography.Large>{" "}
                    <Typography.Code>{downloadUrl}</Typography.Code>
                </Typography.P>
            </CardFooter>
        </Card>
    )
}
