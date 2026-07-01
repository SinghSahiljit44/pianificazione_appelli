import { useState } from 'react';
import Modal from '../../components/Modal';
import { getApiErrorMessage } from '../../api/apiError';
import { deleteSessione } from './sessioni.api';
import type { SessioneListItem as Sessione } from '@server/sessione';
import s from '../layouts/admin.module.css';

interface Props {
  sessione: Sessione;
  onClose: () => void;
  onSaved: () => void;
}

export default function DeleteSessioneModal({ sessione, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteSessione(sessione.id);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Impossibile eliminare la sessione.'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Elimina sessione" onClose={onClose}>
      <div className={s.form}>
        <p>
          Eliminare la sessione <strong>{sessione.nome}</strong>? Verranno eliminati anche gli
          appelli collegati. L'azione è irreversibile.
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
