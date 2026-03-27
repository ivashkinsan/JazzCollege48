import { adminMembers } from '../data/collegeData';
import styles from './AdminPage.module.css';
import { Link } from 'react-router-dom';

function AdminPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Администрация</h1>
          <p className={styles.subtitle}>
            Руководство и администрация Липецкого областного колледжа искусств им. К.Н. Игумнова
          </p>
        </div>
      </section>

      <section className={styles.adminSection}>
        <div className="container">
          <div className={styles.adminGrid}>
            {adminMembers.map((member) => (
              <article key={member.id} className={styles.adminCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={member.image || '/foto/admin/default.jpg'}
                    alt={member.name}
                    className={styles.image}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <p className={styles.position}>{member.position}</p>
                  {member.bio && (
                    <p className={styles.bio}>{member.bio}</p>
                  )}
                  <div className={styles.contacts}>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className={styles.contactLink}>
                        ✉️ {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className={styles.contactLink}>
                        📞 {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>По вопросам обращайтесь</h2>
            <p className={styles.ctaText}>
              Приемная директора: +7 (474) 241-41-70<br />
              Email: lokii@yandex.ru
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <div className="container">
          <Link to="/" className={styles.backLink}>
            ← На главную
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default AdminPage;
