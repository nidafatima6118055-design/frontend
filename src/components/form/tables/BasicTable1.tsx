import React from "react";

export default function BasicTable1() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                    Basic Table 1
                </h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <tr>
                                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            User
                                        </th>
                                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Project Name
                                        </th>
                                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Team
                                        </th>
                                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Budget
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {/* 👉 Example Row 1 */}
                                    <tr>
                                        <td className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    <img
                                                        src="/images/user/user-17.jpg"
                                                        alt="Lindsey Curtis"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        Lindsey Curtis
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        Web Designer
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            Agency Website
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                <img
                                                    src="/images/user/user-22.jpg"
                                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900"
                                                    alt="Team member 1"
                                                />
                                                <img
                                                    src="/images/user/user-23.jpg"
                                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900"
                                                    alt="Team member 2"
                                                />
                                                <img
                                                    src="/images/user/user-24.jpg"
                                                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900"
                                                    alt="Team member 3"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            3.9K
                                        </td>
                                    </tr>

                                    {/* 👉 Add more rows here (copy from your HTML snippet) */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
