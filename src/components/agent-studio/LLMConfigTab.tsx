"use client";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};




export default function LLMConfigTab({ config, setConfig }: Props) {
    // 🧱 Ensure a complete structure before accessing it
    const ensureLLMExists = (cfg: FullAgentConfig) => {
        const newCfg = structuredClone(cfg || {});

        if (!newCfg.agent_config) newCfg.agent_config = {} as any;
        if (!Array.isArray(newCfg.agent_config.tasks))
            newCfg.agent_config.tasks = [];
        if (!newCfg.agent_config.tasks[0]) newCfg.agent_config.tasks[0] = {} as any;

        const task = newCfg.agent_config.tasks[0];

        if (!task.tools_config) task.tools_config = {} as any;
        if (!task.tools_config.llm_agent) task.tools_config.llm_agent = {} as any;


        // if (!task.tools_config.llm_agent.agent_flow_type)
        //     task.tools_config.llm_agent.agent_flow_type = "streaming";

        if (!task.tools_config.llm_agent.routes)
            task.tools_config.llm_agent.routes = null;

        // if (llm.base_url === "") llm.base_url = null;

        if (!task.tools_config.llm_agent.llm_config) {
            task.tools_config.llm_agent.llm_config = {
                provider: "openai",
                model: "gpt-4o-mini",
                temperature: 0.3,
                top_p: 0.9,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                max_tokens: 200,
                request_json: true,
                base_url: "",
                family: "openai",
                top_k: 40,          // ✅ REQUIRED
                min_p: 0.05,        // ✅ REQUIRED
            };
        }

        return newCfg;
    };

    // 🧠 Always use a safe config
    const safeConfig = ensureLLMExists(config);
    const llm =
        safeConfig.agent_config.tasks[0].tools_config.llm_agent.llm_config;

    // 🧩 Update helper
    const update = (path: string, value: any) => {
        setConfig((prev) => {
            const newCfg = ensureLLMExists(prev);
            const keys = path.split(".");
            let obj: any = newCfg;
            while (keys.length > 1) obj = obj[keys.shift()!];
            obj[keys[0]] = value;
            return newCfg;
        });
    };

    const providers = ["openai", "anthropic", "groq", "google"];
    const modelsByProvider: Record<string, string[]> = {
        openai: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
        anthropic: ["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"],
        groq: ["llama3-70b-8192", "mixtral-8x7b"],
        google: ["gemini-1.5-pro", "gemini-1.5-flash"],
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">
                LLM (Language Model) Configuration
            </h3>
            <p className="text-sm text-gray-500 mb-3">
                Choose your provider, model, and tune the AI’s intelligence and creativity levels.
            </p>

            {/* Provider & Model */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Provider & Model</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Provider</label>
                        <select
                            value={llm.provider}
                            // onChange={(e) =>
                            //     update(
                            //         "agent_config.tasks.0.tools_config.llm_agent.llm_config.provider",
                            //         e.target.value
                            //     )
                            // }

                            onChange={(e) => {
                                const provider = e.target.value;
                                update("agent_config.tasks.0.tools_config.llm_agent.llm_config.provider", provider);
                                update("agent_config.tasks.0.tools_config.llm_agent.llm_config.model", modelsByProvider[provider][0]);
                            }}


                            className="w-full border rounded px-3 py-2"
                        >
                            {providers.map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Model</label>
                        <select
                            value={llm.model}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.llm_agent.llm_config.model",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            {(modelsByProvider[llm.provider] || []).map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Core Parameters */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Model Parameters</h4>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        ["Max Tokens", "max_tokens"],
                        ["Temperature", "temperature"],
                        ["Top P", "top_p"],
                        ["Frequency Penalty", "frequency_penalty"],
                        ["Presence Penalty", "presence_penalty"],
                    ].map(([label, key]) => (
                        <div key={key}>
                            <label className="text-sm font-medium">{label}</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={(llm as any)[key]}
                                onChange={(e) =>
                                    update(
                                        `agent_config.tasks.0.tools_config.llm_agent.llm_config.${key}`,
                                        parseFloat(e.target.value)
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Advanced */}
            <section className="bg-white border rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Advanced Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Base URL (optional)</label>
                        <input
                            type="text"
                            value={llm.base_url || ""}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.llm_agent.llm_config.base_url",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., https://api.openai.com/v1"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            checked={llm.request_json}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.llm_agent.llm_config.request_json",
                                    e.target.checked
                                )
                            }
                        />
                        <label className="text-sm font-medium">
                            Return JSON responses
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
}
