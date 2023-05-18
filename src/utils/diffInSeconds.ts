

export default function diffInSeconds(date1: Date, date2?: Date) {
    const date = date2 || new Date()
    const diff = date1.getTime() - date.getTime()
    return Math.floor(diff / 1000);
}