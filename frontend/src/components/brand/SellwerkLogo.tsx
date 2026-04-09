"use client";

import React from "react";

interface SellwerkLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SellwerkLogo: React.FC<SellwerkLogoProps> = ({ 
  className = "", 
  showTagline = true,
  size = "md" 
}) => {
  const sizes = {
    sm: { h: "h-6", text: "text-lg", tagline: "text-[8px]" },
    md: { h: "h-10", text: "text-2xl", tagline: "text-[10px]" },
    lg: { h: "h-14", text: "text-4xl", tagline: "text-[12px]" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className={`font-display font-black tracking-tighter text-primary ${currentSize.text}`}>
          SELLWERK
        </span>
        <div className="w-2 h-2 rounded-full bg-primary mt-1" />
      </div>
      {showTagline && (
        <span className={`font-sans font-black tracking-[0.25em] text-primary uppercase mt-0.5 ml-0.5 ${currentSize.tagline}`}>
          Mittelstand
        </span>
      )}
    </div>
  );
};
