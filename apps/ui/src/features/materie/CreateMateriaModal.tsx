import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { createMateria } from './materie.api';
import type { Docente } from '../docenti/docenti.api';
import type { CorsoLaurea } from '../corsi-laurea/corsi-laurea.api';
import MateriaForm, {
  EMPTY_MATERIA_FORM,
  validateMateriaForm,
  buildMateriaPayload,
  type MateriaFormValues,
} from './MateriaForm';
import s from '../layouts/admin.module.css';

interface Props {
  docenti: Docente[];
  corsiLaurea: CorsoLaurea[];
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateMateriaModal({ docenti, corsiLaurea, onClose, onSaved }: Props) {
  const [form, setForm] = useState<MateriaFormValues>(EMPTY_MATERIA_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateMateriaForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createMateria(buildMateriaPayload(form));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nuova materia" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        <MateriaForm value={form} onChange={setForm} docenti={docenti} corsiLaurea={corsiLaurea} />
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
