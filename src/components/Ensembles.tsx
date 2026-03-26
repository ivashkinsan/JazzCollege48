import { Ensemble } from '../data/collegeData';
import './Ensembles.css';

interface EnsemblesProps {
  ensembles: Ensemble[];
}

function Ensembles({ ensembles }: EnsemblesProps) {
  return (
    <section id="ensembles" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Творчество</p>
          <h2 className="section__title">Наши коллективы</h2>
        </div>
        <div className="ensembles__grid">
          {ensembles.map((ensemble) => (
            <article key={ensemble.id} className="ensemble-card">
              <div className="ensemble-card__header">
                <span className="ensemble-card__type">{ensemble.type}</span>
                <h3 className="ensemble-card__name">{ensemble.name}</h3>
              </div>
              <p className="ensemble-card__description">{ensemble.description}</p>
              {ensemble.members && (
                <div className="ensemble-card__members">
                  <h4>В составе:</h4>
                  <ul>
                    {ensemble.members.map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ensembles;
