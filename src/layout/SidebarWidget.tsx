import React from "react";

import { useState } from "react";
import BalanceCard from "@/components/billing/BalanceCard";
import { useBilling } from "@/app/(admin)/billing/hooks/useBilling";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/card";
import { Loader2 } from "lucide-react";





export default function SidebarWidget() {

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
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >


      <Card className="border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Credits
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-blue-600">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              `${summary?.credits.toFixed(2)}`
            )}
          </div>
          <p className="text-sm text-gray-500">
            These credits are used for AI calls, messages, or other usage-based services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}













