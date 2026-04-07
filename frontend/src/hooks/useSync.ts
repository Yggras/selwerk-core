import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAudit } from "./useAudit";

const API_BASE = "http://localhost:8000/sync";

export interface SyncStatus {
    job_id: string;
    status: "processing" | "paid" | "completed";
    progress: number;
    platform_status: Record<string, string>;
}

export function useSync() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [shadowId, setShadowId] = useState<string | null>(null);

  useEffect(() => {
    let sid = localStorage.getItem("shadow_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("shadow_id", sid);
    }
    setShadowId(sid);
  }, []);

  const profileQuery = useQuery({
    queryKey: ["profile", shadowId],
    queryFn: async () => {
      if (!shadowId) return null;
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { "shadow-id": shadowId }
      });
      return await res.json();
    },
    enabled: !!shadowId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "shadow-id": shadowId || "" 
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    },
  });

  const triggerSyncMutation = useMutation({
    mutationFn: async (payload: { profile_id: string; email: string }) => {
      const res = await fetch(`${API_BASE}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setJobId(data.job_id);
      return data;
    },
  });

  const simulatePaymentMutation = useMutation({
    mutationFn: async (jid: string) => {
        const res = await fetch(`${API_BASE}/simulate-payment/${jid}`, {
            method: "POST"
        });
        return await res.json();
    }
  });

  const statusQuery = useQuery({
    queryKey: ["syncStatus", jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const res = await fetch(`${API_BASE}/status/${jobId}`);
      return (await res.json()) as SyncStatus;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      if (query.state.data?.status === "completed") return false;
      return 2000;
    },
  });

  return {
    profile: profileQuery.data,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    triggerSync: triggerSyncMutation.mutate,
    isTriggering: triggerSyncMutation.isPending,
    syncData: statusQuery.data,
    jobId,
    simulatePayment: () => jobId && simulatePaymentMutation.mutate(jobId),
    isPaid: statusQuery.data?.status === "paid" || statusQuery.data?.status === "completed"
  };
}
