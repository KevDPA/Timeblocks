import { useMemo, useRef, useState } from 'react';
import { PROJECT_CATALOGUE, NON_PROJECT_ITEMS } from './data';
import type { Block, Item } from './types';
import { findFreeSpot, isFree } from './lib/grid';
import { useGridDrag } from './lib/useGridDrag';
import { useTimesheet } from './lib/useTimesheet';
import { addWeeks, formatRange, mondayOf } from './lib/week';
import { ButtonIcon } from './design-system/components/ButtonIcon';
import { Button } from './design-system/components/Button';
import { Icon } from './design-system/components/Icon';
import { Tray } from './components/Tray';
import { TimeGrid } from './components/TimeGrid';
import './App.css';

const KNOWN_ITEMS = [...PROJECT_CATALOGUE, ...NON_PROJECT_ITEMS];

export default function App() {
  const { tray, blocks, addToTray, addBlock, updateBlock, removeBlock } = useTimesheet();
  // Fixed for the session; a tab left open across midnight keeps its week until reload.
  const [today] = useState(() => new Date());
  const thisWeek = mondayOf(today);
  const [week, setWeek] = useState(thisWeek);
  const bodyRef = useRef<HTMLDivElement>(null);

  const weekBlocks = useMemo(() => blocks.filter((b) => b.week === week), [blocks, week]);
  const items = useMemo(() => new Map<string, Item>([...KNOWN_ITEMS, ...tray].map((i) => [i.id, i])), [tray]);

  const { draft, pointer, startCreate, startMove, startResize } = useGridDrag({
    bodyRef,
    blocks: weekBlocks,
    onCreate: (itemId, rect) => addBlock(itemId, week, rect),
    onUpdate: updateBlock,
  });

  const duplicate = (b: Block) => {
    const spot = findFreeSpot(weekBlocks, b);
    if (spot) addBlock(b.itemId, week, spot);
  };

  const ghostItem = draft?.item ?? null;

  return (
    <main className="tb-app">
      <header className="tb-app__header">
        <h1 className="tb-app__title">Time Tracker</h1>
        <div className="tb-app__week" aria-live="polite">
          <ButtonIcon
            type="transparent"
            aria-label="Previous week"
            icon={<Icon name="chevron_left" />}
            onClick={() => setWeek((w) => addWeeks(w, -1))}
          />
          <div className="tb-app__week-label">
            <strong>{week === thisWeek ? 'Current week' : `Week of ${formatRange(week).split(' – ')[0]}`}</strong>
            <span>{formatRange(week)}</span>
          </div>
          <ButtonIcon
            type="transparent"
            aria-label="Next week"
            icon={<Icon name="chevron_right" />}
            onClick={() => setWeek((w) => addWeeks(w, 1))}
          />
        </div>
        <div className="tb-app__today">
          {week !== thisWeek && <Button type="outline" size="sm" label="Back to this week" onClick={() => setWeek(thisWeek)} />}
        </div>
      </header>

      <div className="tb-app__panel">
        <Tray items={tray} onAdd={addToTray} onChipPointerDown={startCreate} />
        <TimeGrid
          ref={bodyRef}
          week={week}
          today={today}
          blocks={weekBlocks}
          items={items}
          draft={draft}
          onMoveStart={startMove}
          onResizeStart={startResize}
          onChange={(id, rect) => isFree(weekBlocks, rect, id) && updateBlock(id, rect)}
          onDuplicate={duplicate}
          onRemove={removeBlock}
        />
      </div>

      {ghostItem && pointer && (
        <div
          className={`tb-chip tb-chip--color-${ghostItem.color} tb-ghost`}
          style={{ left: pointer.x, top: pointer.y }}
          aria-hidden="true"
        >
          {ghostItem.name}
        </div>
      )}
    </main>
  );
}
