import React from 'react';
import './Label.css';

/** Figma "Type" — none: plain label, required: adds a warning-coloured asterisk, optional: adds an "(optional)" caption. */
export type LabelType = 'none' | 'required' | 'optional';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  type?: LabelType;
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ type = 'none', children, className = '', ...rest }) => {
  const classes = ['pa-label', className].filter(Boolean).join(' ');

  return (
    <label className={classes} {...rest}>
      {children}
      {type === 'required' && (
        <span className="pa-label__asterisk" aria-hidden="true">
          *
        </span>
      )}
      {type === 'optional' && <span className="pa-label__optional">(optional)</span>}
    </label>
  );
};

Label.displayName = 'Label';

export default Label;
