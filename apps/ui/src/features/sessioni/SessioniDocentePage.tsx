import { useEffect, useState } from 'react';
import { getSessioni, type Sessione } from './sessioni.api';
import { getAppelliBySessione, type Appello } from '../appelli/appelli.api';
import s from '../layouts/admin.module.css';
import ls from './SessioniDocentePage.module.css';

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

export default function SessioniDocentePage() {
  const [sessioni, setSessioni] = useState<Sessione[]>([]);
  const [appelli, setAppelli] = useState<Record<number, Appello[]>>({});
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const sess = await getSessioni();
        sess.sort((a, b) => b.dataInizio.getTime() - a.dataInizio.getTime());
        setSessioni(sess);

        const results = await Promise.all(
          sess.map((s) => getAppelliBySessione(s.id))
        );
        const map: Record<number, Appello[]> = {};
        sess.forEach((sessione, i) => {
          map[sessione.id] = results[i].sort((a, b) => a.data.getTime() - b.data.getTime());
        });
        setAppelli(map);
      } catch {
        setPageError('Impossibile caricare i dati.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Sessioni</h1>
          <p className={s.pageSubtitle}>Tutti gli appelli organizzati per sessione d'esame</p>
        </div>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      {loading ? (
        <div className={s.loading}>Caricamento...</div>
      ) : sessioni.length === 0 ? (
        <div className={s.empty}>Nessuna sessione presente.</div>
      ) : (
        <div className={ls.sessioniList}>
          {sessioni.map((sessione) => {
            const badge = getStatoBadge(sessione);
            const lista = appelli[sessione.id] ?? [];
            return (
              <div key={sessione.id} className={ls.sessioneCard}>
                <div className={ls.sessioneHeader}>
                  <div className={ls.sessioneInfo}>
                    <h2 className={ls.sessioneNome}>{sessione.nome}</h2>
                    <div className={ls.sessioneDate}>
                      <span>Sessione: {fmt(sessione.dataInizio)} – {fmt(sessione.dataFine)}</span>
                      <span className={ls.separator}>·</span>
                      <span>Inserimento: {fmt(sessione.dataInizioInserimento)} – {fmt(sessione.dataFineInserimento)}</span>
                    </div>
                  </div>
                  <span className={`${s.badge} ${badge.cls}`}>{badge.label}</span>
                </div>

                {lista.length === 0 ? (
                  <p className={ls.noAppelli}>Nessun appello inserito in questa sessione.</p>
                ) : (
                  <table className={ls.table}>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Ora</th>
                        <th>Materia</th>
                        <th>Docente</th>
                        <th>Aula</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lista.map((a) => (
                        <tr key={a.id}>
                          <td>{fmt(a.data)}</td>
                          <td>{a.ora.slice(0, 5)}</td>
                          <td>
                            <div>{a.materia.nome}</div>
                            {(a.materia.corsi ?? []).length > 0 && (
                              <div className={ls.corsiChips}>
                                {(a.materia.corsi ?? []).map((mc) => (
                                  <span key={mc.id} className={ls.chip}>
                                    {mc.corso.nome} — Anno {mc.anno}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>{a.docente?.user?.name ?? '—'}</td>
                          <td>{a.aula}</td>
                          <td style={{ color: a.note ? undefined : '#4a7c5f' }}>
                            {a.note ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}