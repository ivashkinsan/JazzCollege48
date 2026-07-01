import type { NavigationEntry } from "../../types/college";

export const navigation: NavigationEntry[] = [
  { id: "about", label: "О нас", href: "#about" },
  {
    id: "department",
    label: "Отделение",
    items: [
      { id: "specialties", label: "Специальности", href: "#specialties" },
      { id: "teachers", label: "Преподаватели", href: "#teachers" },
      { id: "orchestra", label: "Оркестр", href: "/department" },
      { id: "graduates", label: "Выпускники", href: "/graduates" },
      { id: "admin", label: "Администрация", href: "/admin" },
      { id: "dai", label: "ДАИ", href: "/dai" },
    ],
  },
  { id: "afisha", label: "Афиша", href: "/afisha" },
  { id: "news", label: "Новости", href: "/news" },
  {
    id: "media",
    label: "Медиа",
    items: [
      { id: "photos", label: "Фото", href: "/photos" },
      { id: "videos", label: "Видео", href: "/videos" },
      { id: "library", label: "Библиотека", href: "/library" },
    ],
  },
  { id: "contacts", label: "Контакты", href: "#contacts" },
];
