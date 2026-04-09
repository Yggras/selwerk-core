"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchInputProps {
  onSearch: (url: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchInput({ onSearch, isLoading, placeholder }: SearchInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto group"
    >
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl group-hover:bg-blue-500/30 transition-all duration-500 rounded-full" />
      <div className="relative flex items-center bg-white border border-slate-200 shadow-xl shadow-blue-500/5 rounded-2xl p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        <div className="pl-4 pr-2 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder || "Gib deine Website-URL ein (z.B. mueller-brot.de)"}
          disabled={isLoading}
          className="flex-1 bg-transparent py-3 px-2 outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
            url.trim() && !isLoading
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:translate-x-1"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Scan starten
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
