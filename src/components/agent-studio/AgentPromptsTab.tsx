"use client";
import { useState, useEffect } from "react";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};


export default function AgentPromptsTab({ config, setConfig }: Props) {
    // 🧱 Utility: ensure full prompt structure exists
    const ensurePromptExists = (cfg: FullAgentConfig) => {
        const newCfg = structuredClone(cfg || {});
        if (!newCfg.agent_prompts) newCfg.agent_prompts = {};
        if (!newCfg.agent_prompts.task_1)
            newCfg.agent_prompts.task_1 = { system_prompt: "" };
        if (typeof newCfg.agent_prompts.task_1.system_prompt !== "string")
            newCfg.agent_prompts.task_1.system_prompt = "";
        return newCfg;
    };

    // 🧠 Always use safe structure
    const safeCfg = ensurePromptExists(config);
    const taskPrompt = safeCfg.agent_prompts.task_1.system_prompt;

    const [tempPrompt, setTempPrompt] = useState(taskPrompt);
    const [isExpanded, setIsExpanded] = useState(false);

    // 🔄 Sync when config changes externally
    useEffect(() => {
        setTempPrompt(taskPrompt);
    }, [taskPrompt]);

    const updatePrompt = (value: string) => {
        setConfig((prev) => {
            const newCfg = ensurePromptExists(prev);
            newCfg.agent_prompts.task_1.system_prompt = value;
            return newCfg;
        });
    };

    const handleSave = () => {
        updatePrompt(tempPrompt);
        alert("✅ System prompt updated!");
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">
                Agent Prompt Configuration
            </h3>
            <p className="text-sm text-gray-500 mb-3">
                The system prompt defines your agent’s{" "}
                <strong>personality</strong>, <strong>role</strong>, and{" "}
                <strong>response style</strong>. Adjust it to guide how your AI behaves
                in conversations.
            </p>

            {/* 🧠 System Prompt Editor */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">System Prompt</h4>
                    <button
                        onClick={() => setIsExpanded((p) => !p)}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
                </div>

                <textarea
                    value={tempPrompt}
                    onChange={(e) => setTempPrompt(e.target.value)}
                    rows={isExpanded ? 14 : 6}
                    className="w-full border rounded-md px-3 py-2 text-sm font-mono leading-relaxed bg-gray-50"
                    placeholder={`Example:
You are Chloe, a friendly AI receptionist.
Greet callers warmly, confirm their name, and assist with scheduling or inquiries.
Keep responses short, polite, and natural.
Avoid robotic phrasing and confirm tasks clearly.`}
                />

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">
                        {tempPrompt.length} characters
                    </p>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                        Save Prompt
                    </button>
                </div>
            </section>

            {/* 💡 Prompt Design Tips */}
            <section className="bg-gray-50 border rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Prompt Design Tips</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>
                        Start with who your agent is — e.g., “You are Chloe, a helpful
                        receptionist.”
                    </li>
                    <li>
                        Define their tone and role: professional, friendly, calm, etc.
                    </li>
                    <li>
                        Include behavioral rules: how to greet, when to ask clarifying
                        questions, etc.
                    </li>
                    <li>
                        Keep the prompt under 1000 characters for better model performance.
                    </li>
                </ul>
            </section>
        </div>
    );
}
