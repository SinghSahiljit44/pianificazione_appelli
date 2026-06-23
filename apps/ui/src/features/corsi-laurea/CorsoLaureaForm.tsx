import type { Dispatch, SetStateAction } from 'react';
import Select from '../../components/Select';
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
        <Select
          className={s.select}
          value={value.durataAnni}
          onChange={(v) => setField('durataAnni', v)}
          options={[
            { value: '3', label: '3 anni (Triennale)' },
            { value: '2', label: '2 anni (Magistrale)' },
            { value: '5', label: '5 anni (Ciclo unico)' },
          ]}
        />
      </div>
    </>
  );
}
