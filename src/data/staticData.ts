import type {
  CollegeInfo,
  EstradaDepartment,
  Teacher,
  Ensemble,
  Concert,
  Achievement,
  Graduate,
  NavigationEntry,
  DaiProgram,
  AdminMember,
  Photo,
  Video,
} from "../types/college";
import { asset } from "../utils/asset";

// ===== ДАННЫЕ =====

export const collegeInfo: CollegeInfo = {
  name: "Липецкий областной колледж искусств им. К.Н. Игумнова",
  shortName: "ЛОКИ им. К.Н. Игумнова",
  address: "Липецкая обл., г. Липецк, ул. Студенческий Городок, д. 6",
  phone: "+7 (4742) 41-41-71",
  email: "kolledgisskusstv@yandex.ru",
  website: "lokiigumnova.gosuslugi.ru",
};

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

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Кокшин Дмитрий Николаевич",
    position: "Преподаватель духовых инструментов",
    specialty: "Саксофон",
    image: asset("/foto/Kokshin.jpg"),
    bio: "Известный музыкант города, преподаватель по классу саксофона",
  },
  {
    id: "2",
    name: "Ивашкин Александр Владимирович",
    position: "Преподаватель клавишных инструментов",
    specialty: "Фортепиано",
    image: asset("/foto/Ivashkin.jpg"),
    bio: "Известный музыкант города, преподаватель по классу фортепиано",
  },
  {
    id: "3",
    name: "Данилов Дмитрий Александрович",
    position: "Преподаватель струнных инструментов",
    specialty: "Гитара",
    image: asset("/foto/Danilov.jpg"),
    bio: "Известный музыкант города, преподаватель по классу гитары",
  },
  {
    id: "4",
    name: "Катрук Максим Николаевич",
    position: "Преподаватель струнных инструментов",
    specialty: "Бас-гитара",
    image: asset("/foto/Katruk.jpg"),
    bio: "Известный музыкант города, преподаватель по классу бас-гитары",
  },
  {
    id: "5",
    name: "Реннер Людмила Арнольдовна",
    position: "Преподаватель духовых инструментов",
    specialty: "Саксофон",
    image: asset("/foto/Renner.jpg"),
    bio: "Известный музыкант города, солистка саксофонистка, преподаватель по классу саксофона",
  },
  {
    id: "6",
    name: "Колупаев Вячеслав Иванович",
    position: "Преподаватель клавишных инструментов",
    specialty: "Фортепиано",
    image: asset("/foto/Kolupaew.jpeg"),
    bio: "Известный музыкант города, преподаватель по классу фортепиано",
  },
  {
    id: "7",
    name: "Игнаткин Олег Александрович",
    position: "Преподаватель ударных инструментов",
    specialty: "Ударная установка, перкуссия",
    image: asset("/foto/Ignatkin.jpg"),
    bio: "Известный музыкант города, преподаватель по классу ударных",
  },
  {
    id: "8",
    name: "Волкова Наталья Викторовна",
    position: "Преподаватель вокального искусства",
    specialty: "Эстрадный вокал",
    image: asset("/foto/Volkova.jpg"),
    bio: "Известный музыкант города, певица, преподаватель по классу эстрадного вокала",
  },
  {
    id: "9",
    name: "Бережная Василина Евгеньевна",
    position: "Преподаватель вокального искусства",
    specialty: "Эстрадный вокал",
    image: asset("/foto/Berezhnaya.jpg"),
    bio: "Преподаватель по классу эстрадного вокала",
  },
  {
    id: "10",
    name: "Темникова Дарья Викторовна",
    position: "Преподаватель вокального искусства",
    specialty: "Эстрадный вокал",
    image: asset("/foto/Temnikova.jpg"),
    bio: "Преподаватель по классу эстрадного вокала",
  },
];

export const ensembles: Ensemble[] = [
  {
    id: "1",
    name: "Эстрадный оркестр ЛОКИ",
    type: "Оркестр",
    description:
      "Учебный оркестр для практической отработки навыков ансамблевой игры. В составе оркестра студенты всех курсов по специальностям: духовые, ударные, клавишные и струнные инструменты.",
    members: [
      "Саксофоны",
      "Трубы",
      "Тромбоны",
      "Фортепиано",
      "Ударные",
      "Бас-гитара",
      "Электрогитара",
    ],
  },
  {
    id: "2",
    name: "Вокальный ансамбль",
    type: "Вокальная группа",
    description:
      "Коллектив для развития навыков вокального исполнения в группе. Участники выступают на отчётных концертах и городских мероприятиях.",
    members: ["Солисты-вокалисты", "Бэк-вокал"],
  },
  {
    id: "3",
    name: "Инструментальные ансамбли",
    type: "Камерные составы",
    description:
      "Малые составы: дуэты, трио, квартеты, квинтеты. Студенты работают над репертуаром в различных эстрадных жанрах.",
    members: ["Различные инструментальные составы"],
  },
];

export const concerts: Concert[] = [
  {
    id: "1",
    title: "Отчётный концерт эстрадного отделения",
    date: "2025-05-27",
    time: "18:00",
    venue: "Концертный зал ЛОКИ им. К.Н. Игумнова",
    description:
      "Ежегодный отчётный концерт студентов эстрадного отделения. Выступления вокалистов и инструменталистов всех курсов.",
    isFree: true,
  },
  {
    id: "2",
    title: "«Камертон регионов»",
    date: "2025-11-16",
    time: "16:00",
    venue: "Липецкий дом музыки, концертный зал «ЛОКИ им. К. Игумнова»",
    description:
      "Концерт в рамках проекта «Камертон регионов». Выступление студенческих коллективов и солистов.",
    isFree: true,
  },
  {
    id: "3",
    title: "«Земля Липецкая — Константину Игумнову»",
    date: "2025-10-15",
    time: "19:00",
    venue: "ДМШ им. К.Н. Игумнова, г. Москва",
    description:
      "Концерт в рамках Дней культуры Липецкой области в Москве. Участие студентов эстрадного отделения: саксофон, флейта, гобой, фортепиано, вокал.",
    isFree: false,
  },
  {
    id: "4",
    title: "Творческая смена «Мечтай, дерзай, твори!»",
    date: "2025-11-20",
    time: "15:00",
    venue: "ЛОКИ им. К.Н. Игумнова, г. Липецк",
    description:
      "Творческая смена, посвящённая духовым инструментам. Мастер-класс от Леонида Гурьева (Московская консерватория).",
    isFree: true,
  },
  {
    id: "5",
    title: "«Молодёжный квартал»",
    date: "2025-03-22",
    time: "17:00",
    venue: "ОЦКиНТ, г. Липецк",
    description:
      "Музыкальный фестиваль студенческого творчества. Участие эстрадного отделения с инструментальными и вокальными номерами.",
    isFree: false,
  },
];

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Лауреат I степени",
    studentName: "Иванов Алексей",
    competition: "Всероссийский конкурс исполнителей эстрадной музыки",
    date: "2025-05",
    place: "I место",
    category: "Саксофон",
    image: asset("/achievements/saxophone-diploma-1.jpg"),
  },
  {
    id: "2",
    title: "Гран-при фестиваля",
    studentName: "Петрова Мария",
    competition: "Международный фестиваль «Эстрадный голос»",
    date: "2025-04",
    place: "Гран-при",
    category: "Эстрадный вокал",
    image: asset("/achievements/vocal-diploma-1.jpg"),
  },
  {
    id: "3",
    title: "Лауреат II степени",
    studentName: "Сидоров Дмитрий",
    competition: "Региональный конкурс джазовых исполнителей",
    date: "2025-03",
    place: "II место",
    category: "Фортепиано",
    image: asset("/achievements/piano-diploma-1.jpg"),
  },
  {
    id: "4",
    title: "Лауреат III степени",
    studentName: "Ансамбль «Гроув»",
    competition: "Фестиваль инструментальных ансамблей",
    date: "2025-06",
    place: "III место",
    category: "Инструментальный ансамбль",
    image: asset("/achievements/ensemble-diploma-1.jpg"),
  },
  {
    id: "5",
    title: "Дипломант конкурса",
    studentName: "Козлова Анна",
    competition: "Открытый конкурс вокалистов «Голос надежды»",
    date: "2024-12",
    place: "Дипломант",
    category: "Эстрадный вокал",
    image: asset("/achievements/vocal-diploma-2.jpg"),
  },
  {
    id: "6",
    title: "Лауреат I степени",
    studentName: "Морозов Павел",
    competition: "Международный конкурс ударников",
    date: "2024-11",
    place: "I место",
    category: "Ударные инструменты",
    image: asset("/achievements/drums-diploma-1.jpg"),
  },
];

export const graduates: Graduate[] = [
  // Выпускники для блока "Наша гордость"
  {
    id: "featured-1",
    name: "Мельников Денис",
    graduationYear: 2015,
    position: "Саксофонист, аранжировщик, бэнд-лидер, педагог",
    workplace: "Академия джаза (г. Москва)",
    bio: "Заведующий эстрадно-джазовым отделом и педагог по классу саксофона и ансамбля в Академии джаза. Руководитель Jazz Academy Big Band. Лауреат международных и всероссийских конкурсов.",
    image: asset("/foto_nasha_gordost/Melnikov.jpg"),
    isFeatured: true,
  },
  {
    id: "featured-2",
    name: "Окунев Владислав",
    graduationYear: 2003,
    position:
      "Джазовый гитарист-виртуоз, аранжировщик, преподаватель. Лауреат международных и всероссийских конкурсов.",
    workplace: "Kim Nazaretov Big Band, РГК им. С.В. Рахманинова",
    bio: "Известный гитарист-виртуоз, работает в Kim Nazaretov Big Band. Сессионный музыкант.",
    image: asset("/foto_nasha_gordost/Okunev.jpg"),
    isFeatured: true,
  },
  {
    id: "featured-3",
    name: "Чага Иван",
    graduationYear: 2023,
    position: "Барабанщик, студент",
    workplace: "Академия музыки им. Гнесиных",
    bio: "Талантливый барабанщик, студент академии музыки им. Гнесиных. Лауреат международных и всероссийских конкурсов.",
    image: asset("/foto_nasha_gordost/Chaga.jpg"),
    isFeatured: true,
  },
  {
    id: "featured-4",
    name: "Стульнев Дмитрий Андреевич",
    graduationYear: 2010,
    position:
      "Дирижёр, бэнд-лидер, руководитель Липецкого джазового оркестра. Лауреат международных и всероссийских конкурсов.",
    workplace: "Липецкий джазовый оркестр, Липецкий Дом музыки",
    bio: "Художественный руководитель Липецкого джазового оркестра.",
    image: asset("/foto_nasha_gordost/Stulnev.jpg"),
    isFeatured: true,
  },
  {
    id: "featured-5",
    name: "Меринова Екатерина",
    graduationYear: 2018,
    position: "Саксофонистка, вокалистка, лауреат международных конкурсов",
    workplace:
      "Эстрадно-джазовый оркестр им. Кима Назаретова, РГК им. С.В. Рахманинова",
    bio: "Выпускница Ростовской государственной консерватории им. С.В. Рахманинова. Артистка эстрадно-джазового оркестра им. Кима Назаретова, преподаватель детской музыкальной школы им. П.И. Чайковского г. Ростова-на-Дону. Лауреат международных и всероссийских конкурсов.",
    image: asset("/foto_nasha_gordost/Merinova.jpg"),
    isFeatured: true,
  },
  // Другие выпускники
  {
    id: "1",
    name: "Коротков Максим",
    graduationYear: 2026,
    position: "саксофон",
    workplace: "",
    bio: "",
  },
  {
    id: "2",
    name: "Курдюкова Мария",
    graduationYear: 2026,
    position: "труба",
    workplace: "Санкт-Петербургская филармония",
    bio: "",
  },
  {
    id: "3",
    name: "Хрюкин Иван",
    graduationYear: 2026,
    position: "гитара",
    workplace: "Ростовская государственная филармония",
    bio: "Художественный руководитель эстрадного ансамбля, лауреат международных конкурсов",
  },
  {
    id: "4",
    name: "Шишкина Варвара",
    graduationYear: 2026,
    position: "альт-саксофон",
    workplace: "",
    bio: "",
  },
  {
    id: "5",
    name: "Филатова София",
    graduationYear: 2026,
    position: "Вокалистка",
    workplace: "Фрилансер",
    bio: "Выступает с сольными концертами",
  },
  {
    id: "6",
    name: "Баранова Валерия",
    graduationYear: 2026,
    position: "Вокалистка",
    workplace: "Ростовский музыкальный театр",
    bio: "Ведущая солистка мюзиклов, гастролирует по России",
  },
];

export const navigation: NavigationEntry[] = [
  { id: "about", label: "О нас", href: "#about" },
  { id: "specialties", label: "Специальности", href: "#specialties" },
  {
    id: "department",
    label: "Отделение",
    items: [
      { id: "orchestra", label: "Оркестр", href: "/department" },
      { id: "teachers", label: "Преподаватели", href: "#teachers" },
      { id: "admin", label: "Администрация", href: "/admin" },
      { id: "dai", label: "ДАИ", href: "/dai" },
    ],
  },
  { id: "graduates", label: "Выпускники", href: "/graduates" },
  { id: "afisha", label: "Афиша", href: "/afisha" },
  { id: "news", label: "Новости", href: "/news" },
  {
    id: "media",
    label: "Медиа",
    items: [
      { id: "photos", label: "Фото", href: "/photos" },
      { id: "videos", label: "Видео", href: "/videos" },
    ],
  },
  { id: "contacts", label: "Контакты", href: "#contacts" },
];

export const daiPrograms: DaiProgram[] = [
  {
    id: "1",
    name: "Фортепиано",
    description:
      "Обучение игре на фортепиано, основы музыкальной грамоты, чтение с листа, ансамблевая игра.",
    age: "6-17 лет",
    duration: "1-7 лет",
    image: asset("/foto/dai/piano.jpg"),
  },
  {
    id: "2",
    name: "Саксофон",
    description:
      "Индивидуальные занятия по классу саксофона, изучение джазовых и эстрадных стилей, ансамбль.",
    age: "10-17 лет",
    duration: "1-5 лет",
    image: asset("/foto/dai/saxophone.jpg"),
  },
  {
    id: "3",
    name: "Гитара",
    description:
      "Игра на гитаре в эстрадном и классическом стилях, аккомпанемент, импровизация.",
    age: "8-17 лет",
    duration: "1-5 лет",
    image: asset("/foto/dai/guitar.jpg"),
  },
  {
    id: "4",
    name: "Ударные инструменты",
    description:
      "Обучение игре на ударной установке, перкуссии, ритм-секции в ансамбле.",
    age: "10-17 лет",
    duration: "1-5 лет",
    image: asset("/foto/dai/drums.jpg"),
  },
  {
    id: "5",
    name: "Эстрадный вокал",
    description:
      "Постановка голоса, сценическая речь, актёрское мастерство, сольное и ансамблевое пение.",
    age: "8-17 лет",
    duration: "1-5 лет",
    image: asset("/foto/dai/vocal.jpg"),
  },
  {
    id: "6",
    name: "Подготовительное отделение",
    description:
      "Подготовка детей 5-7 лет к поступлению в музыкальные учебные заведения. Основы музыкальной грамоты, ритмика, развитие слуха.",
    age: "5-7 лет",
    duration: "1-2 года",
    image: asset("/foto/dai/prep.jpg"),
  },
];

export const adminMembers: AdminMember[] = [
  {
    id: "1",
    name: "Веселова Ольга Владимировна",
    position: "Директор колледжа",
    image: asset("/foto_admin/Veselova.webp"),
    bio: "Руководит Липецким областным колледжем искусств им. К.Н. Игумнова. Курирует общее управление и развитие учебного заведения.",
    email: "kolledgiskusstv@yandex.ru",
    phone: "+7 (4742) 41-41-71",
  },
  {
    id: "2",
    name: "Колодкина Ирина Валентиновна",
    position: "Заместитель директора по учебной работе",
    image: asset("/foto_admin/Kolodkina.jpg"),
    bio: "Курирует учебный процесс, методическую работу и организацию образовательной деятельности в колледже.",
    email: "kolledgiskusstv@yandex.ru",
    phone: "+7 (474) 241-41-67",
  },
  {
    id: "3",
    name: "Фаустова Ирина Викторовна",
    position: "Заместитель директора по воспитательной работе",
    image: asset("/foto_admin/Faustova.jpg"),
    bio: "Организует внеучебную деятельность, воспитательные мероприятия и работу со студентами. Окончила Липецкий государственный педагогический университет по специальности «Музыкальное образование».",
    email: "kolledgiskusstv@yandex.ru",
    phone: "+7 (474) 241-41-38",
  },
  {
    id: "4",
    name: "Кокшин Дмитрий Николаевич",
    position: "Заведующий эстрадным отделением",
    image: asset("/foto/admin/estrada-head.jpg"),
    bio: "Руководит эстрадным отделением. Преподаватель духовых инструментов по классу саксофона.",
    email: "kolledgisskusstv@yandex.ru",
    phone: "+7 (474) 241-41-74",
  },
];

export const photos: Photo[] = [
  // 2025
  {
    id: "p1",
    title: "Отчётный концерт 2025",
    year: 2025,
    category: "концерты",
    src: asset("/foto/2025/concert-1.jpg"),
  },
  {
    id: "p2",
    title: "Мастер-класс от Леонида Гурьева",
    year: 2025,
    category: "мастер-классы",
    src: asset("/foto/2025/masterclass-1.jpg"),
  },
  {
    id: "p3",
    title: "Выпускной 2025",
    year: 2025,
    category: "выпускные",
    src: asset("/foto/2025/graduation.jpg"),
  },
  // 2024
  {
    id: "p4",
    title: "Концерт в Москве",
    year: 2024,
    category: "концерты",
    src: asset("/foto/2024/moscow-concert.jpg"),
  },
  {
    id: "p5",
    title: "Будни отделения",
    year: 2024,
    category: "будни",
    src: asset("/foto/2024/weekdays.jpg"),
  },
  {
    id: "p6",
    title: "Мастер-класс по вокалу",
    year: 2024,
    category: "мастер-классы",
    src: asset("/foto/2024/vocal-master.jpg"),
  },
  // 2023
  {
    id: "p7",
    title: "Отчётный концерт 2023",
    year: 2023,
    category: "концерты",
    src: asset("/foto/2023/concert.jpg"),
  },
  {
    id: "p8",
    title: "Выпускной 2023",
    year: 2023,
    category: "выпускные",
    src: asset("/foto/2023/graduation.jpg"),
  },
  // 2022
  {
    id: "p9",
    title: "Концерт к 8 марта",
    year: 2022,
    category: "концерты",
    src: asset("/foto/2022/march-concert.jpg"),
  },
  {
    id: "p10",
    title: "Репетиция оркестра",
    year: 2022,
    category: "будни",
    src: asset("/foto/2022/rehearsal.jpg"),
  },
  // 2021
  {
    id: "p11",
    title: "Онлайн-концерт",
    year: 2021,
    category: "концерты",
    src: asset("/foto/2021/online-concert.jpg"),
  },
  {
    id: "p12",
    title: "Выпускной 2021",
    year: 2021,
    category: "выпускные",
    src: asset("/foto/2021/graduation.jpg"),
  },
  // 2020
  {
    id: "p13",
    title: "Последний звонок",
    year: 2020,
    category: "другое",
    src: asset("/foto/2020/last-bell.jpg"),
  },
  {
    id: "p14",
    title: "Концерт в филармонии",
    year: 2020,
    category: "концерты",
    src: asset("/foto/2020/philharmony.jpg"),
  },
  // 1990-2019
  {
    id: "p15",
    title: "Архивное фото 2010",
    year: 2010,
    category: "другое",
    src: asset("/foto/archive/2010.jpg"),
  },
  {
    id: "p16",
    title: "Архивное фото 2000",
    year: 2000,
    category: "другое",
    src: asset("/foto/archive/2000.jpg"),
  },
  {
    id: "p17",
    title: "Архивное фото 1990",
    year: 1990,
    category: "другое",
    src: asset("/foto/archive/1990.jpg"),
  },
];

export const videos: Video[] = [
  {
    id: "v0",
    title: "Видео с эстрадного отделения",
    description: "Видеозапись выступления студентов эстрадного отделения.",
    videoUrl:
      "https://rutube.ru/video/private/5ebdfc5c594d14d955a9548f7f09205d/?p=BKH7oE6fUOzlk7J4gZy_cg",
    thumbnail: asset("/video/thumbs/default.jpg"),
    date: "2025-04-01",
    source: "rutube",
  },
  {
    id: "v1",
    title: "Отчётный концерт эстрадного отделения 2025",
    description:
      "Ежегодный отчётный концерт студентов эстрадного отделения ЛОКИ.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: asset("/video/thumbs/concert-2025.jpg"),
    date: "2025-05-27",
    source: "rutube",
  },
  {
    id: "v2",
    title: "Мастер-класс Дениса Мельникова",
    description:
      "Занятие по саксофону от заведующего эстрадно-джазовым отделом Академии джаза.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: asset("/video/thumbs/melnikov-master.jpg"),
    date: "2025-04-15",
    source: "rutube",
  },
  {
    id: "v3",
    title: "Выступление в Москве. Дни культуры Липецкой области",
    description:
      "Концерт «Земля Липецкая — Константину Игумнову» в ДМШ им. К.Н. Игумнова.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: asset("/video/thumbs/moscow-2025.jpg"),
    date: "2025-10-20",
    source: "rutube",
  },
  {
    id: "v4",
    title: "Камертон регионов 2024",
    description: "Фестиваль учебных заведений культуры и искусств.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: asset("/video/thumbs/kamerton-2024.jpg"),
    date: "2024-11-16",
    source: "rutube",
  },
  {
    id: "v5",
    title: "Интервью с выпускниками",
    description: "Встреча с успешными выпускниками эстрадного отделения.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: asset("/video/thumbs/interview.jpg"),
    date: "2024-09-01",
    source: "rutube",
  },
];
