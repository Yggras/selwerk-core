"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ShieldCheck, Search, Database, Globe, Target } from "lucide-react";

interface StoryCard {
  title: string;
  description: string;
  icon: React.ElementType;
}

const CARDS: StoryCard[] = [
  {
    title: "Netzwerk-Initialisierung",
    description: "Wir verknüpfen uns mit dem SELLWERK Partner-Netzwerk (42+ Plattformen).",
    icon: Search,
  },
  {
    title: "Integritäts-Prüfung",
    description: "Wir validieren Ihre Stammdaten gegen globale Verzeichnis-Standards.",
    icon: Database,
  },
  {
    title: "GEO-Lokalisierung",
    description: "Prüfung Ihrer lokalen Sichtbarkeit und Google Maps Platzierung.",
    icon: Target,
  },
  {
    title: "Reputations-Audit",
    description: "Analyse Ihrer Online-Bewertungen auf wettbewerbsrelevante Signale.",
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
    <div className="flex flex-col items-center justify-center min-h-[450px] w-full max-w-xl mx-auto py-16 px-8 font-sans">
      {/* Animated Icon Circle */}
      <div className="relative mb-14">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-30"
        />
        <div className="relative w-28 h-28 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0, rotate: 15 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="text-primary"
            >
              <currentCard.icon size={48} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Card Text */}
      <div className="text-center h-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight">
              {currentCard.title}
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
              {currentCard.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar Area */}
      <div className="w-full mt-16">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            Deep-Scan Status
          </span>
          <span className="text-3xl font-display font-black text-slate-200 tabular-nums">
            {progress}%
          </span>
        </div>
        <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
          />
        </div>
        <p className="text-center mt-6 text-[10px] font-black uppercase tracking-[0.1em] transition-colors">
          {progress >= 95 ? (
              <span className="text-primary animate-pulse">Finalizing AI Insights...</span>
          ) : (
              <span className="text-slate-400">SELLWERK Artificial Intelligence Analysis Engine</span>
          )}
        </p>
      </div>
    </div>
  );
}
