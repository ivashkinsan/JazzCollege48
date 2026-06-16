import type { EstradaDepartment } from "../../types/college";
import { asset } from "../../utils/asset";

export const estradaDepartment: EstradaDepartment = {
  name: "Эстрадное отделение",
  established: 1981,
  description:
    "Эстрадное отделение ЛОКИ им. К.Н. Игумнова — одно из ведущих подразделений колледжа, готовящее профессиональных музыкантов и вокалистов для работы в современной эстрадной индустрии по программе углубленной подготовки.",
  headName: "Заведующий отделением",
  specialties: [
    {
      code: "53.02.02",
      name: "Музыкальное искусство эстрады (по видам)",
      description:
        "Подготовка артистов эстрадного искусства в области вокального и инструментального исполнительства по программе углубленной подготовки",
      qualification:
        "Артист, преподаватель, руководитель эстрадного коллектива",
      studyDuration: "3 года 10 месяцев",
      studyForm: "Очная",
      profiles: [
        {
          name: "Инструменты эстрадного оркестра",
          disciplines: [
            "Специальный инструмент",
            "Джазовая импровизация",
            "Ансамблевое исполнительство",
            "Оркестровый класс",
            "Фортепианное исполнительство",
          ],
        },
        {
          name: "Эстрадное пение",
          disciplines: [
            "Сольное пение",
            "Ансамблевое исполнительство",
            "Джазовая импровизация",
            "Основы сценической речи, мастерство актера",
            "Танец, сценическое движение",
            "Фортепианное исполнительство",
          ],
        },
      ],
    },
  ],
  features: [
    "Индивидуальные занятия по специальности",
    "Участие в концертах и фестивалях различного уровня",
    "Сотрудничество с филармонией и концертными площадками региона",
    "Современная материально-техническая база",
    "Мастер-классы от известных артистов эстрады",
    "Регулярные отчётные концерты и показы",
    "Участие в проекте «Камертон регионов»",
    "Выступления в Москве в рамках Дней культуры Липецкой области",
    "Творческие смены и интенсивы по креативным проектам",
  ],
  instruments: [
    { name: "Фортепиано", image: asset("/instruments/piano.png") },
    // { name: 'Синтезатор', image: asset('/instruments/synthesizer.png') },
    { name: "Гитара", image: asset("/instruments/guitar.png") },
    { name: "Бас-гитара", image: asset("/instruments/bass-guitar.png") },
    // { name: "Контрабас", image: asset("/instruments/double-bass.png") },
    { name: "Альт-саксофон", image: asset("/instruments/alto-sax.png") },
    { name: "Тенор-саксофон", image: asset("/instruments/tenor-sax.png") },
    // { name: 'Баритон-саксофон', image: asset('/instruments/baritone-sax.png') },
    { name: "Труба", image: asset("/instruments/trumpet.png") },
    { name: "Тромбон", image: asset("/instruments/trombone.png") },
    // { name: 'Бас-тромбон', image: asset('/instruments/bass-trombone.png') },
    { name: "Ударная установка", image: asset("/instruments/drums.png") },
    // { name: 'Перкуссия', image: asset('/instruments/percussion.png') },
  ],
};
