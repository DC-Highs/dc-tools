import { VideoMimeType } from "@/enums/video-mime-type.enum"

export const getVideoFileExtension = (mimeType: VideoMimeType): string => {
    if (mimeType === VideoMimeType.Mp4) {
        return "mp4"
    }

    return "webm"
}
