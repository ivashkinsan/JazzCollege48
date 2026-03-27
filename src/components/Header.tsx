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

  // Проверка, находимся ли мы на странице выпускников
  const isGraduatesPage = location.pathname === '/graduates';

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.headerLogo}>
          <img
            src="/logo_type_2.png"
            alt="ЛОКИ им. К.Н. Игумнова — Эстрадное отделение"
            className={styles.headerLogoImage}
            width="200"
            height="40"
          />
        </Link>
        <nav className={styles.headerNav}>
          {navigation.map((item) => {
            // Для ссылки на выпускники используем роут
            if (item.id === 'graduates') {
              return (
                <Link
                  key={item.id}
                  to="/graduates"
                  className={`${styles.headerNavLink} ${isGraduatesPage ? styles.headerNavLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            }
            // Остальные ссылки остаются якорными
            return (
              <a
                key={item.id}
                href={item.href}
                className={styles.headerNavLink}
              >
                {item.label}
              </a>
            );
          })}
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Переключить на ${theme === 'dark' ? 'светлую' : 'тёмную'} тему`}
          >
            <span className={styles.themeToggleIcon}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
