import type { Ensemble } from '../types/college';
import styles from './Ensembles.module.css'; // Reuse styles

interface OrchestraProps {
  ensemble: Ensemble;
}

function Orchestra({ ensemble }: OrchestraProps) {
  return (
    <section id="orchestra" className="section">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Творчество</p>
          <h2 className="section__title">Наш оркестр</h2>
        </div>
        <div className={styles.ensemblesGrid}>
          <article className={styles.ensembleCard}>
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
        </div>
      </div>
    </section>
  );
}

export default Orchestra;
