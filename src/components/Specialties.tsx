import type { EstradaDepartment } from '../types/college';
import styles from './Specialties.module.css';

interface SpecialtiesProps {
  department: EstradaDepartment;
}

function Specialties({ department }: SpecialtiesProps) {
  const specialty = department.specialties[0];

  return (
    <section id="specialties" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Обучение</p>
          <h2 className="section__title">Специальности и профили</h2>
        </div>

        <article className={styles.specialtyCard}>
          <div className={styles.specialtyCardHeader}>
            <div className={styles.specialtyCardCode}>{specialty.code}</div>
            <h3 className={styles.specialtyCardTitle}>{specialty.name}</h3>
          </div>
          <p className={styles.specialtyCardDescription}>{specialty.description}</p>

          <div className={styles.specialtyCardMeta}>
            <div className={styles.metaItem}>
              <strong>Квалификация:</strong> {specialty.qualification}
            </div>
            <div className={styles.metaItem}>
              <strong>Срок обучения:</strong> {specialty.studyDuration}
            </div>
            <div className={styles.metaItem}>
              <strong>Форма обучения:</strong> {specialty.studyForm}
            </div>
          </div>

          <div className={styles.specialtyCardProfiles}>
            <h4>Профили подготовки:</h4>
            <ul className={styles.profileList}>
              {specialty.profiles.map((profile, i) => (
                <li key={i}>
                  <strong>{profile.name}</strong>
                  <ul className={styles.disciplineList}>
                    {profile.disciplines.map((discipline, j) => (
                      <li key={j}>{discipline}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className={styles.instrumentsSection}>
          <h3 className={styles.sectionSubtitleSmall}>Инструменты эстрадного оркестра</h3>
          <div className={styles.instrumentsGrid}>
            {department.instruments.map((instrument, index) => (
              <div key={index} className={styles.instrumentCard}>
                <img src={instrument.image} alt={instrument.name} className={styles.instrumentCardImage} loading="lazy" />
                <h4 className={styles.instrumentCardName}>{instrument.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Specialties;
