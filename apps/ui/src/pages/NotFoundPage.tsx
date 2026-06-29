import { Link } from 'react-router-dom';
import { authStore } from '../store/authStore';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const homePath = authStore.isLoggedIn()
    ? authStore.isAdmin()
      ? '/admin'
      : '/docente'
    : '/';

  return (
    <div className={styles.wrap}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Pagina non trovata</h1>
      <p className={styles.text}>
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <Link to={homePath} className={styles.link}>
        Torna alla home
      </Link>
    </div>
  );
}
