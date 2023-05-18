"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var a = 1;
console.log(a);
define("utils/convertTime", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function convertTime(arr) {
        var hours = Number(arr[0]);
        var minutes = Number(arr[1]);
        var seconds = Number(arr[2]);
        if (hours < 0 || minutes < 0 || seconds < 0) {
            return ["xx", "xx", true];
        }
        var totalMinutes = hours * 60 + minutes;
        var formattedMinutes = totalMinutes < 10 ? "0" + Math.round(totalMinutes) : Math.round(totalMinutes).toString();
        var formattedSeconds = seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds).toString();
        return [formattedMinutes, formattedSeconds, false];
    }
    exports.default = convertTime;
});
define("utils/diffInSeconds", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function diffInSeconds(date1, date2) {
        var date = date2 || new Date();
        var diff = date1.getTime() - date.getTime();
        return Math.floor(diff / 1000);
    }
    exports.default = diffInSeconds;
});
define("utils/secondsToTime", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function secondsToTime(seconds) {
        var hours = Math.floor(Math.abs(seconds) / 3600);
        var minutes = Math.floor((Math.abs(seconds) - hours * 3600) / 60);
        var remainingSeconds = Math.abs(seconds) % 60;
        var isNegative = seconds < 0;
        var formattedHours = Number(Math.round(hours)) < 10 ? "0" + Math.round(hours) : Math.round(hours).toString();
        var formattedMinutes = Number(Math.round(minutes)) < 10 ? "0" + Math.round(minutes) : Math.round(minutes).toString();
        var formattedSeconds = Math.round(remainingSeconds) < 10 ? "0" + Math.round(remainingSeconds) : Math.round(remainingSeconds).toString();
        return [formattedHours, formattedMinutes, formattedSeconds, isNegative];
    }
    exports.default = secondsToTime;
});
define("Renderer/index", ["require", "exports", "utils/convertTime", "utils/diffInSeconds", "utils/secondsToTime"], function (require, exports, convertTime_1, diffInSeconds_1, secondsToTime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    convertTime_1 = __importDefault(convertTime_1);
    diffInSeconds_1 = __importDefault(diffInSeconds_1);
    secondsToTime_1 = __importDefault(secondsToTime_1);
    var Renderer = /** @class */ (function () {
        function Renderer() {
            this._ghostTimeout = setTimeout(function () { }, 0);
            this._ghostMode = false;
            this._ghostModeTimeout = 0;
            this._hideHeadersMode = false;
        }
        Object.defineProperty(Renderer.prototype, "ghostTimeout", {
            set: function (value) {
                this._ghostTimeout = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "ghostMode", {
            set: function (value) {
                this._ghostMode = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "ghostModeTimeout", {
            set: function (value) {
                this._ghostModeTimeout = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "hideHeadersMode", {
            set: function (value) {
                this._hideHeadersMode = value;
            },
            enumerable: false,
            configurable: true
        });
        Renderer.prototype.configHeaders = function (configHeadersData) {
            $('#timerContainer').addClass(configHeadersData.headerHorizontalAlign.toLowerCase());
            $('#timerContainer').addClass(configHeadersData.headerVerticalAlign.toLowerCase());
            Number(configHeadersData.headerLabel1) > 0 ? $('#first #timer .label').text("".concat(configHeadersData.headerLabel1, "X")) : $('#first').fadeIn();
            Number(configHeadersData.headerLabel2) > 0 ? $('#second #timer .label').text("".concat(configHeadersData.headerLabel2, "X")) : $('#second').fadeIn();
            Number(configHeadersData.headerLabel3) > 0 ? $('#third #timer .label').text("".concat(configHeadersData.headerLabel3, "X")) : $('#third').fadeIn();
            this.renderHeaders(configHeadersData);
        };
        Renderer.prototype.renderHeaders = function (headersData) {
            if (this._hideHeadersMode)
                $('#container').addClass('noheaders');
            $('#first #timer .minute').text((0, secondsToTime_1.default)(headersData.addTime1)[1]);
            $('#first #timer .second').text((0, secondsToTime_1.default)(headersData.addTime1)[2]);
            $('#second #timer .minute').text((0, convertTime_1.default)((0, secondsToTime_1.default)(headersData.addTime2))[0]);
            $('#second #timer .second').text((0, convertTime_1.default)((0, secondsToTime_1.default)(headersData.addTime2))[1]);
            $('#third #timer .minute').text((0, convertTime_1.default)((0, secondsToTime_1.default)(headersData.addTime3))[0]);
            $('#third #timer .second').text((0, convertTime_1.default)((0, secondsToTime_1.default)(headersData.addTime3))[1]);
            headersData.addTime1 == 0 ? $('#first').fadeOut() : $('#first').fadeIn();
            headersData.addTime2 == headersData.addTime1 || headersData.addTime2 == 0 ? $('#second').fadeOut() : $('#second').fadeIn();
            headersData.addTime3 == headersData.addTime2 || headersData.addTime3 == 0 ? $('#third').fadeOut() : $('#third').fadeIn();
            headersData.isLastStep && $('#first').fadeOut();
        };
        Renderer.prototype.renderCountDown = function (CountDownData) {
            var countDownStartsTime = (0, diffInSeconds_1.default)(CountDownData.timerCountStarts) > 0 ? (0, diffInSeconds_1.default)(CountDownData.timerCountStarts) : 0;
            var elapsedTime = (0, diffInSeconds_1.default)(new Date(), CountDownData.timerCountStarts) > 0 ? (0, diffInSeconds_1.default)(new Date(), CountDownData.timerCountStarts) : 0;
            var aditionalTime = CountDownData.currentstackTime;
            var _a = (0, secondsToTime_1.default)(countDownStartsTime + aditionalTime - elapsedTime), hh = _a[0], mm = _a[1], ss = _a[2], negative = _a[3];
            var hidehour = Number(hh) == 0;
            $('#body #timer .hour').text(hidehour ? '' : negative ? '-' + hh : hh);
            $('#body #timer .hourmarker').text(hidehour ? '' : ':');
            $('#body #timer .minute').text(hidehour ? negative ? '-' + mm : mm : mm);
            $('#body #timer .second').text(ss);
        };
        Renderer.prototype.activateWidget = function () {
            if (this._ghostMode) {
                $('#container').removeClass('ghost');
                clearTimeout(this._ghostTimeout);
                this._ghostTimeout = setTimeout(function () {
                    $('#container').addClass('ghost');
                }, this._ghostModeTimeout * 1000);
            }
        };
        Renderer.prototype.recusiveGhostmode = function () {
            if ($('#container').hasClass('ghost')) {
                this.activateWidget();
            }
        };
        return Renderer;
    }());
    exports.default = Renderer;
});
define("utils/calcMultiplier", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function calcMultiplier(progress, curve) {
        return curve.a * Math.pow(progress, 2) + (curve.b * progress) + curve.c;
    }
    exports.default = calcMultiplier;
});
define("utils/calcProgress", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function calcProgress(current, max) {
        return current / max;
    }
    exports.default = calcProgress;
});
define("utils/createTimesObj", ["require", "exports", "utils/calcProgress", "utils/calcMultiplier"], function (require, exports, calcProgress_1, calcMultiplier_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    calcProgress_1 = __importDefault(calcProgress_1);
    calcMultiplier_1 = __importDefault(calcMultiplier_1);
    function createTimesObj(target, time, initialTime, stepsTime1, stepsTime2, stepsTime3, curve) {
        var arr = [{ step: 0, progress: 0, multiply: 0, stackTime: initialTime, addTime: 0 }];
        for (var i = 1; i <= target; i++) {
            var step = i;
            var progress = (0, calcProgress_1.default)(i, target);
            var multiply = (0, calcMultiplier_1.default)((0, calcProgress_1.default)(i, target), curve);
            var addTime = time * multiply;
            var stackTime = arr[i - 1].stackTime + addTime;
            arr.push({ step: step, progress: progress, multiply: multiply, addTime: addTime, stackTime: stackTime });
        }
        var postArr = arr.map(function (step, index, arr) {
            var _a, _b, _c;
            var addTime1 = 0;
            var addTime2 = 0;
            var addTime3 = 0;
            for (var i = 0; i < stepsTime1; i++) {
                addTime1 += ((_a = arr[index + i]) === null || _a === void 0 ? void 0 : _a.addTime) || 0;
            }
            for (var i = 0; i < stepsTime2; i++) {
                addTime2 += ((_b = arr[index + i]) === null || _b === void 0 ? void 0 : _b.addTime) || 0;
            }
            for (var i = 0; i < stepsTime3; i++) {
                addTime3 += ((_c = arr[index + i]) === null || _c === void 0 ? void 0 : _c.addTime) || 0;
            }
            return __assign(__assign({}, step), { addTime1: addTime1, addTime2: addTime2, addTime3: addTime3 });
        });
        return postArr;
    }
    exports.default = createTimesObj;
});
