import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null; // Variabile per l'istanza del db

export async function initDatabase() {
  const db = await open({
    filename: './receiptScanAppDB.db',
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
    restaurantName  TEXT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    address  TEXT NOT NULL,
    totalSpent REAL NOT NULL,
    receiptDate DATETIME NOT NULL,
    imagePath  TEXT NOT NULL,
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
