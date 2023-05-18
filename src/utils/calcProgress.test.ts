import { describe, expect, test } from '@jest/globals';
import calcProgress from './calcProgress';

describe('Testando Calculo de progreçao', () => {
    test('Testando 0%', () => {
        expect(calcProgress(0, 100)).toBe(0.0);
    });
    test('Testando 10%', () => {
        expect(calcProgress(10, 100)).toBe(0.1);
    });
    test('Testando 20%', () => {
        expect(calcProgress(20, 100)).toBe(0.2);
    });
    test('Testando 30%', () => {
        expect(calcProgress(30, 100)).toBe(0.3);
    });
    test('Testando 40%', () => {
        expect(calcProgress(40, 100)).toBe(0.4);
    });
    test('Testando 50%', () => {
        expect(calcProgress(50, 100)).toBe(0.5);
    });
    test('Testando 60%', () => {
        expect(calcProgress(60, 100)).toBe(0.6);
    });
    test('Testando 70%', () => {
        expect(calcProgress(70, 100)).toBe(0.7);
    });
    test('Testando 80%', () => {
        expect(calcProgress(80, 100)).toBe(0.8);
    });
    test('Testando 90%', () => {
        expect(calcProgress(90, 100)).toBe(0.9);
    });
    test('Testando 100%', () => {
        expect(calcProgress(100, 100)).toBe(1);
    });
});