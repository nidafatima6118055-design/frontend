"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Client = {
    id: number;
    name: string;
    email: string;
    company: string;
    status: "Active" | "Inactive";
};

const demoClients: Client[] = [
    { id: 1, name: "John Doe", email: "john@example.com", company: "Acme Corp", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", company: "Globex Inc", status: "Inactive" },
    { id: 3, name: "Michael Johnson", email: "michael@example.com", company: "Initech", status: "Active" },
];

export default function ClientsTable() {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`/client-information/${id}`);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                    Clients
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-t border-gray-100 dark:border-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900/30">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Company</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {demoClients.map((client) => (
                            <tr
                                key={client.id}
                                onClick={() => handleRowClick(client.id)}
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.company}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
