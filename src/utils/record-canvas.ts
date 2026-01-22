export function recordCanvas(canvas: HTMLCanvasElement, duration: number) {
    const recordedChunks: Blob[] = []

    return new Promise<void>((resolve) => {
        const mediaStream = canvas.captureStream()
        const mediaRecorder = new MediaRecorder(mediaStream)

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" })
            const url = URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.style.display = "none"
            a.href = url
            a.download = `dragon-animation-${Date.now()}.webm`
            document.body.appendChild(a)
            a.click()

            setTimeout(() => {
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            }, 100)

            resolve()
        }

        mediaRecorder.start()

        setTimeout(() => mediaRecorder.stop(), duration)
    })
}