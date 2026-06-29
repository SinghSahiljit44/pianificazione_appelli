import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { createSessione } from './sessioni.api';
import SessioneForm, {
  EMPTY_SESSIONE_FORM,
  buildSessionePayload,
  type SessioneFormValues,
} from './SessioneForm';
import s from '../layouts/admin.module.css';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateSessioneModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState<SessioneFormValues>(EMPTY_SESSIONE_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createSessione(buildSessionePayload(form));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nuova sessione" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <SessioneForm value={form} onChange={setForm} />
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
