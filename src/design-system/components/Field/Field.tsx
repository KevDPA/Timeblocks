import React, { forwardRef } from 'react';
import { Loader } from '../Loader';
import './Field.css';

/** Figma "State" — validation/semantic meaning. */
export type FieldState = 'default' | 'error';

/**
 * Figma "Status" — interaction state (empty/hover/active/filled/disabled/loader).
 * Presentational override only — real interaction is driven by the native
 * input's own pseudo-classes (:hover/:focus/:placeholder-shown/:disabled).
 * Use this to force a state for Storybook/docs, or `loading` for the one
 * status a plain `<input>` has no natural equivalent for.
 */
export type FieldStatus = 'empty' | 'hover' | 'active' | 'filled' | 'disabled' | 'loader';

export type FieldSize = 'default' | 'sm';

export interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  state?: FieldState;
  status?: FieldStatus;
  size?: FieldSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Drives Figma's "loader" Status — hides icons and the input, shows a `Loader` instead. */
  loading?: boolean;
  /**
   * Drives Figma's Type=pre-tab — an attached segment before the input,
   * divided by a border. Figma's own `.Pre_tab` sub-component is itself a
   * 96-variant dropdown-style trigger (icon + label + chevron); this slot
   * takes any content rather than reproducing that full sub-component, so
   * a plain text prefix (e.g. "www.") or a custom trigger both work.
   */
  preTab?: React.ReactNode;
  /** Drives Figma's Type=post-tab — the same attached-segment pattern as `preTab`, after the input. */
  postTab?: React.ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  (
    {
      state = 'default',
      status,
      size = 'default',
      iconLeft,
      iconRight,
      loading = false,
      preTab,
      postTab,
      disabled = false,
      className = '',
      ...inputProps
    },
    ref
  ) => {
    const resolvedStatus = disabled ? 'disabled' : loading ? 'loader' : status;

    const classes = [
      'pa-field',
      `pa-field--state-${state}`,
      `pa-field--size-${size}`,
      resolvedStatus ? `pa-field--status-${resolvedStatus}` : '',
      loading ? 'pa-field--loading' : '',
      preTab ? 'pa-field--has-pre-tab' : '',
      postTab ? 'pa-field--has-post-tab' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes}>
        {preTab && <span className="pa-field__tab pa-field__tab--pre">{preTab}</span>}
        {loading ? (
          <Loader type="quarter circle" size="sm" aria-label="Loading" />
        ) : (
          <>
            {iconLeft && (
              <span className="pa-field__icon pa-field__icon--left" aria-hidden="true">
                {iconLeft}
              </span>
            )}
            <input
              ref={ref}
              className="pa-field__input"
              disabled={disabled}
              aria-invalid={state === 'error'}
              {...inputProps}
            />
            {iconRight && (
              <span className="pa-field__icon pa-field__icon--right" aria-hidden="true">
                {iconRight}
              </span>
            )}
          </>
        )}
        {postTab && <span className="pa-field__tab pa-field__tab--post">{postTab}</span>}
      </div>
    );
  }
);

Field.displayName = 'Field';

export default Field;
