import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import s from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Riga vuota iniziale (value `''`), mostrata anche quando nulla è scelto. */
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-label'?: string;
};

const MAX_LIST_HEIGHT = 280;

/**
 * Select in tema scuro, coerente su tutti i browser: bottone stilizzato +
 * lista di opzioni in un portal con `position: fixed` (così non viene
 * ritagliata da contenitori con overflow, es. il modale). Navigabile da
 * tastiera. Per `required` mantiene un `<select>` nativo nascosto ma
 * focalizzabile, così la validazione HTML5 del form continua a funzionare.
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
  required,
  id,
  'aria-label': ariaLabel,
}: SelectProps) {
  const items: SelectOption[] = placeholder
    ? [{ value: '', label: placeholder }, ...options]
    : options;

  const selectedLabel =
    items.find((o) => o.value === value)?.label ?? placeholder ?? '';
  const isPlaceholder = value === '' ;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, maxHeight: MAX_LIST_HEIGHT });
  const wrapRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLUListElement>(null);

  // Posiziona la lista sotto al bottone, ribaltandola sopra se manca spazio.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const spaceBelow = window.innerHeight - r.bottom - 8;
      const spaceAbove = r.top - 8;
      const below = spaceBelow >= 160 || spaceBelow >= spaceAbove;
      const space = below ? spaceBelow : spaceAbove;
      const maxHeight = Math.min(MAX_LIST_HEIGHT, space);
      setPos({
        top: below ? r.bottom + 6 : r.top - maxHeight - 6,
        left: r.left,
        width: r.width,
        maxHeight,
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  // Chiusura su click esterno.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !popoverRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const openList = () => {
    if (disabled) return;
    const idx = items.findIndex((o) => o.value === value);
    setActive(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  const select = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
  };

  const moveActive = (delta: number) => {
    setActive((prev) => {
      let next = prev;
      for (let i = 0; i < items.length; i++) {
        next = (next + delta + items.length) % items.length;
        if (!items[next].disabled) break;
      }
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (items[active]) select(items[active]);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div className={s.wrap} ref={wrapRef}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        className={`${className ?? ''} ${s.button} ${isPlaceholder ? s.placeholder : ''}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className={s.label}>{selectedLabel}</span>
        <svg
          className={s.chevron}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {required && (
        <select
          className={s.hiddenNative}
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => undefined}
        >
          <option value="" />
          {options.map((o) => (
            <option key={o.value} value={o.value} />
          ))}
        </select>
      )}

      {open && !disabled &&
        createPortal(
          <ul
            ref={popoverRef}
            role="listbox"
            className={s.list}
            style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
          >
            {items.map((opt, i) => (
              <li
                key={`${opt.value}-${i}`}
                role="option"
                aria-selected={opt.value === value}
                className={`${s.option} ${i === active ? s.active : ''} ${
                  opt.value === value ? s.selected : ''
                } ${opt.disabled ? s.optionDisabled : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(opt);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
