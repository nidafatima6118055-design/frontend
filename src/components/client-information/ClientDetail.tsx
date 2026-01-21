"use client";

import { useEffect, useState } from "react";

type Client = {
    id: number;
    name: string;
    email: string;
    company: string;
    status: "Active" | "Inactive";
};

const mockClients: Client[] = [
    { id: 1, name: "John Doe", email: "john@example.com", company: "Acme Inc", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", company: "TechSoft", status: "Inactive" },
    { id: 3, name: "Mike Ross", email: "mike@example.com", company: "Astound AI", status: "Active" },
];

export default function ClientDetail({ clientId }: { clientId: string }) {
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const found = mockClients.find((c) => c.id === Number(clientId));
        setClient(found || null);
    }, [clientId]);

    if (!client) {
        return <div className="p-6">Client not found.</div>;
    }

    return (
        <div className="p-6 border rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold mb-4">{client.name}</h2>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Company:</strong> {client.company}</p>
            <p>
                <strong>Status:</strong>{" "}
                <span
                    className={`px-2 py-1 rounded text-sm ${client.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {client.status}
                </span>
            </p>
        </div>
    );
}
