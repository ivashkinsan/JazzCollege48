export interface LibraryLink {
  title: string;
  url: string;
  description: string;
}

export interface LibraryCategory {
  categoryTitle: string;
  links: LibraryLink[];
}

export const libraryCategories: LibraryCategory[] = [
  {
    categoryTitle: "Видео-уроки и каналы",
    links: [
      {
        title: "Jazz.Ru (Видео)",
        url: "https://www.jazz.ru/",
        description: "Видеораздел ведущего российского джазового портала.",
      },
    ],
  },
  {
    categoryTitle: "Ноты, аккорды и теория",
    links: [
      // Из предоставленного списка российских ссылок для этой категории не найдено.
      // Если у вас есть конкретные ссылки, пришлите их, и я добавлю.
    ],
  },
  {
    categoryTitle: "Музыканты и оркестры",
    links: [
      {
        title: "Музыканты на Jazz.Ru",
        url: "https://www.jazz.ru/pages/",
        description: "Биографии и дискографии музыкантов России и экс-СССР.",
      },
      {
        title: "Московский джазовый оркестр Игоря Бутмана",
        url: "http://www.mosgorjazz.ru//",
        description: "Официальный сайт оркестра.",
      },
      {
        title: "Оркестр Олега Лундстрема (на Jazz.ru)",
        url: "https://www.jazz.ru/pages/lundstrom.htm",
        description: "История и информация об оркестре на портале Jazz.Ru.",
      },
      {
        title: "Оркестр Ильи Филиппова (VK)",
        url: "https://vk.com/filippovsorchestra",
        description: "Официальная страница Оркестра Ильи Филиппова ВКонтакте.",
      },
      {
        title: "Фонограф Джаз-Бэнд (VK)",
        url: "https://vk.com/fonograf_jazz",
        description: "Официальная страница джаз-бэнда 'Фонограф' Сергея Жилина ВКонтакте."
      },
      {
        title: "Фонограф Джаз-Бэнд (официальный сайт)",
        url: "https://fonograf.net/",
        description: "Официальный сайт джаз-бэнда 'Фонограф' Сергея Жилина."
      },
      {
        title: "Денис Мельников (официальный сайт)",
        url: "https://melnikov-jazz.ru/",
        description: "Официальный сайт российского джазового музыканта Дениса Мельникова."
      },
      {
        title: "Большой Джазовый Оркестр (VK)",
        url: "https://vk.com/bolshoi_jazz_orchestra",
        description: "Официальная страница Большого Джазового Оркестра (БДО) Петра Востокова ВКонтакте."
      },
    ],
  },
  {
    categoryTitle: "Школы и фестивали",
    links: [
      {
        title: "Детская джазовая школа им. Кима Назаретова",
        url: "https://rostovjazzschool.ru/",
        description: "Ростов-на-Дону.",
      },
      {
        title: "Академия джаза Игоря Бутмана",
        url: "https://jazzacademy.ru/",
        description: "Москва.",
      },
      {
        title: "J&M School (Школа Джаза и Мюзикла)",
        url: "https://jm-school.ru/",
        description: "Санкт-Петербург.",
      },
      {
        title: "Московский джазовый фестиваль",
        url: "https://moscowjazzfest.com/",
        description: "Официальный сайт Moscow Jazz Festival.",
      },
      {
        title: "Триумф Джаза",
        url: "https://jazztriumph.ru/",
        description: "Международный фестиваль Игоря Бутмана.",
      },
      {
        title: "Джаз Мэй (Пенза)",
        url: "https://jazzmay.com/",
        description: "Международный фестиваль Jazz May Penza.",
      },
      {
        title: "Ростовский джазовый фестиваль",
        url: "https://rostovjazzfestival.ru/",
        description: "Официальный сайт фестиваля.",
      },
      {
        title: "Джаз-фест (Официальный сайт)",
        url: "https://jazz-fest.ru/",
        description: "Официальный сайт международного джазового фестиваля."
      },
    ],
  },
  {
    categoryTitle: "Порталы и журналы",
    links: [
      {
        title: "Портал и журнал «Джаз.Ру»",
        url: "https://www.jazz.ru/",
        description:
          "Главный ресурс о джазе в России: новости, статьи, обзоры, интервью.",
      },
      {
        title: "Jazzmap.ru",
        url: "https://www.jazzmap.ru/festivals/",
        description:
          "Интерактивная карта джазовых событий и фестивалей в России.",
      },
    ],
  },
  {
    categoryTitle: "Подкасты",
    links: [
      {
        title: "Джаз.Ру (Подкасты)",
        url: "https://www.jazz.ru/podcast/",
        description: "Коллекция джазовых подкастов от портала Jazz.Ru."
      }
    ]
  }
];
