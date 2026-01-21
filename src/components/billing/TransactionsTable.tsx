"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card/card";

import { Transaction } from "@/app/(admin)/billing/hooks/useBilling";

import { Loader2 } from "lucide-react";


interface TransactionsTableProps {
  transactions: Transaction[];
}

const statusColors: Record<Transaction["status"], string> = {
  pending: "text-yellow-600 bg-yellow-50",
  completed: "text-green-600 bg-green-50",
  failed: "text-red-600 bg-red-50",
};

const TransactionsTable: FC<TransactionsTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p className="text-gray-500">No transactions yet.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-4 py-2 text-sm text-gray-600">
                {new Date(tx.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-sm capitalize">{tx.type}</td>
              <td className="px-4 py-2 text-sm text-right">{tx.amount.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    statusColors[tx.status] || "text-gray-600 bg-gray-100"
                  }`}
                >
                  {tx.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">{tx.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;