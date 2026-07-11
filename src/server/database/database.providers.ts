
import Database from 'better-sqlite3';
import path from 'path';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Database.Database => {
      const dbPath = path.resolve(process.cwd(), 'src/data/database.db');
      const db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      return db;
    },
  },
];
