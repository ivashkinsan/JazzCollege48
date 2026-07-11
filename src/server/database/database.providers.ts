
import Database from 'better-sqlite3';
import path from 'path';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Database.Database => {
      const dbFileName = process.env.NODE_ENV === 'test' ? 'test.database.db' : 'database.db';
      const dbPath = path.resolve(process.cwd(), `src/data/${dbFileName}`);
      const db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      return db;
    },
  },
];
