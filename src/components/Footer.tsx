import { NavigationItem } from '../data/collegeData';
import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

interface FooterProps {
  navigation: NavigationItem[];
}

function Footer({ navigation }: FooterProps) {
  const location = useLocation();
  const isGraduatesPage = location.pathname === '/graduates';

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <Link to="/" className={styles.footerLogoLink}>
              <img
                src="/logo_type_2.png"
                alt="ЛОКИ им. К.Н. Игумнова"
                className={styles.footerLogo}
                width="180"
                height="36"
              />
            </Link>
            <p className={styles.footerText}>© {new Date().getFullYear()} ЛОКИ им. К.Н. Игумнова</p>
            <p className={styles.footerSubtext}>Эстрадное отделение</p>
          </div>
          <nav className={styles.footerNav}>
            {navigation.map((item) => {
              if (item.id === 'graduates') {
                return (
                  <Link
                    key={item.id}
                    to="/graduates"
                    className={`${styles.footerLink} ${isGraduatesPage ? styles.footerLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={styles.footerLink}
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
