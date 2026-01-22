"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { confirmPasswordReset } from "@/lib/api/api";
import { useAuthStore } from "@/store/auth";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@/lib/api/api";

export default function ResetPasswordClient() {
    const router = useRouter();
    const params = useSearchParams();
    const { user, hydrated, setAuth } = useAuthStore();

    const uid = params.get("uid") ?? "";
    const token = params.get("token") ?? "";

    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (hydrated && user) {
            router.replace("/");
        }
    }, [hydrated, user, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await confirmPasswordReset(uid, token, newPassword);
            router.push("/signin");
        } catch (err: any) {
            setError("Invalid or expired reset link");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <h1 className="mb-2 text-title-sm font-semibold text-gray-800">
                    Reset Password
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label>
                            New Password <span className="text-error-500">*</span>
                        </Label>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                            </span>
                        </div>
                    </div>

                    {error && <p className="text-sm text-error-500">{error}</p>}

                    <Button className="w-full" size="sm" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Remembered your password?{" "}
                    <Link href="/signin" className="text-brand-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
