import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const STAGING_ROOT = path.join(__dirname, "../staging");

export function createSlug(text: string): string {
    const a: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return text.toLowerCase().split('').map(char => a[char] || char).join('')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export function stripPublicPrefix(imgPath: string | undefined): string | null {
    if (!imgPath) return null;
    if (imgPath.startsWith('/public/')) {
        return imgPath.substring('/public'.length);
    }
    if (imgPath === '/public') return '/';
    return imgPath;
}

export const upload = multer({
    storage: multer.diskStorage({
        destination: STAGING_ROOT,
        filename: (req, file, cb) =>
            cb(null, Buffer.from(file.originalname, "latin1").toString("utf8")),
    }),
});
