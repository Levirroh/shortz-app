import initSqlJs, { type Database } from 'sql.js';

type SqlParam = string | number | null | Uint8Array;
type SqlParams = SqlParam[];

export type ShortzDatabase = {
  raw: Database;
  run: (sql: string, params?: SqlParams) => void;
  get: <T = any>(sql: string, params?: SqlParams) => T | undefined;
  all: <T = any>(sql: string, params?: SqlParams) => T[];
  close: () => void;
};

export async function createDatabase(): Promise<ShortzDatabase> {
  const SQL = await initSqlJs();
  const raw = new SQL.Database();

  raw.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      video_id INTEGER NOT NULL,
      UNIQUE(user_id, video_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (video_id) REFERENCES videos(id)
    );
  `);

  return {
    raw,

    run(sql, params: SqlParams = []) {
      try {
        const stmt = raw.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
      } catch (err: any) {
        if (String(err.message).includes('UNIQUE constraint failed')) {
          err.code = 'SQLITE_CONSTRAINT_UNIQUE';
        }

        throw err;
      }
    },

    get<T = any>(sql: string, params: SqlParams = []) {
      const stmt = raw.prepare(sql);
      stmt.bind(params);

      const result = stmt.step() ? (stmt.getAsObject() as T) : undefined;

      stmt.free();
      return result;
    },

    all<T = any>(sql: string, params: SqlParams = []) {
      const stmt = raw.prepare(sql);
      stmt.bind(params);

      const results: T[] = [];

      while (stmt.step()) {
        results.push(stmt.getAsObject() as T);
      }

      stmt.free();
      return results;
    },

    close() {
      raw.close();
    },
  };
}