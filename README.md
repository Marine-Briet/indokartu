# IndoKartu 🇮🇩

A mobile-first flashcard app for learning Indonesian vocabulary.

> Learn Indonesian words the way you'd use paper flashcards — but digital, tracked, and available anywhere.

---

## 📖 About the project

IndoKartu was born out of a personal need: after 6 months of learning Indonesian with a paper notebook and physical flashcards, keeping track of growing vocabulary became impractical. This app digitizes that workflow — vocabulary is added progressively (by an admin), learners review it through flashcard sessions with self-assessment, and everyone tracks their own progress independently, even though the vocabulary bank is shared.

**Live demo:** https://indokartu.netlify.app
**API base URL:** https://indokartu.onrender.com

---

## ✨ Features

### For every learner
- Sign up / log in with a secure JWT-based session
- Browse the full shared vocabulary with search and filters (grammatical type, category)
- Start a flashcard review session: choose categories, grammatical types, translation direction (FR→ID or ID→FR) and number of cards
- Flip cards in a real 3D animation, self-assess each word (correct / incorrect)
- Get an end-of-session recap (score + detailed results)
- Track personal statistics: total sessions, average score (out of 20), % of vocabulary mastered, top 10 most-missed words
- Update personal email / password
- Fully responsive: mobile-first, adapted for tablet and desktop

### For the admin (single role, manually provisioned)
- Full CRUD on words, categories (with a custom color) and grammatical types
- Deletion is blocked at the API level if a category/type still has words attached
- Same review and dashboard experience as any learner, plus a dedicated "Manage data" screen

---

## 🛠 Tech stack

| Layer | Technology | Why |
|---|---|---|
| Front-end | React + Vite | Component-based UI, fast dev server, industry-standard skill |
| Front-end styling | SCSS (no framework) | Full design freedom for a custom mobile-first identity |
| Front-end state | React Context API | Shared auth state (`AuthContext`) and shared session/filters state (`SessionContext`) without prop drilling |
| Routing | React Router | `PrivateRoute` / `AdminRoute` / `RoutePublique` guard components |
| Back-end | Node.js + Express | REST API, same language as the front-end |
| Relational DB | MySQL + Sequelize (hosted on Aiven) | Structured, related data: users, words, categories, grammatical types |
| NoSQL DB | MongoDB + Mongoose (hosted on MongoDB Atlas) | High-frequency, repetitive data: session history and per-word results (embedded, not a separate collection) |
| Auth | JWT + bcrypt | Stateless authentication, hashed passwords, role-based access |
| Hosting | Netlify (front) · Render (API) · Aiven (MySQL) · MongoDB Atlas (MongoDB) | Free-tier friendly, simple CI from GitHub |

---

## 🗂 Project structure

```
indokartu/
├── client/                  # React front-end (Vite)
│   └── src/
│       ├── components/      # Card, Bouton, Champ, TagCategorie, Header
│       ├── pages/            # One file per screen
│       ├── routes/            # PrivateRoute, AdminRoute, RoutePublique
│       ├── context/            # AuthContext, SessionContext
│       ├── styles/               # variables.scss, main.scss
│       ├── utils/                  # colors.js (hex → rgba conversion)
│       └── config.js                # Single source of truth for the API base URL
│
└── server/                   # Express API
    ├── controllers/           # Business logic per entity
    ├── models/                 # Sequelize + Mongoose models
    ├── routes/                   # Express routers per entity
    ├── middlewares/                # checkJWT, checkAdmin
    ├── scripts/                      # createAdmin, importerDonnees
    └── data/                           # Source CSV files (types, categories, words)
```

---

## 🔐 Data model

### MySQL (relational)

Four related entities:

- **Utilisateur** — email, hashed password, `est_admin` flag
- **Mot** (word) — root form, derived forms, translation, foreign keys to Categorie and TypeGrammatical
- **Categorie** — name, associated color (used across the UI for tags and flashcard borders)
- **TypeGrammatical** — name (Verb, Noun, Adjective...)

Deleting a Categorie or TypeGrammatical is blocked server-side if any Mot still references it.

### MongoDB (NoSQL)

```js
// Collection: sessions
{
  _id: ObjectId,
  id_utilisateur: Integer,   // references Utilisateur.id_utilisateur in MySQL
  date_heure: Date,
  resultats: [
    { id_mot: Integer, est_reussi: Boolean }
    // ...
  ]
}
```

Results are **embedded** in the session document rather than stored in a separate collection: they only ever exist in the context of one session, and are always read together (score calculation, end-of-session recap).

> ⚠️ Cross-database consistency note: `id_utilisateur` and `id_mot` reference MySQL identifiers. MongoDB has no native way to enforce that these IDs actually exist — this integrity is guaranteed by the Express application layer, not by a database constraint.

---

## 🚀 Getting started locally

### Prerequisites
- Node.js 18+ (developed with Node 24)
- A MySQL instance (local or remote)
- A MongoDB instance (local or remote)

### 1. Clone and install

```bash
git clone https://github.com/Marine-Briet/indokartu.git
cd indokartu

# Back-end
cd server
npm install

# Front-end
cd ../client
npm install
```

### 2. Environment variables

Create a `.env` file in `server/` (never committed — see `.gitignore`):

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
MONGO_URI=
JWT_SECRET=
ADMIN_PASSWORD=
PORT=3000
```

> The front-end has no `.env` — the API base URL is a plain constant in `client/src/config.js`, since it is not a secret value.

### 3. Run both apps

```bash
# Terminal 1 — back-end
cd server
npm run dev

# Terminal 2 — front-end
cd client
npm run dev
```

The front-end runs on `http://localhost:5173`, the API on `http://localhost:3000`.

### 4. Create the admin account

There is intentionally **no public way** to create an admin — it's a single, manually provisioned role:

### 5. Import the reference vocabulary (optional)

Three CSV files (`types.csv`, `categories.csv`, `mots.csv`) live in `server/data/`. Run:

```bash
cd server
node scripts/importerDonnees.js
```

The script imports types → categories → words, resolving category/type **names** to their real database IDs (rather than requiring pre-known numeric IDs), and skips any row it can't match rather than failing the whole import.

---

## 🌐 Deployment notes

| Service | Notes |
|---|---|
| **Aiven (MySQL)** | Requires SSL — Sequelize config needs `dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }` |
| **MongoDB Atlas** | Network Access must allow the deploying environment's IP (or `0.0.0.0/0` for simplicity). On some Windows/Node setups, `mongodb+srv://` DNS resolution can fail (`querySrv ECONNREFUSED`) even though the cluster is reachable — forcing Node's DNS servers (`dns.setServers(['8.8.8.8', '8.8.4.4'])`) resolved this in development |
| **Render (API)** | Root directory: `server`. All `.env` variables must be re-entered as environment variables in the Render dashboard (the `.env` file itself is never pushed to GitHub) |
| **Netlify (front)** | Base directory: `client`. Build command: `npm run build`. Publish directory: `client/dist` |
| **CORS** | The API allows all origins (`app.use(cors())`) — acceptable for this project's scope, would be restricted to the exact front-end domain in a stricter production setup |

---

## 🧪 Testing approach

No automated test suite was implemented for this project (identified as an improvement area). Validation was done through systematic manual functional testing after each feature, including:
- Auth edge cases (invalid password format, duplicate email, wrong credentials)
- Front-end validation bypass, to confirm the back-end independently re-validates every rule
- Full review session flow, verifying the MongoDB write (`201` response) at the last card
- Responsive testing at multiple breakpoints, including on a physical mobile device over local network

---

## 🔭 Future improvements

- Spaced repetition algorithm for smarter long-term review scheduling
- Weighted word selection, to guarantee full vocabulary coverage over time
- SEO-optimized public landing page
- Legal notices / GDPR compliance
- Per-theme progress breakdown (beyond global stats)
- Pagination on the vocabulary table
- Strict "mastered word" rule (consecutive successes, not cumulative)
- Custom confirmation modal, replacing the native browser `window.confirm`
- Confirmation before abandoning an ongoing session (a "are you sure you want to leave?" modal)
- A visibility toggle ("eye" icon) on password fields across Registration, Login and Mes infos
- A real email service for password reset on the Login page, replacing the current "contact the admin" message
- Automated unit and integration tests
and more others features...

---

## 👤 Author

Marine BRIET
Built as a final bootcamp project — Web & Mobile Web Developer training.