import { Ensemble } from '../data/collegeData';
import styles from './Ensembles.module.css';

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
        <div className={styles.ensemblesGrid}>
          {ensembles.map((ensemble) => (
            <article key={ensemble.id} className={styles.ensembleCard}>
              <div className={styles.ensembleCardHeader}>
                <span className={styles.ensembleCardType}>{ensemble.type}</span>
                <h3 className={styles.ensembleCardName}>{ensemble.name}</h3>
              </div>
              <p className={styles.ensembleCardDescription}>{ensemble.description}</p>
              {ensemble.members && (
                <div className={styles.ensembleCardMembers}>
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
