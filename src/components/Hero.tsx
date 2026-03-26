import './Hero.css';

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__content">
        <p className="hero__subtitle">С 1981 года</p>
        <h1 className="hero__title">
          Эстрадное отделение<br />
          <span className="hero__title-accent">ЛОКИ им. К.Н. Игумнова</span>
        </h1>
        <p className="hero__description">
          Готовим профессиональных музыкантов и вокалистов для работы 
          в современной эстрадной индустрии
        </p>
        <div className="hero__cta">
          <a href="#admission" className="btn btn--primary">Поступить</a>
          <a href="#about" className="btn btn--outline">Узнать больше</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
