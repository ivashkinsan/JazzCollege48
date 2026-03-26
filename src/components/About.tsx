import { EstradaDepartment } from '../data/collegeData';
import './About.css';

interface AboutProps {
  department: EstradaDepartment;
}

function About({ department }: AboutProps) {
  return (
    <section id="about" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Об отделении</p>
          <h2 className="section__title">Традиции эстрадного образования</h2>
        </div>
        <div className="about__content">
          <div className="about__text">
            <p>
              Эстрадное отделение ЛОКИ им. К.Н. Игумнова было основано в 1981 году. 
              За более чем 40 лет мы подготовили сотни профессиональных музыкантов.
            </p>
            <br />
            <p>
              Наши выпускники становятся артистами эстрады, руководителями 
              коллективов, преподавателями музыкальных учебных заведений.
            </p>
          </div>
          <div className="about__stats">
            <div className="stat">
              <div className="stat__value">40+</div>
              <div className="stat__label">Лет истории</div>
            </div>
            <div className="stat">
              <div className="stat__value">{department.specialties.length}</div>
              <div className="stat__label">Специальности</div>
            </div>
            <div className="stat">
              <div className="stat__value">356</div>
              <div className="stat__label">Заявлений в 2025</div>
            </div>
            <div className="stat">
              <div className="stat__value">156</div>
              <div className="stat__label">Бюджетных мест</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
