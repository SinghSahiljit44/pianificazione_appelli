import type { Dispatch, SetStateAction } from 'react';
import DateInput from '../../components/DateInput';
import type { CreateSessioneDto, SessioneListItem as Sessione } from '@server/sessione';
import s from '../layouts/admin.module.css';

export interface SessioneFormValues {
  nome: string;
  dataInizio: string;
  dataFine: string;
  dataInizioInserimento: string;
  dataFineInserimento: string;
}

const toInputDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EMPTY_SESSIONE_FORM: SessioneFormValues = {
  nome: '',
  dataInizio: '',
  dataFine: '',
  dataInizioInserimento: '',
  dataFineInserimento: '',
};

export function toSessioneForm(sessione: Sessione): SessioneFormValues {
  return {
    nome: sessione.nome,
    dataInizio: toInputDate(sessione.dataInizio),
    dataFine: toInputDate(sessione.dataFine),
    dataInizioInserimento: toInputDate(sessione.dataInizioInserimento),
    dataFineInserimento: toInputDate(sessione.dataFineInserimento),
  };
}

export function buildSessionePayload(form: SessioneFormValues): CreateSessioneDto {
  return {
    nome: form.nome,
    dataInizio: new Date(form.dataInizio),
    dataFine: new Date(form.dataFine),
    dataInizioInserimento: new Date(form.dataInizioInserimento),
    dataFineInserimento: new Date(form.dataFineInserimento),
  };
}

interface Props {
  value: SessioneFormValues;
  onChange: Dispatch<SetStateAction<SessioneFormValues>>;
}

export default function SessioneForm({ value, onChange }: Props) {
  const setField = (key: keyof SessioneFormValues, v: string) =>
    onChange((f) => ({ ...f, [key]: v }));

  return (
    <>
      <div className={s.field}>
        <label className={s.label}>Nome sessione</label>
        <input
          className={s.input}
          placeholder="es. Sessione Estiva 2025"
          value={value.nome}
          onChange={(e) => setField('nome', e.target.value)}
          required
        />
      </div>

      <div className={s.fieldRow}>
        <div className={s.field}>
          <label className={s.label}>Inizio inserimento</label>
          <DateInput
            className={s.input}
            value={value.dataInizioInserimento}
            onChange={(v) => setField('dataInizioInserimento', v)}
            required
          />
        </div>
        <div className={s.field}>
          <label className={s.label}>Fine inserimento</label>
          <DateInput
            className={s.input}
            value={value.dataFineInserimento}
            onChange={(v) => setField('dataFineInserimento', v)}
            required
          />
        </div>
      </div>

      <div className={s.fieldRow}>
        <div className={s.field}>
          <label className={s.label}>Inizio esami</label>
          <DateInput
            className={s.input}
            value={value.dataInizio}
            onChange={(v) => setField('dataInizio', v)}
            required
          />
        </div>
        <div className={s.field}>
          <label className={s.label}>Fine esami</label>
          <DateInput
            className={s.input}
            value={value.dataFine}
            onChange={(v) => setField('dataFine', v)}
            required
          />
        </div>
      </div>

      <p className={s.hint}>La fine inserimento deve precedere l'inizio degli esami.</p>
    </>
  );
}