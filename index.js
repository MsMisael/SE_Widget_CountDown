
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

  

  async function loadEvent(listener, event,field) {
    let skip = true
  if (listener === 'follower') {
  } else if (listener === 'redemption') {
  } else if (listener === 'subscriber') {
      if (state.includes.subs) {
          state.totals.subs += event.amount
        skip = false
      }
  } else if (listener === 'host') {
  } else if (listener === 'cheer') {
      if (state.includes.cheers) {
          state.totals.cheers += event.amount
        skip = false
      } 
    } else if (listener === 'tip') {
      if (state.includes.tips) {
          state.totals.tips += event.amount
        skip = false
      }
    } else if (listener === 'raid') {

  }	else if (field === 'resetTimer') { 
      state.timerCountStarts = new Date()   
        skip = false
  }	else if (field === 'resetTotals') {   
        state.totals = { tips: 0,subs:0,cheers:0 } 
        skip = false
  }
 
    if(skip) return 
  await saveState()
   activateWidget()
  updateSteps()
  updateHeaders()
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

function updateSteps() {
    let stepsOfTips = 0
    let stepsOfSubs = 0
    let stepsOfCheers = 0
    if (state.includes.tips && state.amountsRate.tips > 0) {
         stepsOfTips = state.totals.tips / state.amountsRate.tips
    }    
  	if (state.includes.subs && state.amountsRate.subs > 0) {
        stepsOfSubs = state.totals.subs / state.amountsRate.subs  
    }
    	if (state.includes.cheers && state.amountsRate.cheers > 0) {
        stepsOfCheers = state.totals.cheers / state.amountsRate.cheers  
    }
	
  	const totalSteps = stepsOfCheers + stepsOfTips + stepsOfSubs
    state.currentStep = state.timesObj[(totalSteps > state.target ? state.target : totalSteps)]
    state.nextStep = state.timesObj[(totalSteps+1 > state.target ? state.target : totalSteps+1)]
  
}

function updateHeaders() {

	if(state.hideHeadersMode) $('#container').addClass('noheaders')
    $('#first #timer .minute').text(segundosParaTempo(state.nextStep.addTime1)[1])
    $('#first #timer .second').text(segundosParaTempo(state.nextStep.addTime1)[2])

    $('#second #timer .minute').text(converterTempo(segundosParaTempo(state.nextStep.addTime2))[0])
    $('#second #timer .second').text(converterTempo(segundosParaTempo(state.nextStep.addTime2))[1])

    $('#third #timer .minute').text(converterTempo(segundosParaTempo(state.nextStep.addTime3))[0])
    $('#third #timer .second').text(converterTempo(segundosParaTempo(state.nextStep.addTime3))[1])
 
    state.nextStep.addTime1 == 0 ? $('#first').fadeOut() : $('#first').fadeIn()
    state.nextStep.addTime2 == state.nextStep.addTime1 || state.nextStep.addTime2 == 0 ? $('#second').fadeOut() : $('#second').fadeIn()
    state.nextStep.addTime3 == state.nextStep.addTime2 || state.nextStep.addTime3 == 0 ? $('#third').fadeOut() : $('#third').fadeIn()
	state.currentStep.step == state.nextStep.step && $('#first').fadeOut()
}


function updateCountDown() {
    const countDownStartsTime = diffInSeconds(state.timerCountStarts) > 0 ? diffInSeconds(state.timerCountStarts) : 0
    const elapsedTime = diffInSeconds(new Date(), state.timerCountStarts) > 0 ? diffInSeconds(new Date(), state.timerCountStarts) : 0
    const aditionalTime = state.currentStep.stackTime
    const [hh, mm, ss, negative] = segundosParaTempo(countDownStartsTime + aditionalTime - elapsedTime)
  
    const hidehour = Number(hh) == 0
 
    $('#body #timer .hour').text(hidehour ? '' : negative ? '-' + hh : hh)
    $('#body #timer .hourmarker').text(hidehour ? '' : ':')
    $('#body #timer .minute').text(hidehour ? negative ? '-' + mm : mm : mm)
    $('#body #timer .second').text(ss)
}

function activateWidget() {
    if(state.ghostMode){
      $('#container').removeClass('ghost')
      
        clearTimeout(globalGhostTimeout)
      globalGhostTimeout = setTimeout(() => {
          $('#container').addClass('ghost') 
      }, state.ghostModeTimeout * 1000)
    }
  }
  
  function recusiveGhostmode(){
   
        if($('#container').hasClass('ghost')){
          activateWidget()
      } 
    
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