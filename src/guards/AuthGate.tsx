"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { hydrated, user, hydrateUser } = useAuthStore();
    const router = useRouter();

    // ✅ Ensure hydration happens as soon as this component mounts
    useEffect(() => {
        if (!hydrated) {
            hydrateUser();
        }
    }, [hydrated, hydrateUser]);

    // ✅ Redirect after hydration completes — run this side effect safely
    useEffect(() => {
        if (hydrated && !user) {
            router.replace("/signin");
        }
    }, [hydrated, user, router]);

    // ✅ While hydrating — show a centered loading screen
    if (!hydrated) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // 🚧 While redirecting (no user) — show nothing temporarily
    if (hydrated && !user) {
        return null;
    }

    // ✅ Render content only when authenticated
    return <>{children}</>;
}
