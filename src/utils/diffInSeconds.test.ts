import { describe, expect, test } from '@jest/globals'; 
import diffInSeconds from './diffInSeconds';


describe('Testando Diferença de horas em segundos', () => {
  test('Testando 0 segundos', () => {
    expect(diffInSeconds(new Date(),new Date())).toBe(0);
  }); 
  test('Testando 7 segundos', () => {
    expect(diffInSeconds(new Date('2023-05-18T20:55:20.000Z'),new Date('2023-05-18T20:55:13.000Z'))).toBe(7);
  }); 
  test('Testando 1 minuto', () => {
    expect(diffInSeconds(new Date('2023-05-18T20:56:20.000Z'),new Date('2023-05-18T20:55:20.000Z'))).toBe(60);
  }); 
  test('Testando 1 dia', () => {
    expect(diffInSeconds(new Date('2023-05-19T20:56:20.000Z'),new Date('2023-05-18T20:56:20.000Z'))).toBe(86400);
  }); 
});