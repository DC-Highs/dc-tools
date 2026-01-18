import { BrowserRouter } from "react-router-dom"
import type { FC, ReactNode } from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

type Props = {
    children: ReactNode
}

const Providers: FC<Props> = ({ children }) => {
    return (
        <BrowserRouter>
            <SidebarProvider>{children}</SidebarProvider>
        </BrowserRouter>
    )
}

export default Providers
