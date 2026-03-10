export const getVideoFileExtension = (videoType: "flash" | "spine"): string => {
    if (videoType === "flash") {
        return "mp4"
    }

    return "webm"
}
