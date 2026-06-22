import { useEffect, useState } from 'react';
import { getMaterie, type Materia } from './materie.api';
import { getDocenti, type Docente } from '../docenti/docenti.api';
import { getCorsiLaurea, type CorsoLaurea } from '../corsi-laurea/corsi-laurea.api';
import CreateMateriaModal from './CreateMateriaModal';
import UpdateMateriaModal from './UpdateMateriaModal';
import DeleteMateriaModal from './DeleteMateriaModal';
import s from '../layouts/admin.module.css';
import ls from './MateriePage.module.css';

type Action =
  | { type: 'create' }
  | { type: 'edit'; materia: Materia }
  | { type: 'delete'; materia: Materia }
  | null;

export default function MateriePage() {
  const [materie, setMaterie] = useState<Materia[]>([]);
  const [docenti, setDocenti] = useState<Docente[]>([]);
  const [corsiLaurea, setCorsiLaurea] = useState<CorsoLaurea[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [action, setAction] = useState<Action>(null);

  async function load() {
    try {
      setPageError(null);
      const [m, d, c] = await Promise.all([getMaterie(), getDocenti(), getCorsiLaurea()]);
      setMaterie(m);
      setDocenti(d);
      setCorsiLaurea(c);
    } catch {
      setPageError('Impossibile caricare i dati.');
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
          <h1 className={s.pageTitle}>Materie</h1>
          <p className={s.pageSubtitle}>Gestisci gli insegnamenti, assegnali ai docenti e ai corsi di laurea</p>
        </div>
        <button className={s.btnPrimary} onClick={() => setAction({ type: 'create' })}>
          + Nuova materia
        </button>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : materie.length === 0 ? (
          <div className={s.empty}>Nessuna materia presente.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CFU</th>
                <th>Docente</th>
                <th>Corsi di laurea</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {materie.map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}</td>
                  <td>{m.cfu}</td>
                  <td style={{ color: m.docente?.user ? undefined : '#4a7c5f' }}>
                    {m.docente?.user?.name ?? '—'}
                  </td>
                  <td>
                    {(m.corsi ?? []).length === 0 ? (
                      <span style={{ color: '#4a7c5f' }}>—</span>
                    ) : (
                      <div className={ls.corsiChips}>
                        {(m.corsi ?? []).map((mc) => (
                          <span key={mc.id} className={ls.chip}>
                            {mc.corso.nome} — Anno {mc.anno}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.btnSecondary} onClick={() => setAction({ type: 'edit', materia: m })}>
                        Modifica
                      </button>
                      <button className={s.btnDanger} onClick={() => setAction({ type: 'delete', materia: m })}>
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
        <CreateMateriaModal
          docenti={docenti}
          corsiLaurea={corsiLaurea}
          onClose={close}
          onSaved={handleSaved}
        />
      )}
      {action?.type === 'edit' && (
        <UpdateMateriaModal
          materia={action.materia}
          docenti={docenti}
          corsiLaurea={corsiLaurea}
          onClose={close}
          onSaved={handleSaved}
        />
      )}
      {action?.type === 'delete' && (
        <DeleteMateriaModal materia={action.materia} onClose={close} onSaved={handleSaved} />
      )}
    </div>
  );
}
