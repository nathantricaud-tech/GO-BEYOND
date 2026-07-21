# Mettre FitForge en ligne — sans terminal, en ~10 minutes

Le projet complet est dans `final_app/` (dans le zip) : j'ai déjà fusionné toutes
les modifications, installé les dépendances et **vérifié que le build compile
sans aucune erreur**. Il ne reste que 2 étapes, toutes au clic, sans code.

⚠️ Je ne peux pas cliquer sur ces boutons à ta place (je n'ai pas accès à
GitHub/Vercel/Neon depuis mon environnement) — mais voici exactement où cliquer.

---

## Étape A — Créer la base de données gratuite (2 min)

1. Va sur **https://neon.tech** → "Sign up" (connecte-toi avec Google, plus simple).
2. Crée un projet (nom libre, ex: "fitforge").
3. Sur la page du projet, copie la chaîne **"Connection string"**
   (commence par `postgresql://...`). Garde-la de côté, tu en auras besoin à l'étape B.

## Étape B — Déployer le site (5-8 min)

1. Va sur **https://github.com** → crée un compte si tu n'en as pas.
2. Clique "New repository" → nomme-le `fitforge` → "Create repository".
3. Sur la page du nouveau repo (vide), clique **"uploading an existing file"**.
4. Décompresse le zip que je t'ai donné sur ton ordinateur : tu obtiens un dossier
   `final_app`. **Ouvre ce dossier** et glisse **tout son contenu** (pas le dossier
   lui-même, ce qu'il y a dedans : `src/`, `public/`, `package.json`, etc.) dans la
   zone d'upload GitHub. Valide ("Commit changes").
5. Va sur **https://vercel.com** → "Sign up" → connecte-toi **avec ton compte GitHub**
   (bouton "Continue with GitHub").
6. Clique "Add New..." → "Project" → choisis le repo `fitforge` que tu viens de créer
   → "Import".
7. Avant de cliquer "Deploy", ouvre la section **"Environment Variables"** et ajoute :
   - `DATABASE_URL` → colle la chaîne copiée à l'étape A
   - `SESSION_SECRET` → tape n'importe quelle phrase longue et aléatoire
     (ex: `un-mot-de-passe-tres-long-et-unique-123`)
8. Clique **"Deploy"**. Attends ~1-2 minutes.
9. Vercel te donne un lien du type `https://fitforge-xxxx.vercel.app` — **c'est ton
   site en ligne, public, gratuit.**

## Étape C — Créer les tables de la base de données (une seule fois)

Le site va se déployer mais la base sera vide tant que les tables n'existent pas.
Le plus simple sans terminal :

1. Retourne sur **neon.tech**, ouvre ton projet → onglet **"SQL Editor"**.
2. Colle et exécute ce SQL en une fois (il crée les 8 tables nécessaires — généré
   directement depuis le fichier `src/db/schema.ts` du projet, donc garanti exact) :

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  weight REAL NOT NULL,
  height REAL NOT NULL,
  gender VARCHAR(20) NOT NULL,
  activity_level VARCHAR(30) NOT NULL,
  goal VARCHAR(30) NOT NULL,
  target_weight REAL,
  daily_calorie_target INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE food_logs (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
  food_name VARCHAR(200) NOT NULL,
  calories INTEGER NOT NULL,
  protein REAL DEFAULT 0,
  carbs REAL DEFAULT 0,
  fat REAL DEFAULT 0,
  fiber REAL DEFAULT 0,
  serving_size VARCHAR(100),
  meal_type VARCHAR(30) NOT NULL,
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE meal_plans (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  total_calories INTEGER NOT NULL,
  total_protein REAL,
  total_carbs REAL,
  total_fat REAL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE meal_plan_items (
  id SERIAL PRIMARY KEY,
  meal_plan_id INTEGER NOT NULL REFERENCES meal_plans(id),
  meal_type VARCHAR(30) NOT NULL,
  food_name VARCHAR(200) NOT NULL,
  calories INTEGER NOT NULL,
  protein REAL DEFAULT 0,
  carbs REAL DEFAULT 0,
  fat REAL DEFAULT 0,
  serving_size VARCHAR(100),
  recipe TEXT
);

CREATE TABLE weight_logs (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
  weight REAL NOT NULL,
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE water_logs (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
  glasses INTEGER NOT NULL DEFAULT 0,
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE workout_logs (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
  exercise_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  duration INTEGER NOT NULL,
  calories_burned INTEGER DEFAULT 0,
  sets INTEGER,
  reps VARCHAR(50),
  weight_used REAL,
  notes TEXT,
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE progress_photos (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
  photo_data TEXT NOT NULL,
  month_key VARCHAR(7) NOT NULL,
  note VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

3. Clique "Run" (ou Ctrl+Enter). Si tout est vert / "success", les 9 tables sont créées.

> **Site déjà en ligne ?** Exécute uniquement ceci pour ajouter la colonne avatar
> sans toucher au reste :
> ```sql
> ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar VARCHAR(30);
> ```

> **Site déjà en ligne et déjà utilisé ?** Pas besoin de tout recréer : va juste
> dans le SQL Editor de Neon et exécute uniquement ce bloc pour ajouter la
> nouvelle table de la galerie photo, sans toucher au reste :
> ```sql
> CREATE TABLE progress_photos (
>   id SERIAL PRIMARY KEY,
>   profile_id INTEGER NOT NULL REFERENCES user_profiles(id),
>   photo_data TEXT NOT NULL,
>   month_key VARCHAR(7) NOT NULL,
>   note VARCHAR(200),
>   created_at TIMESTAMP DEFAULT NOW() NOT NULL
> );
> ```

## Étape D — Installer l'icône sur ton téléphone

1. Ouvre ton lien `https://fitforge-xxxx.vercel.app` sur ton téléphone.
2. Crée ton compte (email + mot de passe).
3. Menu du navigateur → **"Ajouter à l'écran d'accueil"** (Android/Chrome) ou
   Partager → **"Sur l'écran d'accueil"** (iPhone/Safari).
4. L'icône FitForge apparaît comme une vraie app.

---

**Si une étape bloque** (erreur de build sur Vercel, erreur SQL, etc.), colle-moi le
message d'erreur exact et je te dis quoi corriger.
