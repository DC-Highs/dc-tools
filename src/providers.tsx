import { HashRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import type { FC, ReactNode } from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

type Props = {
    children: ReactNode
}

const Providers: FC<Props> = ({ children }) => {
    return (
        <HashRouter>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
        </HashRouter>
    )
}

export default Providers
