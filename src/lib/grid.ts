import type { CSSProperties } from 'react';
import type { Block, Rect } from '../types';

export const DAYS = 5;
export const SLOT_MIN = 30;
/** 8 working hours per day. */
export const DAY_SLOTS = 16;
/** Pink overtime band below the working day (2h for now — behaviour TBD). */
export const OT_SLOTS = 4;
export const TOTAL_SLOTS = DAY_SLOTS + OT_SLOTS;
/** Slot 0 is 09:00. */
const DAY_START_MIN = 9 * 60;

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.day < b.day + b.span &&
    b.day < a.day + a.span &&
    a.start < b.start + b.length &&
    b.start < a.start + a.length
  );
}

export function inBounds(r: Rect): boolean {
  return r.span >= 1 && r.length >= 1 && r.day >= 0 && r.day + r.span <= DAYS && r.start >= 0 && r.start + r.length <= TOTAL_SLOTS;
}

/** True when `r` is on the grid and collides with no block other than `ignoreId`. */
export function isFree(blocks: Block[], r: Rect, ignoreId?: string): boolean {
  return inBounds(r) && blocks.every((b) => b.id === ignoreId || !overlaps(b, r));
}

/**
 * Where a duplicate of `r` should go: straight after it on the same days if
 * that's free, otherwise the first free spot scanning the week in reading order.
 */
export function findFreeSpot(blocks: Block[], from: Rect): Rect | null {
  // Copy only the geometry — `from` may be a full Block, and its id must not leak into the duplicate.
  const r: Rect = { day: from.day, span: from.span, start: from.start, length: from.length };
  const after: Rect = { ...r, start: r.start + r.length };
  if (isFree(blocks, after)) return after;
  for (let day = 0; day + r.span <= DAYS; day++) {
    for (let start = 0; start + r.length <= TOTAL_SLOTS; start++) {
      const candidate: Rect = { ...r, day, start };
      if (isFree(blocks, candidate)) return candidate;
    }
  }
  return null;
}

export const slotsToHours = (slots: number) => (slots * SLOT_MIN) / 60;

/** Total hours a block represents (every day it spans counts). */
export const blockHours = (r: Rect) => slotsToHours(r.length) * r.span;

export function formatHours(hours: number): string {
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

export function slotTime(slot: number): string {
  const mins = DAY_START_MIN + slot * SLOT_MIN;
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

/** Hours logged on each weekday (0–4) by `blocks`. */
export function dayTotals(blocks: Block[]): number[] {
  const totals = Array<number>(DAYS).fill(0);
  for (const b of blocks) {
    for (let d = b.day; d < b.day + b.span; d++) totals[d] += slotsToHours(b.length);
  }
  return totals;
}

/** Positions a rect on the grid as percentages, so it follows the grid's width. */
export function rectStyle(r: Rect): CSSProperties {
  return {
    left: `${(r.day / DAYS) * 100}%`,
    width: `${(r.span / DAYS) * 100}%`,
    top: `calc(${r.start} * var(--slot-height))`,
    height: `calc(${r.length} * var(--slot-height))`,
  };
}
