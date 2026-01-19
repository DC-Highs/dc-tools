import { type FC, useEffect, useState } from "react"
import { LuPackage } from "react-icons/lu"

import { AlertCircle, RefreshCw } from "lucide-react"

import type { Release } from "@/dto/github-releases-api-response.dto"
import ReleasesSkeleton from "./releases-skeleton"
import { Button } from "@/components/ui/button"
import { ReleaseCard } from "./release-card"

const ReleasesList: FC = () => {
    const [data, setData] = useState<Release[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch("https://api.github.com/repos/dc-highs/dc-tools/releases")

            if (!res.ok) {
                throw new Error("Failed to fetch releases")
            }

            const json = await res.json()

            setData(json)
        } catch (err) {
            console.error(err)
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (isLoading) {
        return <ReleasesSkeleton />
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Erro ao carregar releases</h3>
                <p className="text-muted-foreground mb-4">Não foi possível carregar as releases do GitHub.</p>
                <Button onClick={fetchData} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Tentar novamente
                </Button>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <LuPackage className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma release encontrada</h3>
                <p className="text-muted-foreground">Este repositório ainda não possui releases publicadas.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {data.map((release, index) => (
                <ReleaseCard key={release.id} release={release} isLatest={index === 0} />
            ))}
        </div>
    )
}

export default ReleasesList
