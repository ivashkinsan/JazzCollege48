import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const NEWS_SRC = path.join(ROOT_DIR, 'src', 'news');
const IMAGES_DST = path.join(ROOT_DIR, 'public', 'news', 'images');
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

function detectCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('мастер-класс') || lower.includes('мастер класс')) return 'masterclass';
  if (lower.includes('конкурс') || lower.includes('фестиваль') || lower.includes('лауреат') || lower.includes('гран-при')) return 'konkurs';
  if (lower.includes('концерт')) return 'konzert';
  return 'announcement';
}

function askQuestion(question, defaultAnswer) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question(`${question} (${defaultAnswer}): `, (answer) => {
      readline.close();
      resolve(answer || defaultAnswer);
    });
  });
}

async function processNews() {
  if (!fs.existsSync(SORT_DIR)) {
    console.log('❌ Папка new_for_sort не найдена!');
    return;
  }

  const files = fs.readdirSync(SORT_DIR);
  const txtFiles = files.filter(f => f.endsWith('.txt'));
  
  if (txtFiles.length === 0) {
    console.log('📭 Нет файлов для обработки. Положи .txt и .jpg в public/new_for_sort/');
    return;
  }

  console.log(`📦 Найдено новостей для обработки: ${txtFiles.length}\n`);

  for (const txtFile of txtFiles) {
    const baseName = txtFile.replace('.txt', '');
    const content = fs.readFileSync(path.join(SORT_DIR, txtFile), 'utf-8');
    
    // Парсинг: первая строка = заголовок, остальное = текст
    const lines = content.split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    
    // Поиск изображений
    const imageExt = ['jpg', 'jpeg', 'png', 'webp'];
    const images = files.filter(f => {
      const nameWithoutExt = f.replace(/\.[^/.]+$/, '');
      return nameWithoutExt.startsWith(baseName) && imageExt.includes(f.split('.').pop().toLowerCase());
    });
    
    // Сортировка изображений по номеру
    images.sort((a, b) => {
      const numA = parseInt(a.match(/_(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/_(\d+)/)?.[1] || '0');
      return numA - numB;
    });
    
    console.log(`📰 ${txtFile}`);
    console.log(`   Заголовок: ${title}`);
    console.log(`   Фото: ${images.length}`);
    
    // Запрос даты и категории
    const today = new Date().toISOString().split('T')[0];
    const date = today; // По умолчанию сегодня, можно изменить
    const category = detectCategory(content);
    const slug = createSlug(title);
    const year = date.split('-')[0];
    
    // Создаём папку для изображений
    const newsImageDir = path.join(IMAGES_DST, year, `${date}-${slug}`);
    fs.mkdirSync(newsImageDir, { recursive: true });
    
    // Копируем изображения
    images.forEach((img, index) => {
      const newName = index === 0 ? 'cover.jpg' : `gallery-${index}.jpg`;
      const srcPath = path.join(SORT_DIR, img);
      const dstPath = path.join(newsImageDir, newName);
      fs.copyFileSync(srcPath, dstPath);
      console.log(`   📷 ${img} → ${newName}`);
    });
    
    // Создаём markdown файл
    const yearDir = path.join(NEWS_SRC, year);
    fs.mkdirSync(yearDir, { recursive: true });
    
    const coverPath = images.length > 0 ? `/news/images/${year}/${date}-${slug}/cover.jpg` : '';
    const galleryPaths = images.slice(1).map((_, idx) => 
      `/news/images/${year}/${date}-${slug}/gallery-${idx + 1}.jpg`
    );
    
    const mdContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
category: ${category}
cover: ${coverPath}
tags: []
---

${body}

${galleryPaths.length > 0 ? `<!-- gallery -->\n${galleryPaths.map(p => `- ${p}`).join('\n')}` : ''}
`;
    
    const mdPath = path.join(yearDir, `${date}-${slug}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    
    // Удаляем обработанные файлы
    fs.unlinkSync(path.join(SORT_DIR, txtFile));
    images.forEach(img => fs.unlinkSync(path.join(SORT_DIR, img)));
    
    console.log(`   ✅ Создан: src/news/${year}/${date}-${slug}.md\n`);
  }
  
  console.log('✨ Все новости обработаны!');
  console.log('📋 Не забудь проверить дату и заголовок в созданных файлах');
}

processNews().catch(console.error);
