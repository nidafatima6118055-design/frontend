"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BalanceCardProps {
  credits: number;
  loading?: boolean;
  onTopUp: () => void;
}

/**
 * 💰 Displays the user's current wallet balance (credits)
 * and provides a "Top Up" button to add funds.
 */
export default function BalanceCard({ credits, loading, onTopUp }: BalanceCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Wallet Balance
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-blue-600">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          ) : (
            `${credits.toFixed(2)}`
          )}
        </div>

        <p className="text-sm text-gray-500">
          These credits are used for AI calls, messages, or other usage-based services.
        </p>

        <Button
          onClick={onTopUp}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
        >
          {loading ? "Processing..." : "Add Credits"}
        </Button>
      </CardContent>
    </Card>
  );
}
