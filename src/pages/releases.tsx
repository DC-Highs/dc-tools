import type { FC } from "react"

import ReleasesList from "@/components/layout/releases-page/releases-list"
import { Typography } from "../components/ui/typography"

const ReleasesPage: FC = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <Typography.H1>All Releases</Typography.H1>
            </div>
            <ReleasesList />
        </div>
    )
}

export default ReleasesPage
