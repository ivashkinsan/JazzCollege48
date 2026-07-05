import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Starting database category cleanup...');

const afishaTitles = [
    "Джазовый джем-сейшн в Библиотеке",
    "6 марта в 14.00 нас ждет настоящий праздник, посвященный весне, женщине и, конечно, любви",
    "JAZZ-вечеринка в Доме музыки",
    "Джазовые портреты. Советский и российский джаз",
    "Фестиваль «JAZZ-48» — молодежные коллективы России в Липецке"
];

const newsTitles = [
    "12 марта завершился наш джазовый марафон! Концерт «Весна в ритмах джаза» по Пушкинской карте",
    "11, 12 марта приглашаем на концерт «Весна в ритмах джаза…» тех, кто не смог 6-го марта",
    "🎶 Весна пришла в ритме джаза! 🎶",
    "Глоток свежего 'Джаза в полдень'",
    "В колледже искусств состоялся мастер-класс Ивана Чаги, победителя XX Международного конкурса",
    "21 ноября студенты специальности Музыкальное искусство эстрады выступили в колледже индустрии сервиса",
    "Мастер-класс выпускницы Ростовской консерватории Екатерины Мериновой по джазовой импровизации",
    "концертной программы в честь Областного слёта ветеранов войны и труда Серебряный волонтёр",
    "Валерия Баранова — участница Российской студенческой весны в Ставрополе",
    "Мастер-класс студентов РГК им. Рахманинова",
    "ДЖАЗ КОНZЕРТ",
    "Поздравляем победителей" // Based on previous analysis
];


const updateStmt = db.prepare('UPDATE content SET category = ? WHERE title = ?');

let updatedCount = 0;

db.transaction(() => {
    for (const title of afishaTitles) {
        const info = updateStmt.run('afisha', title);
        if (info.changes > 0) {
            console.log(`  -> Set category 'afisha' for "${title}"`);
            updatedCount++;
        }
    }
    for (const title of newsTitles) {
        const info = updateStmt.run('news', title);
        if (info.changes > 0) {
            console.log(`  -> Set category 'news' for "${title}"`);
            updatedCount++;
        }
    }
})();

db.close();
console.log(`🎉 Cleanup complete. Updated ${updatedCount} entries.`);
