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
        <div className={styles.contactsWrapper}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <span className={styles.contactText}>{collegeInfo.address}</span>
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
