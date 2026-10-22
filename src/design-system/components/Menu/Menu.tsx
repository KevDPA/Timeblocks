import React from 'react';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';
import './Menu.css';

export interface MenuItemData {
  value: string;
  label: string;
  subtext?: string;
  icon?: string;
  disabled?: boolean;
}

/** Figma "Type" — subtle: tinted selected/hover state, filled: solid selected state. */
export type MenuType = 'subtle' | 'filled';

/** Figma "Modifier" — default: plain rows (optionally single-selectable via `selected`), checkbox: multi-select, radio: single-select with a visible control. */
export type MenuModifier = 'default' | 'checkbox' | 'radio';

/** Figma "Corner" — square: full border per row (rows stack as one continuous list), rounded: 4px radius, no border (a standalone floating menu). */
export type MenuCorner = 'square' | 'rounded';

export interface MenuProps {
  items: MenuItemData[];
  type?: MenuType;
  modifier?: MenuModifier;
  corner?: MenuCorner;
  /** Modifier=default (single-select) or radio: the selected value. Modifier=checkbox: use `selectedValues` instead. */
  value?: string;
  /** Modifier=checkbox only. */
  selectedValues?: string[];
  onChange?: (value: string) => void;
  onToggle?: (value: string, checked: boolean) => void;
  className?: string;
  'aria-label'?: string;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  type = 'subtle',
  modifier = 'default',
  corner = 'square',
  value,
  selectedValues = [],
  onChange,
  onToggle,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const classes = ['pa-menu', `pa-menu--corner-${corner}`, className].filter(Boolean).join(' ');
  const role = modifier === 'checkbox' ? undefined : 'listbox';

  return (
    <ul className={classes} role={role} aria-label={ariaLabel}>
      {items.map((item) => {
        const isChecked = modifier === 'checkbox' ? selectedValues.includes(item.value) : item.value === value;
        const itemClasses = [
          'pa-menu__item',
          `pa-menu__item--type-${type}`,
          isChecked ? 'pa-menu__item--selected' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const handleClick = () => {
          if (item.disabled) return;
          if (modifier === 'checkbox') onToggle?.(item.value, !isChecked);
          else onChange?.(item.value);
        };

        return (
          <li
            key={item.value}
            role={modifier === 'checkbox' ? 'option' : 'option'}
            aria-selected={isChecked}
            aria-disabled={item.disabled}
            className={itemClasses}
            onClick={handleClick}
          >
            {modifier === 'checkbox' && (
              <Checkbox checked={isChecked} disabled={item.disabled} aria-label={item.label} readOnly />
            )}
            {modifier === 'radio' && (
              <Radio checked={isChecked} disabled={item.disabled} aria-label={item.label} readOnly />
            )}
            {modifier === 'default' && item.icon && <Icon name={item.icon} className="pa-menu__icon" size="20px" />}
            <span className="pa-menu__text">
              <span className="pa-menu__label">{item.label}</span>
              {item.subtext && <span className="pa-menu__subtext">{item.subtext}</span>}
            </span>
            {modifier === 'default' && isChecked && <Icon name="check" className="pa-menu__check" size="24px" />}
          </li>
        );
      })}
    </ul>
  );
};

Menu.displayName = 'Menu';

export default Menu;
