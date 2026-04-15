import { asset } from '../data/collegeData';
import styles from './Hero.module.css';

function Hero() {
  return (
    <section
      id="hero"
      className={styles.hero}
      style={{ backgroundImage: `url(${asset('/foto/Full.png')})` }}
    >
      <div className={styles.heroContent}>
        <div className={styles.heroLogoWrapper}>
          <img
            src={asset('/Logo/Logo_var_1.png')}
            alt="Эстрадное отделение ЛОКИ"
            className={styles.heroLogo}
            width="150"
            height="150"
          />
        </div>
        {/* <p className={styles.heroLogoText}>
          <span className={styles.heroLogoTitle}>эстрадно-джазовое отделение</span>
          <span className={styles.heroLocation}>Липецк</span>
        </p> */}
        {/* <p className={styles.heroSubtitle}>основано в 1981 году</p> */}
        <h1 className={styles.heroTitle}>
          Эстрадное отделение<br />
          <span className={styles.heroTitleAccent}>Липецкого областного колледжа искусств<br /></span>
          <span className={styles.heroTitleAccent}>им. К.Н. Игумнова</span>
        </h1>
        <p className={styles.heroDescription}>
          Готовим профессиональных музыкантов и вокалистов для работы
          в современной эстрадной индустрии
        </p>
        <p className={styles.heroInfo}>
          Специальность 53.02.02 • 3 года 10 месяцев • Очная форма<br />
          Квалификация: артист, преподаватель, руководитель эстрадного коллектива
        </p>
        <div className={styles.heroCta}>
          <a href="#admission" className={`${styles.btn} ${styles.btnPrimary}`}>Поступить</a>
          <a href="#about" className={`${styles.btn} ${styles.btnOutline}`}>Узнать больше</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
