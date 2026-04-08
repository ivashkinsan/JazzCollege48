// ===== ИНТЕРФЕЙСЫ =====

export interface Teacher {
  id: string;
  name: string;
  position: string;
  specialty: string;
  image?: string;
  bio?: string;
}

export interface Achievement {
  id: string;
  title: string;
  studentName?: string;
  competition: string;
  date: string;
  place: string;
  category: string;
  image?: string;
}

export interface Graduate {
  id: string;
  name: string;
  graduationYear: number;
  position: string;
  workplace?: string;
  image?: string;
  bio?: string;
  isFeatured?: boolean; // Для блока "Наша гордость"
}

export interface Concert {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  description: string;
  image?: string;
  isFree?: boolean;
}

export interface Ensemble {
  id: string;
  name: string;
  type: string;
  description: string;
  members?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}

export interface Specialty {
  code: string;
  name: string;
  profiles: string[];
  description: string;
  qualification?: string;
  studyDuration?: string;
  studyForm?: string;
}

export interface Instrument {
  id: string;
  name: string;
  category: 'клавишные' | 'духовые' | 'ударные' | 'струнные';
  description: string;
}

export interface EstradaDepartment {
  name: string;
  established: number;
  description: string;
  headName: string;
  specialties: Specialty[];
  features: string[];
  instruments: Instrument[];
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface CollegeInfo {
  name: string;
  shortName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface AdminMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  bio?: string;
  email?: string;
  phone?: string;
}

export interface Photo {
  id: string;
  title: string;
  year: number;
  category: 'концерты' | 'мастер-классы' | 'будни' | 'выпускные' | 'другое';
  src: string;
  thumbnail?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  date: string;
  source: 'rutube' | 'youtube' | 'vk';
}

export interface DaiProgram {
  id: string;
  name: string;
  description: string;
  age: string;
  duration: string;
  image?: string;
}

// ===== ДАННЫЕ =====

export const collegeInfo: CollegeInfo = {
  name: "Липецкий областной колледж искусств им. К.Н. Игумнова",
  shortName: "ЛОКИ им. К.Н. Игумнова",
  address: "Липецкая обл., г. Липецк, ул. Студенческий Городок, д. 6",
  phone: "+7 (474) 241-41-71",
  email: "lokii@yandex.ru",
  website: "lokii.ru"
};

export const estradaDepartment: EstradaDepartment = {
  name: "Эстрадное отделение",
  established: 1981,
  description: "Эстрадное отделение ЛОКИ им. К.Н. Игумнова — одно из ведущих подразделений колледжа, готовящее профессиональных музыкантов и вокалистов для работы в современной эстрадной индустрии по программе углубленной подготовки.",
  headName: "Заведующий отделением",
  specialties: [
    {
      code: "53.02.02",
      name: "Музыкальное искусство эстрады (по видам)",
      description: "Подготовка артистов эстрадного искусства в области вокального и инструментального исполнительства по программе углубленной подготовки",
      qualification: "Артист, преподаватель, руководитель эстрадного коллектива",
      studyDuration: "3 года 10 месяцев",
      studyForm: "Очная",
      profiles: [
        "Инструменты эстрадного оркестра (ударные, духовые, струнные, клавишные)",
        "Эстрадное пение"
      ]
    }
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
    "Творческие смены и интенсивы по креативным проектам"
  ],
  instruments: [
    {
      id: "keys",
      name: "Клавишные инструменты",
      category: "клавишные",
      description: "Фортепиано, синтезаторы, электроорган"
    },
    {
      id: "winds",
      name: "Духовые инструменты",
      category: "духовые",
      description: "Саксофон, труба, тромбон"
    },
    {
      id: "percussion",
      name: "Ударные инструменты",
      category: "ударные",
      description: "Ударная установка, перкуссия"
    },
    {
      id: "strings",
      name: "Струнные инструменты",
      category: "струнные",
      description: "Электрогитара, бас-гитара, контрабас"
    }
  ]
};

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Кокшин Дмитрий Николаевич",
    position: "Преподаватель духовых инструментов",
    specialty: "Саксофон",
    image: "/foto/Kokshin.jpg",
    bio: "Известный музыкант города, преподаватель по классу саксофона"
  },
  {
    id: "2",
    name: "Ивашкин Александр Владимирович",
    position: "Преподаватель клавишных инструментов",
    specialty: "Фортепиано",
    image: "/foto/Ivashkin.jpg",
    bio: "Известный музыкант города, преподаватель по классу фортепиано"
  },
  {
    id: "3",
    name: "Данилов Дмитрий Александрович",
    position: "Преподаватель струнных инструментов",
    specialty: "Гитара",
    image: "/foto/Danilov.jpg",
    bio: "Известный музыкант города, преподаватель по классу гитары"
  },
  {
    id: "4",
    name: "Катрук Максим Николаевич",
    position: "Преподаватель струнных инструментов",
    specialty: "Бас-гитара",
    image: "/foto/Katruk.jpg",
    bio: "Известный музыкант города, преподаватель по классу бас-гитары"
  },
  {
    id: "5",
    name: "Реннер Людмила Арнольдовна",
    position: "Преподаватель духовых инструментов",
    specialty: "Саксофон",
    image: "/foto/Renner.jpg",
    bio: "Известный музыкант города, солистка саксофонистка, преподаватель по классу саксофона"
  },
  {
    id: "6",
    name: "Колупаев Вячеслав Иванович",
    position: "Преподаватель клавишных инструментов",
    specialty: "Фортепиано",
    image: "/foto/Kolupaew.jpg",
    bio: "Известный музыкант города, преподаватель по классу фортепиано"
  },
  {
    id: "7",
    name: "Игнаткин Олег Александрович",
    position: "Преподаватель ударных инструментов",
    specialty: "Ударная установка, перкуссия",
    image: "/foto/Ignatkin.jpg",
    bio: "Известный музыкант города, преподаватель по классу ударных"
  },
  {
    id: "8",
    name: "Волкова Наталья Викторовна",
    position: "Преподаватель вокального искусства",
    specialty: "Эстрадный вокал",
    image: "/foto/Volkova.jpg",
    bio: "Известный музыкант города, певица, преподаватель по классу эстрадного вокала"
  },
  {
    id: "9",
    name: "Бережная Василина Евгеньевна",
    position: "Преподаватель вокального искусства",
    specialty: "Эстрадный вокал",
    image: "/foto/Berezhnaya.jpg",
    bio: "Преподаватель по классу эстрадного вокала"
  },
  {
    id: "10",
    name: "Темникова Дарья Викторовна",
    position: "Преподаватель вокального искусства",
    specialty: "Эстрадный вокал",
    image: "/foto/Temnikova.jpg",
    bio: "Преподаватель по классу эстрадного вокала"
  }
];

export const ensembles: Ensemble[] = [
  {
    id: "1",
    name: "Эстрадный оркестр ЛОКИ",
    type: "Оркестр",
    description: "Учебный оркестр для практической отработки навыков ансамблевой игры. В составе оркестра студенты всех курсов по специальностям: духовые, ударные, клавишные и струнные инструменты.",
    members: ["Саксофоны", "Трубы", "Тромбоны", "Фортепиано", "Ударные", "Бас-гитара", "Электрогитара"]
  },
  {
    id: "2",
    name: "Вокальный ансамбль",
    type: "Вокальная группа",
    description: "Коллектив для развития навыков вокального исполнения в группе. Участники выступают на отчётных концертах и городских мероприятиях.",
    members: ["Солисты-вокалисты", "Бэк-вокал"]
  },
  {
    id: "3",
    name: "Инструментальные ансамбли",
    type: "Камерные составы",
    description: "Малые составы: дуэты, трио, квартеты, квинтеты. Студенты работают над репертуаром в различных эстрадных жанрах.",
    members: ["Различные инструментальные составы"]
  }
];

export const concerts: Concert[] = [
  {
    id: "1",
    title: "Отчётный концерт эстрадного отделения",
    date: "2025-05-27",
    time: "18:00",
    venue: "Концертный зал ЛОКИ им. К.Н. Игумнова",
    description: "Ежегодный отчётный концерт студентов эстрадного отделения. Выступления вокалистов и инструменталистов всех курсов.",
    isFree: true
  },
  {
    id: "2",
    title: "«Камертон регионов»",
    date: "2025-11-16",
    time: "16:00",
    venue: "Липецкий дом музыки, концертный зал «ЛОКИ им. К. Игумнова»",
    description: "Концерт в рамках проекта «Камертон регионов». Выступление студенческих коллективов и солистов.",
    isFree: true
  },
  {
    id: "3",
    title: "«Земля Липецкая — Константину Игумнову»",
    date: "2025-10-15",
    time: "19:00",
    venue: "ДМШ им. К.Н. Игумнова, г. Москва",
    description: "Концерт в рамках Дней культуры Липецкой области в Москве. Участие студентов эстрадного отделения: саксофон, флейта, гобой, фортепиано, вокал.",
    isFree: false
  },
  {
    id: "4",
    title: "Творческая смена «Мечтай, дерзай, твори!»",
    date: "2025-11-20",
    time: "15:00",
    venue: "ЛОКИ им. К.Н. Игумнова, г. Липецк",
    description: "Творческая смена, посвящённая духовым инструментам. Мастер-класс от Леонида Гурьева (Московская консерватория).",
    isFree: true
  },
  {
    id: "5",
    title: "«Молодёжный квартал»",
    date: "2025-03-22",
    time: "17:00",
    venue: "ОЦКиНТ, г. Липецк",
    description: "Музыкальный фестиваль студенческого творчества. Участие эстрадного отделения с инструментальными и вокальными номерами.",
    isFree: false
  }
];

// Загрузка новостей из markdown файлов
// Vite импортирует raw-контент .md файлов через glob import
const newsModules = import.meta.glob('../news/**/*.md', { query: '?raw', import: 'default' });

// Функция парсинга frontmatter из markdown
function parseMarkdownNews(content: string): NewsItem | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;
  
  const [, frontmatterStr, body] = frontmatterMatch;
  
  const parseField = (field: string) => {
    const match = frontmatterStr.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
    return match ? match[1].trim() : '';
  };
  
  const title = parseField('title').replace(/^["']|["']$/g, '');
  const date = parseField('date');
  const category = parseField('category');
  const cover = parseField('cover');
  
  // Извлекаем описание из первых 200 символов тела
  const description = body.trim().slice(0, 250).replace(/[#*_~`]/g, '').trim();
  
  if (!title || !date) return null;
  
  return {
    id: `${date}-${title.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}`,
    title,
    date,
    description,
    content: body.trim(),
    category,
    cover: cover || undefined,
    // Парсим галерею из комментариев <!-- gallery -->
    gallery: parseGallery(content)
  };
}

function parseGallery(content: string): string[] {
  const galleryMatch = content.match(/<!--\s*gallery\s*-->\n([\s\S]*?)$/);
  if (!galleryMatch) return [];
  
  const lines = galleryMatch[1].split('\n');
  return lines
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim())
    .filter(Boolean);
}

// Расширенный интерфейс новости
export interface ExtendedNewsItem extends NewsItem {
  content?: string;
  category?: string;
  cover?: string;
  gallery?: string[];
}

// Загружаем все новости при инициализации
export const news: ExtendedNewsItem[] = [];
let isLoading = false;
let isLoaded = false;

// Асинхронная загрузка новостей (вызывать в App.tsx)
export async function loadNews(): Promise<ExtendedNewsItem[]> {
  if (isLoaded) return news; // Уже загружено
  if (isLoading) {
    // Ждём завершения текущей загрузки
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (isLoaded) {
          clearInterval(check);
          resolve(news);
        }
      }, 50);
    });
  }

  isLoading = true;
  const loaded: ExtendedNewsItem[] = [];

  for (const path in newsModules) {
    const content = (await newsModules[path]() as string).replace(/\r\n/g, '\n');
    const item = parseMarkdownNews(content);
    if (item) {
      loaded.push(item as ExtendedNewsItem);
    }
  }

  // Сортируем по дате (новые сверху)
  loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  news.length = 0; // Очищаем массив
  news.push(...loaded);
  isLoaded = true;
  return news;
}

// ===== АФИШИ =====

// Vite импортирует raw-контент .md файлов афиш через glob import
const afishaModules = import.meta.glob('../afisha/**/*.md', { query: '?raw', import: 'default' });

export interface AfishaItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  cover?: string;
  content: string;
  gallery?: string[];
  tags?: string[];
}

export const afisha: AfishaItem[] = [];
let isAfishaLoaded = false;
let isAfishaLoading = false;

export async function loadAfisha(): Promise<AfishaItem[]> {
  if (isAfishaLoaded) return afisha;
  if (isAfishaLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (isAfishaLoaded) {
          clearInterval(check);
          resolve(afisha);
        }
      }, 50);
    });
  }

  isAfishaLoading = true;
  const loaded: AfishaItem[] = [];

  for (const path in afishaModules) {
    const content = (await afishaModules[path]() as string).replace(/\r\n/g, '\n');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) continue;

    const [, frontmatterStr, body] = frontmatterMatch;
    const parseField = (field: string) => {
      const match = frontmatterStr.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
      return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
    };

    const title = parseField('title');
    const date = parseField('date');
    const time = parseField('time') || undefined;
    const venue = parseField('venue') || undefined;
    const cover = parseField('cover') || undefined;
    const tagsStr = parseField('tags');
    const tags = tagsStr ? tagsStr.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean) : [];

    // Парсим галерею
    const galleryMatch = content.match(/<!--\s*gallery\s*-->\n([\s\S]*?)$/);
    const gallery = galleryMatch
      ? galleryMatch[1].split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2).trim()).filter(Boolean)
      : [];

    if (!title || !date) continue;

    loaded.push({
      id: `${date}-${title.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}`,
      title,
      date,
      time,
      venue,
      cover,
      content: body.trim(),
      gallery,
      tags
    });
  }

  loaded.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  afisha.length = 0;
  afisha.push(...loaded);
  isAfishaLoaded = true;
  console.log(`[afisha] Загружено ${loaded.length} афиш:`, loaded.map(a => `${a.date} ${a.title}`));
  return afisha;
}

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Лауреат I степени",
    studentName: "Иванов Алексей",
    competition: "Всероссийский конкурс исполнителей эстрадной музыки",
    date: "2025-05",
    place: "I место",
    category: "Саксофон",
    image: "/achievements/saxophone-diploma-1.jpg"
  },
  {
    id: "2",
    title: "Гран-при фестиваля",
    studentName: "Петрова Мария",
    competition: "Международный фестиваль «Эстрадный голос»",
    date: "2025-04",
    place: "Гран-при",
    category: "Эстрадный вокал",
    image: "/achievements/vocal-diploma-1.jpg"
  },
  {
    id: "3",
    title: "Лауреат II степени",
    studentName: "Сидоров Дмитрий",
    competition: "Региональный конкурс джазовых исполнителей",
    date: "2025-03",
    place: "II место",
    category: "Фортепиано",
    image: "/achievements/piano-diploma-1.jpg"
  },
  {
    id: "4",
    title: "Лауреат III степени",
    studentName: "Ансамбль «Гроув»",
    competition: "Фестиваль инструментальных ансамблей",
    date: "2025-06",
    place: "III место",
    category: "Инструментальный ансамбль",
    image: "/achievements/ensemble-diploma-1.jpg"
  },
  {
    id: "5",
    title: "Дипломант конкурса",
    studentName: "Козлова Анна",
    competition: "Открытый конкурс вокалистов «Голос надежды»",
    date: "2024-12",
    place: "Дипломант",
    category: "Эстрадный вокал",
    image: "/achievements/vocal-diploma-2.jpg"
  },
  {
    id: "6",
    title: "Лауреат I степени",
    studentName: "Морозов Павел",
    competition: "Международный конкурс ударников",
    date: "2024-11",
    place: "I место",
    category: "Ударные инструменты",
    image: "/achievements/drums-diploma-1.jpg"
  }
];

export const graduates: Graduate[] = [
  // Выпускники для блока "Наша гордость"
  {
    id: "featured-1",
    name: "Мельников Денис",
    graduationYear: 2015,
    position: "Саксофонист, аранжировщик, бэнд-лидер, педагог",
    workplace: "Академия джаза (г. Москва)",
    bio: "Заведующий эстрадно-джазовым отделом и педагог по классу саксофона и ансамбля в Академии джаза. Руководитель Jazz Academy Big Band. Ученик знаменитого Дмитрия Мосьпана.",
    image: "/foto_nasha_gordost/Melnikov.jpg",
    isFeatured: true
  },
  {
    id: "featured-2",
    name: "Окунев Владислав",
    graduationYear: 2003,
    position: "Джазовый гитарист-виртуоз, аранжировщик, преподаватель",
    workplace: "Kim Nazaretov Big Band, РГК им. С.В. Рахманинова",
    bio: "Известный гитарист-виртуоз, работает в Kim Nazaretov Big Band. Преподаватель джазовой гитары и импровизации в Ростовской государственной консерватории им. С.В. Рахманинова. Сессионный музыкант.",
    image: "/foto_nasha_gordost/Okunev.jpg",
    isFeatured: true
  },
  {
    id: "featured-3",
    name: "Чага Иван",
    graduationYear: 2023,
    position: "Барабанщик, студент",
    workplace: "Академия музыки им. Гнесиных",
    bio: "Талантливый барабанщик, студент академии музыки им. Гнесиных. Резидент московских джазовых клубов, участник фестиваля «Будущее джаза». Играл с известными российскими джазовыми музыкантами.",
    image: "/foto_nasha_gordost/Chaga.jpg",
    isFeatured: true
  },
  // Другие выпускники
  {
    id: "1",
    name: "Смирнов Александр",
    graduationYear: 2020,
    position: "Артист эстрады, саксофонист",
    workplace: "Московский джазовый оркестр",
    bio: "Солист Московского джазового оркестра, участник международных фестивалей"
  },
  {
    id: "2",
    name: "Васильева Екатерина",
    graduationYear: 2019,
    position: "Вокалистка, преподаватель",
    workplace: "Санкт-Петербургская филармония",
    bio: "Солистка филармонии, ведёт частную вокальную студию"
  },
  {
    id: "3",
    name: "Новиков Михаил",
    graduationYear: 2021,
    position: "Руководитель эстрадного коллектива",
    workplace: "Ростовская государственная филармония",
    bio: "Художественный руководитель эстрадного ансамбля, лауреат международных конкурсов"
  },
  {
    id: "4",
    name: "Лебедева Ольга",
    graduationYear: 2018,
    position: "Звукорежиссёр",
    workplace: "Студия «Тон-Ателье»",
    bio: "Работает над звуковым оформлением концертных программ и альбомов"
  },
  {
    id: "5",
    name: "Кравченко Игорь",
    graduationYear: 2022,
    position: "Гитарист, композитор",
    workplace: "Фрилансер",
    bio: "Пишет музыку для кино и театра, выступает с сольными концертами"
  },
  {
    id: "6",
    name: "Попова Анастасия",
    graduationYear: 2020,
    position: "Вокалистка мюзикла",
    workplace: "Ростовский музыкальный театр",
    bio: "Ведущая солистка мюзиклов, гастролирует по России"
  },
  {
    id: "7",
    name: "Федоров Максим",
    graduationYear: 2017,
    position: "Бас-гитарист",
    workplace: "Государственный симфонический оркестр",
    bio: "Участник известных сессионных проектов, работает с топ-артистами российской эстрады"
  },
  {
    id: "8",
    name: "Морозова Виктория",
    graduationYear: 2021,
    position: "Преподаватель эстрадного вокала",
    workplace: "Екатеринбургский колледж искусств",
    bio: "Преподаёт вокал, организует ежегодный фестиваль эстрадной песни"
  },
  {
    id: "9",
    name: "Орлов Дмитрий",
    graduationYear: 2019,
    position: "Ударник",
    workplace: "Джаз-клуб «Бродячая собака»",
    bio: "Резидент известного джаз-клуба, участник международных джазовых фестивалей"
  },
  {
    id: "10",
    name: "Соколова Елена",
    graduationYear: 2023,
    position: "Клавишница, аранжировщик",
    workplace: "Продюсерский центр",
    bio: "Работает аранжировщиком, аккомпаниатор в популярных телепроектах"
  }
];

export const navigation: NavigationItem[] = [
  { id: "about", label: "Об отделении", href: "#about" },
  { id: "specialties", label: "Специальности", href: "#specialties" },
  { id: "teachers", label: "Преподаватели", href: "#teachers" },
  { id: "afisha", label: "Афиша", href: "/afisha" },
  { id: "news", label: "Новости", href: "/news" },
  { id: "graduates", label: "Выпускники", href: "/graduates" },
  { id: "dai", label: "ДАИ", href: "/dai" },
  { id: "admin", label: "Администрация", href: "/admin" },
  { id: "photos", label: "Фото", href: "/photos" },
  { id: "videos", label: "Видео", href: "/videos" },
  { id: "contacts", label: "Контакты", href: "#contacts" }
];

export const daiPrograms: DaiProgram[] = [
  {
    id: "1",
    name: "Фортепиано",
    description: "Обучение игре на фортепиано, основы музыкальной грамоты, чтение с листа, ансамблевая игра.",
    age: "6-17 лет",
    duration: "1-7 лет",
    image: "/foto/dai/piano.jpg"
  },
  {
    id: "2",
    name: "Саксофон",
    description: "Индивидуальные занятия по классу саксофона, изучение джазовых и эстрадных стилей, ансамбль.",
    age: "10-17 лет",
    duration: "1-5 лет",
    image: "/foto/dai/saxophone.jpg"
  },
  {
    id: "3",
    name: "Гитара",
    description: "Игра на гитаре в эстрадном и классическом стилях, аккомпанемент, импровизация.",
    age: "8-17 лет",
    duration: "1-5 лет",
    image: "/foto/dai/guitar.jpg"
  },
  {
    id: "4",
    name: "Ударные инструменты",
    description: "Обучение игре на ударной установке, перкуссии, ритм-секции в ансамбле.",
    age: "10-17 лет",
    duration: "1-5 лет",
    image: "/foto/dai/drums.jpg"
  },
  {
    id: "5",
    name: "Эстрадный вокал",
    description: "Постановка голоса, сценическая речь, актёрское мастерство, сольное и ансамблевое пение.",
    age: "8-17 лет",
    duration: "1-5 лет",
    image: "/foto/dai/vocal.jpg"
  },
  {
    id: "6",
    name: "Подготовительное отделение",
    description: "Подготовка детей 5-7 лет к поступлению в музыкальные учебные заведения. Основы музыкальной грамоты, ритмика, развитие слуха.",
    age: "5-7 лет",
    duration: "1-2 года",
    image: "/foto/dai/prep.jpg"
  }
];

export const adminMembers: AdminMember[] = [
  {
    id: "1",
    name: "Веселова Ольга Владимировна",
    position: "Директор колледжа",
    image: "/foto_admin/Veselova.webp",
    bio: "Руководит Липецким областным колледжем искусств им. К.Н. Игумнова. Курирует общее управление и развитие учебного заведения.",
    email: "kolledgiskusstv@yandex.ru",
    phone: "+7 (474) 241-41-71"
  },
  {
    id: "2",
    name: "Колодкина Ирина Валентиновна",
    position: "Заместитель директора по учебной работе",
    image: "/foto_admin/Kolodkina.jpg",
    bio: "Курирует учебный процесс, методическую работу и организацию образовательной деятельности в колледже.",
    email: "kolledgiskusstv@yandex.ru",
    phone: "+7 (474) 241-41-67"
  },
  {
    id: "3",
    name: "Фаустова Ирина Викторовна",
    position: "Заместитель директора по воспитательной работе",
    image: "/foto_admin/Faustova.jpg",
    bio: "Организует внеучебную деятельность, воспитательные мероприятия и работу со студентами. Окончила Липецкий государственный педагогический университет по специальности «Музыкальное образование».",
    email: "kolledgiskusstv@yandex.ru",
    phone: "+7 (474) 241-41-38"
  },
  {
    id: "4",
    name: "Кокшин Дмитрий Николаевич",
    position: "Заведующий эстрадным отделением",
    image: "/foto/admin/estrada-head.jpg",
    bio: "Руководит эстрадным отделением. Преподаватель духовых инструментов по классу саксофона.",
    email: "estrada@lokii.ru",
    phone: "+7 (474) 241-41-74"
  }
];

export const photos: Photo[] = [
  // 2025
  { id: "p1", title: "Отчётный концерт 2025", year: 2025, category: "концерты", src: "/foto/2025/concert-1.jpg" },
  { id: "p2", title: "Мастер-класс от Леонида Гурьева", year: 2025, category: "мастер-классы", src: "/foto/2025/masterclass-1.jpg" },
  { id: "p3", title: "Выпускной 2025", year: 2025, category: "выпускные", src: "/foto/2025/graduation.jpg" },
  // 2024
  { id: "p4", title: "Концерт в Москве", year: 2024, category: "концерты", src: "/foto/2024/moscow-concert.jpg" },
  { id: "p5", title: "Будни отделения", year: 2024, category: "будни", src: "/foto/2024/weekdays.jpg" },
  { id: "p6", title: "Мастер-класс по вокалу", year: 2024, category: "мастер-классы", src: "/foto/2024/vocal-master.jpg" },
  // 2023
  { id: "p7", title: "Отчётный концерт 2023", year: 2023, category: "концерты", src: "/foto/2023/concert.jpg" },
  { id: "p8", title: "Выпускной 2023", year: 2023, category: "выпускные", src: "/foto/2023/graduation.jpg" },
  // 2022
  { id: "p9", title: "Концерт к 8 марта", year: 2022, category: "концерты", src: "/foto/2022/march-concert.jpg" },
  { id: "p10", title: "Репетиция оркестра", year: 2022, category: "будни", src: "/foto/2022/rehearsal.jpg" },
  // 2021
  { id: "p11", title: "Онлайн-концерт", year: 2021, category: "концерты", src: "/foto/2021/online-concert.jpg" },
  { id: "p12", title: "Выпускной 2021", year: 2021, category: "выпускные", src: "/foto/2021/graduation.jpg" },
  // 2020
  { id: "p13", title: "Последний звонок", year: 2020, category: "другое", src: "/foto/2020/last-bell.jpg" },
  { id: "p14", title: "Концерт в филармонии", year: 2020, category: "концерты", src: "/foto/2020/philharmony.jpg" },
  // 1990-2019
  { id: "p15", title: "Архивное фото 2010", year: 2010, category: "другое", src: "/foto/archive/2010.jpg" },
  { id: "p16", title: "Архивное фото 2000", year: 2000, category: "другое", src: "/foto/archive/2000.jpg" },
  { id: "p17", title: "Архивное фото 1990", year: 1990, category: "другое", src: "/foto/archive/1990.jpg" }
];

export const videos: Video[] = [
  {
    id: "v0",
    title: "Видео с эстрадного отделения",
    description: "Видеозапись выступления студентов эстрадного отделения.",
    videoUrl: "https://rutube.ru/video/private/5ebdfc5c594d14d955a9548f7f09205d/?p=BKH7oE6fUOzlk7J4gZy_cg",
    thumbnail: "/video/thumbs/default.jpg",
    date: "2025-04-01",
    source: "rutube"
  },
  {
    id: "v1",
    title: "Отчётный концерт эстрадного отделения 2025",
    description: "Ежегодный отчётный концерт студентов эстрадного отделения ЛОКИ.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: "/video/thumbs/concert-2025.jpg",
    date: "2025-05-27",
    source: "rutube"
  },
  {
    id: "v2",
    title: "Мастер-класс Дениса Мельникова",
    description: "Занятие по саксофону от заведующего эстрадно-джазовым отделом Академии джаза.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: "/video/thumbs/melnikov-master.jpg",
    date: "2025-04-15",
    source: "rutube"
  },
  {
    id: "v3",
    title: "Выступление в Москве. Дни культуры Липецкой области",
    description: "Концерт «Земля Липецкая — Константину Игумнову» в ДМШ им. К.Н. Игумнова.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: "/video/thumbs/moscow-2025.jpg",
    date: "2025-10-20",
    source: "rutube"
  },
  {
    id: "v4",
    title: "Камертон регионов 2024",
    description: "Фестиваль учебных заведений культуры и искусств.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: "/video/thumbs/kamerton-2024.jpg",
    date: "2024-11-16",
    source: "rutube"
  },
  {
    id: "v5",
    title: "Интервью с выпускниками",
    description: "Встреча с успешными выпускниками эстрадного отделения.",
    videoUrl: "https://rutube.ru/video/xxxxx/",
    thumbnail: "/video/thumbs/interview.jpg",
    date: "2024-09-01",
    source: "rutube"
  }
];
