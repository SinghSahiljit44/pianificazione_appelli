import { useEffect, useState } from 'react';
import {
  getDocenti,
  createDocente,
  updateDocente,
  deleteDocente,
  type Docente,
  type CreateDocenteDto,
  type UpdateDocenteDto,
} from '../../api/docenti';
import Modal from '../../components/Modal';
import s from './admin.module.css';

interface CreateForm {
  titolo: string;
  dipartimento: string;
  name: string;
  email: string;
  password: string;
}

interface EditForm {
  titolo: string;
  dipartimento: string;
}

const EMPTY_CREATE: CreateForm = { titolo: '', dipartimento: '', name: '', email: '', password: '' };
const EMPTY_EDIT: EditForm = { titolo: '', dipartimento: '' };

export default function DocentiPage() {
  const [docenti, setDocenti] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Docente | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_CREATE);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  function openCreate() {
    setCreateForm(EMPTY_CREATE);
    setFormError(null);
    setEditing(null);
    setModal('create');
  }

  function openEdit(d: Docente) {
    setEditForm({ titolo: d.titolo, dipartimento: d.dipartimento });
    setFormError(null);
    setEditing(d);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      if (modal === 'edit' && editing) {
        const dto: UpdateDocenteDto = editForm;
        await updateDocente(editing.id, dto);
      } else {
        const dto: CreateDocenteDto = { ...createForm, role: 'USER' };
        await createDocente(dto);
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

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Eliminare il docente "${name}"? Verrà eliminato anche il suo account.`)) return;
    try {
      await deleteDocente(id);
      await load();
    } catch {
      setPageError('Impossibile eliminare il docente.');
    }
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Docenti</h1>
          <p className={s.pageSubtitle}>Gestisci i docenti e i loro profili accademici</p>
        </div>
        <button className={s.btnPrimary} onClick={openCreate}>+ Nuovo docente</button>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : docenti.length === 0 ? (
          <div className={s.empty}>Nessun docente presente.</div>
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
              {docenti.map((d) => (
                <tr key={d.id}>
                  <td>{d.user.name}</td>
                  <td>{d.user.email}</td>
                  <td>{d.titolo}</td>
                  <td>{d.dipartimento}</td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.btnSecondary} onClick={() => openEdit(d)}>
                        Modifica
                      </button>
                      <button className={s.btnDanger} onClick={() => handleDelete(d.id, d.user.name)}>
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

      {modal === 'create' && (
        <Modal title="Nuovo docente" onClose={closeModal}>
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Nome completo</label>
                <input
                  className={s.input}
                  placeholder="es. Mario Rossi"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Email</label>
                <input
                  type="email"
                  className={s.input}
                  placeholder="docente@universita.it"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label}>Password</label>
              <input
                type="password"
                className={s.input}
                placeholder="Password iniziale"
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
              <p className={s.hint}>Min. 8 caratteri, una maiuscola, un simbolo tra ? ^ ! # @</p>
            </div>

            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Titolo</label>
                <input
                  className={s.input}
                  placeholder="es. Prof. Associato"
                  value={createForm.titolo}
                  onChange={(e) => setCreateForm((f) => ({ ...f, titolo: e.target.value }))}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Dipartimento</label>
                <input
                  className={s.input}
                  placeholder="es. DIEM"
                  value={createForm.dipartimento}
                  onChange={(e) => setCreateForm((f) => ({ ...f, dipartimento: e.target.value }))}
                  required
                />
              </div>
            </div>

            {formError && <div className={s.formError}>{formError}</div>}

            <div className={s.formActions}>
              <button type="button" className={s.btnSecondary} onClick={closeModal}>Annulla</button>
              <button type="submit" className={s.btnPrimary} disabled={saving}>
                {saving ? 'Salvataggio...' : 'Crea docente'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && editing && (
        <Modal title={`Modifica — ${editing.user.name}`} onClose={closeModal}>
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.fieldRow}>
              <div className={s.field}>
                <label className={s.label}>Titolo</label>
                <input
                  className={s.input}
                  placeholder="es. Prof. Ordinario"
                  value={editForm.titolo}
                  onChange={(e) => setEditForm((f) => ({ ...f, titolo: e.target.value }))}
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Dipartimento</label>
                <input
                  className={s.input}
                  placeholder="es. DIEM"
                  value={editForm.dipartimento}
                  onChange={(e) => setEditForm((f) => ({ ...f, dipartimento: e.target.value }))}
                  required
                />
              </div>
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
