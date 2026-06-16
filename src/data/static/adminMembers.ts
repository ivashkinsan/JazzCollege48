import type { AdminMember } from "../../types/college";
import { asset } from "../../utils/asset";

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
    image: asset("/foto_admin/Kokshin.jpg"),
    bio: "Руководит эстрадным отделением. Преподаватель по классу саксофона.",
    email: "kolledgisskusstv@yandex.ru",
    phone: "+7 (474) 241-41-74",
  },
];
