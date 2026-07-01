import { useEffect, useState } from 'react';
import { getSessioni } from './sessioni.api';
import type { SessioneListItem as Sessione } from '@server/sessione';
import CreateSessioneModal from './CreateSessioneModal';
import UpdateSessioneModal from './UpdateSessioneModal';
import DeleteSessioneModal from './DeleteSessioneModal';
import s from '../layouts/admin.module.css';

const fmt = (d: Date) => d.toLocaleDateString('it-IT');

function getStatoBadge(sessione: Sessione) {
  const oggi = new Date().getTime();
  const inizioEsami = sessione.dataInizio.getTime();
  const fineEsami = sessione.dataFine.getTime();
  const inizioIns = sessione.dataInizioInserimento.getTime();
  const fineIns = sessione.dataFineInserimento.getTime();

  if (oggi < inizioIns) return { label: 'Futura', cls: s.badgeGray };
  if (oggi <= fineIns) return { label: 'Inserimento aperto', cls: s.badgeGreen };
  if (oggi < inizioEsami) return { label: 'In attesa', cls: s.badgeBlue };
  if (oggi <= fineEsami) return { label: 'In corso', cls: s.badgeYellow };
  return { label: 'Conclusa', cls: s.badgeGray };
}

type Action =
  | { type: 'create' }
  | { type: 'edit'; sessione: Sessione }
  | { type: 'delete'; sessione: Sessione }
  | null;

export default function SessioniPage() {
  const [sessioni, setSessioni] = useState<Sessione[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [action, setAction] = useState<Action>(null);

  async function load() {
    try {
      setPageError(null);
      const data = await getSessioni();
      setSessioni(data);
    } catch {
      setPageError('Impossibile caricare le sessioni.');
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
          <h1 className={s.pageTitle}>Sessioni</h1>
          <p className={s.pageSubtitle}>Gestisci i periodi di esame e i loro intervalli di inserimento</p>
        </div>
        <button className={s.btnPrimary} onClick={() => setAction({ type: 'create' })}>
          + Nuova sessione
        </button>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : sessioni.length === 0 ? (
          <div className={s.empty}>Nessuna sessione presente.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Stato</th>
                <th>Inizio esami</th>
                <th>Fine esami</th>
                <th>Inserimento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessioni.map((sessione) => {
                const badge = getStatoBadge(sessione);
                return (
                  <tr key={sessione.id}>
                    <td>{sessione.nome}</td>
                    <td>
                      <span className={`${s.badge} ${badge.cls}`}>{badge.label}</span>
                    </td>
                    <td>{fmt(sessione.dataInizio)}</td>
                    <td>{fmt(sessione.dataFine)}</td>
                    <td>
                      {fmt(sessione.dataInizioInserimento)} → {fmt(sessione.dataFineInserimento)}
                    </td>
                    <td>
                      <div className={s.actions}>
                        <button className={s.btnSecondary} onClick={() => setAction({ type: 'edit', sessione })}>
                          Modifica
                        </button>
                        <button className={s.btnDanger} onClick={() => setAction({ type: 'delete', sessione })}>
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {action?.type === 'create' && (
        <CreateSessioneModal onClose={close} onSaved={handleSaved} />
      )}
      {action?.type === 'edit' && (
        <UpdateSessioneModal sessione={action.sessione} onClose={close} onSaved={handleSaved} />
      )}
      {action?.type === 'delete' && (
        <DeleteSessioneModal sessione={action.sessione} onClose={close} onSaved={handleSaved} />
      )}
    </div>
  );
}