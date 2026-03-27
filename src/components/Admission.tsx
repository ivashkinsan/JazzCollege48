import { CollegeInfo } from '../data/collegeData';
import styles from './Admission.module.css';

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
        <p className={styles.admissionIntro}>
          Приём абитуриентов на специальность 53.02.02 «Музыкальное искусство эстрады»
          проводится на базе основного общего или среднего общего образования.
          Училище проводит вступительные испытания творческой направленности.
        </p>
        <div className={styles.admissionSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Подать заявление</h3>
            <p className={styles.stepDescription}>
              Заполните заявление и соберите документы. Приём начинается 1 июня.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Пройти творческое испытание</h3>
            <p className={styles.stepDescription}>
              Исполните 2-3 произведения на инструменте или вокале.
              Для вокалистов — исполнение произведений эстрадного репертуара.
              Для инструменталистов — исполнение произведений классической,
              современной и эстрадно-джазовой музыки.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Сдать теорию музыки</h3>
            <p className={styles.stepDescription}>
              Пройдите тестирование по сольфеджио и музыкальной грамоте.
              Вступительное испытание определяет уровень музыкально-теоретических знаний.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3 className={styles.stepTitle}>Получить зачисление</h3>
            <p className={styles.stepDescription}>
              При успешной сдаче экзаменов будьте зачислены на бюджет или контракт.
              Обучение по программе углубленной подготовки длится 3 года 10 месяцев.
            </p>
          </div>
        </div>
        <div className={styles.admissionRequirements}>
          <h3 className={styles.admissionRequirementsTitle}>Требования к вступительным испытаниям</h3>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementItem}>
              <h4>🎤 Эстрадное пение</h4>
              <ul>
                <li>Исполнение 2-3 произведений эстрадного репертуара</li>
                <li>Проверка вокальных данных и сценической культуры</li>
                <li>Возможность аккомпанемента (минусовка или концертмейстер)</li>
              </ul>
            </div>
            <div className={styles.requirementItem}>
              <h4>🎸 Инструменты эстрадного оркестра</h4>
              <ul>
                <li>Исполнение произведений классической и эстрадно-джазовой литературы</li>
                <li>Демонстрация технических навыков и импровизационных способностей</li>
                <li>Чтение нот с листа (для некоторых инструментов)</li>
              </ul>
            </div>
            <div className={styles.requirementItem}>
              <h4>🎵 Музыкально-теоретические знания</h4>
              <ul>
                <li>Сольфеджио (письменно и устно)</li>
                <li>Элементарная теория музыки</li>
                <li>Слуховой анализ</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.admissionInfo}>
          <p className={styles.admissionNote}>
            📞 Телефон: <a href={`tel:${collegeInfo.phone}`}>{collegeInfo.phone}</a>
          </p>
          <p className={styles.admissionNote}>
            📧 Email: <a href={`mailto:${collegeInfo.email}`}>{collegeInfo.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Admission;
