"use client";

import { SearchInput } from "@/components/audit/SearchInput";
import { StorytellerLoader } from "@/components/audit/StorytellerLoader";
import { AuditReport } from "@/components/audit/AuditReport";
import { useAudit } from "@/hooks/useAudit";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const { triggerAudit, isTriggering, auditData, reportId, isStorytellerActive } = useAudit();

  const isScanning = isTriggering || isStorytellerActive || (auditData && auditData.status !== "complete");
  const isFinished = !isStorytellerActive && auditData && auditData.status === "complete";

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <nav className="w-full px-6 py-6 flex justify-between items-center border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            Digital<span className="text-blue-600">Janitor</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Wie es funktioniert</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Technologie</a>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-bold">
                Login
            </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!reportId && !isScanning && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl px-6 py-20 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 animate-bounce">
                <Sparkles size={16} />
                Neu: Deep Scan Heuristik v1.0
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Dein digitaler Hausmeister <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">schafft Ordnung.</span>
              </h1>
              <p className="text-slate-500 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Wir scannen deine Online-Präsenz auf über 40 Plattformen und finden Fehler, die dich Kunden kosten. Kostenlos. Sofort.
              </p>

              <SearchInput 
                onSearch={(url) => triggerAudit({ url })} 
                isLoading={isTriggering} 
              />

              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="font-bold text-slate-400 flex items-center gap-2"><ShieldCheck size={18} /> Google Maps Certified</span>
                <span className="font-bold text-slate-400 flex items-center gap-2"><ShieldCheck size={18} /> API First Architecture</span>
                <span className="font-bold text-slate-400 flex items-center gap-2"><ShieldCheck size={18} /> GDPR Compliant</span>
              </div>
            </motion.div>
          )}

          {isScanning && !isFinished && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <StorytellerLoader progress={auditData?.progress || 10} />
            </motion.div>
          )}

          {isFinished && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <AuditReport data={auditData!} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        © 2024 Digital Janitor Labs • All rights reserved. • "Put your business on Autopilot."
      </footer>
    </main>
  );
}
