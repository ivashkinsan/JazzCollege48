import type { Video } from "../../types/college";
import { asset } from "../../utils/asset";

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
