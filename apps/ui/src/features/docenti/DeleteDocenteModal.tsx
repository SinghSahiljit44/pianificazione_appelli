import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { deleteDocente, type Docente } from './docenti.api';
import s from '../layouts/admin.module.css';

interface Props {
  docente: Docente;
  onClose: () => void;
  onSaved: () => void;
}

export default function DeleteDocenteModal({ docente, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteDocente(docente.id);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile eliminare il docente.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Elimina docente" onClose={onClose}>
      <div className={s.form}>
        <p>
          Eliminare il docente <strong>{docente.user.name}</strong>? Verrà eliminato anche il suo
          account. L'azione è irreversibile.
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
