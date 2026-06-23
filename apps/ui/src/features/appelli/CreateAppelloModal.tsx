import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { createAppello } from './appelli.api';
import type { Materia } from '../materie/materie.api';
import type { Sessione } from '../sessioni/sessioni.api';
import AppelloForm, {
  EMPTY_APPELLO_FORM,
  buildAppelloPayload,
  type AppelloFormValues,
} from './AppelloForm';
import s from '../layouts/admin.module.css';

interface Props {
  sessioniAttive: Sessione[];
  materie: Materia[];
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateAppelloModal({ sessioniAttive, materie, onClose, onSaved }: Props) {
  const [form, setForm] = useState<AppelloFormValues>(() => ({
    ...EMPTY_APPELLO_FORM,
    sessioneId: sessioniAttive.length === 1 ? String(sessioniAttive[0].id) : '',
  }));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const sessioneForm = sessioniAttive.find((x) => String(x.id) === form.sessioneId) ?? null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sessioneId = Number(form.sessioneId);
    if (!sessioneId) {
      setError('Seleziona una sessione.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createAppello(buildAppelloPayload(form, sessioneId));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nuovo appello" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <AppelloForm
          value={form}
          onChange={setForm}
          mode="create"
          materie={materie}
          sessioniAttive={sessioniAttive}
          sessioneForm={sessioneForm}
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
