"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import {
  MapPin,
  Star,
  Share2,
  Globe,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Sparkles,
  X,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  AUDIT_CATEGORIES,
  getGlobalScore,
  type AuditCategory,
} from "@/mocks/auditMockData";

// ─── Icon Map ────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  MapPin,
  Star,
  Share2,
  Globe,
};

// ─── Props ───────────────────────────────────────────────
interface OnboardingWizardProps {
  phase: "DISCOVERY" | "CELEBRATION";
  totalScore: number;
  completedCount: number;
  onShowPriorities: () => void;
  onContinue: () => void;
  onDismiss: () => void;
}

// ─── Main Component ──────────────────────────────────────
export function OnboardingWizard({
  phase,
  totalScore,
  completedCount,
  onShowPriorities,
  onContinue,
  onDismiss,
}: OnboardingWizardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex items-center justify-center overflow-y-auto"
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-8 right-8 z-50 p-3 rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
        aria-label="Schließen"
      >
        <X size={20} />
      </button>

      <AnimatePresence mode="wait">
        {phase === "DISCOVERY" && (
          <DiscoveryView key="discovery" onContinue={onShowPriorities} />
        )}
        {phase === "CELEBRATION" && (
          <CelebrationView
            key="celebration"
            totalScore={totalScore}
            completedCount={completedCount}
            onContinue={onContinue}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// DISCOVERY VIEW — The "Ouch!" Score Card
// ═══════════════════════════════════════════════════════════
function DiscoveryView({ onContinue }: { onContinue: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globalScore = getGlobalScore();

  useEffect(() => {
    if (!containerRef.current) return;
    const rings = containerRef.current.querySelectorAll(".score-ring");
    gsap.fromTo(
      rings,
      { scale: 0, opacity: 0, rotation: -90 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        delay: 0.3,
      }
    );
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto px-6 py-12"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-50 text-red-600 text-sm font-black uppercase tracking-wider mb-8"
        >
          <AlertTriangle size={16} />
          Analyse abgeschlossen
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 tracking-tighter leading-[0.95] mb-6">
          Wir haben{" "}
          <span className="text-red-500 italic">Handlungsbedarf</span>{" "}
          gefunden.
        </h1>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Unsere Analyse über 40+ Plattformen zeigt Optimierungspotenziale
          in{" "}
          <span className="font-bold text-slate-900">4 Kategorien</span>.
        </p>
      </div>

      {/* Global Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-16"
      >
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#f1f5f9"
              strokeWidth="12"
              fill="transparent"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="#EF4444"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={439.8}
              initial={{ strokeDashoffset: 439.8 }}
              animate={{
                strokeDashoffset:
                  439.8 - (439.8 * globalScore) / 100,
              }}
              transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-5xl font-display font-black text-slate-900"
            >
              {globalScore}
            </motion.span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
              von 100
            </span>
          </div>
        </div>
      </motion.div>

      {/* Category Rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {AUDIT_CATEGORIES.map((cat) => (
          <CategoryRing key={cat.key} category={cat} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center"
      >
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 hover:shadow-primary/30 group"
        >
          <Zap size={22} />
          Strategie erstellen
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">
          <ShieldCheck size={12} className="inline mr-1" />
          Basierend auf echten Daten • Keine Schätzungen
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Category Ring Sub-Component ─────────────────────────
function CategoryRing({ category }: { category: AuditCategory }) {
  const Icon = ICON_MAP[category.icon] || Globe;
  const circumference = 2 * Math.PI * 36;

  return (
    <div className="score-ring bg-white border border-slate-100 rounded-[2rem] p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className="relative w-20 h-20 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#f1f5f9"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            stroke={category.color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset:
                circumference -
                (circumference * category.score) / 100,
            }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl font-display font-black"
            style={{ color: category.color }}
          >
            {category.score}
          </span>
        </div>
      </div>
      <h3 className="font-display font-black text-slate-900 text-base mb-1 tracking-tight">
        {category.label}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
        {category.subtitle}
      </p>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <Icon
          size={14}
          className="text-slate-300 group-hover:text-primary transition-colors"
        />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          3 Handlungsfelder
        </span>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
// CELEBRATION VIEW — The Victory Lap
// ═══════════════════════════════════════════════════════════
function CelebrationView({
  totalScore,
  completedCount,
  onContinue,
}: {
  totalScore: number;
  completedCount: number;
  onContinue: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Confetti-like particle burst
    const particles = containerRef.current.querySelectorAll(".celebration-particle");
    gsap.fromTo(
      particles,
      {
        scale: 0,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        scale: () => 0.5 + Math.random() * 1,
        x: () => (Math.random() - 0.5) * 400,
        y: () => (Math.random() - 0.5) * 300,
        rotation: () => Math.random() * 720,
        opacity: 0,
        duration: 2,
        stagger: 0.02,
        ease: "power3.out",
      }
    );
  }, []);

  const particleColors = [
    "#00AF9C",
    "#F59E0B",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
    "#10B981",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center px-6 py-12 max-w-2xl mx-auto relative"
      ref={containerRef}
    >
      {/* Particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {particleColors.flatMap((color, ci) =>
          Array.from({ length: 6 }, (_, i) => (
            <div
              key={`${ci}-${i}`}
              className="celebration-particle absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))
        )}
      </div>

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="w-28 h-28 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/10"
      >
        <Trophy className="text-primary" size={56} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter leading-tight mb-4"
      >
        Fantastisch! 🎉
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-slate-500 text-xl font-medium leading-relaxed mb-10"
      >
        Sie haben{" "}
        <span className="font-bold text-slate-900">{completedCount} Maßnahmen</span>{" "}
        umgesetzt und Ihren Digital-Score um{" "}
        <span className="font-bold text-primary">+{totalScore} Punkte</span>{" "}
        gesteigert!
      </motion.p>

      {/* Score Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="inline-flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-8 py-5 shadow-xl mb-12"
        aria-live="polite"
      >
        <div className="text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Gesamt Impact
          </span>
          <span className="text-3xl font-display font-black text-primary">
            +{totalScore}
          </span>
        </div>
        <div className="w-px h-10 bg-slate-100" />
        <div className="text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Abgeschlossen
          </span>
          <span className="text-3xl font-display font-black text-slate-900">
            {completedCount}/12
          </span>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 hover:shadow-primary/30 group"
        >
          <Sparkles size={20} />
          Weiter mit den nächsten 3 Schritten
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
