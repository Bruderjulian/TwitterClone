import Database from 'better-sqlite3';
import config from './config';

const db = new Database(config.db_path);

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    timestamp INTEGER
  )
`).run();

export default db;