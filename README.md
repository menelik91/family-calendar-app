# Family Calendar App

MVP semplice e funzionale per un calendario familiare condiviso tra 4 persone.

## Cosa include

- Login / registrazione con Supabase Auth
- Creazione famiglia o ingresso con codice invito
- Un calendario condiviso
- Eventi con assegnazione a un membro e colore dedicato
- Vista mensile
- Lista prossimi eventi
- Modifica ed eliminazione eventi

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)

## Come avviare

### 1) Crea il progetto Supabase

- Crea un nuovo progetto su Supabase
- Vai in **SQL Editor**
- Esegui il file `supabase/schema.sql`

### 2) Imposta le variabili ambiente

Copia `.env.example` in `.env.local` e inserisci i valori reali:

```bash
cp .env.example .env.local
```

### 3) Installa le dipendenze

```bash
npm install
```

### 4) Avvia in locale

```bash
npm run dev
```

Apri l'app su `http://localhost:3000`

## Note pratiche

- Per una demo veloce puoi disattivare la conferma email in Supabase Auth
- Questo progetto è volutamente minimale
- Non include notifiche push, sincronizzazione Google/Apple o ricorrenze complesse

## Roadmap suggerita

### V2
- filtri per membro
- vista settimanale
- categorie predefinite
- eventi ricorrenti semplici

### V3
- notifiche email
- PWA installabile su telefono
- reminder automatici

## Struttura progetto

- `app/` pagine Next.js
- `components/` componenti UI
- `lib/` client Supabase e tipi
- `supabase/schema.sql` database e policy RLS

