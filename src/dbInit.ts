import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null; // Variabile per l'istanza del db

export async function initDatabase() {
  const db = await open({
    filename: './receiptAppDB.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS receipt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image BLOB NOT NULL, -- O TEXT se salvi il percorso del file
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT, -- Campo opzionale per il testo estratto dall'AI
    FOREIGN KEY (user_id) REFERENCES users(id) -- Chiave esterna a users
  );
  `);

  console.log('Database initialized with users table.');

  dbInstance = db;

  return db;
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('Database non inizializzato!');
  }
  return dbInstance;
}
