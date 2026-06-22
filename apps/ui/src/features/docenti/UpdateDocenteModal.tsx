import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { updateDocente, type Docente, type UpdateDocenteDto } from './docenti.api';
import s from '../layouts/admin.module.css';

interface Props {
  docente: Docente;
  onClose: () => void;
  onSaved: () => void;
}

export default function UpdateDocenteModal({ docente, onClose, onSaved }: Props) {
  const [form, setForm] = useState<UpdateDocenteDto>(() => ({
    titolo: docente.titolo,
    dipartimento: docente.dipartimento,
  }));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setField = (key: keyof UpdateDocenteDto, v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateDocente(docente.id, form);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`Modifica — ${docente.user.name}`} onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.fieldRow}>
          <div className={s.field}>
            <label className={s.label}>Titolo</label>
            <input
              className={s.input}
              placeholder="es. Prof. Ordinario"
              value={form.titolo ?? ''}
              onChange={(e) => setField('titolo', e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Dipartimento</label>
            <input
              className={s.input}
              placeholder="es. DIEM"
              value={form.dipartimento ?? ''}
              onChange={(e) => setField('dipartimento', e.target.value)}
              required
            />
          </div>
        </div>

        {error && <div className={s.formError}>{error}</div>}

        <div className={s.formActions}>
          <button type="button" className={s.btnSecondary} onClick={onClose}>Annulla</button>
          <button type="submit" className={s.btnPrimary} disabled={saving}>
            {saving ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
