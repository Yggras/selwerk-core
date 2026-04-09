"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, TrendingUp, ArrowRight, Camera, MessageSquare, Calendar, Star } from "lucide-react";

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
    if (title.toLowerCase().includes("foto")) return <Camera className="text-primary" size={20} />;
    if (title.toLowerCase().includes("review")) return <MessageSquare className="text-primary" size={20} />;
    if (title.toLowerCase().includes("zeit")) return <Calendar className="text-primary" size={20} />;
    return <Star className="text-primary" size={20} />;
  };

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-2xl font-display font-black text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-primary" size={24} />
            Wachstums-Impulse
        </h3>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {recommendations.length} Strategien
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
              className="group relative bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
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
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><Clock size={12}/> ~2 Min</span>
                    <span className="flex items-center gap-1.5 text-primary"><TrendingUp size={12}/> High Visibility</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                <button 
                  onClick={() => onComplete(rec.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary transition-all group/btn shadow-lg shadow-slate-900/10 hover:shadow-primary/20"
                >
                  {isLoading ? "Synchronisiere..." : (
                    <>
                        Umsetzung bestätigen
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
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
            className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50">
                <Check className="text-primary" size={40} />
            </div>
            <h4 className="text-2xl font-display font-black text-slate-900">Aktuell alles optimal!</h4>
            <p className="text-slate-500 font-medium mt-2">Sie haben alle Empfehlungen umgesetzt. Wir informieren Sie bei neuen Potenzialen.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
