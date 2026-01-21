"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAgents } from "@/lib/api/api";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateAgentPage from "@/components/agent-studio/CreateAgentPage";

type Agent = {
    id: number;
    name?: string;
};

export default function AgentEditorPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const agentId = params?.id;
    const isNew = agentId === "new";

    const [initialData, setInitialData] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!isNew && agentId) {
                const agents: Agent[] = await getAgents();
                const agent = agents.find(
                    (a: Agent) => a.id === Number(agentId)
                );
                setInitialData(agent ?? null);
            }
            setLoading(false);
        }
        load();
    }, [agentId, isNew]);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading agent...</div>;
    }

    return (
        <div className="space-y-6">
            <PageBreadcrumb
                pageTitle={
                    isNew
                        ? "Create New Agent"
                        : `Editing: ${initialData?.name ?? "Agent"}`
                }
            />
            <CreateAgentPage existingAgent={initialData} />
        </div>
    );
}
