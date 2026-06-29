import type { ComponentType, SVGProps } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore';
import styles from './Navbar.module.css';

export type NavItem = {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
};

type NavbarProps = {
  items: NavItem[];
  sectionLabel: string;
  userRole: string;
  fallbackName: string;
  fallbackInitial: string;
};

export default function Navbar({
  items,
  sectionLabel,
  userRole,
  fallbackName,
  fallbackInitial,
}: NavbarProps) {
  const navigate = useNavigate();
  const user = authStore.getUser();

  function handleLogout() {
    authStore.clear();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : fallbackInitial;

  return (
    <aside className={styles.sidebar} aria-label="Barra laterale">
      <div className={styles.sidebarLogo}>
        <span className={styles.sidebarLogoText}>UniSingh</span>
      </div>

      <span className={styles.sidebarLabel}>{sectionLabel}</span>

      <nav className={styles.nav} aria-label="Navigazione principale">
        {items.map((item) => {
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
            <div className={styles.userName}>{user?.name ?? fallbackName}</div>
            <div className={styles.userRole}>{userRole}</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span>→</span> Esci
        </button>
      </div>
    </aside>
  );
}
