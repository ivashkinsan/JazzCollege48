import { daiPrograms, asset } from '../data/collegeData';
import styles from './DaiPage.module.css';
import { Link } from 'react-router-dom';

function DaiPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Детская академия искусств</h1>
          <p className={styles.subtitle}>
            Дополнительное образование для детей от 5 до 17 лет
          </p>
          <p className={styles.description}>
            ДАИ открыта в 2006 году на базе ЛОКИ им. К.Н. Игумнова. 
            Главное направление — подготовка будущих абитуриентов для колледжа искусств.
          </p>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🎓</div>
              <h3 className={styles.infoTitle}>Подготовка к поступлению</h3>
              <p className={styles.infoText}>
                Выпускники ДАИ имеют преимущества при поступлении в ЛОКИ и другие учебные заведения искусств.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🎵</div>
              <h3 className={styles.infoTitle}>Опытные педагоги</h3>
              <p className={styles.infoText}>
                Преподаватели ДАИ — действующие музыканты и педагоги колледжа с большим опытом работы.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🎭</div>
              <h3 className={styles.infoTitle}>Концертная деятельность</h3>
              <p className={styles.infoText}>
                Учащиеся регулярно выступают на отчётных концертах, фестивалях и конкурсах.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📜</div>
              <h3 className={styles.infoTitle}>Сертификат</h3>
              <p className={styles.infoText}>
                По окончании программы выдаётся сертификат государственного образца.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.programsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Программы обучения</h2>
          <div className={styles.programsGrid}>
            {daiPrograms.map((program) => (
              <article key={program.id} className={styles.programCard}>
                <div className={styles.programImageWrapper}>
                  <img
                    src={program.image || asset('/foto/dai/default.jpg')}
                    alt={program.name}
                    className={styles.programImage}
                  />
                </div>
                <div className={styles.programContent}>
                  <h3 className={styles.programName}>{program.name}</h3>
                  <p className={styles.programDescription}>{program.description}</p>
                  <div className={styles.programMeta}>
                    <span className={styles.programAge}>👤 {program.age}</span>
                    <span className={styles.programDuration}>⏱ {program.duration}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className="container">
          <h2 className={styles.contactTitle}>Запись в ДАИ</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactCardTitle}>Адрес</h3>
              <p className={styles.contactText}>
                г. Липецк, ул. Студенческий Городок, д. 6<br />
                2 этаж, Детская академия искусств
              </p>
            </div>
            <div className={styles.contactCard}>
              <h3 className={styles.contactCardTitle}>Телефон</h3>
              <p className={styles.contactText}>
                <a href="tel:+74742450341" className={styles.contactLink}>
                  +7 (4742) 45-03-41
                </a>
              </p>
            </div>
            <div className={styles.contactCard}>
              <h3 className={styles.contactCardTitle}>Время работы</h3>
              <p className={styles.contactText}>
                Пн-Пт: 10:00 - 20:00<br />
                Сб: 10:00 - 18:00
              </p>
            </div>
          </div>
          <div className={styles.ctaWrapper}>
            <a href="tel:+74742450341" className="btn btn--primary">
              Позвонить и записаться
            </a>
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

export default DaiPage;
