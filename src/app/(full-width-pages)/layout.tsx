"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function FullWidthPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { access } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (access) {
      router.replace("/");
    }
  }, [access, router]);

  return <>{children}</>;
}
