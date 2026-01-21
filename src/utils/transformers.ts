// utils/transformers.ts
import type { FullAgentConfig } from "../lib/types/agentConfig";

/**
 * Converts a Twilio/Telephony agent config into a web-based config
 * for browser voice chat testing (e.g., in Agent Studio).
 * Safely maps audio formats, providers, and sampling rates.
 */
export function telephonyToWebConfig(
    teleConfig: FullAgentConfig,
    opts?: { targetSampleRate?: number; keepTelephonyMeta?: boolean }
): FullAgentConfig {
    const sampleRate = opts?.targetSampleRate ?? 16000;
    const keepMeta = opts?.keepTelephonyMeta ?? true;

    if (!teleConfig?.agent_config) return teleConfig;

    // Deep clone to avoid mutating original
    const cfg: FullAgentConfig = JSON.parse(JSON.stringify(teleConfig));

    cfg.agent_config.agent_type = "voice_web";
    cfg.agent_config.agent_name = `${cfg.agent_config.agent_name || "TelephonyAgent"}_webtest`;

    cfg.agent_config.tasks = (cfg.agent_config.tasks || []).map((task: any) => {
        const t = JSON.parse(JSON.stringify(task));

        t.toolchain = t.toolchain || {
            execution: "parallel",
            pipelines: [["transcriber", "llm", "synthesizer"]],
        };

        t.tools_config = t.tools_config || {};

        // 🎙️ INPUT
        const input = (t.tools_config.input = t.tools_config.input || {});
        if (input.provider === "twilio" || (input.format?.toLowerCase().includes("wav"))) {
            if (keepMeta) {
                t.tools_config.telephony_meta = t.tools_config.telephony_meta || {};
                t.tools_config.telephony_meta.input = {
                    provider: input.provider,
                    format: input.format,
                    sampling_rate: input.sampling_rate || null,
                };
            }
            input.provider = "default";
            input.format = `pcm_${sampleRate}`;
            input.sampling_rate = sampleRate;
        } else {
            input.format ||= `pcm_${sampleRate}`;
            input.sampling_rate ||= sampleRate;
        }

        // 🔊 OUTPUT
        const output = (t.tools_config.output = t.tools_config.output || {});
        if (output.provider === "twilio" || (output.format?.toLowerCase().includes("wav"))) {
            if (keepMeta) {
                t.tools_config.telephony_meta = t.tools_config.telephony_meta || {};
                t.tools_config.telephony_meta.output = {
                    provider: output.provider,
                    format: output.format,
                    sampling_rate: output.sampling_rate || null,
                };
            }
            output.provider = "default";
            output.format = `pcm_${sampleRate}`;
            output.sampling_rate = sampleRate;
        } else {
            output.format ||= `pcm_${sampleRate}`;
            output.sampling_rate ||= sampleRate;
        }

        // 🗣️ SYNTHESIZER
        const synth = (t.tools_config.synthesizer = t.tools_config.synthesizer || {});
        if (synth.audio_format?.toLowerCase().includes("wav")) {
            if (keepMeta) {
                t.tools_config.telephony_meta = t.tools_config.telephony_meta || {};
                t.tools_config.telephony_meta.synthesizer = {
                    audio_format: synth.audio_format,
                };
            }
            synth.audio_format = `pcm_${sampleRate}`;
        } else {
            synth.audio_format ||= `pcm_${sampleRate}`;
        }
        synth.sampling_rate ||= sampleRate;
        synth.buffer_size =
            typeof synth.buffer_size === "number" && synth.buffer_size > 80
                ? Math.max(16, Math.round((synth.buffer_size * 2) / 3))
                : synth.buffer_size || 40;
        synth.stream = true;

        // 🧠 LLM Agent
        const llm = (t.tools_config.llm_agent = t.tools_config.llm_agent || {});
        llm.agent_type ||= "simple_llm_agent";
        llm.agent_flow_type ||= "streaming";
        llm.llm_config = llm.llm_config || {};
        llm.llm_config.agent_flow_type ||= "streaming";
        llm.llm_config.family ||= "openai";

        // 🎧 TRANSCRIBER
        const tr = (t.tools_config.transcriber = t.tools_config.transcriber || {});
        tr.stream = true;
        tr.encoding ||= "linear16";
        tr.language ||= "en";
        tr.sampling_rate ||= sampleRate;

        // 🧩 Meta annotation
        t._web_test_metadata = {
            adapted_for: "web",
            sample_rate: sampleRate,
            timestamp: new Date().toISOString(),
        };

        return t;
    });

    return cfg;
}
