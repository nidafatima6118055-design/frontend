"use client";
import { useEffect, useState } from "react";
import { FullAgentConfig } from "@/lib/types/agentConfig";
import { TaskConfig } from "@/lib/types/agentConfig";

type Props = {
    config: FullAgentConfig;
    setConfig: React.Dispatch<React.SetStateAction<FullAgentConfig>>;
};



function assignIfUndefined<T, K extends keyof T>(
    target: T,
    source: T,
    key: K
) {
    if (target[key] === undefined) {
        target[key] = source[key];
    }
}


export default function TaskConfigTab({ config, setConfig }: Props) {


    const defaultTaskConfig: TaskConfig = {
        optimize_latency: true,
        hangup_after_silence: 60,
        incremental_delay: 900,
        number_of_words_for_interruption: 1,
        interruption_backoff_period: 100,
        hangup_after_LLMCall: false,
        call_cancellation_prompt: null,
        backchanneling: false,
        backchanneling_message_gap: 5,
        backchanneling_start_delay: 5,
        ambient_noise: false,
        ambient_noise_track: "convention_hall",
        call_terminate: 90,
        use_fillers: false,
        trigger_user_online_message_after: 30,
        check_user_online_message: "Hey, are you still there?",
        check_if_user_online: true,
        generate_precise_transcript: false,
    };

    // 🧱 Utility: Ensure structure exists (just like ensureLLMExists)
    const ensureTaskExists = (cfg: FullAgentConfig) => {
        const newCfg = structuredClone(cfg);

        if (!newCfg.agent_config)
            newCfg.agent_config = {} as any;

        if (!Array.isArray(newCfg.agent_config.tasks))
            newCfg.agent_config.tasks = [] as any;

        if (!newCfg.agent_config.tasks[0])
            newCfg.agent_config.tasks[0] = {} as any;

        if (!newCfg.agent_config.tasks[0].task_config)
            newCfg.agent_config.tasks[0].task_config = { ...defaultTaskConfig };

        return newCfg;
    };


    // 🧠 Merge defaults into task config (only missing fields)
    useEffect(() => {
        setConfig((prev) => {
            const newCfg = ensureTaskExists(prev);
            const taskCfg = newCfg.agent_config.tasks[0].task_config;

            (Object.keys(defaultTaskConfig) as (keyof TaskConfig)[]).forEach((key) => {
                assignIfUndefined(taskCfg, defaultTaskConfig, key);
            });

            return newCfg;
        });
    }, [setConfig]);



    const safeCfg = ensureTaskExists(config);
    const task = safeCfg.agent_config.tasks[0].task_config;

    const update = (path: string, value: any) => {
        setConfig((prev) => {
            const newCfg = ensureTaskExists(prev);
            const keys = path.split(".");
            let obj: any = newCfg;
            while (keys.length > 1) obj = obj[keys.shift()!];
            obj[keys[0]] = value;
            return newCfg;
        });
    };

    // 🧩 UI rendering
    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">
                Task (Conversation) Configuration
            </h3>
            <p className="text-sm text-gray-500 mb-3">
                Tune your agent’s real-time behavior — control latency, interruption
                handling, and user engagement.
            </p>

            {/* ⚙ Latency & Interruption */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Latency & Interruption</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={task.optimize_latency}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.optimize_latency",
                                    e.target.checked
                                )
                            }
                        />
                        <label className="text-sm font-medium">Optimize Latency</label>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Incremental Delay (ms)</label>
                        <input
                            type="number"
                            value={task.incremental_delay}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.incremental_delay",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Words for Interruption</label>
                        <input
                            type="number"
                            value={task.number_of_words_for_interruption}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.number_of_words_for_interruption",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Backoff Period (ms)</label>
                        <input
                            type="number"
                            value={task.interruption_backoff_period}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.interruption_backoff_period",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </section>

            {/* 🗣️ User Engagement */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">User Engagement</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={task.check_if_user_online}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.check_if_user_online",
                                    e.target.checked
                                )
                            }
                        />
                        <label className="text-sm font-medium">
                            Check if user is still online
                        </label>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Trigger Check (s)</label>
                        <input
                            type="number"
                            value={task.trigger_user_online_message_after}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.trigger_user_online_message_after",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Check Message</label>
                        <input
                            type="text"
                            value={task.check_user_online_message}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.check_user_online_message",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </section>

            {/* 📞 Call Control */}
            <section className="bg-white border rounded-md p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Call Termination & Fallback</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Hangup After Silence (s)</label>
                        <input
                            type="number"
                            value={task.hangup_after_silence}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.hangup_after_silence",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Call Terminate (s)</label>
                        <input
                            type="number"
                            value={task.call_terminate}
                            onChange={(e) =>
                                update(
                                    "agent_config.tasks.0.task_config.call_terminate",
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
