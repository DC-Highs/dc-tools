import { VideoMimeType } from "@/enums/video-mime-type.enum"

export function getVideoFileExtension(mimeType: VideoMimeType): string {
    switch (mimeType) {
        case VideoMimeType.Mp4:
            return "mp4"

        case VideoMimeType.Webm:
        case VideoMimeType.WebmVp8:
        case VideoMimeType.WebmVp9:
        case VideoMimeType.WebmAv1:
            return "webm"

        default:
            return "webm"
    }
}
