import { NavigationItem } from '../data/collegeData';
import './Header.css';

interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Header({ shortName, navigation }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <span className="header__logo-text">{shortName}</span>
          <span className="header__logo-subtext">Эстрадное отделение</span>
        </div>
        <nav className="header__nav">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="header__nav-link"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
