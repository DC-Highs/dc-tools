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
import { Link } from "react-router-dom"
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
import pkg from "@/../package.json"

const assetItems = [
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

const configItems = [
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

const urlToolsItems = [
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

const animationPlayerItems = [
    {
        title: "Spine Player",
        url: "/animation-players/spine",
        icon: MdAnimation,
    },
]

const gitHubItems = [
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
                    to="/"
                >
                    <FaDragon width={24} height={24} />
                    {open && (
                        <div>
                            <div className="font-bold text-xl max-lg:text-base text-nowrap">DC Tools</div>
                            <div className="text-xs flex gap-1 text-nowrap">
                                <span>Powered by</span>
                                <span className="font-semibold">DC Highs</span>
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
                                    <span>Assets Downloader</span>
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
                                    {assetItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
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
                                    <span>URL Tools</span>
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
                                    {urlToolsItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
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
                                    <span>Game Config</span>
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
                                    {configItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
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
                                    <span>Animation Players</span>
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
                                    {animationPlayerItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
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
                                    <span>GitHub</span>
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
                                    {gitHubItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                {item.url.startsWith("http") ? (
                                                    <a href={item.url} target="_blank">
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </a>
                                                ) : (
                                                    <Link to={item.url}>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                )}
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
                {open && (
                    <div className="flex items-center justify-center gap-2 text-xs font-mono overflow-x-hidden text-nowrap">
                        <span>App version: v{pkg.version}</span>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
