import type { Dispatch, SetStateAction } from 'react';
import type { Docente } from './docenti.api';
import s from '../layouts/admin.module.css';

/** Campi condivisi tra creazione e modifica di un docente. */
export interface DocenteFormValues {
  titolo: string;
  dipartimento: string;
}

export const EMPTY_DOCENTE_FORM: DocenteFormValues = { titolo: '', dipartimento: '' };

export function toDocenteForm(d: Docente): DocenteFormValues {
  return { titolo: d.titolo, dipartimento: d.dipartimento };
}

/**
 * Generico su `T extends DocenteFormValues`: il modale di creazione tiene uno
 * stato più ampio (name, email, password) e questo form aggiorna solo i campi
 * condivisi preservando il resto.
 */
interface Props<T extends DocenteFormValues> {
  value: T;
  onChange: Dispatch<SetStateAction<T>>;
}

export default function DocenteForm<T extends DocenteFormValues>({ value, onChange }: Props<T>) {
  const setField = (key: keyof DocenteFormValues, v: string) =>
    onChange((f) => ({ ...f, [key]: v }));

  return (
    <div className={s.fieldRow}>
      <div className={s.field}>
        <label className={s.label}>Titolo</label>
        <input
          className={s.input}
          placeholder="es. Prof. Associato"
          value={value.titolo}
          onChange={(e) => setField('titolo', e.target.value)}
          required
        />
      </div>
      <div className={s.field}>
        <label className={s.label}>Dipartimento</label>
        <input
          className={s.input}
          placeholder="es. DIEM"
          value={value.dipartimento}
          onChange={(e) => setField('dipartimento', e.target.value)}
          required
        />
      </div>
    </div>
  );
}
