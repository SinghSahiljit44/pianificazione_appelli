import { useState } from 'react';
import { changePassword } from '../auth/auth.api';
import { getApiErrorMessage } from '../../api/apiError';
import s from '../layouts/admin.module.css';

const PASSWORD_HINT =
  'Min. 8 caratteri, una maiuscola, un simbolo tra ? ^ ! # @';

function validaNuovaPassword(pw: string): string | null {
  if (pw.length < 8) return 'La nuova password deve avere almeno 8 caratteri.';
  if (!/[A-Z]/.test(pw))
    return 'La nuova password deve contenere almeno una maiuscola.';
  if (!/[?^!#@]/.test(pw))
    return 'La nuova password deve contenere un simbolo tra ? ^ ! # @.';
  return null;
}

export default function ProfiloPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const ruleError = validaNuovaPassword(newPassword);
    if (ruleError) {
      setError(ruleError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('La nuova password e la conferma non coincidono.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('La nuova password deve essere diversa da quella attuale.');
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setOk(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Profilo</h1>
          <p className={s.pageSubtitle}>
            Gestisci le credenziali del tuo account
          </p>
        </div>
      </div>

      <form
        className={s.form}
        onSubmit={handleSubmit}
        style={{ maxWidth: 460 }}
      >
        <div className={s.field}>
          <label className={s.label}>Password attuale</label>
          <input
            type="password"
            className={s.input}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>Nuova password</label>
          <input
            type="password"
            className={s.input}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className={s.hint}>{PASSWORD_HINT}</p>
        </div>

        <div className={s.field}>
          <label className={s.label}>Conferma nuova password</label>
          <input
            type="password"
            className={s.input}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className={s.formError}>{error}</div>}
        {ok && (
          <div className={s.formOk}>Password aggiornata con successo.</div>
        )}

        <div className={s.formActions}>
          <button type="submit" className={s.btnPrimary} disabled={saving}>
            {saving ? 'Salvataggio...' : 'Aggiorna password'}
          </button>
        </div>
      </form>
    </div>
  );
}
