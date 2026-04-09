"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DigiScoreGaugeProps {
  score: number;
  size?: number;
}

export function DigiScoreGauge({ score, size = 200 }: DigiScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
        setDisplayScore(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const getColor = (s: number) => {
    if (s < 50) return "stroke-orange-500";
    return "stroke-primary";
  };

  const getGlow = (s: number) => {
    if (s < 50) return "drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]";
    return "drop-shadow-[0_0_20px_rgba(0,175,156,0.3)]";
  };

  return (
    <div className="relative flex items-center justify-center select-none font-sans" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`${getColor(displayScore)} ${getGlow(displayScore)} transition-all duration-700`}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Content */}
      <div className="text-center">
        <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-display font-black text-slate-900 tracking-tighter"
        >
          {Math.round(displayScore)}
        </motion.div>
        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-2">
          Readiness
        </div>
      </div>

      {/* Pulsing Aura */}
      <motion.div 
        animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className={`absolute inset-0 rounded-full border-4 border-primary/20 blur-2xl -z-10`} 
      />
    </div>
  );
}
