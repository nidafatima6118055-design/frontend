"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAgents, createAgent } from "@/lib/api/api";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateAgentPage from "@/components/agent-studio/CreateAgentPage"; // your existing editor component

export default function AgentEditorPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params?.id;
    const isNew = agentId === "new";

    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!isNew) {
                const agents = await getAgents();
                const agent = agents.find((a) => a.id === Number(agentId));
                setInitialData(agent || null);
            }
            setLoading(false);
        }
        load();
    }, [agentId]);

    if (loading)
        return <div className="p-6 text-gray-500">Loading agent...</div>;

    return (
        <div className="space-y-6">

            <PageBreadcrumb
                pageTitle={isNew ? "Create New Agent" : `Editing: ${initialData?.name}`}
            />


            {/* <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    {isNew ? "Create New Agent" : `Editing: ${initialData?.name}`}
                </h2>
                <button
                    onClick={() => router.push("/agents")}
                    className="px-3 py-2 text-sm bg-gray-100 border rounded hover:bg-gray-200"
                >
                    ← Back to Agents
                </button>
            </div> */}

            <CreateAgentPage existingAgent={initialData} />
        </div>
    );
}
