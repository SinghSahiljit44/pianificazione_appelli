import { useEffect, useMemo, useState } from 'react';
import { getAllAppelli } from './appelli.api';
import type { AppelloListItem as Appello } from '@server/appello';
import Select from '../../components/Select';
import s from '../layouts/admin.module.css';

const fmt = (d: Date) => d.toLocaleDateString('it-IT');
const fmtOra = (o: string) => o.slice(0, 5);

type Option = { value: string; label: string };

function dedup(options: Option[]): Option[] {
  const seen = new Map<string, Option>();
  for (const o of options) if (!seen.has(o.value)) seen.set(o.value, o);
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label, 'it'));
}

export default function AppelliAdminPage() {
  const [appelli, setAppelli] = useState<Appello[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [docenteId, setDocenteId] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [sessioneId, setSessioneId] = useState('');
  const [corsoId, setCorsoId] = useState('');

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

  const docentiOpts = useMemo(
    () =>
      dedup(
        appelli
          .filter((a) => a.docente)
          .map((a) => ({
            value: String(a.docente.id),
            label: a.docente.user?.name ?? '—',
          }))
      ),
    [appelli]
  );

  const materieOpts = useMemo(
    () => dedup(appelli.map((a) => ({ value: String(a.materia.id), label: a.materia.nome }))),
    [appelli]
  );

  const sessioniOpts = useMemo(
    () => dedup(appelli.map((a) => ({ value: String(a.sessione.id), label: a.sessione.nome }))),
    [appelli]
  );

  const corsiOpts = useMemo(
    () =>
      dedup(
        appelli.flatMap((a) =>
          (a.materia.corsi ?? []).map((mc) => ({
            value: String(mc.corso.id),
            label: mc.corso.nome,
          }))
        )
      ),
    [appelli]
  );

  const q = query.trim().toLowerCase();
  const hasFilters = !!(q || docenteId || materiaId || sessioneId || corsoId);

  const filtered = useMemo(() => {
    return [...appelli]
      .sort((a, b) => a.data.getTime() - b.data.getTime())
      .filter((a) => {
        if (docenteId && String(a.docente?.id) !== docenteId) return false;
        if (materiaId && String(a.materia.id) !== materiaId) return false;
        if (sessioneId && String(a.sessione.id) !== sessioneId) return false;
        if (corsoId && !(a.materia.corsi ?? []).some((mc) => String(mc.corso.id) === corsoId))
          return false;
        if (q) {
          const haystack = [
            a.materia.nome,
            a.docente?.user?.name,
            a.sessione.nome,
            a.aula,
            a.note,
            ...(a.materia.corsi ?? []).map((mc) => mc.corso.nome),
          ];
          if (!haystack.some((v) => v?.toLowerCase().includes(q))) return false;
        }
        return true;
      });
  }, [appelli, q, docenteId, materiaId, sessioneId, corsoId]);

  const resetFiltri = () => {
    setQuery('');
    setDocenteId('');
    setMateriaId('');
    setSessioneId('');
    setCorsoId('');
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Appelli</h1>
          <p className={s.pageSubtitle}>Elenco di tutti gli appelli pianificati dai docenti</p>
        </div>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      {!loading && appelli.length > 0 && (
        <>
          <div className={s.searchBar}>
            <input
              type="search"
              className={s.searchInput}
              placeholder="Cerca per materia, docente, sessione, aula, corso..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className={s.filters}>
            <div className={s.filterField}>
              <Select
                className={s.select}
                value={docenteId}
                onChange={setDocenteId}
                placeholder="Tutti i docenti"
                options={docentiOpts}
                aria-label="Filtra per docente"
              />
            </div>
            <div className={s.filterField}>
              <Select
                className={s.select}
                value={materiaId}
                onChange={setMateriaId}
                placeholder="Tutte le materie"
                options={materieOpts}
                aria-label="Filtra per materia"
              />
            </div>
            <div className={s.filterField}>
              <Select
                className={s.select}
                value={sessioneId}
                onChange={setSessioneId}
                placeholder="Tutte le sessioni"
                options={sessioniOpts}
                aria-label="Filtra per sessione"
              />
            </div>
            <div className={s.filterField}>
              <Select
                className={s.select}
                value={corsoId}
                onChange={setCorsoId}
                placeholder="Tutti i corsi di laurea"
                options={corsiOpts}
                aria-label="Filtra per corso di laurea"
              />
            </div>
            {hasFilters && (
              <button className={s.btnSecondary} onClick={resetFiltri}>
                Azzera filtri
              </button>
            )}
          </div>
        </>
      )}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : appelli.length === 0 ? (
          <div className={s.empty}>Nessun appello registrato.</div>
        ) : filtered.length === 0 ? (
          <div className={s.empty}>Nessun appello corrisponde ai filtri.</div>
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
              {filtered.map((a) => (
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