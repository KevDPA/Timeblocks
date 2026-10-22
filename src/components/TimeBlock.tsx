import type { Block, Item, Rect } from '../types';
import type { Edges } from '../lib/useGridDrag';
import { DAYS, TOTAL_SLOTS, blockHours, clamp, formatHours, rectStyle, slotTime } from '../lib/grid';
import { ButtonIcon } from '../design-system/components/ButtonIcon';
import { Icon } from '../design-system/components/Icon';
import './TimeBlock.css';

const HANDLES: { id: string; edges: Edges }[] = [
  { id: 't', edges: { top: true } },
  { id: 'b', edges: { bottom: true } },
  { id: 'l', edges: { left: true } },
  { id: 'r', edges: { right: true } },
  { id: 'tl', edges: { top: true, left: true } },
  { id: 'tr', edges: { top: true, right: true } },
  { id: 'bl', edges: { bottom: true, left: true } },
  { id: 'br', edges: { bottom: true, right: true } },
];

interface Props {
  block: Block;
  item: Item;
  /** Rect to draw — differs from `block` while it's being dragged. */
  rect: Rect;
  dragging: boolean;
  onPointerDownBody: (e: React.PointerEvent) => void;
  onPointerDownHandle: (edges: Edges, e: React.PointerEvent) => void;
  onKeyChange: (rect: Rect) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export function TimeBlock({
  block,
  item,
  rect,
  dragging,
  onPointerDownBody,
  onPointerDownHandle,
  onKeyChange,
  onDuplicate,
  onRemove,
}: Props) {
  const hours = blockHours(rect);
  const label = `${item.name}, ${formatHours(hours)}${rect.span > 1 ? ` over ${rect.span} days` : ''}`;

  // Arrow keys move the block by a slot/day; Shift+arrows resize its bottom/right edge.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onRemove();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      onDuplicate();
      return;
    }
    const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!dx && !dy) return;
    e.preventDefault();
    if (e.shiftKey) {
      onKeyChange({
        ...block,
        span: clamp(block.span + dx, 1, DAYS - block.day),
        length: clamp(block.length + dy, 1, TOTAL_SLOTS - block.start),
      });
    } else {
      onKeyChange({
        ...block,
        day: clamp(block.day + dx, 0, DAYS - block.span),
        start: clamp(block.start + dy, 0, TOTAL_SLOTS - block.length),
      });
    }
  };

  return (
    <div
      className={['tb-block', `tb-block--color-${item.color}`, dragging ? 'tb-block--dragging' : ''].filter(Boolean).join(' ')}
      style={rectStyle(rect)}
      role="group"
      tabIndex={0}
      aria-label={label}
      title={`${item.name} · ${slotTime(rect.start)}–${slotTime(rect.start + rect.length)}`}
      onPointerDown={onPointerDownBody}
      onKeyDown={handleKeyDown}
    >
      <div className="tb-block__content">
        <span className="tb-block__name">{item.name}</span>
        <span className="tb-block__hours">
          {formatHours(hours)}
          {rect.span > 1 && ` · ${rect.span} days`}
        </span>
      </div>
      <div className="tb-block__actions" onPointerDown={(e) => e.stopPropagation()}>
        <ButtonIcon
          type="transparent"
          size="sm"
          aria-label={`Duplicate ${item.name}`}
          icon={<Icon name="content_copy" />}
          onClick={onDuplicate}
        />
        <ButtonIcon
          type="transparent"
          size="sm"
          aria-label={`Remove ${item.name}`}
          icon={<Icon name="close" />}
          onClick={onRemove}
        />
      </div>
      {HANDLES.map((h) => (
        <div
          key={h.id}
          className={`tb-block__handle tb-block__handle--${h.id}`}
          onPointerDown={(e) => {
            e.stopPropagation();
            onPointerDownHandle(h.edges, e);
          }}
        />
      ))}
    </div>
  );
}
