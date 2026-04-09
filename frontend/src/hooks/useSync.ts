import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAudit } from "./useAudit";

const API_BASE = "http://localhost:8000/sync";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: number;
  status: "pending" | "completed";
}

export interface SyncStatus {
    job_id: string;
    status: "processing" | "paid" | "completed";
    progress: number;
    platform_status: Record<string, string>;
}

export function useSync() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [shadowId, setShadowId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let sid = localStorage.getItem("shadow_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("shadow_id", sid);
    }
    setShadowId(sid);

    // RESTORE SESSION
    const savedEmail = localStorage.getItem("user_email");
    const savedToken = localStorage.getItem("user_token");
    if (savedEmail && savedToken) {
        setEmail(savedEmail);
        setToken(savedToken);
    }
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

  const magicLoginMutation = useMutation({
    mutationFn: async (mail: string) => {
      const res = await fetch(`http://localhost:8000/sync/auth/magic-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: mail }),
      });
      const data = await res.json();
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_token", data.token);
      document.cookie = `auth-token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      setEmail(data.email);
      setToken(data.token);
      return data;
    }
  });

  const recommendationsQuery = useQuery({
    queryKey: ["recommendations", email],
    queryFn: async () => {
      if (!email) return [];
      const res = await fetch(`${API_BASE}/recommendations?email=${email}`);
      return await res.json();
    },
    enabled: !!email,
  });

  const completeRecMutation = useMutation({
    mutationFn: async (recId: string) => {
      const res = await fetch(`${API_BASE}/recommendations/${recId}/complete`, {
          method: "POST"
      });
      return await res.json();
    },
    onSuccess: () => {
        recommendationsQuery.refetch();
        profileQuery.refetch();
    }
  });

  const ingestAuditMutation = useMutation({
    mutationFn: async (payload: { report_id: string; email: string }) => {
      const res = await fetch(`${API_BASE}/ingest-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    },
    onSuccess: () => {
        profileQuery.refetch();
        recommendationsQuery.refetch();
    }
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
    isPaid: statusQuery.data?.status === "paid" || statusQuery.data?.status === "completed",
    
    // AUTH & DASHBOARD
    isAuthenticated: !!email && !!token,
    userEmail: email,
    login: magicLoginMutation.mutate,
    isLoggingIn: magicLoginMutation.isPending,
    recommendations: recommendationsQuery.data || [],
    isLoadingRecs: recommendationsQuery.isLoading,
    completeRecommendation: completeRecMutation.mutate,
    isCompletingRec: completeRecMutation.isPending,
    ingestAudit: ingestAuditMutation.mutateAsync,
    isIngesting: ingestAuditMutation.isPending,
    logout: () => {
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_token");
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setEmail(null);
        setToken(null);
    }
  };
}
