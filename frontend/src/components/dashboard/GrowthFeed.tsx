"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Clock,
  TrendingUp,
  ChevronRight,
  Camera,
  MessageSquare,
  Calendar,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category?: "listing" | "reputation" | "social" | "website";
  severity?: "high" | "medium" | "low";
  platform?: string;
  target_route?: string;
  cta_label?: string;
  mission_key?: string;
  impact: number;
  status: "pending" | "completed";
}

interface GrowthFeedProps {
  recommendations: Recommendation[];
}

export function GrowthFeed({ recommendations }: GrowthFeedProps) {
  const router = useRouter();

  const categoryLabel: Record<NonNullable<Recommendation["category"]>, string> = {
    listing: "Praesenz",
    reputation: "Reputation",
    social: "Social",
    website: "Website",
  };

  const severityLabel: Record<NonNullable<Recommendation["severity"]>, string> = {
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("foto"))
      return <Camera className="text-primary" size={20} />;
    if (title.toLowerCase().includes("review"))
      return <MessageSquare className="text-primary" size={20} />;
    if (title.toLowerCase().includes("zeit"))
      return <Calendar className="text-primary" size={20} />;
    return <Star className="text-primary" size={20} />;
  };

  const goToTaskRoute = (rec: Recommendation) => {
    if (!rec.target_route) return;

    const missionParam = rec.mission_key
      ? `?mission=${encodeURIComponent(rec.mission_key)}`
      : "";
    router.push(`${rec.target_route}${missionParam}`);
  };

  const totalItems = recommendations.length;

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-2xl font-display font-black text-slate-900 flex items-center gap-3">
          <TrendingUp className="text-primary" size={24} />
          Priorisierte Aufgaben
        </h3>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          {totalItems} Aufgaben
        </span>
      </div>

      <div className="grid gap-5">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
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

                  <div className="flex flex-wrap items-center gap-3 mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                      <Clock size={12} /> ~2 Min
                    </span>
                    <span className="flex items-center gap-1.5 text-primary">
                      <TrendingUp size={12} /> High Visibility
                    </span>
                    {rec.category && (
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg text-slate-600">
                        {categoryLabel[rec.category]}
                      </span>
                    )}
                    {rec.severity && (
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg text-slate-600">
                        Prioritaet {severityLabel[rec.severity]}
                      </span>
                    )}
                    {rec.platform && (
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg text-slate-600">
                        {rec.platform}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-3 justify-end">
                {rec.target_route && (
                  <button
                    onClick={() => goToTaskRoute(rec)}
                    className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 px-5 py-3 rounded-xl text-sm font-bold hover:border-primary/30 hover:text-primary transition-all"
                  >
                    {rec.cta_label || "Jetzt beheben"}
                    <ChevronRight size={16} />
                  </button>
                )}
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
