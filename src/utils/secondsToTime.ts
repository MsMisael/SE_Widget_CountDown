


export default function secondsToTime(seconds: number): [string, string, string, boolean] {
    const hours = Math.floor(Math.abs(seconds) / 3600);
    const minutes = Math.floor((Math.abs(seconds) - hours * 3600) / 60);
    const remainingSeconds = Math.abs(seconds) % 60;
    const isNegative = seconds < 0;
  
    const formattedHours = Number(Math.round(hours)) < 10 ? "0" + Math.round(hours) : Math.round(hours).toString();
    const formattedMinutes = Number(Math.round(minutes)) < 10 ? "0" + Math.round(minutes) : Math.round(minutes).toString();
    const formattedSeconds = Math.round(remainingSeconds) < 10 ? "0" + Math.round(remainingSeconds) : Math.round(remainingSeconds).toString();
  
    return [formattedHours, formattedMinutes, formattedSeconds, isNegative];
  }
  