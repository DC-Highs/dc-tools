import { useEffect, useRef, useState, type Dispatch, type FC, type RefObject, type SetStateAction } from "react"
import { LuUpload, LuPlay, LuPause, LuCamera, LuImage } from "react-icons/lu"
import { PiRecordDuotone, PiRecordFill } from "react-icons/pi"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoMimeType } from "@/enums/video-mime-type.enum"
import type { ConvertAnimationResult } from "@/types/global"
import { toTitleCase } from "@/utils/to-title-case.util"
import { Typography } from "@/components/ui/typography"
import { recordCanvas } from "@/utils/record-canvas"
import { Spinner } from "@/components/ui/spinner"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Background =
    | {
          url: string
          color?: undefined
      }
    | {
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

type ControlsProps = {
    scale: number
    onScaleChange: Dispatch<SetStateAction<number>>
    position: Position
    onPositionChange: Dispatch<SetStateAction<Position>>
    isPlaying: boolean
    onIsPlayingChange: Dispatch<SetStateAction<boolean>>
    speed: number
    onSpeedChange: Dispatch<SetStateAction<number>>
    animations: string[]
    currentAnimation: string | null
    onCurrentAnimationChange: Dispatch<SetStateAction<string | null>>
    background: Background
    onBackgroundChange: Dispatch<SetStateAction<Background>>
    recordAnimationResolution: Resolution
    onRecordAnimationResolutionChange: Dispatch<SetStateAction<Resolution>>
    playerRef: RefObject<any>
}

const SpinePlayerControls: FC<ControlsProps> = ({
    scale,
    onScaleChange,
    position,
    onPositionChange,
    animations,
    currentAnimation,
    onCurrentAnimationChange,
    background,
    onBackgroundChange,
    isPlaying,
    onIsPlayingChange,
    speed,
    onSpeedChange,
    recordAnimationResolution,
    onRecordAnimationResolutionChange,
    playerRef,
}) => {
    const [recordAnimationDuration, onRecordAnimationDurationChange] = useState<number>(5000)
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [mimeType, setMimeType] = useState<VideoMimeType>(VideoMimeType.Webm)

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

            const link = document.createElement("a")

            link.href = url
            link.download = `dragon-snapshot-${Date.now()}.png`
            link.click()

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

        if (typeof playerRef.current.resize === "function") {
            playerRef.current.resize()
        }

        await new Promise((resolve) => setTimeout(resolve, 100))

        const recordingToastId = toast.loading("Recording animation...", {
            id: "record-animation",
        })

        try {
            await recordCanvas({
                canvas: canvas,
                duration: recordAnimationDuration,
                fileNameWithoutExtension: `dragon-animation-${Date.now()}`,
                mimeType,
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to record animation!")
        } finally {
            canvas.width = originalWidth
            canvas.height = originalHeight
            canvas.style.width = originalStyleWidth
            canvas.style.height = originalStyleHeight
            playerRef.current.autoResizeCanvas = originalAutoResizeCanvas

            if (typeof playerRef.current.resize === "function") {
                playerRef.current.resize()
            }

            setIsRecording(false)

            toast.dismiss(recordingToastId)
        }
    }

    const handleUplaodBackgroundImage = async () => {
        const imageUrl = await window.electronAPI.selectImage()

        if (imageUrl) {
            toast.success("Background image selected!")
            return onBackgroundChange({ url: imageUrl })
        }

        toast.warning("Image selection canceled!")
    }

    return (
        <div className="py-6">
            <Typography.H2 className="mb-6">Controls</Typography.H2>
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                    <Label>Animation</Label>
                    <Select value={currentAnimation ?? ""} onValueChange={onCurrentAnimationChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select animation" />
                        </SelectTrigger>
                        <SelectContent>
                            {animations.map((animation) => (
                                <SelectItem key={animation} value={animation}>
                                    {toTitleCase(animation)}
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
                        onChange={(event) => onScaleChange(Number(event.target.value))}
                        step={0.1}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Speed: {speed}x</Label>
                    <div className="flex gap-2 items-center">
                        <Slider
                            value={[speed]}
                            onValueChange={([val]) => onSpeedChange(val)}
                            min={0.1}
                            max={3}
                            step={0.1}
                            className="flex-1"
                        />
                        <Button variant="outline" size="icon" onClick={() => onIsPlayingChange(!isPlaying)}>
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
                            onChange={(e) => onPositionChange({ ...position, x: Number(e.target.value) })}
                        />
                        <Input
                            type="number"
                            placeholder="Y"
                            value={position.y}
                            onChange={(e) => onPositionChange({ ...position, y: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            className="w-12 h-10 p-1 cursor-pointer"
                            value={background.color === "transparent" ? "#ffffff" : background.color || "#ffffff"}
                            onChange={(e) => onBackgroundChange({ color: e.target.value })}
                            disabled={background.color === "transparent"}
                        />
                        <Input
                            type="text"
                            placeholder="#ffffff"
                            value={background.color === "transparent" ? "" : background.color || ""}
                            onChange={(e) => onBackgroundChange({ color: e.target.value })}
                            disabled={background.color === "transparent"}
                        />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id="transparent-bg"
                            checked={background.color === "transparent"}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    onBackgroundChange({ color: "transparent" })
                                } else {
                                    onBackgroundChange({ color: "#ffffff" })
                                }
                            }}
                        />
                        <Label
                            htmlFor="transparent-bg"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Transparent
                        </Label>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Background Image</Label>
                    <Button className="w-full" onClick={handleUplaodBackgroundImage}>
                        <LuImage className="mr-2" /> Upload Image
                    </Button>
                </div>
            </div>
            <Typography.H2 className="mb-6">Record & Canvas Config</Typography.H2>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={mimeType} onValueChange={(value: VideoMimeType) => setMimeType(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(VideoMimeType).map((format) => (
                                <SelectItem key={format} value={format}>
                                    {format}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Resolution (Width, Height)</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Width"
                            value={recordAnimationResolution.width}
                            onChange={(e) =>
                                onRecordAnimationResolutionChange({
                                    ...recordAnimationResolution,
                                    width: Number(e.target.value),
                                })
                            }
                        />
                        <Input
                            type="number"
                            placeholder="Height"
                            value={recordAnimationResolution.height}
                            onChange={(e) =>
                                onRecordAnimationResolutionChange({
                                    ...recordAnimationResolution,
                                    height: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Recording Duration (ms)</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={recordAnimationDuration}
                            onChange={(event) => onRecordAnimationDurationChange(Number(event.target.value))}
                        />
                        <Button
                            variant={isRecording ? "destructive" : "default"}
                            disabled={isRecording}
                            onClick={handleRecord}
                        >
                            {isRecording ? (
                                <>
                                    <PiRecordFill /> Recording...
                                </>
                            ) : (
                                <>
                                    <PiRecordDuotone /> Record
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Snapshot</Label>
                    <Button className="w-full" onClick={handleSnapshot}>
                        <LuCamera className="mr-2" /> Take Snapshot
                    </Button>
                </div>
            </div>
        </div>
    )
}

const DragonSpineAnimationPlayerPage: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [convertedAnimation, setConvertedAnimation] = useState<ConvertAnimationResult | null>(null)
    const [isConverting, setIsConverting] = useState<boolean>(false)
    const [background, setBackground] = useState<Background>({ color: "#ffffff" })
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
    const [scale, setScale] = useState<number>(1)
    const playerRef = useRef<any>(null)
    const [dragonAnimations, setDragonAnimations] = useState<string[]>([])
    const [currentDragonAnimation, setCurrentDragonAnimation] = useState<string | null>(null)
    const [recordAnimationResolution, setRecordAnimationResolution] = useState<Resolution>({ width: 1280, height: 720 })
    const [speed, setSpeed] = useState<number>(1)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const handleSelectFile = async () => {
        setIsConverting(true)

        const convertingToastId = toast.loading("Converting animation...")

        try {
            const result = await window.electronAPI.convertAnimation()

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
            ...(background.color
                ? {
                      backgroundColor: background.color === "transparent" ? "#00000000" : background.color,
                  }
                : {
                      backgroundImage: {
                          url: background.url,
                      },
                  }),
            viewport: {
                x: 0,
                y: 0,
                width: recordAnimationResolution.width,
                height: recordAnimationResolution.height,
            },
            success: (player: any) => {
                const animations = player.skeleton.data.animations.map((animation: any) => animation.name)

                setDragonAnimations(animations)

                if (!currentDragonAnimation) {
                    setCurrentDragonAnimation(animations[0])
                }

                player.setAnimation(currentDragonAnimation ?? animations[0], true)

                player.autoFit = true
                player.autoResizeCanvas = true
                player.autoResizeViewport = true

                setIsPlaying(true)
            },
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
                    <CardTitle>Dragon Spine Animation Player</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <div ref={containerRef} />
                    {convertedAnimation && (
                        <SpinePlayerControls
                            playerRef={playerRef}
                            background={background}
                            onBackgroundChange={setBackground}
                            animations={dragonAnimations}
                            currentAnimation={currentDragonAnimation}
                            onCurrentAnimationChange={setCurrentDragonAnimation}
                            isPlaying={isPlaying}
                            onIsPlayingChange={setIsPlaying}
                            position={position}
                            onPositionChange={setPosition}
                            recordAnimationResolution={recordAnimationResolution}
                            onRecordAnimationResolutionChange={setRecordAnimationResolution}
                            scale={scale}
                            onScaleChange={setScale}
                            speed={speed}
                            onSpeedChange={setSpeed}
                        />
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
        </div>
    )
}

export default DragonSpineAnimationPlayerPage
