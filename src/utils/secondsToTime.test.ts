import { describe, expect, test } from '@jest/globals';
import secondsToTime from './secondsToTime';


describe('Testando a entrada de horas', () => {
  test('Testando 1h positiva', () => {
    expect(secondsToTime(3600)).toStrictEqual(["01", "00", "00", false]);
  });
  test('Testando 1h negativa', () => {
    expect(secondsToTime(-3600)).toStrictEqual(["01", "00", "00", true]);
  });
  test('Testando 1m positivo', () => {
    expect(secondsToTime(60)).toStrictEqual(["00", "01", "00", false]);
  });
  test('Testando 1m negativo', () => {
    expect(secondsToTime(-60)).toStrictEqual(["00", "01", "00", true]);
  });
  test('Testando 1s positiv0', () => {
    expect(secondsToTime(1)).toStrictEqual(["00", "00", "01", false]);
  });
  test('Testando 1s negativo', () => {
    expect(secondsToTime(-1)).toStrictEqual(["00", "00", "01", true]);
  });
});