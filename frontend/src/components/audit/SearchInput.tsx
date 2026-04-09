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
      className="relative w-full max-w-3xl mx-auto group"
    >
      <div className="absolute inset-0 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500 rounded-full" />
      <div className="relative flex items-center bg-white border border-slate-200 shadow-2xl shadow-primary/5 rounded-2xl p-2.5 transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary">
        <div className="pl-5 pr-3 text-slate-400">
          <Search size={22} className="group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder || "Geben Sie Ihre Website-URL ein (z.B. mueller-brot.de)"}
          disabled={isLoading}
          className="flex-1 bg-transparent py-4 px-2 outline-none text-slate-800 text-lg placeholder:text-slate-400 disabled:opacity-50 font-medium"
        />
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className={cn(
            "flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300",
            url.trim() && !isLoading
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Check starten
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
