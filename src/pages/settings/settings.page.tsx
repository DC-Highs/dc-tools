import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { EnlargeValue, Noise } from "bigjpg/dist/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { Typography } from "@/components/ui/typography"
import { LuSave } from "react-icons/lu"
import type { FC } from "react"
import { toast } from "sonner"

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
import { ConfigLanguageSelect } from "@/components/composition/config-language-select"
import { PageContainer } from "@/components/composition/page-container"
import { PasswordInput } from "@/components/ui/password-input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
                            <CardTitle>
                                <Typography.H4>General</Typography.H4>
                            </CardTitle>
                            <CardDescription>
                                <Typography.Small>General application settings.</Typography.Small>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>
                                        <Typography.Small>DDS Texture Conversion Tool</Typography.Small>
                                    </FieldLabel>
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
                                                        <SelectLabel>
                                                            <Typography.Small>Tools</Typography.Small>
                                                        </SelectLabel>
                                                        <SelectItem value="local">
                                                            <Typography.Small>
                                                                Local (@marcuth/dds-to-png)
                                                            </Typography.Small>
                                                        </SelectItem>
                                                        <SelectItem value="convertio">
                                                            <Typography.Small>Convertio.co</Typography.Small>
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldDescription>
                                        <Typography.Small>
                                            Choose the tool used for image/asset conversions.
                                        </Typography.Small>
                                    </FieldDescription>
                                    <FieldError errors={[form.formState.errors.conversionTool]} />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Typography.H4>Bigjpg</Typography.H4>
                            </CardTitle>
                            <CardDescription>
                                <Typography.Small>
                                    Configuration for Bigjpg integration. Enlarge images with AI. Get your API key at{" "}
                                    <Link href="https://bigjpg.com/" target="_blank">
                                        https://bigjpg.com/
                                    </Link>
                                </Typography.Small>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid gap-4 sm:grid-cols-2">
                                <Field className="sm:col-span-2">
                                    <FieldLabel>
                                        <Typography.Small>API Key</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="bigjpg.apiKey"
                                        render={({ field }) => (
                                            <PasswordInput
                                                placeholder="Enter your Bigjpg API key"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.bigjpg?.apiKey]} />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        <Typography.Small>Noise Reduction</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="bigjpg.noise"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select noise reduction" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="-1">
                                                        <Typography.Small>None</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="0">
                                                        <Typography.Small>Low</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="1">
                                                        <Typography.Small>Medium</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        <Typography.Small>High</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        <Typography.Small>Highest</Typography.Small>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        <Typography.Small>Enlarge Factor</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="bigjpg.enlarge"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select enlarge factor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        <Typography.Small>2x</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        <Typography.Small>4x</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        <Typography.Small>8x</Typography.Small>
                                                    </SelectItem>
                                                    <SelectItem value="4">
                                                        <Typography.Small>16x</Typography.Small>
                                                    </SelectItem>
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
                            <CardTitle>
                                <Typography.H4>Convertio</Typography.H4>
                            </CardTitle>
                            <CardDescription>
                                <Typography.Small>
                                    Configuration for Convertio integration. Get your API key at{" "}
                                    <Link href="https://developers.convertio.co/" target="_blank">
                                        https://developers.convertio.co/
                                    </Link>
                                </Typography.Small>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>
                                        <Typography.Small>API Key</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="convertio.apiKey"
                                        render={({ field }) => (
                                            <PasswordInput
                                                placeholder="Enter your Convertio API key"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.convertio?.apiKey]} />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Typography.H4>Game Config</Typography.H4>
                            </CardTitle>
                            <CardDescription>
                                <Typography.Small>Default configuration for game interactions.</Typography.Small>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid gap-4 sm:grid-cols-2">
                                <Field className="sm:col-span-2">
                                    <FieldLabel>
                                        <Typography.Small>URL</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="gameConfig.url"
                                        render={({ field }) => (
                                            <Input placeholder="https://api.example.com" {...field} />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.gameConfig?.url]} />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        <Typography.Small>User ID</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="gameConfig.userId"
                                        render={({ field }) => (
                                            <Input placeholder="User ID" {...field} />
                                        )}
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
                                    <FieldLabel>
                                        <Typography.Small>Auth Token</Typography.Small>
                                    </FieldLabel>
                                    <Controller
                                        control={form.control}
                                        name="gameConfig.authToken"
                                        render={({ field }) => (
                                            <PasswordInput
                                                placeholder="Auth Token"
                                                {...field}
                                            />
                                        )}
                                    />
                                    <FieldError errors={[form.formState.errors.gameConfig?.authToken]} />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Typography.H4>Localization</Typography.H4>
                            </CardTitle>
                            <CardDescription>
                                <Typography.Small>Application localization settings.</Typography.Small>
                            </CardDescription>
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
                    <div className="flex justify-end">
                        <Button type="submit">
                            <LuSave className="mr-2 h-4 w-4" /> <Typography.Small>Save Settings</Typography.Small>
                        </Button>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

export default SettingsPage
