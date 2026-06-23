import { useEffect, useState } from 'react';
import { getAllAppelli, type Appello } from './appelli.api';
import s from '../layouts/admin.module.css';

const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT');
const fmtOra = (o: string) => o.slice(0, 5);

export default function AppelliAdminPage() {
  const [appelli, setAppelli] = useState<Appello[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  async function load() {
    try {
      setPageError(null);
      const all = await getAllAppelli();
      setAppelli(all);
    } catch {
      setPageError('Impossibile caricare gli appelli. Riprova.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const sorted = [...appelli].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Appelli</h1>
          <p className={s.pageSubtitle}>Elenco di tutti gli appelli pianificati dai docenti</p>
        </div>
      </div>

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
                <th>Docente</th>
                <th>Sessione</th>
                <th>Data</th>
                <th>Ora</th>
                <th>Aula</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr key={a.id}>
                  <td>{a.materia.nome}</td>
                  <td style={{ color: a.docente?.user ? undefined : '#4a7c5f' }}>
                    {a.docente?.user?.name ?? '—'}
                  </td>
                  <td>{a.sessione.nome}</td>
                  <td>{fmt(a.data)}</td>
                  <td>{fmtOra(a.ora)}</td>
                  <td>{a.aula}</td>
                  <td style={{ color: a.note ? undefined : '#4a7c5f' }}>{a.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
