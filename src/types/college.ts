export interface Teacher {
  id: string;
  name: string;
  position: string;
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
  content?: string;
  category?: string;
  cover?: Photo;
  gallery?: Photo[];
}

export interface Specialty {
  code: string;
  name: string;
  profiles: {
    name: string;
    disciplines: string[];
  }[];
  description: string;
  qualification?: string;
  studyDuration?: string;
  studyForm?: string;
}

export interface Instrument {
  name: string;
  image: string;
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

export interface NavigationDropdown {
  id: string;
  label: string;
  items: NavigationItem[];
}

export type NavigationEntry = NavigationItem | NavigationDropdown;

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
  src: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface PhotoAlbum {
  albumId: string;
  albumTitle: string;
  albumDate: string;
  albumCategory: 'концерты' | 'мастер-классы' | 'будни' | 'выпускные' | 'другое';
  photos: Photo[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  date: string;
  source: 'rutube' | 'youtube' | 'vk' | 'yandex';
}

export interface DaiProgram {
  id: string;
  name: string;
  description: string;
  age: string;
  duration: string;
  image?: string;
}

// Расширенный интерфейс новости для динамической загрузки
export interface ExtendedNewsItem extends NewsItem {
  content?: string;
  category?: string;
  cover?: Photo;
  gallery?: Photo[];
}

// Расширенный интерфейс афиши для динамической загрузки
export interface AfishaItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  cover?: Photo;
  content: string;
  gallery?: Photo[];
  tags?: string[];
}
