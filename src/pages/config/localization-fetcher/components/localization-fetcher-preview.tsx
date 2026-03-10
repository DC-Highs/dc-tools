import { type FC } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

interface LocalizationFetcherPreviewProps {
    previewContent: string | null
}

export const LocalizationFetcherPreview: FC<LocalizationFetcherPreviewProps> = ({ previewContent }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
                {previewContent ? (
                    <Typography.Code>{previewContent}</Typography.Code>
                ) : (
                    <Typography.P className="text-center">No data</Typography.P>
                )}
            </CardContent>
        </Card>
    )
}
