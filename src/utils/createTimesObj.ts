

import { curve } from './calcMultiplier'
import calcProgress from './calcProgress'
import calcMultiplier from './calcMultiplier'

export default function createTimesObj(target: number, time: number, initialTime: number, stepsTime1: number, stepsTime2: number, stepsTime3: number, curve: curve) {

    const arr = [{ step: 0, progress: 0, multiply: 0, stackTime: initialTime, addTime: 0 }]
    for (let i = 1; i <= target; i++) {
        const step = i
        const progress = calcProgress(i, target)
        const multiply = calcMultiplier(calcProgress(i, target), curve)
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

function createStepsArray(initialStep = 0, target: number) {
    const stepsArray = [{ step: initialStep }]
    for (let step = 1; step < target; step++) {
        stepsArray.push({ step })
    }
    return stepsArray
}

function setProgressInArray(stepsArray: { step: number }[]) {
    return stepsArray.map(({ step }) => {
        return { step, progress: calcProgress(step, stepsArray.length) }
    })
}

function setMultiplierInArray(curve: curve, stepsArray: { step: number, progress: number; }[]) {
    return stepsArray.map(({ step, progress }) => {
        return { step, progress, multiply: calcMultiplier(progress, curve) }
    })
}

function setAddTimeInArray(time: number, stepsArray: { step: number, progress: number, multiply: number }[]) {
    return stepsArray.map(({ step, progress, multiply }) => {
        return { step, progress, multiply, addTime: time * multiply }
    })
}

function setStackTimeInArray(stepsArray: { step: number, progress: number, multiply: number, addTime: number }[]) {
    return stepsArray.map(({ step, progress, multiply, addTime }, index) => {
        let stackTime = 0
        for (let i = 0; i < index; i++) {
            stackTime += stepsArray[i].addTime
        }
        return { step, progress, multiply, addTime, stackTime }
    })
}

//20230597438