import type { NavigationEntry, NavigationItem, NavigationDropdown } from '../types/college';
import { asset } from '../utils/asset';
import { useTheme } from '../hooks/useTheme';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  navigation: NavigationEntry[];
}

function isDropdown(item: NavigationEntry): item is NavigationDropdown {
  return 'items' in item && Array.isArray(item.items);
}

function Header({ navigation }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Закрываем мобильное меню при переходе на другую страницу
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname, location.hash]);

  // Блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isHomePage = location.pathname === '/';

  const getLinkProps = (item: NavigationItem, mobile = false) => {
    const isAnchor = item.href.startsWith('#');

    if (isAnchor) {
      // Для якорных ссылок: на главной — #anchor, на других — /#anchor (для перехода на главную + скролл)
      // basename добавится автоматически React Router, НЕ добавляем baseName вручную!
      const linkPath = isHomePage ? item.href : `/${item.href}`;
      const isActive = isHomePage && location.hash === item.href;

      const className = mobile
        ? `${styles.mobileLink}${isActive ? ` ${styles.mobileLinkActive}` : ''}`
        : `${styles.dropdownLink}${isActive ? ` ${styles.dropdownLinkActive}` : ''}`;

      return { to: linkPath, className, children: item.label, href: undefined as undefined };
    }
    
    const isActive = location.pathname === item.href;
    const className = mobile
      ? `${styles.mobileLink}${isActive ? ` ${styles.mobileLinkActive}` : ''}`
      : `${styles.dropdownLink}${isActive ? ` ${styles.dropdownLinkActive}` : ''}`;

    return { to: item.href, className, children: item.label, href: undefined as undefined };
  };

  const isAnyDropdownActive = (items: NavigationEntry[]): boolean => {
    return items.some((item): boolean => {
      if (isDropdown(item)) return isAnyDropdownActive(item.items);
      const isAnchor = item.href.startsWith('#');
      return isAnchor
        ? isHomePage && location.hash === item.href
        : location.pathname === item.href;
    });
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const renderNavItem = (item: NavigationEntry) => {
    if (isDropdown(item)) {
      const hasActive = isAnyDropdownActive(item.items);

      return (
        <div
          key={item.id}
          className={styles.dropdownWrapper}
          onMouseEnter={() => setOpenDropdown(item.id)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            className={`${styles.dropdownTrigger}${hasActive ? ` ${styles.dropdownTriggerActive}` : ''}`}
          >
            {item.label}
            <span className={styles.dropdownArrow}>▾</span>
          </button>
          <div className={`${styles.dropdownMenu}${openDropdown === item.id ? ` ${styles.dropdownMenuOpen}` : ''}`}>
            {item.items.map(child => {
              const props = getLinkProps(child);
              if (props.to) {
                return (
                  <Link key={child.id} to={props.to} className={props.className} onClick={() => setOpenDropdown(null)}>
                    {props.children}
                  </Link>
                );
              }
              return (
                <a key={child.id} href={props.href} className={props.className} onClick={() => setOpenDropdown(null)}>
                  {props.children}
                </a>
              );
            })}
          </div>
        </div>
      );
    }

    // Обычная ссылка
    const linkProps = getLinkProps(item);
    if (linkProps.to) {
      return (
        <Link key={item.id} to={linkProps.to} className={linkProps.className}>
          {linkProps.children}
        </Link>
      );
    }
    return (
      <a key={item.id} href={linkProps.href} className={linkProps.className}>
        {linkProps.children}
      </a>
    );
  };

  // Мобильное меню — рекурсивный рендер
  const renderMobileItem = (item: NavigationEntry) => {
    if (isDropdown(item)) {
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const hasActive = isAnyDropdownActive(item.items);

      return (
        <div key={item.id} className={styles.mobileDropdown}>
          <button
            className={`${styles.mobileDropdownTrigger}${hasActive ? ` ${styles.mobileDropdownTriggerActive}` : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {item.label}
            <span className={`${styles.mobileArrow}${dropdownOpen ? ` ${styles.mobileArrowOpen}` : ''}`}>▾</span>
          </button>
          {dropdownOpen && (
            <div className={styles.mobileDropdownMenu}>
              {item.items.map((child: any) => {
                const props = getLinkProps(child, true);
                if (props.to) {
                  return (
                    <Link key={child.id} to={props.to} className={props.className} onClick={handleMobileLinkClick}>
                      {props.children}
                    </Link>
                  );
                }
                return (
                  <a key={child.id} href={props.href} className={props.className} onClick={handleMobileLinkClick}>
                    {props.children}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const linkProps = getLinkProps(item, true);
    if (linkProps.to) {
      return (
        <Link key={item.id} to={linkProps.to} className={linkProps.className} onClick={handleMobileLinkClick}>
          {linkProps.children}
        </Link>
      );
    }
    return (
      <a key={item.id} href={linkProps.href} className={linkProps.className} onClick={handleMobileLinkClick}>
        {linkProps.children}
      </a>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Бургер-кнопка (мобильная) */}
        <button
          className={styles.burgerBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`${styles.burgerLine} ${mobileMenuOpen ? styles.burgerLineOpen1 : ''}`} />
          <span className={`${styles.burgerLine} ${mobileMenuOpen ? styles.burgerLineOpen2 : ''}`} />
          <span className={`${styles.burgerLine} ${mobileMenuOpen ? styles.burgerLineOpen3 : ''}`} />
        </button>

        <Link to="/" className={styles.headerLogo}>
          <img
            src={asset('/Logo/Logo_var_1.png')}
            alt="ЛОКИ им. К.Н. Игумнова — Эстрадное отделение"
            className={styles.headerLogoImage}
            width="52"
            height="52"
          />
          <div className={styles.headerLogoText}>
            <span className={styles.headerLogoTitle}>эстрадное отделение</span>
            <span className={styles.headerLogoSubtitle}>г.Липецк</span>
          </div>
        </Link>

        <div className={styles.headerRight}>
          {/* Десктопная навигация */}
          <nav className={styles.headerNav}>
            {navigation.map(renderNavItem)}
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

          <div className={styles.searchContainer}>
            <button className={styles.searchBtn} aria-label="Поиск">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            {/* Логика для отображения поля поиска будет добавлена позже */}
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`${styles.mobileMenu}${mobileMenuOpen ? ` ${styles.mobileMenuOpen}` : ''}`}>
        <div className={styles.mobileMenuContent}>
          <nav className={styles.mobileNav}>
            {navigation.map(renderMobileItem)}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
