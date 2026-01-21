// components/AgentManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { createAgent, getAllAgents, initiateCall } from '../../lib/bolnaClient';
import { CreateAgentPayload, AgentListResponse } from '../../lib/types/bolna';
import VoiceChat from '../voicechat/VoiceChat';

export default function AgentManager() {
    const [agents, setAgents] = useState<AgentListResponse['agents']>([]);
    const [agentName, setAgentName] = useState<string>('');
    const [welcomeMessage, setWelcomeMessage] = useState<string>('');
    const [selectedAgentId, setSelectedAgentId] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleCreateAgent = async () => {
        const agentConfig: CreateAgentPayload = {
            agent_config: {
                agent_name: agentName,
                agent_type: 'other',
                agent_welcome_message: welcomeMessage,
                tasks: [
                    {
                        task_type: 'conversation',
                        toolchain: {
                            execution: 'parallel',
                            pipelines: [['transcriber', 'llm', 'synthesizer']],
                        },
                        tools_config: {
                            input: { format: 'wav', provider: 'default' },
                            llm_agent: {
                                agent_type: 'simple_llm_agent',
                                agent_flow_type: 'streaming',
                                llm_config: { provider: 'openai', model: 'gpt-4o-mini' },
                            },
                            output: { format: 'wav', provider: 'default' },
                            synthesizer: {
                                audio_format: 'wav',
                                provider: 'elevenlabs',
                                stream: true,
                                provider_config: {
                                    voice: 'George',
                                    model: 'eleven_turbo_v2_5',
                                    voice_id: 'JBFqnCBsd6RMkjVDRZzb',
                                },
                            },
                            transcriber: {
                                encoding: 'linear16',
                                language: 'en',
                                provider: 'deepgram',
                                stream: true,
                            },
                        },
                        task_config: { hangup_after_silence: 30.0 },
                    },
                ],
            },
            agent_prompts: {
                task_1: {
                    system_prompt: 'Why Do We Fall, Sir? So That We Can Learn To Pick Ourselves Up.',
                },
            },
        };

        try {
            const result = await createAgent(agentConfig);
            setSelectedAgentId(result.agent_id);
            alert(`Agent created with ID: ${result.agent_id}`);
            fetchAgents();
        } catch (error) {
            console.error('Failed to create agent:', error);
            alert('Failed to create agent');
        }
    };

    const fetchAgents = async () => {
        try {
            const result = await getAllAgents();
            setAgents(result.agents);
        } catch (error) {
            console.error('Failed to fetch agents:', error);
            alert('Failed to fetch agents');
        }
    };

    const handleInitiatePhoneCall = async () => {
        if (!selectedAgentId || !phoneNumber) {
            alert('Please select an agent and enter a phone number');
            return;
        }
        try {
            const result = await initiateCall(selectedAgentId, phoneNumber);
            alert(`Call initiated: ${result.status}`);
        } catch (error) {
            console.error('Failed to initiate call:', error);
            alert('Failed to initiate call');
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Voice Agent Manager</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Agent Name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="border p-2 flex-1"
                />
                <input
                    type="text"
                    placeholder="Welcome Message"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="border p-2 flex-1"
                />
                <button onClick={handleCreateAgent} className="bg-blue-500 text-white p-2 rounded">
                    Create Agent
                </button>
                <button onClick={fetchAgents} className="bg-gray-500 text-white p-2 rounded">
                    Refresh List
                </button>
            </div>
            <table className="w-full border-collapse mb-4">
                <thead>
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {agents.map((agent) => (
                        <tr key={agent.agent_id}>
                            <td className="border p-2">{agent.agent_id}</td>
                            <td className="border p-2">{agent.data.agent_name}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => setSelectedAgentId(agent.agent_id)}
                                    className="bg-blue-300 text-white p-1 rounded"
                                >
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedAgentId && (
                <div className="mt-4">
                    <h2 className="text-xl mb-2">Selected Agent: {selectedAgentId}</h2>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Phone Number for Twilio Call"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="border p-2 flex-1"
                        />
                        <button onClick={handleInitiatePhoneCall} className="bg-green-500 text-white p-2 rounded">
                            Start Phone Call
                        </button>
                    </div>
                    <h3 className="text-lg mb-2">Browser Voice Chat</h3>
                    <VoiceChat agentId={selectedAgentId} />
                </div>
            )}
        </div>
    );
}