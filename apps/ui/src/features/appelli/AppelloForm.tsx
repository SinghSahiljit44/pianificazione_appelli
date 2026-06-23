import type { Dispatch, SetStateAction } from 'react';
import DateInput from '../../components/DateInput';
import type { Appello, CreateAppelloDto } from './appelli.api';
import type { Materia } from '../materie/materie.api';
import type { Sessione } from '../sessioni/sessioni.api';
import s from '../layouts/admin.module.css';

export interface AppelloFormValues {
  data: string;
  ora: string;
  aula: string;
  note: string;
  materiaId: string;
  sessioneId: string;
}

const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT');
const fmtOra = (o: string) => o.slice(0, 5);
const toInput = (d: string) => d?.split('T')[0] ?? '';

export const EMPTY_APPELLO_FORM: AppelloFormValues = {
  data: '', ora: '', aula: '', note: '', materiaId: '', sessioneId: '',
};

export function toAppelloForm(a: Appello): AppelloFormValues {
  return {
    data: toInput(a.data),
    ora: fmtOra(a.ora),
    aula: a.aula,
    note: a.note ?? '',
    materiaId: String(a.materia.id),
    sessioneId: String(a.sessione.id),
  };
}

export function buildAppelloPayload(form: AppelloFormValues, sessioneId: number): CreateAppelloDto {
  return {
    data: form.data,
    ora: `${form.ora}:00`,
    aula: form.aula,
    materiaId: Number(form.materiaId),
    sessioneId,
    ...(form.note ? { note: form.note } : {}),
  };
}

interface Props {
  value: AppelloFormValues;
  onChange: Dispatch<SetStateAction<AppelloFormValues>>;
  mode: 'create' | 'edit';
  materie: Materia[];
  sessioniAttive: Sessione[];
  sessioneForm: Sessione | null;
}

export default function AppelloForm({ value, onChange, mode, materie, sessioniAttive, sessioneForm }: Props) {
  const setField = (key: keyof AppelloFormValues, v: string) =>
    onChange((f) => ({ ...f, [key]: v }));

  return (
    <>
      <div className={s.field}>
        <label className={s.label}>Sessione</label>
        {mode === 'create' && sessioniAttive.length > 1 ? (
          <select
            className={s.select}
            value={value.sessioneId}
            onChange={(e) => setField('sessioneId', e.target.value)}
            required
          >
            <option value="">— Seleziona sessione —</option>
            {sessioniAttive.map((ss) => (
              <option key={ss.id} value={ss.id}>
                {ss.nome} (esami: {fmt(ss.dataInizio)} → {fmt(ss.dataFine)})
              </option>
            ))}
          </select>
        ) : (
          <input
            className={s.input}
            value={sessioneForm?.nome ?? ''}
            readOnly
            style={{ opacity: 0.6, cursor: 'default' }}
          />
        )}
      </div>

      <div className={s.field}>
        <label className={s.label}>Materia</label>
        <select
          className={s.select}
          value={value.materiaId}
          onChange={(e) => setField('materiaId', e.target.value)}
          required
        >
          <option value="">— Seleziona materia —</option>
          {materie.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome} ({m.cfu} CFU)
            </option>
          ))}
        </select>
      </div>

      <div className={s.fieldRow}>
        <div className={s.field}>
          <label className={s.label}>Data</label>
          <DateInput
            className={s.input}
            value={value.data}
            min={sessioneForm ? toInput(sessioneForm.dataInizio) : undefined}
            max={sessioneForm ? toInput(sessioneForm.dataFine) : undefined}
            onChange={(v) => setField('data', v)}
            disabled={!sessioneForm}
            required
          />
        </div>
        <div className={s.field}>
          <label className={s.label}>Ora</label>
          <input
            type="time"
            className={s.input}
            value={value.ora}
            onChange={(e) => setField('ora', e.target.value)}
            required
          />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>Aula</label>
        <input
          className={s.input}
          placeholder="es. Aula Magna"
          value={value.aula}
          onChange={(e) => setField('aula', e.target.value)}
          required
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>Note (opzionale)</label>
        <textarea
          className={s.textarea}
          placeholder="Informazioni aggiuntive per gli studenti..."
          value={value.note}
          onChange={(e) => setField('note', e.target.value)}
        />
      </div>

      {sessioneForm && (
        <p className={s.hint}>
          La data deve essere un giorno feriale nel range della sessione (
          {fmt(sessioneForm.dataInizio)} → {fmt(sessioneForm.dataFine)}).
          Max 2 appelli per materia per sessione.
        </p>
      )}
    </>
  );
}
