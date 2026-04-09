"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Clock, Zap, ArrowRight, Camera, MessageSquare, Calendar } from "lucide-react";

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
}

export function GrowthFeed({ recommendations, onComplete, isLoading }: GrowthFeedProps) {
  
  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("foto")) return <Camera className="text-blue-500" size={20} />;
    if (title.toLowerCase().includes("review")) return <MessageSquare className="text-indigo-500" size={20} />;
    if (title.toLowerCase().includes("zeit")) return <Calendar className="text-orange-500" size={20} />;
    return <Zap className="text-amber-500" size={20} />;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-blue-600" size={20} />
            Top Prioritäten für dich
        </h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {recommendations.length} Action Items
        </span>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Impact Badge */}
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">
                    +{rec.impact} Score
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {getIcon(rec.title)}
                </div>
                
                <div className="flex-1 pr-12">
                  <h4 className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Clock size={12}/> ~2 Min</span>
                    <span className="flex items-center gap-1"><Zap size={12}/> High Impact</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                <button 
                  onClick={() => onComplete(rec.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all group/btn"
                >
                  {isLoading ? "Verarbeite..." : (
                    <>
                        Erledigt markieren
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {recommendations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Check className="text-green-500" size={32} />
            </div>
            <h4 className="font-bold text-slate-800">Alles erledigt!</h4>
            <p className="text-sm text-slate-400 mt-1">Du hast alle aktuellen Vorschläge gefressen. Dein Business glänzt.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
