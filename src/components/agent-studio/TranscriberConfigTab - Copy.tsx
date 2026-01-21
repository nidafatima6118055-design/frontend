"use client";
import { useState } from "react";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};

export default function TranscriberConfigTab({ config, setConfig }: Props) {
    const trans =
        config?.agent_config?.tasks?.[0]?.tools_config?.transcriber || {
            model: "nova-2",
            language: "en",
            stream: true,
            sampling_rate: 16000,
            encoding: "linear16",
            endpointing: 500,
            provider: "deepgram",
            task: "transcribe",
            keywords: [],
        };

    const [keywordInput, setKeywordInput] = useState("");

    const update = (path: string, value: any) => {
        setConfig((prev) => {
            const newCfg = structuredClone(prev);
            const keys = path.split(".");
            let obj: any = newCfg;
            while (keys.length > 1) obj = obj[keys.shift()!];
            obj[keys[0]] = value;
            return newCfg;
        });
    };

    const providers = ["deepgram", "openai", "assemblyai"];
    const modelsByProvider: Record<string, string[]> = {
        deepgram: ["nova-2", "whisper", "enhanced"],
        openai: ["whisper-1", "whisper-large-v3"],
        assemblyai: ["default", "turbo", "lightning"],
    };

    const handleAddKeyword = () => {
        if (!keywordInput.trim()) return;
        const updated = [...(trans.keywords || []), keywordInput.trim()];
        update("agent_config.tasks.0.tools_config.transcriber.keywords", updated);
        setKeywordInput("");
    };

    const handleRemoveKeyword = (kw: string) => {
        const updated = (trans.keywords || []).filter((k) => k !== kw);
        update("agent_config.tasks.0.tools_config.transcriber.keywords", updated);
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">
                Transcriber (Speech-to-Text) Configuration
            </h3>
            <p className="text-sm text-gray-500 mb-3">
                Configure how your AI agent listens, processes, and converts user speech
                into text.
            </p>

            {/* 🧠 Provider & Model */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Provider & Model</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Provider</label>
                        <select
                            value={trans.provider}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.provider", e.target.value)
                            }
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
                            value={trans.model}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.model", e.target.value)
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            {(modelsByProvider[trans.provider] || []).map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* 🌐 Language & Audio Settings */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Language & Audio Settings</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Language</label>
                        <select
                            value={trans.language}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.language", e.target.value)
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Encoding</label>
                        <select
                            value={trans.encoding}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.encoding", e.target.value)
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="linear16">Linear16</option>
                            <option value="flac">FLAC</option>
                            <option value="wav">WAV</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 🎚 Advanced Parameters */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Advanced Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Endpointing (ms)</label>
                        <input
                            type="number"
                            value={trans.endpointing}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.endpointing", parseInt(e.target.value))
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Sampling Rate (Hz)</label>
                        <input
                            type="number"
                            value={trans.sampling_rate}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.sampling_rate", parseInt(e.target.value))
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Task Type</label>
                        <input
                            type="text"
                            value={trans.task}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.task", e.target.value)
                            }
                            className="w-full border rounded px-3 py-2"
                            placeholder="transcribe / translate / diarize"
                        />
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={trans.stream}
                            onChange={(e) =>
                                update("agent_config.tasks.0.tools_config.transcriber.stream", e.target.checked)
                            }
                        />
                        <label className="text-sm font-medium">Enable Streaming Transcription</label>
                    </div>
                </div>
            </section>

            {/* 🔤 Keyword Boosting */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Keyword Boosting</h4>
                <p className="text-xs text-gray-500">
                    Optionally boost recognition accuracy for specific keywords (e.g., product names, commands).
                </p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        className="flex-1 border rounded px-3 py-2 text-sm"
                        placeholder="Add keyword..."
                    />
                    <button
                        onClick={handleAddKeyword}
                        className="px-3 py-2 bg-indigo-600 text-white text-sm rounded"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                    {(trans.keywords || []).map((kw) => (
                        <span
                            key={kw}
                            className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-2"
                        >
                            {kw}
                            <button
                                onClick={() => handleRemoveKeyword(kw)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
}
