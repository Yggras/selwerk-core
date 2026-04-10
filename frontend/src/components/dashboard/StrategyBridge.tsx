"use client";

import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowLeft, CheckCircle2, X } from "lucide-react";
import { getItemByMissionKey } from "@/mocks/auditMockData";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Strategy Bridge ─────────────────────────────────────
// High-contrast top bar that appears when a user arrives
// at a module via a "Fix Now" action item deep-link.
// Reads ?mission=<key> from the URL.
// ──────────────────────────────────────────────────────────

export function StrategyBridge() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const missionKey = searchParams.get("mission");
  const [dismissed, setDismissed] = useState(false);

  if (!missionKey || dismissed) return null;

  const item = getItemByMissionKey(missionKey);
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-primary-dark text-white px-8 py-4 flex items-center gap-6 relative z-[60] shadow-xl shadow-primary-dark/10"
      >
        {/* Mission Icon */}
        <div className="w-10 h-10 bg-primary/30 rounded-xl flex items-center justify-center shrink-0">
          <Target size={20} className="text-primary" />
        </div>

        {/* Mission Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Aktuelle Mission
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              •
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              +{item.impact} Impact
            </span>
          </div>
          <p className="text-sm font-bold text-white/90 truncate">
            {item.title}
          </p>
        </div>

        {/* Back to Strategy */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft size={14} />
          Zurück zur Strategie
        </button>

        {/* Done */}
        <button
          onClick={() => {
            setDismissed(true);
            router.push("/dashboard");
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20"
        >
          <CheckCircle2 size={14} />
          Erledigt
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-all"
          aria-label="Schließen"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
