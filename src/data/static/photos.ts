import type { Photo } from "../../types/college";
import { asset } from "../../utils/asset";

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
