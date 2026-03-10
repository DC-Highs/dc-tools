import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { EnlargeValue, Noise } from "bigjpg/dist/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { LuSave } from "react-icons/lu"
import type { FC } from "react"
import { toast } from "sonner"

import { Typography } from "@/components/ui/typography"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { settingsFormSchema, type SettingsFormValues } from "@/schemas/settings-form.schema"
import { ConfigLanguageSelect } from "@/components/common/config-language-select"
import { PageContainer } from "@/components/common/page-container"
import { PasswordInput } from "@/components/ui/password-input"
import { CacheSection } from "./components/cache-section"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

const SettingsPage: FC = () => {
    const form = useForm({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: async () => {
            const savedSettings = await window.electronAPI.store.get<SettingsFormValues>("settings")
            return {
                conversionTool: savedSettings?.conversionTool || ("local" as const),
                bigjpg: {
                    apiKey: savedSettings?.bigjpg?.apiKey || "",
                    noise: savedSettings?.bigjpg?.noise || Noise.None,
                    enlarge: savedSettings?.bigjpg?.enlarge || EnlargeValue["2x"],
                },
                convertio: savedSettings?.convertio || { apiKey: "" },
                gameConfig: savedSettings?.gameConfig || {
                    url: "",
                    authToken: "",
                    userId: "",
                    language: "",
                },
                localization: savedSettings?.localization || {
                    language: "",
                },
            }
        },
    })
    const onSubmit: SubmitHandler<SettingsFormValues> = async (formData) => {
        await window.electronAPI.store.set("settings", formData)
        toast.success("Settings saved successfully")
    }

    return (
        <PageContainer>
            <div className="space-y-6">
                <div>
                    <Typography.H2 className="text-2xl font-bold tracking-tight">Settings</Typography.H2>
                    <Typography.P className="text-muted-foreground">
                        Manage your application settings and preferences.
                    </Typography.P>
                </div>
                <Separator />
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>General application settings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>DDS Texture Conversion Tool</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="conversionTool"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full sm:w-[300px]">
                                                    <SelectValue placeholder="Select a tool" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Tools</SelectLabel>
                                                        <SelectItem value="local">
                                                            Local (@marcuth/dds-to-png)
                                                        </SelectItem>
                                                        <SelectItem value="convertio">Convertio.co</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldDescription>
                                        Choose the tool used for image/asset conversions.
                                    </FieldDescription>
                                    <FieldError errors={[form.formState.errors.conversionTool]} />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Bigjpg</CardTitle>
                            <CardDescription>
                                Configuration for Bigjpg integration. Enlarge images with AI. Get your API key at{" "}
                                <Link href="https://bigjpg.com/" target="_blank">
                                    https://bigjpg.com/
                                </Link>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid gap-4 sm:grid-cols-2">
                                <Field className="sm:col-span-2">
                                    <FieldLabel>API Key</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="bigjpg.apiKey"
                                        render={({ field }) => (
                                            <PasswordInput placeholder="Enter your Bigjpg API key" {...field} />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.bigjpg?.apiKey]} />
                                </Field>
                                <Field>
                                    <FieldLabel>Noise Reduction</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="bigjpg.noise"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select noise reduction" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="-1">None</SelectItem>
                                                    <SelectItem value="0">Low</SelectItem>
                                                    <SelectItem value="1">Medium</SelectItem>
                                                    <SelectItem value="2">High</SelectItem>
                                                    <SelectItem value="3">Highest</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Enlarge Factor</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="bigjpg.enlarge"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select enlarge factor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">2x</SelectItem>
                                                    <SelectItem value="2">4x</SelectItem>
                                                    <SelectItem value="3">8x</SelectItem>
                                                    <SelectItem value="4">16x</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Convertio</CardTitle>
                            <CardDescription>
                                Configuration for Convertio integration. Get your API key at{" "}
                                <Link href="https://developers.convertio.co/" target="_blank">
                                    https://developers.convertio.co/
                                </Link>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>API Key</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="convertio.apiKey"
                                        render={({ field }) => (
                                            <PasswordInput placeholder="Enter your Convertio API key" {...field} />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.convertio?.apiKey]} />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Game Config</CardTitle>
                            <CardDescription>Default configuration for game interactions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid gap-4 sm:grid-cols-2">
                                <Field className="sm:col-span-2">
                                    <FieldLabel>URL</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="gameConfig.url"
                                        render={({ field }) => (
                                            <PasswordInput placeholder="https://api.example.com" {...field} />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.gameConfig?.url]} />
                                </Field>
                                <Field>
                                    <FieldLabel>User ID</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="gameConfig.userId"
                                        render={({ field }) => <PasswordInput placeholder="User ID" {...field} />}
                                    />
                                    <FieldError errors={[form.formState.errors.gameConfig?.userId]} />
                                </Field>
                                <ConfigLanguageSelect
                                    control={form.control}
                                    name="gameConfig.language"
                                    label="Language"
                                    placeholder="Select a language"
                                />
                                <Field className="sm:col-span-2">
                                    <FieldLabel>Auth Token</FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="gameConfig.authToken"
                                        render={({ field }) => <PasswordInput placeholder="Auth Token" {...field} />}
                                    />
                                    <FieldError errors={[form.formState.errors.gameConfig?.authToken]} />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Localization</CardTitle>
                            <CardDescription>Application localization settings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <ConfigLanguageSelect
                                    control={form.control}
                                    name="localization.language"
                                    label="Language"
                                    placeholder="Select a language"
                                />
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <CacheSection />
                    <div className="flex justify-end">
                        <Button type="submit">
                            <LuSave className="mr-2 h-4 w-4" /> Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default SettingsPage
