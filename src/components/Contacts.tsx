import type { CollegeInfo } from '../types/college';
import styles from './Contacts.module.css';

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
        <div className={styles.contactsWrapper}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <a 
              href="https://yandex.ru/maps/?text=Липецкая%20обл.%2C%20г.%20Липецк%2C%20ул.%20Студенческий%20Городок%2C%20д.%206" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.contactLink}
            >
              {collegeInfo.address}
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <a href={`tel:${collegeInfo.phone.replace(/\s/g, '')}`} className={styles.contactLink}>
              {collegeInfo.phone}
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <a href={`mailto:${collegeInfo.email}`} className={styles.contactLink}>
              {collegeInfo.email}
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>🌐</span>
            <a href={`http://${collegeInfo.website}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              {collegeInfo.website}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
