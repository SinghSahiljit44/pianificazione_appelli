import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import styles from './AdminLayout.module.css';
import SessioneIcon from '../../icons/sessione.svg?react';
import DocentiIcon from '../../icons/docenti.svg?react';
import MaterieIcon from '../../icons/materie.svg?react';
import CorsoLaureaIcon from '../../icons/corso-laurea.svg?react';
import AppelloIcon from '../../icons/appello.svg?react';

const NAV_ITEMS = [
  { to: '/admin/sessioni', icon: SessioneIcon, label: 'Sessioni' },
  { to: '/admin/docenti', icon: DocentiIcon, label: 'Docenti' },
  { to: '/admin/materie', icon: MaterieIcon, label: 'Materie' },
  { to: '/admin/corsi-laurea', icon: CorsoLaureaIcon, label: 'Corsi di Laurea' },
  { to: '/admin/appelli', icon: AppelloIcon, label: 'Appelli' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStore.getUser();

  const currentPage = NAV_ITEMS.find((item) => location.pathname === item.to);

  function handleLogout() {
    authStore.clear();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'A';

  return (
    <div className={styles.layout}>
      <a href="#contenuto" className={styles.skipLink}>
        Salta al contenuto
      </a>
      <aside className={styles.sidebar} aria-label="Barra laterale">
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarLogoText}>UniSingh</span>
        </div>

        <span className={styles.sidebarLabel}>Gestione</span>

        <nav className={styles.nav} aria-label="Navigazione principale">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <Icon className={styles.navIcon} aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name ?? 'Admin'}</div>
              <div className={styles.userRole}>Amministratore</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span>→</span> Esci
          </button>
        </div>
      </aside>

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
