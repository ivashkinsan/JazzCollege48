import { EstradaDepartment } from '../data/collegeData';
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
            <ul>
              {specialty.profiles.map((profile, i) => (
                <li key={i}>{profile}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className={styles.instrumentsSection}>
          <h3 className={styles.sectionSubtitleSmall}>Инструменты эстрадного оркестра</h3>
          <div className={styles.instrumentsGrid}>
            {department.instruments.map((instrument) => (
              <div key={instrument.id} className={styles.instrumentCard}>
                <div className={styles.instrumentCardIcon}>
                  {instrument.category === 'клавишные' && '🎹'}
                  {instrument.category === 'духовые' && '🎺'}
                  {instrument.category === 'ударные' && '🥁'}
                  {instrument.category === 'струнные' && '🎸'}
                </div>
                <h4 className={styles.instrumentCardName}>{instrument.name}</h4>
                <p className={styles.instrumentCardDescription}>{instrument.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Specialties;
