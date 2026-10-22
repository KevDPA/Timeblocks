import { useEffect, useMemo, useRef, useState } from 'react';
import type { Item } from '../types';
import { Field } from '../design-system/components/Field';
import { Icon } from '../design-system/components/Icon';
import { Menu } from '../design-system/components/Menu';
import './ProjectSearch.css';

interface Props {
  /** Every project that can be found. */
  catalogue: Item[];
  /** Ids already in the tray — excluded from results. */
  addedIds: Set<string>;
  onAdd: (item: Item) => void;
}

/** "Search for a project…" — type to find a project, pick a result to add it to the tray. */
export function ProjectSearch({ catalogue, addedIds, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogue.filter(
      (p) => !addedIds.has(p.id) && (!q || p.name.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q)),
    );
  }, [catalogue, addedIds, query]);

  const choose = (id: string) => {
    const item = catalogue.find((p) => p.id === id);
    if (!item) return;
    onAdd(item);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="tb-search" ref={rootRef}>
      <Field
        type="search"
        value={query}
        placeholder="Search for a project…"
        aria-label="Search for a project"
        aria-expanded={open}
        role="combobox"
        aria-controls="tb-search-results"
        autoComplete="off"
        iconRight={<Icon name="search" />}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
          if (e.key === 'Enter' && results[0]) choose(results[0].id);
        }}
      />
      {open && (
        <div className="tb-search__panel" id="tb-search-results">
          {results.length === 0 ? (
            <p className="tb-search__empty">No matching projects</p>
          ) : (
            <Menu
              corner="rounded"
              aria-label="Matching projects"
              items={results.map((p) => ({ value: p.id, label: p.name, subtext: p.code }))}
              onChange={choose}
            />
          )}
        </div>
      )}
    </div>
  );
}
