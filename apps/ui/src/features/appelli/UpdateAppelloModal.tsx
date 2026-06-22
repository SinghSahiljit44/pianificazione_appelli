import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { updateAppello, type Appello } from './appelli.api';
import type { Materia } from '../materie/materie.api';
import AppelloForm, {
  toAppelloForm,
  buildAppelloPayload,
  type AppelloFormValues,
} from './AppelloForm';
import s from '../layouts/admin.module.css';

interface Props {
  appello: Appello;
  materie: Materia[];
  onClose: () => void;
  onSaved: () => void;
}

export default function UpdateAppelloModal({ appello, materie, onClose, onSaved }: Props) {
  // In modifica la sessione resta quella dell'appello.
  const [form, setForm] = useState<AppelloFormValues>(() => toAppelloForm(appello));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateAppello(appello.id, buildAppelloPayload(form, appello.sessione.id));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Modifica appello" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <AppelloForm
          value={form}
          onChange={setForm}
          mode="edit"
          materie={materie}
          sessioniAttive={[]}
          sessioneForm={appello.sessione}
        />
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
