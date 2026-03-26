import { CollegeInfo } from '../data/collegeData';
import './Contacts.css';

interface ContactsProps {
  collegeInfo: CollegeInfo;
}

function Contacts({ collegeInfo }: ContactsProps) {
  return (
    <section id="contacts" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Связь</p>
          <h2 className="section__title">Контакты</h2>
        </div>
        <div className="contacts__grid">
          <div className="contact-card">
            <div className="contact-card__icon">📍</div>
            <h3 className="contact-card__title">Адрес</h3>
            <p className="contact-card__value">{collegeInfo.address}</p>
          </div>
          <div className="contact-card">
            <div className="contact-card__icon">📞</div>
            <h3 className="contact-card__title">Телефон</h3>
            <p className="contact-card__value">
              <a href={`tel:${collegeInfo.phone.replace(/\s/g, '')}`}>{collegeInfo.phone}</a>
            </p>
          </div>
          <div className="contact-card">
            <div className="contact-card__icon">✉️</div>
            <h3 className="contact-card__title">Email</h3>
            <p className="contact-card__value">
              <a href={`mailto:${collegeInfo.email}`}>{collegeInfo.email}</a>
            </p>
          </div>
          <div className="contact-card">
            <div className="contact-card__icon">🌐</div>
            <h3 className="contact-card__title">Сайт</h3>
            <p className="contact-card__value">
              <a href={`http://${collegeInfo.website}`} target="_blank" rel="noopener noreferrer">
                {collegeInfo.website}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
