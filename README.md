# Backend Server Analizzatore Scontrini Ristorante (Nome Server)

## Descrizione

Questo repository contiene il server backend per l'applicazione mobile di analisi degli scontrini dei ristoranti. Sviluppato con Node.js e Fastify, il server fornisce le API necessarie per la registrazione e l'accesso degli utenti, la gestione dei dati degli scontrini e l'analisi automatica delle informazioni tramite intelligenza artificiale.

## Funzionalità

* **Autenticazione Utenti**: API per la registrazione e l'accesso degli utenti, garantendo la sicurezza dei dati.
* **Gestione Dati Scontrini**: API per ricevere, salvare e restituire i dati degli scontrini analizzati.
* **Analisi AI Scontrini**:
    * Utilizzo di Google Cloud Vision API per l'estrazione del testo dalle immagini degli scontrini.
    * Analisi del testo estratto tramite un modello AI locale gestito da Ollama per identificare e estrarre informazioni chiave (nome ristorante, data, importo, ecc.).
* **Database**: Utilizzo di SQLite per il salvataggio efficiente e locale dei dati.

## Tecnologie Utilizzate

* **Node.js**: Ambiente runtime JavaScript lato server.
* **Fastify**: Framework web veloce e minimale per Node.js.
* **SQLite**: Database relazionale leggero e autogestito.
* **JWT Token**: Per l'autenticazione degli utenti.
* **Google Cloud Vision API**: Servizio cloud per l'estrazione di testo dalle immagini.
* **Ollama**: Strumento per eseguire modelli AI localmente.
* **Modello AI locale**: Per l'analisi semantica del testo degli scontrini.

## Installazione

1.  Clona la repository:

    ```bash
    git clone https://github.com/NassimAll/ReceiptApp-SimpleTestServer.git
    ```

2.  Installa le dipendenze:

    ```bash
    npm install
    ```

3.  Configura le variabili d'ambiente:
    * Crea un file `.env` nella radice del progetto.
    * Aggiungi le credenziali per Google Cloud Vision API e altre configurazioni necessarie.
    * Configura Ollama con il modello di AI che desideri utilizzare.

4.  Esegui il server:

    ```bash
    npm start
    ```

## Configurazione Google Cloud Vision API

* Abilita l'API Cloud Vision nel tuo progetto Google Cloud.
* Scarica il file delle credenziali JSON e salvalo in un percorso accessibile dal server.
* Imposta la variabile d'ambiente `GOOGLE_APPLICATION_CREDENTIALS` con il percorso del file JSON.

## Configurazione Ollama

* Installa Ollama seguendo le istruzioni sul sito ufficiale di Ollama.
* Scarica il modello AI che intendi utilizzare per l'analisi del testo.
* Assicurati che il server backend possa comunicare con l'istanza di Ollama in esecuzione.

## API

* `/signup`: Registrazione utente (POST).
* `/login`: Accesso utente (POST).
* `/api/v1/receipts`: Gestione degli scontrini (GET).
* `/api/v1/user/profile`: Ottenimento info utente (GET).
* `/api/v1/receipt/upload`: Caricamento e analisi scontrino (POST).

