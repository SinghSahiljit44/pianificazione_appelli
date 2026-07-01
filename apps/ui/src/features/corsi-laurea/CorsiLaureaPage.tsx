import { useEffect, useState } from 'react';
import { getCorsiLaurea } from './corsi-laurea.api';
import type { CorsoLaureaListItem as CorsoDiLaurea } from '@server/corso-di-laurea';
import CreateCorsoLaureaModal from './CreateCorsoLaureaModal';
import UpdateCorsoLaureaModal from './UpdateCorsoLaureaModal';
import DeleteCorsoLaureaModal from './DeleteCorsoLaureaModal';
import s from '../layouts/admin.module.css';

type Action =
  | { type: 'create' }
  | { type: 'edit'; corso: CorsoDiLaurea }
  | { type: 'delete'; corso: CorsoDiLaurea }
  | null;

export default function CorsiLaureaPage() {
  const [corsi, setCorsi] = useState<CorsoDiLaurea[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [action, setAction] = useState<Action>(null);

  async function load() {
    try {
      setPageError(null);
      const data = await getCorsiLaurea();
      setCorsi(data);
    } catch {
      setPageError('Impossibile caricare i corsi di laurea.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const close = () => setAction(null);
  const handleSaved = async () => {
    setAction(null);
    await load();
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Corsi di Laurea</h1>
          <p className={s.pageSubtitle}>Gestisci i corsi di laurea dell'ateneo</p>
        </div>
        <button className={s.btnPrimary} onClick={() => setAction({ type: 'create' })}>
          + Nuovo corso
        </button>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : corsi.length === 0 ? (
          <div className={s.empty}>Nessun corso di laurea presente.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrizione</th>
                <th>Durata</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {corsi.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td style={{ color: c.descrizione ? undefined : '#4a7c5f' }}>
                    {c.descrizione ?? '—'}
                  </td>
                  <td>{c.durataAnni} anni</td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.btnSecondary} onClick={() => setAction({ type: 'edit', corso: c })}>
                        Modifica
                      </button>
                      <button className={s.btnDanger} onClick={() => setAction({ type: 'delete', corso: c })}>
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {action?.type === 'create' && (
        <CreateCorsoLaureaModal onClose={close} onSaved={handleSaved} />
      )}
      {action?.type === 'edit' && (
        <UpdateCorsoLaureaModal corso={action.corso} onClose={close} onSaved={handleSaved} />
      )}
      {action?.type === 'delete' && (
        <DeleteCorsoLaureaModal corso={action.corso} onClose={close} onSaved={handleSaved} />
      )}
    </div>
  );
}
