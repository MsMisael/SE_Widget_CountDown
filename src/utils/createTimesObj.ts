

import { curve } from './calcMultiplier'
import calcProgress from './calcProgress'
import calcMultiplier from './calcMultiplier'

export default function createTimesObj(target: number, time: number, initialTime: number, stepsTime1: number, stepsTime2: number, stepsTime3: number, curve: curve) {

    const stepsArray = createStepsArray(target)
    const progressArray = setProgressInArray(10, stepsArray)
    const multiplierArray = setMultiplierInArray(curve, progressArray)
    const addTimeArray = setAddTimeInArray(time, multiplierArray)
    const stackTimeArray = setStackTimeInArray(initialTime, addTimeArray)
    const addTime1Array = setCustomAddTimeInArray(stackTimeArray, stepsTime1, '1')
    const addTime2Array = setCustomAddTimeInArray(addTime1Array, stepsTime2, '2')
    const addTime3Array = setCustomAddTimeInArray(addTime2Array, stepsTime3, '3')

    return addTime3Array
}

export function createStepsArray(target: number) {
    const stepsArray = [{ step: 0 }]
    for (let step = 1; step <= target; step++) {
        stepsArray.push({ step })
    }
    return stepsArray
}

export function setProgressInArray(target: number, stepsArray: { step: number }[]) {
    return stepsArray.map(({ step }) => {
        return { step, progress: calcProgress(step, target) }
    })
}

export function setMultiplierInArray(curve: curve, stepsArray: { step: number, progress: number; }[]) {
    return stepsArray.map(({ step, progress }) => {
        return { step, progress, multiply: calcMultiplier(progress, curve) }
    })
}

export function setAddTimeInArray(time: number, stepsArray: { step: number, progress: number, multiply: number }[]) {
    return stepsArray.map(({ step, progress, multiply }) => {
        return { step, progress, multiply, addTime: time * multiply }
    })
}

export function setStackTimeInArray(initialTime: number, stepsArray: { step: number, progress: number, multiply: number, addTime: number }[]) {
    return stepsArray.map(({ step, progress, multiply, addTime }) => {
        let stackTime = initialTime
        for (let i = 1; i <= step; i++) {
            stackTime += stepsArray[i].addTime
        }
        return { step, progress, multiply, addTime, stackTime }
    })
}

export function setCustomAddTimeInArray(stepsArray: { step: number, progress: number, multiply: number, addTime: number, stackTime: number }[], nextSteps: number, customIndex: '1' | '2' | '3') {
    return stepsArray.map((stepArray) => {
        let customAddTime = 0
        for (let i = 0; i < nextSteps; i++) {
            customAddTime += stepsArray[stepArray.step + i]?.addTime || 0
        }

        return { ...stepArray, ['addTime' + customIndex]: customAddTime }
    })
}



//20230597438