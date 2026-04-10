"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ALL_ACTION_ITEMS,
  getProductTourBatch,
  type ActionItem,
} from "@/mocks/auditMockData";

// ─── State Machine ───────────────────────────────────────
export type OnboardingPhase =
  | "INITIAL"        // Has not scanned yet
  | "SCANNING"       // Audit in progress
  | "DISCOVERY"      // Score Card ("Ouch!" phase)
  | "PRIORITIES"     // Action Item Wall (current batch)
  | "CELEBRATION"    // Victory Lap after completing a batch
  | "COMPLETE";      // All 12 items done

interface OnboardingState {
  phase: OnboardingPhase;
  completedIds: string[];
  currentBatchIndex: number; // Which batch we're on (0, 1, 2, 3...)
  totalScore: number;        // Accumulated impact score
}

const STORAGE_KEY = "sellwerk_onboarding";
const INITIAL_STATE: OnboardingState = {
  phase: "INITIAL",
  completedIds: [],
  currentBatchIndex: 0,
  totalScore: 0,
};

function loadState(): OnboardingState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return JSON.parse(raw) as OnboardingState;
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: OnboardingState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Hook ────────────────────────────────────────────────
export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    setState(saved);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (isHydrated) {
      saveState(state);
    }
  }, [state, isHydrated]);

  // ── Derived Data ─────────────────────────────────────
  const currentBatch: ActionItem[] = getProductTourBatch(state.completedIds);
  const allDone = state.completedIds.length >= ALL_ACTION_ITEMS.length;
  const batchCompleteCount = currentBatch.filter((item) =>
    state.completedIds.includes(item.id)
  ).length;

  // ── Actions ──────────────────────────────────────────

  const startScan = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "SCANNING" }));
  }, []);

  const showDiscovery = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "DISCOVERY" }));
  }, []);

  const showPriorities = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "PRIORITIES" }));
  }, []);

  const completeItem = useCallback((itemId: string) => {
    setState((prev) => {
      if (prev.completedIds.includes(itemId)) return prev;

      const item = ALL_ACTION_ITEMS.find((i) => i.id === itemId);
      const newCompletedIds = [...prev.completedIds, itemId];
      const newScore = prev.totalScore + (item?.impact || 0);

      // Check if the current batch is now fully completed
      const nextBatch = getProductTourBatch(newCompletedIds);
      const batchJustCompleted =
        newCompletedIds.length > 0 &&
        newCompletedIds.length % 3 === 0 &&
        newCompletedIds.length !== prev.completedIds.length;

      // Check if ALL items are done
      const isAllDone = newCompletedIds.length >= ALL_ACTION_ITEMS.length;

      let newPhase: OnboardingPhase = prev.phase;
      if (isAllDone) {
        newPhase = "COMPLETE";
      } else if (batchJustCompleted) {
        newPhase = "CELEBRATION";
      }

      return {
        ...prev,
        completedIds: newCompletedIds,
        totalScore: newScore,
        phase: newPhase,
        currentBatchIndex: batchJustCompleted
          ? prev.currentBatchIndex + 1
          : prev.currentBatchIndex,
      };
    });
  }, []);

  const continueAfterCelebration = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "PRIORITIES" }));
  }, []);

  const dismissOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "COMPLETE" }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // State
    phase: state.phase,
    completedIds: state.completedIds,
    totalScore: state.totalScore,
    currentBatchIndex: state.currentBatchIndex,
    isHydrated,

    // Derived
    currentBatch,
    allDone,
    batchCompleteCount,

    // Actions
    startScan,
    showDiscovery,
    showPriorities,
    completeItem,
    continueAfterCelebration,
    dismissOnboarding,
    resetOnboarding,
  };
}
