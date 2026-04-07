import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const API_BASE = "http://localhost:8000/audit";

export interface RedFlag {
  type: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  platform?: string;
}

export interface AuditSummary {
  report_id: string;
  status: "pending" | "running" | "complete" | "failed";
  progress: number;
  overall_score?: number;
  red_flags_count: number;
  public_flags: RedFlag[];
  detected_data?: {
    detected_name?: string;
    detected_address?: string;
    detected_phone?: string;
  };
}

export function useAudit() {
  const [reportId, setReportId] = useState<string | null>(null);

  const [isStorytellerActive, setIsStorytellerActive] = useState(false);

  const triggerMutation = useMutation({
    mutationFn: async (payload: { url: string; business_name?: string }) => {
      const res = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setReportId(data.reportId);
      setIsStorytellerActive(true);
      
      // Enforce a minimum storyteller time (e.g., 8 seconds for demo purposes)
      // In production, this would be longer (60-90s)
      setTimeout(() => setIsStorytellerActive(false), 8000);
      
      return data.reportId;
    },
  });

  const statusQuery = useQuery({
    queryKey: ["auditStatus", reportId],
    queryFn: async () => {
      if (!reportId) return null;
      const res = await fetch(`${API_BASE}/status/${reportId}`);
      return (await res.json()) as AuditSummary;
    },
    enabled: !!reportId,
    refetchInterval: (query) => {
      if (query.state.data?.status === "complete") return false;
      return 2000;
    },
  });

  return {
    triggerAudit: triggerMutation.mutate,
    isTriggering: triggerMutation.isPending,
    isStorytellerActive,
    auditData: statusQuery.data,
    isLoading: statusQuery.isLoading,
    reportId,
  };
}
