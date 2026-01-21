// src/lib/api/bolna.ts
import axios, { AxiosError } from 'axios';

// Define the AgentData and Agent interfaces
interface AgentData {
  agent_name: string;
  agent_type: string;
  tasks: Array<{
    tools_config: {
      llm_agent: any;
      synthesizer: any;
      transcriber: any;
      input: any;
      output: any;
      api_tools: any;
    };
    toolchain: any;
    task_type: string;
    task_config: any;
  }>;
  agent_welcome_message: string;
  assistant_status: string;
}

interface Agent {
  agent_id: string;
  data: AgentData;
}

interface AgentsResponse {
  agents: Agent[];
}

// types/bolna.ts


export interface AgentConfig {
  agent_name: string;
  agent_type: string;
  agent_welcome_message: string;
  tasks: Array<{
    task_type: string;
    toolchain: {
      execution: string;
      pipelines: string[][];
    };
    tools_config: {
      input: { format: string; provider: string };
      llm_agent: {
        agent_type: string;
        agent_flow_type: string;
        llm_config: { provider: string; model: string };
      };
      output: { format: string; provider: string };
      synthesizer: {
        audio_format: string;
        provider: string;
        stream: boolean;
        provider_config: { voice: string; model: string; voice_id: string };
      };
      transcriber: {
        encoding: string;
        language: string;
        provider: string;
        stream: boolean;
      };
    };
    task_config: { hangup_after_silence: number };
  }>;
}

export interface AgentPrompts {
  [key: string]: { system_prompt: string };
}

export interface CreateAgentPayload {
  agent_config: AgentConfig;
  agent_prompts: AgentPrompts;
}

export interface AgentResponse {
  agent_id: string;
  state: string;
}

export interface AgentListResponse {
  agents: Array<{ agent_id: string; data: AgentConfig }>;
}

export interface WebSocketMessage {
  type: string;
  data?: string;
}


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BOLNA_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOLNA_API_KEY}`,
  },
});

export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await api.get<AgentsResponse>('/all');
    return response.data.agents; // Extract the agents array
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching agents from Bolna:', axiosError.message);
    throw axiosError;
  }
};

export const createAgent = async (agentConfig: { name: string; prompt: string; provider: string }): Promise<Agent> => {
  try {
    const response = await api.post<Agent>('/agents', agentConfig);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error creating agent:', axiosError.message);
    throw axiosError;
  }
};

// Define a basic response type (adjust based on Bolna's API)
interface CallResponse {
  id: string;
  status: string;
  // Add other fields as needed
}

export const initiateCall = async (callData: { agentId: string; phoneNumber: string }): Promise<CallResponse> => {
  try {
    const response = await api.post<CallResponse>('/calls', callData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error initiating call:', axiosError.message);
    throw axiosError;
  }
};