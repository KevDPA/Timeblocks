import React, { forwardRef, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import './Checkbox.css';

/** Figma "State" — validation/semantic meaning. */
export type CheckboxState = 'default' | 'error';

/**
 * Figma "Status" — interaction state. Per Figma's own component
 * description: "managed by interaction state... do not set manually."
 * Kept as an optional prop purely for forcing a presentation in
 * Storybook/docs — real interaction drives it via the native input's own
 * :hover/:focus-visible/:disabled, same dual mechanism as Button/Field.
 */
export type CheckboxStatus = 'default' | 'hover' | 'focus' | 'disabled';

export type CheckboxSize = 'lg' | 'md';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked' | 'onChange'> {
  checked?: boolean;
  /** Takes priority over `checked` visually — Figma's Type=indeterminate. */
  indeterminate?: boolean;
  state?: CheckboxState;
  status?: CheckboxStatus;
  size?: CheckboxSize;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  /**
   * This is the bare control — Figma's own description: "Checkbox
   * control (no label)... for standalone checkbox with label, use
   * Checkbox Label instead" (that molecule is Tier 2, not yet built).
   * Since there's no visible label here, an accessible name is required.
   */
  'aria-label': string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      state = 'default',
      status,
      size = 'lg',
      disabled = false,
      onChange,
      className = '',
      ...inputProps
    },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const resolvedStatus = disabled ? 'disabled' : status;
    const type = indeterminate ? 'indeterminate' : checked ? 'selected' : 'unselected';

    const classes = [
      'pa-checkbox',
      `pa-checkbox--type-${type}`,
      `pa-checkbox--state-${state}`,
      `pa-checkbox--size-${size}`,
      resolvedStatus ? `pa-checkbox--status-${resolvedStatus}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span className={classes}>
        <input
          ref={(node) => {
            (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }}
          type="checkbox"
          className="pa-checkbox__input"
          checked={checked}
          disabled={disabled}
          aria-invalid={state === 'error'}
          onChange={(e) => onChange?.(e.target.checked, e)}
          {...inputProps}
        />
        <span className="pa-checkbox__box" aria-hidden="true">
          {type === 'selected' && <Icon name="check" size="100%" />}
          {type === 'indeterminate' && <Icon name="remove" size="100%" />}
        </span>
      </span>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
