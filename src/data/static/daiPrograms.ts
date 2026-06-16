import type { DaiProgram } from "../../types/college";
import { asset } from "../../utils/asset";

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
