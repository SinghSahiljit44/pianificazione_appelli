import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { deleteMateria, type Materia } from './materie.api';
import s from '../layouts/admin.module.css';

interface Props {
  materia: Materia;
  onClose: () => void;
  onSaved: () => void;
}

export default function DeleteMateriaModal({ materia, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteMateria(materia.id);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile eliminare la materia.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Elimina materia" onClose={onClose}>
      <div className={s.form}>
        <p>
          Eliminare la materia <strong>{materia.nome}</strong>? L'azione è irreversibile.
        </p>
        {error && <div className={s.formError}>{error}</div>}
        <div className={s.formActions}>
          <button type="button" className={s.btnSecondary} onClick={onClose}>Annulla</button>
          <button type="button" className={s.btnDanger} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Eliminazione...' : 'Elimina'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
