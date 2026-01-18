import { Routes, Route } from "react-router-dom"

import DragonSpineAnimationPage from "./pages/assets/dragon-spine-animation"
import DragonFlashAnimationPage from "./pages/assets/dragon-flash-animation"
import BuildingThumbnailPage from "./pages/assets/building-thumbnail"
import DragonThumbnailPage from "./pages/assets/dragon-thumbnail"
import BuildingSpritePage from "./pages/assets/building-sprite"
import AppSidebar from "./components/layout/app/app-sidebar"
import DragonSpritePage from "./pages/assets/dragon-sprite"
import { SidebarTrigger } from "./components/ui/sidebar"
import { Toaster } from "./components/ui/sonner"
import HomePage from "./pages/home"
import Providers from "./providers"

function App() {
    return (
        <Providers>
            <AppSidebar />
            <main className="w-full px-6">
                <div className="h-16 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <SidebarTrigger />
                        <span className="text-xs">Menu</span>
                    </div>
                </div>
                <div className="px-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/assets/dragons/sprite" element={<DragonSpritePage />} />
                        <Route path="/assets/dragons/thumbnail" element={<DragonThumbnailPage />} />
                        <Route path="/assets/dragons/animations/flash" element={<DragonFlashAnimationPage />} />
                        <Route path="/assets/dragons/animations/spine" element={<DragonSpineAnimationPage />} />
                        <Route path="/assets/buildings/sprite" element={<BuildingSpritePage />} />
                        <Route path="/assets/buildings/thumbnail" element={<BuildingThumbnailPage />} />
                    </Routes>
                </div>
            </main>
            <Toaster />
        </Providers>
    )
}

export default App
