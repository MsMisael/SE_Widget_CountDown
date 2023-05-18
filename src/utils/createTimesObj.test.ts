import { describe, expect, test } from '@jest/globals';
import createTimesObj  from './createTimesObj';

createTimesObj

describe('Testando Diferença de horas em segundos', () => {
    test('Testando 0 segundos', () => {
        const teste = createTimesObj(10, 60, 0, 2, 4, 6, { a: 1, b: 1, c: 1 })

        expect(teste[10]).toStrictEqual({
            step: 10,
            progress: 1,
            multiply: 3,
            addTime: 180,
            stackTime: 1161,
            addTime1: 180,
            addTime2: 180,
            addTime3: 180
        });
    });
});