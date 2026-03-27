import { NavigationItem } from '../data/collegeData';
import { useTheme } from '../hooks/useTheme';
import styles from './Header.module.css';

interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Header({ shortName, navigation }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <a href="#" className={styles.headerLogo}>
          <img
            src="/logo_type_2.png"
            alt="ЛОКИ им. К.Н. Игумнова — Эстрадное отделение"
            className={styles.headerLogoImage}
            width="200"
            height="40"
          />
        </a>
        <nav className={styles.headerNav}>
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={styles.headerNavLink}
            >
              {item.label}
            </a>
          ))}
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
