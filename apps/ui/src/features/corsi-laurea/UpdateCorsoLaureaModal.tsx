import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { updateCorsoLaurea, type CorsoLaurea } from './corsi-laurea.api';
import CorsoLaureaForm, {
  toCorsoForm,
  buildCorsoPayload,
  type CorsoFormValues,
} from './CorsoLaureaForm';
import s from '../layouts/admin.module.css';

interface Props {
  corso: CorsoLaurea;
  onClose: () => void;
  onSaved: () => void;
}

export default function UpdateCorsoLaureaModal({ corso, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CorsoFormValues>(() => toCorsoForm(corso));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateCorsoLaurea(corso.id, buildCorsoPayload(form));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Modifica corso di laurea" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <CorsoLaureaForm value={form} onChange={setForm} />
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
