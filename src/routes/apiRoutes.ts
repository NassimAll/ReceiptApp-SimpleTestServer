import { FastifyInstance, fastify } from 'fastify';
import { getReceipt, getUserProfile, uploadReceipt } from '../controllers/apiController';
import { verifyToken } from '../services/authService';
import multer from 'fastify-multer';

const upload = multer({ dest: 'uploads/' }); // Salva le immagini in `uploads/`

export default async function apiRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/user/profile', { preHandler: [verifyToken] }, getUserProfile);
  fastify.get('/api/v1/receipts', { preHandler: [verifyToken] }, getReceipt);
  //fastify.post('/api/v1/receipt/upload', { preValidation: [verifyToken], preHandler: upload.single('receipt') }, uploadReceipt);
  fastify.post('/api/v1/receipt/upload', { preHandler: [verifyToken, upload.single('receipt')]}, uploadReceipt);

}
