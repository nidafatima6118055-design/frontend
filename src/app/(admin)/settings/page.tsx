"use client"; // required for useState

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import Head from "next/head";

export default function TwilioSettings() {
    const [accountSID, setAccountSID] = useState("");
    const [authToken, setAuthToken] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ accountSID, authToken, phoneNumber });
    };

    return (
        <>
            <Head>
                <title>Astound AI | Twilio Settings</title>
            </Head>

            <div>
                <PageBreadcrumb pageTitle="Twilio Settings" />

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12">
                        <div className="space-y-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                                Twilio Integration
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Account SID *
                                    </label>
                                    <input
                                        type="text"
                                        value={accountSID}
                                        onChange={(e) => setAccountSID(e.target.value)}
                                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/[0.05] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Find this in your Twilio Console under Account Info
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Auth Token *
                                    </label>
                                    <input
                                        type="password"
                                        value={authToken}
                                        onChange={(e) => setAuthToken(e.target.value)}
                                        placeholder="Your Twilio Auth Token"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/[0.05] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Keep this secret! Find it in your Twilio Console
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Twilio Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1234567890"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/[0.05] px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Format: +1234567890 (must be a verified Twilio number)
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Save Settings
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
