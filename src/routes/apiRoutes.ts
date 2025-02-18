import { FastifyInstance } from 'fastify';
import { getUserProfile } from '../controllers/apiController';
import { verifyToken } from '../services/authService';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/user/profile', { preHandler: [verifyToken] }, getUserProfile);
}
