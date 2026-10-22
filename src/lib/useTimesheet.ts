import { useCallback, useEffect, useState } from 'react';
import { ASSIGNED_PROJECTS } from '../data';
import type { Block, Item, Rect } from '../types';

const STORAGE_KEY = 'timeblocks:v1';

interface State {
  tray: Item[];
  blocks: Block[];
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (Array.isArray(parsed.tray) && Array.isArray(parsed.blocks)) return parsed;
    }
  } catch {
    /* unavailable or corrupt storage — start fresh */
  }
  return { tray: ASSIGNED_PROJECTS, blocks: [] };
}

const newId = () => crypto.randomUUID();

/** Tray items + logged blocks, persisted to localStorage. */
export function useTimesheet() {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — keep working in memory */
    }
  }, [state]);

  const addToTray = useCallback((item: Item) => {
    setState((s) => (s.tray.some((i) => i.id === item.id) ? s : { ...s, tray: [...s.tray, item] }));
  }, []);

  const addBlock = useCallback((itemId: string, week: string, rect: Rect) => {
    setState((s) => ({ ...s, blocks: [...s.blocks, { id: newId(), itemId, week, ...rect }] }));
  }, []);

  const updateBlock = useCallback((id: string, rect: Rect) => {
    setState((s) => ({ ...s, blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...rect } : b)) }));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setState((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id) }));
  }, []);

  return { ...state, addToTray, addBlock, updateBlock, removeBlock };
}
