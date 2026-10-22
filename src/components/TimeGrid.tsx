import { forwardRef } from 'react';
import type { Block, Item, Rect } from '../types';
import type { Draft, Edges } from '../lib/useGridDrag';
import { DAYS, DAY_SLOTS, OT_SLOTS, dayTotals, formatHours, isFree, rectStyle } from '../lib/grid';
import { formatDayMonth, isSameDay, weekDays } from '../lib/week';
import { TimeBlock } from './TimeBlock';
import './TimeGrid.css';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface Props {
  week: string;
  today: Date;
  /** Blocks in the displayed week. */
  blocks: Block[];
  items: Map<string, Item>;
  draft: Draft | null;
  onMoveStart: (block: Block, e: React.PointerEvent) => void;
  onResizeStart: (block: Block, edges: Edges, e: React.PointerEvent) => void;
  onChange: (id: string, rect: Rect) => void;
  onDuplicate: (block: Block) => void;
  onRemove: (id: string) => void;
}

/** The Mon–Fri grid: day headers, 8 working hours (one row each), and the pink overtime band. */
export const TimeGrid = forwardRef<HTMLDivElement, Props>(function TimeGrid(
  { week, today, blocks, items, draft, onMoveStart, onResizeStart, onChange, onDuplicate, onRemove },
  bodyRef,
) {
  const days = weekDays(week);
  const totals = dayTotals(blocks);

  return (
    <div className="tb-grid">
      <div className="tb-grid__header">
        {days.map((d, i) => (
          <div key={i} className={`tb-grid__day${isSameDay(d, today) ? ' tb-grid__day--today' : ''}`}>
            <span className="tb-grid__day-name">{DAY_NAMES[i]}</span>
            <span className="tb-grid__day-meta">
              {formatDayMonth(d)} · {formatHours(totals[i])}
            </span>
          </div>
        ))}
      </div>

      <div className="tb-grid__body" ref={bodyRef} data-testid="grid-body">
        {/* Background: one row per working hour (alternating shade), then the overtime band. */}
        <div className="tb-grid__rows" aria-hidden="true">
          {Array.from({ length: DAY_SLOTS / 2 }, (_, i) => (
            <div key={i} className="tb-grid__row" />
          ))}
          <div className="tb-grid__overtime" style={{ height: `calc(${OT_SLOTS} * var(--slot-height))` }}>
            Overtime
          </div>
        </div>
        <div className="tb-grid__columns" aria-hidden="true">
          {Array.from({ length: DAYS }, (_, i) => (
            <div key={i} className="tb-grid__column" />
          ))}
        </div>

        {blocks.map((b) => {
          const item = items.get(b.itemId);
          if (!item) return null;
          const dragging = draft?.blockId === b.id;
          return (
            <TimeBlock
              key={b.id}
              block={b}
              item={item}
              rect={dragging ? draft.rect : b}
              dragging={dragging}
              onPointerDownBody={(e) => onMoveStart(b, e)}
              onPointerDownHandle={(edges, e) => onResizeStart(b, edges, e)}
              onKeyChange={(rect) => isFree(blocks, rect, b.id) && onChange(b.id, rect)}
              onDuplicate={() => onDuplicate(b)}
              onRemove={() => onRemove(b.id)}
            />
          );
        })}

        {draft?.item && (
          <div
            className={`tb-grid__preview${draft.valid ? '' : ' tb-grid__preview--invalid'}`}
            style={rectStyle(draft.rect)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
});
