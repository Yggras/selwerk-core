"use client";

import { useSync } from "@/hooks/useSync";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Zap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, isAuthenticated } = useSync();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
        login(email, {
            onSuccess: () => router.push("/dashboard")
        });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
       <button 
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
       >
        <ArrowLeft size={18} />
        Zurück
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
          <div className="flex items-center gap-2 justify-center mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">
                Digital<span className="text-blue-600">Janitor</span>
            </span>
          </div>

          <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-2xl shadow-blue-600/10 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Willkommen zurück</h2>
            <p className="text-slate-500 mb-8">Gib deine E-Mail ein, um zu deinem Dashboard zu gelangen.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@dein-business.de"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all text-lg"
                />
                <button 
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    {isLoggingIn ? "Meldel dich an..." : "Dashboard öffnen"}
                </button>
            </form>
          </div>
          <p className="mt-8 text-center text-slate-400 text-sm">
            Neu hier? Gib einfach deine Email ein, um dich zu registrieren.
          </p>
      </motion.div>
    </main>
  );
}
