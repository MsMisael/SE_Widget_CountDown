

function converterTempo(arr) {
    let horas = parseInt(arr[0]);
    let minutos = parseInt(arr[1]);
    let segundos = parseInt(arr[2]);

    if (horas < 0 || minutos < 0 || segundos < 0) {
        return "Formato de tempo inválido: não pode haver valores negativos.";
    }

    let totalMinutos = (horas * 60) + minutos;
    var minutosFormatados = totalMinutos < 10 ? "0" + Math.round(totalMinutos) : Math.round(totalMinutos);
    var segundosFormatados = segundos < 10 ? "0" + Math.round(segundos) : Math.round(segundos);

    return [minutosFormatados, segundosFormatados, false];
}

function diffInSeconds(date1, date2) {
    const date = date2 || new Date()
    const diff = date1.getTime() - date.getTime()
    return Math.floor(diff / 1000);
}