import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import vision from "@google-cloud/vision";
import fs from "fs/promises";

// Configura il client Google Vision
const client = new vision.ImageAnnotatorClient();

// Estrai il testo dall'immagine con Google Vision API
export async function extractText(imagePath: string): Promise<string> {
    console.log("📸 Elaborazione OCR con Google Vision...");

    // Leggi l'immagine e invia la richiesta a Google Vision
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
        console.error("❌ Nessun testo rilevato");
        return "";
    }

    const extractedText = detections[0].description as any;
    console.log("📝 Testo estratto:", extractedText);
    return extractedText;
}
/* // Estrai il testo dall'immagine con OCR
export async function extractText(imagePath: string): Promise<string> {
    console.log("📸 Elaborazione OCR...");
    const { data } = await Tesseract.recognize(imagePath, "ita");
    console.log(data.text);

    return data.text;
} */

// Analizza il testo con Ollama AI
export async function analyzeReceiptWithLLM(text: string): Promise<any> {
    console.log("🧠 Analisi AI in corso...");
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "gemma2:2b",
            prompt: `Ecco il testo di uno scontrino:\n\n${text}\n\n
                Estrai i seguenti dati in formato JSON:
                - "restaurantName": Nome del ristorante
                - "address": Indirizzo
                - "totalSpent": Totale speso in numerico
                - "dateTime": Data e ora
                Rispondi SOLO con JSON puro. Se non riesci ad elaborare rispondi con con JSON puro vuoto.`,
            stream: false
        })
    });

    const json = await response.json() as any;
    console.log("🔹 Risposta AI:", json.response);
    try {
        return json.response;
    } catch (error) {
        console.error("❌ Errore AI:", json.response);
        return null;
    }
}
