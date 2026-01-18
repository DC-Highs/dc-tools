import { LuUser, LuChevronUp, LuChevronDown, LuImage, LuMusic, LuSettings, LuFolder } from "react-icons/lu"
import { MdAnimation, MdOutlineTranslate } from "react-icons/md"
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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
        title: "Chest Sprite",
        url: "/assets/chests/sprite",
        icon: LuImage,
    },
    {
        title: "Chest Thumbnail",
        url: "/assets/chests/thumbnail",
        icon: LuImage,
    },
    {
        title: "Island Package",
        url: "/assets/islands/package",
        icon: LuImage,
    },
    {
        title: "Music",
        url: "/assets/sounds/music",
        icon: LuMusic,
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

const AppSidebar: FC = () => {
    const [assetsOpen, setAssetsOpen] = useState(false)
    const [configOpen, setConfigOpen] = useState(false)

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <div className="text-base flex items-center gap-2 font-semibold">
                                <FaDragon />
                                <span>DC Tools</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
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
                {/* <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <span>Game Config</span>
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
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible> */}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <LuUser /> Username
                                    <LuChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
