
export type curve = { a: number, b: number, c: number }

export default function calcMultiplier(progress: number, curve: curve) {
    return curve.a * Math.pow(progress, 2) + (curve.b * progress) + curve.c
}
 