import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { createDocente, type CreateDocenteDto } from './docenti.api';
import DocenteForm, { EMPTY_DOCENTE_FORM } from './DocenteForm';
import s from '../layouts/admin.module.css';

const EMPTY_FORM: CreateDocenteDto = {
  name: '', email: '', password: '', ...EMPTY_DOCENTE_FORM,
};

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateDocenteModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateDocenteDto>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (key: keyof CreateDocenteDto, v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createDocente(form);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nuovo docente" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.fieldRow}>
          <div className={s.field}>
            <label className={s.label}>Nome completo</label>
            <input
              className={s.input}
              placeholder="es. Mario Rossi"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Email</label>
            <input
              type="email"
              className={s.input}
              placeholder="docente@universita.it"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Password</label>
          <input
            type="password"
            className={s.input}
            placeholder="Password iniziale"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            required
          />
          <p className={s.hint}>Min. 8 caratteri, una maiuscola, un simbolo tra ? ^ ! # @</p>
        </div>

        <DocenteForm value={form} onChange={setForm} />

        {error && <div className={s.formError}>{error}</div>}

        <div className={s.formActions}>
          <button type="button" className={s.btnSecondary} onClick={onClose}>Annulla</button>
          <button type="submit" className={s.btnPrimary} disabled={saving}>
            {saving ? 'Salvataggio...' : 'Crea docente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
