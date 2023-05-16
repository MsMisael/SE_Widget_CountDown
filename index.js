
function diffInSeconds(date1, date2) {
    const date = date2 || new Date()
    const diff = date1.getTime() - date.getTime()
    return Math.floor(diff / 1000);
}