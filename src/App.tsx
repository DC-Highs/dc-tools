import { Routes, Route } from "react-router-dom"
import type { FC } from "react"

import DragonSpineAnimationUrlParserPage from "@/pages/url-tools/dragon-spine-animation-url-parser/dragon-spine-animation-url-parser.page"
import DragonFlashAnimationUrlParserPage from "@/pages/url-tools/dragon-flash-animation-url-parser/dragon-flash-animation-url-parser.page"
import DragonThumbnailUrlParserPage from "@/pages/url-tools/dragon-thumbnail-url-parser/dragon-thumbnail-url-parser.page"
import DragonSpriteUrlParserPage from "@/pages/url-tools/dragon-sprite-url-parser/dragon-sprite-url-parser.page"
import DragonSpineAnimationPage from "@/pages/assets/dragons/animations/spine/dragon-spine-animation.page"
import DragonFlashAnimationPage from "@/pages/assets/dragons/animations/flash/dragon-flash-animation.page"
import DragonSpineAnimationPlayerPage from "@/pages/animation-players/spine/spine.page"
import FindAllDragonFilesPage from "@/pages/assets/dragons/all/find-all-dragon-files.page"
import LocalizationFetcherPage from "@/pages/config/localization-fetcher/localization-fetcher.page"
import DecorationThumbnailPage from "@/pages/assets/decorations/thumbnail/decoration-thumbnail.page"
import BuildingThumbnailPage from "@/pages/assets/buildings/thumbnail/building-thumbnail.page"
import HabitatThumbnailPage from "@/pages/assets/habitats/thumbnail/habitat-thumbnail.page"
import DecorationSpritePage from "@/pages/assets/decorations/sprite/decoration-sprite.page"
import DragonThumbnailPage from "@/pages/assets/dragons/thumbnail/dragon-thumbnail.page"
import BuildingSpritePage from "@/pages/assets/buildings/sprite/building-sprite.page"
import ConfigFetcherPage from "@/pages/config/config-fetcher/config-fetcher.page"
import IslandPackagePage from "@/pages/assets/islands/package/island-package.page"
import HabitatSpritePage from "@/pages/assets/habitats/sprite/habitat-sprite.page"
import AppSidebar from "@/components/layout/app/app-sidebar"
import DragonSpritePage from "@/pages/assets/dragons/sprite/dragon-sprite.page"
import SettingsPage from "@/pages/settings/settings.page"
import ReleasesPage from "@/pages/releases/releases.page"
import ChestSpritePage from "@/pages/assets/chests/sprite/chest-sprite.page"
import { SidebarTrigger } from "@/components/ui/sidebar"
import SoundMusicPage from "@/pages/assets/sounds/music/sound-music.page"
import { Toaster } from "@/components/ui/sonner"
import HomePage from "@/pages/home/home.page"
import Providers from "@/providers"

const App: FC = () => {
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
                        <Route path="/assets/decorations/sprite" element={<DecorationSpritePage />} />
                        <Route path="/assets/decorations/thumbnail" element={<DecorationThumbnailPage />} />
                        <Route path="/assets/chests/sprite" element={<ChestSpritePage />} />
                        <Route path="/assets/habitats/sprite" element={<HabitatSpritePage />} />
                        <Route path="/assets/habitats/thumbnail" element={<HabitatThumbnailPage />} />
                        <Route path="/assets/islands/package" element={<IslandPackagePage />} />
                        <Route path="/assets/sounds/music" element={<SoundMusicPage />} />
                        <Route path="/assets/dragons/all" element={<FindAllDragonFilesPage />} />
                        <Route path="/releases" element={<ReleasesPage />} />
                        <Route path="/url-tools/dragon-sprite-url-parser" element={<DragonSpriteUrlParserPage />} />
                        <Route
                            path="/url-tools/dragon-thumbnail-url-parser"
                            element={<DragonThumbnailUrlParserPage />}
                        />
                        <Route
                            path="/url-tools/dragon-flash-animation-url-parser"
                            element={<DragonFlashAnimationUrlParserPage />}
                        />
                        <Route
                            path="/url-tools/dragon-spine-animation-url-parser"
                            element={<DragonSpineAnimationUrlParserPage />}
                        />
                        <Route path="/config/config-fetcher" element={<ConfigFetcherPage />} />
                        <Route path="/config/localization-fetcher" element={<LocalizationFetcherPage />} />
                        <Route path="/animation-players/spine" element={<DragonSpineAnimationPlayerPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </div>
            </main>
            <Toaster />
        </Providers>
    )
}

export default App
