import type { FC, HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type PageContainerProps = HTMLAttributes<HTMLDivElement>

export const PageContainer: FC<PageContainerProps> = ({ className, children, ...props }) => {
    return (
        <div className={cn("space-y-6", className)} {...props}>
            {children}
        </div>
    )
}
