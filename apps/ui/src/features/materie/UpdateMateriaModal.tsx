import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { updateMateria, type Materia } from './materie.api';
import type { Docente } from '../docenti/docenti.api';
import type { CorsoLaurea } from '../corsi-laurea/corsi-laurea.api';
import MateriaForm, {
  toMateriaForm,
  validateMateriaForm,
  buildMateriaPayload,
  type MateriaFormValues,
} from './MateriaForm';
import s from '../layouts/admin.module.css';

interface Props {
  materia: Materia;
  docenti: Docente[];
  corsiLaurea: CorsoLaurea[];
  onClose: () => void;
  onSaved: () => void;
}

export default function UpdateMateriaModal({ materia, docenti, corsiLaurea, onClose, onSaved }: Props) {
  const [form, setForm] = useState<MateriaFormValues>(() => toMateriaForm(materia));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationError = validateMateriaForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateMateria(materia.id, buildMateriaPayload(form));
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Modifica materia" onClose={onClose}>
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
