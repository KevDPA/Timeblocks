import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { Label, type LabelType } from '../Label';
import './Dropdown.css';

export interface DropdownOption {
  value: string;
  primaryText: string;
  secondaryText?: string;
  /** Material Icons name shown at the start of the row. */
  icon?: string;
}

/** Figma "Type" — default: read-only trigger, searchable: trigger is a real typeable filter input. */
export type DropdownType = 'default' | 'searchable';

export interface DropdownProps {
  type?: DropdownType;
  label?: string;
  labelType?: LabelType;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  type = 'default',
  label,
  labelType = 'none',
  placeholder = 'Make a selection',
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  const visibleOptions = useMemo(() => {
    if (type !== 'searchable' || !query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) => o.primaryText.toLowerCase().includes(q) || o.secondaryText?.toLowerCase().includes(q)
    );
  }, [type, query, options]);

  const handleSelect = (option: DropdownOption) => {
    onChange?.(option.value);
    setOpen(false);
    setQuery('');
  };

  const classes = ['pa-dropdown', open ? 'pa-dropdown--open' : '', disabled ? 'pa-dropdown--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={rootRef}>
      {label && (
        <Label id={labelId} type={labelType}>
          {label}
        </Label>
      )}
      <div className="pa-dropdown__field" aria-labelledby={label ? labelId : undefined}>
        <button
          type="button"
          className="pa-dropdown__trigger"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${labelId}-listbox`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={selected ? 'pa-dropdown__value' : 'pa-dropdown__placeholder'}>
            {selected?.primaryText ?? placeholder}
          </span>
        </button>
        <Icon name={open ? 'expand_less' : 'expand_more'} className="pa-dropdown__chevron" size="24px" />
      </div>
      {open && (
        <div className="pa-dropdown__panel">
          {type === 'searchable' && (
            <div className="pa-dropdown__search">
              <Icon name="search" className="pa-dropdown__search-icon" size="20px" />
              <input
                className="pa-dropdown__search-input"
                autoFocus
                value={query}
                placeholder="Search"
                disabled={disabled}
                onChange={(e) => setQuery(e.target.value)}
                role="combobox"
                aria-expanded={open}
                aria-controls={`${labelId}-listbox`}
              />
              {query && (
                <button
                  type="button"
                  className="pa-dropdown__search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <Icon name="close" size="20px" />
                </button>
              )}
            </div>
          )}
          <ul className="pa-dropdown__menu" id={`${labelId}-listbox`} role="listbox">
            {visibleOptions.length === 0 ? (
              <li className="pa-dropdown__empty">No results found</li>
            ) : (
              visibleOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={['pa-dropdown__item', isSelected ? 'pa-dropdown__item--selected' : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSelect(option)}
                  >
                    {option.icon && <Icon name={option.icon} className="pa-dropdown__item-icon" size="20px" />}
                    <span className="pa-dropdown__item-text">
                      <span className="pa-dropdown__item-primary">{option.primaryText}</span>
                      {option.secondaryText && (
                        <span className="pa-dropdown__item-secondary">{option.secondaryText}</span>
                      )}
                    </span>
                    {isSelected && <Icon name="check" className="pa-dropdown__item-check" size="24px" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
