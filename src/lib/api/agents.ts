const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
    credentials: "include", // 👈 important
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed: ${res.status} - ${errorText}`);
  }

  return res.json();
}


const API_BASE = "/api/agents/";

export type Agent = {
  id: string;
  name: string;
  language: string;
  voice: string;
  phone?: string | null;
  notes?: string;
};

export async function getAgents() {
  return request(API_BASE, { method: "GET", credentials: "include" });
}

export async function createAgent(data: {
  name: string;
  language: string;
  voice: string;
  phone?: string | null;
  notes?: string;
}) {
  const payload = {
    name: data.name,
    description: `Language: ${data.language}, Voice: ${data.voice}`,
    system_prompt: data.notes || "You are a helpful AI assistant."
  };

  return request(API_BASE, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include"
  });
}
