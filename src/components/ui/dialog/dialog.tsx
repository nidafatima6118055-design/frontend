"use client";

import * as React from "react";
import { cn } from "@/utils/utils";

/* -------------------- ROOT -------------------- */
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden transition-all transform duration-200 animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------- CONTENT -------------------- */
export function DialogContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

/* -------------------- HEADER -------------------- */
export function DialogHeader({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 border-b border-gray-200 flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}

/* -------------------- TITLE -------------------- */
export function DialogTitle({
  className,
  children,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

/* -------------------- FOOTER -------------------- */
export function DialogFooter({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex justify-end space-x-2 border-t border-gray-100 p-4 bg-gray-50",
        className
      )}
    >
      {children}
    </div>
  );
}
