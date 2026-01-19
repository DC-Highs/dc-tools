import { useEffect, useRef, type FC } from "react"
import { toast } from "sonner"

interface Props {
    src: string
    width?: number | string
    height?: number | string
}

const FlashPreview: FC<Props> = ({ src, width = 500, height = 500 }) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let isCancelled = false

        const loadFlash = async () => {
            if (!window.RufflePlayer) {
                console.error("Ruffle has not yet been uploaded via CDN.")
                return
            }

            try {
                const animationFetchToastId = toast.loading("Fetching for animation file...")

                const response = await window.electronAPI.request<ArrayBuffer>({
                    url: src,
                    headers: {
                        Accept: "application/x-shockwave-flash",
                    },
                })

                toast.dismiss(animationFetchToastId)
                toast.success("File successfully retrieved!")

                if (isCancelled || !containerRef.current) return

                const ruffle = window.RufflePlayer.newest()
                const player = ruffle.createPlayer()

                containerRef.current.innerHTML = ""
                containerRef.current.appendChild(player)
                player.style.width = typeof width === "number" ? `${width}px` : width
                player.style.height = typeof height === "number" ? `${height}px` : height

                const playerLoadToastId = toast.loading("Loading Flash player...")

                await player.load({
                    data: response.data,
                    backgroundColor: "#ffffff",
                })

                toast.dismiss(playerLoadToastId)
                toast.success("Flash loaded successfully!")
            } catch (error) {
                console.error("Error loading SWF file:", error)
                toast.error("Error loading SWF file!")
            }
        }

        loadFlash()

        return () => {
            isCancelled = true
            if (containerRef.current) {
                containerRef.current.innerHTML = ""
            }
        }
    }, [src, width, height])

    return <div ref={containerRef} className="flash-container" style={{ width, height, overflow: "hidden" }} />
}

export default FlashPreview
