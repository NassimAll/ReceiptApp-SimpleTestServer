// src/services/authService.ts
import bcrypt from 'bcrypt';
import { getDb } from '../dbInit';
import { User } from '../models/userModel'
import { FastifyReply, FastifyRequest } from 'fastify';

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

export async function getUserById(id: any) {
  let db = await getDb();
  return db.get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
}


export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.code(401).send({ error: 'No token provided' });
    }

    const decoded = req.jwt.verify(token);
    req.user = decoded;

  } catch (err) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
}

