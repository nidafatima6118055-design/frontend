"use client";
import { useState } from "react";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};



export default function SynthesizerConfigTab({ config, setConfig }: Props) {
    // 🧱 Ensure synthesizer config structure always exists
    const ensureSynthExists = (cfg: FullAgentConfig) => {
        const newCfg = structuredClone(cfg);

        if (!newCfg.agent_config)
            newCfg.agent_config = {} as any;

        if (!Array.isArray(newCfg.agent_config.tasks))
            newCfg.agent_config.tasks = [] as any;

        if (!newCfg.agent_config.tasks[0])
            newCfg.agent_config.tasks[0] = {} as any;

        if (!newCfg.agent_config.tasks[0].tools_config)
            newCfg.agent_config.tasks[0].tools_config = {} as any;

        if (!newCfg.agent_config.tasks[0].tools_config.synthesizer) {
            newCfg.agent_config.tasks[0].tools_config.synthesizer = {
                provider: "elevenlabs",
                provider_config: {
                    voice: "George",
                    voice_id: "JBFqnCBsd6RMkjVDRZzb",
                    model: "eleven_turbo_v2_5",
                    temperature: 0.5,
                    similarity_boost: 0.5,
                    speed: 1.0,
                    use_mulaw: false,
                    audio_format: "pcm_16000",
                },
                stream: true,
                buffer_size: 40,
                audio_format: "pcm_16000",
                sampling_rate: 16000,
                caching: true,
            };
        }

        return newCfg;
    };


    // ✅ Always use a safe config
    const safeConfig = ensureSynthExists(config);
    const synth = safeConfig.agent_config.tasks[0].tools_config.synthesizer;

    // 🧩 Update helper — ensures missing paths are created automatically
    const update = (path: string, value: any) => {
        setConfig((prev) => {
            const newCfg = ensureSynthExists(prev);
            const keys = path.split(".");
            let obj: any = newCfg;
            while (keys.length > 1) obj = obj[keys.shift()!];
            obj[keys[0]] = value;
            return newCfg;
        });
    };

    const [isPreviewing, setIsPreviewing] = useState(false);

    const voices = [
        { name: "George", id: "JBFqnCBsd6RMkjVDRZzb" },
        { name: "Chloe", id: "EXAVITQu4vr4xnSDxMaL" },
        { name: "Adam", id: "pNInz6obpgDQGcFmaJgB" },
        { name: "Sarah", id: "TxGEqnHWrfWFTfGW9XjX" },
    ];

    const handlePreview = async () => {
        if (isPreviewing) return;
        setIsPreviewing(true);
        try {
            const voice = synth.provider_config.voice;
            // Later: Integrate /api/voice-preview?voice_id={id}
            alert(`🔊 Playing voice sample for ${voice}...`);
        } finally {
            setIsPreviewing(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Synthesizer (TTS) Configuration</h3>
            <p className="text-sm text-gray-500 mb-3">
                Configure your AI agent’s speaking voice, audio quality, and streaming settings.
            </p>

            {/* 🎙 Voice Settings */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Voice Selection</h4>

                <div className="flex gap-3 items-center">
                    <select
                        value={synth.provider_config.voice}
                        onChange={(e) =>
                            update(
                                "agent_config.tasks.0.tools_config.synthesizer.provider_config.voice",
                                e.target.value
                            )
                        }
                        className="flex-1 border rounded px-3 py-2"
                    >
                        {voices.map((v) => (
                            <option key={v.id} value={v.name}>
                                {v.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handlePreview}
                        disabled={isPreviewing}
                        className={`px-4 py-2 border rounded-md text-sm ${isPreviewing ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"
                            }`}
                    >
                        {isPreviewing ? "🔄 Previewing..." : "▶ Preview"}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Voice Model</label>
                        <select
                            value={synth.provider_config.model}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.provider_config.model",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="eleven_turbo_v2_5">Eleven Turbo v2.5</option>
                            <option value="eleven_multilingual_v2">Multilingual v2</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Temperature</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={synth.provider_config.temperature}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.provider_config.temperature",
                                    parseFloat(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Similarity Boost</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={synth.provider_config.similarity_boost}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.provider_config.similarity_boost",
                                    parseFloat(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Speed</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0.5"
                            max="2"
                            value={synth.provider_config.speed}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.provider_config.speed",
                                    parseFloat(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </section>

            {/* ⚙️ Audio Settings */}
            <section className="bg-white border rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Audio Output</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Audio Format</label>
                        <select
                            value={synth.audio_format}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.audio_format",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="pcm_16000">PCM 16kHz</option>
                            <option value="mp3">MP3</option>
                            <option value="wav">WAV</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Sampling Rate</label>
                        <input
                            type="number"
                            value={synth.sampling_rate}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.sampling_rate",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={synth.stream}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.stream",
                                    e.target.checked
                                )
                            }
                        />
                        <label className="text-sm font-medium">Enable Streaming Mode</label>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={synth.caching}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.caching",
                                    e.target.checked
                                )
                            }
                        />
                        <label className="text-sm font-medium">Enable Audio Caching</label>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Buffer Size</label>
                        <input
                            type="number"
                            value={synth.buffer_size}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.buffer_size",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Use μ-law</label>
                        <input
                            type="checkbox"
                            checked={synth.provider_config.use_mulaw}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.tools_config.synthesizer.provider_config.use_mulaw",
                                    e.target.checked
                                )
                            }
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
