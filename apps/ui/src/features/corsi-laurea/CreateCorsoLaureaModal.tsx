import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { createCorsoLaurea } from './corsi-laurea.api';
import CorsoLaureaForm, {
  EMPTY_CORSO_FORM,
  buildCorsoPayload,
  type CorsoFormValues,
} from './CorsoLaureaForm';
import s from '../layouts/admin.module.css';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateCorsoLaureaModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState<CorsoFormValues>(EMPTY_CORSO_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createCorsoLaurea(buildCorsoPayload(form));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nuovo corso di laurea" onClose={onClose}>
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
