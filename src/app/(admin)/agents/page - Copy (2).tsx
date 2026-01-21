// app/agents/create/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";


import LLMConfigTab from "@/components/agent-studio/LLMConfigTab";
import SynthesizerConfigTab from "@/components/agent-studio/SynthesizerConfigTab";
import TranscriberConfigTab from "@/components/agent-studio/TranscriberConfigTab";
import TranscriberRoutingTab from "@/components/agent-studio/TranscriberRoutingTab";
import VoiceSettingsTab from "@/components/agent-studio/VoiceSettingsTab";
import AgentPromptsTab from "@/components/agent-studio/AgentPromptsTab";
import TaskConfigTab from "@/components/agent-studio/TaskConfigTab";
import AgentConfigPreviewTab from "@/components/agent-studio/AgentConfigPreviewTab";


import { FullAgentConfig } from "@/lib/types/agentConfig";


import { getAgents, createAgent, deleteAgent } from "@/lib/api/api";
import { getPhones, assignPhone, unassignPhone } from "@/lib/api/phones";
import TestAgentVoiceChat from "@/components/voicechat/TestAgentVoiceChat";

// export const metadata: Metadata = {
//   title: "Astound ai | Create Agent",
// };

type Agent = {
  id: string;
  name: string;
  language: string;
  voice: string;
  phone?: string | null;
  notes?: string;
};

const VOICES = [
  "American - female",
  "American - male",
  "British - female",
  "British - male",
];



export default function CreateAgentPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  // --- CORE AGENT INFO ---
  const [agentName, setAgentName] = useState("Chloe");
  const [agentLanguage, setAgentLanguage] = useState("English");
  const [voice, setVoice] = useState(VOICES[0]);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState<string | null>(null);

  // --- UNIFIED CONFIG ---
  const [config, setConfig] = useState<FullAgentConfig>({
    agent_config: {
      agent_name: "New Agent",
      agent_type: "voice_web",
      agent_welcome_message: "Hello there!",
      tasks: [
        {
          tools_config: {
            llm_agent: {
              agent_flow_type: "streaming",
              agent_type: "simple_llm_agent",
              routes: null,
              llm_config: {
                model: "gpt-4o-mini",
                max_tokens: 200,
                family: "openai",
                temperature: 0.1,
                request_json: true,
                stop: null,
                top_k: 0,
                top_p: 0.9,
                min_p: 0.1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                provider: "openai",
                base_url: "",
                routes: null,
                agent_flow_type: "streaming",
                extraction_details: null,
                summarization_details: null,
              },
            },
            synthesizer: {
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
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              stream: true,
              sampling_rate: 16000,
              encoding: "linear16",
              endpointing: 500,
              provider: "deepgram",
            },
            input: {
              provider: "default",
              format: "pcm_16000",
              sampling_rate: 16000,
            },
            output: {
              provider: "default",
              format: "pcm_16000",
              sampling_rate: 16000,
            },
          },
          toolchain: {
            execution: "parallel",
            pipelines: [["transcriber", "llm", "synthesizer"]],
          },
          task_type: "conversation",
          task_config: {
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
            check_user_online_message: "Hey, are you still there",
            check_if_user_online: true,
            generate_precise_transcript: false,
          },
        },
      ],
      assistant_status: "seeding",
    },
    agent_prompts: {
      task_1: {
        system_prompt:
          "You are Waqas, a helpful and knowledgeable software consultant specializing in SaaS app development and technology solutions...",
      },
    },
  });
  // --- DATA ---
  const [availablePhones, setAvailablePhones] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [activeAgent, setActiveAgent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.phone && a.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 🧠 Fetch phones & agents on load
  useEffect(() => {
    fetchPhones();
    fetchAgents();
  }, []);

  async function fetchPhones() {
    try {
      const data = await getPhones();
      setAvailablePhones(data.phones || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchAgents() {
    try {
      const data = await getAgents();
      setAgents(data || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteAgent(agent: any) {
    if (!confirm(`Are you sure you want to delete "${agent.name}"?`)) return;
    try {
      await deleteAgent(agent.id);  // ✅ now deletes by local id
      await fetchAgents();
      alert("🗑️ Agent deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete agent");
    }
  }





  // 🧠 Save (Create or Update)
  async function handleSaveAgent() {
    setIsSaving(true);
    try {
      const payload = {
        name: agentName,
        description: notes,
        agent_config: config.agent_config,
        agent_prompts: config.agent_prompts,
      };

      if (activeAgent?.bolna_agent_id) {
        // update existing agent
        await updateAgent(activeAgent.bolna_agent_id, payload);
        alert("✅ Agent updated successfully!");
      } else {
        // create new agent
        await createAgent(payload);
        alert("✅ Agent created successfully!");
      }

      fetchAgents();
      setActiveTab(0);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save agent");
    } finally {
      setIsSaving(false);
    }
  }

  
  // 🧠 Load agent config into editor
  function handleAgentClick(agent: any) {
    console.log("🧠 Loading selected agent:", agent);

    // Try to pull full config (prefer from backend if bolna_config exists)
    const bolnaConfig = agent.bolna_config || agent.agent_config;

    if (!bolnaConfig) {
      alert("⚠️ This agent has no config data.");
      return;
    }

    // Set into unified config structure
    setConfig({
      agent_config: bolnaConfig.agent_config || bolnaConfig,
      agent_prompts: bolnaConfig.agent_prompts || agent.agent_prompts || {},
    });

    // Update top-level info
    setAgentName(agent.name);
    setNotes(agent.description || "");
    setActiveAgent(agent);

    // Switch to “Agent Info” or “LLM Config” tab automatically
    setActiveTab(3);
  }





  // 🧠 Keep config name synced
  useEffect(() => {
    setConfig((prev) => {
      if (!prev?.agent_config) return prev; // 👈 prevent crash
      return {
        ...prev,
        agent_config: { ...prev.agent_config, agent_name: agentName },
      };
    });
  }, [agentName]);


  // --- UI ---
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Agent Studio" />

      {/* Tabs */}
      <div className="bg-white rounded-md shadow-sm p-3">
        <nav className="flex flex-wrap gap-2">
          {[
            "Agents",
            "Agent Info",
            // "Config Preview",
            "LLM Config",
            "Synthesizer Config",
            "Transcriber Config",
            "Task Config",
            "Prompts",
          ].map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === i
                ? "bg-white border border-gray-200 shadow"
                : "text-gray-500"
                }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* 🧠 Table with clickable rows */}
          {activeTab === 0 && (
            <section className="bg-white border rounded-md p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">My Agents</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    onClick={fetchAgents}
                    className="px-3 py-2 text-sm bg-gray-100 border rounded hover:bg-gray-200"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-md">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Bolna ID</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Created</th>
                      <th className="text-right px-4 py-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.length > 0 ? (
                      filteredAgents.map((a) => (
                        <tr
                          key={a.id}
                          onClick={() => handleAgentClick(a)}
                          className="border-b hover:bg-indigo-50 cursor-pointer transition"
                        >
                          <td className="px-4 py-2 font-medium">{a.name}</td>
                          <td className="px-4 py-2">
                            {a.bolna_config?.agent_config?.assistant_status ?? "draft"}
                          </td>
                          <td className="px-4 py-2">{a.bolna_agent_id ?? "—"}</td>
                          <td className="px-4 py-2 text-gray-500 text-sm">
                            {new Date(a.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-right space-x-2">
                            <button
                              onClick={() => handleDeleteAgent(a)}
                              className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500 py-6">
                          No agents found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Other Tabs */}
          {activeTab === 1 && (
            <section className="bg-white border rounded-md p-6 space-y-4">
              <h3 className="text-lg font-semibold">
                {activeAgent ? "Edit Agent Info" : "Create New Agent"}
              </h3>

              <label className="block text-sm font-medium">Name</label>
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <label className="block text-sm font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border rounded-md px-3 py-2"
              />

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={handleSaveAgent}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : activeAgent ? "Update Agent" : "Create Agent"}
              </button>
            </section>
          )}

          {/* {activeTab === 2 && <AgentConfigPreviewTab config={config} />} */}
          {activeTab === 2 && <LLMConfigTab config={config} setConfig={setConfig} />}
          {activeTab === 3 && <SynthesizerConfigTab config={config} setConfig={setConfig} />}
          {activeTab === 4 && <TranscriberConfigTab config={config} setConfig={setConfig} />}
          {activeTab === 5 && <TaskConfigTab config={config} setConfig={setConfig} />}
          {activeTab === 6 && <AgentPromptsTab config={config} setConfig={setConfig} />}
        </div>

        {/* Right Panel */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-white border rounded-md p-6 flex flex-col items-center gap-6">
            <h4 className="text-lg font-semibold">Preview</h4>
            {activeAgent?.bolna_agent_id && (
              <TestAgentVoiceChat agentId={activeAgent.bolna_agent_id} />
            )}
            <div className="text-sm text-gray-500">
              Assigned phone: {phone ?? "None"}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

