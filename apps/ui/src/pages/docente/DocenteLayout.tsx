import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import styles from '../admin/AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/docente/appelli', icon: '📋', label: 'I miei appelli' },
  { to: '/docente/sessioni', icon: '🗓️', label: 'Sessioni' },
];

export default function DocenteLayout() {
  const navigate = useNavigate();
  const user = authStore.getUser();

  function handleLogout() {
    authStore.clear();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'D';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarLogoIcon}>🎓</span>
          <span className={styles.sidebarLogoText}>UniSingh</span>
        </div>

        <span className={styles.sidebarLabel}>Area docente</span>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name ?? 'Docente'}</div>
              <div className={styles.userRole}>Docente</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span>→</span> Esci
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
