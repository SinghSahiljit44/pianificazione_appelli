import { Outlet, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import Navbar, { type NavItem } from '../../components/Navbar';
import SessioneIcon from '../../icons/sessione.svg?react';
import DocentiIcon from '../../icons/docenti.svg?react';
import MaterieIcon from '../../icons/materie.svg?react';
import CorsoLaureaIcon from '../../icons/corso-laurea.svg?react';
import AppelloIcon from '../../icons/appello.svg?react';

const NAV_ITEMS: NavItem[] = [
  { to: '/admin/sessioni', icon: SessioneIcon, label: 'Sessioni' },
  { to: '/admin/docenti', icon: DocentiIcon, label: 'Docenti' },
  { to: '/admin/materie', icon: MaterieIcon, label: 'Materie' },
  { to: '/admin/corsi-laurea', icon: CorsoLaureaIcon, label: 'Corsi di Laurea' },
  { to: '/admin/appelli', icon: AppelloIcon, label: 'Appelli' },
];

export default function AdminLayout() {
  const location = useLocation();
  const currentPage = NAV_ITEMS.find((item) => location.pathname === item.to);

  return (
    <div className={styles.layout}>
      <a href="#contenuto" className={styles.skipLink}>
        Salta al contenuto
      </a>
      <Navbar
        items={NAV_ITEMS}
        sectionLabel="Gestione"
        userRole="Amministratore"
        fallbackName="Admin"
        fallbackInitial="A"
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
