"use strict";

const a = 1;
console.log(a);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.error.cause.js");
var _convertTime = _interopRequireDefault(require("../utils/convertTime"));
var _diffInSeconds = _interopRequireDefault(require("../utils/diffInSeconds"));
var _secondsToTime = _interopRequireDefault(require("../utils/secondsToTime"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Renderer {
  constructor() {
    _defineProperty(this, "_ghostTimeout", 0);
    _defineProperty(this, "_ghostMode", false);
    _defineProperty(this, "_ghostModeTimeout", 0);
    _defineProperty(this, "_hideHeadersMode", void 0);
  }
  set ghostTimeout(value) {
    this._ghostTimeout = value;
  }
  set ghostMode(value) {
    this._ghostMode = value;
  }
  set ghostModeTimeout(value) {
    this._ghostModeTimeout = value;
  }
  set hideHeadersMode(value) {
    this._hideHeadersMode = value;
  }
  configHeaders(configHeadersData) {
    $('#timerContainer').addClass(configHeadersData.headerHorizontalAlign.toLowerCase());
    $('#timerContainer').addClass(configHeadersData.headerVerticalAlign.toLowerCase());
    Number(configHeadersData.headerLabel1) > 0 ? $('#first #timer .label').text(`${configHeadersData.headerLabel1}X`) : $('#first').fadeIn();
    Number(configHeadersData.headerLabel2) > 0 ? $('#second #timer .label').text(`${configHeadersData.headerLabel2}X`) : $('#second').fadeIn();
    Number(configHeadersData.headerLabel3) > 0 ? $('#third #timer .label').text(`${configHeadersData.headerLabel3}X`) : $('#third').fadeIn();
    this.renderHeaders(configHeadersData);
  }
  renderHeaders(headersData) {
    if (this._hideHeadersMode) $('#container').addClass('noheaders');
    $('#first #timer .minute').text((0, _secondsToTime.default)(headersData.addTime1)[1]);
    $('#first #timer .second').text((0, _secondsToTime.default)(headersData.addTime1)[2]);
    $('#second #timer .minute').text((0, _convertTime.default)((0, _secondsToTime.default)(headersData.addTime2))[0]);
    $('#second #timer .second').text((0, _convertTime.default)((0, _secondsToTime.default)(headersData.addTime2))[1]);
    $('#third #timer .minute').text((0, _convertTime.default)((0, _secondsToTime.default)(headersData.addTime3))[0]);
    $('#third #timer .second').text((0, _convertTime.default)((0, _secondsToTime.default)(headersData.addTime3))[1]);
    headersData.addTime1 == 0 ? $('#first').fadeOut() : $('#first').fadeIn();
    headersData.addTime2 == headersData.addTime1 || headersData.addTime2 == 0 ? $('#second').fadeOut() : $('#second').fadeIn();
    headersData.addTime3 == headersData.addTime2 || headersData.addTime3 == 0 ? $('#third').fadeOut() : $('#third').fadeIn();
    headersData.isLastStep && $('#first').fadeOut();
  }
  renderCountDown(CountDownData) {
    const countDownStartsTime = (0, _diffInSeconds.default)(CountDownData.timerCountStarts) > 0 ? (0, _diffInSeconds.default)(CountDownData.timerCountStarts) : 0;
    const elapsedTime = (0, _diffInSeconds.default)(new Date(), CountDownData.timerCountStarts) > 0 ? (0, _diffInSeconds.default)(new Date(), CountDownData.timerCountStarts) : 0;
    const aditionalTime = CountDownData.currentstackTime;
    const [hh, mm, ss, negative] = (0, _secondsToTime.default)(countDownStartsTime + aditionalTime - elapsedTime);
    const hidehour = Number(hh) == 0;
    $('#body #timer .hour').text(hidehour ? '' : negative ? '-' + hh : hh);
    $('#body #timer .hourmarker').text(hidehour ? '' : ':');
    $('#body #timer .minute').text(hidehour ? negative ? '-' + mm : mm : mm);
    $('#body #timer .second').text(ss);
  }
  activateWidget() {
    if (this._ghostMode) {
      $('#container').removeClass('ghost');
      clearTimeout(this._ghostTimeout);
      this._ghostTimeout = setTimeout(() => {
        $('#container').addClass('ghost');
      }, this._ghostModeTimeout * 1000);
    }
  }
  recusiveGhostmode() {
    if ($('#container').hasClass('ghost')) {
      this.activateWidget();
    }
  }
}
exports.default = Renderer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calcMultiplier;
function calcMultiplier(progress, curve) {
  return curve.a * Math.pow(progress, 2) + curve.b * progress + curve.c;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calcProgress;
function calcProgress(current, max) {
  return current / max;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertTime;
function convertTime(arr) {
  let hours = Number(arr[0]);
  let minutes = Number(arr[1]);
  let seconds = Number(arr[2]);
  if (hours < 0 || minutes < 0 || seconds < 0) {
    return ["xx", "xx", true];
  }
  let totalMinutes = hours * 60 + minutes;
  let formattedMinutes = totalMinutes < 10 ? "0" + Math.round(totalMinutes) : Math.round(totalMinutes).toString();
  let formattedSeconds = seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds).toString();
  return [formattedMinutes, formattedSeconds, false];
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTimesObj;
var _calcProgress = _interopRequireDefault(require("./calcProgress"));
var _calcMultiplier = _interopRequireDefault(require("./calcMultiplier"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function createTimesObj(target, time, initialTime, stepsTime1, stepsTime2, stepsTime3, curve) {
  const arr = [{
    step: 0,
    progress: 0,
    multiply: 0,
    stackTime: initialTime,
    addTime: 0
  }];
  for (let i = 1; i <= target; i++) {
    const step = i;
    const progress = (0, _calcProgress.default)(i, target);
    const multiply = (0, _calcMultiplier.default)((0, _calcProgress.default)(i, target), curve);
    const addTime = time * multiply;
    const stackTime = arr[i - 1].stackTime + addTime;
    arr.push({
      step,
      progress,
      multiply,
      addTime,
      stackTime
    });
  }
  const postArr = arr.map((step, index, arr) => {
    let addTime1 = 0;
    let addTime2 = 0;
    let addTime3 = 0;
    for (let i = 0; i < stepsTime1; i++) {
      var _arr;
      addTime1 += ((_arr = arr[index + i]) === null || _arr === void 0 ? void 0 : _arr.addTime) || 0;
    }
    for (let i = 0; i < stepsTime2; i++) {
      var _arr2;
      addTime2 += ((_arr2 = arr[index + i]) === null || _arr2 === void 0 ? void 0 : _arr2.addTime) || 0;
    }
    for (let i = 0; i < stepsTime3; i++) {
      var _arr3;
      addTime3 += ((_arr3 = arr[index + i]) === null || _arr3 === void 0 ? void 0 : _arr3.addTime) || 0;
    }
    return {
      ...step,
      addTime1,
      addTime2,
      addTime3
    };
  });
  return postArr;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diffInSeconds;
function diffInSeconds(date1, date2) {
  const date = date2 || new Date();
  const diff = date1.getTime() - date.getTime();
  return Math.floor(diff / 1000);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = secondsToTime;
function secondsToTime(seconds) {
  const hours = Math.floor(Math.abs(seconds) / 3600);
  const minutes = Math.floor((Math.abs(seconds) - hours * 3600) / 60);
  const remainingSeconds = Math.abs(seconds) % 60;
  const isNegative = seconds < 0;
  const formattedHours = Number(Math.round(hours)) < 10 ? "0" + Math.round(hours) : Math.round(hours).toString();
  const formattedMinutes = Number(Math.round(minutes)) < 10 ? "0" + Math.round(minutes) : Math.round(minutes).toString();
  const formattedSeconds = Math.round(remainingSeconds) < 10 ? "0" + Math.round(remainingSeconds) : Math.round(remainingSeconds).toString();
  return [formattedHours, formattedMinutes, formattedSeconds, isNegative];
}
