import type { CollegeInfo } from '../types/college';
import styles from './Admission.module.css';

interface AdmissionProps {
  collegeInfo?: CollegeInfo;
}

function Admission({ collegeInfo: _collegeInfo }: AdmissionProps) {
  return (
    <section id="admission" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Абитуриенту</p>
          <h2 className="section__title">Как поступить</h2>
        </div>
        <div className={styles.introGrid}>
          <div className={styles.introColumn}>
            <span className={styles.icon}>🎓</span>
            <p>
              Прием абитуриентов на специальность 53.02.02 «Музыкальное искусство эстрады (по видам)» проводится на базе основного общего образования (9 классов). Срок обучения — 3 года 10 месяцев.
              Выпускники получают квалификацию: «Артист, преподаватель, руководитель эстрадного коллектива».
            </p>
          </div>
          <div className={styles.introColumn}>
            <span className={styles.icon}>🎵</span>
            <p>
              Обучение ведется по двум профилям: «Эстрадное пение» и «Инструменты эстрадного оркестра». Вступительные испытания включают профессиональные творческие задания и проверку музыкально-теоретической подготовки.
            </p>
          </div>
          <div className={styles.introColumn}>
            <span className={styles.icon}>❗</span>
            <p>
              Важно: прием проводится только при условии владения поступающим объемом знаний и умений в соответствии с требованиями к выпускникам детских школ искусств (ДШИ).
            </p>
          </div>
        </div>
        <h3 className={styles.subheading}>Этапы поступления</h3>
        <div className={styles.admissionSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h4 className={styles.stepTitle}>Подача заявления и документов</h4>
            <p className={styles.stepDescription}>
              Прием документов стартует 1 июня.
              Необходимо предоставить: заявление, паспорт, аттестат об основном общем образовании (или его копию), документы, подтверждающие особые права (при наличии).
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h4 className={styles.stepTitle}>Прохождение вступительных испытаний</h4>
            <p className={styles.stepDescription}>
              Экзамены состоят из двух частей:
            </p>
            <ul>
              <li>Исполнение программы по специальности (определяет уровень подготовки в области пения или игры на инструменте).</li>
              <li>Коллоквиум по музыкально-теоретическим дисциплинам (проверка знаний сольфеджио и теории музыки).</li>
            </ul>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h4 className={styles.stepTitle}>Зачисление</h4>
            <p className={styles.stepDescription}>
              При успешной сдаче экзаменов абитуриент зачисляется на бюджетное место или обучение с оплатой стоимости контракта.
            </p>
          </div>
        </div>
        <div className={styles.admissionRequirements}>
          <h3 className={styles.subheading}>Требования к вступительным испытаниям</h3>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementItem}>
              <h4>🎤 Профиль: «Эстрадное пение»</h4>
              <ul>
                <li>Исполнение сольной программы (возможно под «минусовую» фонограмму, инструментальный ансамбль или в сопровождении концертмейстера).</li>
                <li>2–3 разнохарактерных произведения эстрадного репертуара (включая джазовые стандарты).</li>
                <li>Демонстрация вокальных данных: чистота интонации, тембр, диапазон, владение певческим дыханием.</li>
                <li>Сценическая культура и артистизм.</li>
              </ul>
              <p>Примечание: Абитуриент должен продемонстрировать понимание стилистических особенностей эстрадно-джазовой музыки.</p>
            </div>
            <div className={styles.requirementItem}>
              <h4>🎸 Профиль: «Инструменты эстрадного оркестра»</h4>
              <ul>
                <li>Исполнение сольной программы на инструменте (фортепиано, саксофон, труба, тромбон, гитара, бас-гитара, ударные, контрабас).</li>
                <li>2–3 разнохарактерных произведения: классическое, эстрадно-джазовое (пьеса или этюд), а также произведение по выбору абитуриента.</li>
                <li>Техническая подвижность, владение инструментом.</li>
                <li>Для джазовых инструментов: демонстрация навыков импровизации (например, исполнение темы и простой импровизации на блюзовый квадрат).</li>
                <li>Чтение нот с листа (по возможности).</li>
              </ul>
            </div>
            <div className={styles.requirementItem}>
              <h4>🎵 Музыкально-теоретическая подготовка (общий блок для обоих профилей)</h4>
              <ul>
                <li>Испытание проходит в форме собеседования и письменного теста, позволяющего определить уровень знаний:</li>
                <li>Сольфеджио: Интонационные и слуховые навыки. Чтение с листа мелодии, слуховой анализ интервалов и аккордов вне лада и в ладу, запись простого диктанта.</li>
                <li>Элементарная теория музыки: Знание ладов, тональностей, интервалов, аккордов, метроритма.</li>
                <li>Музыкальная литература: Общее представление об основных жанрах, стилях и формах.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.importantInfo}>
          <h3 className={styles.subheading}>Важная информация для поступающих</h3>
          <ul className={styles.infoList}>
            <li className={styles.infoListItem}>
              <span className={styles.infoListIcon}>✓</span>
              <span>Форма обучения: только очная.</span>
            </li>
            <li className={styles.infoListItem}>
              <span className={styles.infoListIcon}>✓</span>
              <span>Нормативный срок обучения: 3 года 10 месяцев на базе 9 классов.</span>
            </li>
            <li className={styles.infoListItem}>
              <span className={styles.infoListIcon}>✓</span>
              <span>Учебная практика: С первого курса студенты участвуют в работе ансамблей и оркестра (Big Band), проходят педагогическую практику в Детской академии искусств.</span>
            </li>
            <li className={styles.infoListItem}>
              <span className={styles.infoListIcon}>✓</span>
              <span>Концертмейстер: Вокалистам и инструменталистам на экзамене может быть предоставлен концертмейстер (по запросу), однако использование качественных фонограмм также приветствуется.</span>
            </li>
            <li className={styles.infoListItem}>
              <span className={styles.infoListIcon}>✓</span>
              <span>Прием на обучение осуществляется при условии владения поступающим объемом знаний и умений в соответствии с требованиями к выпускникам ДМШ / ДШИ по специальности.</span>
            </li>

          </ul>
        </div>
      </div>
    </section>
  );
}

export default Admission;
