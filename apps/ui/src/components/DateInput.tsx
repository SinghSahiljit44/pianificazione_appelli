import { useRef } from 'react';
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

/** Converte `yyyy-mm-dd` -> `gg/mm/aaaa` per la visualizzazione. */
const toItaliano = (value: string) => {
  if (!value) return '';
  const [anno, mese, giorno] = value.split('-');
  if (!anno || !mese || !giorno) return '';
  return `${giorno}/${mese}/${anno}`;
};

/**
 * Date input nativo (calendario, min/max, validazione) ma con la data
 * mostrata sempre in formato italiano `gg/mm/aaaa`, indipendentemente dalla
 * lingua del browser. Il valore resta `yyyy-mm-dd`.
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
