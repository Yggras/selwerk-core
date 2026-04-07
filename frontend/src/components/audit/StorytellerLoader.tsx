"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Search, Database, Globe } from "lucide-react";

interface StoryCard {
  title: string;
  description: string;
  icon: React.ElementType;
}

const CARDS: StoryCard[] = [
  {
    title: "Initialisiere Deep-Scan",
    description: "Wir verknüpfen uns mit über 40 Plattformen weltweit.",
    icon: Search,
  },
  {
    title: "Abgleich der Stammdaten",
    description: "Wir prüfen Name, Adresse und Telefonnummer auf Inkonsistenzen.",
    icon: Database,
  },
  {
    title: "Google Maps Analyse",
    description: "Stimmt dein Pin? Wir prüfen die geographische Korrektheit.",
    icon: Globe,
  },
  {
    title: "Reputationscheck",
    description: "Wir scannen aktuelle Bewertungen auf kritische Signale.",
    icon: ShieldCheck,
  },
];

interface StorytellerLoaderProps {
  progress: number;
}

export function StorytellerLoader({ progress }: StorytellerLoaderProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % CARDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const currentCard = CARDS[currentCardIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-lg mx-auto py-12 px-6">
      {/* Animated Icon Circle */}
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full blur-2xl opacity-20"
        />
        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
              transition={{ duration: 0.5 }}
              className="text-blue-600"
            >
              <currentCard.icon size={40} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Card Text */}
      <div className="text-center h-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {currentCard.title}
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              {currentCard.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar Area */}
      <div className="w-full mt-12">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Deep Scan Fortschritt
          </span>
          <span className="text-2xl font-black text-slate-300">
            {progress}%
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          />
        </div>
        <p className="text-center mt-4 text-xs text-slate-400 font-medium italic">
          "Qualität braucht einen Moment. Wir graben tief..."
        </p>
      </div>
    </div>
  );
}
