import { useEffect, useState } from 'react';
import { getMieiAppelli, createAppello, updateAppello, deleteAppello, type Appello, type CreateAppelloDto } from './appelli.api';
import { getDocenteMe, type Docente } from '../docenti/docenti.api';
import { getMaterieByDocente, type Materia } from '../materie/materie.api';
import { getSessioniAttivePerInserimento, type Sessione } from '../sessioni/sessioni.api';
import Modal from '../../components/Modal';
import DateInput from '../../components/DateInput';
import s from '../layouts/admin.module.css';
import ls from './AppelliPage.module.css';

const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT');
const fmtOra = (o: string) => o.slice(0, 5);
const toInput = (d: string) => d?.split('T')[0] ?? '';

interface AppelloForm {
  data: string;
  ora: string;
  aula: string;
  note: string;
  materiaId: string;
  sessioneId: string;
}

const EMPTY_FORM: AppelloForm = { data: '', ora: '', aula: '', note: '', materiaId: '', sessioneId: '' };

export default function AppelliPage() {
  const [appelli, setAppelli] = useState<Appello[]>([]);
  const [docente, setDocente] = useState<Docente | null>(null);
  const [materie, setMaterie] = useState<Materia[]>([]);
  const [sessioniAttive, setSessioniAttive] = useState<Sessione[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Appello | null>(null);
  const [form, setForm] = useState<AppelloForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  function openCreate() {
    // Se c'è una sola sessione aperta la pre-seleziono, altrimenti la sceglie il docente
    const preset = sessioniAttive.length === 1 ? String(sessioniAttive[0].id) : '';
    setForm({ ...EMPTY_FORM, sessioneId: preset });
    setFormError(null);
    setEditing(null);
    setModal('create');
  }

  function openEdit(a: Appello) {
    setForm({
      data: toInput(a.data),
      ora: fmtOra(a.ora),
      aula: a.aula,
      note: a.note ?? '',
      materiaId: String(a.materia.id),
      sessioneId: String(a.sessione.id),
    });
    setFormError(null);
    setEditing(a);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  function setField(key: keyof AppelloForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In modifica la sessione resta quella dell'appello; in creazione è quella scelta nel form
    const sessioneId = modal === 'edit' && editing ? editing.sessione.id : Number(form.sessioneId);
    if (!sessioneId) return;
    setFormError(null);
    setSaving(true);

    const dto: CreateAppelloDto = {
      data: form.data,
      ora: `${form.ora}:00`,
      aula: form.aula,
      materiaId: Number(form.materiaId),
      sessioneId,
      ...(form.note ? { note: form.note } : {}),
    };

    try {
      if (modal === 'edit' && editing) {
        await updateAppello(editing.id, dto);
      } else {
        await createAppello(dto);
      }
      closeModal();
      await load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      setFormError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Errore durante il salvataggio.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, materia: string, data: string) {
    if (!window.confirm(`Eliminare l'appello di ${materia} del ${data}?`)) return;
    try {
      await deleteAppello(id);
      await load();
    } catch {
      setPageError("Impossibile eliminare l'appello.");
    }
  }

  const inserimentoAperto = sessioniAttive.length > 0;
  const haMaterie = materie.length > 0;
  const canCreate = inserimentoAperto && haMaterie;

  // Sessione di riferimento per il form: in modifica quella dell'appello, in creazione quella selezionata
  const sessioneForm =
    modal === 'edit' && editing
      ? editing.sessione
      : sessioniAttive.find((x) => String(x.id) === form.sessioneId) ?? null;

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
          onClick={openCreate}
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
            <span className={ls.bannerIcon}>🟢</span>
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
            <span className={ls.bannerIcon}>🔴</span>
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
                        onClick={() => openEdit(a)}
                        disabled={!inserimentoAperto}
                        title={!inserimentoAperto ? 'Inserimento non aperto' : undefined}
                      >
                        Modifica
                      </button>
                      <button
                        className={s.btnDanger}
                        onClick={() => handleDelete(a.id, a.materia.nome, fmt(a.data))}
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

      {modal && inserimentoAperto && (
        <Modal
          title={modal === 'create' ? 'Nuovo appello' : 'Modifica appello'}
          onClose={closeModal}
        >
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label}>Sessione</label>
              {modal === 'create' && sessioniAttive.length > 1 ? (
                <select
                  className={s.select}
                  value={form.sessioneId}
                  onChange={(e) => setField('sessioneId', e.target.value)}
                  required
                >
                  <option value="">— Seleziona sessione —</option>
                  {sessioniAttive.map((ss) => (
                    <option key={ss.id} value={ss.id}>
                      {ss.nome} (esami: {fmt(ss.dataInizio)} → {fmt(ss.dataFine)})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={s.input}
                  value={sessioneForm?.nome ?? ''}
                  readOnly
                  style={{ opacity: 0.6, cursor: 'default' }}
                />
              )}
            </div>

            <div className={s.field}>
              <label className={s.label}>Materia</label>
              <select
                className={s.select}
                value={form.materiaId}
                onChange={(e) => setField('materiaId', e.target.value)}
                required
              >
                <option value="">— Seleziona materia —</option>
                {materie.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} ({m.cfu} CFU)
                  </option>
                ))}
              </select>
            </div>

            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Data</label>
                <DateInput
                  className={s.input}
                  value={form.data}
                  min={sessioneForm ? toInput(sessioneForm.dataInizio) : undefined}
                  max={sessioneForm ? toInput(sessioneForm.dataFine) : undefined}
                  onChange={(v) => setField('data', v)}
                  disabled={!sessioneForm}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Ora</label>
                <input
                  type="time"
                  className={s.input}
                  value={form.ora}
                  onChange={(e) => setField('ora', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label}>Aula</label>
              <input
                className={s.input}
                placeholder="es. Aula Magna"
                value={form.aula}
                onChange={(e) => setField('aula', e.target.value)}
                required
              />
            </div>

            <div className={s.field}>
              <label className={s.label}>Note (opzionale)</label>
              <textarea
                className={s.textarea}
                placeholder="Informazioni aggiuntive per gli studenti..."
                value={form.note}
                onChange={(e) => setField('note', e.target.value)}
              />
            </div>

            {sessioneForm && (
              <p className={s.hint}>
                La data deve essere un giorno feriale nel range della sessione (
                {fmt(sessioneForm.dataInizio)} → {fmt(sessioneForm.dataFine)}).
                Max 2 appelli per materia per sessione.
              </p>
            )}

            {formError && <div className={s.formError}>{formError}</div>}

            <div className={s.formActions}>
              <button type="button" className={s.btnSecondary} onClick={closeModal}>Annulla</button>
              <button type="submit" className={s.btnPrimary} disabled={saving}>
                {saving ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
