import { useEffect, useState } from 'react';
import { getDocenti, type Docente } from './docenti.api';
import CreateDocenteModal from './CreateDocenteModal';
import UpdateDocenteModal from './UpdateDocenteModal';
import DeleteDocenteModal from './DeleteDocenteModal';
import s from '../layouts/admin.module.css';

type Action =
  | { type: 'create' }
  | { type: 'edit'; docente: Docente }
  | { type: 'delete'; docente: Docente }
  | null;

export default function DocentiPage() {
  const [docenti, setDocenti] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [query, setQuery] = useState('');

  async function load() {
    try {
      setPageError(null);
      const data = await getDocenti();
      setDocenti(data);
    } catch {
      setPageError('Impossibile caricare i docenti.');
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

  const q = query.trim().toLowerCase();
  const docentiFiltrati = q
    ? docenti.filter((d) =>
        [d.user.name, d.user.email, d.titolo, d.dipartimento]
          .some((v) => v?.toLowerCase().includes(q))
      )
    : docenti;

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Docenti</h1>
          <p className={s.pageSubtitle}>Gestisci i docenti e i loro profili accademici</p>
        </div>
        <button className={s.btnPrimary} onClick={() => setAction({ type: 'create' })}>
          + Nuovo docente
        </button>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      {!loading && docenti.length > 0 && (
        <div className={s.searchBar}>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Cerca per nome, email, titolo o dipartimento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : docenti.length === 0 ? (
          <div className={s.empty}>Nessun docente presente.</div>
        ) : docentiFiltrati.length === 0 ? (
          <div className={s.empty}>Nessun docente corrisponde alla ricerca.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Titolo</th>
                <th>Dipartimento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docentiFiltrati.map((d) => (
                <tr key={d.id}>
                  <td>{d.user.name}</td>
                  <td>{d.user.email}</td>
                  <td>{d.titolo}</td>
                  <td>{d.dipartimento}</td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.btnSecondary} onClick={() => setAction({ type: 'edit', docente: d })}>
                        Modifica
                      </button>
                      <button className={s.btnDanger} onClick={() => setAction({ type: 'delete', docente: d })}>
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
        <CreateDocenteModal onClose={close} onSaved={handleSaved} />
      )}
      {action?.type === 'edit' && (
        <UpdateDocenteModal docente={action.docente} onClose={close} onSaved={handleSaved} />
      )}
      {action?.type === 'delete' && (
        <DeleteDocenteModal docente={action.docente} onClose={close} onSaved={handleSaved} />
      )}
    </div>
  );
}
