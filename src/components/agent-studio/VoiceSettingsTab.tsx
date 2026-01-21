"use client";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};

export default function VoiceSettingsTab({ config, setConfig }: Props) {
    const synth = config.agent_config.tasks[0].tools_config.synthesizer;
    const voiceConfig = synth.provider_config;

    const updateField = (key: keyof typeof voiceConfig, value: any) => {
        setConfig((prev) => {
            const newConfig = structuredClone(prev);
            newConfig.agent_config.tasks[0].tools_config.synthesizer.provider_config[key] = value;
            return newConfig;
        });
    };

    const updateSynthField = (key: keyof typeof synth, value: any) => {
        setConfig((prev) => {
            const newConfig = structuredClone(prev);
            newConfig.agent_config.tasks[0].tools_config.synthesizer[key] = value;
            return newConfig;
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Voice Synthesizer Settings</h3>
            <p className="text-sm text-gray-500 mb-3">
                Configure your AI agent’s speaking voice, model, and playback parameters.
            </p>

            {/* Core provider config */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Voice Name</label>
                    <input
                        type="text"
                        value={voiceConfig.voice}
                        onChange={(e) => updateField("voice", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Voice ID</label>
                    <input
                        type="text"
                        value={voiceConfig.voice_id}
                        onChange={(e) => updateField("voice_id", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Model</label>
                    <select
                        value={voiceConfig.model}
                        onChange={(e) => updateField("model", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="eleven_turbo_v2_5">Eleven Turbo v2.5</option>
                        <option value="eleven_multilingual_v2">Eleven Multilingual v2</option>
                        <option value="eleven_monolingual_v1">Eleven Monolingual v1</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Temperature</label>
                    <input
                        type="number"
                        value={voiceConfig.temperature}
                        step="0.1"
                        min="0"
                        max="1"
                        onChange={(e) => updateField("temperature", parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Speed</label>
                    <input
                        type="number"
                        value={voiceConfig.speed}
                        step="0.1"
                        min="0.5"
                        max="2.0"
                        onChange={(e) => updateField("speed", parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Similarity Boost</label>
                    <input
                        type="number"
                        value={voiceConfig.similarity_boost}
                        step="0.1"
                        min="0"
                        max="1"
                        onChange={(e) => updateField("similarity_boost", parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Stream Output</label>
                    <select
                        value={String(synth.stream)}
                        onChange={(e) => updateSynthField("stream", e.target.value === "true")}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Buffer Size</label>
                    <input
                        type="number"
                        value={synth.buffer_size}
                        onChange={(e) => updateSynthField("buffer_size", parseInt(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
            </div>

            {/* Optional preview test */}
            <div className="mt-4">
                <button
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() => alert(`🔊 Previewing voice: ${voiceConfig.voice}`)}
                >
                    Preview Voice
                </button>
            </div>
        </div>
    );
}
