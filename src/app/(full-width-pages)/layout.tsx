"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FullWidthPagesLayout({ children }: { children: React.ReactNode }) {
  const { access } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (access) {
      router.replace("/"); // redirect logged-in users to dashboard
    }
  }, [access, router]);

  return <>{children}</>;
}
