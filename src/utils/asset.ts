// ===== ХЕЛПЕР ДЛЯ ПУТЕЙ =====
// Добавляем BASE_URL для корректной работы на GitHub Pages
const base = import.meta.env.BASE_URL;

export function asset(path: string): string {
  // Если путь уже начинается с http/https или data: — возвращаем как есть
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Убираем ведущий слэш и добавляем base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return base + cleanPath;
}
