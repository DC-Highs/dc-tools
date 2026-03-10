import { Localization } from "@dchighs/dc-localization"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState, type FC } from "react"
import { ConfigLanguage } from "@dchighs/dc-core"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { fetchLocalizationFormSchema, type FetchLocalizationFormValues } from "@/schemas/fetch-localization-form.schema"
import { type SettingsFormValues } from "@/schemas/settings-form.schema"

import { LocalizationFetcherPreview } from "./components/localization-fetcher-preview"
import { LocalizationFetcherForm } from "./components/localization-fetcher-form"

const LocalizationFetcherPage: FC = () => {
    const [localization, setLocalization] = useState<Localization | null>(null)
    const [isFetching, setIsFetching] = useState(false)

    const form = useForm<FetchLocalizationFormValues>({
        resolver: zodResolver(fetchLocalizationFormSchema) as any,
        defaultValues: async () => {
            const savedSettings = await window.electronAPI.store.get<SettingsFormValues>("settings")
            return {
                language: (savedSettings?.localization?.language as ConfigLanguage) || ConfigLanguage.English,
                parseMode: "array" as const,
            }
        },
    })

    const parseMode = form.watch("parseMode")

    const data = useMemo(() => {
        if (!localization) {
            return null
        }

        return parseMode === "array" ? localization.toArray() : localization.toObject()
    }, [localization, parseMode])

    const onSubmit = async (data: FetchLocalizationFormValues) => {
        setIsFetching(true)

        const fetchingToastId = toast.loading("Fetching localization...")

        try {
            const createdLocalization = await Localization.create(data.language)

            toast.success("Localization fetched successfully")
            setLocalization(createdLocalization)
        } catch (error) {
            console.error("Error fetching localization:", error)
            toast.error("Failed to fetch localization")
        } finally {
            toast.dismiss(fetchingToastId)
            setIsFetching(false)
        }
    }

    const handleSaveData = async () => {
        if (!localization || !data) {
            toast.error("No data to save")
            return
        }

        const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "localization.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleCopyData = async () => {
        if (!localization) {
            toast.error("No data to copy")
            return
        }

        await navigator.clipboard.writeText(JSON.stringify(localization.toArray()))
        toast.success("Data copied to clipboard")
    }

    const handleCopyUrl = async () => {
        const language = form.getValues("language")
        const url = Localization.buildUrl(language)
        await navigator.clipboard.writeText(url)
        toast.success("URL copied to clipboard")
    }

    const previewContent = useMemo(() => {
        if (!localization || !data) {
            return null
        }

        return JSON.stringify(data).slice(0, 1000) + "..." + (parseMode === "array" ? "]" : "}")
    }, [localization, data, parseMode])

    return (
        <div className="space-y-2">
            <LocalizationFetcherForm
                form={form}
                onSubmit={onSubmit}
                isFetching={isFetching}
                hasData={!!localization}
                handleCopyUrl={handleCopyUrl}
                handleCopyData={handleCopyData}
                handleSaveData={handleSaveData}
            />
            <LocalizationFetcherPreview previewContent={previewContent} />
        </div>
    )
}

export default LocalizationFetcherPage
