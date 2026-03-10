import type { FC, ReactNode } from "react"

import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { SectionCard } from "./section-card"

interface AssetPreviewCardProps {
    url: string
    title?: string
    children?: ReactNode
}

export const AssetPreviewCard: FC<AssetPreviewCardProps> = ({ url, title = "Preview", children }) => {
    return (
        <SectionCard
            title={title}
            footer={
                <div className="w-full">
                    <Separator className="mb-4" />
                    <div className="font-mono text-sm leading-none">
                        <b className="mr-2">File URL:</b>
                        <Typography.Code>{url}</Typography.Code>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col items-center gap-4 p-6">
                {children ? (
                    children
                ) : url ? (
                    <img src={url} alt="Preview" className="max-w-full h-auto object-contain" />
                ) : (
                    <div className="text-muted-foreground italic">No preview available</div>
                )}
            </div>
        </SectionCard>
    )
}
