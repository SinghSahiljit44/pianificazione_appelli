import { Outlet, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import Navbar, { type NavItem } from '../../components/Navbar';
import AppelloIcon from '../../icons/appello.svg?react';
import SessioneIcon from '../../icons/sessione.svg?react';
import ProfiloIcon from '../../icons/docenti.svg?react';

const NAV_ITEMS: NavItem[] = [
  { to: '/docente/appelli', icon: AppelloIcon, label: 'I miei appelli' },
  { to: '/docente/sessioni', icon: SessioneIcon, label: 'Sessioni' },
  { to: '/docente/profilo', icon: ProfiloIcon, label: 'Profilo' },
];

export default function DocenteLayout() {
  const location = useLocation();
  const currentPage = NAV_ITEMS.find((item) => location.pathname === item.to);

  return (
    <div className={styles.layout}>
      <a href="#contenuto" className={styles.skipLink}>
        Salta al contenuto
      </a>
      <Navbar
        items={NAV_ITEMS}
        sectionLabel="Area docente"
        userRole="Docente"
        fallbackName="Docente"
        fallbackInitial="D"
      />

      <main id="contenuto" className={styles.main}>
        {currentPage && (
          <header className={styles.topbar}>
            <currentPage.icon className={styles.topbarIcon} aria-hidden="true" />
            <span className={styles.topbarTitle}>{currentPage.label}</span>
          </header>
        )}
        <Outlet />
      </main>
    </div>
  );
}
