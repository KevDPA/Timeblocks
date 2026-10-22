import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { Block, Item, Rect } from '../types';
import { DAYS, TOTAL_SLOTS, clamp, isFree } from './grid';

/** Which edges of a block a resize handle moves. */
export interface Edges {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

type Mode =
  | { kind: 'create'; item: Item }
  | { kind: 'move'; block: Block; origin: { fx: number; fy: number } }
  | { kind: 'resize'; block: Block; edges: Edges };

export interface Draft {
  rect: Rect;
  valid: boolean;
  /** Set while moving/resizing an existing block. */
  blockId?: string;
  /** Set while dragging a new block in from the tray. */
  item?: Item;
}

/** New blocks start at one hour, centred on the pointer. */
const NEW_BLOCK_SLOTS = 2;

interface Options {
  /** The grid body (below the day headers) — pointer positions are converted to day/slot cells against it. */
  bodyRef: RefObject<HTMLElement | null>;
  blocks: Block[];
  onCreate: (itemId: string, rect: Rect) => void;
  onUpdate: (id: string, rect: Rect) => void;
}

/**
 * Pointer-driven drag engine for the week grid: dragging a tray chip onto
 * the grid creates a block; dragging a block moves it; dragging its edges
 * resizes it. Everything snaps to half-hour/day cells and can't overlap
 * another block. Move/resize "stick" at the last valid position, so a block
 * slides up against its neighbours instead of snapping back.
 */
export function useGridDrag({ bodyRef, blocks, onCreate, onUpdate }: Options) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const modeRef = useRef<Mode | null>(null);
  const draftRef = useRef<Draft | null>(null);
  const blocksRef = useRef(blocks);
  const cbRef = useRef({ onCreate, onUpdate });
  useEffect(() => {
    blocksRef.current = blocks;
    cbRef.current = { onCreate, onUpdate };
  });

  const toCell = useCallback(
    (e: PointerEvent) => {
      const rect = bodyRef.current!.getBoundingClientRect();
      return {
        fx: ((e.clientX - rect.left) / rect.width) * DAYS,
        fy: ((e.clientY - rect.top) / rect.height) * TOTAL_SLOTS,
      };
    },
    [bodyRef],
  );

  const compute = useCallback((mode: Mode, fx: number, fy: number): Draft | null => {
    const all = blocksRef.current;
    if (mode.kind === 'create') {
      if (fx < 0 || fx >= DAYS || fy < 0 || fy > TOTAL_SLOTS) return null;
      const rect: Rect = {
        day: Math.floor(fx),
        span: 1,
        start: clamp(Math.round(fy) - NEW_BLOCK_SLOTS / 2, 0, TOTAL_SLOTS - NEW_BLOCK_SLOTS),
        length: NEW_BLOCK_SLOTS,
      };
      return { rect, valid: isFree(all, rect), item: mode.item };
    }
    const b = mode.block;
    let rect: Rect;
    if (mode.kind === 'move') {
      rect = {
        ...b,
        day: clamp(b.day + Math.round(fx - mode.origin.fx), 0, DAYS - b.span),
        start: clamp(b.start + Math.round(fy - mode.origin.fy), 0, TOTAL_SLOTS - b.length),
      };
    } else {
      const { edges } = mode;
      let left = b.day;
      let right = b.day + b.span;
      let top = b.start;
      let bottom = b.start + b.length;
      if (edges.left) left = clamp(Math.round(fx), 0, right - 1);
      if (edges.right) right = clamp(Math.round(fx), left + 1, DAYS);
      if (edges.top) top = clamp(Math.round(fy), 0, bottom - 1);
      if (edges.bottom) bottom = clamp(Math.round(fy), top + 1, TOTAL_SLOTS);
      rect = { day: left, span: right - left, start: top, length: bottom - top };
    }
    const valid = isFree(all, rect, b.id);
    return { rect, valid, blockId: b.id };
  }, []);

  const finish = useCallback((commit: boolean) => {
    const mode = modeRef.current;
    const d = draftRef.current;
    modeRef.current = null;
    draftRef.current = null;
    setDraft(null);
    setPointer(null);
    if (!commit || !mode || !d || !d.valid) return;
    if (mode.kind === 'create') cbRef.current.onCreate(mode.item.id, d.rect);
    else cbRef.current.onUpdate(mode.block.id, d.rect);
  }, []);

  const begin = useCallback(
    (mode: Mode, e: React.PointerEvent) => {
      if (e.button !== 0 || modeRef.current) return;
      e.preventDefault();
      modeRef.current = mode;
      const start = { fx: 0, fy: 0 };
      if (mode.kind === 'move') Object.assign(start, toCell(e.nativeEvent));

      const apply = (ev: PointerEvent) => {
        const m = modeRef.current;
        if (!m) return;
        setPointer({ x: ev.clientX, y: ev.clientY });
        const { fx, fy } = toCell(ev);
        const next = compute(m.kind === 'move' ? { ...m, origin: start } : m, fx, fy);
        // Move/resize hold their last valid spot; a create preview shows invalid in place.
        const keep = m.kind !== 'create' && next && !next.valid ? draftRef.current : next;
        draftRef.current = keep;
        setDraft(keep);
      };
      const up = (ev: PointerEvent) => {
        apply(ev);
        cleanup();
        finish(true);
      };
      const key = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          cleanup();
          finish(false);
        }
      };
      const cleanup = () => {
        window.removeEventListener('pointermove', apply);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', cancel);
        window.removeEventListener('keydown', key);
        document.documentElement.removeAttribute('data-dragging');
      };
      const cancel = () => {
        cleanup();
        finish(false);
      };
      window.addEventListener('pointermove', apply);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', cancel);
      window.addEventListener('keydown', key);
      document.documentElement.setAttribute('data-dragging', mode.kind);
      apply(e.nativeEvent);
    },
    [compute, finish, toCell],
  );

  return {
    draft,
    pointer,
    startCreate: (item: Item, e: React.PointerEvent) => begin({ kind: 'create', item }, e),
    startMove: (block: Block, e: React.PointerEvent) => begin({ kind: 'move', block, origin: { fx: 0, fy: 0 } }, e),
    startResize: (block: Block, edges: Edges, e: React.PointerEvent) => begin({ kind: 'resize', block, edges }, e),
  };
}
