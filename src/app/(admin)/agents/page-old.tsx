// app/agents/create/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import InputGroup from "@/components/form/form-elements/InputGroup";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import InputStates from "@/components/form/form-elements/InputStates";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { Metadata } from "next";





// import { getAgents, createAgent } from "@/lib/api/agents";
import { getAgents, createAgent } from "@/lib/api/api";
import { getPhones, assignPhone, unassignPhone } from "@/lib/api/phones";
import TestAgentVoiceChat from "@/components/voicechat/TestAgentVoiceChat";
import { useAuthStore } from "@/store/auth";

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
  // tabs: 0=Agent Info,1=Business Info,2=Knowledge Base,3=Appointment,4=Call Routing
  const [activeTab, setActiveTab] = useState<number>(0);

  // form state
  const [name, setName] = useState<string>("Chloe");
  const [language, setLanguage] = useState<string>("English");
  const [voice, setVoice] = useState<string>(VOICES[0]);
  const [notes, setNotes] = useState<string>("");
  const [phone, setPhone] = useState<string | null>(null);

  // data
  const [availablePhones, setAvailablePhones] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const previewAgent = 'dfe31cf3-f9f4-473b-bfd0-8ec413915210';//agents[0]; // or the selected agent

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

  async function handleAssignPhone(phoneNumber: string) {
    try {
      await assignPhone(phoneNumber);
      setPhone(phoneNumber);
      fetchPhones();
      alert("Phone assigned.");
    } catch {
      alert("Failed to assign phone");
    }
  }

  async function handleUnassignPhone() {
    if (!phone) return;
    try {
      await unassignPhone(phone);
      setPhone(null);
      fetchPhones();
      alert("Phone unassigned.");
    } catch {
      alert("Failed to unassign phone");
    }
  }

  async function handleSaveAgent() {
    setIsSaving(true);
    try {
      const agent = await createAgent({ name, language, voice, phone, notes });
      setAgents((p) => [agent, ...p]);
      alert("Agent created.");
    } catch {
      alert("Failed to create agent");
    } finally {
      setIsSaving(false);
    }
  }



  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Create Agent" />

      {/* Tabs */}
      <div className="bg-white rounded-md shadow-sm p-3">
        <nav className="flex gap-2">
          {["Agents", "Agent Info", "Business Info", "Knowledge Base", "Appointment Settings", "Call Routing"].map(
            (t, i) => (
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
            )
          )}
        </nav>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Agents */}

          {activeTab === 0 && (
            <div className="space-y-6">
              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">My Agents</h3>
              </section>
              <section className="bg-white border rounded-md p-6">
                {/* Agent list (simple) */}
                <div className="bg-white border rounded-md p-4">
                  <h4 className="font-semibold mb-3">Agents</h4>
                  <ul className="space-y-2">
                    {agents.length === 0 && <li className="text-sm text-gray-500">No agents yet</li>}
                    {agents.map((a) => (
                      <li
                        className="flex justify-between items-center border rounded px-3 py-2"
                        key={a.id}
                      >
                        <div>
                          <div className="font-medium">{a.name}</div>
                          <div className="text-sm text-gray-500">
                            {a.description || "—"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{a.phone ?? "—"}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          )}



          {/* Agent Info tab content */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">Agent Identity</h3>
                <p className="text-sm text-gray-500 mb-4">Choose your preferred voice for your agent and provide some script notes.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Agent Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Agent name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Agent Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Agent Voice</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={voice}
                          onChange={(e) => setVoice(e.target.value)}
                          className="flex-1 border rounded-md px-3 py-2"
                        >
                          {VOICES.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => alert(`Play voice sample for ${voice}`)}
                          className="px-3 py-2 border rounded-md text-sm"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Script / Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Script notes for the agent"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">Assign Phone Number</h3>
                <p className="text-sm text-gray-500 mb-4">Link a phone number and activate your agent.</p>

                <div className="flex items-center gap-4">
                  <select
                    value={phone ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      // if selecting an available phone, assign it
                      if (val) handleAssignPhone(val);
                    }}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="">{phone ? phone : "Select number to assign"}</option>
                    {availablePhones.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  {phone && (
                    <>
                      <span className="text-sm text-red-600 cursor-pointer" onClick={handleUnassignPhone}>
                        Unassign
                      </span>
                      <span className="ml-auto text-sm text-gray-500">Linking a number activates the AI agent to start handling calls for your business.</span>
                    </>
                  )}
                </div>
              </section>

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                  onClick={handleSaveAgent}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Agent"}
                </button>
                <button
                  className="px-4 py-2 border rounded-md"
                  onClick={() => {
                    setName("");
                    setLanguage("English");
                    setVoice(VOICES[0]);
                    setNotes("");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Business Info tab (static placeholder + use imported components as examples) */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">Business Info</h3>
                <p className="text-sm text-gray-500 mb-4">Company / business details</p>
                <DefaultInputs />
                <TextAreaInput />
              </section>
            </div>
          )}

          {/* Knowledge Base tab */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">Knowledge Base</h3>
                <p className="text-sm text-gray-500 mb-4">Upload docs, or paste knowledge for your agent</p>
                <DropzoneComponent />
                {/* <FileInputExample /> */}
              </section>
            </div>
          )}

          {/* Appointment Settings tab */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">Appointment Settings</h3>
                <p className="text-sm text-gray-500 mb-4">Configure scheduling, timezones and availability.</p>
                <InputGroup />
                <ToggleSwitch />
              </section>
            </div>
          )}

          {/* Call Routing tab */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <section className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-semibold">Call Routing</h3>
                <p className="text-sm text-gray-500 mb-4">Configure how calls are routed to your agents.</p>
                <SelectInputs />
                <RadioButtons />
                <InputStates />
              </section>
            </div>
          )}
        </div>

        {/* Right preview / test panel */}



        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-white border rounded-md p-6 flex flex-col items-center gap-6">
            <div className="w-full text-left">
              <h4 className="text-lg font-semibold">Preview</h4>
              <p className="text-sm text-gray-500">Test your agent voice and behavior.</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white to-white/80 drop-shadow-md flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow" style={{ border: "2px solid rgba(79,70,229,0.12)" }}>
                  {/* SVG Avatar */}
                </div>
              </div>
              {previewAgent && (
                <TestAgentVoiceChat agentId={previewAgent} />
              )}
            </div>

            {/* Quick info */}
            <div className="w-full">
              <h5 className="text-sm font-semibold">Assigned Phone</h5>
              <div className="mt-2">
                {phone ? (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{phone}</span>
                    <button className="text-sm text-red-600" onClick={handleUnassignPhone}>Unassign</button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No phone assigned</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>


    </div>
  );
}
