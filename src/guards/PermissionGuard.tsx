"use client";
import { useAuthStore } from "@/store/auth";

export function PermissionGuard({
  children,
  requiredPermissions,
}: {
  children: React.ReactNode;
  requiredPermissions: string[];
}) {
  const { user } = useAuthStore();

  if (!user) return null;

  const hasPermission = requiredPermissions.every((perm) =>
    user.permissions?.includes(perm)
  );

  if (!hasPermission) return null; // hide content

  return <>{children}</>;
}
