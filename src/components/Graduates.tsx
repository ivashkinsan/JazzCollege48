import { Graduate } from '../data/collegeData';
import './Graduates.css';

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
        <div className="graduates__by-city">
          {CITIES.map((city) => {
            const cityGraduates = graduates.filter((g) => g.city === city);
            if (cityGraduates.length === 0) return null;
            return (
              <div key={city} className="graduates__city">
                <h3 className="graduates__city-name">{city}</h3>
                <div className="graduates__grid">
                  {cityGraduates.map((graduate) => (
                    <article key={graduate.id} className="graduate-card">
                      <div className="graduate-card__placeholder">
                        <span className="graduate-card__icon">🎓</span>
                      </div>
                      <div className="graduate-card__content">
                        <h4 className="graduate-card__name">{graduate.name}</h4>
                        <p className="graduate-card__year">Выпуск {graduate.graduationYear}</p>
                        <p className="graduate-card__position">{graduate.position}</p>
                        {graduate.workplace && (
                          <p className="graduate-card__workplace">{graduate.workplace}</p>
                        )}
                        {graduate.bio && <p className="graduate-card__bio">{graduate.bio}</p>}
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
