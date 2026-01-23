export function toTitleCase(text: string): string {
    return (
        text
            // quebra Texto1 → Texto 1
            .replace(/([a-zA-Z])(\d)/g, "$1 $2")
            .replace(/(\d)([a-zA-Z])/g, "$1 $2")
            // quebra camelCase / PascalCase
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            // normaliza espaços
            .replace(/\s+/g, " ")
            .trim()
            // Title Case
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")
    )
}
