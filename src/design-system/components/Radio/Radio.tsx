import React, { forwardRef } from 'react';
import './Radio.css';

/** Figma "State" — validation/semantic meaning. Same naming as Checkbox. */
export type RadioState = 'default' | 'error';

/**
 * Figma "Status" — interaction state. Per Figma's own component
 * description: "managed by interaction state... do not set manually."
 * Kept as an optional prop purely for forcing a presentation in
 * Storybook/docs — real interaction drives it via the native input's own
 * :hover/:focus-visible/:disabled, same dual mechanism as Checkbox/Switch.
 */
export type RadioStatus = 'default' | 'hover' | 'focus' | 'disabled';

export type RadioSize = 'lg' | 'md';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked' | 'onChange'> {
  /** Drives Figma's "Type" axis (selected/unselected) — exposed as a plain boolean, matching Checkbox's `checked`. */
  checked?: boolean;
  state?: RadioState;
  status?: RadioStatus;
  size?: RadioSize;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  /**
   * This is the bare control — Figma's own description: "Radio button
   * control (no label)... for standalone radio with label, use Radio
   * Button instead" (that molecule is Tier 2, not yet built). Since
   * there's no visible label here, an accessible name is required.
   */
  'aria-label': string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked = false,
      state = 'default',
      status,
      size = 'lg',
      disabled = false,
      onChange,
      className = '',
      ...inputProps
    },
    ref
  ) => {
    const resolvedStatus = disabled ? 'disabled' : status;
    const type = checked ? 'selected' : 'unselected';

    const classes = [
      'pa-radio',
      `pa-radio--type-${type}`,
      `pa-radio--state-${state}`,
      `pa-radio--size-${size}`,
      resolvedStatus ? `pa-radio--status-${resolvedStatus}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span className={classes}>
        <input
          ref={ref}
          type="radio"
          className="pa-radio__input"
          checked={checked}
          disabled={disabled}
          aria-invalid={state === 'error'}
          onChange={(e) => onChange?.(e.target.checked, e)}
          {...inputProps}
        />
        <span className="pa-radio__circle" aria-hidden="true">
          {type === 'selected' && <span className="pa-radio__dot" />}
        </span>
      </span>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
