import {
    LuChevronUp,
    LuChevronDown,
    LuImage,
    LuMusic,
    LuSettings,
    LuFolder,
    LuPackage,
    LuGithub,
    LuFileSearch,
    LuRegex,
    LuBox,
    LuPlay,
} from "react-icons/lu"
import { MdAnimation, MdOutlineTranslate } from "react-icons/md"
import { RiGitRepositoryLine } from "react-icons/ri"
import { PiBracketsCurly } from "react-icons/pi"
import { VscIssues } from "react-icons/vsc"
import { FaDragon } from "react-icons/fa"
import { useState } from "react"
import type { FC } from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Typography } from "@/components/ui/typography"
import { Link } from "@/components/ui/link"
import { Button } from "../../ui/button"
import pkg from "@/../package.json"

interface SidebarItem {
    title: string
    url: string
    icon: any
}

const assetItems: SidebarItem[] = [
    {
        title: "Dragon Sprite",
        url: "/assets/dragons/sprite",
        icon: LuImage,
    },
    {
        title: "Dragon Thumbnail",
        url: "/assets/dragons/thumbnail",
        icon: LuImage,
    },
    {
        title: "Dragon Flash Animation (.swf)",
        url: "/assets/dragons/animations/flash",
        icon: MdAnimation,
    },
    {
        title: "Dragon Spine Animation (.zip)",
        url: "/assets/dragons/animations/spine",
        icon: MdAnimation,
    },
    {
        title: "Building Sprite",
        url: "/assets/buildings/sprite",
        icon: LuImage,
    },
    {
        title: "Building Thumbnail",
        url: "/assets/buildings/thumbnail",
        icon: LuImage,
    },
    {
        title: "Decoration Sprite",
        url: "/assets/decorations/sprite",
        icon: LuImage,
    },
    {
        title: "Decoration Thumbnail",
        url: "/assets/decorations/thumbnail",
        icon: LuImage,
    },
    {
        title: "Habitat Sprite",
        url: "/assets/habitats/sprite",
        icon: LuImage,
    },
    {
        title: "Habitat Thumbnail",
        url: "/assets/habitats/thumbnail",
        icon: LuImage,
    },
    {
        title: "Chest Sprite",
        url: "/assets/chests/sprite",
        icon: LuImage,
    },
    {
        title: "Island Package",
        url: "/assets/islands/package",
        icon: LuPackage,
    },
    {
        title: "Music",
        url: "/assets/sounds/music",
        icon: LuMusic,
    },
    {
        title: "Find All Dragon Files",
        url: "/assets/dragons/all",
        icon: LuFileSearch,
    },
]

const configItems: SidebarItem[] = [
    {
        title: "Config Fetcher",
        url: "/config/config-fetcher",
        icon: LuSettings,
    },
    {
        title: "Localization Fetcher",
        url: "/config/localization-fetcher",
        icon: MdOutlineTranslate,
    },
]

const urlToolsItems: SidebarItem[] = [
    {
        title: "D. Sprite File URL Parser",
        url: "/url-tools/dragon-sprite-url-parser",
        icon: PiBracketsCurly,
    },
    {
        title: "D. Thumbnail File URL Parser",
        url: "/url-tools/dragon-thumbnail-url-parser",
        icon: PiBracketsCurly,
    },
    {
        title: "D. Flash Animation File URL Parser",
        url: "/url-tools/dragon-flash-animation-url-parser",
        icon: PiBracketsCurly,
    },
    {
        title: "D. Spine Animation File URL Parser",
        url: "/url-tools/dragon-spine-animation-url-parser",
        icon: PiBracketsCurly,
    },
]

const animationPlayerItems: SidebarItem[] = [
    {
        title: "Spine Player",
        url: "/animation-players/spine",
        icon: MdAnimation,
    },
]

const gitHubItems: SidebarItem[] = [
    {
        title: "Repository",
        url: "https://github.com/dc-highs/dc-tools",
        icon: RiGitRepositoryLine,
    },
    {
        title: "Issues",
        url: "https://github.com/dc-highs/dc-tools/issues",
        icon: VscIssues,
    },
    {
        title: "Releases",
        url: "/releases",
        icon: LuBox,
    },
    {
        title: "DC Highs",
        url: "https://github.com/dc-highs",
        icon: LuGithub,
    },
]

const AppSidebar: FC = () => {
    const [assetsOpen, setAssetsOpen] = useState(true)
    const [configOpen, setConfigOpen] = useState(false)
    const [urlToolsOpen, setUrlToolsOpen] = useState(false)
    const [gitHubOpen, setGitHubOpen] = useState(true)
    const [animationPlayerOpen, setAnimationPlayerOpen] = useState(false)
    const { open } = useSidebar()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link
                    className={`flex items-center py-2 gap-6 ${open ? "px-2" : "justify-center"} gap-2 transition-all duration-300 hover:opacity-80`}
                    href="/"
                    underline="none"
                >
                    <FaDragon width={24} height={24} />
                    {open && (
                        <div>
                            <Typography.H3 className="font-bold text-xl max-lg:text-base text-nowrap">DC Tools</Typography.H3>
                            <div className="text-xs flex gap-1 text-nowrap">
                                <Typography.Small>Powered by</Typography.Small>
                                <Typography.Small className="font-semibold">DC Highs</Typography.Small>
                            </div>
                        </div>
                    )}
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <Collapsible open={assetsOpen} onOpenChange={setAssetsOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <LuFolder />
                                    <Typography.Small>Assets Downloader</Typography.Small>
                                </div>
                                {assetsOpen ? (
                                    <LuChevronDown className="h-4 w-4" />
                                ) : (
                                    <LuChevronUp className="h-4 w-4" />
                                )}
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {assetItems.map((currentItem) => (
                                        <SidebarMenuItem key={currentItem.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={currentItem.url} underline="none">
                                                    <currentItem.icon />
                                                    <Typography.Small>{currentItem.title}</Typography.Small>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                <Collapsible open={urlToolsOpen} onOpenChange={setUrlToolsOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <LuRegex />
                                    <Typography.Small>URL Tools</Typography.Small>
                                </div>
                                {urlToolsOpen ? (
                                    <LuChevronDown className="h-4 w-4" />
                                ) : (
                                    <LuChevronUp className="h-4 w-4" />
                                )}
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {urlToolsItems.map((currentItem) => (
                                        <SidebarMenuItem key={currentItem.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={currentItem.url} underline="none">
                                                    <currentItem.icon />
                                                    <Typography.Small>{currentItem.title}</Typography.Small>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <LuSettings />
                                    <Typography.Small>Game Config</Typography.Small>
                                </div>
                                {configOpen ? (
                                    <LuChevronDown className="h-4 w-4" />
                                ) : (
                                    <LuChevronUp className="h-4 w-4" />
                                )}
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {configItems.map((currentItem) => (
                                        <SidebarMenuItem key={currentItem.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={currentItem.url} underline="none">
                                                    <currentItem.icon />
                                                    <Typography.Small>{currentItem.title}</Typography.Small>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                <Collapsible open={animationPlayerOpen} onOpenChange={setAnimationPlayerOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <LuPlay />
                                    <Typography.Small>Animation Players</Typography.Small>
                                </div>
                                {animationPlayerOpen ? (
                                    <LuChevronDown className="h-4 w-4" />
                                ) : (
                                    <LuChevronUp className="h-4 w-4" />
                                )}
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {animationPlayerItems.map((currentItem) => (
                                        <SidebarMenuItem key={currentItem.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={currentItem.url} underline="none">
                                                    <currentItem.icon />
                                                    <Typography.Small>{currentItem.title}</Typography.Small>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                <Collapsible open={gitHubOpen} onOpenChange={setGitHubOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <LuGithub />
                                    <Typography.Small>GitHub</Typography.Small>
                                </div>
                                {gitHubOpen ? (
                                    <LuChevronDown className="h-4 w-4" />
                                ) : (
                                    <LuChevronUp className="h-4 w-4" />
                                )}
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {gitHubItems.map((currentItem) => (
                                        <SidebarMenuItem key={currentItem.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={currentItem.url} underline="none" showExternalIcon={false}>
                                                    <currentItem.icon />
                                                    <Typography.Small>{currentItem.title}</Typography.Small>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
            <SidebarFooter>
                <div className={`flex items-center gap-3 ${open ? "justify-between px-4" : "justify-center"}`}>
                    {open && (
                        <div className="flex items-center justify-center gap-2 text-xs font-mono overflow-x-hidden text-nowrap">
                            <Typography.Small>v{pkg.version}</Typography.Small>
                        </div>
                    )}
                    <Button asChild size="icon" variant="outline">
                        <Link href="/settings" underline="none" showExternalIcon={false}>
                            <LuSettings />
                        </Link>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
