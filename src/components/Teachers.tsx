import { Teacher } from '../data/collegeData';
import styles from './Teachers.module.css';

interface TeachersProps {
  teachers: Teacher[];
}

function Teachers({ teachers }: TeachersProps) {
  return (
    <section id="teachers" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Наставники</p>
          <h2 className="section__title">Наши преподаватели</h2>
        </div>
        <div className={styles.teachersGrid}>
          {teachers.map((teacher) => (
            <article key={teacher.id} className={styles.teacherCard}>
              {teacher.image ? (
                <div className={styles.teacherCardImageWrapper}>
                  <img src={teacher.image} alt={teacher.name} className={styles.teacherCardImage} />
                  <div className={styles.teacherCardOverlay}>
                    <h3 className={styles.teacherCardName}>{teacher.name}</h3>
                    <p className={styles.teacherCardPosition}>{teacher.position}</p>
                    <p className={styles.teacherCardSpecialty}>{teacher.specialty}</p>
                    {teacher.bio && <p className={styles.teacherCardBio}>{teacher.bio}</p>}
                  </div>
                </div>
              ) : (
                <div className={styles.teacherCardContent}>
                  <div className={styles.teacherCardAvatar}>
                    <span className={styles.teacherCardPlaceholder}>👨‍🏫</span>
                  </div>
                  <h3 className={styles.teacherCardName}>{teacher.name}</h3>
                  <p className={styles.teacherCardPosition}>{teacher.position}</p>
                  <p className={styles.teacherCardSpecialty}>{teacher.specialty}</p>
                  {teacher.bio && <p className={styles.teacherCardBio}>{teacher.bio}</p>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Teachers;
