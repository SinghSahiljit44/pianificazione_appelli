import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { it } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import s from './DateInput.module.css';

type DateInputProps = {
  /** Valore nel formato ISO `yyyy-mm-dd` (lo stesso del form/DTO). */
  value: string;
  onChange: (value: string) => void;
  /** Classe della pagina (tipicamente la `.input` del CSS module). */
  className?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** `yyyy-mm-dd` -> `Date` locale (niente shift di fuso). */
const isoToDate = (iso: string): Date | undefined => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return undefined;
  const [, y, mo, d] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? undefined : date;
};

/** `Date` -> `yyyy-mm-dd` locale. */
const dateToIso = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** `yyyy-mm-dd` -> `gg/mm/aaaa`. */
const isoToItaliano = (iso: string): string => {
  const date = isoToDate(iso);
  return date ? `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}` : '';
};

/** `gg/mm/aaaa` -> `yyyy-mm-dd`, o `''` se non è una data valida. */
const italianoToIso = (text: string): string => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!m) return '';
  const [, d, mo, y] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(mo) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return '';
  }
  return dateToIso(date);
};

const POPOVER_HEIGHT = 360;

/**
 * Date input in formato italiano `gg/mm/aaaa` su tutti i browser: campo di
 * testo modificabile a mano + calendario `react-day-picker` in popover.
 * Il valore esposto resta sempre `yyyy-mm-dd`.
 *
 * Il popover è renderizzato in un portal con posizione `fixed`, così non viene
 * ritagliato da contenitori con `overflow` (es. il modale scrollabile).
 */
export default function DateInput({
  value,
  onChange,
  className,
  min,
  max,
  required,
  disabled,
  id,
}: DateInputProps) {
  const [text, setText] = useState(() => isoToItaliano(value));
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Riallinea il testo quando il valore cambia dall'esterno.
  useEffect(() => {
    setText(isoToItaliano(value));
  }, [value]);

  // Posiziona il popover sotto al campo, ribaltandolo sopra se manca spazio.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const spaceBelow = window.innerHeight - r.bottom;
      const above = spaceBelow < POPOVER_HEIGHT && r.top > spaceBelow;
      setPos({
        top: above ? r.top - POPOVER_HEIGHT - 6 : r.bottom + 6,
        left: r.left,
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

  // Chiusura del popover su click esterno o Esc.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !popoverRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const minDate = min ? isoToDate(min) : undefined;
  const maxDate = max ? isoToDate(max) : undefined;
  const selected = isoToDate(value);

  const inRange = (date: Date) =>
    (!minDate || date >= minDate) && (!maxDate || date <= maxDate);

  const handleType = (raw: string) => {
    setText(raw);
    const iso = italianoToIso(raw);
    if (raw.trim() === '') onChange('');
    else if (iso && inRange(isoToDate(iso)!)) onChange(iso);
  };

  // Al blur ricanonicalizza: tiene il valore valido, scarta il testo incompleto.
  const handleBlur = () => setText(isoToItaliano(value));

  const handleSelect = (date: Date | undefined) => {
    if (date) onChange(dateToIso(date));
    setOpen(false);
  };

  return (
    <div className={s.wrap} ref={wrapRef}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={`${className ?? ''} ${s.field}`}
        placeholder="gg/mm/aaaa"
        value={text}
        required={required}
        disabled={disabled}
        onChange={(e) => handleType(e.target.value)}
        onBlur={handleBlur}
        onFocus={() => setOpen(true)}
      />
      <button
        type="button"
        className={s.iconBtn}
        aria-label="Apri calendario"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && !disabled &&
        createPortal(
          <div
            ref={popoverRef}
            className={s.popover}
            style={{ top: pos.top, left: pos.left }}
          >
            <DayPicker
              className={s.calendar}
              mode="single"
              locale={it}
              captionLayout="dropdown"
              selected={selected}
              defaultMonth={selected ?? minDate}
              startMonth={minDate}
              endMonth={maxDate}
              disabled={
                [
                  minDate ? { before: minDate } : undefined,
                  maxDate ? { after: maxDate } : undefined,
                ].filter(Boolean) as { before: Date }[]
              }
              onSelect={handleSelect}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
