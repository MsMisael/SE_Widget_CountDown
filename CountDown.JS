"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
window.addEventListener('onWidgetLoad', onWidgetLoad);
async function onWidgetLoad(obj) {
  const fieldData = obj.detail.fieldData;
  const context = new Context(fieldData);
  Renderer.config(fieldData);
  Renderer.renderHeaders(context.headersData);
  setInterval(() => {
    Renderer.renderCountDown(context.countDownData);
  }, 1000);
  setInterval(() => {
    Renderer.activateWidget(context.activateWidgetData);
  }, context.ghostModeTotalTimeout * 1000);
  const onEventReceived = obj => {
    var _obj$detail$event$dat;
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
      obj.detail.listener = "redemption-latest";
    }
    if (((_obj$detail$event$dat = obj.detail.event.data) === null || _obj$detail$event$dat === void 0 ? void 0 : _obj$detail$event$dat.key) === 'customWidget.timer') {
      context.loadState();
      return;
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    Renderer.activateWidget(context.activateWidgetData);
    Events.load(listener, event, context);
  };
  window.addEventListener('onEventReceived', onEventReceived);
}
const CURVES = {
  CurveExtreme: {
    a: -10,
    b: 9,
    c: 1
  },
  CurveModerate: {
    a: -5.86,
    b: 4.86,
    c: 1
  },
  CurveLight: {
    a: -3.7,
    b: -2.7,
    c: 1
  },
  CurveLinearUp: {
    a: 0,
    b: 1,
    c: 1
  },
  CurveLinearDown: {
    a: 0,
    b: -1,
    c: 1
  },
  CurveConstant: {
    a: 0,
    b: 0,
    c: 1
  }
};
class Context {
  get headersData() {
    return {
      currentStep: this.currentStep,
      lastStep: this.nextStep.step,
      showMarks: this.showMarks,
      showHeader: this.showHeader,
      showHeaderLabel1: this.showHeaderLabel1,
      showHeaderLabel2: this.showHeaderLabel2,
      showHeaderLabel3: this.showHeaderLabel3
    };
  }
  get countDownData() {
    return {
      timerCountStarts: this.timerCountStarts,
      currentstackTime: this.currentStep.stackTime
    };
  }
  get ghostModeTotalTimeout() {
    return this.ghostModeRefreshTimeout + this.ghostModeTimeout;
  }
  get activateWidgetData() {
    return {
      ghostMode: this.ghostMode,
      ghostModeTimeout: this.ghostModeTimeout
    };
  }
  constructor(_ref) {
    var _this$overlayStatus;
    let {
      target,
      time,
      initialTime,
      includeTips,
      includeSubs,
      includeCheers,
      multiplyTimeFunction,
      headerLabel1,
      headerLabel2,
      headerLabel3,
      amountPerTip,
      amountPerSub,
      amountPerCheer,
      enableGhostMode,
      ghostModeTimeout,
      hideHeadersMode,
      ghostModeRefreshTimeout,
      showMarks
    } = _ref;
    _defineProperty(this, "timesObj", void 0);
    _defineProperty(this, "target", void 0);
    _defineProperty(this, "time", void 0);
    _defineProperty(this, "initialTime", void 0);
    _defineProperty(this, "includeTips", void 0);
    _defineProperty(this, "timerCountStarts", void 0);
    _defineProperty(this, "headerLabel1", void 0);
    _defineProperty(this, "totals", void 0);
    _defineProperty(this, "amountsRate", void 0);
    _defineProperty(this, "includes", void 0);
    _defineProperty(this, "currentStep", void 0);
    _defineProperty(this, "nextStep", void 0);
    _defineProperty(this, "ghostMode", void 0);
    _defineProperty(this, "ghostModeTimeout", void 0);
    _defineProperty(this, "hideHeadersMode", void 0);
    _defineProperty(this, "includeSubs", void 0);
    _defineProperty(this, "includeCheers", void 0);
    _defineProperty(this, "headerLabel2", void 0);
    _defineProperty(this, "headerLabel3", void 0);
    _defineProperty(this, "ghostModeRefreshTimeout", void 0);
    _defineProperty(this, "saveTimeout", void 0);
    _defineProperty(this, "overlayStatus", {
      isEditorMode: false
    });
    _defineProperty(this, "hasSaveTimeout", false);
    _defineProperty(this, "showMarks", true);
    _defineProperty(this, "showHeader", true);
    _defineProperty(this, "showHeaderLabel1", true);
    _defineProperty(this, "showHeaderLabel2", true);
    _defineProperty(this, "showHeaderLabel3", true);
    // @ts-ignore
    SE_API.getOverlayStatus().then(data => {
      this.overlayStatus = data;
    });
    this.target = Number(target);
    this.time = Number(time);
    this.initialTime = Number(initialTime);
    this.includeTips = Boolean(includeTips === "yes");
    this.includeSubs = Boolean(includeSubs === "yes");
    this.includeCheers = Boolean(includeCheers === "yes");
    this.timerCountStarts = new Date();
    this.showMarks = Boolean(showMarks === "yes");
    this.headerLabel1 = Number(headerLabel1);
    this.headerLabel2 = Number(headerLabel2);
    this.headerLabel3 = Number(headerLabel3);
    this.totals = {
      tips: 0,
      subs: 0,
      cheers: 0
    };
    this.amountsRate = {
      tips: Number(amountPerTip),
      subs: Number(amountPerSub),
      cheers: Number(amountPerCheer)
    };
    this.includes = {
      tips: this.includeTips,
      subs: this.includeSubs,
      cheers: this.includeCheers
    };
    this.timesObj = WidgetFunctions.createTimesObj(this.target, this.time, this.initialTime, this.headerLabel1, this.headerLabel2, this.headerLabel3, CURVES[multiplyTimeFunction]);
    this.currentStep = this.timesObj[0];
    this.nextStep = this.timesObj[1];
    this.ghostMode = Boolean(enableGhostMode);
    this.ghostModeTimeout = Number(ghostModeTimeout);
    this.hideHeadersMode = Boolean(hideHeadersMode);
    this.ghostModeRefreshTimeout = Number(ghostModeRefreshTimeout);
    if ((_this$overlayStatus = this.overlayStatus) !== null && _this$overlayStatus !== void 0 && _this$overlayStatus.isEditorMode) console.log('Context: initialized');
    this.loadState();
  }
  async loadState() {
    if (this.hasSaveTimeout) return;
    if (this.overlayStatus.isEditorMode) console.log('Context: State loaded');
    // @ts-ignore
    const storedData = await SE_API.store.get('timer');
    this.timerCountStarts = new Date(storedData.timerCountStarts);
    this.totals = storedData.totals;
    this.updateContext(false);
  }
  async saveState() {
    clearTimeout(this.saveTimeout);
    this.hasSaveTimeout = true;
    if (this.overlayStatus.isEditorMode) console.log('Context: Call saveState');
    this.saveTimeout = setTimeout(async () => {
      // @ts-ignore
      await SE_API.store.set('timer', {
        timerCountStarts: this.timerCountStarts,
        totals: this.totals
      });
      this.hasSaveTimeout = false;
      if (this.overlayStatus.isEditorMode) console.log('Context: State saved');
    }, 1000);
  }
  updateContext() {
    let save = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    let stepsOfTips = 0;
    let stepsOfSubs = 0;
    let stepsOfCheers = 0;
    if (this.includes.tips && this.amountsRate.tips > 0) {
      stepsOfTips = this.totals.tips / this.amountsRate.tips;
    }
    if (this.includes.subs && this.amountsRate.subs > 0) {
      stepsOfSubs = this.totals.subs / this.amountsRate.subs;
    }
    if (this.includes.cheers && this.amountsRate.cheers > 0) {
      stepsOfCheers = this.totals.cheers / this.amountsRate.cheers;
    }
    const totalSteps = stepsOfCheers + stepsOfTips + stepsOfSubs;
    this.currentStep = this.timesObj[totalSteps > this.target ? this.target : totalSteps];
    this.nextStep = this.timesObj[totalSteps + 1 > this.target ? this.target : totalSteps + 1];
    this.showHeader = !(this.currentStep.addTime1 + this.currentStep.addTime2 + this.currentStep.addTime3 < 1 || this.currentStep.step == this.nextStep.step);
    this.showHeaderLabel1 = !(this.currentStep.addTime1 < 1);
    this.showHeaderLabel2 = !(this.currentStep.addTime2 < 1 || this.currentStep.addTime2 == this.currentStep.addTime1);
    this.showHeaderLabel3 = !(this.currentStep.addTime3 < 1 || this.currentStep.addTime3 == this.currentStep.addTime2);
    Renderer.renderHeaders(this.headersData);
    if (this.overlayStatus.isEditorMode) console.log('Context: Checking Steps', this.currentStep);
    if (save) this.saveState();
  }
  addSubscriber(amount) {
    if (this.includeSubs) {
      if (this.overlayStatus.isEditorMode) console.log('Context: addSubscriber', amount);
      this.totals.subs += amount;
      this.updateContext();
    }
    return this.includeSubs;
  }
  addCheer(amount) {
    if (this.includeCheers) {
      if (this.overlayStatus.isEditorMode) console.log('Context: addCheer', amount);
      this.totals.cheers += amount;
      this.updateContext();
    }
    return this.includeCheers;
  }
  addTip(amount) {
    if (this.includeTips) {
      if (this.overlayStatus.isEditorMode) console.log('Context: addTip', amount);
      this.totals.tips += amount;
      this.updateContext();
    }
    return this.includeTips;
  }
  resetTimer() {
    if (this.overlayStatus.isEditorMode) console.log('Context: resetTimer');
    this.timerCountStarts = new Date();
    this.updateContext();
  }
  async resetTotals() {
    if (this.overlayStatus.isEditorMode) console.log('Context: resetTotals');
    this.totals = {
      tips: 0,
      subs: 0,
      cheers: 0
    };
    this.updateContext();
  }
}
class Events {
  static load(listener, event, context) {
    let skip = true;
    console.log(event);
    if (Events.event[listener]) {
      skip = Events.event[listener](event, context);
    }
  }
}
_defineProperty(Events, "event", {
  follower(event, context) {
    return false;
  },
  redemption(event, context) {
    return false;
  },
  subscriber(event, context) {
    return context.addSubscriber(event.amount);
  },
  host(event, context) {
    return false;
  },
  cheer(event, context) {
    return context.addCheer(event.amount);
  },
  tip(event, context) {
    return context.addTip(event.amount);
  },
  raid(event, context) {
    return false;
  },
  "event:test"(event, context) {
    if (event.field === 'resetTimer') {
      context.resetTimer();
      return false;
    } else if (event.field === 'resetTotals') {
      context.resetTotals();
      Renderer.renderHeaders(context.headersData);
      return false;
    } else {
      return true;
    }
  }
});
class Renderer {
  static config(fieldData) {
    if (Boolean(fieldData.enableGhostMode) && Boolean(fieldData.hideHeadersMode)) $('#container').addClass('noheaders');
    if (Boolean(fieldData.enableGhostMode)) $('#container').addClass('ghost');
    Number(fieldData.headerLabel1) > 0 ? $('#first.header .label').text("".concat(fieldData.headerLabel1, "X")) : $('#first').fadeIn();
    Number(fieldData.headerLabel2) > 0 ? $('#second.header .label').text("".concat(fieldData.headerLabel2, "X")) : $('#second').fadeIn();
    Number(fieldData.headerLabel3) > 0 ? $('#third.header .label').text("".concat(fieldData.headerLabel3, "X")) : $('#third').fadeIn();
    if (Number(fieldData.headerLabel1) + Number(fieldData.headerLabel2) + Number(fieldData.headerLabel3) < 1) $('#header').addClass('hide');
  }
  static renderHeaders(_ref2) {
    let {
      currentStep,
      showMarks,
      showHeader,
      showHeaderLabel1,
      showHeaderLabel2,
      showHeaderLabel3
    } = _ref2;
    showMarks ? $('#steps span').css('opacity', '0.6') : $('#steps span').css('opacity', '0');
    $('#steps span').text("".concat(currentStep.step, "X ").concat(WidgetFunctions.formatTimeWithHour(currentStep.stackTime)));
    const header1Minute = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime1))[0];
    const header1Second = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime1))[1];
    const header2Minute = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime2))[0];
    const header2Second = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime2))[1];
    const header3Minute = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime3))[0];
    const header3Second = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime3))[1];
    $('#first.header .text').text("".concat(header1Minute, ":").concat(header1Second));
    $('#second.header .text').text("".concat(header2Minute, ":").concat(header2Second));
    $('#third.header .text').text("".concat(header3Minute, ":").concat(header3Second));
    showHeaderLabel1 ? $('#first.header').removeClass('hide') : $('#first.header').addClass('hide');
    showHeaderLabel2 ? $('#second.header').removeClass('hide') : $('#second.header').addClass('hide');
    showHeaderLabel3 ? $('#third.header').removeClass('hide') : $('#third.header').addClass('hide');
    showHeader ? $('#header').removeClass('hide') : $('#header').addClass('hide');
  }
  static renderCountDown(_ref3) {
    let {
      timerCountStarts,
      currentstackTime
    } = _ref3;
    const countDownStartsTime = WidgetFunctions.diffInSeconds(timerCountStarts) > 0 ? WidgetFunctions.diffInSeconds(timerCountStarts) : 0;
    const elapsedTime = WidgetFunctions.diffInSeconds(new Date(), timerCountStarts) > 0 ? WidgetFunctions.diffInSeconds(new Date(), timerCountStarts) : 0;
    const aditionalTime = currentstackTime;
    $('#body .timer .text').text(WidgetFunctions.formatTimeWithHour(countDownStartsTime + aditionalTime - elapsedTime));
  }
  static activateWidget(_ref4) {
    let {
      ghostMode,
      ghostModeTimeout
    } = _ref4;
    $('#container').removeClass('ghost');
    if (ghostMode) {
      clearTimeout(this.ghostTimeout);
      this.ghostTimeout = setTimeout(() => {
        $('#container').addClass('ghost');
      }, ghostModeTimeout * 1000);
    }
  }
}
_defineProperty(Renderer, "ghostTimeout", void 0);
class WidgetFunctions {
  static createTimesObj(target, time, initialTime, stepsTime1, stepsTime2, stepsTime3, curve) {
    const stepsArray = createStepsArray(target);
    const progressArray = setProgressInArray(target, stepsArray);
    const multiplierArray = setMultiplierInArray(curve, progressArray);
    const addTimeArray = setAddTimeInArray(time, multiplierArray);
    const stackTimeArray = setStackTimeInArray(initialTime, addTimeArray);
    const addTime1Array = setCustomAddTimeInArray(stackTimeArray, stepsTime1, '1');
    const addTime2Array = setCustomAddTimeInArray(addTime1Array, stepsTime2, '2');
    const addTime3Array = setCustomAddTimeInArray(addTime2Array, stepsTime3, '3');
    return addTime3Array;
    function createStepsArray(target) {
      const stepsArray = [{
        step: 0
      }];
      for (let step = 1; step <= target; step++) {
        stepsArray.push({
          step
        });
      }
      return stepsArray;
    }
    function setProgressInArray(target, stepsArray) {
      return stepsArray.map(_ref5 => {
        let {
          step
        } = _ref5;
        return {
          step,
          progress: calcProgress(step, target)
        };
      });
    }
    function setMultiplierInArray(curve, stepsArray) {
      return stepsArray.map(_ref6 => {
        let {
          step,
          progress
        } = _ref6;
        return {
          step,
          progress,
          multiply: calcMultiplier(progress, curve)
        };
      });
    }
    function setAddTimeInArray(time, stepsArray) {
      return stepsArray.map(_ref7 => {
        let {
          step,
          progress,
          multiply
        } = _ref7;
        return {
          step,
          progress,
          multiply,
          addTime: time * multiply
        };
      });
    }
    function setStackTimeInArray(initialTime, stepsArray) {
      return stepsArray.map(_ref8 => {
        let {
          step,
          progress,
          multiply,
          addTime
        } = _ref8;
        let stackTime = initialTime;
        for (let i = 1; i <= step; i++) {
          stackTime += stepsArray[i].addTime;
        }
        return {
          step,
          progress,
          multiply,
          addTime,
          stackTime
        };
      });
    }
    function setCustomAddTimeInArray(stepsArray, nextSteps, customIndex) {
      return stepsArray.map(stepArray => {
        let customAddTime = 0;
        for (let i = 0; i < nextSteps; i++) {
          var _stepsArray;
          customAddTime += ((_stepsArray = stepsArray[stepArray.step + i]) === null || _stepsArray === void 0 ? void 0 : _stepsArray.addTime) || 0;
        }
        return _objectSpread(_objectSpread({}, stepArray), {}, {
          ['addTime' + customIndex]: customAddTime
        });
      });
    }
    function calcMultiplier(progress, curve) {
      return curve.a * Math.pow(progress, 2) + curve.b * progress + curve.c;
    }
    function calcProgress(current, max) {
      return current / max;
    }
  }
  static formatTimeWithHour(time) {
    const [hh, mm, ss, negative] = WidgetFunctions.secondsToTime(time);
    const hidehour = Number(hh) == 0;
    const hour = hidehour ? '' : negative ? '-' + hh : hh;
    const hMarker = hidehour ? '' : ':';
    const minute = hidehour ? negative ? '-' + mm : mm : mm;
    const second = ss;
    return "".concat(hour).concat(hMarker).concat(minute, ":").concat(second);
  }
  static convertTime(arr) {
    let hours = Number(arr[0]);
    let minutes = Number(arr[1]);
    let seconds = Number(arr[2]);
    if (hours < 0 || minutes < 0 || seconds < 0) {
      return ["xx", "xx", true];
    }
    let totalMinutes = hours * 60 + minutes;
    let formattedMinutes = totalMinutes < 10 ? "0" + Math.round(totalMinutes) : Math.round(totalMinutes).toString();
    let formattedSeconds = seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds).toString();
    return [formattedMinutes, formattedSeconds, arr[3]];
  }
  static diffInSeconds(date1, date2) {
    const date = date2 || new Date();
    const diff = date1.getTime() - date.getTime();
    return Math.floor(diff / 1000);
  }
  static secondsToTime(seconds) {
    const hours = Math.floor(Math.abs(seconds) / 3600);
    const minutes = Math.floor((Math.abs(seconds) - hours * 3600) / 60);
    const remainingSeconds = Math.abs(seconds) % 60;
    const isNegative = seconds < 0;
    const formattedHours = Number(Math.round(hours)) < 10 ? "0" + Math.round(hours) : Math.round(hours).toString();
    const formattedMinutes = Number(Math.round(minutes)) < 10 ? "0" + Math.round(minutes) : Math.round(minutes).toString();
    const formattedSeconds = Math.round(remainingSeconds) < 10 ? "0" + Math.round(remainingSeconds) : Math.round(remainingSeconds).toString();
    return [formattedHours, formattedMinutes, formattedSeconds, isNegative];
  }
}
"use strict";
