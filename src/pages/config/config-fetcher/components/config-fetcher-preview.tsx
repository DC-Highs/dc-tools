import { type GameConfigDto } from "@dchighs/dc-config"
import { type FC } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

interface ConfigFetcherPreviewProps {
    data: GameConfigDto | null
}

export const ConfigFetcherPreview: FC<ConfigFetcherPreviewProps> = ({ data }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
                {data ? (
                    <Typography.Code>{JSON.stringify(data).slice(0, 1000) + "...}"}</Typography.Code>
                ) : (
                    <Typography.P className="text-center">No data</Typography.P>
                )}
            </CardContent>
        </Card>
    )
}
