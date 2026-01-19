export function formatDate(dateString: string): string {
    const date = new Date(dateString)

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}
