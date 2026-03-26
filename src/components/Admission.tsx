import { CollegeInfo } from '../data/collegeData';
import './Admission.css';

interface AdmissionProps {
  collegeInfo: CollegeInfo;
}

function Admission({ collegeInfo }: AdmissionProps) {
  return (
    <section id="admission" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Абитуриенту</p>
          <h2 className="section__title">Как поступить</h2>
        </div>
        <div className="admission__steps">
          <div className="step">
            <div className="step__number">1</div>
            <h3 className="step__title">Подать заявление</h3>
            <p className="step__description">
              Заполните заявление и соберите документы. Приём начинается 1 июня.
            </p>
          </div>
          <div className="step">
            <div className="step__number">2</div>
            <h3 className="step__title">Пройти творческое испытание</h3>
            <p className="step__description">
              Исполните 2-3 произведения на инструменте или вокале.
            </p>
          </div>
          <div className="step">
            <div className="step__number">3</div>
            <h3 className="step__title">Сдать теорию музыки</h3>
            <p className="step__description">
              Пройдите тестирование по сольфеджио и музыкальной грамоте.
            </p>
          </div>
          <div className="step">
            <div className="step__number">4</div>
            <h3 className="step__title">Получить зачисление</h3>
            <p className="step__description">
              При успешной сдаче экзаменов будьте зачислены на бюджет или контракт.
            </p>
          </div>
        </div>
        <div className="admission__info">
          <p className="admission__note">
            📞 Телефон: <a href={`tel:${collegeInfo.phone}`}>{collegeInfo.phone}</a>
          </p>
          <p className="admission__note">
            📧 Email: <a href={`mailto:${collegeInfo.email}`}>{collegeInfo.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Admission;
