
// src/controllers/authController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByUsername } from '../services/authService';
import { compare } from 'bcrypt';
import path from 'path';
import { User } from '../models/userModel';

// POST: Signup Controller
export async function signup(req: FastifyRequest, reply: FastifyReply) {
  const { username, name, surname, password, confirmpassword } = req.body as { username: string; name: string; surname: string; password: string; confirmpassword: string };

  const result = await createUser(username, name, surname, password, confirmpassword);

  if(!result) return reply.code(401).send({ error: 'Invalid data' });

 // Reindirizza alla pagina di successo
 return reply
 .code(302)
 .header('Location', '/signup-success') // Specifica l'URL di reindirizzamento
 .send();}

export async function successPage(req: FastifyRequest, reply: FastifyReply) {
  // Restituisci il file HTML per la pagina di successo
  return reply.type('text/html').sendFile('successPage.html', path.join(__dirname, '../../frontend'));
}

// POST: Login Controller
export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { username, password } = req.body as { username: string; password: string };
  const user = await findUserByUsername(username); //Controllo se esiste l'utente
  if (!user) return reply.code(401).send({ error: 'Invalid username' });
  
  const isValid = await compare(password, user.password); // COntrolliamo la correttezza della pw
  if (!isValid) return reply.code(401).send({ error: 'Invalid password' });
  

  const payload = { id: user.id, username: user.username };
  const token = req.jwt.sign(payload);
  console.log(payload);
  console.log(token);

  // Ritorna il token come JSON, non come cookie
  return reply.status(200).send({ accessToken: token });
}

// Routes for Frontend (Get Forms)
export async function getSignupForm(req: FastifyRequest, reply: FastifyReply) {
  return reply.type('text/html').sendFile('signup.html', path.join(__dirname, '../../frontend'));
}

export async function getLoginForm(req: FastifyRequest, reply: FastifyReply) {
  return reply.type('text/html').sendFile('login.html', path.join(__dirname, '../../frontend'));
}
