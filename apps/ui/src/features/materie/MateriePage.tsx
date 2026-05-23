import { useEffect, useState } from 'react';
import {
  getMaterie,
  createMateria,
  updateMateria,
  deleteMateria,
  type Materia,
} from './materie.api';
import { getDocenti, type Docente } from '../docenti/docenti.api';
import { getCorsiLaurea, type CorsoLaurea } from '../corsi-laurea/corsi-laurea.api';
import Modal from '../../components/Modal';
import s from '../layouts/admin.module.css';
import ls from './MateriePage.module.css';

interface CorsoRow {
  corsoId: string;
  anno: string;
}

interface MateriaForm {
  nome: string;
  cfu: string;
  docenteId: string;
  corsi: CorsoRow[];
}

const EMPTY_FORM: MateriaForm = { nome: '', cfu: '', docenteId: '', corsi: [] };

function annoOptions(corsoId: string, corsiLaurea: CorsoLaurea[]) {
  const corso = corsiLaurea.find((c) => String(c.id) === corsoId);
  const max = corso?.durataAnni ?? 5;
  return Array.from({ length: max }, (_, i) => i + 1);
}

export default function MateriePage() {
  const [materie, setMaterie] = useState<Materia[]>([]);
  const [docenti, setDocenti] = useState<Docente[]>([]);
  const [corsiLaurea, setCorsiLaurea] = useState<CorsoLaurea[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Materia | null>(null);
  const [form, setForm] = useState<MateriaForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditing(null);
    setModal('create');
  }

  function openEdit(m: Materia) {
    setForm({
      nome: m.nome,
      cfu: String(m.cfu),
      docenteId: m.docente ? String(m.docente.id) : '',
      corsi: (m.corsi ?? []).map((mc) => ({
        corsoId: String(mc.corso.id),
        anno: String(mc.anno),
      })),
    });
    setFormError(null);
    setEditing(m);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  function setField<K extends keyof MateriaForm>(key: K, value: MateriaForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addCorsoRow() {
    setForm((f) => ({ ...f, corsi: [...f.corsi, { corsoId: '', anno: '1' }] }));
  }

  function removeCorsoRow(i: number) {
    setForm((f) => ({ ...f, corsi: f.corsi.filter((_, idx) => idx !== i) }));
  }

  function updateCorsoRow(i: number, field: keyof CorsoRow, value: string) {
    setForm((f) => {
      const corsi = [...f.corsi];
      corsi[i] = { ...corsi[i], [field]: value };
      if (field === 'corsoId') corsi[i].anno = '1';
      return { ...f, corsi };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    for (const row of form.corsi) {
      if (!row.corsoId) {
        setFormError('Seleziona un corso di laurea per ogni riga, oppure rimuovila.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        nome: form.nome,
        cfu: Number(form.cfu),
        ...(form.docenteId ? { docenteId: Number(form.docenteId) } : {}),
        corsi: form.corsi.map((r) => ({ corsoId: Number(r.corsoId), anno: Number(r.anno) })),
      };

      if (modal === 'edit' && editing) {
        await updateMateria(editing.id, payload);
      } else {
        await createMateria(payload);
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
    if (!window.confirm(`Eliminare la materia "${nome}"?`)) return;
    try {
      await deleteMateria(id);
      await load();
    } catch {
      setPageError('Impossibile eliminare la materia.');
    }
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Materie</h1>
          <p className={s.pageSubtitle}>Gestisci gli insegnamenti, assegnali ai docenti e ai corsi di laurea</p>
        </div>
        <button className={s.btnPrimary} onClick={openCreate}>+ Nuova materia</button>
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
                      <button className={s.btnSecondary} onClick={() => openEdit(m)}>
                        Modifica
                      </button>
                      <button className={s.btnDanger} onClick={() => handleDelete(m.id, m.nome)}>
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

      {modal && (
        <Modal
          title={modal === 'create' ? 'Nuova materia' : 'Modifica materia'}
          onClose={closeModal}
        >
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label}>Nome materia</label>
              <input
                className={s.input}
                placeholder="es. Analisi Matematica I"
                value={form.nome}
                onChange={(e) => setField('nome', e.target.value)}
                required
              />
            </div>

            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>CFU</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className={s.input}
                  placeholder="es. 6"
                  value={form.cfu}
                  onChange={(e) => setField('cfu', e.target.value)}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Docente</label>
                <select
                  className={s.select}
                  value={form.docenteId}
                  onChange={(e) => setField('docenteId', e.target.value)}
                >
                  <option value="">— Nessuno —</option>
                  {docenti.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label}>Corsi di laurea</label>
              {form.corsi.length > 0 && (
                <div className={ls.corsoRows}>
                  {form.corsi.map((row, i) => {
                    const opts = annoOptions(row.corsoId, corsiLaurea);
                    return (
                      <div key={i} className={ls.corsoRow}>
                        <select
                          className={s.select}
                          value={row.corsoId}
                          onChange={(e) => updateCorsoRow(i, 'corsoId', e.target.value)}
                        >
                          <option value="">— Seleziona corso —</option>
                          {corsiLaurea.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                          ))}
                        </select>
                        <select
                          className={`${s.select} ${ls.annoSelect}`}
                          value={row.anno}
                          onChange={(e) => updateCorsoRow(i, 'anno', e.target.value)}
                          disabled={!row.corsoId}
                        >
                          {opts.map((a) => (
                            <option key={a} value={a}>Anno {a}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className={ls.removeRowBtn}
                          onClick={() => removeCorsoRow(i)}
                          aria-label="Rimuovi"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                className={ls.addRowBtn}
                onClick={addCorsoRow}
                disabled={corsiLaurea.length === 0}
              >
                + Aggiungi corso di laurea
              </button>
              {corsiLaurea.length === 0 && (
                <p className={s.hint}>Nessun corso di laurea disponibile. Creane uno prima.</p>
              )}
            </div>

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
