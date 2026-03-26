import { EstradaDepartment } from '../data/collegeData';
import './Specialties.css';

interface SpecialtiesProps {
  department: EstradaDepartment;
}

function Specialties({ department }: SpecialtiesProps) {
  return (
    <section id="specialties" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Обучение</p>
          <h2 className="section__title">Специальности и профили</h2>
        </div>
        <div className="specialties__grid">
          {department.specialties.map((specialty) => (
            <article key={specialty.code} className="specialty-card">
              <div className="specialty-card__code">{specialty.code}</div>
              <h3 className="specialty-card__title">{specialty.name}</h3>
              <p className="specialty-card__description">{specialty.description}</p>
              <div className="specialty-card__profiles">
                <h4>Профили подготовки:</h4>
                <ul>
                  {specialty.profiles.map((profile, i) => (
                    <li key={i}>{profile}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        
        <div className="instruments__section">
          <h3 className="section__subtitle-small">Инструменты эстрадного оркестра</h3>
          <div className="instruments__grid">
            {department.instruments.map((instrument) => (
              <div key={instrument.id} className="instrument-card">
                <div className="instrument-card__icon">
                  {instrument.category === 'клавишные' && '🎹'}
                  {instrument.category === 'духовые' && '🎺'}
                  {instrument.category === 'ударные' && '🥁'}
                  {instrument.category === 'струнные' && '🎸'}
                </div>
                <h4 className="instrument-card__name">{instrument.name}</h4>
                <p className="instrument-card__description">{instrument.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Specialties;
