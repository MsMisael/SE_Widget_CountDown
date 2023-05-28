


export type fieldData = {
    target: string
    time: string
    initialTime: string
    includeTips: string
    includeSubs: string
    includeCheers: string
    inclufieldData: string
    multiplyTimeFunction: curvesKey
    headerLabel1: string
    headerLabel2: string
    headerLabel3: string
    amountPerTip: string
    amountPerSub: string
    amountPerCheer: string
    enableGhostMode: string
    ghostModeTimeout: string
    ghostTimeout: string
    hideHeadersMode: string
    ghostModeRefreshTimeout: string
    headerHorizontalAlign: string
    headerVerticalAlign: string
    showMarks: string
    headerFont: string
    headerSize: string
    headerColor: string
    headerStrokeColor: string
    headerStrokeWidth: string
    headerVerticalAlignment: string
    headerHorizontalAlignment: string

}

export type curve = { a: number, b: number, c: number }
export type curves = { [key: string]: curve }
export type curvesKey = keyof curves;

export type timesObj = { step: number; progress: number; multiply: number; addTime: number; stackTime: number; addTime1: number; addTime2: number; addTime3: number }


export type arrTimes = [string | number, string | number, string | number, boolean]

export type eventType = 'follower' | 'redemption' | 'subscriber' | 'host' | 'cheer' | 'tip' | 'raid' | 'event:test';
export type event = { amount: number, field: string }

export type overlayStatus = { isEditorMode: boolean }