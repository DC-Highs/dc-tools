import { emptyKey } from "./constants.helper"

export const cleanFormData = <T extends Record<string, any>>(data: T): T => {
    const cleanedData = { ...data }

    for (const key in cleanedData) {
        if (cleanedData[key] === emptyKey) {
            delete cleanedData[key]
        }
    }

    return cleanedData
}
