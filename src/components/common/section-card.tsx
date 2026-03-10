import type { FC, ReactNode } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SectionCardProps {
    title: string
    description?: string
    children: ReactNode
    footer?: ReactNode
    className?: string
}

export const SectionCard: FC<SectionCardProps> = ({ title, description, children, footer, className }) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
    )
}
