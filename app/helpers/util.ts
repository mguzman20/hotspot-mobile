
export function capitalize(s: string): string {
    if (s == null) return s;
    return s.substring(0, 1).toUpperCase() + s.substring(1)
}


export function formatDate(date?: Date): string {
    if (!date) return "-"
    const d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}
