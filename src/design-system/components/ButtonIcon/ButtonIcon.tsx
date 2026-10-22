import React from 'react';
import type { ActionType, ActionState, ActionStatus, ActionSize } from '../shared/action-types';
import './ButtonIcon.css';

export interface ButtonIconProps {
  /** Required — ButtonIcon is icon-only, single slot. */
  icon: React.ReactNode;
  /** Figma "Type". */
  type?: ActionType;
  /** Figma "State" — semantic meaning. */
  state?: ActionState;
  /** Figma "Status" — interaction state (presentation only; see Button). */
  status?: ActionStatus;
  size?: ActionSize;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  /** Mandatory — this control has no visible text, screen readers need a name. */
  'aria-label': string;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  type = 'default',
  state = 'default',
  status = 'default',
  size = 'lg',
  disabled = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const resolvedStatus = disabled ? 'disabled' : status;

  const classes = [
    'pa-action',
    'pa-button-icon',
    `pa-action--type-${type}`,
    `pa-action--state-${state}`,
    `pa-action--status-${resolvedStatus}`,
    `pa-button-icon--size-${size}`,
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
      <span className="pa-button-icon__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
};

export default ButtonIcon;
