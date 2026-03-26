import { Teacher } from '../data/collegeData';
import './Teachers.css';

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
        <div className="teachers__grid">
          {teachers.map((teacher) => (
            <article key={teacher.id} className="teacher-card">
              <div className="teacher-card__avatar">
                <span className="teacher-card__placeholder">👨‍🏫</span>
              </div>
              <h3 className="teacher-card__name">{teacher.name}</h3>
              <p className="teacher-card__position">{teacher.position}</p>
              <p className="teacher-card__specialty">{teacher.specialty}</p>
              {teacher.bio && <p className="teacher-card__bio">{teacher.bio}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Teachers;
