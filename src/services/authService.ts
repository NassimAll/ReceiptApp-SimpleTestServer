// src/services/authService.ts
import bcrypt from 'bcrypt';
import { getDb } from '../dbInit';
import { User } from '../models/userModel'

export async function createUser(username: string, name: string, surname: string, password: string, confirmpw: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  let db = await getDb();

  const user = await findUserByUsername(username); //Controllo se esiste l'utente
  if (user) return null;

  if (confirmpw != password) return null;

  const result = await db.run(
    `INSERT INTO users (username, name, surname, password) VALUES (?, ?, ?, ?)`,
    [username, name, surname, hashedPassword]
  );
  return { id: result.lastID, username };
}

export async function findUserByUsername(username: string) {
  let db = await getDb();
  return db.get<User>(`SELECT * FROM users WHERE username = ?`, [username]);
}
