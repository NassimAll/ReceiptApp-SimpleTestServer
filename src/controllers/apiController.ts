// src/controllers/authController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { findUserByUsername, getUserById } from '../services/authService';
import path from 'path';
import { User, TokenUser } from '../models/userModel';
import { extractText, analyzeReceiptWithLLM } from "../services/receiptScanService";
import fs from "fs";
import { getDb } from '../dbInit';
import multer from 'fastify-multer';
import { Receipt } from '../models/receiptModel';

const upload = multer({ dest: 'uploads/' });
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// GET: Get userProfile Controller
export async function getUserProfile(req: FastifyRequest, reply: FastifyReply) {
        try {
          // Decodifica il token JWT
          const user : TokenUser = await req.jwtVerify(); // Assicurati che Fastify-JWT sia configurato
          
          // Recupera i dati dell'utente dal database
          const userData : User | undefined = await getUserById(user.id);
      
          if (!userData) {
            return reply.code(404).send({ error: 'User not found' });
          }
      
          // Restituisci i dati dell'utente
          return reply.send(userData);
        } catch (error) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
}

//Funzione per la GET di tutte le ricevute caricate
export async function getReceipt(req: FastifyRequest, reply: FastifyReply) {
 // Decodifica il token JWT
 const user : TokenUser = await req.jwtVerify(); // Assicurati che Fastify-JWT sia configurato
 console.log(user);

 let db = await getDb();

 return db.get<Receipt>(`SELECT * FROM receipt WHERE user_id = ? ORDER BY upload_date DESC`, [user.id]);
}

export async function uploadReceipt(req: FastifyRequest, reply: FastifyReply) {

   // Decodifica il token JWT
   const user : TokenUser = await req.jwtVerify(); // Assicurati che Fastify-JWT sia configurato
    console.log(user);

    let db = await getDb();
   // Cast della richiesta al tipo che contiene 'file'
   const data = await req.file as any; // Ottieni il file dalla richiesta

   console.log(data)

    if (!data) return reply.status(400).send({ error: "Nessun file inviato" });

    // Salva l'immagine
     const filePath = path.join(__dirname, '../../uploads', data.filename);
    
    console.log(`📸 Scontrino ricevuto: ${filePath}`);

    // OCR e AI
    const text = await extractText(filePath); //Estriamo prima il testo dall'Immagine
    const rawResponse = await analyzeReceiptWithLLM(text);
    console.log("Tipo di rawResponse:", typeof rawResponse); // Deve essere 'string'
    
    // Rimuove eventuali delimitatori di codice come ```json e ```
   const cleanedResponse = rawResponse.replace(/```json|```/g, "").trim();

    let parsedData;
    
    try {
      parsedData = JSON.parse(cleanedResponse); // Effettuiamo il parsing
    } catch (error) {
      console.error("Errore nel parsing JSON:", error);
      return reply.status(500).send({ error: "Errore nel parsing AI" });
    }
    
    console.log("Tipo di parsedData:", typeof parsedData); // Ora deve essere 'object'
    console.log("Parsed Data:", parsedData);
    

    if (!parsedData) return reply.status(500).send({ error: "Errore AI" });

    // Salva nel database
    const { restaurantName, address, totalSpent, dateTime } = parsedData;

    const moment = require('moment');

    //const dateTimeString = "24.08.2017 20:43";
    const date = moment(dateTime, "DD.MM.YYYY HH:mm").toDate();
    
    console.log(date); // Output: 2017-08-24T18:43:00.000Z
      console.log({ restaurantName, address, totalSpent, date, user } )
      await db.run(
        `INSERT INTO receipt (restaurantName, address, totalSpent, receiptDate, imagePath, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [restaurantName, address, totalSpent, date, filePath, user.id]
    ); 

    return reply.send(parsedData); 
    //return reply.send('bah');

}


