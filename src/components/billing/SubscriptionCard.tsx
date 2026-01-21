"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  credits: number;
  interval: string;
}

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  current_period_end?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
  plans: Plan[];
  onSubscribe: (planId: string) => void;
  onCancel: () => void;
  onManage: () => void;
  loading?: boolean;
}

const SubscriptionCard: FC<SubscriptionCardProps> = ({
  subscription,
  plans,
  onSubscribe,
  onCancel,
  onManage,
  loading,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    subscription?.plan_name || (plans[0]?.id ?? null)
  );

  const activeStatus = subscription?.status === "active";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Subscription</h2>

      {/* Active subscription info */}
      {subscription && activeStatus ? (
        <div className="mb-4">
          <p>
            <span className="font-semibold">Plan:</span> {subscription.plan_name}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className={subscription.status === "active" ? "text-green-600" : "text-red-600"}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </p>
          {subscription.current_period_end && (
            <p>
              <span className="font-semibold">Next billing:</span>{" "}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <p className="mb-4 text-gray-500">No active subscription</p>
      )}

      {/* Plan selection */}
      {plans.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mb-2 block">Choose a Plan:</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={selectedPlan ?? ""}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={loading}
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.price_usd}/{plan.interval})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!activeStatus && selectedPlan && (
          <Button onClick={() => onSubscribe(selectedPlan)} disabled={loading}>
            Subscribe
          </Button>
        )}
        {activeStatus && (
          <>
            <Button onClick={onManage} disabled={loading} variant="secondary">
              Manage
            </Button>
            <Button onClick={onCancel} disabled={loading} variant="destructive">
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
