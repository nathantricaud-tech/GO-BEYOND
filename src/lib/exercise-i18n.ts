import type { Exercise } from "./exercises-db";
import type { Lang } from "./i18n";

export const DIFFICULTY_FR: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export const CATEGORY_FR: Record<string, string> = {
  strength: "Musculation",
  calisthenics: "Poids du corps",
  cardio: "Cardio",
  hiit: "HIIT",
  flexibility: "Souplesse",
};

export const EQUIPMENT_FR: Record<string, string> = {
  "None": "Aucun",
  "Barbell + Bench": "Barre + banc",
  "Barbell + Rack": "Barre + rack",
  "Barbell or Dumbbells": "Barre ou haltères",
  "Barbell": "Barre",
  "Battle Ropes": "Cordes ondulatoires",
  "Bench + optional Dumbbells": "Banc + haltères (optionnel)",
  "Bench or Step": "Banc ou step",
  "Bike or Stationary": "Vélo (route ou d'appartement)",
  "Box / Platform": "Box / plateforme",
  "Cable Machine": "Poulie",
  "Dumbbells + Bench": "Haltères + banc",
  "Dumbbells": "Haltères",
  "Foam Roller": "Rouleau de massage",
  "Jump Rope": "Corde à sauter",
  "Leg Press Machine": "Presse à cuisses",
  "Low Bar or TRX": "Barre basse ou TRX",
  "None or Bench": "Aucun ou banc",
  "None or Step": "Aucun ou step",
  "None or Weight": "Aucun ou poids",
  "Parallel Bars or Bench": "Barres parallèles ou banc",
  "Pool": "Piscine",
  "Pull-up Bar": "Barre de traction",
  "Rowing Machine": "Rameur",
  "Stairs or Machine": "Escaliers ou machine",
  "Wall": "Mur",
  "Yoga Mat": "Tapis de sol",
};

interface ExerciseTranslation {
  name: string;
  muscleGroup: string;
  description: string;
  steps: string[];
  tips: string[];
}

export const EXERCISE_FR: Record<string, ExerciseTranslation> = {
  // CHEST
  c1: { name: "Pompes", muscleGroup: "Pectoraux", description: "Le roi des exercices au poids du corps. Cible toute la chaîne de poussée du haut du corps.", steps: ["Position de planche, mains à largeur d'épaules", "Descends la poitrine vers le sol, coudes à 45°", "Repousse-toi vers le haut de façon explosive", "Tends complètement les bras en haut"], tips: ["Garde le gainage serré, corps aligné", "Ne laisse pas les hanches s'affaisser", "Inspire en descendant, expire en remontant"] },
  c2: { name: "Développé Couché", muscleGroup: "Pectoraux", description: "Le mouvement fondamental pour la poitrine. Exercice polyarticulaire pour la masse du haut du corps.", steps: ["Allongé sur le banc, pieds au sol", "Prise légèrement plus large que les épaules", "Décroche la barre et descends au milieu de la poitrine", "Pousse jusqu'à extension complète"], tips: ["Rétracte les omoplates", "Cambre légèrement le haut du dos", "Ne fais pas rebondir la barre sur la poitrine"] },
  c3: { name: "Écarté Couché", muscleGroup: "Pectoraux", description: "Exercice d'isolation qui étire et contracte les muscles pectoraux.", steps: ["Allongé sur le banc, haltères au-dessus de la poitrine", "Légère flexion des coudes", "Descends les bras en arc vers les côtés", "Contracte la poitrine pour remonter"], tips: ["Ne charge pas trop lourd — privilégie l'étirement", "Garde une légère flexion des coudes tout du long"] },
  c4: { name: "Pompes Inclinées", muscleGroup: "Pectoraux", description: "Variante plus facile de la pompe, idéale pour débuter et renforcer la poitrine.", steps: ["Place les mains sur une surface surélevée", "Corps aligné de la tête aux talons", "Descends la poitrine vers la surface", "Repousse-toi vers le point de départ"], tips: ["Plus la surface est haute, plus c'est facile", "Excellent échauffement avant les exercices plus durs"] },
  c5: { name: "Pompes Diamant", muscleGroup: "Pectoraux", description: "Pompe en prise serrée qui cible les triceps et l'intérieur des pectoraux.", steps: ["Mains jointes formant un diamant", "Descends la poitrine vers les mains", "Repousse-toi vers le haut", "Garde les coudes proches du corps"], tips: ["Si trop dur, commence sur les genoux", "Concentre-toi sur la contraction des triceps en haut"] },
  // BACK
  b1: { name: "Tractions", muscleGroup: "Dos", description: "Le meilleur exercice pour le dos. Si tu ne devais en faire qu'un, ce serait celui-ci.", steps: ["Attrape la barre en pronation, plus large que les épaules", "Suspends-toi bras tendus", "Tire le menton au-dessus de la barre", "Redescends lentement en contrôlant"], tips: ["Initie le mouvement avec le dos, pas les biceps", "Évite de te balancer", "Utilise un élastique d'assistance si besoin"] },
  b2: { name: "Rowing Buste Penché", muscleGroup: "Dos", description: "Mouvement de tirage horizontal puissant pour un dos épais.", steps: ["Buste penché, dos plat à 45°", "Tire la charge vers le bas de la poitrine/haut du ventre", "Serre les omoplates en haut", "Redescends en contrôlant"], tips: ["Garde le dos plat, ne l'arrondis pas", "Tire avec les coudes, pas les mains"] },
  b3: { name: "Tirage Vertical", muscleGroup: "Dos", description: "Version machine de la traction. Idéal pour progresser vers la traction complète.", steps: ["Prise large, cuisses calées", "Tire la barre vers le haut de la poitrine", "Penche-toi légèrement en arrière", "Reviens lentement au point de départ"], tips: ["Ne te penche pas trop en arrière", "Concentre-toi sur la contraction du dos"] },
  b4: { name: "Extension Superman", muscleGroup: "Dos", description: "Renforce le bas du dos et améliore la posture.", steps: ["Allongé sur le ventre, bras tendus devant", "Lève bras, poitrine et jambes du sol", "Maintiens la position en haut", "Redescends lentement"], tips: ["Ne force pas sur la nuque", "Serre les fessiers en haut"] },
  b5: { name: "Rowing Inversé", muscleGroup: "Dos", description: "Tirage au poids du corps — l'exercice de tirage horizontal pour débutants.", steps: ["Suspends-toi sous une barre à hauteur de bassin", "Corps droit, talons au sol", "Tire la poitrine vers la barre", "Redescends lentement"], tips: ["Plus facile avec les genoux pliés", "Excellente progression vers la traction"] },
  // LEGS
  l1: { name: "Squats (Poids du Corps)", muscleGroup: "Jambes", description: "Le mouvement fondamental du bas du corps.", steps: ["Debout, pieds à largeur d'épaules", "Recule les hanches et plie les genoux", "Descends jusqu'à cuisses parallèles au sol", "Pousse sur les talons pour remonter"], tips: ["Garde la poitrine haute, genoux dans l'axe des pieds", "Ne laisse pas les genoux rentrer vers l'intérieur"] },
  l2: { name: "Squat Barre", muscleGroup: "Jambes", description: "Le roi de tous les exercices. Développe force et masse sur tout le corps.", steps: ["Barre sur le haut du dos ou les trapèzes", "Décroche, recule, pieds à largeur d'épaules", "Descends à parallèle ou plus bas", "Remonte avec puissance"], tips: ["Garde le gainage serré tout du long", "Ne laisse pas les genoux rentrer", "Privilégie l'amplitude complète à la charge"] },
  l3: { name: "Fentes", muscleGroup: "Jambes", description: "Exercice unilatéral qui développe équilibre et force des jambes.", steps: ["Debout, avance une jambe", "Descends jusqu'à ce que les deux genoux soient à 90°", "Genou avant au-dessus de la cheville, pas au-delà des orteils", "Repousse-toi vers le départ, alterne"], tips: ["Garde le buste droit", "Pas plus court = plus de quadriceps, plus long = plus de fessiers"] },
  l4: { name: "Fente Bulgare", muscleGroup: "Jambes", description: "Exercice unilatéral avancé pour un vrai développement des jambes.", steps: ["Pied arrière surélevé sur un banc", "Descends en position de fente", "Cuisse avant parallèle au sol", "Remonte en poussant sur le talon avant"], tips: ["Garde le poids principalement sur le pied avant", "Contrôle la descente"] },
  l5: { name: "Soulevé de Terre", muscleGroup: "Jambes", description: "Le meilleur exercice pour la chaîne postérieure. Renforce tout le corps.", steps: ["Pieds à largeur de hanches, barre au-dessus du milieu du pied", "Bascule au niveau des hanches, prise à l'extérieur des genoux", "Gaine le tronc, pousse sur les jambes", "Verrouille les hanches en haut"], tips: ["Garde la barre proche du corps", "N'arrondis pas le dos", "Pense à 'repousser le sol'"] },
  l6: { name: "Presse à Cuisses", muscleGroup: "Jambes", description: "Exercice de jambes sur machine — plus sûr que le squat pour les débutants.", steps: ["Assis dans la machine, pieds à largeur d'épaules sur le plateau", "Déverrouille les sécurités", "Descends le plateau en pliant les genoux", "Repousse sans verrouiller les genoux"], tips: ["Ne verrouille pas les genoux en haut", "Pieds plus hauts = plus de fessiers"] },
  l7: { name: "Extensions Mollets", muscleGroup: "Jambes", description: "Isole les mollets pour définition et force.", steps: ["Debout sur le bord d'un step, talons dans le vide", "Monte sur la pointe des pieds au maximum", "Maintiens 1 seconde en haut", "Redescends lentement sous le niveau du step"], tips: ["L'amplitude complète est essentielle", "Négatives lentes pour la croissance musculaire"] },
  l8: { name: "Chaise Contre le Mur", muscleGroup: "Jambes", description: "Position isométrique qui développe l'endurance des quadriceps et la force mentale.", steps: ["Adosse-toi contre un mur", "Glisse jusqu'à ce que les cuisses soient parallèles", "Genoux à 90°, dos plaqué au mur", "Tiens le plus longtemps possible"], tips: ["Pousse dans le mur", "Respire calmement"] },
  l9: { name: "Pont Fessier", muscleGroup: "Jambes", description: "Active et développe les fessiers, excellent pour la posture.", steps: ["Allongé sur le dos, genoux pliés, pieds à plat", "Monte les hanches en serrant les fessiers", "Ligne droite des genoux aux épaules", "Redescends lentement"], tips: ["Marque une pause de 2 secondes en haut", "N'hyperextends pas — serre les fessiers, pas le dos"] },
  l10: { name: "Montées sur Banc", muscleGroup: "Jambes", description: "Exercice fonctionnel unilatéral qui reproduit des mouvements du quotidien.", steps: ["Debout face à un banc/step", "Monte avec une jambe, pousse vers le haut", "Tiens-toi debout complètement en haut", "Redescends en contrôlant, alterne"], tips: ["Ne pousse pas sur le pied arrière", "Step plus haut = plus de fessiers"] },
  // SHOULDERS
  s1: { name: "Développé Militaire", muscleGroup: "Épaules", description: "Le principal exercice pour développer la masse des épaules.", steps: ["Barre au niveau des épaules", "Pousse au-dessus de la tête jusqu'à extension complète", "Redescends aux épaules en contrôlant"], tips: ["Gaine le tronc fermement", "N'arque pas excessivement le bas du dos"] },
  s2: { name: "Élévations Latérales", muscleGroup: "Épaules", description: "Isolation pour des épaules larges et bien dessinées.", steps: ["Debout, haltères le long du corps", "Lève les bras sur les côtés jusqu'à hauteur d'épaules", "Légère flexion des coudes", "Redescends lentement"], tips: ["Utilise une charge légère, concentre-toi sur la contraction", "Mène le mouvement avec les coudes, pas les mains"] },
  s3: { name: "Pompes Pike", muscleGroup: "Épaules", description: "Alternative au développé épaules au poids du corps.", steps: ["Position de chien tête en bas", "Plie les coudes, descends la tête vers le sol", "Repousse-toi vers le départ", "Garde les hanches hautes tout du long"], tips: ["Surélève les pieds pour plus de difficulté", "Progression vers la pompe en équilibre"] },
  // ARMS
  a1: { name: "Curl Biceps", muscleGroup: "Bras", description: "Le classique du développement des bras. Isolation pour les biceps.", steps: ["Debout, haltères le long du corps, paumes vers l'avant", "Monte les charges vers les épaules", "Contracte en haut", "Redescends lentement"], tips: ["Ne te balance pas — garde une forme stricte", "Contrôle la phase négative"] },
  a2: { name: "Dips Triceps", muscleGroup: "Bras", description: "Mouvement polyarticulaire pour la masse des triceps. Peut se faire sur un banc.", steps: ["Prise sur des barres ou le bord d'un banc derrière toi", "Descends le corps en pliant les coudes à 90°", "Repousse-toi jusqu'à extension complète", "Garde les coudes orientés vers l'arrière"], tips: ["Penché en avant = plus de pectoraux, droit = plus de triceps", "Utilise un banc si trop difficile"] },
  a3: { name: "Curl Marteau", muscleGroup: "Bras", description: "Cible le brachial pour des bras plus épais.", steps: ["Tiens les haltères en prise neutre (paumes face à face)", "Monte en gardant les paumes vers l'intérieur", "Contracte en haut", "Redescends lentement"], tips: ["Excellent aussi pour les avant-bras", "Alterne les bras ou fais les deux ensemble"] },
  // CORE
  co1: { name: "Planche", muscleGroup: "Sangle Abdominale", description: "La base de l'entraînement des abdominaux. Développe endurance et stabilité.", steps: ["Avant-bras au sol, coudes sous les épaules", "Corps aligné de la tête aux talons", "Gaine le tronc, serre les fessiers", "Tiens sans s'affaisser ni se cambrer"], tips: ["Respire normalement", "Si ça tremble, c'est que ça travaille !"] },
  co2: { name: "Crunchs", muscleGroup: "Sangle Abdominale", description: "Exercice de base pour le haut des abdominaux.", steps: ["Allongé sur le dos, genoux pliés, pieds à plat", "Mains derrière la tête ou croisées sur la poitrine", "Enroule les épaules hors du sol", "Redescends en contrôlant"], tips: ["Ne tire pas sur la nuque", "Expire en montant"] },
  co3: { name: "Rotations Russes", muscleGroup: "Sangle Abdominale", description: "Exercice de rotation pour dessiner les obliques.", steps: ["Assis, genoux pliés, buste penché à 45°", "Soulève les pieds du sol (optionnel)", "Tourne le buste d'un côté à l'autre", "Touche le sol à côté de la hanche à chaque côté"], tips: ["Garde la poitrine haute", "Bouge lentement pour plus d'intensité"] },
  co4: { name: "Relevés de Jambes", muscleGroup: "Sangle Abdominale", description: "Cible le bas des abdominaux, souvent négligé.", steps: ["Allongé sur le dos, mains le long du corps", "Jambes tendues, monte à 90°", "Redescends lentement sans toucher le sol", "Répète sans à-coups"], tips: ["Plaque le bas du dos au sol", "Plie les genoux pour faciliter"] },
  co5: { name: "Mountain Climbers", muscleGroup: "Sangle Abdominale", description: "Exercice dynamique pour les abdos qui fait aussi office de cardio.", steps: ["Position de planche haute", "Amène un genou vers la poitrine", "Change de jambe rapidement", "Garde les hanches stables tout du long"], tips: ["Accélère pour plus de cardio", "Garde les bras tendus"] },
  co6: { name: "Dead Bug", muscleGroup: "Sangle Abdominale", description: "Exercice anti-extension pour les muscles stabilisateurs profonds.", steps: ["Allongé sur le dos, bras tendus vers le haut, genoux à 90°", "Descends bras et jambe opposés vers le sol", "Garde le bas du dos plaqué au sol", "Reviens et change de côté"], tips: ["Bouge lentement et de façon contrôlée", "Expire en tendant"] },
  co7: { name: "Crunchs Croisés", muscleGroup: "Sangle Abdominale", description: "Combine le crunch et la rotation pour un travail abdominal complet.", steps: ["Allongé sur le dos, mains derrière la tête", "Amène le coude droit vers le genou gauche", "Tends la jambe droite", "Alterne les côtés en mouvement de pédalage"], tips: ["Ne te précipite pas — la qualité prime sur la vitesse", "Touche le coude au genou à chaque répétition"] },
  // CARDIO
  ca1: { name: "Course à Pied", muscleGroup: "Corps Entier", description: "Le cardio le plus accessible. Cours en extérieur ou sur tapis.", steps: ["Échauffe-toi avec 5 min de marche", "Monte à une allure confortable", "Maintiens une respiration régulière", "Retour au calme avec 5 min de marche"], tips: ["Pose le pied au milieu, pas sur le talon", "Commence doucement, augmente la distance progressivement"] },
  ca2: { name: "Vélo", muscleGroup: "Jambes", description: "Cardio à faible impact, doux pour les articulations.", steps: ["Règle correctement la hauteur de selle", "Commence à pédaler à allure modérée", "Ajoute des intervalles en résistance plus forte", "Retour au calme en pédalage facile"], tips: ["Garde une cadence de 80-100 tr/min", "Idéal pour les jours de récupération active"] },
  ca3: { name: "Corde à Sauter", muscleGroup: "Corps Entier", description: "Un des exercices qui brûle le plus de calories. Le favori des boxeurs.", steps: ["Tiens les poignées à hauteur de hanches", "Saute 2-3 cm, atterris sur l'avant du pied", "Fais tourner la corde avec les poignets, pas les bras", "Alterne : 1 min d'effort, 30 sec de repos"], tips: ["Commence par le saut de base", "Utilise une corde de vitesse adaptée"] },
  ca4: { name: "Natation", muscleGroup: "Corps Entier", description: "Cardio complet, sans impact. Travaille tous les groupes musculaires.", steps: ["Échauffe-toi avec des longueurs faciles", "Varie les nages : crawl, dos", "Essaie des séries en intervalles", "Retour au calme en nage facile"], tips: ["Concentre-toi sur le rythme respiratoire", "Utilise une planche pour les jours jambes"] },
  ca5: { name: "Rameur", muscleGroup: "Corps Entier", description: "Cardio complet qui développe force et endurance.", steps: ["Cale les pieds, attrape la poignée", "Pousse d'abord avec les jambes, puis tire avec les bras", "Penche-toi légèrement en arrière en fin de mouvement", "Reviens dans l'ordre inverse : bras, buste, jambes"], tips: ["La puissance vient des jambes, pas des bras", "Garde une cadence régulière"] },
  ca6: { name: "Marche Rapide", muscleGroup: "Jambes", description: "L'exercice le plus sous-estimé. Faible impact, durable, efficace.", steps: ["Marche à une allure où tu peux parler mais pas chanter", "Balance les bras naturellement", "Fais de grandes enjambées", "Garde une posture droite"], tips: ["Vise 8000 à 10000 pas par jour", "Marche après les repas pour la digestion"] },
  ca7: { name: "Escaliers / Stepper", muscleGroup: "Jambes", description: "Cardio intense pour le bas du corps qui muscle les jambes et brûle les graisses.", steps: ["Monte sur la machine ou trouve des escaliers", "Maintiens une allure régulière", "Reste droit — ne t'appuie pas sur les mains courantes", "Pousse sur tout le pied à chaque pas"], tips: ["Ne t'accroche pas fort aux rampes", "Saute une marche sur deux pour plus de fessiers"] },
  // HIIT
  h1: { name: "Burpees", muscleGroup: "Corps Entier", description: "L'exercice HIIT complet ultime. Brûle énormément de calories.", steps: ["Debout, accroupis-toi, mains au sol", "Envoie les pieds en arrière en position de planche", "Fais une pompe (optionnel)", "Ramène les pieds vers l'avant, puis saute bras en l'air"], tips: ["Modifie en marchant au lieu de sauter", "Privilégie la forme à la vitesse"] },
  h2: { name: "Squats Sautés", muscleGroup: "Jambes", description: "Variante explosive du squat pour la puissance et la dépense calorique.", steps: ["Descends en squat à parallèle", "Explose vers le haut en un saut", "Atterris en douceur, repars immédiatement en squat", "Garde la poitrine haute tout du long"], tips: ["Atterrir silencieusement = bonne forme", "Utilise les bras pour générer de l'élan"] },
  h3: { name: "Montées de Genoux", muscleGroup: "Corps Entier", description: "Cardio rapide qui élève vite la fréquence cardiaque.", steps: ["Debout bien droit", "Monte les genoux alternativement aussi vite que possible", "Fais pomper les bras comme en sprint", "Reste sur la pointe des pieds"], tips: ["Vise des genoux à hauteur de taille", "Garde le gainage serré"] },
  h4: { name: "Box Jumps", muscleGroup: "Jambes", description: "Exercice pliométrique pour la puissance explosive des jambes.", steps: ["Debout face à la box, pieds à largeur d'épaules", "Balance les bras et saute sur la box", "Atterris en douceur sur les deux pieds", "Redescends en marchant (ne saute pas pour descendre)"], tips: ["Commence avec une box plus basse", "Redescends toujours en marchant pour protéger les articulations"] },
  h5: { name: "Cordes Ondulatoires", muscleGroup: "Corps Entier", description: "Conditionnement complet qui détruit les calories.", steps: ["Tiens les extrémités des cordes, légère position de squat", "Alterne les bras en créant des vagues", "Garde le gainage engagé", "Varie les motifs : vagues, claquements, cercles"], tips: ["Ne serre pas les cordes trop fort", "Génère la puissance depuis les hanches"] },
  // FLEXIBILITY
  f1: { name: "Yoga Flow", muscleGroup: "Corps Entier", description: "Enchaînement fluide pour la souplesse, la force et la pleine conscience.", steps: ["Commence en posture de la montagne", "Enchaîne les salutations au soleil", "Tiens les postures du guerrier 30 sec chacune", "Termine par 5 min de savasana"], tips: ["Concentre-toi sur ta respiration", "Ne force jamais un étirement"] },
  f2: { name: "Étirements Statiques", muscleGroup: "Corps Entier", description: "Maintiens chaque étirement 20-30 secondes. Idéal après l'entraînement.", steps: ["Cible tous les grands groupes musculaires", "Tiens chaque étirement 20-30 secondes", "Respire profondément dans chaque étirement", "Ne rebondis jamais"], tips: ["Étire-toi après l'exercice, pas avant", "La régularité est la clé de la souplesse"] },
  f3: { name: "Rouleau de Massage", muscleGroup: "Corps Entier", description: "Auto-massage myofascial. Réduit les courbatures et améliore la récupération.", steps: ["Place le rouleau sous le muscle ciblé", "Roule lentement sur le corps musculaire", "Marque une pause sur les points sensibles 20-30 sec", "Couvre quadriceps, ischio-jambiers, dos, bandelette IT"], tips: ["Inconfortable mais ne doit pas être douloureux", "Évite de rouler directement sur les articulations"] },
};

export function translateExercise(ex: Exercise, lang: Lang): Exercise {
  if (lang !== "fr") return ex;
  const tr = EXERCISE_FR[ex.id];
  if (!tr) return ex;
  return { ...ex, name: tr.name, muscleGroup: tr.muscleGroup, description: tr.description, steps: tr.steps, tips: tr.tips };
}

export function translateDifficulty(difficulty: string, lang: Lang): string {
  return lang === "fr" ? DIFFICULTY_FR[difficulty] || difficulty : difficulty;
}

export function translateCategory(category: string, lang: Lang): string {
  return lang === "fr" ? CATEGORY_FR[category] || category : category;
}

export function translateEquipment(equipment: string, lang: Lang): string {
  return lang === "fr" ? EQUIPMENT_FR[equipment] || equipment : equipment;
}
