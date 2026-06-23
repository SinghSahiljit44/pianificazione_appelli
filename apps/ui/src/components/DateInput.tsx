import { useRef } from 'react';
import s from './DateInput.module.css';

type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
};

const toItaliano = (value: string) => {
  if (!value) return '';
  const [anno, mese, giorno] = value.split('-');
  if (!anno || !mese || !giorno) return '';
  return `${giorno}/${mese}/${anno}`;
};

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
  const ref = useRef<HTMLInputElement>(null);
  const testo = toItaliano(value);

  const openPicker = () => {
    if (disabled) return;
    try {
      ref.current?.showPicker?.();
    } catch {
      /* showPicker non disponibile: si usa l'icona nativa */
    }
  };

  return (
    <div className={s.wrap}>
      <input
        ref={ref}
        id={id}
        type="date"
        className={`${className ?? ''} ${s.native}`}
        value={value}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onClick={openPicker}
      />
      <span
        className={`${s.overlay} ${testo ? '' : s.placeholder}`}
        aria-hidden="true"
      >
        {testo || 'gg/mm/aaaa'}
      </span>
    </div>
  );
}
