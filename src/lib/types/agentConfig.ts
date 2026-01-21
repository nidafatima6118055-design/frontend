// src/types/agentConfig.ts

export interface LLMConfig {
    model: string;
    max_tokens: number;
    family: string;
    temperature: number;
    request_json: boolean;
    stop?: string | null;
    top_k: number;
    top_p: number;
    min_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    provider: string;
    base_url?: string | null;
    routes?: any;
    agent_flow_type: "streaming" | "sequential";
    extraction_details?: any;
    summarization_details?: any;
}

export interface LlmAgentConfig {
    agent_flow_type: "streaming" | "sequential";
    agent_type: "simple_llm_agent" | string;
    routes?: any;
    llm_config: LLMConfig;
}

export interface SynthesizerConfig {
    provider: string;
    provider_config: {
        voice: string;
        voice_id: string;
        model: string;
        temperature: number;
        similarity_boost: number;
        speed: number;
        use_mulaw: boolean;
        audio_format: string;
    };
    stream: boolean;
    buffer_size: number;
    audio_format: string;
    sampling_rate: number;
    caching: boolean;
}

export interface TranscriberConfig {
    model: string;
    language: string;
    stream: boolean;
    sampling_rate: number;
    encoding: string;
    endpointing: number;
    keywords?: string[] | null;
    task: string;
    provider: string;
}

export interface InputOutputConfig {
    provider: string;
    format: string;
    sampling_rate: number;
}

export interface TaskConfig {
    optimize_latency: boolean;
    hangup_after_silence: number;
    incremental_delay: number;
    number_of_words_for_interruption: number;
    interruption_backoff_period: number;
    hangup_after_LLMCall: boolean;
    call_cancellation_prompt?: string | null;
    backchanneling: boolean;
    backchanneling_message_gap: number;
    backchanneling_start_delay: number;
    ambient_noise: boolean;
    ambient_noise_track: string;
    call_terminate: number;
    use_fillers: boolean;
    trigger_user_online_message_after: number;
    check_user_online_message: string;
    check_if_user_online: boolean;
    generate_precise_transcript: boolean;
}

export interface ToolchainConfig {
    execution: "parallel" | "sequential";
    pipelines: string[][];
}

export interface ToolsConfig {
    llm_agent: LlmAgentConfig;
    synthesizer: SynthesizerConfig;
    transcriber: TranscriberConfig;
    input: InputOutputConfig;
    output: InputOutputConfig;
    api_tools?: any | null;
}

export interface AgentTask {
    tools_config: ToolsConfig;
    toolchain: ToolchainConfig;
    task_type: "conversation" | string;
    task_config: TaskConfig;
}

export interface AgentConfig {
    agent_name: string;
    agent_type: string;
    agent_welcome_message: string;
    tasks: AgentTask[];
    assistant_status: "seeding" | "active" | "disabled";
}

export interface AgentPrompts {
    [task_id: string]: {
        system_prompt: string;
    };
}

export interface FullAgentConfig {
    agent_config: AgentConfig;
    agent_prompts: AgentPrompts;
}
