import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { deleteCorsoLaurea } from './corsi-laurea.api';
import type { CorsoLaureaListItem as CorsoDiLaurea } from '@server/corso-di-laurea';
import s from '../layouts/admin.module.css';

interface Props {
  corso: CorsoDiLaurea;
  onClose: () => void;
  onSaved: () => void;
}

export default function DeleteCorsoLaureaModal({ corso, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteCorsoLaurea(corso.id);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile eliminare il corso di laurea.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Elimina corso di laurea" onClose={onClose}>
      <div className={s.form}>
        <p>
          Eliminare il corso <strong>{corso.nome}</strong>? L'azione è irreversibile.
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
