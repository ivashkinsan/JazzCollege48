import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const NEWS_SRC = path.join(ROOT_DIR, 'src', 'news');
const IMAGES_SRC = path.join(ROOT_DIR, 'public', 'news');
const IMAGES_DST = path.join(ROOT_DIR, 'public', 'news', 'images');

// Функция для создания slug из текста
function createSlug(text, dateStr) {
  // Берём первые 50 символов первой строки
  const firstLine = text.split('\n')[0].trim().slice(0, 50);
  
  // Транслитерация
  const translit = {
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
  
  let result = '';
  for (const char of firstLine) {
    if (translit[char] !== undefined) {
      result += translit[char];
    } else if (/[a-zA-Z0-9\s-]/.test(char)) {
      result += char;
    }
  }
  
  // Заменяем пробелы на дефисы, убираем множественные дефисы
  result = result.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  
  // Добавляем дату для уникальности
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}-${result.toLowerCase()}`.slice(0, 80);
}

// Определение категории по содержимому
function detectCategory(text, filename, hasImages) {
  const lower = text.toLowerCase();
  
  if (lower.includes('мастер-класс') || lower.includes('мастер класс')) {
    return 'masterclass';
  }
  if (lower.includes('конкурс') || lower.includes('фестиваль') || lower.includes('лауреат')) {
    return 'konkurs';
  }
  if (lower.includes('концерт') || hasImages) {
    return 'konzert';
  }
  return 'announcement';
}

// Парсинг даты из имени файла
function parseDateFromFilename(filename) {
  const match = filename.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return {
      day,
      month,
      year,
      formatted: `${year}-${month}-${day}`,
      dateObj: new Date(`${year}-${month}-${day}`)
    };
  }
  return null;
}

// Поиск изображений для новости
function findImagesForDate(dateStr) {
  const images = [];
  const [day, month, year] = dateStr.split('-');
  
  // Ищем в konkursi и konzerts
  const searchDirs = [
    path.join(IMAGES_SRC, 'konkursi'),
    path.join(IMAGES_SRC, 'konzerts')
  ];
  
  for (const searchDir of searchDirs) {
    if (!fs.existsSync(searchDir)) continue;
    
    const files = fs.readdirSync(searchDir);
    const matchingFiles = files.filter(f => f.startsWith(`${day}-${month}-${year}`));
    
    for (const file of matchingFiles) {
      images.push({
        src: path.join(searchDir, file),
        filename: file,
        isCover: file.includes('image_1') || file.includes('cover')
      });
    }
  }
  
  return images;
}

// Главная функция миграции
function migrate() {
  console.log('🚀 Начинаю миграцию новостей...\n');
  
  // Создаём директорию для изображений
  if (!fs.existsSync(IMAGES_DST)) {
    fs.mkdirSync(IMAGES_DST, { recursive: true });
  }
  
  const newsFiles = fs.readdirSync(NEWS_SRC).filter(f => f.endsWith('.txt'));
  const migrated = [];
  
  for (const file of newsFiles) {
    const dateInfo = parseDateFromFilename(file);
    if (!dateInfo) {
      console.warn(`⚠️  Пропущен файл ${file} — не удалось распознать дату`);
      continue;
    }
    
    const content = fs.readFileSync(path.join(NEWS_SRC, file), 'utf-8');
    const title = content.split('\n')[0].trim().slice(0, 120) || `Новость от ${dateInfo.formatted}`;
    const slug = createSlug(content, file.replace('.txt', ''));
    const images = findImagesForDate(`${dateInfo.day}-${dateInfo.month}-${dateInfo.year}`);
    const category = detectCategory(content, file, images.length > 0);
    
    // Создаём директорию для изображений новости
    const newsImageDir = path.join(IMAGES_DST, dateInfo.year, slug);
    if (images.length > 0) {
      fs.mkdirSync(newsImageDir, { recursive: true });
      
      // Копируем изображения
      images.forEach((img, index) => {
        const newName = index === 0 && img.isCover ? 'cover.jpg' : `gallery-${index}.jpg`;
        const dstPath = path.join(newsImageDir, newName);
        fs.copyFileSync(img.src, dstPath);
        img.newPath = `/news/images/${dateInfo.year}/${slug}/${newName}`;
      });
    }
    
    // Создаём markdown файл
    const yearDir = path.join(NEWS_SRC, dateInfo.year);
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }
    
    const coverPath = images.find(i => i.isCover)?.newPath || '';
    const galleryPaths = images.filter(i => !i.isCover || !images.some(j => j.isCover)).map(i => i.newPath);
    
    const mdContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${dateInfo.formatted}
category: ${category}
cover: ${coverPath}
tags: []
---

${content}

${galleryPaths.length > 0 ? `<!-- gallery -->\n${galleryPaths.map(p => `- ${p}`).join('\n')}` : ''}
`;
    
    const mdPath = path.join(yearDir, `${slug}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    
    migrated.push({
      original: file,
      slug,
      date: dateInfo.formatted,
      category,
      images: images.length
    });
    
    console.log(`✅ ${file} → ${dateInfo.year}/${slug}.md (${category}, ${images.length} фото)`);
  }
  
  console.log(`\n📊 Мигрировано: ${migrated.length} новостей`);
  console.log('\n📋 Следующие файлы готовы к удалению:');
  console.log('   - src/news/*.txt');
  console.log('   - public/news/konkursi/');
  console.log('   - public/news/konzerts/');
  
  return migrated;
}

// Запуск
const result = migrate();
console.log('\n✨ Миграция завершена!');
