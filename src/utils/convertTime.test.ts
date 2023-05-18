import { describe, expect, test } from '@jest/globals';
import convertTime from './convertTime';


describe('Testando Converçao de horas pra minutos', () => {
    test('Testando 1 hora', () => {
        expect(convertTime(["01", "00", "00", false])).toStrictEqual(["60", "00", false]);
    });
    test('Testando 1 minuto', () => {
        expect(convertTime(["00", "01", "00", false])).toStrictEqual(["01", "00", false]);
    });
    test('Testando 1 segundo', () => {
        expect(convertTime(["00", "00", "01", false])).toStrictEqual(["00", "01", false]);
    });
    test('Testando 1 hora negativa', () => {
        expect(convertTime(["01", "00", "00", true])).toStrictEqual(["60", "00", true]);
    });
    test('Testando 1 minuto negativo', () => {
        expect(convertTime(["00", "01", "00", true])).toStrictEqual(["01", "00", true]);
    });
    test('Testando 1 segundo negativo', () => {
        expect(convertTime(["00", "00", "01", true])).toStrictEqual(["00", "01", true]);
    });
});