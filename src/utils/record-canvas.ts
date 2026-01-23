import { getVideoFileExtension } from "./get-video-file-extension.util"
import type { VideoMimeType } from "@/enums/video-mime-type.enum"

type RecordCanvasOptions = {
    canvas: HTMLCanvasElement
    duration: number
    mimeType: VideoMimeType
    fileNameWithoutExtension: string
}

export function recordCanvas({
    canvas,
    duration,
    mimeType,
    fileNameWithoutExtension,
}: RecordCanvasOptions): Promise<void> {
    const recordedChunks: Blob[] = []
    const fileExtension = getVideoFileExtension(mimeType)

    return new Promise<void>((resolve) => {
        const mediaStream = canvas.captureStream()
        const mediaRecorder = new MediaRecorder(mediaStream)

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mimeType })
            const url = URL.createObjectURL(blob)

            const link = document.createElement("a")

            link.style.display = "none"
            link.href = url
            link.download = `${fileNameWithoutExtension}.${fileExtension}`
            link.click()

            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            }, 100)

            resolve()
        }

        mediaRecorder.start()

        setTimeout(() => mediaRecorder.stop(), duration)
    })
}
