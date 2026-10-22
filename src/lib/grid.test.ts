import { describe, expect, it } from 'vitest';
import type { Block } from '../types';
import { blockHours, dayTotals, findFreeSpot, isFree, overlaps, slotTime } from './grid';

const block = (id: string, day: number, span: number, start: number, length: number): Block => ({
  id, itemId: 'x', week: '2026-10-19', day, span, start, length,
});

describe('grid', () => {
  it('detects overlap across days and slots', () => {
    expect(overlaps(block('a', 0, 2, 0, 4), block('b', 1, 1, 3, 2))).toBe(true);
    expect(overlaps(block('a', 0, 1, 0, 4), block('b', 1, 1, 0, 4))).toBe(false);
    expect(overlaps(block('a', 0, 1, 0, 4), block('b', 0, 1, 4, 2))).toBe(false);
  });

  it('rejects rects off the grid', () => {
    expect(isFree([], { day: 4, span: 2, start: 0, length: 2 })).toBe(false);
    expect(isFree([], { day: 0, span: 1, start: 19, length: 2 })).toBe(false);
    expect(isFree([], { day: 0, span: 1, start: 18, length: 2 })).toBe(true);
  });

  it('ignores the block being moved when checking freedom', () => {
    const a = block('a', 0, 1, 0, 4);
    expect(isFree([a], { day: 0, span: 1, start: 1, length: 4 }, 'a')).toBe(true);
    expect(isFree([a], { day: 0, span: 1, start: 1, length: 4 })).toBe(false);
  });

  it('places a duplicate straight after the original when free', () => {
    const a = block('a', 1, 1, 0, 4);
    expect(findFreeSpot([a], a)).toEqual({ day: 1, span: 1, start: 4, length: 4 });
  });

  it('falls back to the first free spot when the space after is taken', () => {
    const a = block('a', 0, 1, 0, 4);
    const b = block('b', 0, 1, 4, 16);
    expect(findFreeSpot([a, b], a)).toEqual({ day: 1, span: 1, start: 0, length: 4 });
  });

  it('counts hours per day and per block', () => {
    expect(blockHours({ day: 0, span: 3, start: 0, length: 4 })).toBe(6);
    expect(dayTotals([block('a', 0, 2, 0, 4), block('b', 1, 1, 4, 2)])).toEqual([2, 3, 0, 0, 0]);
  });

  it('maps slots to clock times from 09:00', () => {
    expect(slotTime(0)).toBe('09:00');
    expect(slotTime(3)).toBe('10:30');
    expect(slotTime(16)).toBe('17:00');
  });
});
