import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>UniSingh</span>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.title}>Benvenuto nel portale degli appelli</h1>
          <p className={styles.subtitle}>
            Pianificazione e gestione degli esami universitari
          </p>
        </div>

        <button className={styles.loginBtn} onClick={() => navigate('/login')}>
          Accedi al portale
        </button>
      </main>

      <footer className={styles.footer}>
        © 2026 UniSingh — Pianificazione appelli universitari
      </footer>
    </div>
  );
}
