/**
 * Shared variant vocabulary for "action" controls (Button, ButtonIcon).
 * Names match Figma's own variant property names exactly: Type, State
 * (semantic), Status (interaction), Size.
 */

export type ActionType = 'default' | 'subtle' | 'outline' | 'transparent';

/** Figma "State" — semantic meaning. */
export type ActionState =
  | 'default'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'information';

/** Figma "Status" — interaction state. */
export type ActionStatus = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled';

/** Button and ButtonIcon share the same height scale (sm=28 / md=36 / lg=44px),
 * confirmed live against Figma — Button Icon does NOT have a separate xs tier. */
export type ActionSize = 'sm' | 'md' | 'lg';
