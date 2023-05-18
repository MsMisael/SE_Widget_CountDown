import convertTime from "../utils/convertTime"
import diffInSeconds from "../utils/diffInSeconds"
import secondsToTime from "../utils/secondsToTime"

declare type CountDownData = {
    timerCountStarts: Date
    currentstackTime: number
}

declare type headersData = {
    addTime1: number
    addTime2: number
    addTime3: number
    isLastStep: boolean
}

declare interface configHeadersData extends headersData {
    headerHorizontalAlign: string
    headerVerticalAlign: string
    headerLabel1: string
    headerLabel2: string
    headerLabel3: string
}

export default class Renderer {
    private _ghostTimeout: NodeJS.Timeout = setTimeout(() => { }, 0)
    public set ghostTimeout(value: NodeJS.Timeout) {
        this._ghostTimeout = value
    }
    private _ghostMode: boolean = false

    public set ghostMode(value: boolean) {
        this._ghostMode = value
    }
    private _ghostModeTimeout: number = 0

    public set ghostModeTimeout(value: number) {
        this._ghostModeTimeout = value
    }
    private _hideHeadersMode: boolean = false

    public set hideHeadersMode(value: boolean) {
        this._hideHeadersMode = value
    }

    configHeaders(configHeadersData: configHeadersData) {


        $('#timerContainer').addClass(configHeadersData.headerHorizontalAlign.toLowerCase())
        $('#timerContainer').addClass(configHeadersData.headerVerticalAlign.toLowerCase())
        Number(configHeadersData.headerLabel1) > 0 ? $('#first #timer .label').text(`${configHeadersData.headerLabel1}X`) : $('#first').fadeIn()
        Number(configHeadersData.headerLabel2) > 0 ? $('#second #timer .label').text(`${configHeadersData.headerLabel2}X`) : $('#second').fadeIn()
        Number(configHeadersData.headerLabel3) > 0 ? $('#third #timer .label').text(`${configHeadersData.headerLabel3}X`) : $('#third').fadeIn()

        this.renderHeaders(configHeadersData)
    }

    renderHeaders(headersData: headersData) {
        if (this._hideHeadersMode) $('#container').addClass('noheaders')
        $('#first #timer .minute').text(secondsToTime(headersData.addTime1)[1])
        $('#first #timer .second').text(secondsToTime(headersData.addTime1)[2])

        $('#second #timer .minute').text(convertTime(secondsToTime(headersData.addTime2))[0])
        $('#second #timer .second').text(convertTime(secondsToTime(headersData.addTime2))[1])

        $('#third #timer .minute').text(convertTime(secondsToTime(headersData.addTime3))[0])
        $('#third #timer .second').text(convertTime(secondsToTime(headersData.addTime3))[1])

        headersData.addTime1 == 0 ? $('#first').fadeOut() : $('#first').fadeIn()
        headersData.addTime2 == headersData.addTime1 || headersData.addTime2 == 0 ? $('#second').fadeOut() : $('#second').fadeIn()
        headersData.addTime3 == headersData.addTime2 || headersData.addTime3 == 0 ? $('#third').fadeOut() : $('#third').fadeIn()
        headersData.isLastStep && $('#first').fadeOut()
    }

    renderCountDown(CountDownData: CountDownData) {
        const countDownStartsTime = diffInSeconds(CountDownData.timerCountStarts) > 0 ? diffInSeconds(CountDownData.timerCountStarts) : 0
        const elapsedTime = diffInSeconds(new Date(), CountDownData.timerCountStarts) > 0 ? diffInSeconds(new Date(), CountDownData.timerCountStarts) : 0
        const aditionalTime = CountDownData.currentstackTime
        const [hh, mm, ss, negative] = secondsToTime(countDownStartsTime + aditionalTime - elapsedTime)

        const hidehour = Number(hh) == 0

        $('#body #timer .hour').text(hidehour ? '' : negative ? '-' + hh : hh)
        $('#body #timer .hourmarker').text(hidehour ? '' : ':')
        $('#body #timer .minute').text(hidehour ? negative ? '-' + mm : mm : mm)
        $('#body #timer .second').text(ss)
    }

    activateWidget() {
        if (this._ghostMode) {
            $('#container').removeClass('ghost')

            clearTimeout(this._ghostTimeout)
            this._ghostTimeout = setTimeout(() => {
                $('#container').addClass('ghost')
            }, this._ghostModeTimeout * 1000)
        }
    }
    recusiveGhostmode() {

        if ($('#container').hasClass('ghost')) {
            this.activateWidget()
        }

    }
}