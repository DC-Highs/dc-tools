import { StaticFileUrlPlatformPrefix, DragonStaticFileUrlParser, DragonPhase } from "@dchighs/dc-core"
import { LuCopy, LuRegex, LuUpload, LuPlay, LuPause, LuCamera } from "react-icons/lu"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useRef, useState, type FC } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ConvertAnimationResult } from "@/types/global"
import { Spinner } from "@/components/ui/spinner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { recordCanvas } from "../../utils/record-canvas"

type Background = {
    url: string
    color?: undefined
} | {
    url?: undefined
    color: string
}

type Position = {
    x: number
    y: number
}

type Resolution = {
    width: number
    height: number
}

const DragonSpineAnimationManipulatorPage: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [convertedAnimation, setConvertedAnimation] = useState<ConvertAnimationResult | null>(null)
    const [isConverting, setIsConverting] = useState<boolean>(false)
    const [background, setBackground] = useState<Background>({ color: "#ffffff" })
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
    const [scale, setScale] = useState<number>(1)
    const playerRef = useRef<any>(null)
    const [dragonAnimation, setDragonAnimation] = useState<string[]>([])
    const [currentDragonAnimation, setCurrentDragonAnimation] = useState("")
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [recordAnimationDuration, setRecordAnimationDuration] = useState<number>(5000)
    const [recordAnimationResolution, setRecordAnimationResolution] = useState<Resolution>({ width: 1280, height: 720 })
    const [speed, setSpeed] = useState<number>(1)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const handleSelectFile = async () => {
        setIsConverting(true)

        const convertingToastId = toast.loading("Converting animation...", {
            id: "convert-animation",
        })

        try {
            const result = await window.electronAPI.convertAnimation()

            console.log(result)

            if (!result) {
                toast.warning("File selection canceled!")
                return
            }

            setConvertedAnimation(result)
        } catch (error) {
            console.error(error)
            toast.error("Failed to convert animation!")
        } finally {
            setIsConverting(false)
            toast.dismiss(convertingToastId)
        }
    }

    const handleSnapshot = () => {
        if (!playerRef.current || !playerRef.current.canvas) return

        const canvas = playerRef.current.canvas as HTMLCanvasElement

        const originalWidth = canvas.width
        const originalHeight = canvas.height
        const originalStyleWidth = canvas.style.width
        const originalStyleHeight = canvas.style.height
        const originalAutoResizeCanvas = playerRef.current.autoResizeCanvas

        playerRef.current.autoResizeCanvas = false
        canvas.width = recordAnimationResolution.width
        canvas.height = recordAnimationResolution.height
        canvas.style.width = `${recordAnimationResolution.width}px`
        canvas.style.height = `${recordAnimationResolution.height}px`

        requestAnimationFrame(() => {
            const url = canvas.toDataURL("image/png")

            const a = document.createElement("a")
            a.href = url
            a.download = `dragon-snapshot-${Date.now()}.png`
            a.click()

            canvas.width = originalWidth
            canvas.height = originalHeight
            canvas.style.width = originalStyleWidth
            canvas.style.height = originalStyleHeight
            playerRef.current.autoResizeCanvas = originalAutoResizeCanvas
        })
    }

    const handleRecord = async () => {
        if (!playerRef.current || !playerRef.current.canvas) {
            toast.error("Player or canvas not found!")
            return
        }

        setIsRecording(true)

        const canvas = playerRef.current.canvas
        const originalWidth = canvas.width
        const originalHeight = canvas.height
        const originalStyleWidth = canvas.style.width
        const originalStyleHeight = canvas.style.height
        const originalAutoResizeCanvas = playerRef.current.autoResizeCanvas

        playerRef.current.autoResizeCanvas = false
        canvas.width = recordAnimationResolution.width
        canvas.height = recordAnimationResolution.height
        canvas.style.width = `${recordAnimationResolution.width}px`
        canvas.style.height = `${recordAnimationResolution.height}px`

        if (typeof playerRef.current.resize === 'function') {
            playerRef.current.resize()
        }

        await new Promise(resolve => setTimeout(resolve, 100))

        const recordingToastId = toast.loading("Recording animation...", {
            id: "record-animation",
        })

        try {
            await recordCanvas(canvas, recordAnimationDuration)
        } catch (error) {
            console.error(error)
            toast.error("Failed to record animation!")
        } finally {
            canvas.width = originalWidth
            canvas.height = originalHeight
            canvas.style.width = originalStyleWidth
            canvas.style.height = originalStyleHeight
            playerRef.current.autoResizeCanvas = originalAutoResizeCanvas

            if (typeof playerRef.current.resize === 'function') {
                playerRef.current.resize()
            }

            setIsRecording(false)
            toast.dismiss(recordingToastId)
        }
    }

    useEffect(() => {
        if (!containerRef.current) return
        if (!window.spine) return
        if (playerRef.current) return
        if (!convertedAnimation) return

        const player = new window.spine.SpinePlayer(containerRef.current, {
            skelUrl: convertedAnimation.skel,
            atlasUrl: convertedAnimation.atlas,
            alpha: true,
            showControls: false,
            preserveDrawingBuffer: true,
            ...(background.color ? {
                backgroundColor: background.color === "transparent" ? "#00000000" : background.color
            } : {
                background: {
                    url: background.url,
                }
            }),
            viewport: {
                x: 0,
                y: 0,
                width: recordAnimationResolution.width,
                height: recordAnimationResolution.height,
            },
            success: (player: any) => {
                const animations = player.skeleton.data.animations.map(
                    (animation: any) => animation.name
                )

                setDragonAnimation(animations)
                setCurrentDragonAnimation(animations[0])

                player.setAnimation(animations[0], true)

                player.autoFit = true
                player.autoResizeCanvas = true
                player.autoResizeViewport = true

                setIsPlaying(true)
            }
        })

        playerRef.current = player

        return () => {
            if (player?.canvas?.parentNode) {
                player.stopRequestAnimationFrame = true
                player.canvas.parentNode.removeChild(player.canvas)
            }

            playerRef.current = null
        }
    }, [background, convertedAnimation, recordAnimationResolution])

    useEffect(() => {
        if (!playerRef.current || !playerRef.current.skeleton) return
        playerRef.current.skeleton.x = position.x
        playerRef.current.skeleton.y = position.y
    }, [playerRef.current, position.x, position.y])

    useEffect(() => {
        if (!playerRef.current || !currentDragonAnimation) return
        playerRef.current.setAnimation(currentDragonAnimation, true)
    }, [currentDragonAnimation])

    useEffect(() => {
        if (!playerRef.current || !playerRef.current.skeleton) return
        playerRef.current.skeleton.scaleX = scale * 5
        playerRef.current.skeleton.scaleY = scale * 5
    }, [playerRef.current, scale, currentDragonAnimation])

    useEffect(() => {
        if (!playerRef.current) return
        playerRef.current.paused = !isPlaying
    }, [isPlaying])

    useEffect(() => {
        if (!playerRef.current) return
        playerRef.current.speed = speed
    }, [speed])

    return (
        <div className="space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle>Dragon Spine Animation Manipulator</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* <div className="flex flex-col space-y-4">
                        <Label>Image URL</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="e.g. https://dci-static-s1.socialpointgames.com/static/dragoncity/assets/sprites/1000_dragon_nature_1.swf"
                            />
                        </div>
                    </div> */}
                    <Button onClick={handleSelectFile} className="mt-6" disabled={isConverting}>
                        {isConverting ? (
                            <>
                                <Spinner /> Converting animation...
                            </>
                        ) : (
                            <>
                                <LuUpload /> Select file
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Parsing result</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* {convertedAnimation && (
                        <>
                            <img src={convertedAnimation.png} alt="Spine texture" />
                            <img src={convertedAnimation.mapPng} alt="Spine texture map" />
                        </>
                    )} */}
                    <div ref={containerRef} />

                    {convertedAnimation && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 border-t pt-6">
                            <div className="space-y-2">
                                <Label>Animation</Label>
                                <Select value={currentDragonAnimation} onValueChange={setCurrentDragonAnimation}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select animation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dragonAnimation.map((animation) => (
                                            <SelectItem key={animation} value={animation}>
                                                {animation}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Scale</Label>
                                <Input
                                    type="number"
                                    value={scale}
                                    onChange={(e) => setScale(Number(e.target.value))}
                                    step={0.1}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Speed</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={speed}
                                        onChange={(e) => setSpeed(Number(e.target.value))}
                                        step={0.1}
                                        min={0.1}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <LuPause /> : <LuPlay />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Position (X, Y)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="X"
                                        value={position.x}
                                        onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Y"
                                        value={position.y}
                                        onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Resolution</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Width"
                                        value={recordAnimationResolution.width}
                                        onChange={(e) => setRecordAnimationResolution({ ...recordAnimationResolution, width: Number(e.target.value) })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Height"
                                        value={recordAnimationResolution.height}
                                        onChange={(e) => setRecordAnimationResolution({ ...recordAnimationResolution, height: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        value={background.color === "transparent" ? "#ffffff" : (background.color || "#ffffff")}
                                        onChange={(e) => setBackground({ color: e.target.value })}
                                        disabled={background.color === "transparent"}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="#ffffff"
                                        value={background.color === "transparent" ? "" : (background.color || "")}
                                        onChange={(e) => setBackground({ color: e.target.value })}
                                        disabled={background.color === "transparent"}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Checkbox
                                        id="transparent-bg"
                                        checked={background.color === "transparent"}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setBackground({ color: "transparent" })
                                            } else {
                                                setBackground({ color: "#ffffff" })
                                            }
                                        }}
                                    />
                                    <Label htmlFor="transparent-bg" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Transparent
                                    </Label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Recording Duration (ms)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={recordAnimationDuration}
                                        onChange={(e) => setRecordAnimationDuration(Number(e.target.value))}
                                    />
                                    <Button
                                        variant={isRecording ? "destructive" : "secondary"}
                                        disabled={isRecording}
                                        onClick={handleRecord}
                                    >
                                        {isRecording ? "Recording..." : "Record"}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Snapshot</Label>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    onClick={handleSnapshot}
                                >
                                    <LuCamera className="mr-2" /> Take Snapshot
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <style>{`
                .SpinePlayer__container{
                    display: flex;
                    width: 100vw;
                    justify-content: center;
                    align-items: center;
                    margin-top: 17px;
                }

                .SpinePlayer__canvas_container{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .spine-player-canvas{
                    /* width: 1280px;
                    height: 720px; */
                    width: 100%;
                    margin: 0 auto;
                }

                .spine-player-controls{
                    display: none;
                }

                .SpinePlayer__logo{
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    opacity: 0.3;
                }

                .SpinePlayer__canvas_container_buttons_container{
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                }

                .SpinePlayer__canvas_container_secondstorecord_container, .SpinePlayer__canvas_container_setscale_input_container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .SpinePlayer__canvas_container_setscale_container, .SpinePlayer__canvas_container_changeanim_container{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .SpinePlayer__canvas_container_changeanim_container{
                    flex-direction: column;
                }

                .SpinePlayer__canvas_container_secondstorecord_container input[type="number"], .SpinePlayer__canvas_container_setscale_container input[type="number"]{
                    width: 60px;
                    height: 20px;
                    margin-top: 18px;
                    /* color: #fafafa;*/
                }

                .SpinePlayer__canvas_container_secondstorecord_container label, .SpinePlayer__canvas_container_setscale_container label{
                    font-size: 1.55rem;
                }

                .SpinePlayer__canvas_container_changeanim_container label{
                    margin-top: 6px;
                    font-size: 1.56rem;
                }

                .SpinePlayer__canvas_container_changeanim_btn, .SpinePlayer__canvas_container_startrecording_btn,
                .SpinePlayer__canvas_container_setscale_btn, .SpinePlayer__canvas_container_vpsettings_btn,
                .vpsettings__apply_btn, .Home__output_video_link{
                    display: flex;
                    width: 145px;
                    height: 45px;
                    
                    margin-top: 16px;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    color: #fafafa;
                    background-color: #212129;
                    border: none;
                    border-radius: 6px;
                }

                .SpinePlayer__canvas_container_changeanim_btn:hover, .SpinePlayer__canvas_container_startrecording_btn:hover,
                .SpinePlayer__canvas_container_vpsettings_btn:hover, .SpinePlayer__canvas_container_setscale_btn:hover,
                .Home__output_video_link:hover{
                    background-color: #2c2c35;
                }
            `}</style>
        </div >
    )
}

export default DragonSpineAnimationManipulatorPage
