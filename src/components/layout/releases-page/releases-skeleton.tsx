import type { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

const ReleasesSkeleton: FC = () => {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border/50 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ReleasesSkeleton
