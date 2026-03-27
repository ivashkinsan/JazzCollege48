import { NavigationItem } from '../data/collegeData';
import styles from './Footer.module.css';

interface FooterProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Footer({ shortName, navigation }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <img
              src="/logo_type_2.png"
              alt={shortName}
              className={styles.footerLogo}
              width="180"
              height="36"
            />
            <p className={styles.footerText}>© {new Date().getFullYear()} {shortName}</p>
            <p className={styles.footerSubtext}>Эстрадное отделение</p>
          </div>
          <nav className={styles.footerNav}>
            {navigation.map((item) => (
              <a key={item.id} href={item.href} className={styles.footerLink}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
