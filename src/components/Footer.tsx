import { NavigationItem } from '../data/collegeData';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  navigation: NavigationItem[];
}

function Footer({ navigation }: FooterProps) {
  const location = useLocation();

  const isActivePage = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <Link to="/" className={styles.footerLogoLink}>
              <img
                src="/logo_JazzCollege48.svg"
                alt="ЛОКИ им. К.Н. Игумнова"
                className={styles.footerLogo}
                width="50"
                height="50"
              />
              <div className={styles.footerLogoText}>
                <span className={styles.footerLogoTitle}>эстрадно-джазовое отделение</span>
                <span className={styles.footerLogoSubtitle}>Липецк</span>
              </div>
            </Link>
            <p className={styles.footerText}>© {new Date().getFullYear()} ЛОКИ им. К.Н. Игумнова</p>
            <p className={styles.footerSubtext}>Эстрадное отделение</p>
          </div>
          <nav className={styles.footerNav}>
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
                    className={`${styles.footerLink} ${isActive ? styles.footerLinkActive : ''}`}
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
                    className={`${styles.footerLink} ${isActive ? styles.footerLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`${styles.footerLink} ${isActive ? styles.footerLinkActive : ''}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
