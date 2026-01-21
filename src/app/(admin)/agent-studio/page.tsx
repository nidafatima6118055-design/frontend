"use client";
import { useState } from "react";
import { defaultAgentConfig } from "@/constants/defaultAgentConfig";
import type { FullAgentConfig } from "@/lib/types/agentConfig";
import LLMSettingsTab from "@/components/agent-studio/LLMSettingsTab";
import VoiceSettingsTab from "@/components/agent-studio/VoiceSettingsTab";
// import TranscriberSettingsTab from "@/components/agent-studio/TranscriberSettingsTab";

export default function AgentStudioPage() {
    const [agentConfig, setAgentConfig] = useState<FullAgentConfig>(defaultAgentConfig);
    const [activeTab, setActiveTab] = useState<"llm" | "voice" | "transcriber">("llm");

    const tabs = [
        { id: "llm", label: "LLM Config" },
        { id: "voice", label: "Voice Synthesizer" },
        { id: "transcriber", label: "Transcription & Routing" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white border rounded-md p-4 shadow-sm">
                <h1 className="text-lg font-semibold mb-3">Agent Studio</h1>
                <nav className="flex gap-2 border-b pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === tab.id
                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-300"
                                    : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-6">
                    {activeTab === "llm" && (
                        <LLMSettingsTab config={agentConfig} setConfig={setAgentConfig} />
                    )}
                    {activeTab === "voice" && (
                        <VoiceSettingsTab config={agentConfig} setConfig={setAgentConfig} />
                    )}
                    {/* {activeTab === "transcriber" && (
                        <TranscriberSettingsTab config={agentConfig} setConfig={setAgentConfig} />
                    )} */}
                </div>
            </div>

            <div className="bg-gray-50 border rounded-md p-4 text-sm">
                <h2 className="font-semibold mb-2">🧾 Live JSON Preview</h2>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto max-h-96">
                    {JSON.stringify(agentConfig, null, 2)}
                </pre>
            </div>
        </div>
    );
}
