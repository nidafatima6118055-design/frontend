"use client";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};

export default function TranscriberRoutingTab({ config, setConfig }: Props) {
    const transcriber = config.agent_config.tasks[0].tools_config.transcriber;
    const input = config.agent_config.tasks[0].tools_config.input;
    const output = config.agent_config.tasks[0].tools_config.output;
    const toolchain = config.agent_config.tasks[0].toolchain;

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

    return (
        <div className="space-y-5">
            <h3 className="font-semibold text-gray-800">Speech-to-Text & Routing</h3>
            <p className="text-sm text-gray-500 mb-3">
                Configure real-time transcription, input/output audio formats, and pipeline routing between components.
            </p>

            {/* 🔊 Transcriber */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Transcriber (Deepgram)</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Model</label>
                        <select
                            value={transcriber.model}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.transcriber.model", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="nova-2">Nova 2 (Default)</option>
                            <option value="enhanced">Enhanced</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Language</label>
                        <select
                            value={transcriber.language}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.transcriber.language", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Endpointing (ms)</label>
                        <input
                            type="number"
                            value={transcriber.endpointing}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.transcriber.endpointing", parseInt(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Streaming</label>
                        <select
                            value={String(transcriber.stream)}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.transcriber.stream", e.target.value === "true")}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 🎧 Input / Output */}
            <section className="bg-white border rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Input / Output Audio</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Input Format</label>
                        <input
                            type="text"
                            value={input.format}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.input.format", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Input Sampling Rate</label>
                        <input
                            type="number"
                            value={input.sampling_rate}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.input.sampling_rate", parseInt(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Output Format</label>
                        <input
                            type="text"
                            value={output.format}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.output.format", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Output Sampling Rate</label>
                        <input
                            type="number"
                            value={output.sampling_rate}
                            onChange={(e) => update("agent_config.tasks.0.tools_config.output.sampling_rate", parseInt(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </section>

            {/* 🔁 Routing */}
            <section className="bg-white border rounded-md p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Toolchain Routing</h4>
                <p className="text-sm text-gray-500">
                    Defines the order of components (e.g. transcriber → LLM → synthesizer).
                </p>

                <div>
                    <label className="text-sm font-medium">Pipeline</label>
                    <input
                        type="text"
                        value={toolchain.pipelines[0].join(" → ")}
                        onChange={(e) =>
                            update(
                                "agent_config.tasks.0.toolchain.pipelines",
                                [e.target.value.split("→").map((s) => s.trim().toLowerCase())]
                            )
                        }
                        className="w-full border rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Example: <code>transcriber → llm → synthesizer</code>
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium">Execution Mode</label>
                    <select
                        value={toolchain.execution}
                        onChange={(e) => update("agent_config.tasks.0.toolchain.execution", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="parallel">Parallel</option>
                        <option value="sequential">Sequential</option>
                    </select>
                </div>
            </section>
        </div>
    );
}
