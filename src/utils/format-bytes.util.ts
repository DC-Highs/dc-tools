export const formatBytes = (bytes: number, decimalPlaces = 2) => {
    if (bytes === 0) return "0 Bytes"
    const kilo = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const index = Math.floor(Math.log(bytes) / Math.log(kilo))

    return parseFloat((bytes / Math.pow(kilo, index)).toFixed(decimalPlaces)) + " " + sizes[index]
}
