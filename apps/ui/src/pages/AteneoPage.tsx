import { useNavigate } from 'react-router-dom';
import styles from './AteneoPage.module.css';

export default function AteneoPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← Torna alla home
        </button>
        <span className={styles.logoText}>🎓 UniScheduler</span>
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Il nostro Ateneo</h1>

        <section className={styles.section}>
          <h2>Chi siamo</h2>
          <p>
            L'Università UniScheduler è un ateneo pubblico fondato nel 1985 con
            l'obiettivo di formare professionisti in grado di affrontare le sfide
            del mondo contemporaneo. Con oltre 20.000 studenti iscritti e più di
            500 docenti, rappresenta uno dei poli accademici di riferimento del territorio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Missione</h2>
          <p>
            La nostra missione è promuovere la crescita culturale, scientifica e
            professionale degli studenti attraverso una didattica di qualità,
            la ricerca applicata e il dialogo con il tessuto economico e sociale locale.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Valori</h2>
          <ul className={styles.list}>
            <li>Eccellenza nella ricerca e nella didattica</li>
            <li>Inclusività e pari opportunità</li>
            <li>Innovazione e apertura internazionale</li>
            <li>Responsabilità sociale e sostenibilità</li>
          </ul>
        </section>

        <section className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>20.000+</span>
            <span className={styles.statLabel}>Studenti</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>500+</span>
            <span className={styles.statLabel}>Docenti</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>40+</span>
            <span className={styles.statLabel}>Corsi di laurea</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>1985</span>
            <span className={styles.statLabel}>Anno di fondazione</span>
          </div>
        </section>
      </main>
    </div>
  );
}
