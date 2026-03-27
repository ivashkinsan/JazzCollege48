import styles from './Hero.module.css';

function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroLogoWrapper}>
          <img
            src="/logo_type_2.png"
            alt="Эстрадное отделение ЛОКИ"
            className={styles.heroLogo}
            width="180"
            height="180"
          />
        </div>
        <p className={styles.heroSubtitle}>С 1981 года • Программа углубленной подготовки</p>
        <h1 className={styles.heroTitle}>
          Эстрадное отделение<br />
          <span className={styles.heroTitleAccent}>ЛОКИ им. К.Н. Игумнова</span>
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
      <div className={styles.heroImageWrapper}>
        <img src="/foto/Full.png" alt="Преподаватели и студенты" className={styles.heroImage} />
      </div>
    </section>
  );
}

export default Hero;
