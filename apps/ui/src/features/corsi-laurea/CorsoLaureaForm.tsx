import type { Dispatch, SetStateAction } from 'react';
import type { CorsoLaurea, CreateCorsoLaureaDto } from './corsi-laurea.api';
import s from '../layouts/admin.module.css';

export interface CorsoFormValues {
  nome: string;
  descrizione: string;
  durataAnni: string;
}

export const EMPTY_CORSO_FORM: CorsoFormValues = { nome: '', descrizione: '', durataAnni: '3' };

export function toCorsoForm(c: CorsoLaurea): CorsoFormValues {
  return {
    nome: c.nome,
    descrizione: c.descrizione ?? '',
    durataAnni: String(c.durataAnni),
  };
}

export function buildCorsoPayload(form: CorsoFormValues): CreateCorsoLaureaDto {
  return {
    nome: form.nome,
    durataAnni: Number(form.durataAnni),
    ...(form.descrizione ? { descrizione: form.descrizione } : {}),
  };
}

interface Props {
  value: CorsoFormValues;
  onChange: Dispatch<SetStateAction<CorsoFormValues>>;
}

export default function CorsoLaureaForm({ value, onChange }: Props) {
  const setField = (key: keyof CorsoFormValues, v: string) =>
    onChange((f) => ({ ...f, [key]: v }));

  return (
    <>
      <div className={s.field}>
        <label className={s.label}>Nome corso</label>
        <input
          className={s.input}
          placeholder="es. Ingegneria Informatica"
          value={value.nome}
          onChange={(e) => setField('nome', e.target.value)}
          required
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Descrizione</label>
        <textarea
          className={s.textarea}
          placeholder="Descrizione del corso (opzionale)"
          value={value.descrizione}
          onChange={(e) => setField('descrizione', e.target.value)}
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Durata (anni)</label>
        <select
          className={s.select}
          value={value.durataAnni}
          onChange={(e) => setField('durataAnni', e.target.value)}
        >
          <option value="3">3 anni (Triennale)</option>
          <option value="2">2 anni (Magistrale)</option>
          <option value="5">5 anni (Ciclo unico)</option>
        </select>
      </div>
    </>
  );
}
