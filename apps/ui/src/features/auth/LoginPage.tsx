import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './auth.api';
import { authStore } from '../../store/authStore';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { access_token, user } = await login(email, password);
      authStore.save(access_token, user);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/docente');
      }
    } catch {
      setError('Credenziali non valide. Riprova.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <div className={styles.logo}>🎓</div>
        <h1 className={styles.title}>Accedi</h1>
        <p className={styles.subtitle}>Inserisci le tue credenziali universitarie</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="email@domani.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <button className={styles.backLink} onClick={() => navigate('/')}>
          ← Torna alla home
        </button>
      </main>
    </div>
  );
}
