# Timeblocks

Weekly time tracker. Grab a project chip, drop it on the week, and stretch it to the time you spent.

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # grid logic (vitest)
npm run lint
npm run build
```

## How it works

- **Tray** (top): the projects you're assigned to. Drag a chip onto the grid to create a 1h block.
- **Search** adds any project from the catalogue to the tray; the **Non project items** dropdown adds
  annual leave, sick leave, proposition development, networking, contribution to my op unit and learning.
- **Blocks** snap to half-hours and whole days. Drag the body to move, any edge or corner to resize (a block
  can span several days — hours count once per day), the copy button (or Ctrl/Cmd+D) to duplicate, the
  close button (or Delete) to remove. Blocks can't overlap; Esc cancels a drag.
  Keyboard: focus a block, arrows move it, Shift+arrows resize it.
- Week navigation in the header. Data is saved to `localStorage` for now (`timeblocks:v1`).
- The pink **Overtime** band is drawn but has no behaviour yet — to be designed.

## Layout

- `src/lib/grid.ts` — grid constants, overlap/free-space logic (tested); `src/lib/useGridDrag.ts` — pointer drag engine.
- `src/components/` — `TimeGrid`, `TimeBlock`, `Tray`, `ProjectSearch`.
- `src/design-system/` — a **vendored copy** of the tokens and the components used (Button, ButtonIcon, Dropdown,
  Field, Menu, Icon, …) from `KevDPA/PADesignSystem`. Components only read Mapped tokens; re-copy from the source
  repo to update. Icons are fetched from a CDN at runtime by the design system's `Icon`.

Source sketch: Figma "testfor-claude", node 17:1093.
