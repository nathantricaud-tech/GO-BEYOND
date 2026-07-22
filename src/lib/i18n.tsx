"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "en";

const DICT = {
  fr: {
    "nav.dashboard": "Accueil",
    "nav.training": "Sport",
    "nav.nutrition": "Nutrition",
    "nav.recipes": "Recettes",
    "nav.progress": "Progrès",
    "auth.login": "Connexion",
    "auth.signup": "Créer un compte",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.loginBtn": "Se connecter",
    "auth.signupBtn": "Créer mon compte",
    "auth.tagline": "Ton sport, ta nutrition, ta progression.",
    "auth.persist": "Tu restes connecté(e) automatiquement sur cet appareil.",
    "auth.loading": "Chargement de GO BEYOND...",
    "header.logout": "Se déconnecter",
    "dashboard.caloriesToday": "Calories aujourd'hui",
    "dashboard.water": "Eau",
    "dashboard.glasses": "verres",
    "dashboard.nextSession": "Prochaine séance",
    "progress.weight": "Poids",
    "progress.rank": "Rang",
    "progress.gallery": "Galerie",
    "rank.pointsLabel": "points d'assiduité",
    "rank.toward": "Vers",
    "rank.maxRank": "🏆 Rang maximum atteint — tu es un vrai HERO.",
    "rank.streak": "Série actuelle",
    "rank.fullDays": "Jours complets",
    "rank.activeDays": "Jours actifs",
    "rank.ladder": "Échelle des rangs",
    "rank.current": "ACTUEL",
    "gallery.title": "Photo du mois",
    "gallery.already": "Tu as déjà ajouté ta photo pour ce mois-ci — reviens le mois prochain !",
    "gallery.cta": "Débloque ta photo de progression de ce mois pour l'ajouter à ta galerie.",
    "gallery.take": "Prendre / choisir une photo",
    "gallery.replace": "Remplacer la photo de ce mois",
    "gallery.history": "Historique",
    "gallery.empty": "Aucune photo pour l'instant",
    "recipes.validate": "Valider ce repas",
    "recipes.validated": "Ajouté à ton suivi du jour",
    "programs.all": "Tout",
    "programs.home": "Maison",
    "programs.gym": "Salle",
    "programs.timeAny": "Peu importe",
  },
  en: {
    "nav.dashboard": "Home",
    "nav.training": "Training",
    "nav.nutrition": "Nutrition",
    "nav.recipes": "Recipes",
    "nav.progress": "Progress",
    "auth.login": "Log in",
    "auth.signup": "Sign up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.loginBtn": "Log in",
    "auth.signupBtn": "Create my account",
    "auth.tagline": "Your training, your nutrition, your progress.",
    "auth.persist": "You'll stay signed in automatically on this device.",
    "auth.loading": "Loading GO BEYOND...",
    "header.logout": "Log out",
    "dashboard.caloriesToday": "Calories today",
    "dashboard.water": "Water",
    "dashboard.glasses": "glasses",
    "dashboard.nextSession": "Next session",
    "progress.weight": "Weight",
    "progress.rank": "Rank",
    "progress.gallery": "Gallery",
    "rank.pointsLabel": "consistency points",
    "rank.toward": "Toward",
    "rank.maxRank": "🏆 Max rank reached — you're a true HERO.",
    "rank.streak": "Current streak",
    "rank.fullDays": "Full days",
    "rank.activeDays": "Active days",
    "rank.ladder": "Rank ladder",
    "rank.current": "CURRENT",
    "gallery.title": "Photo of the month",
    "gallery.already": "You've already added your photo for this month — come back next month!",
    "gallery.cta": "Unlock this month's progress photo to add it to your gallery.",
    "gallery.take": "Take / choose a photo",
    "gallery.replace": "Replace this month's photo",
    "gallery.history": "History",
    "gallery.empty": "No photos yet",
    "recipes.validate": "Log this meal",
    "recipes.validated": "Added to today's log",
    "programs.all": "All",
    "programs.home": "Home",
    "programs.gym": "Gym",
    "programs.timeAny": "Any",
  },
} as const;

export type DictKey = keyof (typeof DICT)["fr"];

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("gb_lang") as Lang | null) : null;
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("gb_lang", l);
  }

  function t(key: DictKey): string {
    return DICT[lang][key] || DICT.fr[key] || key;
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
