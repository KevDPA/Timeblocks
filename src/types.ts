/** Something time can be logged against: an assigned/added project, or a non-project activity. */
export interface Item {
  id: string;
  name: string;
  kind: 'project' | 'other';
  /** Project code, shown as secondary text in search results. */
  code?: string;
  /** Index into the block colour palette (see TimeBlock.css). */
  color: number;
}

/**
 * A rectangle on the week grid. `day` is 0 (Mon) – 4 (Fri); `start`/`length`
 * are in half-hour slots from the top of the day. A block can span several
 * days (`span`), covering the same slots on each.
 */
export interface Rect {
  day: number;
  span: number;
  start: number;
  length: number;
}

export interface Block extends Rect {
  id: string;
  itemId: string;
  /** ISO date (YYYY-MM-DD) of the Monday of the week this block belongs to. */
  week: string;
}
