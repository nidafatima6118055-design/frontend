"use client";
import { FullAgentConfig, LLMConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};

export default function LLMSettingsTab({ config, setConfig }: Props) {
    const llm = config.agent_config.tasks[0].tools_config.llm_agent.llm_config;

    // const updateFieldold = (key: keyof typeof llm, value: any) => {
    //     setConfig((prev) => {
    //         const newConfig = structuredClone(prev);
    //         newConfig.agent_config.tasks[0].tools_config.llm_agent.llm_config[key] = value;
    //         return newConfig;
    //     });
    // };


    const updateField = <K extends keyof LLMConfig>(
        key: K,
        value: LLMConfig[K]
    ) => {
        setConfig((prev) => {
            const newConfig = structuredClone(prev) as FullAgentConfig;

            newConfig.agent_config.tasks[0].tools_config.llm_agent.llm_config[key] =
                value;

            return newConfig;
        });
    };
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">LLM Configuration</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Model</label>
                    <input
                        type="text"
                        value={llm.model}
                        onChange={(e) => updateField("model", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Temperature</label>
                    <input
                        type="number"
                        value={llm.temperature}
                        step="0.1"
                        min="0"
                        max="1"
                        onChange={(e) => updateField("temperature", parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Max Tokens</label>
                    <input
                        type="number"
                        value={llm.max_tokens}
                        onChange={(e) => updateField("max_tokens", parseInt(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Provider</label>
                    <select
                        value={llm.provider}
                        onChange={(e) => updateField("provider", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="gemini">Google Gemini</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
