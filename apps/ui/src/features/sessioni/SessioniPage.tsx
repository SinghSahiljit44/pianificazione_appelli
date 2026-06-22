import { useEffect, useState } from 'react';
import {
  getSessioni,
  createSessione,
  updateSessione,
  deleteSessione,
  type Sessione,
  type CreateSessioneDto,
  type UpdateSessioneDto,
} from './sessioni.api';
import Modal from '../../components/Modal';
import DateInput from '../../components/DateInput';
import s from '../layouts/admin.module.css';

type SessioneForm = {
  nome: string;
  dataInizio: string;
  dataFine: string;
  dataInizioInserimento: string;
  dataFineInserimento: string;
};

const fmt = (d: string) => new Date(d).toLocaleDateString('it-IT');
const toInput = (d: string) => d?.split('T')[0] ?? '';

function getStatoBadge(sessione: Sessione) {
  const oggi = new Date().toISOString().split('T')[0];
  const { dataInizio, dataFine, dataInizioInserimento, dataFineInserimento } = sessione;
  if (oggi < dataInizioInserimento.split('T')[0]) return { label: 'Futura', cls: s.badgeGray };
  if (oggi <= dataFineInserimento.split('T')[0]) return { label: 'Inserimento aperto', cls: s.badgeGreen };
  if (oggi < dataInizio.split('T')[0]) return { label: 'In attesa', cls: s.badgeBlue };
  if (oggi <= dataFine.split('T')[0]) return { label: 'In corso', cls: s.badgeYellow };
  return { label: 'Conclusa', cls: s.badgeGray };
}

const EMPTY_FORM: SessioneForm = {
  nome: '',
  dataInizio: '',
  dataFine: '',
  dataInizioInserimento: '',
  dataFineInserimento: '',
};

export default function SessioniPage() {
  const [sessioni, setSessioni] = useState<Sessione[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Sessione | null>(null);
  const [form, setForm] = useState<SessioneForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditing(null);
    setModal('create');
  }

  function openEdit(sessione: Sessione) {
    setForm({
      nome: sessione.nome,
      dataInizio: toInput(sessione.dataInizio),
      dataFine: toInput(sessione.dataFine),
      dataInizioInserimento: toInput(sessione.dataInizioInserimento),
      dataFineInserimento: toInput(sessione.dataFineInserimento),
    });
    setFormError(null);
    setEditing(sessione);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  function setField(key: keyof SessioneForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      if (modal === 'edit' && editing) {
        await updateSessione(editing.id, form as unknown as UpdateSessioneDto);
      } else {
        await createSessione(form as unknown as CreateSessioneDto);
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

  async function handleDelete(id: number, nome: string) {
    if (!window.confirm(`Eliminare la sessione "${nome}"?`)) return;
    try {
      await deleteSessione(id);
      await load();
    } catch {
      setPageError('Impossibile eliminare la sessione.');
    }
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Sessioni</h1>
          <p className={s.pageSubtitle}>Gestisci i periodi di esame e i loro intervalli di inserimento</p>
        </div>
        <button className={s.btnPrimary} onClick={openCreate}>+ Nuova sessione</button>
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
                        <button className={s.btnSecondary} onClick={() => openEdit(sessione)}>
                          Modifica
                        </button>
                        <button className={s.btnDanger} onClick={() => handleDelete(sessione.id, sessione.nome)}>
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

      {modal && (
        <Modal
          title={modal === 'create' ? 'Nuova sessione' : 'Modifica sessione'}
          onClose={closeModal}
        >
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label}>Nome sessione</label>
              <input
                className={s.input}
                placeholder="es. Sessione Estiva 2025"
                value={form.nome}
                onChange={(e) => setField('nome', e.target.value)}
                required
              />
            </div>

            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Inizio inserimento</label>
                <DateInput
                  className={s.input}
                  value={form.dataInizioInserimento}
                  onChange={(v) => setField('dataInizioInserimento', v)}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Fine inserimento</label>
                <DateInput
                  className={s.input}
                  value={form.dataFineInserimento}
                  onChange={(v) => setField('dataFineInserimento', v)}
                  required
                />
              </div>
            </div>

            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Inizio esami</label>
                <DateInput
                  className={s.input}
                  value={form.dataInizio}
                  onChange={(v) => setField('dataInizio', v)}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Fine esami</label>
                <DateInput
                  className={s.input}
                  value={form.dataFine}
                  onChange={(v) => setField('dataFine', v)}
                  required
                />
              </div>
            </div>

            <p className={s.hint}>
              La fine inserimento deve precedere l'inizio degli esami.
            </p>

            {formError && <div className={s.formError}>{formError}</div>}

            <div className={s.formActions}>
              <button type="button" className={s.btnSecondary} onClick={closeModal}>
                Annulla
              </button>
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
