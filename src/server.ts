import Fastify from 'fastify';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { initDatabase } from './dbInit';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fastifyMultipart from '@fastify/multipart';


import { JWT } from '@fastify/jwt'
import cors from '@fastify/cors';
import apiRoutes from './routes/apiRoutes';
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }


}


// Load environment variables
dotenv.config();

const fastify = Fastify({ logger: true });

// Register JWT plugin
fastify.register(fjwt, { secret: process.env.JWT_SECRET || 'default_secret' });

const fastifyFormbody = require('@fastify/formbody'); // Usa la versione aggiornata

// Registra il plugin
fastify.register(fastifyFormbody);
fastify.register(fastifyMultipart);


// Servire i file statici dalla cartella "public"
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../frontend'),
  prefix: '/frontend/',
});

// 🔥 Abilita CORS per permettere richieste dal client Ionic
fastify.register(cors, {
  origin: '*', // ❗ Permette richieste da tutti i domini (puoi specificare l'origine)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metodi HTTP consentiti
  allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti
  credentials: true // Se servono i cookie
});



fastify.addHook('preHandler', (req, res, next) => {
  // here we are
  req.jwt = fastify.jwt
  return next()
});

fastify.register(fCookie, {
  secret: 'some-secret-key',
  hook: 'preHandler',
});


// Initialize Database and decorate fastify
(async () => {
  const db = await initDatabase();
  //fastify.decorate('db', db);

  // Register routes
  fastify.register(authRoutes);
  fastify.register(apiRoutes);


  // Start server
  const PORT = process.env.PORT || 3000;
  fastify.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
  });
})();

fastify.get('/', async (request, reply) => {
  return reply.type('text/html').sendFile('index.html', path.join(__dirname, '../frontend'));
});
