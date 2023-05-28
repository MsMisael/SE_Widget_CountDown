import * as Types from './types'

window.addEventListener('onWidgetLoad', onWidgetLoad)
async function onWidgetLoad(obj: any) {

    const fieldData: Types.fieldData = obj.detail.fieldData
    const context = new Context(fieldData)

    Renderer.config(fieldData)
    Renderer.renderHeaders(context.headersData)



    setInterval(() => {
        Renderer.renderCountDown(context.countDownData)
    }, 1000)

    setInterval(() => {
        Renderer.activateWidget(context.activateWidgetData)
    }, (context.ghostModeTotalTimeout) * 1000)

    const onEventReceived = (obj: any) => {
        if (!obj.detail.event) {
            return;
        }
        if (typeof obj.detail.event.itemId !== "undefined") {
            obj.detail.listener = "redemption-latest"
        }
        if (obj.detail.event.data?.key === 'customWidget.timer') {
            context.loadState()
            return;
        }
        const listener = obj.detail.listener.split("-")[0] as Types.eventType
        const event = obj.detail.event as Types.event
        Renderer.activateWidget(context.activateWidgetData)
        Events.load(listener, event, context)
    }

    window.addEventListener('onEventReceived', onEventReceived)
}




const CURVES: Types.curves = {
    CurveExtreme: { a: -10, b: 9, c: 1 },
    CurveModerate: { a: -5.86, b: 4.86, c: 1 },
    CurveLight: { a: -3.7, b: -2.7, c: 1 },
    CurveLinearUp: { a: 0, b: 1, c: 1 },
    CurveLinearDown: { a: 0, b: -1, c: 1 },
    CurveConstant: { a: 0, b: 0, c: 1 },
}

class Context {
    private timesObj: Types.timesObj[]
    private target: number;
    private time: number;
    private initialTime: number;
    private includeTips: boolean;
    private timerCountStarts: Date;
    private headerLabel1: number;
    private totals: { tips: number; subs: number; cheers: number; };
    private amountsRate: { tips: number; subs: number; cheers: number; };
    private includes: { tips: boolean; subs: boolean; cheers: boolean; };
    private currentStep: Types.timesObj;
    private nextStep: Types.timesObj;
    private ghostMode: boolean;
    private ghostModeTimeout: number;
    private hideHeadersMode: boolean;
    private includeSubs: boolean
    private includeCheers: boolean
    private headerLabel2: number
    private headerLabel3: number
    private ghostModeRefreshTimeout: number
    private saveTimeout: NodeJS.Timeout | undefined
    private overlayStatus: Types.overlayStatus = { isEditorMode: false }
    private hasSaveTimeout = false


    private showMarks: boolean = true
    private showHeader: boolean = true
    private showHeaderLabel1: boolean = true
    private showHeaderLabel2: boolean = true
    private showHeaderLabel3: boolean = true

    public get headersData() {
        return {
            currentStep: this.currentStep,
            lastStep: this.nextStep.step,
            showMarks: this.showMarks,
            showHeader: this.showHeader,
            showHeaderLabel1: this.showHeaderLabel1,
            showHeaderLabel2: this.showHeaderLabel2,
            showHeaderLabel3: this.showHeaderLabel3,
        }
    }

    public get countDownData() {
        return { timerCountStarts: this.timerCountStarts, currentstackTime: this.currentStep.stackTime }
    }

    public get ghostModeTotalTimeout() {
        return this.ghostModeRefreshTimeout + this.ghostModeTimeout
    }

    public get activateWidgetData() {
        return { ghostMode: this.ghostMode, ghostModeTimeout: this.ghostModeTimeout }
    }

    constructor({
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
        showMarks }: Types.fieldData) {
        // @ts-ignore
        SE_API.getOverlayStatus().then((data) => {
            this.overlayStatus = data
        })

        this.target = Number(target)
        this.time = Number(time)
        this.initialTime = Number(initialTime)
        this.includeTips = Boolean(includeTips === "yes")
        this.includeSubs = Boolean(includeSubs === "yes")
        this.includeCheers = Boolean(includeCheers === "yes")
        this.timerCountStarts = new Date()

        this.showMarks = Boolean(showMarks === "yes")


        this.headerLabel1 = Number(headerLabel1)
        this.headerLabel2 = Number(headerLabel2)
        this.headerLabel3 = Number(headerLabel3)

        this.totals = { tips: 0, subs: 0, cheers: 0 }
        this.amountsRate = { tips: Number(amountPerTip), subs: Number(amountPerSub), cheers: Number(amountPerCheer) }
        this.includes = { tips: this.includeTips, subs: this.includeSubs, cheers: this.includeCheers }

        this.timesObj = WidgetFunctions.createTimesObj(this.target, this.time, this.initialTime, this.headerLabel1, this.headerLabel2, this.headerLabel3, CURVES[multiplyTimeFunction])
        this.currentStep = this.timesObj[0]
        this.nextStep = this.timesObj[1]
        this.ghostMode = Boolean(enableGhostMode)
        this.ghostModeTimeout = Number(ghostModeTimeout)
        this.hideHeadersMode = Boolean(hideHeadersMode)
        this.ghostModeRefreshTimeout = Number(ghostModeRefreshTimeout)

        if (this.overlayStatus?.isEditorMode) console.log('Context: initialized')

        this.loadState()
    }

    async loadState() {
        if (this.hasSaveTimeout) return
        if (this.overlayStatus.isEditorMode) console.log('Context: State loaded')
        // @ts-ignore
        const storedData = await SE_API.store.get('timer')

        this.timerCountStarts = new Date(storedData.timerCountStarts)
        this.totals = storedData.totals

        this.updateContext(false)

    }
    async saveState() {
        clearTimeout(this.saveTimeout)
        this.hasSaveTimeout = true
        if (this.overlayStatus.isEditorMode) console.log('Context: Call saveState')
        this.saveTimeout = setTimeout(async () => {
            // @ts-ignore
            await SE_API.store.set('timer', { timerCountStarts: this.timerCountStarts, totals: this.totals })
            this.hasSaveTimeout = false
            if (this.overlayStatus.isEditorMode) console.log('Context: State saved')
        }, 1000)
    }

    private updateContext(save = true) {
        let stepsOfTips = 0
        let stepsOfSubs = 0
        let stepsOfCheers = 0
        if (this.includes.tips && this.amountsRate.tips > 0) {
            stepsOfTips = this.totals.tips / this.amountsRate.tips
        }
        if (this.includes.subs && this.amountsRate.subs > 0) {
            stepsOfSubs = this.totals.subs / this.amountsRate.subs
        }
        if (this.includes.cheers && this.amountsRate.cheers > 0) {
            stepsOfCheers = this.totals.cheers / this.amountsRate.cheers
        }

        const totalSteps = stepsOfCheers + stepsOfTips + stepsOfSubs
        this.currentStep = this.timesObj[(totalSteps > this.target ? this.target : totalSteps)]
        this.nextStep = this.timesObj[(totalSteps + 1 > this.target ? this.target : totalSteps + 1)]

        this.showHeader = !((this.currentStep.addTime1 + this.currentStep.addTime2 + this.currentStep.addTime3) < 1 || (this.currentStep.step == this.nextStep.step));

        this.showHeaderLabel1 = !(this.currentStep.addTime1 < 1);
        this.showHeaderLabel2 = !((this.currentStep.addTime2) < 1 || (this.currentStep.addTime2 == this.currentStep.addTime1));
        this.showHeaderLabel3 = !((this.currentStep.addTime3) < 1 || (this.currentStep.addTime3 == this.currentStep.addTime2));

        Renderer.renderHeaders(this.headersData)

        if (this.overlayStatus.isEditorMode) console.log('Context: Checking Steps', this.currentStep)
        if (save) this.saveState()
    }

    addSubscriber(amount: number) {
        if (this.includeSubs) {
            if (this.overlayStatus.isEditorMode) console.log('Context: addSubscriber', amount)
            this.totals.subs += amount
            this.updateContext()
        }
        return this.includeSubs
    }

    addCheer(amount: number) {
        if (this.includeCheers) {
            if (this.overlayStatus.isEditorMode) console.log('Context: addCheer', amount)
            this.totals.cheers += amount
            this.updateContext()
        }
        return this.includeCheers
    }

    addTip(amount: number) {
        if (this.includeTips) {
            if (this.overlayStatus.isEditorMode) console.log('Context: addTip', amount)
            this.totals.tips += amount
            this.updateContext()
        }
        return this.includeTips
    }

    resetTimer() {
        if (this.overlayStatus.isEditorMode) console.log('Context: resetTimer')
        this.timerCountStarts = new Date()
        this.updateContext()
    }

    async resetTotals() {
        if (this.overlayStatus.isEditorMode) console.log('Context: resetTotals')

        this.totals = { tips: 0, subs: 0, cheers: 0 }

        this.updateContext()
    }
}

class Events {

    static load(listener: Types.eventType, event: Types.event, context: Context) {
        let skip = true
        console.log(event)
        if (Events.event[listener]) {
            skip = Events.event[listener](event, context)
        }
    }

    static event = {
        follower(event: Types.event, context: Context) { return false },
        redemption(event: Types.event, context: Context) { return false },
        subscriber(event: Types.event, context: Context) {
            return context.addSubscriber(event.amount)
        },
        host(event: Types.event, context: Context) { return false },
        cheer(event: Types.event, context: Context) {
            return context.addCheer(event.amount)
        },
        tip(event: Types.event, context: Context) {
            return context.addTip(event.amount)
        }
        ,
        raid(event: Types.event, context: Context) { return false },
        "event:test"(event: Types.event, context: Context) {
            if (event.field === 'resetTimer') {
                context.resetTimer()
                return false
            } else if (event.field === 'resetTotals') {
                context.resetTotals()
                Renderer.renderHeaders(context.headersData)
                return false
            } else {
                return true
            }
        },
    }

}


class Renderer {
    static ghostTimeout: NodeJS.Timeout

    static config(fieldData: Types.fieldData) {



        if (Boolean(fieldData.enableGhostMode) && Boolean(fieldData.hideHeadersMode)) $('#container').addClass('noheaders')

        if (Boolean(fieldData.enableGhostMode)) $('#container').addClass('ghost')

        Number(fieldData.headerLabel1) > 0 ? $('#first.header .label').text(`${fieldData.headerLabel1}X`) : $('#first').fadeIn()
        Number(fieldData.headerLabel2) > 0 ? $('#second.header .label').text(`${fieldData.headerLabel2}X`) : $('#second').fadeIn()
        Number(fieldData.headerLabel3) > 0 ? $('#third.header .label').text(`${fieldData.headerLabel3}X`) : $('#third').fadeIn()

        if (Number(fieldData.headerLabel1) + Number(fieldData.headerLabel2) + Number(fieldData.headerLabel3) < 1) $('#header').addClass('hide')

    }

    static renderHeaders({ currentStep, showMarks, showHeader, showHeaderLabel1, showHeaderLabel2, showHeaderLabel3 }: typeof Context.prototype.headersData) {

        showMarks ? $('#steps span').css('opacity', '0.6') : $('#steps span').css('opacity', '0')

        $('#steps span').text(`${currentStep.step}X ${WidgetFunctions.formatTimeWithHour(currentStep.stackTime)}`)

        const header1Minute = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime1))[0]
        const header1Second = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime1))[1]

        const header2Minute = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime2))[0]
        const header2Second = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime2))[1]

        const header3Minute = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime3))[0]
        const header3Second = WidgetFunctions.convertTime(WidgetFunctions.secondsToTime(currentStep.addTime3))[1]

        $('#first.header .text').text(`${header1Minute}:${header1Second}`)

        $('#second.header .text').text(`${header2Minute}:${header2Second}`)

        $('#third.header .text').text(`${header3Minute}:${header3Second}`)

        showHeaderLabel1 ? $('#first.header').removeClass('hide') : $('#first.header').addClass('hide')
        showHeaderLabel2 ? $('#second.header').removeClass('hide') : $('#second.header').addClass('hide')
        showHeaderLabel3 ? $('#third.header').removeClass('hide') : $('#third.header').addClass('hide')
        showHeader ? $('#header').removeClass('hide') : $('#header').addClass('hide')

    }



    static renderCountDown({ timerCountStarts, currentstackTime }: typeof Context.prototype.countDownData) {
        const countDownStartsTime = WidgetFunctions.diffInSeconds(timerCountStarts) > 0 ? WidgetFunctions.diffInSeconds(timerCountStarts) : 0
        const elapsedTime = WidgetFunctions.diffInSeconds(new Date(), timerCountStarts) > 0 ? WidgetFunctions.diffInSeconds(new Date(), timerCountStarts) : 0
        const aditionalTime = currentstackTime


        $('#body .timer .text').text(WidgetFunctions.formatTimeWithHour(countDownStartsTime + aditionalTime - elapsedTime))
    }

    static activateWidget({ ghostMode, ghostModeTimeout }: typeof Context.prototype.activateWidgetData) {
        $('#container').removeClass('ghost')
        if (ghostMode) {

            clearTimeout(this.ghostTimeout)
            this.ghostTimeout = setTimeout(() => {
                $('#container').addClass('ghost')
            }, ghostModeTimeout * 1000)
        }
    }



}



class WidgetFunctions {

    static createTimesObj(target: number, time: number, initialTime: number, stepsTime1: number, stepsTime2: number, stepsTime3: number, curve: Types.curve): Types.timesObj[] {

        const stepsArray = createStepsArray(target)
        const progressArray = setProgressInArray(target, stepsArray)
        const multiplierArray = setMultiplierInArray(curve, progressArray)
        const addTimeArray = setAddTimeInArray(time, multiplierArray)
        const stackTimeArray = setStackTimeInArray(initialTime, addTimeArray)
        const addTime1Array = setCustomAddTimeInArray(stackTimeArray, stepsTime1, '1')
        const addTime2Array = setCustomAddTimeInArray(addTime1Array, stepsTime2, '2')
        const addTime3Array = setCustomAddTimeInArray(addTime2Array, stepsTime3, '3')


        return addTime3Array as { step: number, progress: number, multiply: number, addTime: number, stackTime: number, addTime1: number, addTime2: number, addTime3: number }[]

        function createStepsArray(target: number) {
            const stepsArray = [{ step: 0 }]
            for (let step = 1; step <= target; step++) {
                stepsArray.push({ step })
            }
            return stepsArray
        }

        function setProgressInArray(target: number, stepsArray: { step: number }[]) {
            return stepsArray.map(({ step }) => {
                return { step, progress: calcProgress(step, target) }
            })
        }

        function setMultiplierInArray(curve: Types.curve, stepsArray: { step: number, progress: number; }[]) {
            return stepsArray.map(({ step, progress }) => {
                return { step, progress, multiply: calcMultiplier(progress, curve) }
            })
        }

        function setAddTimeInArray(time: number, stepsArray: { step: number, progress: number, multiply: number }[]) {
            return stepsArray.map(({ step, progress, multiply }) => {
                return { step, progress, multiply, addTime: time * multiply }
            })
        }

        function setStackTimeInArray(initialTime: number, stepsArray: { step: number, progress: number, multiply: number, addTime: number }[]) {
            return stepsArray.map(({ step, progress, multiply, addTime }) => {
                let stackTime = initialTime
                for (let i = 1; i <= step; i++) {
                    stackTime += stepsArray[i].addTime
                }
                return { step, progress, multiply, addTime, stackTime }
            })
        }

        function setCustomAddTimeInArray(stepsArray: { step: number, progress: number, multiply: number, addTime: number, stackTime: number }[], nextSteps: number, customIndex: '1' | '2' | '3') {
            return stepsArray.map((stepArray) => {
                let customAddTime = 0
                for (let i = 0; i < nextSteps; i++) {
                    customAddTime += stepsArray[stepArray.step + i]?.addTime || 0
                }

                return { ...stepArray, ['addTime' + customIndex]: customAddTime }
            })
        }



        function calcMultiplier(progress: number, curve: Types.curve) {
            return curve.a * Math.pow(progress, 2) + (curve.b * progress) + curve.c
        }

        function calcProgress(current: number, max: number) {
            return current / max
        }
    }

    static formatTimeWithHour(time: number) {
        const [hh, mm, ss, negative] = WidgetFunctions.secondsToTime(time)
        const hidehour = Number(hh) == 0

        const hour = hidehour ? '' : negative ? '-' + hh : hh
        const hMarker = hidehour ? '' : ':'
        const minute = hidehour ? negative ? '-' + mm : mm : mm
        const second = ss
        return `${hour}${hMarker}${minute}:${second}`
    }

    static convertTime(arr: Types.arrTimes): [string | number, string | number, boolean] {
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
    static diffInSeconds(date1: Date, date2?: Date) {
        const date = date2 || new Date()
        const diff = date1.getTime() - date.getTime()
        return Math.floor(diff / 1000);
    }

    static secondsToTime(seconds: number): [string, string, string, boolean] {
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
