import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { updateSessione } from './sessioni.api';
import type { SessioneListItem as Sessione } from '@server/sessione';

import SessioneForm, {
  toSessioneForm,
  buildSessionePayload,
  type SessioneFormValues,
} from './SessioneForm';
import s from '../layouts/admin.module.css';

interface Props {
  sessione: Sessione;
  onClose: () => void;
  onSaved: () => void;
}

export default function UpdateSessioneModal({ sessione, onClose, onSaved }: Props) {
  const [form, setForm] = useState<SessioneFormValues>(() => toSessioneForm(sessione));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateSessione(sessione.id, buildSessionePayload(form));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Modifica sessione" onClose={onClose}>
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
