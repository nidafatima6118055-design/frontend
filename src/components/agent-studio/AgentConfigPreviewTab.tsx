"use client";
import { useState, useEffect } from "react";
import { FullAgentConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
};

export default function AgentConfigPreviewTab({ config }: Props) {
    const [json, setJson] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Automatically pretty-print JSON whenever config changes
        setJson(JSON.stringify(config, null, 2));
    }, [config]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            alert("❌ Failed to copy to clipboard.");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Agent Config Preview</h3>
            <p className="text-sm text-gray-500 mb-3">
                Review your full <code>agent_config</code> and <code>agent_prompts</code> JSON.
                This is exactly what will be sent to your backend API.
            </p>

            <section className="relative bg-gray-900 rounded-md border border-gray-800 overflow-hidden">
                {/* Toolbar */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="px-2 py-1 text-xs rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700"
                    >
                        {copied ? "✅ Copied!" : "📋 Copy JSON"}
                    </button>
                </div>

                {/* Pretty JSON display */}
                <pre className="text-xs text-green-300 whitespace-pre-wrap p-4 overflow-auto max-h-[70vh] font-mono leading-relaxed">
                    {json}
                </pre>
            </section>

            <section className="bg-gray-50 border rounded-md p-4">
                <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>
                        This JSON is dynamically generated from your Agent Studio tabs (LLM, Synthesizer, etc.).
                    </li>
                    <li>
                        You can copy it and send directly to your backend for debugging or validation.
                    </li>
                    <li>
                        When you click <strong>Save Agent</strong>, this configuration is posted to the backend.
                    </li>
                </ul>
            </section>
        </div>
    );
}
