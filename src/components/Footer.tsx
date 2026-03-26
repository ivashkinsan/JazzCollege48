import { NavigationItem } from '../data/collegeData';
import './Footer.css';

interface FooterProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Footer({ shortName, navigation }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__info">
            <p className="footer__text">© {new Date().getFullYear()} {shortName}</p>
            <p className="footer__subtext">Эстрадное отделение</p>
          </div>
          <nav className="footer__nav">
            {navigation.map((item) => (
              <a key={item.id} href={item.href} className="footer__link">
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
