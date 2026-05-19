import { describe, expect, it } from 'vitest';
import {
  calculateAdminFee,
  calculateCurrentPrize,
  calculateMinimumPrize,
  calculatePrizeContribution,
  splitPrize,
} from './financial';

describe('financial', () => {
  it('calcula taxa administrativa e contribuição de prêmio no padrão 40/60', () => {
    expect(calculateAdminFee(10)).toBe(4);
    expect(calculatePrizeContribution(10)).toBe(6);
  });

  it('calcula prêmio mínimo para bilhetes até 19,90', () => {
    expect(calculateMinimumPrize(10)).toBe(200);
    expect(calculateMinimumPrize(19.9)).toBe(398);
  });

  it('calcula prêmio mínimo para bilhetes acima de 19,90', () => {
    expect(calculateMinimumPrize(20)).toBe(200);
  });

  it('mantém prêmio mínimo enquanto acumulado for menor', () => {
    expect(calculateCurrentPrize(200, 60)).toBe(200);
  });

  it('aumenta prêmio atual quando acumulado supera mínimo', () => {
    expect(calculateCurrentPrize(200, 204)).toBe(204);
  });

  it('divide prêmio entre vencedores', () => {
    expect(splitPrize(200, 2)).toBe(100);
    expect(splitPrize(100, 3)).toBe(33.33);
  });
});

