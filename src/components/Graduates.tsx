import { Graduate } from '../data/collegeData';
import styles from './Graduates.module.css';

const CITIES = ['Москва', 'Санкт-Петербург', 'Ростов-на-Дону', 'Екатеринбург'];

interface GraduatesProps {
  graduates: Graduate[];
}

function Graduates({ graduates }: GraduatesProps) {
  return (
    <section id="graduates" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Гордость</p>
          <h2 className="section__title">Наши выпускники</h2>
        </div>
        <p className="section__intro">
          Выпускники работают в ведущих концертных организациях и филармониях по всей России
        </p>
        <div className={styles.graduatesByCity}>
          {CITIES.map((city) => {
            const cityGraduates = graduates.filter((g) => g.city === city);
            if (cityGraduates.length === 0) return null;
            return (
              <div key={city} className="graduates__city">
                <h3 className={styles.graduatesCityName}>{city}</h3>
                <div className={styles.graduatesGrid}>
                  {cityGraduates.map((graduate) => (
                    <article key={graduate.id} className={styles.graduateCard}>
                      <div className={styles.graduateCardPlaceholder}>
                        <span className={styles.graduateCardIcon}>🎓</span>
                      </div>
                      <div className={styles.graduateCardContent}>
                        <h4 className={styles.graduateCardName}>{graduate.name}</h4>
                        <p className={styles.graduateCardYear}>Выпуск {graduate.graduationYear}</p>
                        <p className={styles.graduateCardPosition}>{graduate.position}</p>
                        {graduate.workplace && (
                          <p className={styles.graduateCardWorkplace}>{graduate.workplace}</p>
                        )}
                        {graduate.bio && <p className={styles.graduateCardBio}>{graduate.bio}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Graduates;
