import React from 'react';
import type { ActionType, ActionState, ActionStatus, ActionSize } from '../shared/action-types';
import './Button.css';

export interface ButtonProps {
  children?: React.ReactNode;
  /** Convenience alternative to `children` — mirrors Figma's "Label" instance prop. */
  label?: string;
  /** Figma "Type". */
  type?: ActionType;
  /** Figma "State" — semantic meaning (default/secondary/error/success/warning/information). */
  state?: ActionState;
  /** Figma "Status" — interaction state. Presentation only; real hover/press/focus
   * come from the browser. Ignored while `disabled` is true. */
  status?: ActionStatus;
  size?: ActionSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  label,
  type = 'default',
  state = 'default',
  status = 'default',
  size = 'lg',
  iconLeft,
  iconRight,
  disabled = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const content = children ?? label;

  if (import.meta.env.DEV && !content) {
    // eslint-disable-next-line no-console
    console.warn('Button: rendered with no children and no label. Did you mean to use <ButtonIcon>?');
  }

  const resolvedStatus = disabled ? 'disabled' : status;

  const classes = [
    'pa-action',
    'pa-button',
    `pa-action--type-${type}`,
    `pa-action--state-${state}`,
    `pa-action--status-${resolvedStatus}`,
    `pa-button--size-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel}
    >
      {iconLeft && (
        <span className="pa-button__icon pa-button__icon--left" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {content && <span className="pa-button__label">{content}</span>}
      {iconRight && (
        <span className="pa-button__icon pa-button__icon--right" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
};

export default Button;
