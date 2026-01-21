"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return; // wait for hydrateUser to finish
    // console.log("🧭 RoleGuard check", { hydrated, user });

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/403");
    }
  }, [hydrated, user, allowedRoles, router]);

  if (!hydrated) return <div className="flex items-center justify-center h-screen">Loading...</div>;


  return <>{children}</>;
}
