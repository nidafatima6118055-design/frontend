"use client";

import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button";

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
}

export default function TopUpModal({ open, onClose, onSubmit }: TopUpModalProps) {
  const [amount, setAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid top-up amount.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSubmit(amount);
    } catch (err) {
      console.error("Top-up failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-gray-900">
          Add Credits
        </DialogTitle>
      </DialogHeader>

      <DialogContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the amount you want to add to your wallet balance.
          </p>

          <input
            type="number"
            min="1"
            step="1"
            className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </DialogContent>

      <DialogFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Processing..." : "Top Up"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
