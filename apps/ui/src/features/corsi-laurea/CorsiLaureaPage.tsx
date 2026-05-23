import { useEffect, useState } from 'react';
import {
  getCorsiLaurea,
  createCorsoLaurea,
  updateCorsoLaurea,
  deleteCorsoLaurea,
  type CorsoLaurea,
  type CreateCorsoLaureaDto,
} from './corsi-laurea.api';
import Modal from '../../components/Modal';
import s from '../layouts/admin.module.css';

interface CorsoForm {
  nome: string;
  descrizione: string;
  durataAnni: string;
}

const EMPTY_FORM: CorsoForm = { nome: '', descrizione: '', durataAnni: '3' };

export default function CorsiLaureaPage() {
  const [corsi, setCorsi] = useState<CorsoLaurea[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<CorsoLaurea | null>(null);
  const [form, setForm] = useState<CorsoForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setPageError(null);
      const data = await getCorsiLaurea();
      setCorsi(data);
    } catch {
      setPageError('Impossibile caricare i corsi di laurea.');
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

  function openEdit(c: CorsoLaurea) {
    setForm({
      nome: c.nome,
      descrizione: c.descrizione ?? '',
      durataAnni: String(c.durataAnni),
    });
    setFormError(null);
    setEditing(c);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  function setField(key: keyof CorsoForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const dto: CreateCorsoLaureaDto = {
        nome: form.nome,
        durataAnni: Number(form.durataAnni),
        ...(form.descrizione ? { descrizione: form.descrizione } : {}),
      };
      if (modal === 'edit' && editing) {
        await updateCorsoLaurea(editing.id, dto);
      } else {
        await createCorsoLaurea(dto);
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
    if (!window.confirm(`Eliminare il corso "${nome}"?`)) return;
    try {
      await deleteCorsoLaurea(id);
      await load();
    } catch {
      setPageError('Impossibile eliminare il corso di laurea.');
    }
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Corsi di Laurea</h1>
          <p className={s.pageSubtitle}>Gestisci i corsi di laurea dell'ateneo</p>
        </div>
        <button className={s.btnPrimary} onClick={openCreate}>+ Nuovo corso</button>
      </div>

      {pageError && <div className={s.pageError}>{pageError}</div>}

      <div className={s.tableWrap}>
        {loading ? (
          <div className={s.loading}>Caricamento...</div>
        ) : corsi.length === 0 ? (
          <div className={s.empty}>Nessun corso di laurea presente.</div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrizione</th>
                <th>Durata</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {corsi.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>
                  <td style={{ color: c.descrizione ? undefined : '#4a7c5f' }}>
                    {c.descrizione ?? '—'}
                  </td>
                  <td>{c.durataAnni} anni</td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.btnSecondary} onClick={() => openEdit(c)}>
                        Modifica
                      </button>
                      <button className={s.btnDanger} onClick={() => handleDelete(c.id, c.nome)}>
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
          title={modal === 'create' ? 'Nuovo corso di laurea' : 'Modifica corso di laurea'}
          onClose={closeModal}
        >
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label}>Nome corso</label>
              <input
                className={s.input}
                placeholder="es. Ingegneria Informatica"
                value={form.nome}
                onChange={(e) => setField('nome', e.target.value)}
                required
              />
            </div>

            <div className={s.field}>
              <label className={s.label}>Descrizione</label>
              <textarea
                className={s.textarea}
                placeholder="Descrizione del corso (opzionale)"
                value={form.descrizione}
                onChange={(e) => setField('descrizione', e.target.value)}
              />
            </div>

            <div className={s.field}>
              <label className={s.label}>Durata (anni)</label>
              <select
                className={s.select}
                value={form.durataAnni}
                onChange={(e) => setField('durataAnni', e.target.value)}
              >
                <option value="3">3 anni (Triennale)</option>
                <option value="2">2 anni (Magistrale)</option>
                <option value="5">5 anni (Ciclo unico)</option>
              </select>
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
