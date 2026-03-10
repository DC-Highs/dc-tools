import { ConfigLanguage, ConfigPlatform, type GameConfigDto } from "@dchighs/dc-config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, type FC } from "react"
import { toast } from "sonner"

import { fetchConfigFormSchema, type FetchConfigFormValues } from "@/schemas/fetch-config-form.schema"
import { type SettingsFormValues } from "@/schemas/settings-form.schema"

import { ConfigFetcherPreview } from "./components/config-fetcher-preview"
import { ConfigFetcherForm } from "./components/config-fetcher-form"

const ConfigFetcherPage: FC = () => {
    const [data, setData] = useState<GameConfigDto | null>(null)
    const [isFetching, setIsFetching] = useState(false)

    const form = useForm<FetchConfigFormValues>({
        resolver: zodResolver(fetchConfigFormSchema) as any,
        defaultValues: async () => {
            const savedSettings = await window.electronAPI.store.get<SettingsFormValues>("settings")

            return {
                authToken: savedSettings?.gameConfig?.authToken || "",
                filter: [],
                language: (savedSettings?.gameConfig?.language as ConfigLanguage) || ConfigLanguage.English,
                platform: ConfigPlatform.iOS,
                url: savedSettings?.gameConfig?.url || "",
                userId: savedSettings?.gameConfig?.userId || "",
            }
        },
    })

    const onSubmit = async (data: FetchConfigFormValues) => {
        setIsFetching(true)

        const fetchingToastId = toast.loading("Fetching config...")

        try {
            const configData = await window.electronAPI.fetchConfig({
                authToken: data.authToken,
                userId: data.userId,
                language: data.language,
                platform: data.platform,
                url: data.url,
                filter: data.filter?.length === 0 ? undefined : data.filter,
            })

            toast.success("Config fetched successfully")
            setData(configData)
        } catch (error) {
            console.error("Error fetching config:", error)
            toast.error("Failed to fetch config")
        } finally {
            toast.dismiss(fetchingToastId)
            setIsFetching(false)
        }
    }

    const handleSaveData = async () => {
        if (!data) {
            toast.error("No data to save")
            return
        }

        const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "config.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopyData = async () => {
        if (!data) {
            toast.error("No data to copy")
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(data))
        toast.success("Data copied to clipboard")
    }

    return (
        <div className="space-y-2">
            <ConfigFetcherForm
                form={form}
                onSubmit={onSubmit}
                isFetching={isFetching}
                hasData={!!data}
                handleCopyData={handleCopyData}
                handleSaveData={handleSaveData}
            />

            <ConfigFetcherPreview data={data} />
        </div>
    )
}

export default ConfigFetcherPage
