import { CollegeInfo } from '../data/collegeData';
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
        <div className={styles.contactsGrid}>
          <div className={styles.contactCard}>
            <div className={styles.contactCardIcon}>📍</div>
            <h3 className={styles.contactCardTitle}>Адрес</h3>
            <p className={styles.contactCardValue}>{collegeInfo.address}</p>
          </div>
          <div className={styles.contactCard}>
            <div className={styles.contactCardIcon}>📞</div>
            <h3 className={styles.contactCardTitle}>Телефон</h3>
            <p className={styles.contactCardValue}>
              <a href={`tel:${collegeInfo.phone.replace(/\s/g, '')}`}>{collegeInfo.phone}</a>
            </p>
          </div>
          <div className={styles.contactCard}>
            <div className={styles.contactCardIcon}>✉️</div>
            <h3 className={styles.contactCardTitle}>Email</h3>
            <p className={styles.contactCardValue}>
              <a href={`mailto:${collegeInfo.email}`}>{collegeInfo.email}</a>
            </p>
          </div>
          <div className={styles.contactCard}>
            <div className={styles.contactCardIcon}>🌐</div>
            <h3 className={styles.contactCardTitle}>Сайт</h3>
            <p className={styles.contactCardValue}>
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
