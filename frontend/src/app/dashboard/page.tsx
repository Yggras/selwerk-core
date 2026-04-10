"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { SearchInput } from "@/components/audit/SearchInput";
import { StorytellerLoader } from "@/components/audit/StorytellerLoader";
import { useAudit } from "@/hooks/useAudit";
import { useSync } from "@/hooks/useSync";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  TrendingUp,
  CheckCircle2,
  Settings,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { DigiScoreGauge } from "@/components/dashboard/DigiScoreGauge";
import { GrowthFeed } from "@/components/dashboard/GrowthFeed";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";

interface IngestResult {
  recommendations_count?: number;
  new_score?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { triggerAudit, isTriggering, auditData, isStorytellerActive } = useAudit();
  const {
    profile,
    isAuthenticated,
    logout,
    userEmail: activeEmail,
    recommendations,
    ingestAudit,
    isIngesting,
  } = useSync();
  const [insightsBanner, setInsightsBanner] = useState<{
    recommendationsCount: number;
    score: number | null;
  } | null>(null);
  const pendingUrlHandledRef = useRef(false);
  const ingestedReportRef = useRef<string | null>(null);

  const prioritizedRecommendations = useMemo(
    () => [...recommendations].sort((a, b) => b.impact - a.impact),
    [recommendations]
  );

  const isAuditOverlayVisible =
    (isTriggering ||
      isStorytellerActive ||
      (auditData?.status !== undefined &&
        auditData.status !== "complete" &&
        auditData.status !== "failed")) &&
    !isIngesting;

  const isIngestOverlayVisible = isIngesting;

  // Auto-Scan Logic
  useEffect(() => {
    if (!isAuthenticated || pendingUrlHandledRef.current) return;

    const pendingUrl = sessionStorage.getItem("pending_url");
    pendingUrlHandledRef.current = true;

    if (pendingUrl) {
      triggerAudit({ url: pendingUrl });
      sessionStorage.removeItem("pending_url");
    }
  }, [isAuthenticated, triggerAudit]);

  // Transform completed scan into backend recommendations
  useEffect(() => {
    if (!auditData || auditData.status !== "complete" || isStorytellerActive) {
      return;
    }

    if (!activeEmail || !auditData.report_id) {
      return;
    }

    if (ingestedReportRef.current === auditData.report_id) {
      return;
    }

    const reportId = auditData.report_id;
    ingestedReportRef.current = reportId;

    ingestAudit({ report_id: reportId, email: activeEmail })
      .then((result: IngestResult) => {
        setInsightsBanner({
          recommendationsCount:
            result.recommendations_count ?? prioritizedRecommendations.length,
          score: result.new_score ?? profile?.digi_score ?? null,
        });
      })
      .catch((error) => {
        ingestedReportRef.current = null;
        console.error("Ingestion failed", error);
      });
  }, [
    auditData,
    isStorytellerActive,
    activeEmail,
    ingestAudit,
    prioritizedRecommendations.length,
    profile?.digi_score,
  ]);

  const handleSearch = (url: string) => {
    setInsightsBanner(null);
    triggerAudit({ url });
  };

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <AnimatePresence>
        {isAuditOverlayVisible && (
          <motion.div
            key="scan-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-xl px-6 py-12"
          >
            <div className="h-full w-full max-w-6xl mx-auto flex items-center justify-center">
              <StorytellerLoader progress={auditData?.progress || 10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isIngestOverlayVisible && (
          <motion.div
            key="ingest-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-white/95 backdrop-blur-xl flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center p-16 bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-xl mx-auto"
            >
              <div className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center mb-10 shadow-xl shadow-primary/20">
                <TrendingUp className="text-white animate-bounce" size={48} />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tighter leading-none">
                Analysen werden aufbereitet...
              </h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Wir wandeln Ihre Scan-Ergebnisse gerade in priorisierte Aufgaben
                um.
              </p>
              <div className="mt-10 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-2.5 h-2.5 bg-primary rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => router.push("/")}>
          <SellwerkLogo size="md" />
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end hidden sm:flex border-r border-slate-100 pr-6">
                    <span className="text-xs font-black text-slate-800 tracking-tight">{activeEmail}</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Premium Profil</span>
                </div>
                <button 
                    onClick={() => { logout(); router.push("/"); }}
                    className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10 px-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                <CheckCircle2 size={16} />
                Tool-Dashboard
              </div>
              <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter leading-none">
                Wachstums-Engine
              </h2>
              <p className="text-slate-500 font-medium text-lg mt-3">
                Scannen, priorisieren, umsetzen - alles in einer klaren
                Aufgabenliste.
              </p>
            </div>
            <div className="w-full md:w-[450px]">
              <SearchInput
                onSearch={handleSearch}
                isLoading={isTriggering}
                placeholder="Weitere Domain prüfen..."
              />
            </div>
          </div>

          {insightsBanner && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mb-10 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                  Neue Insights Verfuegbar
                </p>
                <p className="text-slate-800 font-bold leading-relaxed">
                  {insightsBanner.recommendationsCount} neue Aufgabe
                  {insightsBanner.recommendationsCount === 1 ? "" : "n"} aus
                  dem letzten Scan wurden priorisiert.
                  {insightsBanner.score !== null ? (
                    <span className="text-slate-500 font-medium">
                      {" "}
                      Aktueller Digi-Score: {insightsBanner.score}.
                    </span>
                  ) : null}
                </p>
              </div>
              <button
                onClick={() => setInsightsBanner(null)}
                className="self-start md:self-center p-2 rounded-lg hover:bg-primary/10 text-slate-500 hover:text-primary transition-colors"
                aria-label="Hinweis schließen"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Sidebar / Stats */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />
                <DigiScoreGauge score={profile?.digi_score || 0} isCalculating={false} />
                <div className="mt-8">
                  <h4 className="text-2xl font-display font-black text-slate-900 tracking-tight">
                    Digital Readiness
                  </h4>
                  <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                    {profile?.digi_score < 80
                      ? "Optimieren Sie Ihre Daten für bessere Rankings."
                      : "Hervorragend! Die Basis ist solide."}
                  </p>
                </div>
              </div>

              {/* ── Master Profile CTA ──────── */}
              <button
                id="master-profile-cta"
                onClick={() => router.push("/dashboard/profile")}
                className="w-full bg-white border-2 border-dashed border-primary/20 text-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 text-left"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <Settings size={20} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Master-Profil
                  </span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed mb-6 relative z-10 text-sm">
                  Stammdaten zentral verwalten und auf alle Plattformen
                  synchronisieren.
                </p>
                <div className="flex items-center gap-2 text-primary font-bold text-sm relative z-10 group-hover:gap-3 transition-all">
                  Profil bearbeiten
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <div className="bg-primary-dark border border-primary-dark/20 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,175,156,0.2)]">
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                <TrendingUp className="absolute top-6 right-6 text-primary opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500" size={56} />
                <h4 className="font-display font-black text-xl mb-4 tracking-tight">
                  SELLWERK Pro
                </h4>
                <p className="text-white/60 font-medium leading-relaxed mb-8 relative z-10">
                  Automatische Synchronisierung auf 42+ Plattformen und
                  taegliches Monitoring.
                </p>
                <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-sm font-bold text-primary">
                  <ShieldCheck size={18} />
                  <span className="uppercase tracking-widest">
                    Premium Schutz Aktiv
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content / Task List */}
            <div className="lg:col-span-8">
              <GrowthFeed
                recommendations={prioritizedRecommendations}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="w-full py-10 text-center text-slate-400 text-sm border-t border-slate-100 bg-slate-50 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center opacity-70 grayscale">
          <SellwerkLogo size="sm" showTagline={false} />
          <p>© 2024 SELLWERK • Partner des Mittelstands.</p>
        </div>
      </footer>
    </main>
  );
}
