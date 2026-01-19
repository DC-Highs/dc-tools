import { HashRouter } from "react-router-dom"
import type { FC, ReactNode } from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

type Props = {
    children: ReactNode
}

const Providers: FC<Props> = ({ children }) => {
    return (
        <HashRouter>
            <SidebarProvider>{children}</SidebarProvider>
        </HashRouter>
    )
}

export default Providers
