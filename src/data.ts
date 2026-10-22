import type { Item } from './types';

/** Colour indexes: 0 slate, 1 green, 2 blue, 3 amber, 4 neutral dashed (non-project items). */
/** Projects the current user is assigned to — shown in the tray from the start. */
export const ASSIGNED_PROJECTS: Item[] = [
  { id: 'p-atlas', name: 'Atlas Migration', kind: 'project', code: 'PRJ-1042', color: 2 },
  { id: 'p-beacon', name: 'Beacon Rollout', kind: 'project', code: 'PRJ-1187', color: 1 },
  { id: 'p-cobalt', name: 'Cobalt Review', kind: 'project', code: 'PRJ-0931', color: 3 },
  { id: 'p-delta', name: 'Delta Discovery', kind: 'project', code: 'PRJ-1210', color: 0 },
  { id: 'p-ember', name: 'Ember Platform', kind: 'project', code: 'PRJ-1156', color: 2 },
];

/** Every project that can be found via search and added to the tray (placeholder data). */
export const PROJECT_CATALOGUE: Item[] = [
  ...ASSIGNED_PROJECTS,
  { id: 'p-falcon', name: 'Falcon Strategy', kind: 'project', code: 'PRJ-1301', color: 1 },
  { id: 'p-granite', name: 'Granite Operating Model', kind: 'project', code: 'PRJ-1099', color: 2 },
  { id: 'p-harbor', name: 'Harbor Digital', kind: 'project', code: 'PRJ-1264', color: 3 },
  { id: 'p-iris', name: 'Iris Data Platform', kind: 'project', code: 'PRJ-1033', color: 0 },
  { id: 'p-juniper', name: 'Juniper Cost Review', kind: 'project', code: 'PRJ-1178', color: 1 },
  { id: 'p-keystone', name: 'Keystone Transformation', kind: 'project', code: 'PRJ-1322', color: 2 },
  { id: 'p-lumen', name: 'Lumen Customer Journey', kind: 'project', code: 'PRJ-1245', color: 3 },
  { id: 'p-meridian', name: 'Meridian Integration', kind: 'project', code: 'PRJ-1117', color: 0 },
];

/** Non-project activities offered in the dropdown. */
export const NON_PROJECT_ITEMS: Item[] = [
  { id: 'o-annual-leave', name: 'Annual leave', kind: 'other', color: 4 },
  { id: 'o-sick-leave', name: 'Sick leave', kind: 'other', color: 4 },
  { id: 'o-proposition', name: 'Proposition development', kind: 'other', color: 4 },
  { id: 'o-networking', name: 'Networking', kind: 'other', color: 4 },
  { id: 'o-op-unit', name: 'Contribution to my op unit', kind: 'other', color: 4 },
  { id: 'o-learning', name: 'Learning', kind: 'other', color: 4 },
];
