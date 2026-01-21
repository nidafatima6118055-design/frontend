"use client";


import { useEffect, useState } from "react";

import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Cookies from "js-cookie";
// import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { setPassword } from "@/lib/api/api";



export default function SetPassword() {

    const router = useRouter();
    const { user, hydrated, hydrateUser } = useAuthStore();
    const { setAuth } = useAuthStore();
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔒 Step 1: Ensure authentication & password_not_set
    useEffect(() => {
        const verifyUser = async () => {
            // Ensure store is hydrated
            if (!hydrated) return;

            if (!user) {
                // No user? Try hydrating from /me
                await hydrateUser();
            }

            const u = useAuthStore.getState().user;

            if (!u) {
                // toast.error("You must be logged in to set a password.");
                router.replace("/signin");
                return;
            }

            if (u.has_password === true) {
                // (optional) if you add this flag later in response
                // toast.info("You already have a password.");
                router.replace("/");
                return;
            }
        };

        verifyUser();
    }, [hydrated, user, router, hydrateUser]);

    // 🔑 Step 2: Submit new password
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await setPassword(newPassword);
            const { access, refresh, user } = res.data;

            // ✅ Update cookies
            Cookies.set("access", access, { sameSite: "Lax", path: "/" });
            Cookies.set("refresh", refresh, { sameSite: "Lax", path: "/" });
            Cookies.set("user", JSON.stringify(user), { sameSite: "Lax", path: "/" });
            Cookies.set("role", user.role, { sameSite: "Lax", path: "/" });

            // ✅ Update Zustand state and clear loginSource
            setAuth(user, null);

            router.replace("/");
        } catch (err) {
            console.error("Set password failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Set Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign in!
                        </p>
                    </div>
                    <div>

                        <div className="relative py-3 sm:py-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                                    Or
                                </span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Reset Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full border rounded-lg px-3 py-2 mb-4"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Button className="w-full" size="sm">
                                        Set Password
                                    </Button>
                                </div>

                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Don&apos;t have an account? {""}
                                <Link
                                    href="/signup"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );










    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">Set Your Password</h2>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Set Password"}
                </button>
            </form>
        </div>
    );
}
