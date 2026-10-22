import React from 'react';
import './StatusCopy.css';

/** Figma "Type" — which semantic message color to use. */
export type StatusCopyType = 'error' | 'success' | 'information' | 'warning';

export interface StatusCopyProps {
  type?: StatusCopyType;
  children: React.ReactNode;
  className?: string;
}

export const StatusCopy: React.FC<StatusCopyProps> = ({ type = 'error', children, className = '' }) => {
  const classes = ['pa-status-copy', `pa-status-copy--type-${type}`, className].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};

StatusCopy.displayName = 'StatusCopy';

export default StatusCopy;
