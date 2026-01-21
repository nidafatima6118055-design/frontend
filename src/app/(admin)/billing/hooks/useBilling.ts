"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getBillingSummary,
  getAvailablePlans,
  createTopUpSession,
  createSubscriptionSession,
  cancelSubscription,
  createPortalSession,
} from "@/lib/api/api";

export interface Transaction {
  id: string;
  type: "topup" | "subscription" | "deduction";
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  description?: string;
}

export interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  current_period_end?: string;
}

export interface BillingSummary {
  credits: number;
  subscription: Subscription | null;
  transactions: Transaction[];
}

export function useBilling() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch billing summary from backend */
  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBillingSummary();

      // Ensure subscription has plan_name
      if (data.subscription && data.subscription.plan_name === undefined && data.subscription.plan) {
        data.subscription.plan_name = data.subscription.plan.name;
      }

      setSummary(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch billing summary:", err);
      setError("Failed to load billing summary");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch available subscription plans */
  const fetchPlans = useCallback(async () => {
    try {
      const data = await getAvailablePlans();
      setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  }, []);

  /** Top-up wallet balance */
  const handleTopUp = async (amount: number) => {
    setLoading(true);
    try {
      const res = await createTopUpSession(amount);
      if (res.url) window.location.href = res.url;
    } catch (err) {
      console.error("Failed to create top-up session:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Subscribe to a plan */
  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      const res = await createSubscriptionSession(planId);
      if (res.url) window.location.href = res.url;
    } catch (err) {
      console.error("Failed to create subscription session:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Cancel active subscription */
  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelSubscription();
      await fetchSummary();
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Open Stripe billing portal */
  const openPortal = async () => {
    try {
      const res = await createPortalSession();
      if (res.url) window.location.href = res.url;
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchPlans();
  }, [fetchSummary, fetchPlans]);

  return {
    summary,
    plans,
    loading,
    error,
    handleTopUp,
    handleSubscribe,
    handleCancel,
    openPortal,
    reload: fetchSummary,
  };
}
