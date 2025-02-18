// src/controllers/authController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { findUserByUsername, getUserById } from '../services/authService';
import path from 'path';
import { User } from '../models/userModel';

// GET: Get userProfile Controllerù
export async function getUserProfile(req: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = typeof req.user === 'object' && 'id' in req.user ? req.user.id : null;
        if (!userId) {
          return reply.code(400).send({ error: 'Invalid user data' });
        }
        const user = await getUserById(userId);
        if (!user) {
          return reply.code(404).send({ error: 'User not found' });
        }
        reply.send({ username: user.username, name: user.name, surname: user.surname });
    } catch (error) {
        reply.code(500).send({ error: 'Failed to fetch user profile' });
      }
}
