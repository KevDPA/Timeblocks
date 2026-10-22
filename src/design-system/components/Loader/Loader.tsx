import React from 'react';
import './Loader.css';

/** Figma "Type" — visual style. Kept as Figma spells it, including the space in "quarter circle". */
export type LoaderType = 'circle' | 'quarter circle' | 'spinner';

/** Figma "State" — colour intent, not an interaction state (this component has none). */
export type LoaderState = 'default' | 'inverse';

/** Figma "Size" — xl: full-page/section, lg: card/panel, md: inline/component, sm: button/compact. */
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoaderProps {
  type?: LoaderType;
  state?: LoaderState;
  size?: LoaderSize;
  className?: string;
  /** Announced by assistive tech via role="status" — defaults to "Loading". */
  'aria-label'?: string;
}

const DOT_POSITIONS = [
  { left: '50%', top: '6.25%' },
  { left: '81.25%', top: '25%' },
  { left: '93.75%', top: '50%' },
  { left: '81.25%', top: '75%' },
  { left: '50%', top: '93.75%' },
  { left: '18.75%', top: '75%' },
  { left: '6.25%', top: '50%' },
  { left: '18.75%', top: '25%' },
];

// SVG ring geometry: viewBox 0 0 100 100, r=45, strokeWidth=10 — matches Figma's
// confirmed innerRadius=0.9 (ring thickness = 10% of radius) for both circle/quarter-circle.
const RING_RADIUS = 45;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
// Figma-confirmed arc sweep: circle = 315° visible (45° gap), quarter circle = 90° visible.
const RING_SWEEP: Record<'circle' | 'quarter circle', number> = {
  circle: 315,
  'quarter circle': 90,
};

export const Loader: React.FC<LoaderProps> = ({
  type = 'circle',
  state = 'default',
  size = 'sm',
  className = '',
  'aria-label': ariaLabel = 'Loading',
}) => {
  const typeClass = type === 'quarter circle' ? 'quarter-circle' : type;
  const classes = [
    'pa-loader',
    `pa-loader--type-${typeClass}`,
    `pa-loader--state-${state}`,
    `pa-loader--size-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} role="status" aria-label={ariaLabel}>
      {(type === 'circle' || type === 'quarter circle') && (
        <svg className="pa-loader__ring" viewBox="0 0 100 100">
          <circle
            className="pa-loader__ring-path"
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="10"
            strokeDasharray={`${(RING_CIRCUMFERENCE * RING_SWEEP[type]) / 360} ${RING_CIRCUMFERENCE}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
      {type === 'spinner' && (
        <span className="pa-loader__dots">
          {DOT_POSITIONS.map((pos, i) => (
            <span key={i} className="pa-loader__dot" style={{ left: pos.left, top: pos.top }} />
          ))}
        </span>
      )}
    </span>
  );
};

Loader.displayName = 'Loader';

export default Loader;
