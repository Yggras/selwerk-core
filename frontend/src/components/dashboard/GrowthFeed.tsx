"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Clock,
  TrendingUp,
  ArrowRight,
  Camera,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Share2,
  Globe,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ActionItem } from "@/mocks/auditMockData";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: number;
  status: "pending" | "completed";
}

interface GrowthFeedProps {
  recommendations: Recommendation[];
  onComplete: (id: string) => void;
  isLoading?: boolean;
  // ── Onboarding Action Items ──────────
  actionItems?: ActionItem[];
  completedActionIds?: string[];
  onActionComplete?: (id: string) => void;
  batchIndex?: number;
}

// ─── Category config ─────────────────────────────────────
const catConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  listing: { icon: MapPin, color: "#EF4444", label: "Präsenz-Tiefe" },
  reputation: { icon: Star, color: "#F59E0B", label: "Kunden-Vertrauen" },
  social: { icon: Share2, color: "#3B82F6", label: "Digitale Reichweite" },
  website: { icon: Globe, color: "#8B5CF6", label: "Web-Integrität" },
};

const severityConfig: Record<
  string,
  { text: string; label: string }
> = {
  critical: { text: "text-red-600", label: "Kritisch" },
  high: { text: "text-amber-600", label: "Hoch" },
  medium: { text: "text-blue-600", label: "Mittel" },
  low: { text: "text-slate-500", label: "Niedrig" },
};

export function GrowthFeed({
  recommendations,
  onComplete,
  isLoading,
  actionItems = [],
  completedActionIds = [],
  onActionComplete,
  batchIndex = 0,
}: GrowthFeedProps) {
  const router = useRouter();

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("foto"))
      return <Camera className="text-primary" size={20} />;
    if (title.toLowerCase().includes("review"))
      return <MessageSquare className="text-primary" size={20} />;
    if (title.toLowerCase().includes("zeit"))
      return <Calendar className="text-primary" size={20} />;
    return <Star className="text-primary" size={20} />;
  };

  const totalItems = actionItems.length + recommendations.length;
  const hasActionItems = actionItems.length > 0;

  const handleFixNow = (item: ActionItem) => {
    onActionComplete?.(item.id);
    router.push(`${item.target_route}?mission=${item.mission_key}`);
  };

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-2xl font-display font-black text-slate-900 flex items-center gap-3">
          <TrendingUp className="text-primary" size={24} />
          Wachstums-Impulse
        </h3>
        <div className="flex items-center gap-3">
          {hasActionItems && (
            <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
              <Sparkles size={12} />
              Batch {batchIndex + 1}
            </span>
          )}
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {totalItems} Strategien
          </span>
        </div>
      </div>

      {/* ── Progress bar (only when action items exist) ── */}
      {hasActionItems && (
        <div className="flex items-center gap-3 px-2 mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Fortschritt
          </span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedActionIds.length / 12) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-black text-primary">
            {completedActionIds.length}/12
          </span>
        </div>
      )}

      <div className="grid gap-5">
        <AnimatePresence mode="popLayout">
          {/* ── Onboarding Action Items (priority) ──── */}
          {actionItems.map((item, index) => {
            const isCompleted = completedActionIds.includes(item.id);
            const severity = severityConfig[item.severity];
            const cat = catConfig[item.category];
            const CatIcon = cat.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-white/70 backdrop-blur-md border p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 overflow-hidden ${
                  isCompleted
                    ? "border-primary/30 bg-primary/5 opacity-60"
                    : "border-white/60 hover:shadow-[0_20px_40px_rgba(0,175,156,0.1)] hover:-translate-y-2 hover:scale-[1.01]"
                }`}
              >
                {/* Impact Badge */}
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    +{item.impact} Impact
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Category Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundColor: cat.color + "15" }}
                  >
                    <CatIcon size={24} style={{ color: cat.color }} />
                  </div>

                  <div className="flex-1 pr-16">
                    {/* Category + Severity Labels */}
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-[10px] font-black uppercase tracking-[0.15em]"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.15em] ${severity.text}`}
                      >
                        {severity.label}
                      </span>
                    </div>
                    <h4 className="font-display font-black text-slate-900 text-xl leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-5 mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                        <Zap size={12} /> ~2 Min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                  <button
                    onClick={() => handleFixNow(item)}
                    disabled={isCompleted}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all group/btn shadow-lg ${
                      isCompleted
                        ? "bg-primary/20 text-primary cursor-default shadow-none"
                        : "bg-slate-900 text-white hover:bg-primary shadow-slate-900/10 hover:shadow-primary/20"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check size={16} />
                        Erledigt
                      </>
                    ) : (
                      <>
                        {item.cta_label}
                        <ChevronRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* ── Regular Recommendations ─────────────── */}
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: (actionItems.length + index) * 0.1 }}
              className="group relative bg-white/70 backdrop-blur-md border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,175,156,0.1)] hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 overflow-hidden"
            >
              {/* Impact Badge */}
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  +{rec.impact} Impact
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-500 shrink-0">
                  {getIcon(rec.title)}
                </div>

                <div className="flex-1 pr-16">
                  <h4 className="font-display font-black text-slate-900 text-xl leading-tight group-hover:text-primary transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="flex items-center gap-5 mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                      <Clock size={12} /> ~2 Min
                    </span>
                    <span className="flex items-center gap-1.5 text-primary">
                      <TrendingUp size={12} /> High Visibility
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => onComplete(rec.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary transition-all group/btn shadow-lg shadow-slate-900/10 hover:shadow-primary/20"
                >
                  {isLoading ? (
                    "Synchronisiere..."
                  ) : (
                    <>
                      Umsetzung bestätigen
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {totalItems === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50">
              <Check className="text-primary" size={40} />
            </div>
            <h4 className="text-2xl font-display font-black text-slate-900">
              Aktuell alles optimal!
            </h4>
            <p className="text-slate-500 font-medium mt-2">
              Sie haben alle Empfehlungen umgesetzt. Wir informieren Sie bei
              neuen Potenzialen.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
