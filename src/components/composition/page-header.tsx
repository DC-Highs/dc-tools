import type { FC, ReactNode } from "react"

import { Typography } from "@/components/ui/typography"

interface PageHeaderProps {
    title: string
    children?: ReactNode
    className?: string
}

export const PageHeader: FC<PageHeaderProps> = ({ title, children, className }) => {
    return (
        <div className={className}>
            <Typography.H1>{title}</Typography.H1>
            {children}
        </div>
    )
}
