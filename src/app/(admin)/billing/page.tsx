"use client";

import { useState } from "react";
import { useBilling } from "./hooks/useBilling";
import BalanceCard from "@/components/billing/BalanceCard";
import SubscriptionCard from "@/components/billing/SubscriptionCard";
import TransactionsTable from "@/components/billing/TransactionsTable";
import TopUpModal from "@/components/billing/TopUpModal";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  
  const {
    summary,
    plans,
    loading,
    error,
    handleTopUp,
    handleSubscribe,
    handleCancel,
    openPortal,
    reload,
  } = useBilling();

  const [showTopUp, setShowTopUp] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-500 text-sm">
            Manage your credits, subscriptions, and transactions.
          </p>
        </div>
        <Button onClick={() => setShowTopUp(true)} disabled={loading}>
          Add Credits
        </Button>
      </div>

      {/* LOADING / ERROR STATES */}
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
          {error}
        </p>
      )}
      {loading && !summary && (
        <p className="text-gray-500">Loading billing information...</p>
      )}

      {/* MAIN CONTENT */}
      {summary && (
        <>
          {/* BALANCE + SUBSCRIPTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BalanceCard
              credits={summary.credits}
              onTopUp={() => setShowTopUp(true)}
              loading={loading}
            />
            <SubscriptionCard
              subscription={summary.subscription}
              plans={plans}
              onSubscribe={handleSubscribe}
              onManage={openPortal}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>

          {/* TRANSACTIONS */}
          <TransactionsTable transactions={summary.transactions} />
        </>
      )}

      {/* TOP UP MODAL */}
      <TopUpModal
        open={showTopUp}
        onClose={() => setShowTopUp(false)}
        onSubmit={async (amount) => {
          await handleTopUp(amount);
          setShowTopUp(false);
          await reload();
        }}
      />
    </div>
  );
}
