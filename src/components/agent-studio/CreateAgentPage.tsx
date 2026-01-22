// app/agents/create/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useRouter, useParams } from "next/navigation";

import LLMConfigTab from "./LLMConfigTab";
import SynthesizerConfigTab from "./SynthesizerConfigTab";
import TranscriberConfigTab from "./TranscriberConfigTab";
import AgentPromptsTab from "./AgentPromptsTab";
import TaskConfigTab from "./TaskConfigTab";
import AgentConfigPreviewTab from "./AgentConfigPreviewTab";

import { FullAgentConfig } from "@/lib/types/agentConfig";
import { getAgents, createAgent, updateAgent, deleteAgent, getPhoneNumbers, assignNumberToAgent, unassignNumberFromAgent } from "@/lib/api/api";
import { getPhones, assignPhone, unassignPhone } from "@/lib/api/phones";
import { telephonyToWebConfig } from "../../utils/transformers"; // adjust path
import { defaultTelephonyConfig } from "@/configs/defaultTelephonyConfig";


import TestAgentVoiceChat from "../voicechat/TestAgentVoiceChat";

// export const metadata: Metadata = {
//   title: "Astound ai | Create Agent",
// };

type Agent = {
    id: string;
    name: string;
    language: string;
    voice: string;
    phone?: string | null;
    notes?: string;
};

const VOICES = [
    "American - female",
    "American - male",
    "British - female",
    "British - male",
];



type Props = {
    existingAgent?: any; // null for new, object for edit
};

export default function CreateAgentPage({ existingAgent }: Props) {
    const isEditMode = !!existingAgent;

    const [activeTab, setActiveTab] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);
    const [availablePhones, setAvailablePhones] = useState<string[]>([]);
    const [phone, setPhone] = useState<string | null>(null);
    const [activeAgent, setActiveAgent] = useState<any>(existingAgent || null);
    // --- CORE INFO ---
    const [agentName, setAgentName] = useState(existingAgent?.name || "New Agent");
    const [notes, setNotes] = useState(existingAgent?.description || "");
    const [voice, setVoice] = useState(VOICES[0]);

    // --- CONFIG ---

    const [config, setConfig] = useState<FullAgentConfig>(
        existingAgent?.bolna_config || defaultTelephonyConfig(agentName)
    );

    // const [config, setConfig] = useState<FullAgentConfig>(
    //     existingAgent?.bolna_config || defaultConfig
    // );

    // --- FETCH PHONES ---
    async function fetchPhones() {
        try {
            const data = await getPhoneNumbers();
            setAvailablePhones(data.available_numbers || []);
        } catch (err) {
            console.error("Failed to fetch phones", err);
        }
    }


    const webTestConfig = useMemo(() => {
        // If config looks like telephony, adapt it; otherwise return config as-is
        try {
            return telephonyToWebConfig(config, { targetSampleRate: 16000, keepTelephonyMeta: true });
        } catch (err) {
            console.error("Failed to adapt telephony config to web:", err);
            return config;
        }
    }, [config]);



    useEffect(() => {
        fetchPhones();
    }, []);

    // --- SAVE ---


    async function handleSaveAgent() {
        setIsSaving(true);
        try {
            const payload = {
                name: agentName,
                description: notes,
                agent_config: config.agent_config,
                agent_prompts: config.agent_prompts,
            };

            let savedAgent;

            if (isEditMode && existingAgent?.bolna_agent_id) {
                // 🧩 Update existing agent
                await updateAgent(existingAgent.bolna_agent_id, payload);
                alert("✅ Agent updated successfully!");
            } else {
                // 🆕 Create new agent
                savedAgent = await createAgent(payload);
                alert("✅ Agent created successfully!");
            }

            // 🧠 Immediately load new agent into editor (no refresh needed)
            if (savedAgent) {
                setActiveAgent(savedAgent); // ✅ This line fixes your preview
                setConfig({
                    agent_config: savedAgent.agent_config,
                    agent_prompts: savedAgent.agent_prompts,
                });
                setAgentName(savedAgent.name);
                setNotes(savedAgent.description || "");
                setActiveTab(1); // Jump to LLM Config after creation
            }

            if (typeof getAgents === "function") {
                await getAgents();
            }
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save agent");
        } finally {
            setIsSaving(false);
        }
    }




    // --- SYNC CONFIG NAME ---
    useEffect(() => {
        setConfig((prev) => {
            if (!prev?.agent_config) return prev;
            return {
                ...prev,
                agent_config: { ...prev.agent_config, agent_name: agentName },
            };
        });
    }, [agentName]);

    // --- UI ---
    return (
        <div className="space-y-6">


            {/* Tabs */}
            <div className="bg-white rounded-md shadow-sm p-3">
                <nav className="flex flex-wrap gap-2">
                    {[
                        "Agent Info",
                        "LLM Config",
                        "Synthesizer Config",
                        "Transcriber Config",
                        "Task Config",
                        "Prompts",
                        "Preview Json",
                    ].map((t, i) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(i)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === i
                                ? "bg-white border border-gray-200 shadow"
                                : "text-gray-500"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left panel */}
                <div className="col-span-12 lg:col-span-8 space-y-6">

                    {activeTab === 0 && (
                        <section className="bg-white border rounded-md p-6 space-y-4">
                            <h3 className="text-lg font-semibold">
                                {isEditMode ? "Edit Agent Info" : "Create New Agent"}
                            </h3>

                            <label className="block text-sm font-medium">Name</label>
                            <input
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                            />

                            <label className="block text-sm font-medium">Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full border rounded-md px-3 py-2"
                            />

                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                                onClick={handleSaveAgent}
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? "Saving..."
                                    : isEditMode
                                        ? "Update Agent"
                                        : "Create Agent"}
                            </button>
                        </section>
                    )}
                    {activeTab === 1 && (
                        <LLMConfigTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === 2 && (
                        <SynthesizerConfigTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === 3 && (
                        <TranscriberConfigTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === 4 && (
                        <TaskConfigTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === 5 && (
                        <AgentPromptsTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === 6 && (
                        <AgentConfigPreviewTab config={config} />
                    )}

                </div>

                {/* Right panel */}
                <aside className="col-span-12 lg:col-span-4">
                    <div className="bg-white border rounded-md p-6 flex flex-col items-center gap-6">
                        <h4 className="text-lg font-semibold">Preview</h4>
                        {(activeAgent?.bolna_agent_id || existingAgent?.bolna_agent_id) && (
                            // <TestAgentVoiceChat
                            //     agentId={activeAgent?.bolna_agent_id || existingAgent?.bolna_agent_id}
                            // />


                            <TestAgentVoiceChat
                                agentId={activeAgent?.bolna_agent_id || existingAgent?.bolna_agent_id}
                                inlineConfig={webTestConfig}
                            />


                        )}

                        <div className="text-sm text-gray-500">
                            Assigned phone: {phone ?? "None"}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

