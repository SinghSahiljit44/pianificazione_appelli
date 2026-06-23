import { useEffect, useState } from 'react';
import { getMieiAppelli, type Appello } from './appelli.api';
import { getDocenteMe, type Docente } from '../docenti/docenti.api';
import { getMaterieByDocente, type Materia } from '../materie/materie.api';
import { getSessioniAttivePerInserimento, type Sessione } from '../sessioni/sessioni.api';
import CreateAppelloModal from './CreateAppelloModal';
import UpdateAppelloModal from './UpdateAppelloModal';
import DeleteAppelloModal from './DeleteAppelloModal';
import s from '../layouts/admin.module.css';
import ls from './AppelliPage.module.css';

const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT');
const fmtOra = (o: string) => o.slice(0, 5);

type Action =
  | { type: 'create' }
  | { type: 'edit'; appello: Appello }
  | { type: 'delete'; appello: Appello }
  | null;

export default function AppelliPage() {
  const [appelli, setAppelli] = useState<Appello[]>([]);
  const [docente, setDocente] = useState<Docente | null>(null);
  const [materie, setMaterie] = useState<Materia[]>([]);
  const [sessioniAttive, setSessioniAttive] = useState<Sessione[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [action, setAction] = useState<Action>(null);

  async function load() {
    try {
      setPageError(null);
      const [me, sessioni, miei] = await Promise.all([
        getDocenteMe(),
        getSessioniAttivePerInserimento(),
        getMieiAppelli(),
      ]);
      setDocente(me);
      setSessioniAttive(sessioni);
      setAppelli(miei);

      const mat = await getMaterieByDocente(me.id);
      setMaterie(mat);
    } catch {
      setPageError('Impossibile caricare i dati. Riprova.');
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

  const inserimentoAperto = sessioniAttive.length > 0;
  const haMaterie = materie.length > 0;
  const canCreate = inserimentoAperto && haMaterie;

  const sorted = [...appelli].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>I miei appelli</h1>
          <p className={s.pageSubtitle}>
            {docente ? `${docente.titolo} — ${docente.dipartimento}` : ''}
          </p>
        </div>
        <button
          className={s.btnPrimary}
          onClick={() => setAction({ type: 'create' })}
          disabled={!canCreate}
          title={
            !inserimentoAperto
              ? "Nessuna sessione aperta per l'inserimento"
              : !haMaterie
              ? 'Nessuna materia assegnata'
              : undefined
          }
        >
          + Nuovo appello
        </button>
      </div>

      <div className={inserimentoAperto ? ls.bannerOpen : ls.bannerClosed}>
        {inserimentoAperto ? (
          <>
            <span>
              {sessioniAttive.length === 1 ? (
                <>
                  Inserimento aperto — <strong>{sessioniAttive[0].nome}</strong>
                  {' '}(esami: {fmt(sessioniAttive[0].dataInizio)} → {fmt(sessioniAttive[0].dataFine)})
                </>
              ) : (
                <>
                  Inserimento aperto — <strong>{sessioniAttive.length} sessioni</strong>
                  {' '}disponibili (scegli la sessione quando crei l'appello)
                </>
              )}
            </span>
          </>
        ) : (
          <>
            <span>Nessuna sessione aperta per l'inserimento al momento.</span>
          </>
        )}
      </div>

      {!haMaterie && !loading && (
        <div className={ls.infoBox}>
          Nessuna materia assegnata al tuo profilo. Contatta l'amministrazione.
        </div>
      )}

      {pageError && <div className={s.pageError}>{pageError}</div>}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : sorted.length === 0 ? (
          <div className={s.empty}>Nessun appello registrato.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Materia</th>
                <th>Sessione</th>
                <th>Data</th>
                <th>Ora</th>
                <th>Aula</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr key={a.id}>
                  <td>{a.materia.nome}</td>
                  <td>{a.sessione.nome}</td>
                  <td>{fmt(a.data)}</td>
                  <td>{fmtOra(a.ora)}</td>
                  <td>{a.aula}</td>
                  <td style={{ color: a.note ? undefined : '#4a7c5f' }}>{a.note ?? '—'}</td>
                  <td>
                    <div className={s.actions}>
                      <button
                        className={s.btnSecondary}
                        onClick={() => setAction({ type: 'edit', appello: a })}
                        disabled={!inserimentoAperto}
                        title={!inserimentoAperto ? 'Inserimento non aperto' : undefined}
                      >
                        Modifica
                      </button>
                      <button
                        className={s.btnDanger}
                        onClick={() => setAction({ type: 'delete', appello: a })}
                        disabled={!inserimentoAperto}
                        title={!inserimentoAperto ? 'Inserimento non aperto' : undefined}
                      >
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
        <CreateAppelloModal
          sessioniAttive={sessioniAttive}
          materie={materie}
          onClose={close}
          onSaved={handleSaved}
        />
      )}
      {action?.type === 'edit' && (
        <UpdateAppelloModal
          appello={action.appello}
          materie={materie}
          onClose={close}
          onSaved={handleSaved}
        />
      )}
      {action?.type === 'delete' && (
        <DeleteAppelloModal appello={action.appello} onClose={close} onSaved={handleSaved} />
      )}
    </div>
  );
}
