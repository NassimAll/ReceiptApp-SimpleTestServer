
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

  return reply.code(201).send(result);
}

// POST: Login Controller
export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { username, password } = req.body as { username: string; password: string };
  const user = await findUserByUsername(username); //Controllo se esiste l'utente
  if (!user) return reply.code(401).send({ error: 'Invalid username' });
  
  const isValid = await compare(password, user.password); // COntrolliamo la correttezza della pw
  if (!isValid) return reply.code(401).send({ error: 'Invalid password' });
  
  // const payload = {
  //   id: user.id,
  //   username: user.username
  // };

  // const token = req.jwt.sign(payload);

  // reply.setCookie('access_token', token, {
  //   path: '/',
  //   httpOnly: true,
  //   secure: true,
  // })

  // return { accessToken: token };

  const payload = { id: user.id, username: user.username };
  const token = req.jwt.sign(payload);

  // Redirect all'app con il token JWT
  //return reply.redirect(`receiptapp://tabs/tab1?token=${token}`);
  reply.redirect(`http://localhost:8100/tabs/tab3?token=${token}`);

  // Ritorna il token come JSON, non come cookie
  //return reply.send({ accessToken: token });
}

// Routes for Frontend (Get Forms)
export async function getSignupForm(req: FastifyRequest, reply: FastifyReply) {
  return reply.type('text/html').sendFile('signup.html', path.join(__dirname, '../../frontend'));
}

export async function getLoginForm(req: FastifyRequest, reply: FastifyReply) {
  return reply.type('text/html').sendFile('login.html', path.join(__dirname, '../../frontend'));
}
