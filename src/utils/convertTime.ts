
declare type arrTimes = [string | number, string | number, string | number, boolean]

export default function convertTime(arr: arrTimes): [string | number, string | number, boolean] {
    let hours = Number(arr[0])
    let minutes = Number(arr[1])
    let seconds = Number(arr[2])

    if (hours < 0 || minutes < 0 || seconds < 0) {
        return ["xx", "xx", true];
    }

    let totalMinutes = hours * 60 + minutes;
    let formattedMinutes = totalMinutes < 10 ? "0" + Math.round(totalMinutes) : Math.round(totalMinutes).toString();
    let formattedSeconds = seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds).toString();

    return [formattedMinutes, formattedSeconds, arr[3]];
}
