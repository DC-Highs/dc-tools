import { staticServerPort } from "./constants"

export function toAppUrl(filePath: string) {
    const normalized = filePath.replace(/\\/g, "/")
    return `http://localhost:${staticServerPort}/${encodeURI(normalized)}`
}
