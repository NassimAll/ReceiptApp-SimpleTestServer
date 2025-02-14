import { FastifyInstance } from 'fastify';
import { signup, login, getLoginForm, getSignupForm } from '../controllers/authController';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', signup);
  fastify.post('/login', login);
  fastify.get('/signup', getSignupForm);
  fastify.get('/login', getLoginForm);
}
