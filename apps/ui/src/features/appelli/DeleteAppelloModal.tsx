import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { deleteAppello, type Appello } from './appelli.api';
import s from '../layouts/admin.module.css';

const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT');

interface Props {
  appello: Appello;
  onClose: () => void;
  onSaved: () => void;
}

export default function DeleteAppelloModal({ appello, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteAppello(appello.id);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossibile eliminare l'appello."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Elimina appello" onClose={onClose}>
      <div className={s.form}>
        <p>
          Eliminare l'appello di <strong>{appello.materia.nome}</strong> del{' '}
          <strong>{fmt(appello.data)}</strong>? L'azione è irreversibile.
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
