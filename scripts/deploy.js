// scripts/deploy.js

import * as ftp from "basic-ftp";
import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env файла
config();

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_PATH } = process.env;

// Конфигурация для FTP-соединения
const config_ftp = {
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    port: 21, // Убедимся, что порт явно указан
    secure: false // Использовать 'implicit' для FTPS, если хостинг поддерживает
};

const localPath = resolve(process.cwd(), './dist'); // Используем process.cwd() для корректного разрешения пути
const remotePath = FTP_REMOTE_PATH;

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Включаем подробный лог для отладки

    try {
        console.log(`🔌 Подключение к ${config_ftp.host}...`);
        await client.access(config_ftp);
        
        console.log(`📂 Переход в директорию: ${remotePath}`);
        await client.ensureDir(remotePath); // Убедимся, что директория существует или создаем её

        console.log(`🔥 Очистка удаленной директории...`);
        // Basic-ftp's clearWorkingDir() clears the currently set working directory.
        // We've already ensured we are in `remotePath`.
        // To be absolutely safe, we can list and remove files/dirs.
        // For now, assuming clearWorkingDir() is safe within remotePath context.
        await client.clearWorkingDir();

        console.log(`🚀 Загрузка файлов из ${localPath}...`);
        await client.uploadFromDir(localPath);
        
        console.log("✅ Развертывание успешно завершено!");

    } catch (err) {
        console.error("❌ Ошибка во время развертывания:", err);
        process.exit(1); // Выход с кодом ошибки
    } finally {
        if (client.closed === false) {
            console.log("👋 Закрытие соединения.");
            client.close();
        }
    }
}

// Проверка наличия всех необходимых переменных окружения
if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_REMOTE_PATH) {
    console.error("❌ Ошибка: Не все переменные окружения для FTP определены в файле .env");
    console.error("Убедитесь, что файл .env содержит FTP_HOST, FTP_USER, FTP_PASSWORD и FTP_REMOTE_PATH.");
    process.exit(1);
} else {
    deploy();
}
