import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🎓</span>
            <span className={styles.logoText}>UniSingh</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>
              Accedi
            </button>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Benvenuto nel portale degli appelli</h1>
        <p className={styles.heroSub}>
          Gestione e pianificazione degli esami universitari
        </p>
      </section>

      <main className={styles.sections}>
        <section id="ateneo" className={styles.card} onClick={() => navigate('/ateneo')}>
          <div className={styles.cardIcon}>🏛️</div>
          <h2 className={styles.cardTitle}>Ateneo</h2>
          <p className={styles.cardDesc}>
            Scopri la storia, la missione e i valori del nostro ateneo.
          </p>
          <span className={styles.cardLink}>Scopri di più →</span>
        </section>

        <section id="didattica" className={`${styles.card} ${styles.cardDisabled}`}>
          <div className={styles.cardIcon}>📚</div>
          <h2 className={styles.cardTitle}>Didattica</h2>
          <p className={styles.cardDesc}>
            Consulta l'offerta formativa e i corsi di laurea disponibili.
          </p>
          <span className={styles.cardLink}>Prossimamente</span>
        </section>

      </main>

      <footer className={styles.footer}>
        <p>© 2026 UniSingh — Pianificazione appelli universitari</p>
      </footer>
    </div>
  );
}
