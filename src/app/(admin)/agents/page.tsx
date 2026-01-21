"use client";
import { useEffect, useState } from "react";
import { getAgents, deleteAgent } from "@/lib/api/api";
import { useRouter } from "next/navigation";

export default function AgentListPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchAgents() {
    try {
      const data = await getAgents();
      setAgents(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch agents:", err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this agent?")) return;
    try {
      await deleteAgent(id);
      await fetchAgents();
      alert("🗑️ Agent deleted successfully!");
    } catch {
      alert("❌ Failed to delete agent");
    }
  }

  useEffect(() => {
    fetchAgents();
  }, []);

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Agents</h2>
        <button
          onClick={() => router.push("/agents/new")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          ➕ Create New Agent
        </button>
      </div>

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

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Created At</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/agents/${a.id}`)}
                >
                  <td className="px-4 py-2 font-medium">{a.name}</td>
                  <td className="px-4 py-2">
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${a.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {a.status ?? "draft"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-2 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
