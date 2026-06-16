import type { NavigationEntry } from "../../types/college";

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
