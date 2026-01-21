
import axios, { AxiosInstance } from 'axios';
import { CreateAgentPayload, AgentResponse, AgentListResponse, AgentConfig } from './types/bolna';

const bolnaApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BOLNA_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_BOLNA_API_KEY && {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOLNA_API_KEY}`,
    }),
  },
});

const bolnaPhoneApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BOLNA_TELEPHONE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_BOLNA_API_KEY && {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOLNA_API_KEY}`,
    }),
  },
});

export const createAgent = async (agentConfig: CreateAgentPayload): Promise<AgentResponse> => {
  try {
    const response = await bolnaApi.post<AgentResponse>('/agent', agentConfig);
    return response.data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

export const getAgent = async (agentId: string): Promise<AgentConfig> => {
  try {
    const response = await bolnaApi.get<AgentConfig>(`/agent/${agentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent:', error);
    throw error;
  }
};

export const getAllAgents = async (): Promise<AgentListResponse> => {
  try {
    const response = await bolnaApi.get<AgentListResponse>('/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

export const updateAgent = async (agentId: string, agentConfig: CreateAgentPayload): Promise<AgentResponse> => {
  try {
    const response = await bolnaApi.put<AgentResponse>(`/agent/${agentId}`, agentConfig);
    return response.data;
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
};

export const deleteAgent = async (agentId: string): Promise<AgentResponse> => {
  try {
    const response = await bolnaApi.delete<AgentResponse>(`/agent/${agentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
};

export const initiateCall342 = async (agentId: string, phoneNumber: string): Promise<{ status: string }> => {
  try {
    console.log('initiateCall', agentId, phoneNumber);
    const response = await bolnaPhoneApi.post<{ status: string }>(`/call/${agentId}`, { phone_number: phoneNumber });
    return response.data;
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
};




export const initiateCall = async (agentId: string, phoneNumber: string): Promise<{ status: string }> => {
  try {
    console.log('initiateCall', agentId, phoneNumber);
    const response = await bolnaPhoneApi.post<{ status: string }>(
      `/call`,
      { agent_id: agentId, recipient_phone_number: phoneNumber }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
};
