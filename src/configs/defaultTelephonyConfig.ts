// src/configs/defaultTelephonyConfig.ts

import { FullAgentConfig } from "@/lib/types/agentConfig";


export const defaultTelephonyConfig = (agentName: string): FullAgentConfig => ({
    agent_config: {
        agent_name: agentName,
        agent_type: "other",
        agent_welcome_message: "Hello there! How are you doing today?",
        tasks: [
            {
                task_type: "conversation",
                toolchain: {
                    execution: "parallel",
                    pipelines: [["transcriber", "llm", "synthesizer"]],
                },
                tools_config: {
                    // 🎙️ Telephony input/output
                    input: {
                        format: "wav",
                        provider: "twilio",
                        sampling_rate: 8000,
                    },
                    output: {
                        format: "wav",
                        provider: "twilio",
                        sampling_rate: 8000,
                    },

                    // 🧠 LLM Agent
                    llm_agent: {
                        agent_type: "simple_llm_agent",
                        agent_flow_type: "streaming",
                        routes: null,
                        llm_config: {
                            agent_flow_type: "streaming",
                            provider: "openai",
                            model: "gpt-4o-mini",
                            request_json: true,
                            temperature: 0.3,
                            top_p: 0.9,
                            top_k: 0,
                            min_p: 0.1,
                            max_tokens: 200,
                            frequency_penalty: 0.0,
                            presence_penalty: 0.0,
                            family: "openai",
                            base_url: null,
                        },
                    },

                    // 🎧 Synthesizer
                    synthesizer: {
                        audio_format: "wav",
                        provider: "elevenlabs",
                        stream: true,
                        buffer_size: 100,
                        sampling_rate: 8000,
                        caching: true,
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
                    },

                    // 🗣️ Transcriber
                    transcriber: {
                        encoding: "linear16",
                        language: "en",
                        provider: "deepgram",
                        stream: true,
                        model: "nova-2",
                        sampling_rate: 8000,
                        endpointing: 500,
                        task: "transcribe",
                    },

                    api_tools: null,
                },

                // ⚙️ Task-level Config
                task_config: {
                    hangup_after_silence: 30.0,
                    optimize_latency: true,
                    incremental_delay: 900,
                    number_of_words_for_interruption: 1,
                    interruption_backoff_period: 100,
                    hangup_after_LLMCall: false,
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
                },
            },
        ],
        assistant_status: "seeding",
    },

    // 🧩 Prompts
    agent_prompts: {
        task_1: {
            system_prompt:
                "You are Waqas, a helpful and knowledgeable software consultant specializing in SaaS app development and technology solutions. Your job is to engage with clients and prospects who are looking to build or improve their digital products. You assist them by understanding their business goals, clarifying technical requirements, and suggesting suitable software solutions. Focus areas include web applications, API integrations, automation, and cloud-based SaaS platforms. Start by greeting the client, confirming their name, introducing yourself, and guiding them through discovery and solution planning. Keep your tone friendly, professional, and clear.",
        },
    },
});



// const defaultConfigForWeb: FullAgentConfig = {
//     agent_config: {
//         agent_name: agentName,
//         agent_type: "voice_web",
//         agent_welcome_message: "Hello Paul! How are you doing today",
//         tasks: [
//             {
//                 tools_config: {
//                     llm_agent: {
//                         agent_flow_type: "streaming",
//                         agent_type: "simple_llm_agent",
//                         routes: null,
//                         llm_config: {
//                             model: "gpt-4o-mini",
//                             max_tokens: 200,
//                             family: "openai",
//                             temperature: 0.1,
//                             request_json: true,
//                             stop: null,
//                             top_k: 0,
//                             top_p: 0.9,
//                             min_p: 0.1,
//                             frequency_penalty: 0.0,
//                             presence_penalty: 0.0,
//                             provider: "openai",
//                             base_url: null,
//                             routes: null,
//                             agent_flow_type: "streaming",
//                             extraction_details: null,
//                             summarization_details: null,
//                         },
//                     },
//                     synthesizer: {
//                         provider: "elevenlabs",
//                         provider_config: {
//                             voice: "George",
//                             voice_id: "JBFqnCBsd6RMkjVDRZzb",
//                             model: "eleven_turbo_v2_5",
//                             temperature: 0.5,
//                             similarity_boost: 0.5,
//                             speed: 1.0,
//                             use_mulaw: false,
//                             audio_format: "pcm_16000",
//                         },
//                         stream: true,
//                         buffer_size: 40,
//                         audio_format: "pcm_16000",
//                         sampling_rate: 16000,
//                         caching: true,
//                     },
//                     transcriber: {
//                         model: "nova-2",
//                         language: "en",
//                         stream: true,
//                         sampling_rate: 16000,
//                         encoding: "linear16",
//                         endpointing: 500,
//                         provider: "deepgram",
//                         task: "transcribe",
//                         keywords: null
//                     },
//                     input: {
//                         provider: "default",
//                         format: "pcm_16000",
//                         sampling_rate: 16000,
//                     },
//                     output: {
//                         provider: "default",
//                         format: "pcm_16000",
//                         sampling_rate: 16000,
//                     },
//                     "api_tools": null
//                 },
//                 toolchain: {
//                     execution: "parallel",
//                     pipelines: [["transcriber", "llm", "synthesizer"]],
//                 },
//                 task_type: "conversation",
//                 task_config: {
//                     optimize_latency: true,
//                     hangup_after_silence: 60,
//                     incremental_delay: 900,
//                     number_of_words_for_interruption: 1,
//                     interruption_backoff_period: 100,
//                     hangup_after_LLMCall: false,
//                     call_cancellation_prompt: null,
//                     backchanneling: false,
//                     backchanneling_message_gap: 5,
//                     backchanneling_start_delay: 5,
//                     ambient_noise: false,
//                     ambient_noise_track: "convention_hall",
//                     call_terminate: 90,
//                     use_fillers: false,
//                     trigger_user_online_message_after: 30,
//                     check_user_online_message: "Hey, are you still there",
//                     check_if_user_online: true,
//                     generate_precise_transcript: false,
//                 },
//             },
//         ],
//         assistant_status: "seeding",
//     },
//     agent_prompts: {
//         task_1: {
//             system_prompt:
//                 "You are Waqas, a helpful and knowledgeable software consultant specializing in SaaS app development and technology solutions...",
//         },
//     },
// };
