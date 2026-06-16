import type { Graduate } from "../../types/college";
import { asset } from "../../utils/asset";

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
