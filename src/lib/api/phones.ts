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

const API_BASE = "/api/phones/";




export async function getPhones() {
    return request(API_BASE, { method: "GET", credentials: "include" });
}

export async function assignPhone(phone: string) {
    return request(API_BASE + "assign/", {
        method: "POST",
        body: JSON.stringify({ phone }),
        credentials: "include"
    });
}

export async function unassignPhone(phone: string) {
    return request(API_BASE + "unassign/", {
        method: "POST",
        body: JSON.stringify({ phone }),
        credentials: "include"
    });
}
