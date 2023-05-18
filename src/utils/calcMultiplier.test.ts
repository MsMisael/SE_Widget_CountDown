import { describe, expect, test } from '@jest/globals';
import calcMultiplier from './calcMultiplier';
import calcProgress from './calcProgress';

describe('Testando Calculo do multiplicador', () => {
    test('Testando x=0.1 1x²+1x+1=1.11', () => {
        expect(calcMultiplier(calcProgress(10, 100), { a: 1, b: 1, c: 1 })).toBe(1.11);
    });
    test('Testando x=1 1x²+1x+1=3', () => {
        expect(calcMultiplier(calcProgress(100, 100), { a: 1, b: 1, c: 1 })).toBe(3);
    });
});