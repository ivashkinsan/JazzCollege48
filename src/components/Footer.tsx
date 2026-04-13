import { NavigationEntry, asset } from '../data/collegeData';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  navigation: NavigationEntry[];
}

function isDropdown(item: NavigationEntry): item is NavigationEntry & { items: { href: string; id: string; label: string }[] } {
  return 'items' in item;
}

function Footer({ navigation }: FooterProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Flatten: dropdown items + regular links
  const flatLinks = navigation.flatMap(item =>
    isDropdown(item) ? item.items : [item]
  );

  const isActive = (href: string) => {
    const isAnchor = href.startsWith('#');
    return isAnchor
      ? isHomePage && location.hash === href
      : location.pathname === href;
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <Link to="/" className={styles.footerLogoLink}>
              <img
                src={asset('/logo_JazzCollege48.svg')}
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
            {flatLinks.map((item) => {
              const isAnchor = item.href.startsWith('#');
              const href = isAnchor && !isHomePage ? `/${item.href}` : item.href;
              const active = isActive(item.href);

              return isAnchor ? (
                <a
                  key={item.id}
                  href={href}
                  className={`${styles.footerLink}${active ? ` ${styles.footerLinkActive}` : ''}`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={href}
                  className={`${styles.footerLink}${active ? ` ${styles.footerLinkActive}` : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
