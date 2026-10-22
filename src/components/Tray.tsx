import type { Item } from '../types';
import { NON_PROJECT_ITEMS, PROJECT_CATALOGUE } from '../data';
import { Dropdown } from '../design-system/components/Dropdown';
import { ProjectSearch } from './ProjectSearch';
import './Tray.css';

interface Props {
  items: Item[];
  onAdd: (item: Item) => void;
  onChipPointerDown: (item: Item, e: React.PointerEvent) => void;
}

/** Projects/activities available to log time against, plus the controls to add more. */
export function Tray({ items, onAdd, onChipPointerDown }: Props) {
  const addedIds = new Set(items.map((i) => i.id));
  const otherOptions = NON_PROJECT_ITEMS.filter((i) => !addedIds.has(i.id)).map((i) => ({
    value: i.id,
    primaryText: i.name,
  }));

  return (
    <section className="tb-tray" aria-label="Available projects">
      <ul className="tb-tray__chips">
        {items.map((item) => (
          <li key={item.id}>
            <div
              className={`tb-chip tb-chip--color-${item.color}`}
              onPointerDown={(e) => onChipPointerDown(item, e)}
              role="button"
              tabIndex={0}
              aria-label={`${item.name} — drag onto the week to log time`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
              }}
            >
              {item.name}
            </div>
          </li>
        ))}
      </ul>
      <div className="tb-tray__controls">
        <ProjectSearch catalogue={PROJECT_CATALOGUE} addedIds={addedIds} onAdd={onAdd} />
        <div className="tb-tray__dropdown">
          <Dropdown
            placeholder="Non project items"
            options={otherOptions}
            value=""
            onChange={(id) => {
              const item = NON_PROJECT_ITEMS.find((i) => i.id === id);
              if (item) onAdd(item);
            }}
          />
        </div>
      </div>
    </section>
  );
}
