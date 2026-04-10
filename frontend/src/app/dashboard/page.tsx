"use client";

import { useState, useEffect } from "react";
import { SearchInput } from "@/components/audit/SearchInput";
import { StorytellerLoader } from "@/components/audit/StorytellerLoader";
import { AuditReport } from "@/components/audit/AuditReport";
import { ProfileEditor } from "@/components/sync/ProfileEditor";
import { SyncDashboard } from "@/components/sync/SyncDashboard";
import { useAudit } from "@/hooks/useAudit";
import { useSync } from "@/hooks/useSync";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LogOut, TrendingUp, CheckCircle2, Settings, ArrowRight } from "lucide-react";
import { DigiScoreGauge } from "@/components/dashboard/DigiScoreGauge";
import { GrowthFeed } from "@/components/dashboard/GrowthFeed";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useRouter } from "next/navigation";
import { SellwerkLogo } from "@/components/brand/SellwerkLogo";

export default function DashboardPage() {
  const router = useRouter();
  const { triggerAudit, isTriggering, auditData, isStorytellerActive } = useAudit();
  const { 
    profile, updateProfile, triggerSync, syncData, isPaid, simulatePayment,
    isAuthenticated, logout, userEmail: activeEmail, recommendations, completeRecommendation,
    ingestAudit, isIngesting, isCompletingRec
  } = useSync();

  const onboarding = useOnboarding();

  const [view, setView] = useState<"initial" | "scanning" | "ingesting" | "report" | "editor" | "sync" | "dashboard">("dashboard");
  const [userEmail, setUserEmail] = useState("");

  // Auto-Scan Logic
  useEffect(() => {
    const pendingUrl = sessionStorage.getItem("pending_url");
    if (pendingUrl && isAuthenticated) {
      triggerAudit({ url: pendingUrl });
      sessionStorage.removeItem("pending_url");
      setView("scanning");
    }
  }, [isAuthenticated, triggerAudit]);

  // Handle Transitions based on Audit state
  useEffect(() => {
    if (isTriggering || isStorytellerActive || (auditData && auditData.status !== "complete")) {
      setView("scanning");
    } else if (auditData && auditData.status === "complete" && !isStorytellerActive && view === "scanning") {
        const performIngest = async () => {
            setView("ingesting");
            try {
                await ingestAudit({ report_id: auditData.report_id, email: activeEmail || "" });
                // Transition to Discovery phase after ingest
                setTimeout(() => {
                  onboarding.showDiscovery();
                  setView("dashboard");
                }, 1500);
            } catch (err) {
                console.error("Ingestion failed", err);
                onboarding.showDiscovery();
                setView("dashboard");
            }
        };
        performIngest();
    }
  }, [isTriggering, isStorytellerActive, auditData, view, ingestAudit, activeEmail, onboarding]);

  const handleStartEditing = (email: string) => {
    setUserEmail(email);
    setView("editor");
  };

  const handleStartSync = (data: any) => {
    updateProfile(data, {
      onSuccess: (p: any) => {
        triggerSync({ profile_id: p.id, email: userEmail || activeEmail || "" });
        setView("sync");
      }
    });
  };

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => router.push("/")}>
          <SellwerkLogo size="md" />
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            {view === "sync" && <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold animate-pulse">Live Sync Aktiv</span>}
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
        {/* ── Onboarding Wizard Overlay (Discovery + Celebration only) ── */}
        <AnimatePresence>
          {onboarding.isHydrated && (onboarding.phase === "DISCOVERY" || onboarding.phase === "CELEBRATION") && (
            <OnboardingWizard
              phase={onboarding.phase as "DISCOVERY" | "CELEBRATION"}
              totalScore={onboarding.totalScore}
              completedCount={onboarding.completedIds.length}
              onShowPriorities={onboarding.showPriorities}
              onContinue={onboarding.continueAfterCelebration}
              onDismiss={onboarding.dismissOnboarding}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === "scanning" && (
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

          {view === "ingesting" && (
              <motion.div 
                key="ingesting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-16 bg-white rounded-[2rem] shadow-2xl border border-slate-100 max-w-xl mx-auto"
              >
                  <div className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center mb-10 shadow-xl shadow-primary/20">
                      <TrendingUp className="text-white animate-bounce" size={48} />
                  </div>
                  <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tighter leading-none">Analysen werden aufbereitet...</h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">
                      Wir wandeln Ihre Scan-Ergebnisse gerade in strategische Wachstumsschritte um.
                  </p>
                  <div className="mt-10 flex justify-center gap-2">
                      {[0, 1, 2].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="w-2.5 h-2.5 bg-primary rounded-full"
                          />
                      ))}
                  </div>
              </motion.div>
          )}

          {view === "report" && auditData && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <AuditReport data={auditData} onUnlock={handleStartEditing} isGated={false} />
            </motion.div>
          )}

          {view === "editor" && (
              <motion.div key="editor" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full">
                  <ProfileEditor 
                    initialData={{
                        business_name: profile?.business_name || auditData?.detected_data?.detected_name,
                        address: profile?.address || auditData?.detected_data?.detected_address,
                        phone: profile?.phone || auditData?.detected_data?.detected_phone,
                    }}
                    onSave={() => setView("dashboard")}
                  />
              </motion.div>
          )}

          {view === "sync" && (
              <motion.div key="sync" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                  <SyncDashboard 
                    progress={syncData?.progress || 0}
                    platformStatus={syncData?.platform_status || {}}
                    isPaid={isPaid}
                    onSimulatePayment={simulatePayment}
                  />
              </motion.div>
          )}

          {view === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl">
                  {/* Dashboard Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 px-4">
                      <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                          <CheckCircle2 size={16} />
                          Live Analyse Aktiv
                        </div>
                        <h2 className="text-5xl font-display font-black text-slate-900 tracking-tighter leading-none">Wachstums-Engine</h2>
                        <p className="text-slate-500 font-medium text-lg mt-3">Steigern Sie Ihre regionale Sichtbarkeit im Mittelstand.</p>
                      </div>
                      <div className="w-full md:w-[450px]">
                        <SearchInput 
                            onSearch={(url) => triggerAudit({ url })} 
                            isLoading={isTriggering} 
                            placeholder="Weitere Domain prüfen..."
                        />
                      </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-10">
                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />
                           <DigiScoreGauge score={profile?.digi_score || 0} isCalculating={isCompletingRec} />
                           <div className="mt-8">
                                <h4 className="text-2xl font-display font-black text-slate-900 tracking-tight">Digital Readiness</h4>
                                <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                                    {profile?.digi_score < 80 ? "Optimieren Sie Ihre Daten für bessere Rankings." : "Hervorragend! Die Basis ist solide."}
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
                                <span className="text-sm font-black uppercase tracking-widest text-slate-800">Master-Profil</span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed mb-6 relative z-10 text-sm">
                                Stammdaten zentral verwalten und auf alle Plattformen synchronisieren.
                            </p>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm relative z-10 group-hover:gap-3 transition-all">
                                Profil bearbeiten
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <div className="bg-primary-dark border border-primary-dark/20 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,175,156,0.2)]">
                            {/* Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <TrendingUp className="absolute top-6 right-6 text-primary opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500" size={56} />
                            <h4 className="font-display font-black text-xl mb-4 tracking-tight">SELLWERK Pro</h4>
                            <p className="text-white/60 font-medium leading-relaxed mb-8 relative z-10">
                                Automatische Synchronisierung auf 42+ Plattformen und tägliches Monitoring.
                            </p>
                            <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-sm font-bold text-primary">
                                <ShieldCheck size={18} />
                                <span className="uppercase tracking-widest">Premium Schutz Aktiv</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Feed */}
                    <div className="lg:col-span-8">
                        <GrowthFeed 
                            recommendations={recommendations} 
                            onComplete={completeRecommendation}
                            isLoading={isCompletingRec}
                            actionItems={onboarding.currentBatch}
                            completedActionIds={onboarding.completedIds}
                            onActionComplete={onboarding.completeItem}
                            batchIndex={onboarding.currentBatchIndex}
                        />
                    </div>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>
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
