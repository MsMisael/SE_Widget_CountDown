
const state = {}
let globalSaveTimeout
let globalGhostTimeout




async function loadState(){
  
    const storedData = await SE_API.store.get('timer')
    state.timerCountStarts = new Date(storedData.timerCountStarts)
    state.totals = storedData.totals
    updateSteps()
    
  }
  async function saveState() { 
            clearTimeout(globalSaveTimeout)
        globalSaveTimeout =    setTimeout(async ()=>{ 
          globalSaveTimeout = true
    await SE_API.store.set('timer', {timerCountStarts: state.timerCountStarts,totals: state.totals})
            },1000)
  }

  
function createState(fieldData) {

    state.target = fieldData.target
    state.time = fieldData.time
    state.initialTime = fieldData.initialTime
    state.includeTips = fieldData.includeTips === "yes"
    state.timerCountStarts = new Date()
  	state.multiplyTimeFunction = fieldData.multiplyTimeFunction 

    state.headerLabel1 = Number(fieldData.headerLabel1)
    state.headerLabel2 = Number(fieldData.headerLabel2)
    state.headerLabel3 = Number(fieldData.headerLabel3)

    state.totals = { tips: 0,subs:0,cheers:0 }
    state.amountsRate = { tips: fieldData.amountPerTip,subs: fieldData.amountPerSub,cheers:fieldData.amountPerCheer }
    state.includes = { tips: fieldData.includeTips === "yes",subs:fieldData.includeSubs === "yes",cheers: fieldData.includeCheers=== "yes"}

    state.timesObj = createTimesObj(state.target, state.time, state.initialTime, state.headerLabel1, state.headerLabel2, state.headerLabel3,state.multiplyTimeFunction)
    state.currentStep = state.timesObj[0]
  	state.nextStep = state.timesObj[1] 
  	state.ghostMode = Boolean(fieldData.enableGhostMode)
  	state.ghostModeTimeout = Number(fieldData.ghostModeTimeout)
    state.hideHeadersMode = Boolean(fieldData.hideHeadersMode)
  	state.ghostModeRefreshTimeout = Number(fieldData.ghostModeRefreshTimeout)
}

function configHeaders(fieldData) {

  	
    $('#timerContainer').addClass(fieldData.headerHorizontalAlign.toLowerCase())
    $('#timerContainer').addClass(fieldData.headerVerticalAlign.toLowerCase()) 
    Number(fieldData.headerLabel1) > 0 ? $('#first #timer .label').text(`${fieldData.headerLabel1}X`) : $('#first').fadeIn()
    Number(fieldData.headerLabel2) > 0 ? $('#second #timer .label').text(`${fieldData.headerLabel2}X`) : $('#second').fadeIn()
    Number(fieldData.headerLabel3) > 0 ? $('#third #timer .label').text(`${fieldData.headerLabel3}X`) : $('#third').fadeIn()

    updateHeaders()
}



//------------------------------------->
function segundosParaTempo(segundos) {
    var horas = Math.floor(Math.abs(segundos) / 3600);
    var minutos = Math.floor((Math.abs(segundos) - (horas * 3600)) / 60);
    var segundosRestantes = Math.abs(segundos) % 60;
    var negativo = segundos < 0;
    var horasFormatadas = Number(Math.round(horas)) < 10 ? "0" + Math.round(horas) : Math.round(horas);
    var minutosFormatados = Number(Math.round(minutos)) < 10 ? "0" + Math.round(minutos) : Math.round(minutos);
    var segundosFormatados =  Math.round(segundosRestantes)  < 10 ? "0" + Math.round(segundosRestantes) : Math.round(segundosRestantes);
    
    return [horasFormatadas, minutosFormatados, segundosFormatados, negativo];
}

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