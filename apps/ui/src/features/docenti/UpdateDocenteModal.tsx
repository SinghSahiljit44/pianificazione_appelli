import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { updateDocente, type Docente } from './docenti.api';
import DocenteForm, {
  toDocenteForm,
  type DocenteFormValues,
} from './DocenteForm';
import s from '../layouts/admin.module.css';

interface Props {
  docente: Docente;
  onClose: () => void;
  onSaved: () => void;
}

export default function UpdateDocenteModal({ docente, onClose, onSaved }: Props) {
  const [form, setForm] = useState<DocenteFormValues>(() => toDocenteForm(docente));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
        <DocenteForm value={form} onChange={setForm} />
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
