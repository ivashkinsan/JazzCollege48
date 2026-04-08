import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const AFISHA_SRC = path.join(ROOT_DIR, 'src', 'afisha');
const IMAGES_DST = path.join(ROOT_DIR, 'public', 'afisha', 'images');
const SORT_DIR = path.join(ROOT_DIR, 'public', 'new_for_sort');

// Транслитерация
const translitMap = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

function transliterate(text) {
  let result = '';
  for (const char of text) {
    result += translitMap[char] !== undefined ? translitMap[char] : char;
  }
  return result;
}

function createSlug(text) {
  let slug = transliterate(text);
  slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '');
  slug = slug.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return slug.toLowerCase().slice(0, 60);
}

function parseDate(text) {
  // Ищем паттерны: 31 марта, 22 апреля, 6 марта
  const months = {
    'январ': '01', 'феврал': '02', 'март': '03', 'апрел': '04', 'ма': '05',
    'июн': '06', 'июл': '07', 'август': '08', 'сентябр': '09', 'октябр': '10', 'ноябр': '11', 'декабр': '12'
  };

  for (const [monthRu, monthNum] of Object.entries(months)) {
    const regex = new RegExp(`(\\d{1,2})\\s+(${monthRu}[а-я]*)`, 'i');
    const match = text.match(regex);
    if (match) {
      const day = match[1].padStart(2, '0');
      // Определяем год: если месяц > текущего, то текущий, иначе следующий
      const currentMonth = new Date().getMonth() + 1;
      const year = parseInt(monthNum) >= currentMonth
        ? new Date().getFullYear()
        : new Date().getFullYear() + 1;
      return `${year}-${monthNum}-${day}`;
    }
  }
  return null;
}

function parseTime(text) {
  // Ищем: 🕖 19:01, 19:00, в 18:00
  const match = text.match(/(?:🕖\s*)?(\d{1,2}:\d{2})/);
  return match ? match[1] : null;
}

function parseVenue(text) {
  // Ищем: 📍 Библиотека, ...
  const match = text.match(/📍\s*(.+?)(?:\n|$)/);
  return match ? match[1].trim() : null;
}

function parseBody(text) {
  // Удаляем строки с датой, временем, местом, эмодзи
  return text
    .replace(/📅\s*.+/g, '')
    .replace(/🕖\s*.+/g, '')
    .replace(/📍\s*.+/g, '')
    .replace(/⏰.+/g, '')
    .trim();
}

async function processAfisha() {
  if (!fs.existsSync(SORT_DIR)) {
    console.log('❌ Папка new_for_sort не найдена!');
    return;
  }

  const files = fs.readdirSync(SORT_DIR);
  const txtFiles = files.filter(f => f.endsWith('.txt'));

  if (txtFiles.length === 0) {
    console.log('📭 Нет файлов для обработки.');
    return;
  }

  console.log(`📦 Найдено афиш для обработки: ${txtFiles.length}\n`);

  for (const txtFile of txtFiles) {
    const baseName = txtFile.replace('.txt', '');
    const content = fs.readFileSync(path.join(SORT_DIR, txtFile), 'utf-8');

    const title = content.split('\n')[0].trim().replace(/^[🎷🎶🎵🎸🎺🎹🪘]+/, '').trim();
    const date = parseDate(content) || new Date().toISOString().split('T')[0];
    const time = parseTime(content);
    const venue = parseVenue(content);
    const body = parseBody(content);
    const slug = createSlug(title);
    const year = date.split('-')[0];

    // Поиск изображений
    const imageExt = ['jpg', 'jpeg', 'png', 'webp'];
    const images = files.filter(f => {
      const nameWithoutExt = f.replace(/\.[^/.]+$/, '');
      return nameWithoutExt.startsWith(baseName) && imageExt.includes(f.split('.').pop().toLowerCase());
    });

    console.log(`📰 ${txtFile}`);
    console.log(`   Заголовок: ${title}`);
    console.log(`   Дата: ${date}, Время: ${time || '—'}, Место: ${venue || '—'}`);
    console.log(`   Фото: ${images.length}`);

    // Создаём папку для изображений
    const newsImageDir = path.join(IMAGES_DST, year, `${date}-${slug}`);
    fs.mkdirSync(newsImageDir, { recursive: true });

    // Копируем изображения
    images.forEach((img, index) => {
      const newName = index === 0 ? 'cover.jpg' : `gallery-${index}.jpg`;
      fs.copyFileSync(path.join(SORT_DIR, img), path.join(newsImageDir, newName));
      console.log(`   📷 ${img} → ${newName}`);
    });

    // Создаём markdown файл
    fs.mkdirSync(AFISHA_SRC, { recursive: true });

    const coverPath = images.length > 0
      ? `/afisha/images/${year}/${date}-${slug}/cover.jpg`
      : '';

    const galleryPaths = images.slice(1).map((_, idx) =>
      `/afisha/images/${year}/${date}-${slug}/gallery-${idx + 1}.jpg`
    );

    const mdContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
time: ${time || ''}
venue: ${venue || ''}
cover: ${coverPath}
tags: []
---

${body}

${galleryPaths.length > 0 ? `<!-- gallery -->\n${galleryPaths.map(p => `- ${p}`).join('\n')}` : ''}
`;

    const mdPath = path.join(AFISHA_SRC, `${date}-${slug}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');

    // Удаляем обработанные файлы
    fs.unlinkSync(path.join(SORT_DIR, txtFile));
    images.forEach(img => fs.unlinkSync(path.join(SORT_DIR, img)));

    console.log(`   ✅ Создан: src/afisha/${date}-${slug}.md\n`);
  }

  console.log('✨ Все афиши обработаны!');
}

processAfisha().catch(console.error);
