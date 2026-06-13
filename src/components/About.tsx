import type { EstradaDepartment } from '../types/college';
import { asset } from '../utils/asset';
import styles from './About.module.css';

interface AboutProps {
  department?: EstradaDepartment;
}

function About({ department: _department }: AboutProps) {
  return (
    <section id="about" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">О нас</p>
          <h2 className="section__title">Традиции эстрадного образования</h2>
        </div>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p>
              Эстрадное отделение ЛОКИ им. К.Н. Игумнова, основанное в 1981 году, является одним из ведущих в регионе. За более чем 40 лет мы подготовили сотни профессиональных артистов, преподавателей и руководителей эстрадных коллективов для работы в современной музыкальной индустрии.
            </p>
            <br />
            <p>
              Наша программа углубленной подготовки по специальности «Музыкальное искусство эстрады» включает три основных вида профессиональной деятельности:
            </p>
            <ul className={styles.aboutList}>
              <li><strong>Музыкально-исполнительская деятельность</strong> — для будущей работы в качестве артиста оркестра, ансамбля, концертмейстера, солиста</li>
              <li><strong>Педагогическая деятельность</strong> — для будущей работы преподавателем в детских школах искусств, общеобразовательных и профессиональных образовательных организациях</li>
              <li><strong>Организационная деятельность</strong> — организация репетиционной работы и концертной деятельности в качестве дирижера коллектива исполнителей</li>
            </ul>
          </div>
          <div>
            <div className={styles.aboutStats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>40+</div>
                <div className={styles.statLabel}>Лет истории</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>5976</div>
                <div className={styles.statLabel}>Учебных часов</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>19</div>
                <div className={styles.statLabel}>Исполнительских экзаменов</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>&#8734;</div>
                <div className={styles.statLabel}>Часов практики</div>
              </div>
            </div>
            <div className={styles.aboutLogoBadge} style={{ marginTop: 'var(--spacing-lg)' }}>
              <img
                src={asset('/logo_type_2.png')}
                alt="Эстрадное отделение ЛОКИ"
                className={styles.aboutLogo}
                width="120"
                height="120"
              />
              <span className={styles.aboutLogoYear}>С 1981</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
