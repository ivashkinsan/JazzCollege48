import { NavigationItem } from '../data/collegeData';
import { useTheme } from '../hooks/useTheme';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  navigation: NavigationItem[];
}

function Header({ navigation }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Проверка активной страницы
  const isActivePage = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.headerLogo}>
          <img
            src="/logo_JazzCollege48.svg"
            alt="ЛОКИ им. К.Н. Игумнова — Эстрадное отделение"
            className={styles.headerLogoImage}
            width="60"
            height="60"
          />
          <div className={styles.headerLogoText}>
            <span className={styles.headerLogoTitle}>эстрадно-джазовое отделение</span>
            <span className={styles.headerLogoSubtitle}>Липецк</span>
          </div>
        </Link>
        <div className={styles.headerRight}>
          <nav className={styles.headerNav}>
            {navigation.map((item) => {
              const isExternal = item.href.startsWith('#');
              const isActive = isExternal
                ? isHomePage && location.hash === item.href
                : isActivePage(item.href);

              // Если якорная ссылка и не на главной — переходим на главную с якорем
              if (isExternal && !isHomePage) {
                return (
                  <a
                    key={item.id}
                    href={`/${item.href}`}
                    className={`${styles.headerNavLink} ${isActive ? styles.headerNavLinkActive : ''}`}
                  >
                    {item.label}
                  </a>
                );
              }

              if (!isExternal) {
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`${styles.headerNavLink} ${isActive ? styles.headerNavLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`${styles.headerNavLink} ${isActive ? styles.headerNavLinkActive : ''}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Переключить на ${theme === 'dark' ? 'светлую' : 'тёмную'} тему`}
          >
            <span className={styles.themeToggleIcon}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
