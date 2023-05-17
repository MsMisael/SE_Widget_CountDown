
const state = {}


window.addEventListener('onWidgetLoad', onWidgetLoad)
window.addEventListener('onEventReceived', onEventReceived)

async function onWidgetLoad(obj) {

  const fieldData = obj.detail.fieldData
  createState(fieldData)
  await loadState()
  await saveState()
  configHeaders(fieldData)
  activateWidget()
  setInterval(() => {
    updateCountDown()
  }, 1000)
  setInterval(() => {
    recusiveGhostmode()
  }, (state.ghostModeRefreshTimeout + state.ghostModeTimeout) * 1000)
}

function onEventReceived(obj) {
  if (!obj.detail.event) {
    return;
  }
  if (typeof obj.detail.event.itemId !== "undefined") {
    obj.detail.listener = "redemption-latest"
  }

  if (obj.detail.event.data?.key === 'customWidget.timer') {
    if (!state.saveTimeout) {
      loadState()
    }
    return;
  }
  const listener = obj.detail.listener.split("-")[0];
  const field = obj.detail.event.field
  const event = obj.detail.event;
  loadEvent(listener, event, field)
}


async function loadState() {

  const storedData = await SE_API.store.get('timer')
  state.timerCountStarts = new Date(storedData.timerCountStarts)
  state.totals = storedData.totals
  updateSteps()

}
async function saveState() {
  clearTimeout(state.saveTimeout)
  state.saveTimeout = setTimeout(async () => {
    state.saveTimeout = true
    await SE_API.store.set('timer', { timerCountStarts: state.timerCountStarts, totals: state.totals })
  }, 1000)
}

const events = {
  follower: (event) => { },
  redemption: (event) => { },
  subscriber: (event) => {
    if (state.includes.subs) {
      state.totals.subs += event.amount
      return false
    } else {
      return true
    }
  },
  host: (event) => { },
  cheer: (event) => {
    if (state.includes.cheers) {
      state.totals.cheers += event.amount
      return false
    } else {
      return true
    }
  },
  tip: (event) => {
    if (state.includes.tips) {
      state.totals.tips += event.amount
      return false
    } else {
      return true
    }
  },
  raid: (event) => { },
  "widget-button": (event) => {
    if (field === 'resetTimer') {
      state.timerCountStarts = new Date()
      return false
    } else if (field === 'resetTotals') {
      state.totals = { tips: 0, subs: 0, cheers: 0 }
      return false
    } else {
      return true
    }
  }
}


async function loadEvent(listener, event, field) {
  let skip = true

  if (events[listener]) {
    skip = events[listener](event)
  }

  if (skip) return
  await saveState()
  activateWidget()
  updateSteps()
  updateHeaders()
}

function createState(fieldData) {

  state.saveTimeout
  state.ghostTimeout
  state.target = fieldData.target
  state.time = fieldData.time
  state.initialTime = fieldData.initialTime
  state.includeTips = fieldData.includeTips === "yes"
  state.timerCountStarts = new Date()
  state.multiplyTimeFunction = fieldData.multiplyTimeFunction

  state.headerLabel1 = Number(fieldData.headerLabel1)
  state.headerLabel2 = Number(fieldData.headerLabel2)
  state.headerLabel3 = Number(fieldData.headerLabel3)

  state.totals = { tips: 0, subs: 0, cheers: 0 }
  state.amountsRate = { tips: fieldData.amountPerTip, subs: fieldData.amountPerSub, cheers: fieldData.amountPerCheer }
  state.includes = { tips: fieldData.includeTips === "yes", subs: fieldData.includeSubs === "yes", cheers: fieldData.includeCheers === "yes" }

  state.timesObj = createTimesObj(state.target, state.time, state.initialTime, state.headerLabel1, state.headerLabel2, state.headerLabel3, state.multiplyTimeFunction)
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
  state.nextStep = state.timesObj[(totalSteps + 1 > state.target ? state.target : totalSteps + 1)]

}

function updateHeaders() {

  if (state.hideHeadersMode) $('#container').addClass('noheaders')
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
  if (state.ghostMode) {
    $('#container').removeClass('ghost')

    clearTimeout(state.ghostTimeout)
    state.ghostTimeout = setTimeout(() => {
      $('#container').addClass('ghost')
    }, state.ghostModeTimeout * 1000)
  }
}

function recusiveGhostmode() {

  if ($('#container').hasClass('ghost')) {
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
  var segundosFormatados = Math.round(segundosRestantes) < 10 ? "0" + Math.round(segundosRestantes) : Math.round(segundosRestantes);

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
function createTimesObj(target, time, initialTime, stepsTime1, stepsTime2, stepsTime3, paramsKey) {
  function calcprogress(current, max) {
    return current / max
  }

  function calcmultiply(progress, paramCurve) {
    const params = {
      "CurveExtreme": { a: -10, b: 9, c: 1 },
      "CurveModerate": { a: -5.86, b: 4.86, c: 1 },
      "CurveLight": { a: -3.7, b: -2.7, c: 1 },
      "CurveLinearUp": { a: 0, b: 1, c: 1 },
      "CurveLinearDown": { a: 0, b: -1, c: 1 },
      "CurveConstant": { a: 0, b: 0, c: 1 },
    }
    const paramsCurve = params[paramCurve]
    return paramsCurve.a * Math.pow(progress, 2) + (paramsCurve.b * progress) + paramsCurve.c
  }

  const arr = [{ step: 0, progress: 0, multiply: 0, stackTime: initialTime }]
  for (let i = 1; i <= target; i++) {
    const step = i
    const progress = calcprogress(i, target)
    const multiply = calcmultiply(calcprogress(i, target), paramsKey)
    const addTime = time * multiply
    const stackTime = arr[i - 1].stackTime + addTime
    arr.push({ step, progress, multiply, addTime, stackTime })
  }

  const postArr = arr.map((step, index, arr) => {
    let addTime1 = 0
    let addTime2 = 0
    let addTime3 = 0
    for (let i = 0; i < stepsTime1; i++) {
      addTime1 += arr[index + i]?.addTime || 0
    }
    for (let i = 0; i < stepsTime2; i++) {
      addTime2 += arr[index + i]?.addTime || 0
    }
    for (let i = 0; i < stepsTime3; i++) {
      addTime3 += arr[index + i]?.addTime || 0
    }
    return { ...step, addTime1, addTime2, addTime3 }
  })
  return postArr
}